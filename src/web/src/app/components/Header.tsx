"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Plus, ChevronRight } from "lucide-react";

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			if (query) {
				params.set("q", query);
			} else {
				params.delete("q");
			}
			router.replace(`/events?${params.toString()}`);
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query]);

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
						value={query}
						onChange={(e) => setQuery(e.target.value)}
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

			{pathname === "/profile" && (
				<nav className="flex items-center gap-1.5 text-sm">
					<Link href="/events" className="text-gray-500 hover:text-orange-500 transition-colors">
						Eventos
					</Link>
					<ChevronRight size={14} className="text-gray-400" />
					<span className="text-gray-900 font-medium">Meu perfil</span>
				</nav>
			)}

			{pathname !== "/events" && pathname !== "/events/new" && pathname !== "/profile" && <div />}

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
			</div>
		</header>
	);
}
