import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";

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
    <div>
      {/* Sidebar, Header, etc */}
      {children}
    </div>
  );
}
