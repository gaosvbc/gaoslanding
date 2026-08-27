import { useState, useEffect } from "react";
import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";

export function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Evitar scroll de la página cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <section className="relative h-screen w-full flex flex-col justify-between pt-8 pb-16 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <header className={`flex justify-between items-center w-full z-50 relative transition-all duration-300 ${isMenuOpen ? "" : "mix-blend-difference"}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-sans text-sm tracking-widest uppercase text-white">Gaos</Link>
        <nav className="flex gap-8 font-sans text-xs tracking-widest uppercase hidden md:flex text-white">
          <Link to="/studio" className="hover:text-neutral-400 transition-colors">Studio</Link>
          <Link to="/reformas" className="hover:text-neutral-400 transition-colors">Reformas</Link>
          <Link to="/contacto" className="hover:text-neutral-400 transition-colors">Contacto</Link>
        </nav>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden font-sans text-xs tracking-widest uppercase text-white"
        >
          {isMenuOpen ? "Cerrar" : "Menu"}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`absolute inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-12 font-sans text-xl tracking-widest uppercase text-white">
          <Link to="/studio" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-400 transition-colors">Studio</Link>
          <Link to="/reformas" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-400 transition-colors">Reformas</Link>
          <Link to="/contacto" onClick={() => setIsMenuOpen(false)} className="hover:text-neutral-400 transition-colors">Contacto</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col items-center justify-center flex-1 z-10 transition-opacity duration-300 mix-blend-difference ${isMenuOpen ? "opacity-0" : "opacity-100"}`}>
        <TextReveal as="h1" className="font-serif text-[18vw] md:text-[15vw] leading-[0.8] tracking-tighter text-center uppercase">
          Gaos
        </TextReveal>
        <TextReveal delay={0.2} className="mt-8 md:mt-12">
          <p className="font-sans text-sm md:text-base lg:text-lg tracking-widest uppercase max-w-md text-center text-neutral-300">
            Tu hogar en manos de profesionales.
          </p>
        </TextReveal>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Overlay for contrast */}
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2070" 
          alt="Gaos Architecture Interior" 
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
}
