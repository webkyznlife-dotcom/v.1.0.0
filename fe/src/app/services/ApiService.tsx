import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface User {
  id: string;
  fullname: string;
  email: string;
  userMenuList?: any[];
}

export interface LoginResponse {
  token: string;
  userCredential: User;
  userMenuList: any[];
}

// Fungsi untuk membuat instance axios secara dinamis
export const createAPI = (baseURL?: string): AxiosInstance => {
  const API = axios.create({
    baseURL: baseURL || process.env.REACT_APP_API_URL || 'https://api.example.com',
    headers: { 'Content-Type': 'application/json' },
  });

  API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return API;
};

// Fungsi utama API Service
const ApiService = (baseURL?: string) => {
  const API = createAPI(baseURL);

  return {
    get: async <T,>(url: string, params: Record<string, any> = {}): Promise<T> => {
      const response = await API.get<T>(url, { params });
      return response.data;
    },
    post: async <T,>(url: string, data: any = {}): Promise<T> => {
      const response = await API.post<T>(url, data);
      return response.data;
    },
    put: async <T,>(url: string, data: any = {}): Promise<T> => {
      const response = await API.put<T>(url, data);
      return response.data;
    },
    delete: async <T,>(url: string): Promise<T> => {
      const response = await API.delete<T>(url);
      return response.data;
    },
  };
};

// Simpan token & user ke localStorage
export const setAuthToken = (data?: LoginResponse) => {
  if (data?.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.userCredential.id);
    localStorage.setItem('fullname', data.userCredential.fullname);
    localStorage.setItem('email', data.userCredential.email);
    localStorage.setItem('userMenuList', JSON.stringify(data.userMenuList));
  } else {
    localStorage.clear();
  }
};

// Ambil token & user dari localStorage
export const getAuthToken = (): (User & { token: string }) | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return {
    token,
    id: localStorage.getItem('id') || '',
    fullname: localStorage.getItem('fullname') || '',
    email: localStorage.getItem('email') || '',
    userMenuList: JSON.parse(localStorage.getItem('userMenuList') || '[]'),
  };
};

export default ApiService;
