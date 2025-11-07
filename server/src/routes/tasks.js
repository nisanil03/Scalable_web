import { Router } from 'express';
import { z } from 'zod';
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
            
            return res.status(201).json(task);
        } catch (err) {
            if (err.code === 11000) { // MongoDB duplicate key error
                throw new PlatformError('INTERNAL_FUNCTION_INVOCATION_FAILED');
            }
            throw err;
        }
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

// Get all tasks for authenticated user with filtering, pagination and sorting
tasksRouter.get('/', 
    asyncHandler(async (req, res) => {
        const parsed = await querySchema.parseAsync(req.query);
        const { q, status, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = parsed;
        
        const filter = { userId: req.userId };
        if (status) filter.status = status;
        if (q) filter.title = { $regex: q, $options: 'i' };
        
        const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;
        
        const [total, tasks] = await Promise.all([
            Task.countDocuments(filter),
            Task.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
        ]);

        return res.json({ 
            data: tasks,
            total,
            page,
            limit
        });
    })
);

// Update task (support both PUT and PATCH for compatibility)
tasksRouter.put('/:id',
    validate('taskId'),
    validate('updateTask'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json(task);
    })
);

tasksRouter.patch('/:id',
    validate('taskId'),
    validate('updateTask'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json(task);
    })
);

// Delete task
tasksRouter.delete('/:id',
    validate('taskId'),
    asyncHandler(async (req, res) => {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json({ ok: true });
    })
);



