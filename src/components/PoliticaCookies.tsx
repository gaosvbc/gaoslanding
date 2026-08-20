import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PoliticaCookies() {
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
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-12">Política de Cookies</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">1. ¿Qué son las cookies?</h2>
            <p className="mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Sirven para que el sitio funcione correctamente, recuerde tus preferencias y nos permita mejorar la experiencia del usuario.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">2. Cookies que utiliza este sitio web</h2>
            
            <h3 className="font-sans text-base md:text-lg text-white mt-6 mb-2">2.1 Cookies técnicas (necesarias)</h3>
            <p className="mb-4">
              Son imprescindibles para el funcionamiento del sitio. No requieren consentimiento. Se utilizan para gestionar tu sesión de navegación y recordar tus preferencias de cookies.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Cookie</th>
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Titular</th>
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Finalidad</th>
                    <th className="py-2 font-normal text-neutral-500 uppercase tracking-widest text-xs">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 pr-4">cookie_consent</td>
                    <td className="py-3 pr-4">Gaos VBC (propia)</td>
                    <td className="py-3 pr-4">Almacena tu preferencia de aceptación de cookies</td>
                    <td className="py-3">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-sans text-base md:text-lg text-white mt-8 mb-2">2.2 Cookies analíticas (Vercel Analytics)</h3>
            <p className="mb-6">
              Gaos VBC utiliza Vercel Analytics para obtener estadísticas anónimas de uso del sitio web. Este servicio es <strong>cookieless</strong>: no instala cookies en tu dispositivo y no permite identificar usuarios individuales. Los datos son tratados de forma completamente anónima. Proveedor: Vercel Inc. (EE.UU.), acogido al Marco de Privacidad de Datos UE-EE.UU.
            </p>

            <h3 className="font-sans text-base md:text-lg text-white mt-8 mb-2">2.3 Cookies de terceros (Google Maps)</h3>
            <p className="mb-4">
              El sitio incluye un mapa interactivo de Google Maps para facilitar la localización de nuestras oficinas. Google Maps puede instalar cookies propias para mejorar el servicio y con fines analíticos y publicitarios. Estas cookies solo se activan si aceptas su uso.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Cookie</th>
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Titular</th>
                    <th className="py-2 pr-4 font-normal text-neutral-500 uppercase tracking-widest text-xs">Finalidad</th>
                    <th className="py-2 font-normal text-neutral-500 uppercase tracking-widest text-xs">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 pr-4">Varias (_ga, NID, etc.)</td>
                    <td className="py-3 pr-4">Google LLC</td>
                    <td className="py-3 pr-4">Analítica, preferencias y publicidad</td>
                    <td className="py-3">Variable</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Más información: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-white hover:text-neutral-400 underline underline-offset-4 decoration-neutral-700">Política de privacidad de Google</a>
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">3. Cómo gestionar tus cookies</h2>
            <p>
              Puedes aceptar, rechazar o revocar tu consentimiento en cualquier momento utilizando el panel de preferencias de cookies disponible en esta web. También puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-lg md:text-xl text-white mb-4">4. Más información</h2>
            <p>
              Para cualquier consulta sobre el uso de cookies, puedes contactarnos en <a href="mailto:hola@gaos.es" className="text-white hover:text-neutral-400">hola@gaos.es</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="max-w-3xl mx-auto w-full mt-24 border-t border-neutral-800 pt-8 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-neutral-600">
          Responsable: Gaos VBC — Última actualización: Agosto 2025
        </p>
      </footer>
    </div>
  );
}
