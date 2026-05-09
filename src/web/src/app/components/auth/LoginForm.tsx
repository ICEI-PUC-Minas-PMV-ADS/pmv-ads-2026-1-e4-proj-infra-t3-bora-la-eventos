"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth.schema";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/auth.action";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-5"
		>
			<Input
				id="email"
				label="E-mail"
				type="email"
				placeholder="seu@email.com"
				icon={<Mail size={18} />}
				error={errors.email?.message}
				{...register("email")}
			/>

			<Input
				id="password"
				label="Senha"
				type="password"
				placeholder="Digite sua senha"
				icon={<Lock size={18} />}
				error={errors.password?.message}
				{...register("password")}
			/>

			{serverError && (
				<p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-md">
					{serverError}
				</p>
			)}

			<Button
				type="submit"
				isLoading={isSubmitting}
				loadingText="Entrando..."
				iconRight={<ArrowRight size={18} />}
			>
				Entrar
			</Button>
		</form>
	);
}
