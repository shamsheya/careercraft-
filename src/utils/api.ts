const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('careercraft_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('careercraft_token', token);
  } else {
    localStorage.removeItem('careercraft_token');
  }
}

export function getStoredToken(): string | null {
  return getToken();
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
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
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    year: number;
    college: string;
    avatar: string;
    streak: number;
    totalScore: number;
    badges: any[];
    joinedAt?: string;
  };
}

export interface ProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    year: number;
    college: string;
    avatar: string;
    streak: number;
    totalScore: number;
    badges: any[];
    joinedAt: string;
  };
  progress: {
    hr: { completed: number; averageScore: number; total: number };
    technical: { completed: number; averageScore: number; total: number };
    gd: { completed: number; averageScore: number; total: number };
    aptitude: { completed: number; averageScore: number; total: number };
  } | null;
}

export const api = {
  register: (data: { name: string; email: string; password: string; year: number; college?: string; avatar?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  forgotPassword: (data: { email: string }) =>
    request<{ message: string; tempPassword?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () =>
    request<ProfileResponse>('/auth/profile'),

  updateProfile: (data: { streak?: number; totalScore?: number; badges?: any[]; progress?: any }) =>
    request<{ message: string }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
