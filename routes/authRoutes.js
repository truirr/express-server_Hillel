import { Router } from 'express';
import passport from 'passport';
import {
  registerUser,
  loginSuccess,
  logoutUser,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);

router.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: true,
    failWithError: false,
  }),
  loginSuccess
);

router.post('/logout', logoutUser);

export default router;