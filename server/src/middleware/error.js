import { isPlatformError, PLATFORM_ERRORS } from './platformErrors.js';

export function errorHandler(err, req, res, _next) {
    // Log error for debugging (but avoid logging sensitive data)
    console.error('Error occurred:', {
        path: req.path,
        method: req.method,
        code: err.code,
        message: err.message,
        requestId: req.id,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Handle MongoDB connection errors
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        return res.status(503).json({
            error: 'Database service temporarily unavailable',
            code: 'DATABASE_ERROR',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Check if this is a platform error by its code
    if (err.code && isPlatformError(err.code)) {
        const platformError = PLATFORM_ERRORS[err.code];
        return res.status(platformError.status).json({
            error: platformError.message,
            code: platformError.code,
            // Only include details in development
            details: process.env.NODE_ENV === 'development' ? err.details : undefined
        });
    }

    // Handle regular errors
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'development' 
        ? (err.message || 'Server error')
        : 'An unexpected error occurred';
        
    return res.status(status).json({
        error: message,
        code: err.code,
        // Only include details in development
        details: process.env.NODE_ENV === 'development' ? err.details : undefined
    });
}

