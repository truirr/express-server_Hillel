export function getArticlesRoute(req, res) {
  res.send('Get articles route');
}

export function postArticlesRoute(req, res) {
  res.send('Post articles route');
}

export function getArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  res.send(`Get article by Id route: ${articleId}`);
}

export function putArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  res.send(`Put article by Id route: ${articleId}`);
}

export function deleteArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  res.send(`Delete article by Id route: ${articleId}`);
}