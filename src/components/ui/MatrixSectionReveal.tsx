"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MATRIX_CHARS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ</>{}[];=+@#$";

interface MatrixSectionRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function MatrixSectionReveal({
  children,
  className = "",
}: MatrixSectionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register plugin client-side only — ماشي فـ module scope
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!container || !canvas || !content) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemoryDevice =
      "deviceMemory" in navigator && Number(navigator.deviceMemory) <= 4;

    if (reduceMotion || lowMemoryDevice) {
      canvas.hidden = true;
      content.style.opacity = "1";
      content.style.transform = "none";
      return;
    }

    let animationFrameId: number | null = null;
    let isDrawing = false;
    let drops: number[] = [];
    const fontSize = 16;

    // 🔥 الـ canvas دابا absolute داخل السكشن — كنستعملو ResizeObserver
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      const columns = Math.ceil(rect.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    const state = { matrixAlpha: 0 };

    const drawMatrix = () => {
      if (!isDrawing) return;

      const rect = container.getBoundingClientRect();

      if (state.matrixAlpha > 0.01) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = `rgba(0, 255, 65, ${state.matrixAlpha})`;
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          if (drops[i] * fontSize > 0) {
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          }
          if (drops[i] * fontSize > rect.height && Math.random() > 0.95) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }

      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    const startDrawing = () => {
      if (isDrawing) return;
      isDrawing = true;
      drawMatrix();
    };

    const stopDrawing = () => {
      isDrawing = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
    };

    // ResizeObserver بدل window.resize — أدق وما كيضربش performance
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(container);
    resizeCanvas();

    // الـ content كيبدا مخبي بـ CSS (.matrix-reveal-content فـ globals.css)
    // GSAP غير كيحرك opacity و y
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 90%",
        end: "top 40%",
        scrub: 1.2,
        // 🔥 حيدنا snap — Lenis كافي. 3 snap engines = layout fight على الموبايل
        onEnter: startDrawing,
        onEnterBack: startDrawing,
        onLeave: stopDrawing,
        onLeaveBack: stopDrawing,
      },
    });

    tl.to(state, { matrixAlpha: 1, duration: 1, ease: "power1.inOut" })
      .to(content, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out" }, "<0.4")
      .to(state, { matrixAlpha: 0, duration: 1, ease: "power1.inOut" }, ">-0.8");

    return () => {
      ro.disconnect();
      stopDrawing();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative w-full isolate overflow-hidden ${className}`}
    >
      {/* 🔥 Canvas دابا absolute داخل السكشن — ماشي fixed
          حيدنا mix-blend-screen — كان كيسبب flickering على iOS Safari */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      />
      {/* الكونتنت — initial state بـ CSS class (.matrix-reveal-content) */}
      <div ref={contentRef} className="matrix-reveal-content relative z-10">
        {children}
      </div>
    </section>
  );
}
