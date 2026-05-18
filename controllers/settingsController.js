export function saveTheme(req, res) {
  const { theme } = req.body;

  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ message: 'Theme must be light or dark.' });
  }

  res.cookie('theme', theme, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  if (req.headers.accept?.includes('application/json')) {
    return res.json({ message: `Theme saved: ${theme}` });
  }

  return res.redirect(req.headers.referer || '/tasks');
}

export function getTheme(req, res) {
  return res.json({ theme: req.cookies.theme || 'light' });
}
