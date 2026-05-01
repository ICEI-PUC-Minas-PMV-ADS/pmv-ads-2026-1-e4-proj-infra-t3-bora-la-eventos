import { useState, useRef } from "react";
import { RegisterForm } from "@/components/register/form";
import { Calendar } from "lucide-react";
import { CustomParagraph } from "@/components/ui/CustomParagraph";
import { Alert } from "@/components/ui";

export function RegisterPage() {
  const [showAlert, setShowAlert] = useState(false);
	const [message, setMessage] = useState('')
  
	const alertHandler = (message: string) => {
    setMessage(message);
		setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden font-sans">
      <Alert handleVisibility={setShowAlert} body={message} isVisible={showAlert} />
      <header className="p-6 absolute top-0 left-0 w-full">
        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#f97316]">
          <Calendar size={24} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-[512px] mx-auto z-10">
        <div className="w-full mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Criar nova conta
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Preencha os dados abaixo para registrar seu estabelecimento no
            dashboard e começar a gerenciar seus pedidos.
          </p>
        </div>

        <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100">
          <RegisterForm alertHandler={alertHandler}/>

          <div className="mt-8 text-center text-sm text-slate-500">
            <div className="flex flex-row gap-x-2 justify-center">
              <CustomParagraph
                paragraph="Precisa de ajuda? {support}"
                options={{
                  color: "#f97316",
                  tokens: {
                    support: "Fale com o suporte!",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 z-10">
        <p>©2026 PUC Minas</p>
      </footer>
    </div>
  );
}
