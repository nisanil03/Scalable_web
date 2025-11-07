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

    // Task validation schemas
    createTask: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        description: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().datetime().optional()
    }),

    updateTask: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
        description: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().datetime().optional(),
        completed: z.boolean().optional()
    }),

    // ID validation schema
    taskId: z.object({
        taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format')
    }).transform(data => ({ ...data, taskId: data.taskId.toString() })),

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
                req.params = validated;
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