import { Share } from 'react-native';
import { API_URL } from '../config/api';

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

export function buildArticleShareUrl(articleId) {
  const baseUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_PUBLIC_BASE_URL ?? API_URL);
  return `${baseUrl}/share/articles/${encodeURIComponent(articleId)}`;
}

export function formatArticleShareMessage(article) {
  const shareUrl = buildArticleShareUrl(article.id);

  return {
    message: shareUrl,
    url: shareUrl,
  };
}

export async function shareArticle(article) {
  return Share.share(formatArticleShareMessage(article), {
    dialogTitle: 'Share article',
  });
}
