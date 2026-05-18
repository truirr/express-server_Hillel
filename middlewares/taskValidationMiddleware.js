import mongoose from 'mongoose';

const statuses = ['todo', 'in-progress', 'done'];
const priorities = ['low', 'medium', 'high'];

export function validateTaskData(req, res, next) {
  const { title, status, priority } = req.body;

  if (req.method === 'POST' && (!title || title.trim().length < 2)) {
    return res.status(400).json({ message: 'Task title must contain at least 2 characters.' });
  }

  if (status && !statuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid task status.' });
  }

  if (priority && !priorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid task priority.' });
  }

  next();
}

export function validateTaskId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
    return res.status(400).json({ message: 'Invalid task id.' });
  }

  next();
}
