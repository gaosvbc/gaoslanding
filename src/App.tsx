/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Contact } from "./components/Contact";
import { WhatsAppFloating } from "./components/WhatsAppFloating";
import { ReactLenis } from 'lenis/react';

export default function App() {
  return (
    <ReactLenis root>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contact />} />
      </Routes>
      <WhatsAppFloating />
    </ReactLenis>
  );
}
