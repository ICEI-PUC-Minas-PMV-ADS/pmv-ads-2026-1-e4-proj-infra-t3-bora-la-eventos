import { FC, useState } from "react";
import { ToastAndroid } from "react-native";
const { getItem } = useLocalStorage();
import { SignInView } from "./sign-in";
import { request, IHttpConfig } from "~/configs/api";
import { Loading } from "~/components/loading";
import {
  SignInErrorMessage,
  TSignInContainerProps,
  TSignInData,
  TSignInResponseData,
  TSignInResponseError,
} from "./types";
import { useLocalStorage } from "~/util/local-storage";

export const SignInContainer: FC<TSignInContainerProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.CENTER);
  };

  const validateForm = () => {
    const normalizedDocument = document.replace(/\D/g, "");

    if (!name.trim() || !document.trim() || !email.trim() || !password) {
      showToast("Preencha todos os campos para criar sua conta");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      showToast("Informe um e-mail válido");
      return false;
    }

    if (normalizedDocument.length !== 11 && normalizedDocument.length !== 14) {
      showToast("Informe um CPF ou CNPJ válido");
      return false;
    }

    if (password.length < 8) {
      showToast("A senha deve ter no mínimo 8 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("As senhas digitadas não conferem");
      return false;
    }

    return true;
  };

  const signUp = async () => {
    if (!validateForm()) {
      return;
    }

    const token = await getItem("app-token");
    console.log(token);

    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const body: TSignInData = {
      name: name.trim(),
      document: document.replace(/\D/g, ""),
      email: email.trim(),
      password,
    };

    const listeners = {
      onSuccess: () => {
        setIsLoading(false);
        showToast("Conta criada com sucesso");
        navigation.navigate("LoginScreen");
      },
      onError: (error: TSignInResponseError) => {
        setIsLoading(false);

        switch (error?.message) {
          case SignInErrorMessage.CONFLICT:
            return showToast("Já existe uma conta com esses dados");
          case SignInErrorMessage.BAD_REQUEST:
          case SignInErrorMessage.INVALID_BODY:
          case SignInErrorMessage.UNPROCESSABLE_ENTITY:
            return showToast("Verifique os dados digitados e tente novamente");
          case SignInErrorMessage.INVALID_HEADER:
            return showToast(
              "Erro ao enviar. Favor entrar em contato com o suporte",
            );
          case SignInErrorMessage.INTERNAL_SERVER_ERROR:
            return showToast(
              "Falha na comunicação. Tente novamente mais tarde",
            );
          default:
            return showToast(
              "Estamos com problemas. Tente novamente mais tarde",
            );
        }
      },
    };

    const config: IHttpConfig = {
      path: "/users",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "x-request-id": process.env.EXPO_PUBLIC_API_CLIENT_ID,
      },
      body: JSON.stringify(body),
    };

    await request<TSignInResponseData, TSignInResponseError>(config, listeners);
  };

  return (
    <>
      <Loading show={isLoading} />
      <SignInView
        handleGoBack={() => navigation.goBack()}
        handleLogin={() => navigation.navigate("LoginScreen")}
        handleSubmit={signUp}
        handleUpdateConfirmPassword={setConfirmPassword}
        handleUpdateDocument={setDocument}
        handleUpdateEmail={setEmail}
        handleUpdateName={setName}
        handleUpdatePassword={setPassword}
      />
    </>
  );
};
