// actions/auth.action.ts
"use server";

import { redirect } from "next/navigation";
import { setToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { LoginSchema } from "@/lib/schemas/auth.schema";
import { loginSchema } from "@/lib/schemas/auth.schema";

export async function loginAction(data: LoginSchema) {
	const parsed = loginSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0].message,
		};
	}

	try {
		const { token } = await apiFetch<{ token: string }>(
			"/auth/login",
			undefined,
			{
				method: "POST",
				body: JSON.stringify(parsed.data),
			},
		);

		await setToken(token);
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Erro ao fazer login",
		};
	}

	redirect("/dashboard");
}
