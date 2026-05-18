import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import passport from './config/passport.js';
import { connectDatabase } from './config/database.js';

import homeRoutes from './routes/homeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

import { loggerMiddleware } from './middlewares/loggerMiddleware.js';
import { sessionMiddleware } from './middlewares/sessionMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tasks_manager_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(loggerMiddleware);
app.use(sessionMiddleware);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/settings', settingsRoutes);
app.use('/protected', protectedRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Tasks Manager is running on http://localhost:${PORT}`);
  });
});
