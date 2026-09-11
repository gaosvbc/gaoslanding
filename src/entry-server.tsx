/**
 * Punto de entrada del pre-render. NO se envía al navegador.
 *
 * vite.config.ts compila este fichero para Node y lo llama una vez por ruta
 * para obtener el HTML del <div id="root"> ya renderizado. El cliente sigue
 * montando con createRoot (no hidrata): el HTML estático existe para los
 * rastreadores y para la primera pintura, no para ahorrar trabajo al navegador.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

// El pre-render consume todo el SEO desde este mismo módulo.
export * from "./seo";

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
