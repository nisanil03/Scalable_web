import { z } from 'zod';

// Common validation schemas
const schemas = {
    // Auth validation schemas
    login: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    }),

    register: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    }),

    // Query parameter schemas
    queryParams: z.object({
        q: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        sort: z.enum(['createdAt', 'title', 'status']).optional(),
        order: z.enum(['asc', 'desc']).optional()
    }),

    // Task validation schemas
    createTask: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        description: z.string().optional().default(''),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().datetime().optional()
    }),

    updateTask: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
        description: z.string().optional(),
        status: z.enum(['todo', 'in_progress', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().datetime().optional(),
        completed: z.boolean().optional()
    }),

    // ID validation schema (supports both 'id' and 'taskId' params)
    taskId: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format').optional(),
        taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format').optional()
    }).transform(data => {
        const id = data.id || data.taskId;
        return { id: id?.toString() };
    }),

    // Profile validation schemas
    updateProfile: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        email: z.string().email('Invalid email format').optional()
    })
};

// Validation middleware factory
export function validate(schemaName) {
    if (!schemas[schemaName]) {
        throw new Error(`Validation schema '${schemaName}' not found`);
    }

    return async (req, res, next) => {
        try {
            const dataToValidate = schemaName.endsWith('Id') ? req.params : req.body;
            const validated = await schemas[schemaName].parseAsync(dataToValidate);
            
            // Update the appropriate request object
            if (schemaName.endsWith('Id')) {
                // For ID validation, merge validated id back into params
                if (validated.id) {
                    req.params.id = validated.id;
                }
            } else {
                req.body = validated;
            }
            
            next();
        } catch (error) {
            // If validation fails, format the error messages
            const errors = error.errors?.map(err => ({
                field: err.path.join('.'),
                message: err.message
            })) || [{ message: 'Validation failed' }];

            res.status(400).json({
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors
            });
        }
    };
}