import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AlertProvider } from "@/components/ui/Alert/AlertContext";

type DashboardProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: Readonly<DashboardProps>) {
  const APP_TOKEN = "auth-token";
  const token = await getToken(APP_TOKEN);

  if (!token) redirect("/login");

	return (
		<AlertProvider>
			<div className="flex h-screen bg-gray-50">
				<Sidebar />
				<div className="flex flex-col flex-1 overflow-hidden">
					<Header />
					<main className="flex-1 overflow-auto">{children}</main>
				</div>
			</div>
		</AlertProvider>
	);
}
