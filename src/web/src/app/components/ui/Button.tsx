import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	loadingText?: string;
	iconRight?: React.ReactNode;
}

export function Button({
	children,
	isLoading,
	loadingText = "Carregando...",
	iconRight,
	className,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			disabled={disabled || isLoading}
			className={`mt-2 w-full bg-[#ea580c] hover:bg-[#dea808] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${className || ""}`}
			{...props}
		>
			{isLoading ? loadingText : children}
			{!isLoading && iconRight}
		</button>
	);
}
