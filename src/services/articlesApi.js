import { API_URL } from '../config/api';

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchArticles() {
  const response = await fetch(`${API_URL}/articles`);
  return parseResponse(response);
}

export async function fetchArticleById(articleId) {
  const response = await fetch(`${API_URL}/articles/${articleId}`);
  return parseResponse(response);
}
