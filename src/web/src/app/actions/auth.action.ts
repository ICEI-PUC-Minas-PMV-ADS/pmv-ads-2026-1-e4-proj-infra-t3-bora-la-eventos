"use server";

import { redirect } from "next/navigation";
import { setToken } from "@/lib/auth";
import { apiFetch, getAppToken } from "@/lib/api";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth.schema";

export async function loginAction(data: LoginSchema) {
	const parsed = loginSchema.safeParse(data);

	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0].message };
	}

	try {
		const appToken = await getAppToken();

		const { token } = await apiFetch<{ token: string }>(
			"/auth/login",
			"POST",
			JSON.stringify(parsed.data),
			appToken,
		);

		await setToken(token);
	} catch (error: any) {
		if (error.message === "INVALID_CREDENTIALS") {
			return {
				success: false,
				error: "Credenciais inválidas, verifique e tente novamente.",
			};
		}

		return {
			success: false,
			error: "Houve um erro ao fazer login, tente novamente mais tarde.",
		};
	}

	redirect("/events");
}
