"use server";

import { apiFetch, getAppToken } from "@/lib/api";
import { CreateUserResponse, DefaultHttpResponse } from "@/types/http.types";

interface ICreateUserData {
  checkbox: boolean;
  confirmPassword: string;
  document: string;
  email: string;
  name: string;
  password: string;
}

type CreateUserAction = (
  data: ICreateUserData,
) => Promise<DefaultHttpResponse<CreateUserResponse>>;

export const createUserAction: CreateUserAction = async (data) => {
  try {
    const token = await getAppToken();
    const response = await apiFetch<DefaultHttpResponse<CreateUserResponse>>(
      "/users",
      "POST",
      JSON.stringify(data),
      token,
    );
    return response;
  } catch (error) {
    const defaultError = error as DefaultHttpResponse<CreateUserResponse>;
    return defaultError;
  }
};
