export function validateUserData(req, res, next) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Missing required fields: username and password');
    }
  }

  next();
}

export function validateUserId(req, res, next) {
  const { userId } = req.params;

  if (userId && Number.isNaN(Number(userId))) {
    return res.status(400).send('Invalid userId');
  }

  next();
}