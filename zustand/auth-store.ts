import { create } from 'zustand';
import { setCachedAuthToken, setCachedAuthData } from '../utils/async-storage/auth-async-storage';
import { setAxiosAuthToken } from '../utils/api/axios-instance';

export interface Wilaya {
  id: number;
  number: string;
  code: string;
  en: string;
  fr: string;
  ar: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  code: string;
  en: string;
  fr: string;
  ar: string;
  created_at: string;
  updated_at: string;
}

export interface Lab {
  id: number;
  user_id: number;
  wilaya_id: number;
  lab_category_id: number;
  brand_name: string;
  nif: string;
  permission_path_url: string;
  equipments_path_url: string;
  created_at: string;
  updated_at: string;
  wilaya?: Wilaya;
  category?: Category;
}

export interface Student {
  id: number;
  user_id: number;
  wilaya_id: number;
  full_name: string;
  university_registry_number: string;
  specialty: string;
  created_at: string;
  updated_at: string;
  wilaya?: Wilaya;
}

export interface User {
  id: number;
  phone_number: string;
  email: string;
  email_verified_at: string | null;
  two_factor_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  student: Student | null;
  lab: Lab | null;
  type: 'student' | 'lab';
  profile?: Student | Lab | null;
}

interface AuthState {
  user: User | null;
  profile: Student | Lab | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, profile: Student | Lab | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,

  setAuth: (token, user, profile) => {
    set({ token, user, profile, isAuthenticated: true });
    setCachedAuthToken(token);
    setCachedAuthData(user, profile);
    setAxiosAuthToken(token);
  },

  clearAuth: () => {
    set({ token: null, user: null, profile: null, isAuthenticated: false });
    setCachedAuthToken(null);
    setCachedAuthData(null, null);
    setAxiosAuthToken(null);
  },
}));
