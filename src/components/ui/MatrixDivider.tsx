"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MATRIX_CHARS = "01アイウエオ</>{}[];=+@#$";

export default function MatrixDivider() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create responsive amount of characters
    const updateChars = () => {
      container.innerHTML = "";
      const numChars = Math.floor(window.innerWidth / 25);
      const chars: HTMLSpanElement[] = [];
      
      for (let i = 0; i < numChars; i++) {
        const span = document.createElement("span");
        span.innerText = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        span.className = "inline-block mx-[4px] transition-colors duration-75";
        span.style.color = `rgba(0, 255, 65, ${Math.random() * 0.5 + 0.1})`;
        span.style.opacity = (Math.random() * 0.5 + 0.1).toString();
        container.appendChild(span);
        chars.push(span);
      }
      return chars;
    };

    let chars = updateChars();

    // Listen for resize to update amount of characters
    const handleResize = () => {
      chars = updateChars();
    };
    window.addEventListener("resize", handleResize);

    // Animate characters dynamically based on scroll velocity
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const changeProbability = Math.min(velocity / 1000, 0.8) + 0.05; // Faster scroll = more changing characters

        chars.forEach((span) => {
          if (Math.random() < changeProbability) {
            span.innerText = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            // Occasional bright matrix green flash
            span.style.color = Math.random() > 0.95 ? "#00ff41" : `rgba(0, 255, 65, ${Math.random() * 0.5 + 0.1})`;
          }
        });
      }
    });

    return () => {
      st.kill();
      window.removeEventListener("resize", handleResize);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full py-16 md:py-24 flex items-center justify-center overflow-hidden font-mono text-sm md:text-lg select-none pointer-events-none relative z-10">
      <div 
        ref={containerRef} 
        className="flex flex-wrap justify-center w-full max-w-6xl opacity-60 mix-blend-screen" 
      />
      {/* Subtle glowing line behind the text */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-terminal/30 to-transparent -translate-y-1/2" />
    </div>
  );
}
