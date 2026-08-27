import { useRef, useState, useEffect, FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { TextReveal } from "./TextReveal";
import { Footer } from "./Footer";

type Status = "idle" | "submitting" | "succeeded" | "error";

const SERVICIOS = [
  {
    num: "01",
    titulo: "Diseño integral de vivienda",
    texto:
      "Distribución, materiales y mobiliario a medida para cada estancia, del concepto al proyecto ejecutivo y la visualización 3D antes de empezar.",
  },
  {
    num: "02",
    titulo: "Diseño de cocinas",
    texto:
      "Cocinas de autor donde la funcionalidad y la estética conviven, con cada acabado decidido antes de tocar un solo material.",
  },
  {
    num: "03",
    titulo: "Interiorismo de salón y zonas de estar",
    texto:
      "Espacios que buscan el equilibrio entre luz, simetría y pureza de materiales, pensados para vivirse a diario.",
  },
];

const CONFIANZA = [
  "Equipo multidisciplinar: arquitectos, diseñadores y constructores",
  "Del concepto a la visualización 3D antes de empezar",
  "Presupuesto sin compromiso",
  "Proyectos en Madrid",
];

export function StudioLanding() {
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

  // Título y meta description propios de esta página: diseño de interiores en
  // Madrid, sin mezclar el mensaje de Gaos Reformas. index.html trae el
  // título/meta por defecto de la home; aquí lo sobreescribimos mientras el
  // visitante está en /studio y lo devolvemos al salir.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Diseño de Interiores en Madrid | Gaos Studio";

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute("content") ?? null;
    metaDescription?.setAttribute(
      "content",
      "Diseño de interiores de gama alta en Madrid: vivienda completa, cocinas y espacios de estar, del concepto a la visualización 3D. Presupuesto sin compromiso."
    );

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle?.getAttribute("content") ?? null;
    ogTitle?.setAttribute("content", "Gaos Studio — Diseño de Interiores en Madrid");

    const ogDescription = document.querySelector('meta[property="og:description"]');
    const prevOgDescription = ogDescription?.getAttribute("content") ?? null;
    ogDescription?.setAttribute(
      "content",
      "Diseño de interiores de gama alta en Madrid: vivienda completa, cocinas y espacios de estar, del concepto a la visualización 3D. Presupuesto sin compromiso."
    );

    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) metaDescription?.setAttribute("content", prevDescription);
      if (prevOgTitle !== null) ogTitle?.setAttribute("content", prevOgTitle);
      if (prevOgDescription !== null) ogDescription?.setAttribute("content", prevOgDescription);
    };
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
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === "function") {
        gtag('event', 'conversion', { send_to: 'AW-18193613436/TLx0CNvi0egcEPyEsuND' });
      }
    } catch {
      setErrorMessage("No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#f3f4f6] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="flex justify-between items-center w-full z-50 relative mix-blend-difference pt-8 pb-4 px-6 md:px-12 lg:px-24">
        <Link to="/" className="font-sans text-sm tracking-widest uppercase text-white">Gaos</Link>
        <nav className="flex gap-8 font-sans text-xs tracking-widest uppercase hidden md:flex text-white">
          <Link to="/reformas" className="hover:text-neutral-400 transition-colors">Reformas</Link>
          <Link to="/contacto" className="hover:text-neutral-400 transition-colors">Contacto</Link>
        </nav>
      </header>

      {/* Hero / H1 */}
      <section className="pt-16 md:pt-24 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px w-16 bg-neutral-600"></div>
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">Gaos Studio</span>
          </div>

          <TextReveal as="h1" className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-10">
            Diseño de interiores en <span className="italic text-neutral-400">Madrid</span>.
          </TextReveal>

          <TextReveal delay={0.15} className="mb-14">
            <p className="font-sans text-base md:text-lg leading-relaxed text-neutral-300 max-w-2xl">
              Diseño de interiores de gama alta, del concepto a la visualización 3D antes de
              empezar. Vivienda completa, cocinas y espacios de estar, con un equipo
              multidisciplinar de principio a fin.
            </p>
          </TextReveal>

          <TextReveal delay={0.25}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">
              {CONFIANZA.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans text-sm text-neutral-400">
                  <span className="mt-2 h-1 w-1 rounded-full bg-neutral-500 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </TextReveal>

          <TextReveal delay={0.35} className="mt-14">
            <a
              href="#presupuesto"
              className="group inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <span className="font-sans text-sm uppercase tracking-[0.2em] text-white">Pide tu presupuesto sin compromiso</span>
              <div className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300"></div>
            </a>
          </TextReveal>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <TextReveal as="h2" className="font-serif text-3xl md:text-5xl leading-tight mb-16 max-w-2xl">
            Un equipo, tres estancias.
          </TextReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800">
            {SERVICIOS.map((s) => (
              <div key={s.num} className="bg-[#050505] p-10 lg:p-12 flex flex-col gap-8">
                <span className="font-sans text-xs tracking-widest uppercase text-neutral-500">{s.num}</span>
                <h3 className="font-serif text-2xl md:text-3xl">{s.titulo}</h3>
                <p className="font-sans text-sm leading-relaxed text-neutral-400">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué nosotros */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <TextReveal as="h2" className="font-serif text-3xl md:text-5xl leading-tight mb-10">
            Por qué elegir <span className="italic text-neutral-400">Gaos</span>.
          </TextReveal>
          <TextReveal delay={0.15}>
            <p className="font-sans text-base leading-relaxed text-neutral-400 max-w-2xl">
              Creemos que el espacio perfecto nace del equilibrio entre concepto y ejecución.
              Somos un equipo multidisciplinar de arquitectos, diseñadores y constructores que
              acompaña cada proyecto desde la primera idea hasta la última visualización 3D, en
              Madrid.
            </p>
          </TextReveal>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section id="presupuesto" className="py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto">
          <TextReveal as="h2" className="font-serif text-3xl md:text-5xl leading-tight mb-4">
            Pide tu presupuesto.
          </TextReveal>
          <TextReveal delay={0.1} className="mb-14">
            <p className="font-sans text-sm text-neutral-400">
              Sin compromiso. Te contactamos para hablar de tu proyecto.
            </p>
          </TextReveal>

          {status === "succeeded" ? (
            <div className="bg-neutral-900/50 border border-neutral-800 p-12 lg:p-16 text-center space-y-6">
              <h3 className="font-serif text-3xl md:text-4xl text-white">Mensaje enviado</h3>
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
            <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
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
                    id="studio-name"
                    name="nombre"
                    className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                    placeholder="Nombre"
                    required
                  />
                  <label htmlFor="studio-name" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
                    Nombre
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    id="studio-email"
                    name="email"
                    className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="studio-email" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
                    Email
                  </label>
                </div>
              </div>
              <div className="relative group">
                <textarea
                  id="studio-description"
                  name="descripcion"
                  rows={4}
                  className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
                  placeholder="Cuéntanos tu proyecto: vivienda completa, cocina, salón..."
                  required
                ></textarea>
                <label htmlFor="studio-description" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
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
              <div className="mt-4">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
