import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { CreateUserResponse, DefaultHttpResponse } from "@/types/http.types";

interface ICreateUserData {
  checkbox: boolean;
  confirmPassword: string;
  document: string;
  email: string;
  name: string;
  password: string;
}

type CreateUserActionProps = {
  data: ICreateUserData;
  onSuccess: (response: DefaultHttpResponse<CreateUserResponse>) => void;
  onError: (error: DefaultHttpResponse<CreateUserResponse>) => void;
};

type CreateUserAction = (props: CreateUserActionProps) => Promise<void>;


export const createUserAction: CreateUserAction = async ({
  data,
  onError,
  onSuccess,
}) => {
  try {
    const AUTH_COOKIE_NAME = "auth-token";
    const token = await getToken(AUTH_COOKIE_NAME);

    const response = await apiFetch<DefaultHttpResponse<CreateUserResponse>>(
      "/users",
      "POST",
      JSON.stringify(data),
      token,
    );
    return onSuccess(response);
  } catch (error) {
    const defaultError = error as DefaultHttpResponse<CreateUserResponse>;
    return onError(defaultError);
  }
};
