export function getProtectedRoute(req, res) {
  res.send(`Protected route. Hello, ${req.user.email}`);
}