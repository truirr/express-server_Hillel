import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import passport from './config/passport.js';
import { connectDatabase } from './config/database.js';

import homeRoutes from './routes/homeRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import databaseRoutes from './routes/databaseRoutes.js';

import { sessionMiddleware } from './middlewares/sessionMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'passport_session_secret_for_homework',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(sessionMiddleware);

app.use('/', homeRoutes);
app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);
app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);
app.use('/protected', protectedRoutes);
app.use('/database', databaseRoutes);

app.use(errorMiddleware);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});