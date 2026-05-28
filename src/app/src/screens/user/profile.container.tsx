import { FC, useState } from "react";
import { ToastAndroid } from "react-native";

import { request, IHttpConfig } from "~/configs/api";
import { Loading } from "~/components/loading";
import { useLocalStorage } from "~/util/local-storage";
import { IUser, useUserStore } from "~/configs/state/user-store";
import {
  ProfileErrorMessage,
  TProfileContainerProps,
  TUpdateProfileData,
  TUpdateProfileResponseData,
  TUpdateProfileResponseError,
} from "./types";
import { ProfileView } from "./profile";

export const ProfileContainer: FC<TProfileContainerProps> = () => {
  const { currentUser, updateUser } = useUserStore();
  const user = currentUser as IUser;
  const { getItem } = useLocalStorage();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.CENTER);
  };

  const validateForm = () => {
    if (!name.trim() || !email.trim()) {
      showToast("Preencha nome e e-mail para atualizar o perfil");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      showToast("Informe um e-mail válido");
      return false;
    }

    if (password && password.length < 8) {
      showToast("A senha deve ter no mínimo 8 caracteres");
      return false;
    }

    return true;
  };

  const updateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const token = await getItem("user-token");
    const body: TUpdateProfileData = {
      name: name.trim(),
      email: email.trim(),
    };

    const listeners = {
      onSuccess: (data: TUpdateProfileResponseData) => {
        const updatedUser = data ?? {
          ...user,
          name: body.name,
          email: body.email,
        };

        updateUser(updatedUser);
        setPassword("");
        setIsLoading(false);
        showToast("Perfil atualizado com sucesso");
      },
      onError: (error: TUpdateProfileResponseError) => {
        setIsLoading(false);

        switch (error?.message) {
          case ProfileErrorMessage.CONFLICT:
            return showToast("Já existe uma conta com esse e-mail");
          case ProfileErrorMessage.BAD_REQUEST:
          case ProfileErrorMessage.INVALID_BODY:
          case ProfileErrorMessage.UNPROCESSABLE_ENTITY:
            return showToast("Verifique os dados digitados e tente novamente");
          case ProfileErrorMessage.INVALID_HEADER:
          case ProfileErrorMessage.UNAUTHORIZED:
            return showToast("Faça login novamente para atualizar seu perfil");
          case ProfileErrorMessage.INTERNAL_SERVER_ERROR:
            return showToast("Falha na comunicação. Tente novamente mais tarde");
          default:
            return showToast("Estamos com problemas. Tente novamente mais tarde");
        }
      },
    };

    const config: IHttpConfig = {
      path: "/users/me",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
        "x-request-id": process.env.EXPO_PUBLIC_API_CLIENT_ID,
      },
      body: JSON.stringify(body),
    };

    await request<TUpdateProfileResponseData, TUpdateProfileResponseError>(
      config,
      listeners,
    );
  };

  return (
    <>
      <Loading show={isLoading} />
      <ProfileView
        email={email}
        handleSubmit={updateProfile}
        handleUpdateEmail={setEmail}
        handleUpdateName={setName}
        handleUpdatePassword={setPassword}
        name={name}
        password={password}
      />
    </>
  );
};
