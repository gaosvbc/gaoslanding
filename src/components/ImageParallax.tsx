import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageParallaxProps {
  src?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  caption?: string;
}

export function ImageParallax({
  src,
  alt,
  aspectRatio = "aspect-square",
  className = "",
  caption,
}: ImageParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { y: "-10%" },
      {
        y: "10%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className={`relative overflow-hidden group ${className}`} ref={containerRef}>
      <div className={`w-full overflow-hidden ${aspectRatio} bg-neutral-900`}>
        {src ? (
          <img
            ref={imageRef as any}
            src={src}
            alt={alt}
            className="w-full h-[120%] object-cover object-center absolute top-[-10%] left-0"
          />
        ) : (
          <div
            ref={imageRef}
            className="w-full h-[120%] absolute top-[-10%] left-0 bg-neutral-800 flex items-center justify-center border border-neutral-700/50"
          >
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest px-4 text-center">
              {alt}
            </span>
          </div>
        )}
      </div>
      {caption && (
        <div className="mt-4 flex items-center gap-4">
          <div className="h-[1px] w-8 bg-neutral-700" />
          <p className="font-sans text-sm text-neutral-400 uppercase tracking-widest">{caption}</p>
        </div>
      )}
    </div>
  );
}
