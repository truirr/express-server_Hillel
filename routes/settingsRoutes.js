import { Router } from 'express';
import { saveTheme, getTheme } from '../controllers/settingsController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';

const router = Router();

router.post('/theme', jwtMiddleware, saveTheme);
router.get('/theme', getTheme);

export default router;