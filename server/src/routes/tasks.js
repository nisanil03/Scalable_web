import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { PlatformError } from '../middleware/platformErrors.js';

export const tasksRouter = Router();

// Apply authentication to all routes
tasksRouter.use(requireAuth);

// Create task with validation and error handling
tasksRouter.post('/', 
    validate('createTask'),
    asyncHandler(async (req, res) => {
        try {
            const task = await Task.create({ 
                ...req.body, 
                userId: req.userId 
            });
            
            return res.status(201).json({
                message: 'Task created successfully',
                data: task
            });
        } catch (err) {
            if (err.code === 11000) { // MongoDB duplicate key error
                throw new PlatformError('INTERNAL_FUNCTION_INVOCATION_FAILED');
            }
            throw err;
        }
    })
);

// Get all tasks for authenticated user
tasksRouter.get('/',
    asyncHandler(async (req, res) => {
        const tasks = await Task.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(100);

        return res.json({
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    })
);

// Get single task by ID
tasksRouter.get('/:taskId',
    validate('taskId'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOne({ 
            _id: req.params.taskId,
            userId: req.userId 
        });

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json({
            message: 'Task retrieved successfully',
            data: task
        });
    })
);

// Update task
tasksRouter.patch('/:taskId',
    validate('taskId'),
    validate('updateTask'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json({
            message: 'Task updated successfully',
            data: task
        });
    })
);

// Delete task
tasksRouter.delete('/:taskId',
    validate('taskId'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOneAndDelete({
            _id: req.params.taskId,
            userId: req.userId
        });

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json({
            message: 'Task deleted successfully',
            data: task
        });
    })
);

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

