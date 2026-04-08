const BASE_URL = import.meta.env.VITE_TOOLS_API as string;

let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authenticated && _token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }

  // 204 No Content or empty body
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}