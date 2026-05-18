import { Router } from 'express';
import { getTheme, saveTheme } from '../controllers/settingsController.js';

const router = Router();

router.get('/theme', getTheme);
router.post('/theme', saveTheme);

export default router;
