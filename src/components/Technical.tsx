import { TextReveal } from "./TextReveal";
import { ImageParallax } from "./ImageParallax";

export function Technical() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-24">
          <TextReveal as="h2" className="font-serif text-3xl md:text-5xl lg:text-7xl mb-8">
            El Músculo Técnico
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-neutral-400">
              Ingeniería y precisión a pie de obra.
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
          <ImageParallax 
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=2000"
            alt="Instalación de fontanería vista" 
            aspectRatio="aspect-square" 
            className="md:translate-y-12"
          />
          <ImageParallax 
            src="https://images.unsplash.com/photo-1600607687710-0ce60a6b1673?auto=format&fit=crop&q=80&w=2000"
            alt="Trabajos de electricidad y cableado en Vallecas" 
            aspectRatio="aspect-[4/3]" 
          />
        </div>

      </div>
    </section>
  );
}
