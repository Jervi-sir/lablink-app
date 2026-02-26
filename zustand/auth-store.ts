import { create } from 'zustand';
import { User } from '@/utils/types';
import { setCachedAuthToken } from '@/utils/async-storage/auth-async-storage';
import { setAxiosAuthToken } from '@/utils/api/axios-instance';


/* --------- Zustand types --------- */
type AuthStore = {
  auth: User | null;
  setAuth: (user: User | null) => void;
  authType: 'student' | 'business' | null;
  setAuthType: (type: 'student' | 'business') => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => Promise<void>;

  isLoading: boolean;
  error: string | null;

  me: (payload?: { username: string; password: string; full_name?: string; profile_image?: string | null; wilaya_id?: number | null; }) => Promise<User>;
  logout: (navigation: any) => Promise<void>;

}
export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: (user: User | null) => {
    set({ auth: user });
  },
  authType: null,
  setAuthType: (type: 'student' | 'business') => {
    set({ authType: type });
  },
  authToken: null,
  setAuthToken: async (token: string | null) => {
    await setCachedAuthToken(token);
    setAxiosAuthToken(token);
    set({ authToken: token });
  },

  isLoading: false,
  error: null,

  /* --------- Me --------- */
  me: async () => {
    set({ isLoading: true, error: null });
    try {

      // set({ auth: user, isLoading: false });
      // return user;
      return {} as any;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || "Me error" });
      throw e;
    }
  },
  /* --------- Logout --------- */
  logout: async (navigation: any) => {
    try {
      // unregister BEFORE nuking the token
      // try { await api.post(buildRoute(ApiRoutes.auth.logout)); } catch { }
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: Routes.AuthScreen }],
      //   })
      // )
    } finally {
      // await get().setAuthToken(null);
      // await setStoredAuth(null);
      set({ auth: null });
    }
  },


}));