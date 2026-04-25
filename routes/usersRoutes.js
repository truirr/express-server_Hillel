import { Router } from 'express';
import {
  getUsersRoute,
  postUsersRoute,
  getUserByIdRoute,
  putUserByIdRoute,
  deleteUserByIdRoute,
} from '../controllers/usersController.js';

const router = Router();

router.get('/', getUsersRoute);
router.post('/', postUsersRoute);

router.get('/:userId', getUserByIdRoute);
router.put('/:userId', putUserByIdRoute);
router.delete('/:userId', deleteUserByIdRoute);

export default router;