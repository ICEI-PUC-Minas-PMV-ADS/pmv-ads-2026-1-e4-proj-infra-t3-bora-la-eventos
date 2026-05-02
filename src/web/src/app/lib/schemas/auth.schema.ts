import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
