"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ImagePlus, X, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
	createEventSchema,
	type CreateEventSchema,
	EVENT_CATEGORIES,
	EVENT_CATEGORY_LABELS,
} from "@/lib/schemas/event.schema";
import { createEventAction } from "@/actions/events.action";

const EventLocationMap = dynamic(() => import("@/components/EventLocationMap"), { ssr: false });

export default function NewEventPage() {
	const [bannerPreview, setBannerPreview] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateEventSchema>({
		resolver: zodResolver(createEventSchema),
	});

	function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const base64 = reader.result as string;
			setBannerPreview(base64);
			setValue("bannerBase64", base64);
		};
		reader.readAsDataURL(file);
	}

	function removeBanner() {
		setBannerPreview(null);
		setValue("bannerBase64", undefined);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleLocationSelect(
		lat: number,
		lng: number,
		parts: { street: string; number: string; city: string; state: string; zipCode: string },
	) {
		setValue("latitude", lat);
		setValue("longitude", lng);
		if (parts.street) setValue("address.street", parts.street);
		if (parts.number) setValue("address.number", parts.number);
		if (parts.city) setValue("address.city", parts.city);
		if (parts.state) setValue("address.state", parts.state);
		if (parts.zipCode) setValue("address.zipCode", parts.zipCode);
	}

	async function onSubmit(data: CreateEventSchema) {
		setSubmitting(true);
		setServerError(null);
		const result = await createEventAction(data);
		if (result?.success === false) {
			setServerError(result.error);
			setSubmitting(false);
		}
	}

	const inputClass =
		"w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder:text-gray-400 text-gray-800";
	const labelClass = "block text-sm font-medium text-gray-700 mb-1";
	const errorClass = "text-xs text-red-500 mt-1";

	return (
		<div className="max-w-3xl mx-auto px-8 py-8">
			{/* Page title */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Criar Novo Evento</h1>
				<p className="text-sm text-gray-500 mt-1">
					Rascunhe sua próxima grande reunião e alcance seu público instantaneamente.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
				{/* ── Seção 1: Informações Básicas ── */}
				<section>
					<div className="flex items-center gap-3 mb-5">
						<div className="w-7 h-7 rounded-full bg-[#ea580c] text-white text-sm font-bold flex items-center justify-center shrink-0">
							1
						</div>
						<h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
					</div>
					<div className="border-b border-gray-200 mb-5" />

					<div className="flex flex-col gap-5">
						{/* Banner upload */}
						<div>
							<label className={labelClass}>
								Banner do Evento{" "}
								<span className="text-gray-400 font-normal">(opcional)</span>
							</label>
							{bannerPreview ? (
								<div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
									<img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
									<button
										type="button"
										onClick={removeBanner}
										className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
									>
										<X size={14} className="text-white" />
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="w-full h-36 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-orange-300 hover:text-orange-400 transition-colors"
								>
									<ImagePlus size={28} />
									<span className="text-sm">Clique para adicionar um banner</span>
									<span className="text-xs">PNG, JPG ou WEBP — máx. 1 MB</span>
								</button>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/png,image/jpeg,image/webp"
								className="hidden"
								onChange={handleBannerChange}
							/>
						</div>

						{/* Título */}
						<div>
							<label className={labelClass}>Título do Evento</label>
							<input
								{...register("title")}
								placeholder="ex: Música ao vivo (voz e violão)"
								className={inputClass}
							/>
							{errors.title && <p className={errorClass}>{errors.title.message}</p>}
						</div>

						{/* Descrição */}
						<div>
							<label className={labelClass}>Descrição</label>
							<textarea
								{...register("description")}
								rows={4}
								placeholder="Conte aos seus participantes sobre o evento..."
								className={`${inputClass} resize-none`}
							/>
							{errors.description && <p className={errorClass}>{errors.description.message}</p>}
						</div>

						{/* Categoria */}
						<div>
							<label className={labelClass}>Categoria</label>
							<select {...register("category")} className={inputClass}>
								<option value="">Selecionar Categoria</option>
								{EVENT_CATEGORIES.map((cat) => (
									<option key={cat} value={cat}>
										{EVENT_CATEGORY_LABELS[cat]}
									</option>
								))}
							</select>
							{errors.category && <p className={errorClass}>{errors.category.message}</p>}
						</div>
					</div>
				</section>

				{/* ── Seção 2: Data e Local ── */}
				<section>
					<div className="flex items-center gap-3 mb-5">
						<div className="w-7 h-7 rounded-full bg-[#ea580c] text-white text-sm font-bold flex items-center justify-center shrink-0">
							2
						</div>
						<h2 className="text-xl font-bold text-gray-900">Data e Local</h2>
					</div>
					<div className="border-b border-gray-200 mb-5" />

					<div className="flex flex-col gap-5">
						{/* Data */}
						<div>
							<label className={labelClass}>Data e Hora de Início</label>
							<input {...register("date")} type="datetime-local" className={inputClass} />
							{errors.date && <p className={errorClass}>{errors.date.message}</p>}
						</div>

						{/* Local descritivo */}
						<div>
							<label className={labelClass}>Local do Evento</label>
							<input
								{...register("location")}
								placeholder="ex: Teatro Municipal de São Paulo"
								className={inputClass}
							/>
							{errors.location && <p className={errorClass}>{errors.location.message}</p>}
						</div>

						{/* Mapa */}
						<div>
							<label className={labelClass}>
								Localização no Mapa{" "}
								<span className="text-gray-400 font-normal">(opcional — clique ou busque)</span>
							</label>
							<EventLocationMap onLocationSelect={handleLocationSelect} />
						</div>

						{/* Endereço */}
						<div className="flex flex-col gap-3">
							<div className="grid grid-cols-[1fr_112px] gap-3">
								<div>
									<label className={labelClass}>Rua</label>
									<input
										{...register("address.street")}
										placeholder="Nome da rua"
										className={inputClass}
									/>
									{errors.address?.street && (
										<p className={errorClass}>{errors.address.street.message}</p>
									)}
								</div>
								<div>
									<label className={labelClass}>Número</label>
									<input
										{...register("address.number")}
										placeholder="Nº"
										className={inputClass}
									/>
									{errors.address?.number && (
										<p className={errorClass}>{errors.address.number.message}</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className={labelClass}>Cidade</label>
									<input
										{...register("address.city")}
										placeholder="Cidade"
										className={inputClass}
									/>
									{errors.address?.city && (
										<p className={errorClass}>{errors.address.city.message}</p>
									)}
								</div>
								<div>
									<label className={labelClass}>Estado</label>
									<input
										{...register("address.state")}
										placeholder="Estado"
										className={inputClass}
									/>
									{errors.address?.state && (
										<p className={errorClass}>{errors.address.state.message}</p>
									)}
								</div>
							</div>

							<div className="w-48">
								<label className={labelClass}>CEP</label>
								<input
									{...register("address.zipCode")}
									placeholder="00000-000"
									className={inputClass}
								/>
								{errors.address?.zipCode && (
									<p className={errorClass}>{errors.address.zipCode.message}</p>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* ── Seção 3: Detalhes ── */}
				<section>
					<div className="flex items-center gap-3 mb-5">
						<div className="w-7 h-7 rounded-full bg-[#ea580c] text-white text-sm font-bold flex items-center justify-center shrink-0">
							3
						</div>
						<h2 className="text-xl font-bold text-gray-900">Detalhes</h2>
					</div>
					<div className="border-b border-gray-200 mb-5" />

					<div className="w-48">
						<label className={labelClass}>Capacidade</label>
						<input
							{...register("capacity")}
							type="number"
							min={1}
							placeholder="ex: 200"
							className={inputClass}
						/>
						{errors.capacity && <p className={errorClass}>{errors.capacity.message}</p>}
					</div>
				</section>

				{/* Erro do servidor */}
				{serverError && (
					<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
						{serverError}
					</p>
				)}

				{/* Botões */}
				<div className="flex items-center justify-end gap-3 pb-8">
					<Link
						href="/events"
						className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</Link>
					<button
						type="submit"
						disabled={submitting}
						className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#ea580c] hover:bg-[#c2460a] rounded-lg transition-colors disabled:opacity-60"
					>
						{submitting && <Loader2 size={15} className="animate-spin" />}
						{submitting ? "Criando..." : "Criar Evento"}
					</button>
				</div>
			</form>
		</div>
	);
}
