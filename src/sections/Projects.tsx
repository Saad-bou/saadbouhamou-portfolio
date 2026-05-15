'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
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
    image: '/projects/petit-college-vVIP.png',
    mobileImage: '/projects/petit-college-vVIP-mobile.png',
    aspect: 'aspect-[16/9] md:aspect-[1774/887]',
  },
  {
    id: 2,
    title: 'Yamaha',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-6',
    image: '/projects/yamaha-desktop-vvip.png',
    mobileImage: '/projects/yamaha-mobile-vvip.png',
    aspect: 'aspect-[4/3] md:aspect-[16/9]',
  },
  {
    id: 3,
    title: 'JBL',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS', 'AJAX'],
    colSpan: 'col-span-12 md:col-span-6',
    image: '/projects/jblmatrix.png',
    mobileImage: '/projects/jblmatrixmobile.png',
    aspect: 'aspect-[4/3] md:aspect-[16/9]',
  },
  {
    id: 4,
    title: 'Samsung',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/samsungmatrix.png',
    mobileImage: '/projects/samsungmatrix.png',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 5,
    title: 'Asus',
    category: 'Mediazone Partner',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/assusmatrix.png',
    mobileImage: '/projects/assusmatrix.png',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 6,
    title: 'Pro',
    category: 'Mediazone Landing Page',
    tech: ['HTML5', 'CSS3', 'JS'],
    colSpan: 'col-span-12 md:col-span-4',
    image: '/projects/promatrix.png',
    mobileImage: '/projects/promatrix.png',
    aspect: 'aspect-[4/3]',
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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
      className="relative w-full py-24 px-4 md:px-8 max-w-7xl mx-auto z-10"
      id="projects"
    >
      <div className="mb-16 md:mb-24 text-center">
        <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-6">
          Selected <span className="text-[#00ff41]">Projects</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto">
          A collection of digital experiences, blending cutting-edge system architectures with premium design.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card group relative w-full overflow-hidden rounded-[2.5rem] bg-neutral-900/50 backdrop-blur-xl border border-white/5 transition-[border-color,shadow,background-color] duration-500 hover:border-[#00ff41] hover:bg-neutral-900/80 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] ${project.colSpan} ${project.aspect}`}
          >
            {/* Background Image — next/image بدل raw <img> = AVIF/WebP + lazy + blur */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem] bg-black">
              {/* Mobile image */}
              <Image
                src={project.mobileImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 0px"
                className="object-contain object-center md:hidden"
                loading="lazy"
              />
              {/* Desktop image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1280px) 50vw, 33vw"
                className="hidden md:block object-contain object-center"
                loading="lazy"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10 transition-opacity duration-500 group-hover:opacity-90" />

            {/* Hover Icon */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30 w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out border border-white/10 group-hover:border-[#00ff41]/50 text-white group-hover:text-[#00ff41]">
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            {/* Content */}
            <div className="relative z-20 p-6 md:p-10 lg:p-12 h-full flex flex-col justify-end pointer-events-none">
              <div className="transform transition-transform duration-500 group-hover:-translate-y-2 md:group-hover:-translate-y-4">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs lg:text-sm font-mono text-[#00ff41] bg-[#00ff41]/10 rounded-full border border-[#00ff41]/20 backdrop-blur-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight group-hover:text-[#00ff41] transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-zinc-400 text-sm md:text-base lg:text-lg font-mono">
                  &gt; {project.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
