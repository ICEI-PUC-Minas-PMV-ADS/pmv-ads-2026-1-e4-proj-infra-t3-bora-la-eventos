import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";

export default async function RootPage() {
	const token = await getToken();

	if (token) redirect("/events");
	else redirect("/login");
}
