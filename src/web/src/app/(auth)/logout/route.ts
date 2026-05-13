import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "auth-token";

export async function GET(request: NextRequest) {
	const response = NextResponse.redirect(new URL("/login", request.url));

	response.cookies.set(COOKIE_NAME, "", {
		httpOnly: true,
		maxAge: 0,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});

	return response;
}
