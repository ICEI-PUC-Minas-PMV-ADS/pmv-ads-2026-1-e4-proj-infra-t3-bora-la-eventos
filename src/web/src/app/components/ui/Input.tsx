import { forwardRef, useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	icon?: React.ReactNode;
	rightLabelAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			icon,
			type = "text",
			rightLabelAction,
			className,
			...props
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = useState(false);
		const isPassword = type === "password";
		const inputType = isPassword
			? showPassword
				? "text"
				: "password"
			: type;

		return (
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<label
						htmlFor={props.id}
						className="text-sm font-semibold text-slate-700"
					>
						{label}
					</label>
					{rightLabelAction && rightLabelAction}
				</div>

				<div className="relative flex items-center">
					{icon && (
						<div className="absolute left-3 text-slate-400">
							{icon}
						</div>
					)}

					<input
						ref={ref}
						type={inputType}
						className={`w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-sm rounded-lg py-3 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all placeholder:text-slate-400 ${
							icon ? "pl-10" : "pl-4"
						} ${isPassword ? "pr-10" : "pr-4"} ${className || ""}`}
						{...props}
					/>

					{isPassword && (
						<button
							type="button"
							onClick={() =>
								setShowPassword(!showPassword)
							}
							className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
						>
							{showPassword ? (
								<EyeOff size={18} />
							) : (
								<Eye size={18} />
							)}
						</button>
					)}
				</div>

				{error && (
					<p className="text-red-500 text-xs mt-1">{error}</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
