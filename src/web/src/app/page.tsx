import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";

export default async function RootPage() {
	const APP_TOKEN = "auth-token";
	const token = await getToken(APP_TOKEN);

	if (token) redirect("/events");
	else redirect("/login");
}
