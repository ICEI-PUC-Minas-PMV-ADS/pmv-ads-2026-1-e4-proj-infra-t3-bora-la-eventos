const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
	path: string,
	token?: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!res.ok) throw new Error(await res.text());
	return res.json();
}
