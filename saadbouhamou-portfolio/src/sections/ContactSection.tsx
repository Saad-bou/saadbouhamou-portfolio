'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mail, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CONTACT_EMAIL, LINKEDIN_URL, GITHUB_URL, WHATSAPP_URL } from '@/lib/contact';

// Terminal form (INITIALIZE_PROJECT.exe) is below the fold and heavy —
// fetched client-side only when the Contact section approaches the viewport.
const ProjectInitializer = dynamic(
  () => import('@/components/ui/ProjectInitializer'),
  { ssr: false, loading: () => <div className="min-h-[480px]" aria-hidden="true" /> }
);


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

// ── Direct channel row ────────────────────────────────────────────────────────
interface DirectChannelProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  ariaLabel: string;
  index: number;
}

function DirectChannel({ icon, label, description, href, ariaLabel, index }: DirectChannelProps) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
      className="group flex items-center gap-4 py-3.5 border-b border-white/[0.07]
                 hover:border-[#00ff41]/30 transition-colors duration-300"
    >
      <span
        className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg
                   border border-[#00ff41]/20 bg-[#00ff41]/[0.04] text-[#00ff41]/60
                   group-hover:text-[#00ff41] group-hover:border-[#00ff41]/40
                   group-hover:shadow-[0_0_14px_rgba(0,255,65,0.15)]
                   transition-all duration-300"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-xs md:text-sm text-white/70 group-hover:text-white transition-colors duration-200 truncate">
          {label}
        </span>
        <span className="block font-mono text-[10px] text-white/30 tracking-wide">
          {description}
        </span>
      </span>
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
      className="relative w-full scroll-mt-28 py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 overflow-x-clip [@media(min-width:1565px)]:max-w-[85vw] [@media(min-width:1565px)]:px-12 [@media(min-width:1565px)]:py-32 [@media(min-width:1800px)]:max-w-[85vw] [@media(min-width:1800px)]:px-[5vw] [@media(min-width:1800px)]:py-[6vw]"
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
          [SYSTEM] Connection available.<br />
          Let&apos;s build something exceptional.
        </p>
        <p className="mt-4 text-zinc-500 text-sm md:text-base max-w-2xl mx-auto font-mono">
          Have a system to build, a problem to solve, or an idea to deploy?<br className="hidden sm:block" />
          Initialize a connection and let&apos;s build it.
        </p>
      </div>

      {/* ════════════════════════════════
          MIDDLE — INITIALIZE_PROJECT.exe Terminal Panel
          ════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-20 md:mb-28 [@media(min-width:1800px)]:mb-[5vw]"
      >
        <ProjectInitializer />
      </motion.div>

      {/* ════════════════════════════════
          BOTTOM — Direct Channels + Socials Grid
          ════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="font-mono text-[10px] md:text-[11px] text-white/30 tracking-[0.25em] uppercase mb-4">
            Direct_Channels
          </p>

          <DirectChannel
            index={0}
            icon={<Mail className="w-4 h-4" />}
            label={CONTACT_EMAIL}
            description="Direct email • Fast response"
            href={`mailto:${CONTACT_EMAIL}`}
            ariaLabel={`Email Saad Bouhamou at ${CONTACT_EMAIL}`}
          />
          <DirectChannel
            index={1}
            icon={<MessageCircle className="w-4 h-4" />}
            label="WhatsApp"
            description="Quick chat • Direct connection"
            href={WHATSAPP_URL}
            ariaLabel="Message Saad Bouhamou on WhatsApp (opens in a new tab)"
          />

          <div className="flex items-center gap-2 mt-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff41] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff41]" />
            </span>
            <span className="font-mono text-[10px] text-[#00ff41]/60 tracking-widest">
              AVAILABLE_FOR_PROJECTS — Remote • Worldwide
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
              href={LINKEDIN_URL}
              handle="/in/saad-bouhamou-59278a3bb"
            />
            <SocialLinkRow
              index={1}
              label="GitHub"
              href={GITHUB_URL}
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
