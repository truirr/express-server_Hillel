export function getUsersRoute(req, res) {
  res.send('Get users route');
}

export function postUsersRoute(req, res) {
  res.send('Post users route');
}

export function getUserByIdRoute(req, res) {
  const { userId } = req.params;
  res.send(`Get user by Id route: ${userId}`);
}

export function putUserByIdRoute(req, res) {
  const { userId } = req.params;
  res.send(`Put user by Id route: ${userId}`);
}

export function deleteUserByIdRoute(req, res) {
  const { userId } = req.params;
  res.send(`Delete user by Id route: ${userId}`);
}