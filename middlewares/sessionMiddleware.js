export function sessionMiddleware(req, res, next) {
  req.customSessionInfo = {
    startedAt: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'Unknown',
  };

  next();
}