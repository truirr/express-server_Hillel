import { addUser } from '../config/passport.js';

export function registerUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const user = addUser(email, password);

  if (!user) {
    return res.status(400).send('User already exists');
  }

  return res.send('User registered successfully');
}

export function loginSuccess(req, res) {
  res.send(`Login successful. Hello, ${req.user.email}`);
}

export function logoutUser(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.send('Logout successful');
  });
}