import { FC, useState } from "react";
import { ToastAndroid } from "react-native";

import { LoginView } from "./login";
import { request, IHttpConfig } from "~/configs/api";
import {
  LoginErrorMessage,
  TLoginContainerProps,
  TLoginResponseData,
  TLoginResponseError,
} from "./types";
import { useLocalStorage } from "~/util/local-storage";
import { useUserStore } from "~/configs/state/user-store";
import { useAuthStore } from "~/configs/state/auth-store";
import { Loading } from "~/components/loading";

export const LoginContainer: FC<TLoginContainerProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getItem, setItem } = useLocalStorage();
  const { setIsAuthenticated } = useAuthStore();
  const { createUser } = useUserStore();

  const signIn = async () => {
    setIsLoading(true);
    const token = await getItem("app-token");
    if (!token) {
      setIsLoading(false);
      return;
    } // precisa notificar o erro...

    const listeners = {
      onSuccess: async (data: TLoginResponseData) => {
        await setItem("user-token", data.token);
        createUser(data.currentUser, data.token);
        setIsLoading(false);
        setIsAuthenticated(true);
      },
      onError: (error: TLoginResponseError) => {
        setIsLoading(false);
        switch (error.message) {
          case LoginErrorMessage.INTERNAL_SERVER_ERROR:
            return ToastAndroid.show(
              "Falha na comunicação. Tente novamente mais tarde",
              ToastAndroid.CENTER,
            );
          case LoginErrorMessage.INVALID_HEADER:
          case LoginErrorMessage.BAD_REQUEST:
          case LoginErrorMessage.UNPROCESSABLE_ENTITY:
            return ToastAndroid.show(
              "Erro ao enviar. Favor entrar em contato com o suporte",
              ToastAndroid.CENTER,
            );
          case LoginErrorMessage.INVALID_BODY:
          case LoginErrorMessage.UNAUTHORIZED:
            return ToastAndroid.show(
              "Verifique os dados digitados e tente novamente",
              ToastAndroid.CENTER,
            );
          default:
            return ToastAndroid.show(
              "Estamos com problemas. Tente novamente mais tarde",
              ToastAndroid.CENTER,
            );
        }
      },
    };

    const config: IHttpConfig = {
      path: "/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Precisa deixar isso default...
        Authorization: token,
        "x-request-id": process.env.EXPO_PUBLIC_API_CLIENT_ID,
      },
      body: JSON.stringify({ email, password }),
    };

    await request<TLoginResponseData, TLoginResponseError>(config, listeners);
  };

  const handleForgotPassword = () => {
    // has no implementation
  };

  const handleSignUp = () => navigation.navigate("SignInScreen");

  return (
    <>
      <Loading show={isLoading} />
      <LoginView
        handleSubmit={signIn}
        handleForgotPassword={handleForgotPassword}
        handleSignUp={handleSignUp}
        handleUpdateEmail={setEmail}
        handleUpdatePassword={setPassword}
      />
    </>
  );
};
