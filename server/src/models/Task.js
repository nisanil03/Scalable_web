import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		title: { type: String, required: true },
		description: { type: String, default: '' },
		status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
	},
	{ timestamps: true }
);

// Index for common queries
taskSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);

