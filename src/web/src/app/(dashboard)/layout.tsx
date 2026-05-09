import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AlertProvider } from "@/components/ui/Alert/AlertContext";
import { getCurrentUser } from "@/actions/users.action";
import { UserInfo } from "@/types/user.types";

type DashboardProps = {
	children: React.ReactNode;
};

export default async function DashboardLayout({
	children,
}: Readonly<DashboardProps>) {
	const APP_TOKEN = "auth-token";
	const token = await getToken(APP_TOKEN);

	if (!token) redirect("/login");

	const userInfo: UserInfo = await getCurrentUser();

	return (
		<AlertProvider>
			<div className="flex h-screen bg-gray-50">
				<Sidebar user={userInfo} />
				<div className="flex flex-col flex-1 overflow-hidden">
					<Header />
					<main className="flex-1 overflow-auto">
						{children}
					</main>
				</div>
			</div>
		</AlertProvider>
	);
}
