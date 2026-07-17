const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('careercraft_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('careercraft_token', token);
  } else {
    localStorage.removeItem('careercraft_token');
  }
}

export function getStoredToken() {
  return getToken();
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  forgotPassword: (data) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () =>
    request('/auth/profile'),

  updateProfile: (data) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
