import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(4, "Quantidade mínima de caracteres é 4"),
    email: z.email({ error: "Email inválido" }),
    document: z.string().length(14, "O campo deve conter 14 caracteres"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
    checkbox: z.boolean().refine((value) => !!value, {
      message: "Os termos precisam ser aceitos",
    }),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    error: "As senhas digitadas não conferem.",
    path: ["confirmPassword"],
  });

registerSchema.required();
type RegisterUserSchema = z.infer<typeof registerSchema>;

export default registerSchema;
export type { RegisterUserSchema };
