"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MATRIX_CHARS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ</>{}[];=+@#$";

gsap.registerPlugin(ScrollTrigger);

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
      gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    let animationFrameId: number | null = null;
    let isDrawing = false;
    let drops: number[] = [];
    const fontSize = 16;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    const state = { matrixAlpha: 0 };

    const drawMatrix = () => {
      if (!isDrawing) return;

      if (state.matrixAlpha > 0.01) {
        ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(0, 255, 65, ${state.matrixAlpha})`;
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          if (drops[i] * fontSize > 0) {
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          }
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    gsap.set(content, { y: 120, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 95%",
        end: "top 35%",
        scrub: 1.2,
        snap: {
          snapTo: [0, 1], // Snap to either the start (0) or end (1) of the animation
          delay: 0.3, // Faster response time after user stops scrolling
          ease: "power2.inOut",
        },
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
      window.removeEventListener("resize", resizeCanvas);
      stopDrawing();
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed left-0 top-0 z-50 h-screen w-screen pointer-events-none mix-blend-screen"
      />
      <div ref={contentRef} className="relative z-10 opacity-0">
        {children}
      </div>
    </section>
  );
}
