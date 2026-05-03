"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Alert, AlertTypes } from "./Alert";

type AlertContextType = {
	showAlert: (message: string, type: AlertTypes) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
	const [alertVisible, setAlertVisible] = useState(false);
	const [alertType, setAlertType] = useState<AlertTypes>(AlertTypes.ERROR);
	const [alertMessage, setAlertMessage] = useState("");

	function showAlert(message: string, type: AlertTypes) {
		setAlertMessage(message);
		setAlertType(type);
		setAlertVisible(true);
	}

	return (
		<AlertContext.Provider value={{ showAlert }}>
			<Alert
				isVisible={alertVisible}
				type={alertType}
				body={alertMessage}
				handleVisibility={setAlertVisible}
			/>
			{children}
		</AlertContext.Provider>
	);
}

export function useAlert() {
	const ctx = useContext(AlertContext);
	if (!ctx) throw new Error("useAlert deve ser usado dentro de AlertProvider");
	return ctx;
}
