export function notFoundMiddleware(req, res) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' });
  }

  return res.status(404).render('ejs/error', {
    title: 'Not Found',
    message: 'Page not found',
  });
}
