import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { y: "110%", opacity: 0, rotateZ: 2 },
      {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        duration: 1.2,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [delay]);

  return (
    <Component className={`overflow-hidden ${className}`} ref={containerRef}>
      <div ref={contentRef} className="origin-top-left will-change-transform">
        {children}
      </div>
    </Component>
  );
}
