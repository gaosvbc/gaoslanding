import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#050505] text-white pt-32 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col min-h-[50vh] justify-between">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800 mb-24">
          <a href="https://estudio.gaos.es" target="_blank" rel="noopener noreferrer" className="group bg-[#050505] p-12 lg:p-24 flex flex-col justify-between aspect-square md:aspect-auto hover:bg-[#0a0a0a] transition-colors cursor-pointer">
            <span className="font-sans text-xs tracking-widest uppercase text-neutral-500 mb-12 block group-hover:text-neutral-300 transition-colors">01</span>
            <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl group-hover:italic transition-all">Explora la Estética <br/><span className="text-neutral-500 text-2xl md:text-3xl lg:text-4xl block mt-4 font-sans not-italic uppercase tracking-widest">Gaos Studio</span></h3>
          </a>
          
          <a href="#reformas" className="group bg-[#050505] p-12 lg:p-24 flex flex-col justify-between aspect-square md:aspect-auto hover:bg-[#0a0a0a] transition-colors cursor-pointer">
            <span className="font-sans text-xs tracking-widest uppercase text-neutral-500 mb-12 block group-hover:text-neutral-300 transition-colors">02</span>
            <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl group-hover:italic transition-all">Conoce el Proceso <br/><span className="text-neutral-500 text-2xl md:text-3xl lg:text-4xl block mt-4 font-sans not-italic uppercase tracking-widest">Gaos Reformas</span></h3>
          </a>
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-neutral-800 pt-8">
            <div className="font-serif text-2xl tracking-tighter">GAOS</div>
            <div className="flex gap-8 font-sans text-xs tracking-widest uppercase text-neutral-500">
              <a href="https://www.instagram.com/gaosreformas/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.tiktok.com/@gaosreformas" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
              <a href="mailto:hola@gaos.es" className="hover:text-white transition-colors">HOLA@GAOS.ES</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-[10px] md:text-xs tracking-widest text-neutral-600 uppercase">
            <span>© {new Date().getFullYear()} Gaos. Todos los derechos reservados.</span>
            <div className="flex gap-6">
              <Link to="/aviso-legal" className="hover:text-neutral-400 transition-colors">Aviso Legal</Link>
              <Link to="/politica-de-privacidad" className="hover:text-neutral-400 transition-colors">Política de Privacidad</Link>
              <Link to="/politica-de-cookies" className="hover:text-neutral-400 transition-colors">Política de Cookies</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
