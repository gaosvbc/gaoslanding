import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";
import { useForm, ValidationError } from '@formspree/react';

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, handleSubmit, reset] = useForm("mqpzgwvk");

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] flex flex-col pt-8 pb-16 px-6 md:px-12 lg:px-24">
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

        {state.succeeded ? (
          <div className="mt-12 bg-neutral-900/50 border border-neutral-800 p-12 lg:p-16 text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl text-white">Mensaje enviado</h2>
            <p className="font-sans text-neutral-400 text-lg max-w-lg mx-auto">
              Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
            </p>
            <button
              onClick={() => reset()}
              className="mt-8 group inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <span className="font-sans text-sm uppercase tracking-[0.2em] text-white">Enviar otro mensaje</span>
              <div className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300"></div>
            </button>
          </div>
        ) : (
          <form className="mt-12 flex flex-col gap-12" onSubmit={handleSubmit}>
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
                <ValidationError prefix="Nombre" field="nombre" errors={state.errors} className="text-red-500 text-sm mt-2" />
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
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-2" />
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
              <ValidationError prefix="Descripción" field="descripcion" errors={state.errors} className="text-red-500 text-sm mt-2" />
            </div>

            {(() => {
              const formErrors = state.errors?.getFormErrors() ?? [];
              return formErrors.length > 0 && (
                <p className="font-sans text-sm text-red-500 tracking-wide">
                  Hubo un problema al enviar tu mensaje: {formErrors.map(e => e.message).join(', ')}
                </p>
              );
            })()}

            <div className="mt-8">
              <button
                type="submit"
                disabled={state.submitting}
                className={`group flex items-center gap-4 transition-opacity ${state.submitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
              >
                <span className="font-sans text-sm uppercase tracking-[0.2em]">
                  {state.submitting ? 'Enviando...' : 'Enviar Consulta'}
                </span>
                <div className={`h-px bg-white transition-all duration-300 ${state.submitting ? 'w-24' : 'w-12 group-hover:w-24'}`}></div>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
