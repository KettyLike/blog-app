export const COMMENTS_STORAGE_KEY = 'blogapp:comments';

export function buildStoredCommentsMap(articleItems) {
  return articleItems.reduce((result, article) => {
    result[article.id] = article.comments;
    return result;
  }, {});
}

export function mergeArticlesWithStoredComments(baseArticles, storedCommentsMap) {
  return baseArticles.map((article) => ({
    ...article,
    comments: storedCommentsMap?.[article.id] ?? article.comments,
  }));
}
