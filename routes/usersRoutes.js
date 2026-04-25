import { Router } from 'express';
import {
  getUsersRoute,
  postUsersRoute,
  getUserByIdRoute,
  putUserByIdRoute,
  deleteUserByIdRoute,
} from '../controllers/usersController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  validateUserData,
  validateUserId,
} from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getUsersRoute);
router.post('/', authMiddleware, validateUserData, postUsersRoute);

router.get('/:userId', authMiddleware, validateUserId, getUserByIdRoute);
router.put('/:userId', authMiddleware, validateUserId, putUserByIdRoute);
router.delete('/:userId', authMiddleware, validateUserId, deleteUserByIdRoute);

export default router;