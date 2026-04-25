import { Router } from 'express';
import { getRootRoute } from '../controllers/homeController.js';
import { loggerMiddleware } from '../middlewares/loggerMiddleware.js';

const router = Router();

router.get('/', loggerMiddleware, getRootRoute);

export default router;