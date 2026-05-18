import { Router } from 'express';
import {
  createTaskApi,
  createTaskFromForm,
  deleteTaskApi,
  deleteTaskFromForm,
  getTaskByIdApi,
  getTaskDetailsPage,
  getTasksApi,
  getTasksCursorApi,
  getTasksPage,
  getTasksStatsApi,
  getTasksStatsPage,
  streamTasksCursorApi,
  updateTaskApi,
  updateTaskFromForm,
} from '../controllers/taskController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { validateTaskData, validateTaskId } from '../middlewares/taskValidationMiddleware.js';

const router = Router();

router.use(ensureAuthenticated);

router.get('/', (req, res, next) => {
  if (req.baseUrl === '/api/tasks') {
    return getTasksApi(req, res, next);
  }

  return getTasksPage(req, res, next);
});

router.post('/', validateTaskData, (req, res, next) => {
  if (req.baseUrl === '/api/tasks') {
    return createTaskApi(req, res, next);
  }

  return createTaskFromForm(req, res, next);
});

router.get('/cursor', getTasksCursorApi);
router.get('/cursor/stream', streamTasksCursorApi);
router.get('/stats', (req, res, next) => {
  if (req.baseUrl === '/api/tasks') {
    return getTasksStatsApi(req, res, next);
  }

  return getTasksStatsPage(req, res, next);
});

router.get('/:taskId', validateTaskId, (req, res, next) => {
  if (req.baseUrl === '/api/tasks') {
    return getTaskByIdApi(req, res, next);
  }

  return getTaskDetailsPage(req, res, next);
});

router.put('/:taskId', validateTaskId, validateTaskData, updateTaskApi);
router.delete('/:taskId', validateTaskId, deleteTaskApi);

router.post('/:taskId/update', validateTaskId, validateTaskData, updateTaskFromForm);
router.post('/:taskId/delete', validateTaskId, deleteTaskFromForm);

export default router;
