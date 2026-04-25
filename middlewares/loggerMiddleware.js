export function loggerMiddleware(req, res, next) {
  const date = new Date().toISOString();
  console.log(`${date} - ${req.method} request to ${req.originalUrl}`);
  next();
}