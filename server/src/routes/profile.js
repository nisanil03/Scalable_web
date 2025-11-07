import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import path from 'path';
import fs from 'fs';

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get('/', async (req, res) => {
    // Return basic profile information. avatarUrl is intentionally omitted because
    // profile picture support has been removed.
    const user = await User.findById(req.userId).select('_id email name createdAt updatedAt');
    return res.json(user);
});

const updateSchema = z.object({ name: z.string().min(2).optional() });

profileRouter.put('/', async (req, res) => {
    const parse = updateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.format() });
    const updates = parse.data;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('_id email name createdAt updatedAt');
    return res.json(user);
});
// Avatar upload functionality has been removed and avatarUrl is no longer returned.

