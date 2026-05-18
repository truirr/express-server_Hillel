export function errorMiddleware(error, req, res, next) {
  console.error('Server error:', error);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  return res.status(500).render('ejs/error', {
    title: 'Server Error',
    message: 'Internal Server Error',
  });
}
