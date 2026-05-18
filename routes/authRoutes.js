import { Router } from 'express';
import {
  apiRegisterUser,
  getLoginPage,
  getRegisterPage,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js';

const router = Router();

router.get('/register', getRegisterPage);
router.post('/register', registerUser);
router.post('/api/register', apiRegisterUser);

router.get('/login', getLoginPage);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
