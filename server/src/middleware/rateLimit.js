import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, // limit each IP
	standardHeaders: true,
	legacyHeaders: false,
});

