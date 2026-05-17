import AsyncStorage from "@react-native-async-storage/async-storage";

type LocalStorageReturnType = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  updateItem: (key: string, value: string) => Promise<void>;
};

export type TUseLocalStorageStore = () => LocalStorageReturnType 

export const useLocalStorage: TUseLocalStorageStore = () => {
  return {
    setItem: async (key: string, value: string) =>
      await AsyncStorage.setItem(key, value),
    getItem: async (key) => await AsyncStorage.getItem(key),
    updateItem: async (key, value) => {
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, value);
    },
  };
};
