export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
  }

  return res.redirect('/auth/login');
}
