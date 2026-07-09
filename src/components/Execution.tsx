import { TextReveal } from "./TextReveal";
import { ImageParallax } from "./ImageParallax";

export function Execution() {
  return (
    <section id="reformas" className="py-24 px-6 md:px-12 lg:px-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-end gap-6 mb-24">
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">02 — Gaos Reformas</span>
          <div className="h-px w-16 bg-neutral-600"></div>
        </div>

        <TextReveal as="h2" className="font-serif text-5xl md:text-7xl lg:text-[9vw] leading-[0.9] text-right mb-32">
          Materializando<br/><span className="text-neutral-500 italic">el lujo.</span>
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <div className="lg:col-span-5 lg:mt-32">
             <TextReveal delay={0.1} className="mb-12">
              <p className="font-sans text-sm md:text-base leading-relaxed text-neutral-400 max-w-sm">
                La excelencia en el diseño requiere una ejecución impecable. Cuidamos cada detalle, desde la demolición hasta el último remate, trabajando con los mejores materiales y artesanos.
              </p>
            </TextReveal>
            <ImageParallax 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
              alt="Acabados premium en Las Rozas" 
              aspectRatio="aspect-[4/5]" 
              caption="Detalle de Acabados"
            />
          </div>
          <div className="lg:col-span-7">
            <ImageParallax 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
              alt="Reforma integral en Chamberí" 
              aspectRatio="aspect-[16/9]" 
              caption="Proyecto Chamberí"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
