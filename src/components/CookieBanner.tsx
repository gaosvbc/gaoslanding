import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export type ConsentStatus = 'accepted' | 'rejected' | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored as ConsentStatus);
    }
  }, []);

  const updateConsent = (newConsent: ConsentStatus) => {
    if (newConsent === null) {
      localStorage.removeItem("cookie_consent");
    } else {
      localStorage.setItem("cookie_consent", newConsent);
    }
    setConsent(newConsent);
    // Dispatch a custom event to notify other components (like maps)
    window.dispatchEvent(new Event("cookie_consent_change"));
  };

  // Listen for consent changes from other tabs or components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookie_consent") {
        setConsent((e.newValue as ConsentStatus) || null);
      }
    };
    
    const handleCustomEvent = () => {
      const stored = localStorage.getItem("cookie_consent");
      setConsent((stored as ConsentStatus) || null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cookie_consent_change", handleCustomEvent);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookie_consent_change", handleCustomEvent);
    };
  }, []);

  return { consent, updateConsent };
}

export default function CookieBanner() {
  const { consent, updateConsent } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow fade in animation on first load
    const timer = setTimeout(() => {
      if (consent === null) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [consent]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#111] border-t border-neutral-800 p-6 md:p-8 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <p className="font-sans text-sm md:text-base text-white">
            Utilizamos Google Maps para mostrarte nuestra ubicación. ¿Aceptas las cookies de terceros?
          </p>
          <p className="font-sans text-xs text-neutral-500">
            Las cookies analíticas de Vercel son anónimas y no requieren tu consentimiento.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Link 
            to="/politica-de-cookies" 
            className="font-sans text-xs text-neutral-400 hover:text-white underline underline-offset-4 decoration-neutral-700 transition-colors mr-auto sm:mr-4 md:mr-6 whitespace-nowrap"
          >
            Política de cookies
          </Link>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => updateConsent("rejected")}
              className="flex-1 sm:flex-none border border-white text-white hover:bg-white hover:text-black transition-colors px-6 py-3 font-sans text-xs uppercase tracking-widest"
            >
              Rechazar
            </button>
            <button
              onClick={() => updateConsent("accepted")}
              className="flex-1 sm:flex-none bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-3 font-sans text-xs uppercase tracking-widest"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
