export function articleAccessMiddleware(req, res, next) {
  const role = req.headers.role;

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    if (role !== 'admin') {
      return res.status(403).send('Access denied. Admin role required.');
    }
  }

  next();
}

export function validateArticleId(req, res, next) {
  const { articleId } = req.params;

  if (articleId && Number.isNaN(Number(articleId))) {
    return res.status(400).send('Invalid articleId');
  }

  next();
}