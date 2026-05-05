"use server";

import { apiFetch } from "@/lib/api";
import { CreateUserResponse, DefaultHttpResponse } from "@/types/http.types";
import { getToken } from "@/lib/auth";
import { UserInfo } from "@/types/user.types";

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
		const AUTH_COOKIE_NAME = "auth-token";
		const token = await getToken(AUTH_COOKIE_NAME);

		const response = await apiFetch<
			DefaultHttpResponse<CreateUserResponse>
		>("/users", "POST", JSON.stringify(data), token);
		return response;
	} catch (error) {
		const defaultError = error as DefaultHttpResponse<CreateUserResponse>;
		return defaultError;
	}
};

export async function getCurrentUser(): Promise<UserInfo> {
	const token = await getToken("auth-token");
	return await apiFetch("/users/me", "GET", undefined, token);
}
