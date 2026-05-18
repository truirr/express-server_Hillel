import mongoose from 'mongoose';
import TaskModel from '../models/TaskModel.js';

function normalizeTaskBody(body) {
  return {
    title: body.title,
    description: body.description || '',
    status: body.status || 'todo',
    priority: body.priority || 'medium',
    dueDate: body.dueDate || null,
  };
}

function buildTaskFilter(req) {
  const filter = { owner: req.user.id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  return filter;
}

function normalizeLimit(value, defaultValue = 20, maxValue = 100) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultValue;
  }

  return Math.min(parsed, maxValue);
}

export async function getTasksPage(req, res) {
  const filter = buildTaskFilter(req);
  const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });

  res.render('ejs/tasks', {
    title: 'My Tasks',
    tasks,
    selectedStatus: req.query.status || '',
  });
}

export async function createTaskFromForm(req, res) {
  await TaskModel.create({
    ...normalizeTaskBody(req.body),
    owner: req.user.id,
  });

  res.redirect('/tasks');
}

export async function getTaskDetailsPage(req, res) {
  const task = await TaskModel.findOne({ _id: req.params.taskId, owner: req.user.id });

  if (!task) {
    return res.status(404).render('ejs/error', {
      title: 'Task not found',
      message: 'Задачу не знайдено.',
    });
  }

  return res.render('ejs/taskDetails', {
    title: task.title,
    task,
  });
}

export async function getTasksStatsPage(req, res) {
  const [stats] = await buildTasksStatsAggregation(req.user.id);

  res.render('ejs/taskStats', {
    title: 'Task statistics',
    stats: stats || createEmptyStats(),
  });
}

export async function updateTaskFromForm(req, res) {
  await TaskModel.updateOne(
    { _id: req.params.taskId, owner: req.user.id },
    { $set: normalizeTaskBody(req.body) }
  );

  res.redirect(`/tasks/${req.params.taskId}`);
}

export async function deleteTaskFromForm(req, res) {
  await TaskModel.deleteOne({ _id: req.params.taskId, owner: req.user.id });
  res.redirect('/tasks');
}

export async function getTasksApi(req, res) {
  const filter = buildTaskFilter(req);
  const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
}

export async function getTasksCursorApi(req, res) {
  const filter = buildTaskFilter(req);
  const limit = normalizeLimit(req.query.limit, 20, 100);
  const cursor = TaskModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title description status priority dueDate createdAt updatedAt')
    .lean()
    .cursor();

  const tasks = [];
  let processedCount = 0;

  for await (const task of cursor) {
    processedCount += 1;
    tasks.push(task);
  }

  return res.json({
    message: 'Tasks were processed with MongoDB cursor.',
    processedCount,
    limit,
    tasks,
  });
}

export async function streamTasksCursorApi(req, res) {
  const filter = buildTaskFilter(req);
  const limit = normalizeLimit(req.query.limit, 50, 200);
  const cursor = TaskModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title status priority dueDate createdAt')
    .lean()
    .cursor();

  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');

  let processedCount = 0;

  for await (const task of cursor) {
    processedCount += 1;
    res.write(`${JSON.stringify(task)}\n`);
  }

  res.write(JSON.stringify({ message: 'Cursor stream completed.', processedCount }));
  res.end();
}

export async function getTasksStatsApi(req, res) {
  const [stats] = await buildTasksStatsAggregation(req.user.id);

  return res.json({
    message: 'Task statistics were calculated with MongoDB aggregation pipeline.',
    stats: stats || createEmptyStats(),
  });
}

export async function createTaskApi(req, res) {
  const task = await TaskModel.create({
    ...normalizeTaskBody(req.body),
    owner: req.user.id,
  });

  res.status(201).json(task);
}

export async function getTaskByIdApi(req, res) {
  const task = await TaskModel.findOne({ _id: req.params.taskId, owner: req.user.id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json(task);
}

export async function updateTaskApi(req, res) {
  const task = await TaskModel.findOneAndUpdate(
    { _id: req.params.taskId, owner: req.user.id },
    { $set: normalizeTaskBody(req.body) },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json(task);
}

export async function deleteTaskApi(req, res) {
  const result = await TaskModel.deleteOne({ _id: req.params.taskId, owner: req.user.id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json({ message: 'Task deleted successfully.' });
}

async function buildTasksStatsAggregation(userId) {
  return TaskModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $facet: {
        general: [
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
                },
              },
              activeTasks: {
                $sum: {
                  $cond: [{ $ne: ['$status', 'done'] }, 1, 0],
                },
              },
              overdueTasks: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ['$dueDate', null] },
                        { $lt: ['$dueDate', new Date()] },
                        { $ne: ['$status', 'done'] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              uniqueStatuses: { $addToSet: '$status' },
              uniquePriorities: { $addToSet: '$priority' },
            },
          },
        ],
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
    {
      $project: {
        totalTasks: { $ifNull: [{ $arrayElemAt: ['$general.totalTasks', 0] }, 0] },
        completedTasks: { $ifNull: [{ $arrayElemAt: ['$general.completedTasks', 0] }, 0] },
        activeTasks: { $ifNull: [{ $arrayElemAt: ['$general.activeTasks', 0] }, 0] },
        overdueTasks: { $ifNull: [{ $arrayElemAt: ['$general.overdueTasks', 0] }, 0] },
        uniqueStatusesCount: {
          $size: { $ifNull: [{ $arrayElemAt: ['$general.uniqueStatuses', 0] }, []] },
        },
        uniquePrioritiesCount: {
          $size: { $ifNull: [{ $arrayElemAt: ['$general.uniquePriorities', 0] }, []] },
        },
        byStatus: 1,
        byPriority: 1,
      },
    },
  ]);
}

function createEmptyStats() {
  return {
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    overdueTasks: 0,
    uniqueStatusesCount: 0,
    uniquePrioritiesCount: 0,
    byStatus: [],
    byPriority: [],
  };
}
