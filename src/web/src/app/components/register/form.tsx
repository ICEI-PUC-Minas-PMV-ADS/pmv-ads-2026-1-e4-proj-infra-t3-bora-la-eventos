"use client";

import { ArrowRight, Lock, Mail, Store, User} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createUserAction } from "@/actions/users.action";
import { CreateUserResponse, DefaultHttpResponse } from "@/types/http.types";
import { CustomParagraph } from "../ui/CustomParagraph";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import registerSchema, {
  RegisterUserSchema,
} from "@/lib/schemas/register-form-schema";
import s from "./form.module.css";

type RegisterFormProps = {
  alertHandler: (value: string) => void;
};

export const RegisterForm = ({ alertHandler }: RegisterFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSuccess = (response: DefaultHttpResponse<CreateUserResponse>) => {
    alertHandler(response.message);
    return router.push("/login");
  };
  const onError = (error: DefaultHttpResponse<CreateUserResponse>) => {
    alertHandler(error.message)
  };

  const onSubmit = async (data: RegisterUserSchema) => {
    const response = await createUserAction(data);
    if (response.message === CreateUserResponse.USER_REGISTERED_SUCCESSFULLY) {
      return onSuccess(response);
    }
    return onError(response)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="name"
        label="Nome do Estabelecimento"
        error={errors.name?.message}
        icon={<Store size={18} />}
        {...register("name")}
      />

      <Input
        id="document"
        label="CNPJ"
        placeholder="Apenas números"
        icon={<User size={18} />}
        error={errors.document?.message}
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
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <div className="">
        <div className="flex flex-row gap-x-2">
          <input
            className={s.customCheckbox}
            id="checkbox"
            type="checkbox"
            {...register("checkbox")}
          />
          <CustomParagraph
            paragraph="Ao clicar em criar conta, você aceita nossos {terms} e {policy}."
            options={{
              color: "#EC5B13",
              tokens: {
                terms: "Termos de Uso",
                policy: "Política de Privacidade",
              },
            }}
          />
        </div>
        <p className="text-red-500 text-xs mt-1">{errors.checkbox?.message}</p>
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
};
