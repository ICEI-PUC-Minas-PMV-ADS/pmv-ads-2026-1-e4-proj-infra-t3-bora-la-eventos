import { cookies } from "next/headers";

export async function getToken(cookieName: string) {
	const cookieStore = await cookies();

	const token = cookieStore.get(cookieName)?.value;

	return token;
}

export async function setToken(cookieName: string,token: string) {
	const cookieStore = await cookies();

	const newToken = cookieStore.set(cookieName, token, {
		httpOnly: true,

		maxAge: 60 * 60 * 24 * 30,

		value: token,

		path: "/",

		sameSite: true,

		secure: process.env.NODE_ENV === "production",
	});

	return newToken;
}

export async function removeToken(cookieName: string) {
	const cookieStore = await cookies();

	cookieStore.delete(cookieName);
}
