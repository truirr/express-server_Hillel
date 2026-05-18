export function getProtectedRoute(req, res) {
  res.json({
    message: 'Protected route works.',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
}
