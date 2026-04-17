"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth.schema";
import { loginAction } from "@/actions/auth.action";
import { useState } from "react";

export default function LoginForm() {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	async function onSubmit(data: LoginSchema) {
		setServerError(null);
		const result = await loginAction(data);
		if (result?.success === false) {
			setServerError(result.error);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<input
					{...register("email")}
					type="email"
					placeholder="seu@email.com"
				/>
				{errors.email && (
					<p className="text-red-500">{errors.email.message}</p>
				)}
			</div>

			<div>
				<input
					{...register("password")}
					type="password"
					placeholder="Digite sua senha"
				/>
				{errors.password && (
					<p className="text-red-500">
						{errors.password.message}
					</p>
				)}
			</div>

			{serverError && <p className="text-red-500">{serverError}</p>}

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Entrando..." : "Entrar"}
			</button>
		</form>
	);
}
