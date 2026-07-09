import { TextReveal } from "./TextReveal";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between pt-8 pb-16 px-6 md:px-12 lg:px-24">
      {/* Subtle Menu Placeholder */}
      <header className="flex justify-between items-center w-full z-10 mix-blend-difference">
        <Link to="/" className="font-sans text-sm tracking-widest uppercase">Gaos</Link>
        <nav className="flex gap-8 font-sans text-xs tracking-widest uppercase hidden md:flex">
          <a href="https://estudio.gaos.es" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Studio</a>
          <a href="#reformas" className="hover:text-neutral-400 transition-colors">Reformas</a>
          <Link to="/contacto" className="hover:text-neutral-400 transition-colors">Contacto</Link>
        </nav>
        <button className="md:hidden font-sans text-xs tracking-widest uppercase">Menu</button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 mix-blend-difference">
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
