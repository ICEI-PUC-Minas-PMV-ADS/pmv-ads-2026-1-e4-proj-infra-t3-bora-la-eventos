"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, PlusCircle, Calendar, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth.action";

interface SidebarProps {
	user?: {
		name: string;
		role?: string;
	};
}

const ROLE_LABELS: Record<string, string> = {
	user: "Usuário",
	organizer: "Organizador",
	admin: "Administrador",
};

const menuItems = [
	{ name: "Criar Evento", href: "/events/new", icon: PlusCircle },
	{ name: "Eventos", href: "/events", icon: Calendar },
];

export default function Sidebar({ user }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
				<div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
					<Store size={18} className="text-orange-500" />
				</div>
				<div>
					<p className="text-xs font-bold text-gray-900 tracking-wide">
						{user?.name || "Usuário"}
					</p>
					<p className="text-[11px] text-gray-400 mt-0.5">
						{user?.role || "Usuário"}
					</p>
				</div>
			</div>

			{/* Menu */}
			<nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
								isActive
									? "bg-orange-50 text-orange-500 font-semibold"
									: "text-gray-700 hover:bg-gray-50"
							}`}
						>
							<item.icon
								size={18}
								className={
									isActive
										? "text-orange-500"
										: "text-gray-400"
								}
							/>
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className="p-2 border-t border-gray-100">
				<button
					onClick={async () => await logoutAction()}
					className="flex items-center cursor-pointer gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
				>
					<LogOut size={18} />
					<span>Sair</span>
				</button>
			</div>
		</div>
	);
}
