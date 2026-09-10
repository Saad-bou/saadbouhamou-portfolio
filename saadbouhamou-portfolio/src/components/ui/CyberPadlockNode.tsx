'use client';

import React from 'react';

interface CyberPadlockNodeProps {
  id: number;
  title: string;
  category: string;
  brandColor: string;
  glowColor: string;
  isActive: boolean;
  isHovered: boolean;
  nodeScale?: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export default function CyberPadlockNode({
  id,
  title,
  category,
  brandColor,
  glowColor,
  isActive,
  isHovered,
  nodeScale = 1,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: CyberPadlockNodeProps) {
  const isLit = isActive || isHovered;
  const padIndex = String(id).padStart(2, '0');
  // Base sizes scaled by nodeScale
  const bw = Math.round(96 * nodeScale);
  const bh = Math.round(102 * nodeScale);
  const svgSize = Math.round(44 * nodeScale);
  const badgeMax = Math.round(110 * nodeScale);
  const badgeTextSize = Math.round(9 * nodeScale); // Scaled font size
  const badgeMt = Math.round(6 * nodeScale);
  const badgePx = Math.round(8 * nodeScale);
  const badgePy = Math.round(2 * nodeScale);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={`Select Project ${padIndex}: ${title} (${category})`}
      aria-pressed={isActive}
      className={`group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 outline-none select-none ${
        isLit ? 'scale-110 z-30' : 'scale-95 opacity-80 hover:opacity-100 hover:scale-105 z-20'
      }`}
    >
      {/* ── AMBIENT NEON GLOW HALO ── */}
      <div
        className="absolute -inset-4 rounded-full transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: isLit ? 0.75 : 0.15,
          filter: 'blur(10px)',
        }}
        aria-hidden="true"
      />

      {/* ── CYBERNETIC PADLOCK / SHIELD BODY ── */}
      <div
        className="relative flex flex-col items-center justify-center rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden"
        style={{
          width: bw,
          height: bh,
          borderColor: isLit ? brandColor : `${brandColor}40`,
          backgroundColor: isLit ? 'rgba(5, 12, 10, 0.92)' : 'rgba(0, 0, 0, 0.85)',
          boxShadow: isLit
            ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, inset 0 0 16px ${glowColor}`
            : `0 0 10px rgba(0,0,0,0.8), 0 0 8px ${glowColor}`,
        }}
      >
        {/* Corner HUD Ticks */}
        <div
          className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l transition-colors duration-300"
          style={{ borderColor: isLit ? brandColor : `${brandColor}60` }}
        />
        <div
          className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r transition-colors duration-300"
          style={{ borderColor: isLit ? brandColor : `${brandColor}60` }}
        />
        <div
          className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l transition-colors duration-300"
          style={{ borderColor: isLit ? brandColor : `${brandColor}60` }}
        />
        <div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r transition-colors duration-300"
          style={{ borderColor: isLit ? brandColor : `${brandColor}60` }}
        />

        {/* Scanline pattern overlay inside node */}
        <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />

        {/* High-detail Cybernetic Padlock Vector Graphics (Image 4 Style) */}
        <svg
          viewBox="0 0 48 52"
          style={{ width: svgSize, height: Math.round(svgSize * 1.1) }}
          className="transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cyber Lock Shackle (Top Arc) */}
          <path
            d="M14 20V12C14 6.477 18.477 2 24 2C29.523 2 34 6.477 34 12V20"
            stroke={isLit ? brandColor : '#4b5563'}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              filter: isLit ? `drop-shadow(0 0 6px ${brandColor})` : 'none',
              transition: 'stroke 0.3s, filter 0.3s',
            }}
          />

          {/* Shackle Neon Inner Accent */}
          <path
            d="M17 18V12C17 8.134 20.134 5 24 5C27.866 5 31 8.134 31 12V18"
            stroke={isLit ? '#FFFFFF' : brandColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray={isLit ? 'none' : '4 4'}
            opacity={isLit ? 0.9 : 0.4}
          />

          {/* Padlock Metallic Body Plate */}
          <rect
            x="8"
            y="18"
            width="32"
            height="30"
            rx="5"
            fill="url(#padlockGrad)"
            stroke={isLit ? brandColor : `${brandColor}60`}
            strokeWidth="1.6"
          />

          {/* Circuit Traces */}
          <path
            d="M12 24H16L18 27H21"
            stroke={isLit ? brandColor : '#374151'}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M36 24H32L30 27H27"
            stroke={isLit ? brandColor : '#374151'}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M12 42H18L21 39"
            stroke={isLit ? brandColor : '#374151'}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M36 42H30L27 39"
            stroke={isLit ? brandColor : '#374151'}
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Center Cyber Keyway / Energy Core */}
          <circle
            cx="24"
            cy="31"
            r="4.5"
            fill={isLit ? brandColor : '#1f2937'}
            stroke={isLit ? '#FFFFFF' : brandColor}
            strokeWidth="1.2"
            style={{
              filter: isLit ? `drop-shadow(0 0 6px ${brandColor})` : 'none',
            }}
          />
          <path
            d="M24 33V38"
            stroke={isLit ? '#FFFFFF' : brandColor}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Top Status LED Dot */}
          <circle
            cx="24"
            cy="21"
            r="1.8"
            fill={isLit ? '#00FF41' : brandColor}
            style={{
              filter: `drop-shadow(0 0 4px ${isLit ? '#00FF41' : brandColor})`,
            }}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="padlockGrad" x1="8" y1="18" x2="40" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#111827" />
              <stop offset="0.5" stopColor="#0a0e17" />
              <stop offset="1" stopColor="#030712" />
            </linearGradient>
          </defs>
        </svg>

        {/* Node Index Chip */}
        <span
          className="font-mono text-[8px] sm:text-[9px] font-bold tracking-widest uppercase mt-1 transition-colors duration-300"
          style={{ color: isLit ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)' }}
        >
          {padIndex}
        </span>
      </div>

      {/* ── PROJECT TITLE BADGE (DIRECTLY UNDER PADLOCK) ── */}
      <div
        className="rounded border transition-all duration-300 backdrop-blur-md truncate text-center"
        style={{
          marginTop: `${badgeMt}px`,
          padding: `${badgePy}px ${badgePx}px`,
          maxWidth: badgeMax,
          borderColor: isLit ? `${brandColor}80` : 'rgba(255, 255, 255, 0.1)',
          backgroundColor: isLit ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0.75)',
          boxShadow: isLit ? `0 0 12px ${glowColor}` : 'none',
        }}
      >
        <span
          className="block font-mono font-bold tracking-wider uppercase truncate transition-colors duration-300"
          style={{
            fontSize: `${badgeTextSize}px`,
            color: isLit ? brandColor : 'rgba(255, 255, 255, 0.85)',
            textShadow: isLit ? `0 0 8px ${brandColor}` : 'none',
          }}
        >
          {title}
        </span>
      </div>
    </button>
  );
}
