export function getHomePage(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/tasks');
  }

  return res.render('ejs/home', {
    title: 'Tasks Manager',
  });
}
