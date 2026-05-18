import jwt from 'jsonwebtoken';

export function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    req.jwtUser = jwt.verify(token, process.env.JWT_SECRET || 'tasks_manager_jwt_secret');
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}
