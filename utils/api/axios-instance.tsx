// src/utils/axios-instance.ts
import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from './api';
import { useNetworkStore } from '@/zustand/network-store';

type CreateOpts = {
  baseURL?: string;
  requiresAuth?: boolean; // default behavior for this instance
};

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any, R = T, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>;
    put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = T, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>;
  }
}

// token lives in this module (no zustand import)
let currentToken: string | null = null;

export function createAxiosInstance(opts: CreateOpts = {}) {
  const { baseURL = BASE_URL, requiresAuth = true } = opts;

  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      Accept: 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    // Check offline status
    if (useNetworkStore.getState().isOffline) {
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      source.cancel('OFFLINE_MODE');
      return Promise.reject({ message: 'OFFLINE_MODE', isOffline: true });
    }

    let needsAuth = requiresAuth;
    if (config.headers) {
      const xAuth = config.headers['X-Requires-Auth'];
      if (xAuth !== undefined) {
        needsAuth = xAuth === false || xAuth === 'false' || xAuth === 0 || xAuth === '0' ? false : true;
        delete config.headers['X-Requires-Auth'];
      }
    }

    if (needsAuth && currentToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      // Optional: handle 401s globally
      // if (error?.response?.status === 401) { /* maybe clear token */ }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Default instance requires auth by default.
const api = createAxiosInstance({ requiresAuth: true });
export default api;

// If you ever need a dedicated public instance:
export const apiPublic = createAxiosInstance({ requiresAuth: false });

// Or build custom ones on the fly:
export const getCustomAxios = (customBaseURL: string, requiresAuth = true) =>
  createAxiosInstance({ baseURL: customBaseURL, requiresAuth });

// Example per-request public call:
// api.get('/public', { headers: { 'X-Requires-Auth': false } });

export const setAxiosAuthToken = (token: string | null) => {
  currentToken = token; // <-- make interceptors see the token

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
