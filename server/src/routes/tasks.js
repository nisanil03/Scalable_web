import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';

export const tasksRouter = Router();
tasksRouter.use(requireAuth);

const createSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional().default(''),
	status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

tasksRouter.post('/', async (req, res) => {
	const parse = createSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: parse.error.format() });
	const task = await Task.create({ ...parse.data, userId: req.userId });
	return res.status(201).json(task);
});

const querySchema = z.object({
    q: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sort: z.enum(['createdAt','title','status']).optional(),
    order: z.enum(['asc','desc']).optional(),
});

tasksRouter.get('/', async (req, res) => {
    const { q, status, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = querySchema.parse(req.query);
    const filter = { userId: req.userId };
    if (status) filter.status = status;
    if (q) filter.title = { $regex: q, $options: 'i' };
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit);
    return res.json({ data: tasks, total, page, limit });
});

const idParamSchema = z.object({ id: z.string().length(24) });
const updateSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

tasksRouter.put('/:id', async (req, res) => {
	const { id } = idParamSchema.parse(req.params);
	const updates = updateSchema.parse(req.body);
	const task = await Task.findOneAndUpdate({ _id: id, userId: req.userId }, updates, { new: true });
	if (!task) return res.status(404).json({ error: 'Task not found' });
	return res.json(task);
});

tasksRouter.delete('/:id', async (req, res) => {
	const { id } = idParamSchema.parse(req.params);
	const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
	if (!task) return res.status(404).json({ error: 'Task not found' });
	return res.json({ ok: true });
});

