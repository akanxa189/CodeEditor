import type { AuthResponse, HistoryItem, ReviewResult } from '../types';

/** Production: set VITE_API_URL to your deployed backend (e.g. https://api.example.com/api). Dev: unset to use Vite proxy. */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  reviewCode: async (code: string, language: string): Promise<ReviewResult> => {
    const res = await fetch(`${API_BASE}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, language }),
    });
    return handleResponse<ReviewResult>(res);
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    const res = await fetch(`${API_BASE}/history`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<HistoryItem[]>(res);
  },

  getReviewById: async (id: string): Promise<ReviewResult & { code: string }> => {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ReviewResult & { code: string }>(res);
  },
};
