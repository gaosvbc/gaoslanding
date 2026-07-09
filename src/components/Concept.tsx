import { TextReveal } from "./TextReveal";
import { ImageParallax } from "./ImageParallax";

export function Concept() {
  return (
    <section id="studio" className="py-24 px-6 md:px-12 lg:px-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-24">
          <div className="h-px w-16 bg-neutral-600"></div>
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">01 — Gaos Studio</span>
        </div>

        <TextReveal as="h2" className="font-serif text-4xl md:text-6xl lg:text-8xl leading-none max-w-5xl mb-32">
          Damos vida a tus ideas antes de tocar un solo ladrillo.
        </TextReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="w-full">
            <ImageParallax 
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2000"
              alt="Boceto a lápiz de salón" 
              aspectRatio="aspect-[3/4]" 
              caption="Fase 01: Conceptualización"
            />
          </div>
          <div className="w-full md:mt-48">
            <ImageParallax 
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2070"
              alt="Mockup renderizado 3D de cocina" 
              aspectRatio="aspect-square" 
              caption="Fase 02: Visualización 3D"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
