import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(4, "Quantidade mínima de caracteres é 4"),
	email: z.string().email("E-mail inválido"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
