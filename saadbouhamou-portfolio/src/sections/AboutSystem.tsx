'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Briefcase, GraduationCap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MatrixButtonCV from '@/components/ui/MatrixButtonCV';
import MatrixPortalCanvas from '@/components/ui/MatrixPortalCanvas';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const bioText = "I am an elite Full-Stack Developer & AI Strategist, blending precise engineering with premium visual aesthetics. Specializing in high-performance web applications, I architect digital experiences that feel alive. Drawing from my extensive background in developing scalable e-commerce platforms and engineering custom Vanilla JS web ecosystems, I seamlessly merge front-end mastery with AI-driven marketing strategies. From crafting high-conversion AI advertising campaigns to architecting robust backend data pipelines, my work is defined by an obsessive attention to detail, performance optimization, and a drive to push the boundaries of modern digital interactions.";

const careerLogs = [
  { type: 'SYSTEM', text: '[SUCCESS] Mounting Experience_Logs...' },
  { type: 'JOB', company: 'ÉCOLE PETITE COLLÈGE', role: 'IT Agent / Full-Stack Developer', date: 'Dec 2025 - May 2026', desc: 'Initially directed large-scale DB optimization, data indexing & server maintenance. Promoted to Full-Stack / AI Marketer: Engineered a premium Vanilla JS web platform, directed social marketing & produced 6 high-conversion AI advertising videos.' },
  { type: 'JOB', company: 'MEDIAZONE (NETHUB)', role: 'Front-End Developer', date: 'Jan 2025 - Jun 2025', desc: 'Architected & maintained 4 scalable e-commerce platforms. Executed advanced AJAX integrations and PHP backend scripting.' },
  { type: 'JOB', company: "MINISTÈRE DE L'ÉQUIPEMENT", role: 'End-of-Studies Intern (PFE)', date: 'May 2024 - Jun 2024', desc: 'Developed high-performance UI components and integrated core PHP/SQL backend data pipelines.' },
  { type: 'SYSTEM', text: '[SUCCESS] Mounting Academic_Records...' },
  { type: 'EDU', company: 'LICENCE PROFESSIONNELLE', role: 'Web & Mobile Development', date: '2026', desc: 'Advanced full-stack architecture, React, Node.js, and modern mobile frameworks.' },
  { type: 'EDU', company: 'TECHNICIEN SPÉCIALISÉ', role: 'IT Development', date: '2024', desc: 'Software engineering fundamentals, algorithm design, and database management.' },
  { type: 'EDU', company: 'FACULTÉ DES SCIENCES RABAT', role: 'Physics & Chemistry', date: '2022', desc: 'Academic foundation in physical sciences, chemistry, and analytical logic.' },
  { type: 'EDU', company: 'BACCALAURÉAT SCIENTIFIQUE', role: 'Physics & Chemistry', date: '2019', desc: 'Fundamental sciences and mathematics.' },
  { type: 'SYSTEM', text: '[SUCCESS] System specs loaded. Ready for deployment.' }
];

export default function AboutSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Trigger animation using GSAP so it happens exactly when user sees it
  const [isInView, setIsInView] = useState(false);

  const [activeLogIndex, setActiveLogIndex] = useState(-1);
  // Portal done = gates finished animating, safe to unmount them
  const [portalDone, setPortalDone] = useState(false);
  // Matrix canvas active while portal is playing
  const [matrixActive, setMatrixActive] = useState(false);

  // Activate matrix rain as soon as section enters view
  useEffect(() => {
    if (isInView) setMatrixActive(true);
  }, [isInView]);

  useGSAP(() => {
    const heading = headingRef.current;
    if (heading) {
      gsap.set(heading, { opacity: 0, y: 30, filter: 'blur(8px)', color: '#00FF41' });
      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
        },
      })
      .to(heading, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' })
      .to(heading, { color: '#ffffff', duration: 0.3 }, '<0.2');
    }

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 40%', // Triggers when the top of the section reaches 40% of the screen
      onEnter: () => setIsInView(true),
    });

  }, { scope: containerRef });

  // Terminal log execution: fires after portal animation completes
  useEffect(() => {
    if (isInView) {
      let intervalId: ReturnType<typeof setInterval>;
      const timeout = setTimeout(() => {
        let line = 0;
        intervalId = setInterval(() => {
          setActiveLogIndex(line);
          line++;
          if (line >= careerLogs.length) clearInterval(intervalId);
        }, 350);
      }, 2600); // 2.0s terminal appear delay + 0.6s buffer
      return () => {
        clearTimeout(timeout);
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [isInView]);

  return (
    <>
    <section 
      ref={containerRef}
      id="about" 
      className="relative w-full scroll-mt-28 py-20 px-4 md:px-8 max-w-7xl mx-auto z-10 [@media(min-width:1565px)]:max-w-[85vw] [@media(min-width:1565px)]:px-12 [@media(min-width:1565px)]:py-28 [@media(min-width:1800px)]:max-w-[85vw] [@media(min-width:1800px)]:px-[5vw] [@media(min-width:1800px)]:py-[5vw]"
    >
      {/* ═══ STICKY PORTAL OVERLAY ═══
          Sticky positioning keeps the gates inside this section (won't cover the whole site on load)
          but makes them stick to the screen and cover the navbar when the user scrolls down to it. */}
      <AnimatePresence>
        {!portalDone && (
          <div className="absolute inset-0 z-[300] pointer-events-none">
            <div className="sticky top-0 left-0 right-0 h-[100vh] overflow-hidden pointer-events-none">
              
              {/* Matrix Rain — absolute to the sticky container */}
              <MatrixPortalCanvas isActive={matrixActive} />

              {/* Top Gate */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 will-change-transform"
                style={{ 
                  transformOrigin: 'top center', 
                  background: 'rgba(5, 5, 5, 0.4)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
                initial={{ scaleY: 1 }}
                animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 2.4, ease: [0.76, 0, 0.24, 1] }}
                onAnimationComplete={() => isInView && setPortalDone(true)}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
              </motion.div>

              {/* Bottom Gate */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2 will-change-transform"
                style={{ 
                  transformOrigin: 'bottom center', 
                  background: 'rgba(5, 5, 5, 0.4)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
                initial={{ scaleY: 1 }}
                animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 2.4, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
              </motion.div>

              {/* Center Green Glow Line */}
              <motion.div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] z-[10] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 5%, #00FF41 50%, transparent 95%)',
                  boxShadow: '0 0 18px 4px rgba(0,255,65,0.5), 0 0 40px 10px rgba(0,255,65,0.15)',
                }}
                initial={{ opacity: 1, scaleX: 1 }}
                animate={isInView ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.6, delay: 0.8, ease: 'easeInOut' }}
              />

              {/* DECRYPTING text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-[20] pointer-events-none"
                initial={{ opacity: 1 }}
                animate={isInView ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="font-mono text-[#00FF41] text-xs md:text-base lg:text-lg tracking-[0.25em] select-none">
                  <span className="opacity-50">[</span>
                  <span className="opacity-80"> DECRYPTING </span>
                  <span className="text-white font-bold">ABOUT_ME</span>
                  <span className="text-[#00FF41]">.SYS</span>
                  <span className="opacity-50"> ]</span>
                  <span className="inline-block w-1.5 h-4 md:h-5 bg-[#00FF41] ml-1.5 animate-pulse align-middle" />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {/* ═══════════ SECTION CONTENT ═══════════ */}

      <div className="mb-14 md:mb-20 text-center [@media(min-width:1800px)]:mb-[5vw]">
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold tracking-tighter [@media(min-width:1565px)]:text-7xl [@media(min-width:1800px)]:text-[5vw] uppercase font-mono"
        >
          System Specs // <span className="text-[#00ff41]">About</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 [@media(min-width:1800px)]:gap-[4vw] w-full items-stretch">
        
        {/* Permanent Background Matrix Rain (Low Power) */}
        <MatrixPortalCanvas isActive={true} backgroundMode={true} />

        {/* Profile Info & CV Button (Col 1 Row 1 on desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 md:gap-8 [@media(min-width:1800px)]:gap-[2.5vw] justify-start order-1 lg:order-none lg:col-start-1 lg:row-start-1"
        >
          <div className="block">
            <div className="flex items-center gap-2 mb-4 [@media(min-width:1800px)]:mb-[1vw]">
              <Cpu className="w-4 h-4 text-[#00FF41] opacity-80 [@media(min-width:1800px)]:w-[1.2vw] [@media(min-width:1800px)]:h-[1.2vw]" />
              <h3 className="text-sm md:text-base font-bold text-white font-mono uppercase tracking-wider [@media(min-width:1800px)]:text-[1.1vw]">
                System_Profile_Data
              </h3>
            </div>
            
            {/* Claude Pixelated Photo Reveal Box (Floated Left) */}
            <div className="float-left mr-5 mb-2 md:mr-6 md:mb-3 relative w-32 h-32 md:w-36 md:h-36 xl:w-44 xl:h-44 overflow-hidden border border-[#00FF41]/30 bg-black rounded-lg shrink-0 group select-none [@media(min-width:1800px)]:w-[12vw] [@media(min-width:1800px)]:h-[12vw] [@media(min-width:1800px)]:rounded-[0.6vw] [@media(min-width:1800px)]:mr-[2vw] [@media(min-width:1800px)]:mb-[1vw]">
              
              {/* 1. Scanline */}
              <motion.div
                className="absolute inset-x-0 h-[2px] bg-[#00FF41]/40 z-20 pointer-events-none"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />

              {/* 2. CRT Flicker */}
              <motion.div 
                className="absolute inset-0 bg-[#00FF41]/5 mix-blend-color-dodge z-10 pointer-events-none"
                animate={{ opacity: [0.1, 0.18, 0.12, 0.2, 0.1] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* 3. Image with Hover Glitch */}
              <motion.div
                className="w-full h-full relative"
                whileHover={{
                  scale: 1.02,
                  x: [0, -2, 2, -1, 1, 0],
                  y: [0, 1, -1, 1, -1, 0],
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/your-pixel-avatar.webp" 
                  alt="Saad Bouhamou - Full-Stack Developer AI Twin Portrait"
                  title="Saad Bouhamou AI Digital Twin - Lead Architect & Full-Stack Engineer"
                  fill
                  className="object-cover contrast-125 brightness-110"
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </motion.div>

              {/* 4. Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-15 pointer-events-none" />
              
            </div>

            {/* Bio Text */}
            <p className="text-zinc-400 font-mono text-[13px] md:text-[14px] xl:text-[15px] leading-[1.8] md:leading-[1.9] [@media(min-width:1800px)]:text-[0.95vw] [@media(min-width:1800px)]:leading-[1.7vw] text-justify">
              {bioText}
            </p>
          </div>

          {/* Matrix CV Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className=""
          >
            <MatrixButtonCV />
          </motion.div>
        </motion.div>

        {/* Code Block Markdown Skills (Col 1 Row 2 on desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          className="lg:self-end bg-zinc-950/90 border border-white/10 rounded-lg p-4 md:p-5 font-mono text-[11px] md:text-xs text-zinc-400 [@media(min-width:1800px)]:p-[1.2vw] [@media(min-width:1800px)]:text-[0.85vw] [@media(min-width:1800px)]:rounded-[0.5vw] shadow-2xl backdrop-blur-md order-3 lg:order-none lg:col-start-1 lg:row-start-2"
        >
            <div className="flex gap-1.5 mb-3 border-b border-white/5 pb-2 [@media(min-width:1800px)]:mb-[1vw] [@media(min-width:1800px)]:pb-[0.8vw]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 [@media(min-width:1800px)]:w-[0.7vw] [@media(min-width:1800px)]:h-[0.7vw]" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 [@media(min-width:1800px)]:w-[0.7vw] [@media(min-width:1800px)]:h-[0.7vw]" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 [@media(min-width:1800px)]:w-[0.7vw] [@media(min-width:1800px)]:h-[0.7vw]" />
              <span className="text-[10px] text-zinc-600 ml-2 [@media(min-width:1800px)]:text-[0.75vw] [@media(min-width:1800px)]:ml-[0.8vw]">skills_manifest.json</span>
            </div>
            
            {/* MOBILE VERSION: No empty lines (6 lines total) */}
            <div className="flex md:hidden flex-col leading-relaxed w-full">
              <div className="flex w-full">
                <span className="w-4 shrink-0 text-zinc-600 select-none">1</span>
                <div className="flex-1 whitespace-pre-wrap break-words"><span className="text-pink-500">const</span> <span className="text-blue-400">tech_stack</span> = {'{'}</div>
              </div>
              <div className="flex w-full mt-1.5">
                <span className="w-4 shrink-0 text-zinc-600 select-none">2</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-2"><span className="text-[#00FF41]">frontend:</span> ["React", "Next.js", "Tailwind", "Framer Motion", "HTML5", "CSS3", "JavaScript", "Vanilla JS", "Vue.js", "Flutter", "Swift"],</div>
              </div>
              <div className="flex w-full">
                <span className="w-4 shrink-0 text-zinc-600 select-none">3</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-2"><span className="text-[#00FF41]">backend:</span> ["Node.js", "TypeScript", "REST APIs", "PostgreSQL", "PHP", "Express.js", "Laravel", "MongoDB", "Python", "Django"],</div>
              </div>
              <div className="flex w-full">
                <span className="w-4 shrink-0 text-zinc-600 select-none">4</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-2"><span className="text-[#00FF41]">ai_agentic:</span> ["LLM Orchestration", "Prompt Ops", "Agentic UX", "AI Marketing"],</div>
              </div>
              <div className="flex w-full mb-1.5">
                <span className="w-4 shrink-0 text-zinc-600 select-none">5</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-2"><span className="text-[#00FF41]">devops_tools:</span> ["Git", "Docker", "Vercel", "Agile", "DevOps", "UML", "WordPress", "SEO"]</div>
              </div>
              <div className="flex w-full">
                <span className="w-4 shrink-0 text-zinc-600 select-none">6</span>
                <div className="flex-1 whitespace-pre-wrap break-words">{'};'}</div>
              </div>
            </div>

            {/* DESKTOP VERSION: Empty lines for spacing (9 lines total) */}
            <div className="hidden md:flex flex-col leading-relaxed [@media(min-width:1800px)]:leading-[1.8vw] w-full">
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">1</span>
                <div className="flex-1 whitespace-pre-wrap break-words"><span className="text-pink-500">const</span> <span className="text-blue-400">tech_stack</span> = {'{'}</div>
              </div>
              <div className="flex w-full mt-2">
                <span className="w-6 shrink-0 text-zinc-600 select-none">2</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-4"><span className="text-[#00FF41]">frontend:</span> ["React", "Next.js", "Tailwind", "Framer Motion", "HTML5", "CSS3", "JavaScript", "Vanilla JS", "Vue.js", "Flutter", "Swift"],</div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">3</span>
                <div className="flex-1"></div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">4</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-4"><span className="text-[#00FF41]">backend:</span> ["Node.js", "TypeScript", "REST APIs", "PostgreSQL", "PHP", "Express.js", "Laravel", "MongoDB", "Python", "Django"],</div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">5</span>
                <div className="flex-1"></div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">6</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-4"><span className="text-[#00FF41]">ai_agentic:</span> ["LLM Orchestration", "Prompt Ops", "Agentic UX", "AI Marketing"],</div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">7</span>
                <div className="flex-1"></div>
              </div>
              <div className="flex w-full mb-2">
                <span className="w-6 shrink-0 text-zinc-600 select-none">8</span>
                <div className="flex-1 whitespace-pre-wrap break-words pl-4"><span className="text-[#00FF41]">devops_tools:</span> ["Git", "Docker", "Vercel", "Agile", "DevOps", "UML", "WordPress", "SEO"]</div>
              </div>
              <div className="flex w-full">
                <span className="w-6 shrink-0 text-zinc-600 select-none">9</span>
                <div className="flex-1 whitespace-pre-wrap break-words">{'};'}</div>
              </div>
            </div>
          </motion.div>

        {/* Hardcore Matrix CRT Terminal (Col 2 Row 1 spans 2 rows on desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 2.0, duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-full min-h-[500px] bg-[#050505] border border-[#00FF41]/15 rounded-lg overflow-hidden p-4 md:p-6 font-mono shadow-[2px_4px_24px_rgba(0,255,65,0.03)] flex flex-col [@media(min-width:1800px)]:p-[1.8vw] [@media(min-width:1800px)]:rounded-[0.6vw] order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2"
        >
          {/* HIGH PERFORMANCE CRT OVERLAYS (No loop animations to save mobile CPU/Battery) */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-10" />
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,transparent_60%,black_100%)] z-20" />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,255,65,0.05)] z-20" />

          {/* Terminal Content */}
          <div className="relative z-30 text-[#00FF41] text-[11px] md:text-xs flex flex-col gap-4 h-full [@media(min-width:1800px)]:text-[0.85vw]">
            <div className="flex items-center gap-2 opacity-60 border-b border-[#00FF41]/10 pb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>guest@saad-terminal:~# ./render_experience.sh</span>
            </div>

            {/* Simulated Live Kernel Stream Wrapper */}
            <div className="flex flex-col gap-3 flex-1">
              {careerLogs.map((log, index) => {
                if (index > activeLogIndex) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="leading-relaxed"
                  >
                    {log.type === 'SYSTEM' && (
                      <span className="text-[#00FF41] font-bold tracking-wide">{log.text}</span>
                    )}

                    {(log.type === 'JOB' || log.type === 'EDU') && (
                      <div className="pl-3 border-l-[1.5px] border-[#00FF41]/30 my-1 flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {log.type === 'JOB' ? <Briefcase className="w-3.5 h-3.5 text-[#eab308] [@media(min-width:1800px)]:w-[1vw] [@media(min-width:1800px)]:h-[1vw]" /> : <GraduationCap className="w-3.5 h-3.5 text-cyan-400 [@media(min-width:1800px)]:w-[1vw] [@media(min-width:1800px)]:h-[1vw]" />}
                          <span className="text-white font-bold">{log.company}</span>
                          <span className="text-[#00FF41]/70 text-[10px] md:text-xs [@media(min-width:1800px)]:text-[0.7vw]">({log.date})</span>
                        </div>
                        <div className="text-zinc-300 font-semibold [@media(min-width:1800px)]:text-[0.85vw]">{log.role}</div>
                        <div className="text-zinc-500 font-sans mt-0.5 [@media(min-width:1800px)]:text-[0.8vw] [@media(min-width:1800px)]:mt-[0.4vw]">{log.desc}</div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Active Terminal Input Cursor */}
              {isInView && (
                <div className="flex items-center mt-1 opacity-80">
                  <span className="mr-1.5">saad@kernel:~$</span>
                  <span className="w-1.5 h-3.5 bg-[#00FF41] inline-block animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
    </>
  );
}