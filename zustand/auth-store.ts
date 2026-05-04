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
  avatar_url?: string;
  icon?: string;
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
  updateUser: (user: User) => void;
  updateProfile: (profile: Student | Lab | null) => void;
  clearAuth: () => void;
}

const mergeUserProfile = (user: User, profile: Student | Lab | null): User => {
  if (!profile) {
    return user;
  }

  if (user.type === 'lab') {
    return { ...user, lab: profile as Lab, profile };
  }

  return { ...user, student: profile as Student, profile };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,

  setAuth: (token, user, profile) => {
    const normalizedUser = mergeUserProfile(user, profile);
    set({ token, user: normalizedUser, profile, isAuthenticated: true });
    setCachedAuthToken(token);
    setCachedAuthData(normalizedUser, profile);
    setAxiosAuthToken(token);
  },

  updateUser: (user) => {
    const profile = user.lab || user.student || get().profile;
    const normalizedUser = mergeUserProfile(user, profile);
    set({ user: normalizedUser, profile });
    setCachedAuthData(normalizedUser, profile);
  },

  updateProfile: (profile) => {
    const user = get().user;
    const normalizedUser = user ? mergeUserProfile(user, profile) : null;
    set({ profile, user: normalizedUser });
    if (normalizedUser) {
      setCachedAuthData(normalizedUser, profile);
    }
  },

  clearAuth: () => {
    set({ token: null, user: null, profile: null, isAuthenticated: false });
    setCachedAuthToken(null);
    setCachedAuthData(null, null);
    setAxiosAuthToken(null);
  },
}));
