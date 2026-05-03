"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, ChevronRight } from "lucide-react";

export default function Header() {
	const pathname = usePathname();

	return (
		<header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shrink-0">
			{/* LADO ESQUERDO */}
			{pathname === "/events" && (
				<div className="relative flex items-center">
					<div className="absolute left-3 text-gray-400 pointer-events-none">
						<Search size={16} />
					</div>
					<input
						type="text"
						placeholder="Buscar eventos..."
						className="bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-lg py-2 pl-9 pr-4 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder:text-gray-400 w-64"
					/>
				</div>
			)}

			{pathname === "/events/new" && (
				<nav className="flex items-center gap-1.5 text-sm">
					<Link href="/events" className="text-gray-500 hover:text-orange-500 transition-colors">
						Eventos
					</Link>
					<ChevronRight size={14} className="text-gray-400" />
					<span className="text-gray-900 font-medium">Criar Novo Evento</span>
				</nav>
			)}

			{pathname !== "/events" && pathname !== "/events/new" && <div />}

			{/* LADO DIREITO */}
			<div className="flex items-center gap-3">
				{pathname === "/events" && (
					<Link
						href="/events/new"
						className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2460a] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
					>
						<Plus size={16} />
						Criar Novo Evento
					</Link>
				)}
				<button
					type="button"
					className="text-gray-500 hover:text-gray-700 transition-colors"
					aria-label="Notificações"
				>
					<Bell size={20} />
				</button>
			</div>
		</header>
	);
}
