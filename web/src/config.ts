// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

export const api = {
  baseURL: API_BASE_URL,
  get: (url: string, config?: any) => {
    return fetch(`${API_BASE_URL}${url}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    }).then(res => res.json());
  },
  post: (url: string, data?: any, config?: any) => {
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }).then(res => res.json());
  },
  put: (url: string, data?: any, config?: any) => {
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }).then(res => res.json());
  },
  delete: (url: string, config?: any) => {
    return fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    }).then(res => res.json());
  },
};

