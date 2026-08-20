import { useRef, useState, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";
import { useCookieConsent } from "./CookieBanner";

type Status = "idle" | "submitting" | "succeeded" | "error";

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const { consent, updateConsent } = useCookieConsent();

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) {
      setPrivacyError(true);
      return;
    }
    setPrivacyError(false);
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      descripcion: formData.get("descripcion"),
      _gotcha: formData.get("_gotcha"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data?.error || "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.");
        setStatus("error");
        return;
      }

      setStatus("succeeded");
      form.reset();
    } catch {
      setErrorMessage("No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] flex flex-col pt-8 pb-16 px-6 md:px-12 lg:px-24">
      {/* Subtle Menu Placeholder */}
      <header className="flex justify-between items-center w-full z-10 mix-blend-difference mb-24">
        <Link to="/" className="font-sans text-sm tracking-widest uppercase">Gaos</Link>
        <nav className="flex gap-8 font-sans text-xs tracking-widest uppercase hidden md:flex">
          <Link to="/" className="hover:text-neutral-400 transition-colors">Volver al Inicio</Link>
        </nav>
        <button className="md:hidden font-sans text-xs tracking-widest uppercase">Volver</button>
      </header>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
        <TextReveal as="h1" className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12">
          Hablemos de tu <span className="italic text-neutral-500">gao</span>.
        </TextReveal>

        {status === "succeeded" ? (
          <div className="mt-12 bg-neutral-900/50 border border-neutral-800 p-12 lg:p-16 text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-white">Mensaje enviado</h2>
            <p className="font-sans text-neutral-400 text-lg max-w-lg mx-auto">
              Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 group inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <span className="font-sans text-sm uppercase tracking-[0.2em] text-white">Enviar otro mensaje</span>
              <div className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300"></div>
            </button>
          </div>
        ) : (
          <form className="mt-12 flex flex-col gap-12" onSubmit={handleSubmit}>
            {/* Honeypot anti-spam: campo oculto, invisible para personas reales */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] w-px h-px opacity-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative group">
                <input 
                  type="text" 
                  id="name" 
                  name="nombre"
                  className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                  placeholder="Nombre"
                  required
                />
                <label htmlFor="name" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
                  Nombre
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                  placeholder="Email"
                  required
                />
                <label htmlFor="email" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
                  Email
                </label>
              </div>
            </div>

            <div className="relative group">
              <textarea 
                id="description" 
                name="descripcion"
                rows={4}
                className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
                placeholder="Breve descripción de lo que deseas (Concepto, Reforma, etc.)"
                required
              ></textarea>
              <label htmlFor="description" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
                Breve descripción de tu proyecto
              </label>
            </div>

            <div className="flex flex-col gap-1 mt-4">
              <label className="flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-neutral-400 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  required
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    if (e.target.checked) setPrivacyError(false);
                  }}
                  onInvalid={(e) => {
                    e.preventDefault();
                    setPrivacyError(true);
                  }}
                  className="w-3.5 h-3.5 appearance-none border border-neutral-600 bg-transparent checked:bg-white checked:border-white transition-colors cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[4px] after:top-[1px] after:w-[3px] after:h-[7px] after:border-r-[1.5px] after:border-b-[1.5px] after:border-black after:rotate-45"
                />
                <span>
                  He leído y acepto la <Link to="/politica-de-privacidad" className="text-white underline hover:text-neutral-300 transition-colors">Política de Privacidad</Link>
                </span>
              </label>
              {privacyError && (
                <p className="font-sans text-xs text-red-500 tracking-wide mt-2">
                  Debes aceptar la Política de Privacidad para continuar.
                </p>
              )}
            </div>

            {status === "error" && errorMessage && (
              <p className="font-sans text-sm text-red-500 tracking-wide">
                {errorMessage}
              </p>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`group flex items-center gap-4 transition-opacity ${status === "submitting" || !privacyAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
              >
                <span className="font-sans text-sm uppercase tracking-[0.2em]">
                  {status === "submitting" ? 'Enviando...' : 'Enviar Consulta'}
                </span>
                <div className={`h-px bg-white transition-all duration-300 ${status === "submitting" ? 'w-24' : 'w-12 group-hover:w-24'}`}></div>
              </button>
            </div>
          </form>
        )}

        <div className="mt-24 w-full h-[400px] md:h-[500px]">
          {consent === 'accepted' ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.2891157929424!2d-3.7093220235313177!3d40.42903745516086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422864ca02c817%3A0xc6fb6faeebda1866!2sGta.%20de%20Ruiz%20Gim%C3%A9nez%2C%205%2C%20Chamber%C3%AD%2C%2028015%20Madrid!5e0!3m2!1sen!2ses!4v1700000000000!5m2!1sen!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <p className="font-sans text-sm md:text-base text-neutral-400">
                Acepta las cookies para ver el mapa interactivo.
              </p>
              <button
                onClick={() => {
                  updateConsent(null);
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="border border-white text-white hover:bg-white hover:text-black transition-colors px-6 py-3 font-sans text-xs uppercase tracking-widest"
              >
                Gestionar cookies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  
