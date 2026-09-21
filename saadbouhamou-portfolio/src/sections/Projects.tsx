'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Activity, Terminal, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGsapScoped } from '@/lib/useGsapScoped';
import CyberOrbitalCanvas from '@/components/ui/CyberOrbitalCanvas';
import CyberPadlockNode from '@/components/ui/CyberPadlockNode';

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT DATA & CYBERNETIC ATTRIBUTES
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  isInternal?: boolean;
  brandColor: string;
  glowColor: string;
  securityLevel: string;
  nodeHash: string;
  launchDate: string;
  stats: {
    perf: string;
    latency: string;
    security: string;
  };
}

let projects: ProjectItem[] = [
  {
    id: 1,
    title: 'WIMA CAR',
    category: 'Client Platform + SEO',
    description:
      'Car-rental platform for WIMA CAR, Rabat — a multilingual Next.js build with a crawlable vehicle catalogue, a technical SEO foundation and a measurable local organic footprint across 5 languages.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'SEO', 'Local Search'],
    image: '/projects/wima-car/cover.webp',
    link: '/wima-car',
    isInternal: true,
    brandColor: '#D71920',
    glowColor: 'rgba(215, 25, 32, 0.45)',
    securityLevel: 'SYS.LEVEL // 05 (CLIENT LIVE)',
    nodeHash: '0x5749',
    launchDate: '08/2026',
    stats: {
      perf: 'NEXT.JS 16',
      latency: '5 LANGUAGES',
      security: 'SEO + LOCAL',
    },
  },
  {
    id: 2,
    title: 'MONO',
    category: 'E-commerce Platform + AI',
    description: 'Full-stack e-commerce platform with an AI virtual try-on: Next.js frontend, Node.js/Express REST API, Prisma + MySQL, and a provider-based AI pipeline that renders garments on the customer\u2019s own photo.',
    tech: ['Next.js', 'Node.js', 'Express', 'Prisma', 'MySQL', 'JWT', 'AI'],
    image: '/projects/mono/tryon-hero.webp',
    link: '/mono',
    isInternal: true,
    brandColor: '#FFFFFF',
    glowColor: 'rgba(255, 255, 255, 0.42)',
    securityLevel: 'SYS.LEVEL // 05 (JWT SECURED)',
    nodeHash: '0x4D4F',
    launchDate: '08/2026',
    stats: {
      perf: 'FULL-STACK',
      latency: 'AI PIPELINE',
      security: 'JWT AUTH',
    },
  },
  {
    id: 3,
    title: 'Le Petit Collège',
    category: 'Education Platform',
    description: 'Custom educational platform engineered to replace Wix: 17 independent Vanilla JS/CSS micro-modules, 60fps animations, and AI video integrations.',
    tech: ['HTML5', 'Vanilla JS', 'CSS3', 'Modular Architecture'],
    image: '/projects/petit-college-vVIP.webp',
    link: '/le-petit-college',
    isInternal: true,
    brandColor: '#00FF41',
    glowColor: 'rgba(0, 255, 65, 0.45)',
    securityLevel: 'SYS.LEVEL // 05 (ENCRYPTED)',
    nodeHash: '0x8FA2',
    launchDate: '06/2026',
    stats: {
      perf: '100% LIGHTHOUSE',
      latency: '0.04MS',
      security: 'MAX SECURED',
    },
  },
  {
    id: 4,
    title: 'Asus',
    category: 'Hardware \u0026 ROG Showcase',
    description: 'Asus gaming and commercial tech showcase for Mediazone featuring cutting-edge hardware matrices and high-contrast cyberpunk styling.',
    tech: ['HTML5', 'CSS3', 'JS', 'Hardware UI'],
    image: '/projects/assusmatrix.webp',
    link: 'https://assus-mediazone.vercel.app/',
    brandColor: '#FF0055',
    glowColor: 'rgba(255, 0, 85, 0.45)',
    securityLevel: 'SYS.LEVEL // 05 (ROG SECURE)',
    nodeHash: '0x99AA',
    launchDate: '04/2025',
    stats: {
      perf: 'OVERCLOCKED',
      latency: '0.02MS',
      security: 'SHIELDED',
    },
  },
  {
    id: 5,
    title: 'Mediazone Pro',
    category: 'B2B Solutions \u0026 Landing',
    description: 'Professional B2B digital portal engineered for enterprise solutions, service showcases, and client conversion workflows.',
    tech: ['HTML5', 'CSS3', 'JS', 'Enterprise Stack'],
    image: '/projects/promatrix.webp',
    link: 'https://landing-page-media-zone.vercel.app/',
    brandColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    securityLevel: 'SYS.LEVEL // 04 (ENTERPRISE)',
    nodeHash: '0x4F18',
    launchDate: '04/2025',
    stats: {
      perf: 'OPTIMIZED',
      latency: '0.09MS',
      security: 'ENTERPRISE',
    },
  },
  {
    id: 6,
    title: 'Samsung',
    category: 'E-commerce Partner',
    description: 'Samsung partner ecosystem portal featuring modern high-density hardware layouts, responsive product matrices, and interactive UI nodes.',
    tech: ['HTML5', 'CSS3', 'JS', 'UI Craft'],
    image: '/projects/samsungmatrix.webp',
    link: 'https://samsung-mediazone.vercel.app/',
    brandColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    securityLevel: 'SYS.LEVEL // 05 (ACTIVE)',
    nodeHash: '0x2D90',
    launchDate: '03/2025',
    stats: {
      perf: '60 FPS',
      latency: '0.15MS',
      security: 'VERIFIED',
    },
  },
  {
    id: 7,
    title: 'JBL',
    category: 'Audio \u0026 E-commerce',
    description: 'JBL authorized partner platform with advanced AJAX dynamic filtering, real-time product queries, and sleek sound-gear presentation.',
    tech: ['HTML5', 'CSS3', 'JS', 'AJAX'],
    image: '/projects/jblmatrix.webp',
    link: 'https://jbl-audio-mediazone.vercel.app/',
    brandColor: '#FF7A00',
    glowColor: 'rgba(255, 122, 0, 0.45)',
    securityLevel: 'SYS.LEVEL // 04 (SECURED)',
    nodeHash: '0x7E41',
    launchDate: '02/2025',
    stats: {
      perf: 'TURBO LOAD',
      latency: '0.08MS',
      security: 'FILTERED',
    },
  },
  {
    id: 8,
    title: 'Yamaha',
    category: 'E-commerce Platform',
    description: 'Yamaha partner e-commerce platform for Mediazone — engineered for ultra-fast catalog discovery, streamlined checkout, and high conversion.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
    image: '/projects/yamaha-desktop-vvip.webp',
    link: 'https://yamaha-mediazone.vercel.app/',
    brandColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.45)',
    securityLevel: 'SYS.LEVEL // 04 (SECURED)',
    nodeHash: '0x3B19',
    launchDate: '01/2025',
    stats: {
      perf: '60 FPS',
      latency: '0.12MS',
      security: 'AUTHENTICATED',
    },
  },
];

const padNum = (n: number) => String(n).padStart(2, '0');

/* ═══════════════════════════════════════════════════════════════════════════
   HUD CORNER ACCENT
   ═══════════════════════════════════════════════════════════════════════════ */
function HudCorner({
  pos,
  size = 14,
  strokeWidth = 1.5,
  opacity = 0.85,
  color = '#00ff41',
}: {
  pos: 'tl' | 'tr' | 'bl' | 'br';
  size?: number;
  strokeWidth?: number;
  opacity?: number;
  color?: string;
}) {
  const s = size;
  const d: Record<string, string> = {
    tl: `M${s} 0L0 0L0 ${s}`,
    tr: `M0 0L${s} 0L${s} ${s}`,
    bl: `M0 0L0 ${s}L${s} ${s}`,
    br: `M0 0L${s} 0L${s} ${s}`,
  };
  const c: Record<string, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0',
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={`absolute ${c[pos]} pointer-events-none z-10`}
      fill="none"
      aria-hidden="true"
    >
      <path d={d[pos]} stroke={color} strokeWidth={strokeWidth} opacity={opacity} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PROJECTS SECTION COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(new Array(projects.length).fill(null));

  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(220);
  const [isMobile, setIsMobile] = useState(false);

  // Orbit rotation animation state
  const orbitAngleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const orbitRadiusRef = useRef(220);
  const nodeScaleRef = useRef(1);

  const dispIdx = hoverIdx !== null ? hoverIdx : activeIdx;
  const actProj = projects[dispIdx] || projects[0];

  // Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update hover ref for the animation loop
  useEffect(() => {
    isHoveredRef.current = hoverIdx !== null;
  }, [hoverIdx]);

  /* ── Responsive Orbital Radius & Pure 60FPS Rotation Loop ─────────── */
  useEffect(() => {
    if (!mounted) return;

    const calcRadius = () => {
      const w = window.innerWidth;
      if (w < 400) return 100;
      if (w < 480) return 118;
      if (w < 640) return 140;
      if (w < 768) return 160;
      if (w < 1024) return 215;
      if (w < 1280) return 240;
      if (w < 1565) return 265;
      const extraWidth = w - 1565;
      return Math.min(265 + extraWidth * 0.25, 550);
    };

    const calcNodeScale = () => {
      const w = window.innerWidth;
      if (w < 480) return 0.75;
      if (w < 640) return 0.80;
      if (w < 768) return 0.85;
      if (w < 1565) return 1;
      const extraWidth = w - 1565;
      return Math.min(1 + extraWidth * 0.0005, 1.6);
    };

    const initR = calcRadius();
    orbitRadiusRef.current = initR;
    setOrbitRadius(initR);
    nodeScaleRef.current = calcNodeScale();
    setIsMobile(window.innerWidth < 768);

    const onResize = () => {
      const r = calcRadius();
      orbitRadiusRef.current = r;
      setOrbitRadius(r);
      nodeScaleRef.current = calcNodeScale();
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let lastTimestamp = performance.now();
    let isVisible = true;

    const animateOrbit = (time: number) => {
      if (!isVisible || document.hidden) {
        rafRef.current = 0;
        return;
      }

      const dt = Math.min((time - lastTimestamp) / 1000, 0.1);
      lastTimestamp = time;

      // Auto-rotation: pause smoothly on desktop hover, continuous otherwise
      if (!isHoveredRef.current) {
        orbitAngleRef.current += dt * 0.28;
      } else {
        // Subtle organic drift even when hovering
        orbitAngleRef.current += dt * 0.02;
      }

      const curAngle = orbitAngleRef.current;
      const r = orbitRadiusRef.current;
      const n = projects.length;

      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const baseAngle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const totalAngle = baseAngle + curAngle;

        // Elliptical galaxy projection for modern cyber depth
        const x = Math.cos(totalAngle) * r;
        const y = Math.sin(totalAngle) * (r * 0.88);

        el.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${nodeScaleRef.current})`;
      });

      rafRef.current = requestAnimationFrame(animateOrbit);
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) {
          lastTimestamp = performance.now();
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animateOrbit);
          }
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
          }
        }
      },
      { threshold: 0 }
    );
    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && isVisible) {
        lastTimestamp = performance.now();
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animateOrbit);
        }
      } else {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    rafRef.current = requestAnimationFrame(animateOrbit);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', onResize);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mounted]);

  /* ── GSAP Entrance Animations ─────────────────────────────────────── */
  useGsapScoped(containerRef, (gsap) => {
    const h = headingRef.current;
    const s = subtitleRef.current;
    const g = galaxyRef.current;

    if (h) {
      gsap.set(h, { opacity: 0, y: 35, filter: 'blur(8px)', color: '#00FF41' });
      gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 88%', end: 'top 52%', scrub: 1 } })
        .to(h, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' })
        .to(h, { color: '#ffffff', duration: 0.4, ease: 'power1.inOut' }, '<0.3');
    }

    if (s) {
      gsap.set(s, { opacity: 0, y: 25 });
      gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' } })
        .to(s, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    }

    if (g) {
      gsap.set(g, { opacity: 0, scale: 0.92 });
      gsap.to(g, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: g, start: 'top 82%', end: 'top 45%', scrub: 1 },
      });
    }

    const feat = containerRef.current?.querySelector('[data-feat]');
    if (feat) {
      gsap.set(feat, { opacity: 0, y: 35 });
      gsap.to(feat, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: feat, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }

    const thumbs = containerRef.current?.querySelector('[data-thumbs]');
    if (thumbs) {
      gsap.set(thumbs, { opacity: 0, y: 25 });
      gsap.to(thumbs, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: thumbs, start: 'top 88%', toggleActions: 'play none none reverse' },
      });
    }
  });

  /* ── Carousel Arrow Navigation (Desktop) ─────────────────────────── */
  const scrollCarousel = useCallback((direction: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('button')?.offsetWidth || 220;
    el.scrollBy({
      left: direction === 'next' ? cardWidth + 16 : -(cardWidth + 16),
      behavior: 'smooth',
    });
  }, []);

  const selectProject = useCallback((idx: number) => {
    setActiveIdx(idx);
    // Smooth scroll card into view inside carousel
    const el = carouselRef.current;
    if (el && el.children[idx]) {
      (el.children[idx] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, []);

  const words = actProj.title.split(' ');
  const lastW = words.length > 1 ? words.pop() : null;
  const firstW = words.join(' ');
  const galaxyBoxSize = orbitRadius * 2 + 130;

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full scroll-mt-28 py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto z-10 overflow-hidden [@media(min-width:1565px)]:max-w-[85vw] [@media(min-width:1565px)]:px-12 [@media(min-width:1565px)]:py-32 [@media(min-width:1800px)]:max-w-[85vw] [@media(min-width:1800px)]:px-[5vw] [@media(min-width:1800px)]:py-[6vw]"
    >
      {/* ━━━ HERO ROW (SPLIT LAYOUT) ━━━ */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-4 items-center">
        {/* LEFT: Heading & Cyber Telemetry */}
        <div className="text-center lg:text-left order-1">
          {/* Cyber Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00ff41]/30 bg-black/60 backdrop-blur-md mb-4 shadow-[0_0_12px_rgba(0,255,65,0.15)] [@media(min-width:1800px)]:px-[0.6vw] [@media(min-width:1800px)]:py-[0.25vw] [@media(min-width:1800px)]:mb-[1vw] [@media(min-width:1800px)]:gap-[0.4vw]">
            <span className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41] [@media(min-width:1800px)]:w-[0.35vw] [@media(min-width:1800px)]:h-[0.35vw]" />
            <span className="font-mono text-[10px] md:text-xs text-[#00ff41] tracking-[0.25em] uppercase font-bold [@media(min-width:1800px)]:text-[0.35vw]">
              {'// SYSTEM.NETWORK.ASSETS'}
            </span>
          </div>

          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.88] mb-5 [@media(min-width:1565px)]:text-8xl [@media(min-width:1800px)]:text-[5vw]"
          >
            SECURED
            <br />
            <span className="text-[#00ff41] drop-shadow-[0_0_24px_rgba(0,255,65,0.45)]">
              DIGITAL ASSETS
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 [@media(min-width:1800px)]:text-[1.3vw] [@media(min-width:1800px)]:max-w-[28vw] [@media(min-width:1800px)]:leading-relaxed"
          >
            High-performance web architecture, encrypted client platforms, and custom digital platforms engineered with rock-solid security, sub-100ms response times, and 60fps animations.
          </p>

          {/* Telemetry Readout Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 font-mono text-[11px] mb-4 [@media(min-width:1800px)]:max-w-[28vw] [@media(min-width:1800px)]:gap-[1vw]">
            <div className="p-2.5 rounded border border-[#00ff41]/20 bg-black/50 backdrop-blur-sm [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[9px] text-zinc-500 uppercase tracking-wider [@media(min-width:1800px)]:text-[0.6vw]">NODES</span>
              <span className="text-[#00ff41] font-bold tracking-widest [@media(min-width:1800px)]:text-[0.8vw]">
                {padNum(projects.length)} ONLINE
              </span>
            </div>
            <div className="p-2.5 rounded border border-[#00ff41]/20 bg-black/50 backdrop-blur-sm [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[9px] text-zinc-500 uppercase tracking-wider [@media(min-width:1800px)]:text-[0.6vw]">PROTOCOL</span>
              <span className="text-white font-bold tracking-widest [@media(min-width:1800px)]:text-[0.8vw]">HTTPS // TLS3</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-2.5 rounded border border-[#00ff41]/20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center w-full [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5 [@media(min-width:1800px)]:text-[0.6vw]">STATUS</span>
              <span className="flex items-center justify-center gap-1.5 w-full mx-auto text-[#00ff41] font-bold tracking-widest [@media(min-width:1800px)]:text-[0.8vw] [@media(min-width:1800px)]:gap-[0.5vw]">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 [@media(min-width:1800px)]:w-[1vw] [@media(min-width:1800px)]:h-[1vw]" />
                <span>100% SECURE</span>
              </span>
            </div>
          </div>
        </div>
        {/* RIGHT: THE CENTRAL CYBER GALAXY / ORBITAL SYSTEM (2D CANVAS REPLACER) */}
        <div className="order-2 relative flex items-center justify-center">
          {/* Top-Right HUD Widget */}
          <div
            className="hidden lg:block absolute top-0 right-2 z-30 pointer-events-none [@media(min-width:1800px)]:right-[2vw]"
            aria-hidden="true"
          >
            <div className="relative px-3.5 py-2 border border-[#00ff41]/25 bg-black/75 backdrop-blur-md rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.08)] [@media(min-width:1800px)]:px-[0.8vw] [@media(min-width:1800px)]:py-[0.5vw]">
              <HudCorner pos="tl" size={8} strokeWidth={1.5} />
              <HudCorner pos="tr" size={8} strokeWidth={1.5} />
              <HudCorner pos="bl" size={8} strokeWidth={1.5} />
              <HudCorner pos="br" size={8} strokeWidth={1.5} />
              <div className="font-mono text-[9px] text-[#00ff41] tracking-[0.24em] uppercase font-bold drop-shadow-[0_0_6px_rgba(0,255,65,0.4)] [@media(min-width:1800px)]:text-[0.4vw]">
                ORBITAL NETWORK ACTIVE
              </div>
              <div className="font-mono text-[7.5px] text-[#00ff41]/60 tracking-[0.18em] uppercase mt-0.5 [@media(min-width:1800px)]:text-[0.35vw] [@media(min-width:1800px)]:mt-[0.2vw]">
                HOVER TO INSPECT · CLICK TO DECRYPT
              </div>
            </div>
          </div>

          {/* Galaxy Viewport */}
          <div
            ref={galaxyRef}
            className="relative select-none flex items-center justify-center"
            style={{
              width: galaxyBoxSize,
              height: galaxyBoxSize,
              maxWidth: '96vw',
              maxHeight: '96vw',
            }}
            role="region"
            aria-label={`Cyber security interactive galaxy with ${projects.length} project nodes.`}
          >
            {/* ── HIGH-PERFORMANCE 2D HTML5 CANVAS GALAXY ── */}
            {mounted && (
              <CyberOrbitalCanvas
                activeColor={actProj.brandColor}
                isPaused={hoverIdx !== null}
              />
            )}

            {/* ── PROJECT LOCK NODES LAYER (IMAGE 4 STYLE) ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {projects.map((proj, idx) => {
                const isActive = activeIdx === idx;
                const isHovered = hoverIdx === idx;

                return (
                  <div
                    key={proj.id}
                    ref={(el) => {
                      nodeRefs.current[idx] = el;
                    }}
                    className="absolute pointer-events-auto transition-transform duration-75"
                    style={{
                      willChange: 'transform',
                    }}
                  >
                    <CyberPadlockNode
                      id={proj.id}
                      title={proj.title}
                      category={proj.category}
                      brandColor={proj.brandColor}
                      glowColor={proj.glowColor}
                      isActive={isActive}
                      isHovered={isHovered}
                      nodeScale={nodeScaleRef.current}
                      onClick={() => selectProject(idx)}
                      onMouseEnter={() => setHoverIdx(idx)}
                      onMouseLeave={() => setHoverIdx(null)}
                      onFocus={() => {
                        setHoverIdx(idx);
                        setActiveIdx(idx);
                      }}
                      onBlur={() => setHoverIdx(null)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ━━━ DIVIDER (CYBER LASER SEPARATOR) ━━━ */}
      <div
        className="h-px my-10 md:my-14"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, transparent, ${actProj.brandColor}40, ${actProj.brandColor}, ${actProj.brandColor}40, transparent)`,
          transition: 'background 0.4s ease',
        }}
      />

      {/* ━━━ FEATURED PROJECT SECTION (BOTTOM SECTION) ━━━ */}
      <article data-feat className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {/* Left Column: Details & Technical Specifications */}
        <AnimatePresence mode="wait">
          <motion.div
            key={actProj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center lg:text-left order-2 lg:order-1 relative lg:pl-6"
          >
          {/* Cyber left accent border with dynamic brand glow */}
          <div
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-px transition-colors duration-400"
            style={{
              background: `linear-gradient(to bottom, ${actProj.brandColor}80, ${actProj.brandColor}20, transparent)`,
            }}
          />
          <div
            className="hidden lg:block absolute left-0 top-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-400"
            style={{ borderColor: actProj.brandColor }}
          />

          {/* Top Status Header */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 flex-wrap [@media(min-width:1800px)]:mb-[1.5vw] [@media(min-width:1800px)]:gap-[1vw]">
            <span
              className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold transition-colors duration-300 [@media(min-width:1800px)]:text-[0.7vw]"
              style={{
                color: actProj.brandColor,
                textShadow: `0 0 8px ${actProj.glowColor}`,
              }}
            >
              {'// FEATURED ASSET'}
            </span>
            <span className="text-zinc-600 font-mono text-[10px] [@media(min-width:1800px)]:text-[0.7vw]">•</span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider [@media(min-width:1800px)]:text-[0.7vw]">
              {actProj.securityLevel}
            </span>
            <span className="text-zinc-600 font-mono text-[10px] [@media(min-width:1800px)]:text-[0.7vw]">•</span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 [@media(min-width:1800px)]:text-[0.65vw] [@media(min-width:1800px)]:px-[0.8vw] [@media(min-width:1800px)]:py-[0.3vw] [@media(min-width:1800px)]:gap-[0.5vw]"
              style={{
                borderColor: `${actProj.brandColor}50`,
                color: actProj.brandColor,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                boxShadow: `0 0 8px ${actProj.glowColor}`,
                textShadow: `0 0 6px ${actProj.glowColor}`,
              }}
            >
              DEPLOYED: {actProj.launchDate}
            </span>
          </div>

          {/* Project Title with Dual Tone */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.9] mb-3 [@media(min-width:1565px)]:text-7xl [@media(min-width:1800px)]:text-[4vw]">
            {lastW ? (
              <>
                {firstW}
                <br />
                <span
                  className="transition-all duration-300"
                  style={{
                    color: actProj.brandColor,
                    textShadow: `0 0 20px ${actProj.glowColor}`,
                  }}
                >
                  {lastW}
                </span>
              </>
            ) : (
              <span style={{ color: actProj.brandColor }}>{actProj.title}</span>
            )}
          </h3>

          <p className="text-zinc-300 text-sm md:text-base font-medium mb-3 [@media(min-width:1800px)]:text-[1.1vw] [@media(min-width:1800px)]:mb-[1vw]">
            {actProj.category}
          </p>

          <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed max-w-md mx-auto lg:mx-0 mb-6 [@media(min-width:1800px)]:max-w-[28vw] [@media(min-width:1800px)]:text-[1vw] [@media(min-width:1800px)]:leading-relaxed [@media(min-width:1800px)]:mb-[2vw]">
            {actProj.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start mb-6 [@media(min-width:1800px)]:gap-[0.6vw] [@media(min-width:1800px)]:mb-[3vw]">
            {actProj.tech.map((t, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono tracking-wide [@media(min-width:1800px)]:text-[0.65vw] [@media(min-width:1800px)]:px-[0.8vw] [@media(min-width:1800px)]:py-[0.4vw]"
              >
                [{t}]
              </span>
            ))}
          </div>

          {/* Live Performance & Security Stats */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 mb-8 text-left font-mono text-[10px] [@media(min-width:1800px)]:max-w-[28vw] [@media(min-width:1800px)]:gap-[1vw] [@media(min-width:1800px)]:mb-[3vw]">
            <div className="p-2 rounded border border-white/10 bg-black/60 [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[8.5px] text-zinc-500 uppercase [@media(min-width:1800px)]:text-[0.5vw]">PERF</span>
              <span className="text-white font-bold [@media(min-width:1800px)]:text-[0.8vw]">{actProj.stats.perf}</span>
            </div>
            <div className="p-2 rounded border border-white/10 bg-black/60 [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[8.5px] text-zinc-500 uppercase [@media(min-width:1800px)]:text-[0.5vw]">LATENCY</span>
              <span className="text-[#00FF41] font-bold [@media(min-width:1800px)]:text-[0.8vw]">{actProj.stats.latency}</span>
            </div>
            <div className="p-2 rounded border border-white/10 bg-black/60 [@media(min-width:1800px)]:p-[1vw]">
              <span className="block text-[8.5px] text-zinc-500 uppercase [@media(min-width:1800px)]:text-[0.5vw]">STATUS</span>
              <span className="text-white font-bold [@media(min-width:1800px)]:text-[0.8vw]">{actProj.stats.security}</span>
            </div>
          </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href={actProj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-zinc-200 h-10 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-lg [@media(min-width:1800px)]:h-[3vw] [@media(min-width:1800px)]:px-[2vw] [@media(min-width:1800px)]:text-[0.75vw] [@media(min-width:1800px)]:gap-[0.6vw]"
              >
                View Project <ExternalLink className="w-3.5 h-3.5 [@media(min-width:1800px)]:w-[1vw] [@media(min-width:1800px)]:h-[1vw]" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right Column: Layered Cyber HUD Frame */}
        <div className="relative order-1 lg:order-2">
          {/* Ambient Brand Glow */}
          <div
            className="absolute -inset-6 pointer-events-none transition-all duration-500"
            aria-hidden="true"
            style={{
              background: `radial-gradient(ellipse at 60% 50%, ${actProj.glowColor} 0%, transparent 70%)`,
              filter: 'blur(25px)',
            }}
          />

          {/* Primary Featured HUD Frame */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${actProj.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative rounded-xl overflow-hidden border-[1.5px] bg-black z-10"
              style={{
                borderColor: `${actProj.brandColor}70`,
                boxShadow: `0 0 30px ${actProj.glowColor}, inset 0 0 25px rgba(0,0,0,0.85)`,
              }}
            >
              <HudCorner pos="tl" size={18} strokeWidth={2} opacity={0.9} color={actProj.brandColor} />
              <HudCorner pos="tr" size={18} strokeWidth={2} opacity={0.9} color={actProj.brandColor} />
              <HudCorner pos="bl" size={18} strokeWidth={2} opacity={0.9} color={actProj.brandColor} />
              <HudCorner pos="br" size={18} strokeWidth={2} opacity={0.9} color={actProj.brandColor} />

              <div className="relative aspect-[16/10] bg-black">
              <Image
                src={actProj.image}
                alt={`${actProj.title} — ${actProj.category} project preview`}
                fill
                sizes="(max-width:1024px) 92vw, 46vw"
                quality={82}
                className="object-cover transition-opacity duration-300"
                loading="lazy"
              />

              {/* Cyber Scanline Overlay */}
              <div className="absolute inset-0 cyber-scanlines opacity-30 pointer-events-none" />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

              {/* Top HUD Telemetry Bar */}
              <div
                className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none"
                aria-hidden="true"
              >
                <div
                  className="flex items-center gap-1.5 font-mono text-[8.5px] md:text-[9.5px] tracking-[0.2em] font-bold"
                  style={{ color: actProj.brandColor }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: actProj.brandColor,
                      boxShadow: `0 0 6px ${actProj.brandColor}`,
                    }}
                  />
                  NODE // {actProj.nodeHash}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-1.5 py-0.5 rounded border font-mono text-[7.5px] md:text-[8.5px] font-bold tracking-wider uppercase"
                    style={{
                      borderColor: `${actProj.brandColor}60`,
                      color: actProj.brandColor,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      textShadow: `0 0 4px ${actProj.glowColor}`,
                    }}
                  >
                    DEPLOYED: {actProj.launchDate}
                  </span>
                  <span className="font-mono text-[8.5px] md:text-[9.5px] text-zinc-400 tracking-widest tabular-nums">
                    {padNum(dispIdx + 1)} / {padNum(projects.length)}
                  </span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-3.5 left-4 pointer-events-none" aria-hidden="true">
                <span
                  className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{
                    color: actProj.brandColor,
                    textShadow: `0 0 8px ${actProj.glowColor}`,
                  }}
                >
                  {actProj.category}
                </span>
              </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>

      {/* ━━━ HORIZONTAL CARDS CAROUSEL ━━━ */}
      <div data-thumbs className="mt-12 md:mt-16 relative">
        {/* Track Label */}
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />
            <span className="text-[#00FF41]">PROJECT REGISTRY</span>
          </div>

          {/* Mobile HUD Nav Buttons — inline in header, hidden on desktop */}
          {mounted && isMobile && (
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={() => scrollCarousel('prev')}
                aria-label="Previous project"
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#00ff41]/30 bg-black/60 text-[#00ff41] font-mono text-[9px] font-bold tracking-widest uppercase hover:bg-[#00ff41]/20 hover:border-[#00ff41]/60 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] active:scale-95 transition-all duration-200"
              >
                <ChevronLeft className="w-3 h-3" />
                PREV
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('next')}
                aria-label="Next project"
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#00ff41]/30 bg-black/60 text-[#00ff41] font-mono text-[9px] font-bold tracking-widest uppercase hover:bg-[#00ff41]/20 hover:border-[#00ff41]/60 hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] active:scale-95 transition-all duration-200"
              >
                NEXT
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Desktop hint — hidden on mobile */}
          <span className="hidden sm:inline text-zinc-500">USE ARROWS TO NAVIGATE</span>
        </div>

        {/* Desktop Arrow Navigation */}
        {mounted && !isMobile && (
          <>
            <button
              type="button"
              onClick={() => scrollCarousel('prev')}
              aria-label="Previous project"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-[#00ff41]/40 bg-black/80 backdrop-blur-md text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_25px_rgba(0,255,65,0.4)] hover:border-[#00ff41]/70 transition-all duration-300 -ml-5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('next')}
              aria-label="Next project"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-[#00ff41]/40 bg-black/80 backdrop-blur-md text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_25px_rgba(0,255,65,0.4)] hover:border-[#00ff41]/70 transition-all duration-300 -mr-5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Horizontal Scroll Container
             – Mobile: overflow-hidden + touch-none → button-only navigation
             – Desktop: overflow-x-auto + arrow buttons */}
        <div
          ref={carouselRef}
          className={`flex gap-3 md:gap-4 pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory scroll-px-4 select-none ${
            mounted && isMobile
              ? 'overflow-hidden touch-none'
              : 'overflow-x-auto overscroll-x-contain touch-pan-x'
          }`}
          style={{
            WebkitOverflowScrolling: mounted && !isMobile ? 'touch' : 'auto',
            willChange: 'transform',
          }}
        >
          {projects.map((proj, i) => {
            const isActive = i === dispIdx;

            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => selectProject(i)}
                aria-label={`Select ${proj.title} project`}
                aria-pressed={isActive}
                className={`flex-shrink-0 snap-center w-[160px] sm:w-[190px] md:w-[220px] [@media(min-width:1800px)]:w-[18vw] text-left cursor-pointer rounded-xl overflow-hidden border-[1.5px] transition-all duration-300 group/card ${isActive
                  ? 'scale-[1.02] opacity-100 z-10'
                  : 'opacity-65 hover:opacity-95 hover:scale-[1.01]'
                  }`}
                style={{
                  borderColor: isActive ? proj.brandColor : `${proj.brandColor}30`,
                  backgroundColor: 'rgba(5, 5, 8, 0.95)',
                  boxShadow: isActive
                    ? `0 0 20px ${proj.glowColor}, inset 0 0 12px ${proj.glowColor}`
                    : '0 4px 12px rgba(0,0,0,0.7)',
                }}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black pointer-events-none">
                  <Image
                    src={proj.image}
                    alt={`${proj.title} thumbnail`}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 190px, 220px"
                    quality={50}
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 cyber-scanlines opacity-25 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <HudCorner pos="tl" size={8} strokeWidth={1.2} color={proj.brandColor} />
                  <HudCorner pos="tr" size={8} strokeWidth={1.2} color={proj.brandColor} />
                  <div
                    className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[8px] font-bold border backdrop-blur-md pointer-events-none [@media(min-width:1800px)]:text-[0.55vw] [@media(min-width:1800px)]:px-[0.6vw]"
                    style={{
                      borderColor: `${proj.brandColor}60`,
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      color: proj.brandColor,
                    }}
                  >
                    #{padNum(proj.id)}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 bg-black/90 pointer-events-none [@media(min-width:1800px)]:p-[1vw]">
                  <p
                    className="text-xs sm:text-sm font-bold truncate transition-colors duration-200 pointer-events-none [@media(min-width:1800px)]:text-[0.8vw]"
                    style={{
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {proj.title}
                  </p>
                  <p
                    className="text-[9px] sm:text-[10px] font-mono truncate mt-0.5 pointer-events-none [@media(min-width:1800px)]:text-[0.6vw]"
                    style={{ color: `${proj.brandColor}CC` }}
                  >
                    {proj.category}
                  </p>
                  <span
                    className="inline-block mt-1.5 px-1.5 py-0.5 rounded border font-mono text-[7.5px] sm:text-[8px] font-bold tracking-wider uppercase pointer-events-none [@media(min-width:1800px)]:text-[0.55vw] [@media(min-width:1800px)]:px-[0.6vw]"
                    style={{
                      borderColor: `${proj.brandColor}40`,
                      color: `${proj.brandColor}CC`,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    SYS_VER // {proj.launchDate.replace('/', '.')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
