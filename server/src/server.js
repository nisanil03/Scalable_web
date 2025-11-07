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
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// NOTE: Serving of '/uploads' has been removed to disable serving user-uploaded avatars.
// If you need static assets, add them to the web/public folder or re-enable static serving intentionally.

app.get('/api/health', (_req, res) => {
	return res.json({ ok: true, service: 'server', timestamp: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/tasks', tasksRouter);

// centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		const mongoUri = process.env.MONGODB_URI;
		if (!mongoUri) {
			console.warn('MONGODB_URI not set. Please configure your database connection.');
		} else {
			await mongoose.connect(mongoUri);
			console.log('Connected to MongoDB');
		}
		app.listen(PORT, () => console.log(`API server listening on :${PORT}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();

