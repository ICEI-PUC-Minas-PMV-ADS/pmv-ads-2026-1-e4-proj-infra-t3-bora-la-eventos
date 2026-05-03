"use server";

import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { createEventSchema, type CreateEventSchema } from "@/lib/schemas/event.schema";

export async function createEventAction(data: CreateEventSchema) {
	const parsed = createEventSchema.safeParse(data);

	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0].message };
	}

	const token = await getToken();
	if (!token) {
		return { success: false, error: "Sessão expirada, faça login novamente." };
	}

	const { date, address, category, bannerBase64, latitude, longitude, ...rest } = parsed.data;

	const body: Record<string, unknown> = {
		...rest,
		date: new Date(date).toISOString(),
		address: {
			street: address.street,
			number: address.number,
			city: address.city,
			state: address.state,
			zipCode: address.zipCode,
		},
	};

	if (category) body.category = category;
	if (bannerBase64) body.bannerBase64 = bannerBase64;
	if (latitude !== undefined) body.latitude = latitude;
	if (longitude !== undefined) body.longitude = longitude;

	try {
		await apiFetch("/events", "POST", JSON.stringify(body), token);
	} catch (error: any) {
		if (error?.message === "FORBIDDEN_ORGANIZER_ONLY") {
			return { success: false, error: "Apenas organizadores podem criar eventos." };
		}
		return { success: false, error: `Erro ao criar evento: ${error?.message ?? "erro desconhecido"}` };
	}

	redirect("/events");
}
