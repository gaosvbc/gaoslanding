import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function AvisoLegal() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 flex flex-col pt-8 pb-16 px-6 md:px-12 lg:px-24 font-sans">
      <header className="flex justify-between items-center w-full mb-16 md:mb-24">
        <Link to="/" className="font-sans text-sm tracking-widest uppercase text-white hover:text-neutral-400 transition-colors">
          Gaos
        </Link>
        <Link to="/" className="font-sans text-xs tracking-widest uppercase text-white hover:text-neutral-400 transition-colors">
          Volver al Inicio
        </Link>
      </header>

      <main className="max-w-3xl mx-auto w-full flex-1">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-12">Aviso Legal</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">1. Datos identificativos</h2>
            <p className="mb-4">
              En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se reflejan los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Titular: Gaos VBC</li>
              <li>Nombre comercial: Gaos Reformas</li>
              <li>NIF/CIF: B56445059</li>
              <li>Domicilio: Glorieta de Ruiz Giménez 5, Madrid</li>
              <li>Correo electrónico: hola@gaos.es</li>
              <li>Inscrita en el Registro Mercantil de Madrid: [TODO: Tomo, Folio, Hoja M-XXXXX]</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">2. Uso del portal</h2>
            <p>
              El acceso y/o uso de este portal web atribuye la condición de USUARIO, que acepta los términos y condiciones de uso aquí reflejados. El usuario asume la responsabilidad del uso del portal.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">3. Propiedad intelectual</h2>
            <p>
              Gaos VBC es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (imágenes, textos, marcas o logotipos). Todos los derechos reservados.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">4. Legislación aplicable y fuero</h2>
            <p>
              La legislación aplicable es la española. Para cualquier controversia derivada del uso de este sitio web, las partes se someten a los juzgados y tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-3xl mx-auto w-full mt-24 border-t border-neutral-800 pt-8 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-neutral-600">
          Última actualización: Agosto 2025
        </p>
      </footer>
    </div>
  );
}
