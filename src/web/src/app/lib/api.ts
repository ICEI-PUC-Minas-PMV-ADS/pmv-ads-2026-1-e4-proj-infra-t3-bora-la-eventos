import type { HttpMethod } from "@/types/http.types";
import { unstable_cache } from "next/cache";
import { getRequiredEnv } from "./utils";

const BASE_URL = getRequiredEnv("NEXT_PUBLIC_API_URL");
const CLIENT_ID = getRequiredEnv("API_CLIENT_ID");
const CLIENT_SECRET = getRequiredEnv("API_CLIENT_SECRET");

export const getAppToken = unstable_cache(
	async (): Promise<string> => {
		const res = await fetch(`${BASE_URL}/auth/pre-login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ClientID: CLIENT_ID,
				ClientSecret: CLIENT_SECRET,
			}),
		});

		if (!res.ok) throw new Error("Failed to get app token");

		const { token } = await res.json();
		return token;
	},
	["app-token"],
	{
		revalidate: 60 * 18,
	},
);

export async function apiFetch<T>(
	path: string,
	method: HttpMethod,
	body?: BodyInit,
	token?: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		method,
		headers: {
			"Content-Type": "application/json",
			"x-request-id": CLIENT_ID,
			...(token ? { Authorization: `${token}` } : {}),
			...options.headers,
		},
		body,
	});

	const text = await res.text();

	if (!res.ok) {
		let message = `HTTP ${res.status}`;
		try {
			const data = JSON.parse(text);
			// ASP.NET Core model validation returns { errors: { Field: ["msg"] } }
			if (data.errors) {
				const fields = Object.entries(data.errors)
					.map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
					.join(" | ");
				message = `${message} — ${fields}`;
			} else {
				message = data.message ?? data.code ?? message;
			}
		} catch {
			if (text) message = `${message} — ${text.slice(0, 200)}`;
		}
		throw new Error(message);
	}

	if (!text) return undefined as T;

	return JSON.parse(text) as T;
}
