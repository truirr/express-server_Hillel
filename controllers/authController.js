import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserModel from '../models/UserModel.js';

export function getRegisterPage(req, res) {
  res.render('ejs/register', {
    title: 'Register',
    error: null,
  });
}

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render('ejs/register', {
        title: 'Register',
        error: 'Заповніть імʼя, email та пароль.',
      });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).render('ejs/register', {
        title: 'Register',
        error: 'Користувач з таким email вже існує.',
      });
    }

    const user = new UserModel({ name, email });
    user.setPassword(password);
    await user.save();

    req.login(user, (error) => {
      if (error) {
        return res.status(500).render('ejs/register', {
          title: 'Register',
          error: 'Помилка входу після реєстрації.',
        });
      }

      return res.redirect('/tasks');
    });
  } catch (error) {
    return res.status(500).render('ejs/register', {
      title: 'Register',
      error: 'Помилка реєстрації.',
    });
  }
}

export function getLoginPage(req, res) {
  res.render('ejs/login', {
    title: 'Login',
    error: null,
  });
}

export function loginUser(req, res, next) {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).render('ejs/login', {
        title: 'Login',
        error: 'Невірний email або пароль.',
      });
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'tasks_manager_jwt_secret',
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      return res.redirect('/tasks');
    });
  })(req, res, next);
}

export function logoutUser(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('token');
    res.redirect('/');
  });
}

export async function apiRegisterUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const user = new UserModel({ name, email });
    user.setPassword(password);
    await user.save();

    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: 'Registration error.' });
  }
}
