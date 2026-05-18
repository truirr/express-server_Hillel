export function sessionMiddleware(req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.theme = req.cookies.theme || 'light';
  res.locals.currentPath = req.path;
  next();
}
