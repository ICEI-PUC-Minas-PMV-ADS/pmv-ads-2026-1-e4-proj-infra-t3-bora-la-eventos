import { FC, useEffect, useState } from "react";

import { LoginView } from "./login";
import { request, IHttpConfig } from "~/configs/api";
import { TLoginContainerProps, TLoginData } from "./types";

type TempSuccessData = {};
type TempErrorData = {};

export const LoginContainer: FC<TLoginContainerProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGetToken = async () => {
    const listeners = {
      onSuccess: (data: TempSuccessData) => {
        console.log(data);
      },
      onError: (error: TempErrorData) => console.log(error),
    };

    const config: IHttpConfig = {
      path: "/auth",
      method: "GET",
    };

    await request<TempSuccessData, TempErrorData>(config, listeners);
  };

  const signIn = () => {
    // Envia os dados pra API
    console.log({email, password});
  };

  const handleForgotPassword = () => {
    // has no implementation
  }

  const handleSignUp = () => {
    // navigate to signUp
  }

  useEffect(() => {
    handleGetToken().catch(() => {});
  });

  return (
    <LoginView 
      handleSubmit={signIn}
      handleForgotPassword={handleForgotPassword}
      handleSignUp={handleSignUp}
      handleUpdateEmail={setEmail}
      handleUpdatePassword={setPassword}
    />
  )
};
