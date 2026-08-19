import React from 'react';

export function WhatsAppFloating() {
  return (
    
      href="https://wa.me/message/AWEBFFVJDRZNJ1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-800 text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-[#0a0a0a] group"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:scale-110 transition-transform duration-300"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
      </svg>
      <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium mt-[1px]">WhatsApp</span>
    </a>
  );
}
