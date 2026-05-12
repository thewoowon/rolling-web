import axios, { AxiosError, AxiosInstance } from "axios";

import type { APIError, APIResponse, TokenPair } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const ACCESS_KEY = "rolling.access_token";
const REFRESH_KEY = "rolling.refresh_token";

export const tokenStorage = {
  getAccess: () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },
  getRefresh: () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set: (pair: TokenPair) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_KEY, pair.access_token);
    window.localStorage.setItem(REFRESH_KEY, pair.refresh_token);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

client.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<APIError>) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original.url?.includes("/auth/") &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !(original as any)._retry
    ) {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        tokenStorage.clear();
        return Promise.reject(error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (original as any)._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) return reject(error);
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(client(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post<APIResponse<TokenPair>>(
          `${BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        tokenStorage.set(data.data);
        flushQueue(data.data.access_token);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.data.access_token}`;
        return client(original);
      } catch (refreshErr) {
        flushQueue(null);
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export async function apiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const res = await client.get<APIResponse<T>>(path, { params });
  return res.data.data;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await client.post<APIResponse<T>>(path, body ?? {});
  return res.data.data;
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await client.put<APIResponse<T>>(path, body ?? {});
  return res.data.data;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await client.delete<APIResponse<T>>(path);
  return res.data.data;
}

export function extractApiError(error: unknown): {
  code: string;
  message: string;
} {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as APIError | undefined;
    if (body?.error) {
      return { code: body.error.code, message: body.error.message };
    }
    return {
      code: "NETWORK_ERROR",
      message: error.message || "Network error",
    };
  }
  return {
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

export { client };
