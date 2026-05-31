import { create } from "zustand";

export interface IUseAuthStore {
  isAuthenticated: boolean;
  hasError: boolean;
  token: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setHasError: (hasError: boolean) => void;
}

export const useAuthStore = create<IUseAuthStore>((set) => {
  return {
    isAuthenticated: false,
    hasError: false,
    token: '',
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    setHasError: (hasError: boolean) => set({ hasError }),
  };
});
