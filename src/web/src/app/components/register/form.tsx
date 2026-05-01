"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema, {
  RegisterUserSchema,
} from "@/lib/schemas/register-form-schema";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Store, User } from "lucide-react";
import { loginAction } from "@/actions/auth.action";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import s from "./form.module.css";
import { CustomParagraph } from "../ui/CustomParagraph";

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(data: RegisterUserSchema) {
    setServerError(null);
    const result = await loginAction(data);

    if (result?.success === false) {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="name"
        label="Nome do Estabelecimento"
        error={errors.email?.message}
        icon={<Store size={18} />}
        {...register("name")}
      />

      <Input
        id="document"
        label="CNPJ"
        placeholder="Apenas números"
        icon={<User size={18} />}
        error={errors.email?.message}
        {...register("document")}
      />

      <Input
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex flex-row gap-x-3">
        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirmar Senha"
          type="password"
          placeholder="Digite sua senha"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div className="flex flex-row gap-x-2">
        <input 
          className={s.customCheckbox}
          id="privacy-policy"
          type="checkbox" 
        />
        <CustomParagraph
           paragraph="Ao clicar em criar conta, você aceita nossos {terms} e {policy}."
           options={{
            color: "#EC5B13",
            tokens: {
              terms: "Termos de Uso",
              policy: "Política de Privacidade"
            }
           }}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Entrando..."
        iconRight={<ArrowRight size={18} />}
      >
        Entrar
      </Button>
    </form>
  );
}
