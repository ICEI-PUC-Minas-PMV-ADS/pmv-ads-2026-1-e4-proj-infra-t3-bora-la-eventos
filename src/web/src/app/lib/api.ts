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

interface ApiErrorBody {
	message?: string;
	code?: string;
	errors?: Record<string, string[]>;
}

const MAX_ERROR_PREVIEW_LENGTH = 200;

function extractErrorMessage(status: number, responseText: string): string {
	const fallback = `HTTP ${status}`;
	if (!responseText) return fallback;
	try {
		const body: ApiErrorBody = JSON.parse(responseText);
		if (body.errors) {
			const details = Object.entries(body.errors)
				.map(
					([field, messages]) =>
						`${field}: ${messages.join(", ")}`,
				)
				.join(" | ");
			return `${fallback} — ${details}`;
		}

		return body.message ?? body.code ?? fallback;
	} catch {
		return `${fallback} — ${responseText.slice(0, MAX_ERROR_PREVIEW_LENGTH)}`;
	}
}

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

	const responseText = await res.text();

	if (!res.ok) {
		throw new Error(extractErrorMessage(res.status, responseText));
	}

	return (responseText ? JSON.parse(responseText) : undefined) as T;
}
