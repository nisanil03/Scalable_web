import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { PlatformError } from '../middleware/platformErrors.js';

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get('/', asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select('_id email name createdAt updatedAt');
    if (!user) {
        throw new PlatformError('RESOURCE_NOT_FOUND');
    }
    return res.json({
        message: 'Profile retrieved successfully',
        data: user
    });
}));

const updateSchema = z.object({ 
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email format').optional()
});

profileRouter.put('/', 
    validate('updateProfile'),
    asyncHandler(async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('_id email name createdAt updatedAt');

        if (!user) {
            throw new PlatformError('RESOURCE_NOT_FOUND');
        }

        return res.json({
            message: 'Profile updated successfully',
            data: user
        });
    })
);
// Avatar upload functionality has been removed and avatarUrl is no longer returned.

