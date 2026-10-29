export function getAuthToken(): string | null {
  return localStorage.getItem('pokedress_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('pokedress_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('pokedress_token');
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only set application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.error || 'Erreur lors de la requête');
    error.status = response.status;
    error.code = data.code;
    error.details = data.details;
    throw error;
  }

  return data as T;
}
