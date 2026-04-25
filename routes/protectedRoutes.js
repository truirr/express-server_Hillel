import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { getProtectedRoute } from '../controllers/protectedController.js';

const router = Router();

router.get('/', ensureAuthenticated, getProtectedRoute);

export default router;