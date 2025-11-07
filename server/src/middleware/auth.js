import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
		req.userId = payload.userId;
		return next();
	} catch (_err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

