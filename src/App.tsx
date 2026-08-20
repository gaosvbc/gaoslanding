/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Contact } from "./components/Contact";
import AvisoLegal from "./components/AvisoLegal";
import PoliticaPrivacidad from "./components/PoliticaPrivacidad";
import PoliticaCookies from "./components/PoliticaCookies";
import CookieBanner from "./components/CookieBanner";
import { WhatsAppFloating } from "./components/WhatsAppFloating";
import { ReactLenis } from 'lenis/react';

export default function App() {
  return (
    <ReactLenis root>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
      </Routes>
      <WhatsAppFloating />
      <CookieBanner />
    </ReactLenis>
  );
}
