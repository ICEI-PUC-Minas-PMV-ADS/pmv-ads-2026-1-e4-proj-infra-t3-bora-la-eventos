import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

export async function getToken() {
	const cookieStore = await cookies();

	const token = cookieStore.get(COOKIE_NAME)?.value;

	return token;
}

export async function setToken(token: string) {
	const cookieStore = await cookies();

	const newToken = cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,

		maxAge: 60 * 60 * 24 * 30,

		value: token,

		path: "/",

		sameSite: true,

		secure: process.env.NODE_ENV === "production",
	});

	return newToken;
}

export async function removeToken() {
	const cookieStore = await cookies();

	cookieStore.delete(COOKIE_NAME);
}
