import { FC, useState } from "react";

import { LoginView } from "./login";
import { request, IHttpConfig } from "~/configs/api";
import { TLoginContainerProps, TLoginResponseData, TLoginResponseError } from "./types";
import { useLocalStorage } from "~/util/local-storage";
import { useUserStore } from "~/configs/state/user-store";

export const LoginContainer: FC<TLoginContainerProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getItem, setItem } = useLocalStorage();
  const {createUser} = useUserStore();

  const signIn = async () => {
    const token = await getItem("app-token");
    if (!token) {
      return;
    } // precisa notificar o erro...

    const listeners = {
      onSuccess: async (data: TLoginResponseData) => {
        await setItem("user-token", data.token);
        createUser(data.currentUser, data.token)
      },
      onError: (error: TLoginResponseError) => {
        console.log(error);
      },

    };

    const config: IHttpConfig = {
      path: "/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Precisa pensar num jeito de deixar isso default...
        "Authorization": token,
        "x-request-id": process.env.EXPO_PUBLIC_API_CLIENT_ID,
      },
      body: JSON.stringify({ email, password }),
      requestInterceptor: (e) => console.log({data: e})
    };

    await request<TLoginResponseData, TLoginResponseError>(config, listeners);
  };

  const handleForgotPassword = () => {
    // has no implementation
  };

  const handleSignUp = () => {
    // Quando fizer a tela de cadastro, 
    // adicione aqui a função que navega pra sua tela
  };

  return (
    <LoginView
      handleSubmit={signIn}
      handleForgotPassword={handleForgotPassword}
      handleSignUp={handleSignUp}
      handleUpdateEmail={setEmail}
      handleUpdatePassword={setPassword}
    />
  );
};
