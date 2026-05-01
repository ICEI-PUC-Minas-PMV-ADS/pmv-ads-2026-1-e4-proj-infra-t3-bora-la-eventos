import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(4, "Quantidade mínima de caracteres é 4"),
  email: z.email({ error: "Email inválido" }),
  document: z.string().length(14),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a senha"),
})
.refine((fields) => fields.password === fields.confirmPassword, {
  error: "As senhas digitadas não conferem. Verifique e digite novamente.",
  path: ["confirmPassword"], 
});

registerSchema.required();
type RegisterUserSchema = z.infer<typeof registerSchema>;

export default registerSchema;
export type { RegisterUserSchema };
