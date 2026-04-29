import { API_URL } from '../config/api';

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function setUserAvatar(userId, avatar) {
  const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar }),
  });

  return parseResponse(response);
}
