"use server";

import { getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { createEventSchema, type CreateEventSchema } from "@/lib/schemas/event.schema";

type ActionResult = { success: boolean; error?: string };

export async function createEventAction(data: CreateEventSchema): Promise<ActionResult> {
	const parsed = createEventSchema.safeParse(data);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0].message };
	}

	const token = await getToken("auth-token");
	if (!token) return { success: false, error: "Sessão expirada, faça login novamente." };

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
		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "erro desconhecido";
		if (message === "FORBIDDEN_ORGANIZER_ONLY") {
			return { success: false, error: "Apenas organizadores podem criar eventos." };
		}
		return { success: false, error: `Erro ao criar evento: ${message}` };
	}
}

export async function updateEventAction(id: string, data: Partial<CreateEventSchema>): Promise<ActionResult> {
	const token = await getToken("auth-token");
	if (!token) return { success: false, error: "Sessão expirada, faça login novamente." };

	const { date, address, category, bannerBase64, latitude, longitude, ...rest } = data;

	const body: Record<string, unknown> = { ...rest };

	if (date) body.date = new Date(date).toISOString();
	if (address) body.address = address;
	if (category) body.category = category;
	if (bannerBase64) body.bannerBase64 = bannerBase64;
	if (latitude !== undefined) body.latitude = latitude;
	if (longitude !== undefined) body.longitude = longitude;

	try {
		await apiFetch(`/events/${id}`, "PATCH", JSON.stringify(body), token);
		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "erro desconhecido";
		return { success: false, error: `Erro ao atualizar evento: ${message}` };
	}
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
	const token = await getToken("auth-token");
	if (!token) return { success: false, error: "Sessão expirada, faça login novamente." };

	try {
		await apiFetch(`/events/${id}`, "DELETE", undefined, token);
		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "erro desconhecido";
		return { success: false, error: `Erro ao excluir evento: ${message}` };
	}
}

export async function pauseEventAction(id: string, currentStatus: string): Promise<ActionResult> {
	const token = await getToken("auth-token");
	if (!token) return { success: false, error: "Sessão expirada, faça login novamente." };

	const newStatus = currentStatus === "paused" ? "published" : "paused";

	try {
		await apiFetch(`/events/${id}`, "PATCH", JSON.stringify({ status: newStatus }), token);
		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "erro desconhecido";
		return { success: false, error: `Erro ao pausar evento: ${message}` };
	}
}

export async function getEventByIdAction(id: string) {
	try {
		return await apiFetch<Record<string, unknown>>(`/events/${id}`, "GET");
	} catch {
		return null;
	}
}

export async function getMyEventsAction() {
	const token = await getToken("auth-token");
	if (!token) return [];

	try {
		return await apiFetch<Record<string, unknown>[]>("/events/mine", "GET", undefined, token);
	} catch {
		return [];
	}
}
