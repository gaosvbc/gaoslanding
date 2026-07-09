import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

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
        
        <form className="mt-12 flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative group">
              <input 
                type="text" 
                id="name" 
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
              rows={4}
              className="w-full bg-transparent border-b border-neutral-800 py-4 font-sans text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
              placeholder="Breve descripción de lo que deseas (Concepto, Reforma, etc.)"
              required
            ></textarea>
            <label htmlFor="description" className="absolute left-0 top-4 font-sans text-sm text-neutral-500 uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white">
              Breve descripción de tu proyecto
            </label>
          </div>

          <div className="mt-8">
            <button type="submit" className="group flex items-center gap-4 hover:opacity-80 transition-opacity">
              <span className="font-sans text-sm uppercase tracking-[0.2em]">Enviar Consulta</span>
              <div className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
