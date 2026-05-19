import { create } from "zustand";

export interface IUser {
  id: string;
  name: string;
  email: string;
  document: string;
  role: string;
}

export interface IUserStore {
  currentUser: IUser | {};
  userToken: string;
  updateUser: (data: IUser) => void;
  createUser: (user: IUser, token: string) => void;
}

export const useUserStore = create<IUserStore>((set, get) => {
  return {
    currentUser: {},
    userToken: "",
    updateUser: (newUser: IUser) => set({ currentUser: newUser }),
    createUser: (user, token) => set({ currentUser: user, userToken: token }),
  };
});
