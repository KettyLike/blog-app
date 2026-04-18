import { API_URL } from '../config/api';

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function postComment(articleId, comment) {
  const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });

  return parseResponse(response);
}
