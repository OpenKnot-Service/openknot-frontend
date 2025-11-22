import { User } from '../types';

const ACCESS_TOKEN_KEY = 'openknot_access_token';
const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://api.winter-cloud.com';
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
export const API_BASE_URL = normalizedBaseUrl;

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface ApiUserResponse {
  id?: string;
  userId?: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  description?: string;
  githubLink?: string;
  githubUsername?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  grantType: string;
  accessToken: string;
}

type ApiRequestOptions = RequestInit & {
  skipAuth?: boolean;
};

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const storeAccessToken = (token: string | null) => {
  if (typeof localStorage === 'undefined') return;
  if (!token) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options.skipAuth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const text = await response.text();
  const parsed = text ? safeJsonParse(text) : null;
  const data =
    parsed && typeof parsed === 'object' && parsed !== null && 'data' in parsed
      ? (parsed as any).data
      : parsed;

  if (!response.ok) {
    const message =
      (parsed as any)?.error?.message ||
      (parsed as any)?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, parsed ?? undefined);
  }

  return data as T;
}

export const normalizeUser = (user: ApiUserResponse): User => {
  const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
  const updatedAt = user.updatedAt ? new Date(user.updatedAt) : createdAt;
  const githubUsername =
    user.githubUsername || (user.githubLink ? user.githubLink.split('/').pop() : undefined);

  return {
    id: user.id || user.userId || user.email,
    email: user.email,
    name: user.name,
    avatar: user.profileImageUrl,
    profileImageUrl: user.profileImageUrl,
    description: user.description,
    githubLink: user.githubLink,
    githubUsername,
    role: 'developer',
    skills: [],
    bio: user.description,
    createdAt,
    updatedAt,
  };
};

export const registerUser = (payload: {
  email: string;
  password: string;
  name: string;
  profileImageUrl?: string;
  description?: string;
  githubLink?: string;
}) =>
  apiRequest<void>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

export const loginUser = (payload: { email: string; password: string }) =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

export const refreshAccessToken = () =>
  apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    skipAuth: true,
  });

export const logoutUser = () =>
  apiRequest<void>('/auth/logout', {
    method: 'POST',
    skipAuth: true,
  });

export const fetchCurrentUser = async () =>
  normalizeUser(await apiRequest<ApiUserResponse>('/users/me'));

export const updateUserProfile = async (
  userId: string,
  payload: Partial<Pick<ApiUserResponse, 'name' | 'profileImageUrl' | 'description' | 'githubLink'>>
) =>
  normalizeUser(
    await apiRequest<ApiUserResponse>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  );

export const checkEmailExists = (email: string) =>
  apiRequest<boolean>(`/users/email-exists?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    skipAuth: true,
  });

export const validateCredentials = (payload: { email: string; password: string }) =>
  apiRequest<{ userId: string }>('/users/validate-credentials', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

export const linkGithubAccount = (payload: {
  userId: string;
  githubId: number;
  githubUsername: string;
  githubAccessToken: string;
  avatarUrl?: string;
}) =>
  apiRequest('/users/github/link', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const buildGithubOAuthUrl = () => `${API_BASE_URL}/auth/github`;
