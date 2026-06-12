const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5007/api';
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ROLE_KEY = 'userRole';

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = API_BASE_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl('/auth/refresh-token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearAuthSession();
        return null;
      }

      const data = (await response.json()) as {
        token: string;
        refreshToken: string;
      };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      return data.token;
    } catch {
      clearAuthSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, skipRefresh, headers, ...rest } = options;
  const accessToken = skipAuth ? null : getAccessToken();

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      ...rest,
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new Error('Cannot connect to the server. Please ensure the backend is running on port 5007.');
  }

  if (response.status === 401 && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new Error('Session expired. Please log in again.');
    }

    let retryResponse: Response;
    try {
      retryResponse = await fetch(buildUrl(path), {
        ...rest,
        headers: {
          Authorization: `Bearer ${newToken}`,
          ...headers,
        },
      });
    } catch {
      throw new Error('Cannot connect to the server. Please ensure the backend is running on port 5007.');
    }

    if (!retryResponse.ok) {
      throw new Error('Request failed');
    }

    return parseResponse<T>(retryResponse);
  }

  if (!response.ok) {
    const text = await response.text();
    let message = `Request failed (${response.status})`;
    try {
      const json = JSON.parse(text) as { message?: string; title?: string; detail?: string; errors?: Record<string, string[]> };
      if (json.errors) {
        const allErrors = Object.values(json.errors).flat();
        message = allErrors.length > 0 ? allErrors.join('. ') : (json.detail ?? json.title ?? message);
      } else {
        message = json.message ?? json.detail ?? json.title ?? message;
      }
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  return parseResponse<T>(response);
}

export function useApi() {
  return { request: apiRequest };
}
