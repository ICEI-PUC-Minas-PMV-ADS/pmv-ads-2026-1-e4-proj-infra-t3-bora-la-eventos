import { create } from "zustand";

export interface IUseAuthStore {
  isAuthenticated: boolean;
  token: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<IUseAuthStore>((set) => {
  return {
    isAuthenticated: false,
    token: '',
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  };
});
