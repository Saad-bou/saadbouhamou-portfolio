"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Download } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const uiFrames = [
  { id: 1, title: "Homepage Hero & Navigation", desc: "Structure complète de la page d'accueil avec navigation fluide et hero section cinématique." },
  { id: 2, title: "Section Vidéos & Timeline", desc: "Présentation des vidéos institutionnelles avec timeline interactive et contrôles de lecture." },
  { id: 3, title: "Section À Propos", desc: "Design de la section identitaire de l'école avec typographie soignée et mise en page aérée." },
  { id: 4, title: "Page Inscription Complète", desc: "Parcours d'inscription multi-étapes avec formulaires élégants et indicateurs de progression." },
  { id: 5, title: "Responsive & Components", desc: "Système de composants réutilisables et adaptations responsive pour tous les écrans." },
];

export default function GalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((el, i) => {
      gsap.set(el, { opacity: 0, y: 50, filter: "blur(8px)" });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      });
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative z-10 min-h-svh">
      {/* Header */}
      <section className="pt-32 sm:pt-40 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/le-petit-college"
          className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-[#00FF41]/70 hover:text-[#00FF41] transition-colors mb-10 border border-[#00FF41]/20 hover:border-[#00FF41]/50 bg-[#00FF41]/5 px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO CASE STUDY
        </Link>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">
          Design <span className="text-[#00FF41]">System</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
          Le kit UI complet conçu pour Le Petit Collège — chaque frame en haute résolution.
        </p>
      </section>

      {/* Gallery Items */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-32 space-y-16 sm:space-y-24">
        {uiFrames.map((frame) => (
          <div key={frame.id} className="gallery-item">
            {/* Label */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[#00FF41] font-mono text-xs tracking-widest">FRAME_{String(frame.id).padStart(2, "0")}</span>
                <span className="text-zinc-600 font-mono text-xs">·</span>
                <span className="text-zinc-400 text-sm font-medium">{frame.title}</span>
              </div>
              <a
                href={`/le-petit-college/images/ui-${frame.id}.png`}
                download
                className="hidden sm:inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                <Download className="w-3 h-3" />
                DOWNLOAD PNG
              </a>
            </div>

            {/* Description */}
            <p className="text-zinc-500 text-sm mb-6 max-w-xl">{frame.desc}</p>

            {/* Full-width Image */}
            <div className="relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 bg-white shadow-2xl">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={`/le-petit-college/images/ui-${frame.id}.png`}
                  alt={frame.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                  quality={90}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Back to case study CTA */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-32 text-center">
        <Link
          href="/le-petit-college"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#00FF41]/50 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all text-sm font-mono tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO CASE STUDY
        </Link>
      </section>
    </main>
  );
}
