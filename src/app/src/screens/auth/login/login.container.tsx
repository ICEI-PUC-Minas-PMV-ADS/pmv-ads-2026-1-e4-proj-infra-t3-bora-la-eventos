import { FC, useEffect } from "react";

import { LoginView } from "./login";
import { request, IHttpConfig } from "~/configs/api";
import { TLoginContainerProps } from "./types";

type TempSuccessData = {};
type TempErrorData = {};

export const LoginContainer: FC<TLoginContainerProps> = () => {
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

  useEffect(() => {
    handleGetToken().catch(() => {});
  });
  return <LoginView />;
};
