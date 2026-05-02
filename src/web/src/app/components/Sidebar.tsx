"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, PlusCircle, Calendar, User } from "lucide-react";

const menuItems = [
  { name: "Criar Evento", href: "/events/new", icon: PlusCircle },
  { name: "Eventos", href: "/events", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
          <Store size={18} className="text-orange-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 tracking-wide">GERENTE DO LOCAL</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Admin do Estabelecimento</p>
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
                className={isActive ? "text-orange-500" : "text-gray-400"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-t border-slate-100">
        <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
          <User size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900">Alex Rivera</p>
          <p className="text-[11px] text-gray-400 truncate">Proprietário do Estabelecimento</p>
        </div>
      </div>
    </div>
  );
}
