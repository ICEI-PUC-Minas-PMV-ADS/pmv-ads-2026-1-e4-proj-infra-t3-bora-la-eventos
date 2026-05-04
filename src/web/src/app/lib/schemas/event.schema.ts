import { z } from "zod";

export const EVENT_CATEGORIES = [
	"Musica",
	"Esporte",
	"Arte",
	"Gastronomia",
	"Tecnologia",
	"Negocios",
	"Festas",
	"Outro",
] as const;

export const EVENT_CATEGORY_LABELS: Record<typeof EVENT_CATEGORIES[number], string> = {
	Musica: "Música",
	Esporte: "Esporte",
	Arte: "Arte",
	Gastronomia: "Gastronomia",
	Tecnologia: "Tecnologia",
	Negocios: "Negócios",
	Festas: "Festas",
	Outro: "Outro",
};

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 10;

export const createEventSchema = z.object({
	title: z.string().min(MIN_TITLE_LENGTH, "Título deve ter pelo menos 3 caracteres"),
	description: z.string().min(MIN_DESCRIPTION_LENGTH, "Descrição deve ter pelo menos 10 caracteres"),
	category: z.preprocess(
		(val) => (val === "" ? undefined : val),
		z.enum(EVENT_CATEGORIES).optional(),
	),
	date: z.string().min(1, "Data e hora são obrigatórias"),
	location: z.string().min(3, "Local do evento é obrigatório"),
	address: z.object({
		street: z.string().min(1, "Rua é obrigatória"),
		number: z.string().min(1, "Número é obrigatório"),
		city: z.string().min(1, "Cidade é obrigatória"),
		state: z.string().min(1, "Estado é obrigatório"),
		zipCode: z.string().min(1, "CEP é obrigatório"),
	}),
	capacity: z.coerce.number().int().min(1, "Capacidade deve ser pelo menos 1"),
	latitude: z.coerce.number().optional(),
	longitude: z.coerce.number().optional(),
	bannerBase64: z.string().optional(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
