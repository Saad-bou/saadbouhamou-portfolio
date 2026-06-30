"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Container from "@/components/layout/Container";
import { ArrowUpRight, ExternalLink, Code2, LayoutTemplate, ArrowRight, Clapperboard, Globe, Clock, Users, Heart, Sparkles, Plane, Play, ZoomIn } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Video Data ──────────────────────────────────────────────────────────────
const videos = [
  {
    num: "01",
    title: "Du Monde Entier à Rabat",
    subtitle: "Vidéo d'ouverture",
    idea: "Des familles venues du monde entier convergent vers Rabat. Le Petit Collège devient leur point d'ancrage éducatif.",
    narrative: [
      "Vue réaliste de la planète Terre",
      "Trajectoires lumineuses partant de plusieurs continents",
      "Convergence vers le Maroc puis Rabat",
      "Apparition du Petit Collège comme repère",
    ],
    closing: "« Le Petit Collège – Rabat · Un repère éducatif depuis 1981 »",
    mood: "Mouvement mondial → calme → stabilité",
    icon: Globe,
    cloudinaryUrl: "https://res.cloudinary.com/dcodkzck5/video/upload/v1782258465/vid-01-preview_ahdgxk.mp4",
    vimeoUrl: "", // TODO: Add Vimeo link when ready
  },
  {
    num: "02",
    title: "Depuis 1981 : La Force du Temps",
    subtitle: "L'héritage",
    idea: "La longévité comme gage de sérieux. Le temps qui passe sans rupture.",
    narrative: ["Fondation en 1981", "Le temps qui passe sans rupture", "Générations d'élèves", "Continuité et stabilité"],
    closing: null,
    mood: "Sérieux, confiance, absence de précipitation",
    icon: Clock,
    cloudinaryUrl: "https://res.cloudinary.com/dcodkzck5/video/upload/v1782258749/vid-02-preview_ca6fjh.mp4",
    vimeoUrl: "", // TODO: Add Vimeo link when ready
  },
  {
    num: "03",
    title: "Une École à Taille Humaine",
    subtitle: "La proximité",
    idea: "La proximité humaine comme valeur centrale. Élèves connus individuellement.",
    narrative: ["Élèves connus individuellement", "Relation étroite école–familles", "Accompagnement réel", "Écoute et suivi"],
    closing: null,
    mood: "Chaleur, calme, humanité",
    icon: Users,
    cloudinaryUrl: "https://res.cloudinary.com/dcodkzck5/video/upload/v1782259013/vid-03-preview_beqgoz.mp4",
    vimeoUrl: "", // TODO: Add Vimeo link when ready
  },
  {
    num: "04",
    title: "Internationale par Nature",
    subtitle: "La diversité",
    idea: "La diversité vécue au quotidien. Plus de 50 nationalités, coexistence des cultures.",
    narrative: ["Plus de 50 nationalités", "Coexistence des cultures", "Respect naturel", "Ouverture sur le monde"],
    closing: null,
    mood: "Sobriété, authenticité, pas d'exotisme forcé",
    icon: Heart,
    cloudinaryUrl: "https://res.cloudinary.com/dcodkzck5/video/upload/v1782259206/vid-04-preview_r1cpsy.mp4",
    vimeoUrl: "", // TODO: Add Vimeo link when ready
  },
  {
    num: "05",
    title: "Grandir Sans Perdre Son Âme",
    subtitle: "Conclusion",
    idea: "Évoluer sans renier son identité. Préserver la taille humaine et l'âme de l'école.",
    narrative: ["Volonté de se développer et s'améliorer", "Importance de rester singulier", "Préserver la taille humaine", "Préserver l'âme de l'école"],
    closing: "Grandir, oui. Évoluer, oui. Mais sans perdre son âme.",
    mood: "Maturité, conviction, identité",
    icon: Sparkles,
    cloudinaryUrl: "https://res.cloudinary.com/dcodkzck5/video/upload/v1782259373/vid-05-preview_mzg2q5.mp4",
    vimeoUrl: "", // TODO: Add Vimeo link when ready
  },
];

// ─── Video Card Component ───────────────────────────────────────────────────
const HoverVideoCard = ({ video }: { video: typeof videos[0] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleClick = () => {
    if (window.innerWidth < 768) {
      if (isPlaying) {
        setIsPlaying(false);
        videoRef.current?.pause();
      } else {
        setIsPlaying(true);
        videoRef.current?.play().catch(() => {});
      }
    }
  };

  return (
    <div className="cs-video-card rounded-2xl sm:rounded-[2.5rem] border border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden hover:border-[#00ff41]/20 transition-colors duration-500 flex flex-col">
      {/* Video / Poster Area */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video border-b border-white/5 group overflow-hidden cursor-pointer bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-[#00FF41]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl hidden md:block" />
        
        <Image 
          src={`/le-petit-college/images/vid-${video.num}-poster.webp`} 
          alt={video.title}
          title={video.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-700 ${isPlaying ? 'opacity-0 md:scale-105' : 'opacity-100 md:scale-100'}`}
          priority={video.num === "01"}
        />
        
        <video 
          ref={videoRef}
          src={video.cloudinaryUrl}
          title={video.title}
          loop 
          playsInline 
          className={`absolute inset-0 w-full h-full object-contain md:object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
          <div className="w-12 h-12 rounded-full border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-4 h-4 text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 sm:p-12 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#00FF41] font-mono text-xs tracking-widest">VID_{video.num}</span>
          <span className="text-zinc-600 font-mono text-xs">·</span>
          <span className="text-zinc-500 font-mono text-xs uppercase">{video.subtitle}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          {video.title}
        </h3>
        
        <div className="mb-8 space-y-4 flex-1">
          <div className="text-[#00FF41] font-mono text-[10px] tracking-widest uppercase">&gt; CONCEPT</div>
          <p className="text-zinc-300 text-sm leading-relaxed">{video.idea}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-auto">
          <a 
            href="https://le-petit-college.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Voir le site live"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#00FF41]/70 hover:text-[#00FF41] transition-colors border border-[#00FF41]/20 hover:border-[#00FF41]/50 bg-[#00FF41]/5 px-4 py-2 rounded-full"
          >
            <ExternalLink className="w-3 h-3" />
            LIVE SITE
          </a>
          {video.vimeoUrl ? (
            <a 
              href={video.vimeoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              title="Voir la version complète sur Vimeo"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white hover:text-[#00FF41] transition-colors border border-white/20 hover:border-[#00FF41]/50 bg-white/5 px-4 py-2 rounded-full"
            >
              <Play className="w-3 h-3" />
              FULL VERSION
            </a>
          ) : (
            <div 
              title="Version complète bientôt disponible sur Vimeo"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 border border-zinc-800 bg-zinc-900/50 px-4 py-2 rounded-full cursor-not-allowed"
            >
              <Clock className="w-3 h-3" />
              FULL (SOON)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// ─── Interactive Comparison Slider ──────────────────────────────────────────
const InteractiveComparison = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const oldVideoRef = useRef<HTMLVideoElement>(null);
  const newVideoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            oldVideoRef.current?.pause();
            newVideoRef.current?.pause();
            setIsPlaying(false);
            setIsDragging(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging && window.innerWidth >= 768) handleMove(e.clientX);
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsPlaying(true);
      oldVideoRef.current?.play().catch(() => {});
      newVideoRef.current?.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsDragging(false);
      setIsPlaying(false);
      if (oldVideoRef.current) {
        oldVideoRef.current.pause();
        oldVideoRef.current.currentTime = 0;
      }
      if (newVideoRef.current) {
        newVideoRef.current.pause();
        newVideoRef.current.currentTime = 0;
      }
    }
  };

  const toggleMobilePlay = () => {
    if (window.innerWidth < 768) {
      if (isPlaying) {
        setIsPlaying(false);
        oldVideoRef.current?.pause();
        newVideoRef.current?.pause();
      } else {
        setIsPlaying(true);
        oldVideoRef.current?.play().catch(() => {});
        newVideoRef.current?.play().catch(() => {});
      }
    }
  };

  return (
    <div className="relative w-full mt-16 max-w-6xl mx-auto cs-reveal">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[#00FF41]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-10">
         <div>
           <h3 className="text-3xl font-bold text-white tracking-tight mb-2">System Evolution</h3>
           <div className="flex items-center gap-3">
             <div className="px-3 py-1 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/20 text-[#00FF41] text-[10px] font-mono animate-pulse">
               INTERACTIVE
             </div>
             <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest hidden sm:block">Drag slider to compare (Hover to play)</p>
             <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest sm:hidden">Tap to play / Select version below</p>
           </div>
         </div>
      </div>

      {/* Mobile Toggle Buttons */}
      <div className="flex sm:hidden w-full bg-neutral-900/50 rounded-full p-1 mb-6 border border-white/10 relative z-10">
        <div 
          className="absolute top-1 bottom-1 w-1/2 bg-[#00FF41]/20 border border-[#00FF41]/50 rounded-full transition-all duration-500"
          style={{ left: sliderPosition < 50 ? '4px' : 'calc(50% - 4px)' }} 
        />
        <button 
          onClick={() => setSliderPosition(0)}
          className={`flex-1 py-3 text-xs font-mono font-bold tracking-widest z-10 transition-colors duration-500 ${sliderPosition < 50 ? 'text-[#00FF41]' : 'text-zinc-500'}`}
        >
          ANCIEN (WIX)
        </button>
        <button 
          onClick={() => setSliderPosition(100)}
          className={`flex-1 py-3 text-xs font-mono font-bold tracking-widest z-10 transition-colors duration-500 ${sliderPosition >= 50 ? 'text-[#00FF41]' : 'text-zinc-500'}`}
        >
          NOUVEAU (CUSTOM)
        </button>
      </div>

      <div 
        ref={sliderRef}
        className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl sm:rounded-[2rem] overflow-hidden sm:cursor-ew-resize select-none border border-white/10 shadow-[0_0_50px_rgba(0,255,65,0.05)] bg-black group"
        onMouseMove={onMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onMouseDown={(e) => {
          if (window.innerWidth >= 768) {
            setIsDragging(true);
            handleMove(e.clientX);
          }
        }}
        onClick={toggleMobilePlay}
      >
        <div className={`absolute inset-0 bg-black/40 z-20 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 rounded-full border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <Play className="w-6 h-6 text-[#00FF41] ml-1" />
          </div>
        </div>

        {/* BEFORE VIDEO (Wix) */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            ref={oldVideoRef}
            src="https://res.cloudinary.com/dcodkzck5/video/upload/v1782257346/old-site-preview_vd7pe3.mp4"
            title="L'ancien site (Wix)"
            preload="none"
            muted loop playsInline
            className="w-full h-full object-contain pointer-events-none"
          />
          <div className={`absolute top-4 right-4 sm:top-8 sm:right-8 z-10 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-red-500/30 flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${sliderPosition > 50 ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">WIX ENVIRONMENT</span>
          </div>
        </div>

        {/* AFTER VIDEO (Custom) */}
        <div 
          className="absolute inset-0 w-full h-full border-r sm:border-[#00FF41]/50 border-transparent bg-black pointer-events-none transition-[clip-path] duration-500 sm:duration-0"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <video 
            ref={newVideoRef}
            src="https://res.cloudinary.com/dcodkzck5/video/upload/v1782258269/vf_x0rmpv.mp4"
            title="La nouvelle plateforme (Custom)"
            preload="none"
            muted loop playsInline
            className="w-full h-full object-contain"
          />
          <div className={`absolute top-4 left-4 sm:top-8 sm:left-8 z-10 px-4 py-2 rounded-full bg-[#00FF41]/10 backdrop-blur-md border border-[#00FF41]/30 flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${sliderPosition < 50 ? 'opacity-0' : 'opacity-100'}`}>
            <Sparkles className="w-4 h-4 text-[#00FF41]" />
            <span className="text-[#00FF41] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">CUSTOM ARCHITECTURE</span>
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-[#00FF41] shadow-[0_0_15px_#00FF41] items-center justify-center pointer-events-none z-30 transition-[left] duration-500 sm:transition-none sm:duration-0 hidden sm:flex"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black rounded-full border-2 border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.6)] flex items-center justify-center text-[#00FF41] backdrop-blur-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── Bonus Video Card ────────────────────────────────────────────────────────
const BonusVideoCard = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsPlaying(true);
      videoRef.current?.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleClick = () => {
    if (window.innerWidth < 768) {
      if (isPlaying) {
        setIsPlaying(false);
        videoRef.current?.pause();
      } else {
        setIsPlaying(true);
        videoRef.current?.play().catch(() => {});
      }
    }
  };

  return (
    <div className="flex-1 relative">
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-black border border-white/10 shadow-2xl group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Image
          src="/le-petit-college/images/vid-06-poster.webp"
          alt="Drone Campaign Video — La Campagne Drone vue du ciel"
          title="La Campagne Drone - Vue immersive"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-all duration-700 ${isPlaying ? 'opacity-0 md:scale-105' : 'opacity-100 md:scale-100'}`}
        />
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dcodkzck5/video/upload/v1782259590/vid-06-preview_hespwu.mp4"
          title="La Campagne Drone"
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-contain md:object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00FF41]/90 transition-all duration-500">
            <Play className="w-6 h-6 text-white group-hover:text-black ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LePetitCollegeCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useGSAP(() => {
    // ── Matrix Wave Reveal ─────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>(".cs-heading").forEach((el) => {
      gsap.set(el, { opacity: 0, y: 40, filter: "blur(10px)", color: "#00FF41", skewX: 3 });
      gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 1 },
      })
        .to(el, { opacity: 1, y: 0, filter: "blur(0px)", skewX: 0, duration: 0.7, ease: "power2.out" })
        .to(el, { color: "#ffffff", duration: 0.4, ease: "power1.inOut" }, "<0.3");
    });

    // ── Fade-up reveal ──────────────────────────────────────
    gsap.utils.toArray<HTMLElement>(".cs-reveal").forEach((el) => {
      gsap.set(el, { opacity: 0, y: 30, filter: "blur(6px)" });
      gsap.to(el, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 55%", scrub: 1 },
      });
    });

    // ── Video cards batch ──────────────────────────────────
    gsap.set(".cs-video-card", { y: 60, opacity: 0 });
    ScrollTrigger.batch(".cs-video-card", {
      start: "top 88%",
      onEnter: (els) => {
        gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", overwrite: true });
      },
      onLeaveBack: (els) => {
        gsap.set(els, { y: 60, opacity: 0, overwrite: true });
      },
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative z-10 min-h-svh">

      {/* ═══════════════════════════════════════════════════════════════════════
           HERO
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center min-h-[100svh] lg:min-h-[100dvh] overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal/5 blur-[120px] sm:h-[600px] sm:w-[600px]" />

        <Container className="relative z-10 text-center">
          <div className="cs-reveal inline-block border border-[#00FF41]/30 bg-[#00FF41]/5 px-4 py-1.5 rounded-full text-[#00FF41] text-[10px] sm:text-xs font-mono mb-8 uppercase tracking-widest backdrop-blur-sm">
            Case Study &middot; AI Video Production
          </div>

          <h1 className="cs-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6">
            Le Petit Collège
          </h1>

          <p className="cs-reveal text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-wide mb-10">
            Production cinématique de 6 vidéos institutionnelles assistées par IA pour un établissement scolaire privé à Rabat, fondé en 1981.
          </p>

          <a
            href="https://le-petit-college.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="cs-reveal inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#00FF41]/50 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all text-sm font-mono tracking-wider"
          >
            <ExternalLink className="w-4 h-4" />
            VISIT LIVE SITE
          </a>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
           SECTION 01 — CONTEXTE & OBJECTIF
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 scroll-mt-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="cs-heading text-4xl md:text-7xl font-bold tracking-tighter mb-6">
            Le <span className="text-[#00ff41]">Contexte</span>
          </h2>
          <p className="cs-reveal text-zinc-400 text-lg md:text-2xl max-w-3xl">
            Un établissement d'exception au cœur de Rabat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <div className="cs-reveal space-y-6">
            <div className="text-[#00FF41] font-mono text-xs tracking-widest uppercase mb-2">&gt; CONTEXTE_GÉNÉRAL</div>
            <p className="text-zinc-300 leading-relaxed">
              Le Petit Collège est un établissement scolaire privé situé à Rabat, fondé en 1981, autorisé à dispenser le programme français de la maternelle à la terminale.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              L'école accueille depuis toujours des familles diplomatiques, expatriées et internationales, avec plus de 50 nationalités représentées. Un établissement à taille humaine, reconnu pour sa stabilité, son climat scolaire serein et sa continuité éducative.
            </p>
          </div>

          <div className="cs-reveal space-y-6">
            <div className="text-[#00FF41] font-mono text-xs tracking-widest uppercase mb-2">&gt; OBJECTIF_STRATÉGIQUE</div>
            <p className="text-zinc-300 leading-relaxed">
              Produire 5 vidéos institutionnelles de très haute qualité destinées aux ambassades, institutions et familles internationales.
            </p>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#00FF41] mt-0.5 shrink-0" /> Inspirer confiance et transmettre la stabilité</li>
              <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#00FF41] mt-0.5 shrink-0" /> Rendu cinématographique, sobre et élégant</li>
              <li className="flex items-start gap-3"><ArrowRight className="w-4 h-4 text-[#00FF41] mt-0.5 shrink-0" /> Aucune approche publicitaire ou commerciale</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
           SECTION 02 — SYSTEM OVERRIDE (Before/After + Old Site Video + UI Kit Strip)
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 scroll-mt-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="cs-heading text-4xl md:text-7xl font-bold tracking-tighter mb-6">
            System <span className="text-[#00ff41]">Override</span>
          </h2>
          <p className="cs-reveal text-zinc-400 text-lg md:text-2xl max-w-3xl">
            Comment j'ai contourné les limitations de Wix avec du code artisanal.
          </p>
        </div>

        {/* Textual Comparison */}
        <div className="cs-reveal grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/5 bg-neutral-900/30 backdrop-blur-xl mb-12">
          {/* BEFORE — Wix */}
          <div className="p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/5 relative">
            <LayoutTemplate className="absolute top-8 right-8 w-8 h-8 text-red-500/20" />
            <div className="text-red-400/70 font-mono text-[10px] tracking-widest uppercase mb-4">BEFORE · WIX ENVIRONMENT</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Drag-and-Drop Limitations</h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 text-[10px] shrink-0 mt-0.5">✕</span>
                Rigid grid — layouts rigides, aucun overlap
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 text-[10px] shrink-0 mt-0.5">✕</span>
                Presets d'animation limités, 0 personnalisation
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 text-[10px] shrink-0 mt-0.5">✕</span>
                Aucun contrôle DOM — impossible d'injecter du JS moderne
              </li>
            </ul>
          </div>

          {/* AFTER — Custom Code */}
          <div className="p-8 sm:p-12 lg:p-16 relative bg-[#00FF41]/[0.02]">
            <Code2 className="absolute top-8 right-8 w-8 h-8 text-[#00FF41]/20" />
            <div className="text-[#00FF41] font-mono text-[10px] tracking-widest uppercase mb-4">AFTER · CUSTOM OVERRIDE</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">17 Micro-Sections HTML/JS</h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              J'ai développé 17 modules indépendants en HTML pur, Vanilla JS et CSS avancé, injectés via iframes pour un contrôle total du DOM.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <ArrowRight className="w-4 h-4 text-[#00FF41] mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-400"><strong className="text-white">Injection sécurisée</strong> — contrôle DOM complet</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <ArrowRight className="w-4 h-4 text-[#00FF41] mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-400"><strong className="text-white">60fps garanti</strong> — IntersectionObserver vanilla</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Before / After Interactive Videos ──────────────── */}
        <InteractiveComparison />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
           SECTION 03 — LES 5 VIDÉOS (Cinematic Records)
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="cs-heading text-4xl md:text-7xl font-bold tracking-tighter mb-6">
            Cinematic <span className="text-[#00ff41]">Records</span>
          </h2>
          <p className="cs-reveal text-zinc-400 text-lg md:text-2xl max-w-3xl">
            5 vidéos institutionnelles AI-assisted. Pas d'effets flashy, pas de slogans. Juste du cinéma sobre. <span className="text-zinc-500 text-sm block mt-2">(Hover over covers to preview)</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {videos.map((video) => (
            <HoverVideoCard key={video.num} video={video} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
           SECTION 04 — VIDÉO BONUS (الفيديو 6)
         ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 scroll-mt-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="cs-heading text-4xl md:text-7xl font-bold tracking-tighter mb-6">
            Bonus <span className="text-[#00ff41]">Campaign</span>
          </h2>
        </div>

        <div className="cs-reveal rounded-[2rem] sm:rounded-[3rem] border border-[#00FF41]/20 bg-neutral-900/30 backdrop-blur-xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00FF41]/5 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Plane className="w-5 h-5 text-[#00FF41]" />
                <span className="text-[#00FF41] font-mono text-xs tracking-widest">VID_06 · BONUS</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
                La Campagne Drone
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                La 6ème vidéo bonus, conçue comme le moteur principal de conversion. L'inscription commence par un parent amenant son enfant à découvrir l'école.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                La caméra nous plonge à l'intérieur puis à l'extérieur pour capter l'atmosphère. Un drone s'élève, annonçant officiellement l'ouverture des inscriptions pour la nouvelle année sur les écrans géants d'Europe.
              </p>

              <a 
                href="https://le-petit-college.vercel.app/inscription" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm font-mono tracking-widest text-black bg-white hover:bg-[#00FF41] transition-colors px-6 py-3 rounded-full"
              >
                EXPERIENCE FULL CAMPAIGN
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <BonusVideoCard />
          </div>
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}
