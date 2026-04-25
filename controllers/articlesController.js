const articles = [
  { id: 1, title: 'Перша стаття', description: 'Опис першої статті' },
  { id: 2, title: 'Друга стаття', description: 'Опис другої статті' },
  { id: 3, title: 'Третя стаття', description: 'Опис третьої статті' },
];

export function getArticlesRoute(req, res) {
  res.render('ejs/articles.ejs', {
    title: 'Articles',
    articles,
  });
}

export function postArticlesRoute(req, res) {
  res.send('Post articles route');
}

export function getArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  const article = articles.find((item) => item.id === Number(articleId));

  res.render('ejs/articleDetails.ejs', {
    title: 'Article Details',
    articleId,
    article,
  });
}

export function putArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  res.send(`Put article by Id route: ${articleId}`);
}

export function deleteArticleByIdRoute(req, res) {
  const { articleId } = req.params;
  res.send(`Delete article by Id route: ${articleId}`);
}