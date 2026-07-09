import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Hero } from "./Hero";
import { Origin } from "./Origin";
import { Concept } from "./Concept";
import { Execution } from "./Execution";
import { Footer } from "./Footer";

export function Home() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut",
      delay: 0.2
    })
    .from(mainRef.current, {
      y: 100,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1");
  });

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-[#050505] z-50 pointer-events-none"
      />
      <main ref={mainRef} className="bg-[#050505] text-[#f3f4f6] min-h-screen font-sans selection:bg-white selection:text-black">
        <Hero />
        <Origin />
        <Concept />
        <Execution />
        <Footer />
      </main>
    </>
  );
}
