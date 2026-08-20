import { useRef, useState, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";

type Status = "idle" | "submitting" | "succeeded" | "error";

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

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

        <div className="mt-24 w-full flex flex-col items-center py-20 border-t border-b border-neutral-800">
          <span className="font-sans text-xs tracking-[0.3em] text-neutral-500 uppercase mb-6">
            Dónde estamos
          </span>
          <p className="font-serif text-2xl md:text-3xl text-white leading-loose text-center mb-12">
            Glorieta de Ruiz Giménez 5<br />Madrid
          </p>
          <a
            href="https://maps.google.com/?q=Glorieta+de+Ruiz+Gimenez+5,+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 text-white text-xs tracking-[0.3em] uppercase px-8 py-3 hover:border-white/80 transition-colors"
          >
            CÓMO LLEGAR
          </a>
        </div>
      </div>
    </div>
  );
}
  
