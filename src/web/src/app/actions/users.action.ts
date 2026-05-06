"use server";

import { apiFetch, getAppToken } from "@/lib/api";
import { CreateUserResponse, DefaultHttpResponse } from "@/types/http.types";
import { getToken } from "@/lib/auth";
import { UserInfo } from "@/types/user.types";
import {
	profileSchema,
	type ProfileSchema,
} from "@/lib/schemas/profile.schema";

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

		const response = await apiFetch<
			DefaultHttpResponse<CreateUserResponse>
		>("/users", "POST", JSON.stringify(data), token);
		console.log(response);
		return response;
	} catch (error) {
		console.log(error);
		const defaultError = error as DefaultHttpResponse<CreateUserResponse>;
		return defaultError;
	}
};

export async function getCurrentUser(): Promise<UserInfo> {
	const token = await getToken("auth-token");
	return await apiFetch("/users/me", "GET", undefined, token);
}

type ActionResult = { success: boolean; error?: string };

export async function updateProfileAction(
	data: ProfileSchema,
): Promise<ActionResult> {
	const parsed = profileSchema.safeParse(data);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0].message };
	}

	const token = await getToken("auth-token");
	if (!token) {
		return {
			success: false,
			error: "Sessão expirada, faça login novamente.",
		};
	}

	try {
		await apiFetch<UserInfo>(
			`/users/me`,
			"PUT",
			JSON.stringify(parsed.data),
			token,
		);

		return { success: true };
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "erro desconhecido";
		return {
			success: false,
			error: `Erro ao atualizar perfil: ${message}`,
		};
	}
}
