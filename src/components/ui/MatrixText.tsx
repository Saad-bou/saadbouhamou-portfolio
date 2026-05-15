"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MATRIX_CHARS = "01アイウエオ</>{}[];=+@#$";

interface MatrixTextProps {
  text: string;
  className?: string;
}

export default function MatrixText({ text, className = "" }: MatrixTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const obj = { value: 0 };
    const originalText = text;
    
    // Set initial text to random characters if we want it scrambled before scroll
    el.innerText = originalText.split("").map(c => c === " " ? " " : MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join("");

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(obj, {
          value: originalText.length,
          duration: 1.5,
          ease: "none",
          onUpdate: () => {
            const progress = Math.floor(obj.value);
            let result = "";
            for (let i = 0; i < originalText.length; i++) {
              if (originalText[i] === " ") {
                result += " ";
                continue;
              }
              if (i < progress) {
                result += originalText[i];
              } else {
                result += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
              }
            }
            el.innerText = result;
          }
        });
      },
      onLeaveBack: () => {
        // Scramble again when scrolling up and out of view
        obj.value = 0;
        el.innerText = originalText.split("").map(c => c === " " ? " " : MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join("");
      }
    });

    return () => {
      st.kill();
    };
  }, [text]);

  return <span ref={textRef} className={className}>{text}</span>;
}
