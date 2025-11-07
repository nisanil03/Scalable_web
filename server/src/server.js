import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { tasksRouter } from './routes/tasks.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/error.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { timeout } from './middleware/timeout.js';

dotenv.config();

const app = express();

// CORS allowlist (comma-separated origins) or *
const origins = (process.env.CORS_ORIGIN || '*')
	.split(',')
	.map((o) => o.trim())
	.filter(Boolean);
app.use(
	cors({
		origin: origins.length === 1 && origins[0] === '*' ? '*' : origins,
		credentials: true,
	})
);
app.use(helmet({
	contentSecurityPolicy: false,
}));
// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Apply timeout to all requests
app.use(timeout(30)); // 30 second timeout

// Add request ID for tracking
app.use((req, res, next) => {
    req.id = Math.random().toString(36).substring(7);
    res.setHeader('X-Request-ID', req.id);
    next();
});

// NOTE: Serving of '/uploads' has been removed to disable serving user-uploaded avatars.
// If you need static assets, add them to the web/public folder or re-enable static serving intentionally.

import { PlatformError } from './middleware/platformErrors.js';

app.get('/api/health', (_req, res, next) => {
    // Example: Simulate a platform error based on query param
    // e.g. GET /api/health?error=FUNCTION_THROTTLED
    const errorCode = _req.query.error;
    if (errorCode) {
        return next(new PlatformError(errorCode));
    }
    return res.json({ ok: true, service: 'server', timestamp: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/tasks', tasksRouter);

// Handle 404 for API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        code: 'NOT_FOUND',
        details: `Route ${req.method} ${req.path} not found`,
        requestId: req.id
    });
});

// Serve static files from the web/dist directory in production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const webDistPath = path.join(__dirname, '../../web/dist');
    
    // Serve static files
    app.use(express.static(webDistPath));
    
    // Serve index.html for all non-API routes (client-side routing)
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(webDistPath, 'index.html'));
        }
    });
}

// centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		// Validate critical environment variables
		const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
		const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
		
		if (missingEnvVars.length > 0) {
			throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
		}

		// Configure MongoDB with proper options for deployment
		await mongoose.connect(process.env.MONGODB_URI, {
			// These options help with deployment stability
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 30000, // Give more time for initial connection
			socketTimeoutMS: 45000,
			retryWrites: true,
			retryReads: true,
			w: 'majority',
			family: 4 // Force IPv4
		});
		console.log('Connected to MongoDB');

		// Graceful shutdown handling
		const gracefulShutdown = async () => {
			console.log('Received shutdown signal');
			try {
				await mongoose.connection.close();
				console.log('MongoDB connection closed');
				process.exit(0);
			} catch (err) {
				console.error('Error during graceful shutdown:', err);
				process.exit(1);
			}
		};

		process.on('SIGTERM', gracefulShutdown);
		process.on('SIGINT', gracefulShutdown);

		// Start server
		app.listen(PORT, () => {
			console.log(`API server listening on :${PORT}`);
			console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
			console.log(`CORS origins: ${origins.join(', ')}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();

