import type { HttpMethod } from "@/types/auth,types";
import { unstable_cache } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.API_CLIENT_ID!;
const CLIENT_SECRET = process.env.API_CLIENT_SECRET;

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

	const response = (await res.json()) || {};

	console.log(response);

	if (!res.ok) {
		console.log(res);

		throw new Error(
			typeof response === "string"
				? response || "Request failed"
				: "Request failed",
		);
	}

	return response as T;
}
