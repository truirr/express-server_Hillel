import { Router } from 'express';
import { getRootRoute } from '../controllers/homeController.js';

const router = Router();

router.get('/', getRootRoute);

export default router;