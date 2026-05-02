import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const token = await getToken();

	if (!token) redirect("/login");

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<div className="flex flex-col flex-1 overflow-hidden">
				<Header />
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
