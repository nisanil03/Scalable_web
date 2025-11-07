import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const authRouter = Router();

const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	// at least 8 chars, one letter and one number
	password: z
		.string()
		.min(8)
		.regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must include a letter and a number'),
});

authRouter.post('/register', async (req, res) => {
	const parse = registerSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: parse.error.format() });
	const { name, email, password } = parse.data;
	const existing = await User.findOne({ email });
	if (existing) return res.status(409).json({ error: 'Email already registered' });
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash });
	return res.status(201).json({ id: user._id, email: user.email, name: user.name });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post('/login', async (req, res) => {
	const parse = loginSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: parse.error.format() });
	const { email, password } = parse.data;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
	return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

authRouter.post('/logout', (_req, res) => {
	return res.json({ ok: true });
});

