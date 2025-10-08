import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface MenuItem {
  menu_id: number;
  menu_name: string;
  menu_slug: string;
  menu_url: string;
  menu_icon: string;
  parent_id: number | null;
  sub_menus: MenuItem[];
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  role: string;
  menus: Record<string, MenuItem[]>;
}

export interface LoginResponse {
  token: string;
  user: User;
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
  if (data?.token && data.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("id", String(data.user.user_id));
    localStorage.setItem("fullname", data.user.full_name);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userMenuList", JSON.stringify(data.user.menus));
  } else {
    localStorage.clear();
  }
};

// Ambil token & user dari localStorage
export const getAuthToken = (): (User & { token: string }) | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  return {
    token,
    user_id: Number(localStorage.getItem("id")),
    full_name: localStorage.getItem("fullname") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
    menus: JSON.parse(localStorage.getItem("userMenuList") || "{}"),
  };
};

export default ApiService;
