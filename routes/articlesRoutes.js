import { Router } from 'express';
import {
  getArticlesRoute,
  postArticlesRoute,
  getArticleByIdRoute,
  putArticleByIdRoute,
  deleteArticleByIdRoute,
} from '../controllers/articlesController.js';

const router = Router();

router.get('/', getArticlesRoute);
router.post('/', postArticlesRoute);

router.get('/:articleId', getArticleByIdRoute);
router.put('/:articleId', putArticleByIdRoute);
router.delete('/:articleId', deleteArticleByIdRoute);

export default router;