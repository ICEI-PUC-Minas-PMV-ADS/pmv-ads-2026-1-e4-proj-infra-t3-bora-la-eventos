import React, { useEffect } from "react";
import { ToastAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import {
  AuthenticatedStack,
  UnauthenticatedStack,
} from "~/configs/navigation/";
import { useAuthStore } from "~/configs/state/auth-store";
import { request } from "./configs/api";
import { IHttpConfig } from "./configs/api/types";
import { useLocalStorage } from "./util/local-storage";

type TRequestSuccess = {
  token: string;
};

type TRequestError = {
  code: string;
  message: string;
};

const App = () => {
  const { isAuthenticated, setHasError } = useAuthStore();
  const { setItem, getItem, updateItem } = useLocalStorage();
  const controller = new AbortController();
  const ClientID = process.env.EXPO_PUBLIC_API_CLIENT_ID;
  const ClientSecret = process.env.EXPO_PUBLIC_API_CLIENT_SECRET;

  const onSuccess = async (response: TRequestSuccess) => {
    console.log("[pre-login] sucesso, token recebido:", response.token?.substring(0, 20) + "...");
    const LOCAL_TOKEN_NAME = "app-token";
    const doesTokenExist = await getItem(LOCAL_TOKEN_NAME);

    if (!doesTokenExist || typeof doesTokenExist !== "string") {
      await setItem("app-token", response.token).catch(() => {
        setHasError(true);
        ToastAndroid.show(
          "Tivemos uma falha com nosso serviço. Feche o app e tente novamente.",
          ToastAndroid.LONG,
        );
      });
    }
    await updateItem(LOCAL_TOKEN_NAME, response.token).catch(() => {
      setHasError(true);
      ToastAndroid.show(
        "Tivemos uma falha com nosso serviço. Feche o app e tente novamente.",
        ToastAndroid.LONG,
      );
    });
  };
  const onError = () => {
    console.error("[pre-login] falhou — verifique EXPO_PUBLIC_API_URL, CLIENT_ID e CLIENT_SECRET no .env");
    setHasError(true);
    ToastAndroid.show(
      "Tivemos uma falha com nosso serviço. Feche o app e tente novamente.",
      ToastAndroid.LONG,
    );
  };

  useEffect(() => {
    const config: IHttpConfig = {
      path: "/auth/pre-login",
      method: "POST",
      controller,
      body: JSON.stringify({ ClientID, ClientSecret }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    request<TRequestSuccess, TRequestError>(config, {
      onSuccess,
      onError,
    });
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

export default App;
