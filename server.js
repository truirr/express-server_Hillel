import express from 'express';

import homeRoutes from './routes/homeRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});