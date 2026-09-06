'use client';

import { useEffect, useRef } from 'react';

/**
 * GPU-optimized Matrix rain on a single <canvas> element.
 * - 24fps cap → battery efficient
 * - Auto-pauses via `isActive` prop (0 CPU when off-screen)
 * - Zero DOM nodes for rain characters
 * - Proper RAF cleanup on unmount
 */

const CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789';
const FONT_SIZE = 14;
const COL_SPACING = 48; // Spaced out columns for a cleaner, less cluttered look

interface Column {
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

function newColumn(h: number, initial = false): Column {
  const length = 12 + Math.floor(Math.random() * 15); // longer dreamy trails
  return {
    // Initial columns scatter across the screen, recycled ones spawn just above
    y: initial ? Math.random() * h : -length * FONT_SIZE - Math.random() * 300,
    speed: 1.2 + Math.random() * 1.8, // Faster, classic Matrix feel but not too fast
    length,
    chars: Array.from({ length }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ),
  };
}

export default function MatrixPortalCanvas({ 
  isActive, 
  fixed = false,
  backgroundMode = false
}: { 
  isActive: boolean; 
  fixed?: boolean;
  backgroundMode?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ raf: 0, last: 0, cols: [] as Column[], w: 0, h: 0 });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const fps = backgroundMode ? (isMobile ? 8 : 12) : (isMobile ? 16 : 24);
    const frameMs = 1000 / fps;

    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d', { alpha: true });
    if (!ctx) return;
    const s = state.current;

    // ── Pause: cancel loop & clear canvas ──
    if (!isActive) {
      if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
      ctx.clearRect(0, 0, c.width, c.height);
      return;
    }

    // ── Resize: 1x DPR (effect is 35% opacity, 2x is wasteful) ──
    const applySize = (w: number, h: number) => {
      c.width = w;
      c.height = h;
      s.w = w;
      s.h = h;
      const isMobile = w < 768;
      const currentSpacing = isMobile ? COL_SPACING * 1.8 : COL_SPACING; // Much fewer columns on mobile
      s.cols = Array.from(
        { length: Math.floor(w / currentSpacing) },
        () => newColumn(h, true)
      );
    };

    // ResizeObserver fires immediately on observe — sizing from its
    // contentRect avoids a getBoundingClientRect forced reflow on mount.
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);
    });
    // If fixed, observe the document root; else observe the parent
    const target = fixed ? document.documentElement : c.parentElement;
    if (target) ro.observe(target);
    else applySize(window.innerWidth, window.innerHeight);

    // ── Animation loop ──
    const loop = (ts: number) => {
      if (ts - s.last >= frameMs) {
        s.last = ts;
        const { w, h, cols } = s;
        const isMobile = w < 768;
        const currentSpacing = isMobile ? COL_SPACING * 1.8 : COL_SPACING;

        // Clear canvas to keep it perfectly transparent and clean (no black accumulation)
        ctx.clearRect(0, 0, w, h);
        ctx.font = `bold ${FONT_SIZE}px monospace`;
        ctx.textBaseline = 'top';

        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          const x = i * currentSpacing; // Use dynamic spacing

          for (let j = 0; j < col.length; j++) {
            const cy = col.y - j * FONT_SIZE;
            if (cy < -FONT_SIZE || cy > h) continue;

            const fade = Math.max(0, 1 - j / col.length);
            ctx.fillStyle = j === 0
              ? `rgba(200,255,200,${fade})` // Brighter head
              : `rgba(0,255,65,${fade * 0.6})`; // Brighter tail

            // Random character flicker (3% per frame per char)
            if (Math.random() < 0.03)
              col.chars[j] = CHARS[Math.floor(Math.random() * CHARS.length)];

            ctx.fillText(col.chars[j], x, cy);
          }

          col.y += col.speed;
          if (col.y - col.length * FONT_SIZE > h) cols[i] = newColumn(h, false);
        }
      }
      s.raf = requestAnimationFrame(loop);
    };

    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={fixed
        ? "fixed inset-0 pointer-events-none z-[299]"
        : backgroundMode 
          ? "absolute inset-0 pointer-events-none z-[0] rounded-xl overflow-hidden" 
          : "absolute inset-0 pointer-events-none z-[1]"
      }
      style={{ opacity: backgroundMode ? 0.25 : 0.45 }}
    />
  );
}
