import { Router } from 'express';
import {
  getArticlesRoute,
  postArticlesRoute,
  getArticleByIdRoute,
  putArticleByIdRoute,
  deleteArticleByIdRoute,
} from '../controllers/articlesController.js';

import {
  articleAccessMiddleware,
  validateArticleId,
} from '../middlewares/articleAccessMiddleware.js';

const router = Router();

router.get('/', articleAccessMiddleware, getArticlesRoute);
router.post('/', articleAccessMiddleware, postArticlesRoute);

router.get('/:articleId', articleAccessMiddleware, validateArticleId, getArticleByIdRoute);
router.put('/:articleId', articleAccessMiddleware, validateArticleId, putArticleByIdRoute);
router.delete('/:articleId', articleAccessMiddleware, validateArticleId, deleteArticleByIdRoute);

export default router;