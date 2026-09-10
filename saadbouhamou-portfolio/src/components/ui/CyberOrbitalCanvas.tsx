'use client';

import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface CyberOrbitalCanvasProps {
  activeColor?: string;
  isPaused?: boolean;
  className?: string;
}

export default function CyberOrbitalCanvas({
  activeColor = '#00FF41',
  isPaused = false,
  className = '',
}: CyberOrbitalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const stateRef = useRef({
    angle: 0,
    radarAngle: 0,
    innerAngle: 0,
    isPaused: false,
    particles: [] as Particle[],
    width: 600,
    height: 600,
    color: activeColor,
  });

  // Keep state updated for animation frame
  useEffect(() => {
    stateRef.current.isPaused = isPaused;
  }, [isPaused]);

  useEffect(() => {
    stateRef.current.color = activeColor;
  }, [activeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Seed particles deterministically on mount
    const particleCount = 42;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const dist = 30 + Math.random() * 260;
      const ang = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: 1 + Math.random() * 2.2,
        baseAlpha: 0.15 + Math.random() * 0.5,
        alpha: 0.2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    stateRef.current.particles = particles;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width || 500;
      const height = rect.height || 500;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      stateRef.current.width = width;
      stateRef.current.height = height;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    let lastTime = performance.now();
    let isVisible = true;

    const render = (time: number) => {
      if (!isVisible || document.hidden) {
        animFrameRef.current = 0;
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { width, height, isPaused, particles, color } = stateRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) * 0.88;

      ctx.clearRect(0, 0, width, height);

      // Smooth rotation increments
      if (!isPaused) {
        stateRef.current.angle += dt * 0.35;
        stateRef.current.radarAngle += dt * 0.75;
        stateRef.current.innerAngle -= dt * 0.2;
      } else {
        // Slow subtle drift even when paused for organic feel
        stateRef.current.angle += dt * 0.04;
        stateRef.current.radarAngle += dt * 0.25;
        stateRef.current.innerAngle -= dt * 0.02;
      }

      const angle = stateRef.current.angle;
      const radarAngle = stateRef.current.radarAngle;
      const innerAngle = stateRef.current.innerAngle;

      ctx.save();
      ctx.translate(cx, cy);

      // ── 1. AMBIENT RADIAL GLOW BEHIND GALAXY ──
      const ambientGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      ambientGlow.addColorStop(0, 'rgba(0, 255, 65, 0.12)');
      ambientGlow.addColorStop(0.35, 'rgba(0, 255, 65, 0.04)');
      ambientGlow.addColorStop(0.7, 'rgba(0, 255, 65, 0.01)');
      ambientGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. MATRIX DOT GRID ──
      const gridStep = 28;
      const gridHalf = Math.floor(maxRadius / gridStep);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.07)';
      for (let gx = -gridHalf; gx <= gridHalf; gx++) {
        for (let gy = -gridHalf; gy <= gridHalf; gy++) {
          const distSq = gx * gx * gridStep * gridStep + gy * gy * gridStep * gridStep;
          if (distSq <= maxRadius * maxRadius) {
            const px = gx * gridStep;
            const py = gy * gridStep;
            ctx.beginPath();
            ctx.arc(px, py, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── 3. RADAR SWEEP BEAM ──
      ctx.save();
      ctx.rotate(radarAngle);
      const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      sweepGrad.addColorStop(0, 'rgba(0, 255, 65, 0.25)');
      sweepGrad.addColorStop(0.5, 'rgba(0, 255, 65, 0.08)');
      sweepGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, 0, -Math.PI / 4, true);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Radar leading line
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.stroke();
      ctx.restore();

      // ── 4. CONCENTRIC CYBER TELEMETRY RINGS ──

      // A. Outermost Ring with Ticks & Azimuth Markings
      const rOuter = maxRadius * 0.98;
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Perimeter Ticks
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      const totalTicks = 48;
      for (let i = 0; i < totalTicks; i++) {
        const tickAngle = (i / totalTicks) * Math.PI * 2 + angle * 0.1;
        const isMajor = i % 6 === 0;
        const tickLen = isMajor ? 7 : 3.5;
        const r1 = rOuter - tickLen;
        const r2 = rOuter;
        ctx.strokeStyle = isMajor ? 'rgba(0, 255, 65, 0.55)' : 'rgba(0, 255, 65, 0.2)';
        ctx.beginPath();
        ctx.moveTo(Math.cos(tickAngle) * r1, Math.sin(tickAngle) * r1);
        ctx.lineTo(Math.cos(tickAngle) * r2, Math.sin(tickAngle) * r2);
        ctx.stroke();
      }

      // B. Secondary Rotating Telemetry Ring (Segmented)
      const rMid = maxRadius * 0.74;
      ctx.save();
      ctx.rotate(innerAngle);
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([24, 16, 8, 16, 40, 20]);
      ctx.beginPath();
      ctx.arc(0, 0, rMid, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // C. Orbit Guide Track (where nodes orbit)
      const rOrbit = maxRadius * 0.82;
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.16)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, rOrbit, 0, Math.PI * 2);
      ctx.stroke();

      // D. Inner High-Tech Optical Ring
      const rInner = maxRadius * 0.42;
      ctx.save();
      ctx.rotate(-angle * 0.4);
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([12, 6, 2, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, rInner, 0, Math.PI * 2);
      ctx.stroke();

      // Inner bracket marks
      for (let i = 0; i < 4; i++) {
        const bAngle = (i * Math.PI) / 2;
        const bx = Math.cos(bAngle) * rInner;
        const by = Math.sin(bAngle) * rInner;
        ctx.fillStyle = '#00FF41';
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── 5. FLOATING MATRIX PARTICLES ──
      ctx.setLineDash([]);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        const pDist = Math.sqrt(p.x * p.x + p.y * p.y);
        if (pDist > maxRadius) {
          p.x = -p.x * 0.85;
          p.y = -p.y * 0.85;
        }

        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        // Draw particle
        ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = p.size > 2 ? 6 : 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Constellation lines to nearest neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < 2400) {
            const lineAlpha = (1 - dSq / 2400) * 0.15;
            ctx.strokeStyle = `rgba(0, 255, 65, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // ── 6. CENTRAL HOLOGRAPHIC CYBER CORE ──
      const corePulse = 1 + 0.08 * Math.sin(time * 0.003);
      const coreRadius = Math.max(22, maxRadius * 0.12) * corePulse;

      // Core Outer Glow
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius * 2.8);
      coreGlow.addColorStop(0, 'rgba(0, 255, 65, 0.45)');
      coreGlow.addColorStop(0.4, 'rgba(0, 255, 65, 0.15)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Core Solid Rings
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.8)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Core Crosshair Optics
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.6)';
      ctx.lineWidth = 0.9;
      const crossLen = coreRadius * 1.5;
      ctx.beginPath();
      ctx.moveTo(-crossLen, 0);
      ctx.lineTo(-coreRadius * 0.3, 0);
      ctx.moveTo(coreRadius * 0.3, 0);
      ctx.lineTo(crossLen, 0);
      ctx.moveTo(0, -crossLen);
      ctx.lineTo(0, -coreRadius * 0.3);
      ctx.moveTo(0, coreRadius * 0.3);
      ctx.lineTo(0, crossLen);
      ctx.stroke();

      // Core Center Bright Energy Point
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = color || '#00FF41';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) {
          lastTime = performance.now();
          if (!animFrameRef.current) {
            animFrameRef.current = requestAnimationFrame(render);
          }
        } else {
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = 0;
          }
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      if (!document.hidden && isVisible) {
        lastTime = performance.now();
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      } else {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = 0;
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
