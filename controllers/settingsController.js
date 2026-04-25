export function saveTheme(req, res) {
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).send('Theme is required');
  }

  res.cookie('theme', theme, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.send(`Theme saved: ${theme}`);
}

export function getTheme(req, res) {
  const theme = req.cookies.theme || 'default';

  return res.send(`Current theme: ${theme}`);
}