"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth.schema";
// import { loginAction } from "@/actions/auth.action";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/auth.action";

export default function LoginForm() {
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

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
			{/* Campo E-mail */}
			<div className="flex flex-col gap-2">
				<label
					htmlFor="email"
					className="text-sm font-semibold text-slate-700"
				>
					E-mail
				</label>
				<div className="relative flex items-center">
					<div className="absolute left-3 text-slate-400">
						<Mail size={18} />
					</div>
					<input
						id="email"
						{...register("email")}
						type="email"
						placeholder="seu@email.com"
						className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all placeholder:text-slate-400"
					/>
				</div>
				{errors.email && (
					<p className="text-red-500 text-xs mt-1">
						{errors.email.message}
					</p>
				)}
			</div>

			{/* Campo Senha */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor="password"
						className="text-sm font-semibold text-slate-700"
					>
						Senha
					</label>
					<Link
						href="/forgot-password"
						className="text-xs font-semibold text-[#f97316] hover:underline"
					>
						Esqueci minha senha
					</Link>
				</div>
				<div className="relative flex items-center">
					<div className="absolute left-3 text-slate-400">
						<Lock size={18} />
					</div>
					<input
						id="password"
						{...register("password")}
						type={showPassword ? "text" : "password"}
						placeholder="Digite sua senha"
						className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-10 py-3 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all placeholder:text-slate-400"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
					>
						{showPassword ? (
							<EyeOff size={18} />
						) : (
							<Eye size={18} />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-red-500 text-xs mt-1">
						{errors.password.message}
					</p>
				)}
			</div>

			{serverError && (
				<p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-md">
					{serverError}
				</p>
			)}

			{/* Botão de Submit */}

			<button
				type="submit"
				disabled={isSubmitting}
				className="mt-2 w-full bg-[#ea580c] hover:bg-[#dea808] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
			>
				{isSubmitting ? "Entrando..." : "Entrar"}
				{!isSubmitting && <ArrowRight size={18} />}
			</button>
		</form>
	);
}
