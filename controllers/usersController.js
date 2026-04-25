const users = [
  { id: 1, name: 'Олег', email: 'oleg@email.com' },
  { id: 2, name: 'Іван', email: 'ivan@email.com' },
  { id: 3, name: 'Марія', email: 'maria@email.com' },
];

export function getUsersRoute(req, res) {
  res.render('pug/users.pug', {
    title: 'Users',
    users,
  });
}

export function postUsersRoute(req, res) {
  res.send('Post users route');
}

export function getUserByIdRoute(req, res) {
  const { userId } = req.params;
  const user = users.find((item) => item.id === Number(userId));

  res.render('pug/userDetails.pug', {
    title: 'User Details',
    userId,
    user,
  });
}

export function putUserByIdRoute(req, res) {
  const { userId } = req.params;
  res.send(`Put user by Id route: ${userId}`);
}

export function deleteUserByIdRoute(req, res) {
  const { userId } = req.params;
  res.send(`Delete user by Id route: ${userId}`);
}