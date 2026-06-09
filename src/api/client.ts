import { fetchWithAuth } from "@/oidc";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.TOOLS_API
    : (import.meta.env.VITE_TOOLS_API as string);

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = auth
    ? await fetchWithAuth(`${BASE_URL}${path}`, { ...options, headers })
    : await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }

  // 204 No Content or empty body
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function apiFetchWithHeaders<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = false,
): Promise<{ data: T; headers: Headers }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = auth
    ? await fetchWithAuth(`${BASE_URL}${path}`, { ...options, headers })
    : await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : (undefined as T);
  return { data, headers: res.headers };
}
