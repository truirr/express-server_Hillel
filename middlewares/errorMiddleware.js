export function errorMiddleware(error, req, res, next) {
  console.error('Server error:', error);

  res.status(500).send('Internal Server Error');
}