export function errorHandler(err, _req, res, _next) {
	const status = err.status || 500;
	const message = err.message || 'Server error';
	return res.status(status).json({ error: message, details: err.details });
}

