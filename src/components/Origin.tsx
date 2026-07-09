import { TextReveal } from "./TextReveal";

export function Origin() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#050505] flex flex-col justify-center min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <TextReveal as="h2" className="font-serif text-3xl md:text-5xl lg:text-7xl leading-tight md:leading-tight mb-12">
          "El espacio perfecto nace del equilibrio entre <span className="italic text-neutral-400">concepto</span> y <span className="italic text-neutral-400">ejecución</span>."
        </TextReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 md:col-start-9">
            <TextReveal delay={0.2}>
              <p className="font-sans text-sm md:text-base leading-relaxed text-neutral-400">
                Gaos es la fuerza conjunta de un equipo multidisciplinar. Una sociedad que fusiona la visión creativa del diseño con la máxima exigencia y precisión técnica a pie de obra. No somos una sola voz; somos un ecosistema de arquitectos, diseñadores y constructores comprometidos con la excelencia material.
              </p>
            </TextReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
