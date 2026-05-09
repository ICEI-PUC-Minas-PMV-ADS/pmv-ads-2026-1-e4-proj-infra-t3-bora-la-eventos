"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Mail, UserRound, IdCard } from "lucide-react";
import {
	profileSchema,
	type ProfileSchema,
} from "@/lib/schemas/profile.schema";
import { updateProfileAction } from "@/actions/users.action";
import { AlertTypes, useAlert } from "@/components/ui";
import { UserInfo } from "@/types/user.types";

type ProfileFormProps = {
	user: UserInfo;
};

export default function ProfileForm({ user }: ProfileFormProps) {
	const router = useRouter();
	const { showAlert } = useAlert();
	const [submitting, setSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
		mode: "onChange",
		defaultValues: {
			name: user.name,
			email: user.email,
		},
	});

	async function onSubmit(data: ProfileSchema) {
		setSubmitting(true);
		const result = await updateProfileAction(data);

		if (result.success) {
			showAlert("Perfil atualizado com sucesso!", AlertTypes.SUCCESS);
			router.refresh();
		} else {
			showAlert(
				result.error ?? "Erro ao atualizar perfil.",
				AlertTypes.ERROR,
			);
		}

		setSubmitting(false);
	}

	const inputClass =
		"w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder:text-gray-400 text-gray-800";
	const labelClass = "block text-sm font-medium text-gray-700 mb-1";
	const errorClass = "text-xs text-red-500 mt-1";

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-8"
		>
			<section>
				<div className="flex items-center gap-3 mb-5">
					<div className="w-7 h-7 rounded-full bg-[#ea580c] text-white text-sm font-bold flex items-center justify-center shrink-0">
						1
					</div>
					<h2 className="text-xl font-bold text-gray-900">
						Dados do Organizador
					</h2>
				</div>
				<div className="border-b border-gray-200 mb-5" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className={labelClass}>
							Nome do Estabelecimento
						</label>
						<div className="relative">
							<UserRound
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								{...register("name")}
								placeholder="Nome do estabelecimento"
								className={`${inputClass} pl-9`}
							/>
						</div>
						{errors.name && (
							<p className={errorClass}>
								{errors.name.message}
							</p>
						)}
					</div>

					<div>
						<label className={labelClass}>E-mail</label>
						<div className="relative">
							<Mail
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								{...register("email")}
								type="email"
								placeholder="seu@email.com"
								className={`${inputClass} pl-9`}
							/>
						</div>
						{errors.email && (
							<p className={errorClass}>
								{errors.email.message}
							</p>
						)}
					</div>
				</div>
			</section>

			<div className="flex items-center justify-end pb-8">
				<button
					type="submit"
					disabled={submitting}
					className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#ea580c] hover:bg-[#c2460a] rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
				>
					{submitting && (
						<Loader2 size={15} className="animate-spin" />
					)}
					{submitting ? "Salvando..." : "Salvar alterações"}
				</button>
			</div>
		</form>
	);
}
