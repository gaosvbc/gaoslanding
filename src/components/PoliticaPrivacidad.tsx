import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PoliticaPrivacidad() {
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
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-12">Política de Privacidad</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de los datos personales recogidos a través de esta web es Gaos VBC, con domicilio en Glorieta de Ruiz Giménez 5, Madrid, y correo electrónico hola@gaos.es.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">2. Finalidad del tratamiento</h2>
            <p>
              Los datos personales que nos facilites a través del formulario de contacto serán utilizados con la única finalidad de responder a tus consultas, enviarte presupuestos y gestionar la comunicación comercial relacionada con nuestros servicios de reformas.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">3. Datos tratados</h2>
            <p>
              Los datos que recogemos a través del formulario de contacto son: nombre completo, dirección de correo electrónico, número de teléfono y el mensaje o consulta que nos envíes.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">4. Conservación de los datos</h2>
            <p>
              Los datos proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">5. Legitimación</h2>
            <p>
              La base legal para el tratamiento de tus datos es tu consentimiento expreso, otorgado al marcar la casilla de aceptación y enviar el formulario de contacto.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">6. Destinatarios y encargados del tratamiento</h2>
            <p>
              Tus datos no serán cedidos a terceros, salvo obligación legal. Para el envío de comunicaciones electrónicas derivadas del formulario de contacto, utilizamos el servicio Resend (Resend Inc.), que actúa como encargado del tratamiento y está acogido al Marco de Privacidad de Datos UE-EE.UU. (Data Privacy Framework).
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">7. Derechos del usuario</h2>
            <p className="mb-4">Tienes derecho a:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar los datos inexactos</li>
              <li>Solicitar su supresión cuando ya no sean necesarios</li>
              <li>Oponerte al tratamiento</li>
              <li>Solicitar la limitación del tratamiento</li>
              <li>Ejercer el derecho a la portabilidad de tus datos</li>
            </ul>
            <p>
              Puedes ejercer estos derechos enviando un email a hola@gaos.es. Disponemos de un plazo máximo de 30 días para responderte.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">8. Derecho de reclamación ante la AEPD</h2>
            <p>
              Si consideras que el tratamiento de tus datos personales no es adecuado, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">9. Modificaciones</h2>
            <p>
              Gaos VBC se reserva el derecho a modificar la presente política de privacidad para adaptarla a novedades legislativas o jurisprudenciales. En tal caso, se anunciará en esta página con antelación suficiente.
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
