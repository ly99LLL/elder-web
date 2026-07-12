import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userInfo: null,

      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      clearAuth: () => set({ token: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
