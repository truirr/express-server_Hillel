import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret_key_for_homework';

export function jwtMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send('Invalid or expired token.');
  }
}