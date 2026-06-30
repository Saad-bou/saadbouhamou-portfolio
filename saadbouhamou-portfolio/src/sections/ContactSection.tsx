'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Cal = dynamic(() => import('@calcom/embed-react'), { ssr: false });

// ── Cal.com embed ─────────────────────────────────────────────────────────────
function CalEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { rootMargin: '300px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    (async function () {
      try {
        const { getCalApi } = await import('@calcom/embed-react');
        const cal = await getCalApi({});
        cal('ui', {
          styles: { branding: { brandColor: '#00ff41' } },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
      } catch (error) {
        console.error('Failed to load Cal API', error);
      }
    })();
  }, [isInView]);

  useEffect(() => {
    if (!isInteractive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsInteractive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInteractive]);

  return (
    <div
      ref={containerRef}
      id="my-cal-inline"
      className="relative w-full max-w-4xl mx-auto px-4 md:px-0 min-h-[600px] md:min-h-[650px] rounded-lg overflow-visible"
      onMouseLeave={() => setIsInteractive(false)}
    >
      <div
        className={`w-full h-full [&_iframe]:!bg-transparent [&_iframe]:!background-color-transparent ${
          isInteractive ? '[&_iframe]:pointer-events-auto' : '[&_iframe]:pointer-events-none'
        }`}
      >
        {isInView && (
          <Cal
            calLink="saadbouhamou.dev/30min"
            style={{ width: '100%', height: '100%', border: 'none' }}
            config={{ layout: 'month_view', theme: 'dark' }}
          />
        )}
      </div>

      {!isInteractive ? (
        <button
          type="button"
          aria-label="Activate booking calendar"
          onClick={() => setIsInteractive(true)}
          className="absolute inset-0 z-10 flex items-start justify-end rounded-lg p-3 text-right outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41]/60"
          style={{ touchAction: 'pan-y' }}
        >
          <span className="rounded border border-[#00ff41]/25 bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#00ff41]/75 shadow-[0_0_18px_rgba(0,255,65,0.12)] backdrop-blur-sm transition-colors duration-200 hover:border-[#00ff41]/50 hover:text-[#00ff41]">
            Click_To_Book
          </span>
        </button>
      ) : (
        <button
          type="button"
          aria-label="Return to page scrolling"
          onClick={() => setIsInteractive(false)}
          className="absolute right-3 top-3 z-20 rounded border border-white/10 bg-black/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 shadow-[0_0_18px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-colors duration-200 hover:border-[#00ff41]/40 hover:text-[#00ff41] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41]/60"
        >
          Scroll_Page
        </button>
      )}
    </div>
  );
}

// ── Social link row ────────────────────────────────────────────────────────────
interface SocialLinkProps {
  label: string;
  href: string;
  handle: string;
  index: number;
}

function SocialLinkRow({ label, href, handle, index }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Connect with Saad Bouhamou on ${label}`}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
      className="group flex items-center justify-between py-4 border-b border-white/[0.07]
                 hover:border-[#00ff41]/30 transition-colors duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <span className="font-mono text-[10px] md:text-[11px] text-white/30 tracking-[0.2em] uppercase w-20 md:w-24 shrink-0">
          {label}
        </span>
        <span className="text-white/70 font-mono text-xs md:text-sm tracking-wide
                         group-hover:text-white transition-colors duration-200">
          {handle}
        </span>
      </div>
      <motion.span
        className="text-[#00ff41] text-lg md:text-xl font-light select-none"
        initial={{ x: 0, y: 0 }}
        whileHover={{ x: 3, y: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}

// ── Main section ───────────────────────────────────────────────────────────────
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // GSAP heading entrance — exactly matching Projects/About sections
  useGSAP(() => {
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;

    if (heading) {
      gsap.set(heading, { opacity: 0, y: 40, filter: 'blur(10px)', color: '#00ff41', skewX: 3 });
      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          end: 'top 50%',
          scrub: 1,
        },
      })
        .to(heading, { opacity: 1, y: 0, filter: 'blur(0px)', skewX: 0, duration: 0.7, ease: 'power2.out' })
        .to(heading, { color: '#ffffff', duration: 0.4, ease: 'power1.inOut' }, '<0.3');
    }

    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, y: 25, filter: 'blur(8px)' });
      gsap.timeline({
        scrollTrigger: {
          trigger: subtitle,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      })
        .to(subtitle, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' });
    }
  }, { scope: sectionRef });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full scroll-mt-28 py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 [@media(min-width:1565px)]:max-w-[85vw] [@media(min-width:1565px)]:px-12 [@media(min-width:1565px)]:py-32 [@media(min-width:1800px)]:max-w-[85vw] [@media(min-width:1800px)]:px-[5vw] [@media(min-width:1800px)]:py-[6vw]"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-4 right-4 md:left-8 md:right-8 h-px
                   bg-gradient-to-r from-transparent via-[#00ff41]/40 to-transparent
                   origin-left"
      />

      {/* ════════════════════════════════
          TOP — Cinematic Heading (Centered like other sections)
          ════════════════════════════════ */}
      <div className="mb-16 md:mb-24 text-center [@media(min-width:1565px)]:mb-32 [@media(min-width:1800px)]:mb-[6vw]">
        <h2
          ref={headingRef}
          className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 uppercase font-mono [@media(min-width:1565px)]:text-8xl [@media(min-width:1565px)]:mb-8 [@media(min-width:1800px)]:text-[6vw] [@media(min-width:1800px)]:mb-[2vw]"
        >
          Incoming Connection // <span className="text-[#00ff41]">Contact</span>
        </h2>
        <p
          ref={subtitleRef}
          className="text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto font-mono [@media(min-width:1565px)]:text-3xl [@media(min-width:1565px)]:max-w-4xl [@media(min-width:1800px)]:text-[1.8vw] [@media(min-width:1800px)]:max-w-[50vw]"
        >
          [SYSTEM] Ready to accept incoming requests —<br />
          Book a call or reach out directly via the channels below.
        </p>
      </div>

      {/* ════════════════════════════════
          MIDDLE — Cal.com Booking Widget
          ════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-20 md:mb-28 max-w-4xl mx-auto [@media(min-width:1800px)]:mb-[5vw]"
      >
        <div
          className="relative w-full rounded-lg border border-white/[0.07] overflow-hidden
                     shadow-[0_0_60px_rgba(0,255,65,0.04),inset_0_0_40px_rgba(0,0,0,0.2)]"
          style={{ background: 'transparent' }}
        >
          <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00ff41]/30 pointer-events-none" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#00ff41]/30 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#00ff41]/30 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00ff41]/30 pointer-events-none" />

          <CalEmbed />
        </div>
      </motion.div>

      {/* ════════════════════════════════
          BOTTOM — Email + Socials Grid
          ════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="font-mono text-[10px] md:text-[11px] text-white/30 tracking-[0.25em] uppercase mb-4">
            Direct_Channel
          </p>
          <a
            href="mailto:bouhamousaad@gmail.com"
            title="Email Saad Bouhamou - Open for Full-Stack & AI Opportunities"
            className="group block text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/80
                       hover:text-white transition-colors duration-300 leading-snug break-all
                       [@media(min-width:1565px)]:text-4xl [@media(min-width:1800px)]:text-[2.6vw]"
          >
            <span className="border-b border-transparent group-hover:border-[#00ff41]/50 transition-colors duration-300 pb-0.5">
              bouhamousaad
            </span>
            <span className="text-[#00ff41]">@gmail.com</span>
          </a>

          <div className="flex items-center gap-2 mt-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
            </span>
            <span className="font-mono text-[10px] text-[#00ff41]/60 tracking-widest">
              AVAILABLE_FOR_PROJECTS
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <p className="font-mono text-[10px] md:text-[11px] text-white/30 tracking-[0.25em] uppercase mb-4">
            Network_Links
          </p>

          <div>
            <SocialLinkRow
              index={0}
              label="LinkedIn"
              href="https://www.linkedin.com/in/saad-bouhamou-59278a3bb/"
              handle="/in/saad-bouhamou-59278a3bb"
            />
            <SocialLinkRow
              index={1}
              label="GitHub"
              href="https://github.com/Saad-bou"
              handle="/Saad-bou"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 md:mt-28 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <span className="font-mono text-[10px] text-white/20 tracking-widest">
          © 2026 SAAD BOUHAMOU — ALL RIGHTS RESERVED
        </span>
        <span className="font-mono text-[10px] text-[#00ff41]/30 tracking-widest">
          BUILT WITH NEXT.JS + FRAMER MOTION
        </span>
      </motion.div>
    </section>
  );
}
