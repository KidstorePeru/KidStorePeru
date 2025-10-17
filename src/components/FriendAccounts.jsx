import { useState } from "react";
import { useTranslation } from "react-i18next";

// Lista de cuentas a mostrar
const ACCOUNTS = [
  "KidStore0001", "KidStore0002", "KidStore0003", "KidStore0004", "KidStore0005",
  "KidStore0006", "KidStore0007", "KidStore0008", "KidStore0009", "KidStore0010",
];

export default function FriendAccounts() {
  const { t } = useTranslation();
  const [copiedAccount, setCopiedAccount] = useState(null);

  // Función para copiar el texto al portapapeles
  const handleCopy = (accountName) => {
    navigator.clipboard.writeText(accountName).then(() => {
      setCopiedAccount(accountName);
      // Oculta el mensaje "Copiado" después de 2 segundos
      setTimeout(() => setCopiedAccount(null), 2000);
    }).catch(err => {
      console.error("Error al copiar la cuenta: ", err);
    });
  };

  return (
    <div className="container-app mt-4">
      <div className="bg-[#151823] rounded-2xl p-4 border border-white/10">
        <h3 className="text-center font-burbankSmall text-sm md:text-base uppercase tracking-wider text-white/80">
          {t("addFriendTitle")}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-3">
          {ACCOUNTS.map((acc) => (
            <div key={acc} className="relative">
              <button
                onClick={() => handleCopy(acc)}
                className="chip-fn text-sm text-cyan-300 hover:text-white transition-colors duration-200"
                title={`Copiar ${acc}`}
              >
                ・{acc}
              </button>
              {copiedAccount === acc && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-0.5 rounded-md text-xs text-white whitespace-nowrap">
                  {t("copied")}!
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}