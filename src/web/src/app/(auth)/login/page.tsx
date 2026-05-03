import LoginForm from "@/components/auth/LoginForm";
import { getToken } from "@/lib/auth";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const APP_TOKEN = "auth-token";
	const token = await getToken(APP_TOKEN);

	if (token) redirect("/events");

	return (
		<div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden font-sans">
			{/* Header */}

			<header className="p-6 absolute top-0 left-0 w-full">
				<div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#f97316]">
					<Calendar size={24} />
				</div>
			</header>

			{/* Container Principal */}

			<main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-[440px] mx-auto z-10">
				<div className="w-full mb-8 text-center sm:text-left">
					<h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
						Acessar Dashboard
					</h1>
					<p className="text-slate-500 text-sm leading-relaxed">
						Entre com suas credenciais para gerenciar os
						eventos do seu
						<br className="hidden sm:block" />
						estabelecimento
					</p>
				</div>

				<div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100">
					<LoginForm />

					<div className="mt-8 text-center text-sm text-slate-500">
						Não tem uma conta?{" "}
						<Link
							href="/register"
							className="text-[#f97316] font-semibold hover:underline"
						>
							Criar conta agora
						</Link>
					</div>
				</div>
			</main>

			{/* Footer */}

			<footer className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 z-10">
				<p>©2026 PUC Minas</p>
			</footer>
		</div>
	);
}
