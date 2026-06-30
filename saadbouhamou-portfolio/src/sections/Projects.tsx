'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: 1,
    title: 'Le Petit Collège',
    category: 'Education Platform in wix',
    tech: ['JS vanila'],
    colSpan: 'col-span-12',
    image: '/projects/petit-college-vVIP.webp',
    mobileImage: '/projects/petit-college-vVIP.webp',
    aspect: 'aspect-[16/9] md:aspect-[1774/887]',
    link: '/le-petit-college',
    isInternal: true,
  },
  {
    id: 2,
    title: 'Yamaha',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-6',
    image: '/projects/yamaha-desktop-vvip.webp',
    mobileImage: '/projects/yamaha-desktop-vvip.webp',
    aspect: 'aspect-[4/3] md:aspect-[16/9]',
    link: 'https://yamaha-mediazone.vercel.app/',
  },
  {
    id: 3,
    title: 'JBL',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS', 'AJAX'],
    colSpan: 'col-span-12 md:col-span-6',
    image: '/projects/jblmatrix.webp',
    mobileImage: '/projects/jblmatrix.webp',
    aspect: 'aspect-[4/3] md:aspect-[16/9]',
    link : 'https://www.mediazone.ma/jbl#',
  },
  {
    id: 4,
    title: 'Samsung',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/samsungmatrix.webp',
    mobileImage: '/projects/samsungmatrix.webp',
    aspect: 'aspect-[4/3]',
    link : 'https://www.mediazone.ma/samsung',
  },
  {
    id: 5,
    title: 'Asus',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/assusmatrix.webp',
    mobileImage: '/projects/assusmatrix.webp',
    aspect: 'aspect-[4/3]',
    link : 'https://assus-mediazone.vercel.app/',
  },
  {
    id: 6,
    title: 'Pro',
    category: 'Mediazone Landing Page',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/promatrix.webp',
    mobileImage: '/projects/promatrix.webp',
    aspect: 'aspect-[4/3]',
    link : 'https://landing-page-media-zone.vercel.app/',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);


  useGSAP(() => {
    // ── Matrix Wave Reveal — العنوان كيتكشف مع موجة الماتريكس ─────────
    // لا text splitting — غير opacity + blur + color + skew = خفيف على الموبايل
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;

    if (heading) {
      // Initial state: مخفي + ضبابي + أخضر ماتريكسي + skew خفيف
      gsap.set(heading, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
        color: '#00FF41',
        skewX: 3,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          end: 'top 50%',
          scrub: 1,
        },
      })
        // Phase 1: الموجة كتكشف العنوان — blur يتلاشى + يطلع لمكانه
        .to(heading, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          skewX: 0,
          duration: 0.7,
          ease: 'power2.out',
        })
        // Phase 2: اللون كيتحول من الأخضر الماتريكسي إلى الأبيض
        .to(heading, {
          color: '#ffffff',
          duration: 0.4,
          ease: 'power1.inOut',
        }, '<0.3');
    }

    if (subtitle) {
      gsap.set(subtitle, {
        opacity: 0,
        y: 25,
        filter: 'blur(8px)',
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: subtitle,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      })
        .to(subtitle, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
        });
    }

    // ── Card reveal (existing) ───────────────────────────────────────────
    // Hide all cards initially
    gsap.set('.project-card', { y: 150, opacity: 0, scale: 0.95 });

    // Reveal cards on scroll — batch أحسن من واحد واحد
    ScrollTrigger.batch('.project-card', {
      start: 'top 85%',
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          overwrite: true,
        });
      },
      onLeaveBack: (elements) => {
        gsap.set(elements, { y: 150, opacity: 0, scale: 0.95, overwrite: true });
      },
    });

    // 🔥 حيدنا Magnetic Snapping ScrollTrigger.create
    // Lenis كافي — 3 snap engines كانو كيتقاتلو على الموبايل
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full scroll-mt-28 py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 [@media(min-width:1565px)]:max-w-[85vw] [@media(min-width:1565px)]:px-12 [@media(min-width:1565px)]:py-32 [@media(min-width:1800px)]:max-w-[85vw] [@media(min-width:1800px)]:px-[5vw] [@media(min-width:1800px)]:py-[6vw]"
      id="projects"
    >
      <div className="mb-16 md:mb-24 text-center [@media(min-width:1565px)]:mb-32 [@media(min-width:1800px)]:mb-[6vw]">
        {/* 🔥 h2: GSAP يتحكم فـ اللون (أخضر → أبيض). الـ span ديال "Projects" كيبقى أخضر */}
        <h2
          ref={headingRef}
          className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 [@media(min-width:1565px)]:text-8xl [@media(min-width:1565px)]:mb-8 [@media(min-width:1800px)]:text-[6vw] [@media(min-width:1800px)]:mb-[2vw]"
        >
          Selected <span className="text-[#00ff41]">Projects</span>
        </h2>
        <p
          ref={subtitleRef}
          className="text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto [@media(min-width:1565px)]:text-3xl [@media(min-width:1565px)]:max-w-4xl [@media(min-width:1800px)]:text-[1.8vw] [@media(min-width:1800px)]:max-w-[50vw]"
        >
          A collection of digital experiences, blending cutting-edge system architectures with premium design.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full [@media(min-width:1565px)]:gap-10 [@media(min-width:1800px)]:gap-[2.5vw]">
        {projects.map((project) => {
          const cardClasses = `project-card group relative w-full overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-neutral-900/50 backdrop-blur-xl border border-white/5 transition-all duration-300 hover:border-[#00ff41] hover:bg-neutral-900/80 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] active:scale-[0.98] transition-transform ${project.colSpan} ${project.aspect}`;
          const Wrapper = project.isInternal ? Link : 'a';
          const wrapperProps = project.isInternal
            ? { href: project.link || '#' }
            : { href: project.link || '#', target: '_blank' as const, rel: 'noopener noreferrer' };
          return (
          <Wrapper
            key={project.id}
            {...wrapperProps}
            title={`Launch ${project.title} - Engineered by Saad Bouhamou`}
            className={cardClasses}
          >
            {/* Background Image — next/image بدل raw <img> = AVIF/WebP + lazy + blur */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-black">
              {/* Mobile image */}
              <Image
                src={project.mobileImage}
                alt={`${project.title} - ${project.category} Portfolio Project`}
                title={`${project.title} Mobile View - High Performance System Architecture`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75}
                className="object-contain object-center md:hidden"
                loading="lazy"
                fetchPriority="low"
              />
              {/* Desktop image */}
              <Image
                src={project.image}
                alt={`${project.title} - ${project.category} Desktop Preview`}
                title={`${project.title} Desktop View - AI-Optimized Web Experience`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75}
                className="hidden md:block object-contain object-center"
                loading="lazy"
                fetchPriority="low"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10 transition-opacity duration-500 group-hover:opacity-90" />

            {/* Hover Icon */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30 w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out border border-white/10 group-hover:border-[#00ff41]/50 text-white group-hover:text-[#00ff41] [@media(min-width:1800px)]:top-[2vw] [@media(min-width:1800px)]:right-[2vw] [@media(min-width:1800px)]:w-[4vw] [@media(min-width:1800px)]:h-[4vw]">
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 [@media(min-width:1800px)]:w-[2vw] [@media(min-width:1800px)]:h-[2vw]" />
            </div>

            {/* Content */}
            <div className="relative z-20 p-6 md:p-10 lg:p-12 h-full flex flex-col justify-end pointer-events-none [@media(min-width:1565px)]:p-16 [@media(min-width:1800px)]:p-[3.5vw]">
              <div className="transform transition-transform duration-500 group-hover:-translate-y-2 md:group-hover:-translate-y-4">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs lg:text-sm font-mono text-[#00ff41] bg-[#00ff41]/10 rounded-full border border-[#00ff41]/20 backdrop-blur-md [@media(min-width:1565px)]:text-base [@media(min-width:1800px)]:text-[1.1vw] [@media(min-width:1800px)]:px-[1vw] [@media(min-width:1800px)]:py-[0.5vw]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight group-hover:text-[#00ff41] transition-colors duration-300 [@media(min-width:1565px)]:text-6xl [@media(min-width:1565px)]:mb-6 [@media(min-width:1800px)]:text-[3.2vw] [@media(min-width:1800px)]:mb-[1vw]">
                  {project.title}
                </h3>

                <p className="text-zinc-400 text-sm md:text-base lg:text-lg font-mono [@media(min-width:1565px)]:text-xl [@media(min-width:1800px)]:text-[1.3vw]">
                  &gt; {project.category}
                </p>
              </div>
            </div>
          </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
