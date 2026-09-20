"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Camera,
  Car,
  Check,
  CircleCheckBig,
  Code2,
  ExternalLink,
  Gauge,
  Globe,
  Languages,
  Layers,
  LayoutTemplate,
  Link2,
  MapPin,
  Palette,
  PenTool,
  Rocket,
  Route,
  Search,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import {
  wimaAccent,
  wimaArchitectureNodes,
  wimaAssets,
  wimaBeforeAfter,
  wimaBrandLead,
  wimaBrandPalette,
  wimaBrandSection,
  wimaBrandTiles,
  wimaBrandType,
  wimaChallengeLead,
  wimaChallengeSection,
  wimaCoverFacts,
  wimaCoverFootnote,
  wimaCoverMeta,
  wimaCoverMetrics,
  wimaFooter,
  wimaFootprintIntents,
  wimaFootprintLead,
  wimaFootprintSection,
  wimaGbpCards,
  wimaGbpConsistency,
  wimaGbpLead,
  wimaGbpSection,
  wimaIdentity,
  wimaIndexationStats,
  wimaIntentFamilies,
  wimaMonitoringNote,
  wimaMonitoringSection,
  wimaMonitoringTools,
  wimaNextLead,
  wimaNextPhases,
  wimaNextSection,
  wimaOutcomeSection,
  wimaPerformanceChart,
  wimaPlatformLead,
  wimaPlatformSection,
  wimaPlatformShots,
  wimaPriorities,
  wimaResultsCopy,
  wimaResultsLead,
  wimaResultsNote,
  wimaResultsSection,
  wimaRoleCards,
  wimaScreenRatio,
  wimaSectionNav,
  wimaSeoPillars,
  wimaSeoSection,
  wimaStackSection,
  wimaTechStack,
  wimaTimeline,
  wimaTopQueries,
  type WimaIconKey,
  type WimaMetric,
  type WimaQuery,
  type WimaShot,
} from "@/data/wima";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ICON MAP — data files stay framework-agnostic, the page owns the glyphs
   ═══════════════════════════════════════════════════════════════════════════ */

const ICONS: Record<WimaIconKey, LucideIcon> = {
  alert: TriangleAlert,
  platform: Layers,
  seo: Search,
  results: TrendingUp,
  footprint: Route,
  gbp: MapPin,
  brand: Palette,
  monitoring: BarChart3,
  stack: Terminal,
  outcome: CircleCheckBig,
  next: Rocket,
  globe: Globe,
  code: Code2,
  camera: Camera,
  search: Search,
  mapPin: MapPin,
  chart: BarChart3,
  sparkles: Sparkles,
  check: Check,
  car: Car,
  language: Languages,
  link: Link2,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  pen: PenTool,
  route: Route,
  layers: Layers,
  rocket: Rocket,
  target: Target,
  gauge: Gauge,
};

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════════ */

function Eyebrow({
  children,
  color = wimaAccent.base,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase ${className}`}
      style={{ color }}
    >
      {children}
    </div>
  );
}

/** Section header: two-digit index, red eyebrow, display heading, optional lead. */
function SectionHeading({
  index,
  eyebrow,
  heading,
  lead,
  className = "",
}: {
  index: string;
  eyebrow: string;
  heading: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="wima-reveal">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em]"
            style={{ color: wimaAccent.base }}
          >
            {index}
          </span>
          <span className="h-px w-8" style={{ backgroundColor: wimaAccent.border }} />
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h2 className="wima-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
          {heading}
        </h2>
      </div>
      {lead ? (
        <p className="wima-reveal mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Pill chip. `red` is the brand accent, `accent` is neutral, `muted` is quiet. */
function Chip({
  children,
  tone = "accent",
  rtl = false,
}: {
  children: React.ReactNode;
  tone?: "red" | "accent" | "muted";
  rtl?: boolean;
}) {
  const tones: Record<string, string> = {
    red: "text-white",
    accent: "border-white/20 bg-white/5 text-zinc-200",
    muted: "border-white/10 bg-white/5 text-zinc-400",
  };
  const style =
    tone === "red"
      ? {
        borderColor: wimaAccent.border,
        backgroundColor: wimaAccent.soft,
        color: wimaAccent.bright,
      }
      : undefined;
  return (
    <span
      dir={rtl ? "rtl" : undefined}
      lang={rtl ? "ar" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase ${tones[tone]}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** One big number with its label and an honesty note. */
function MetricBlock({
  metric,
  compact = false,
}: {
  metric: WimaMetric;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-xl ${compact ? "px-4 py-4" : "px-5 py-6 sm:px-6 sm:py-7"
        }`}
    >
      <div className="flex items-baseline gap-1">
        <span
          className={`font-bold tracking-tighter text-white ${compact ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
            }`}
        >
          {metric.value}
        </span>
        {metric.unit ? (
          <span
            className={`font-bold ${compact ? "text-base" : "text-xl sm:text-2xl"}`}
            style={{ color: wimaAccent.bright }}
          >
            {metric.unit}
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
        {metric.label}
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
        {metric.note}
      </p>
    </div>
  );
}

/**
 * A real screen inside the browser chrome used across the page, so every
 * capture reads as one product.
 *
 * Cropping / letterboxing: the frame is given the image's own ratio (see
 * `wimaScreenRatio`), so the capture fills it edge to edge with nothing cut
 * off. The image is still drawn with `object-cover object-top` so that, if a
 * ratio ever drifts, the crop happens from the bottom instead of leaving
 * dark letterbox bands — and the screen always starts flush with the top of
 * the viewport, right under the nav bar.
 *
 * `backdrop` must match the capture's own page background: the WIMA CAR
 * homepage is a light capture (`bg-white`), while the fleet, vehicle, mobile
 * and cover captures are dark (`bg-[#0A0A0B]`). That keeps any sub-pixel gap
 * invisible while the file decodes.
 */
function BrowserFrame({
  src,
  alt,
  sizes,
  ratio,
  label,
  preload = false,
  backdrop = "bg-[#0A0A0B]",
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio: number;
  label: string;
  preload?: boolean;
  /** Page background of the capture itself — `bg-white` for light screens. */
  backdrop?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur-xl ${className}`}
      style={{ boxShadow: `0 0 70px ${wimaAccent.soft}` }}
    >
      <div className="flex items-center gap-2.5 border-b border-white/5 bg-neutral-900/80 px-3 py-2 sm:px-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/70 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-white/70 sm:h-2.5 sm:w-2.5" />
        </div>
        <span className="truncate rounded-full border border-white/5 bg-black/40 px-2.5 py-0.5 font-mono text-[8px] tracking-wide text-zinc-500 sm:text-[9px]">
          {label}
        </span>
      </div>
      <div
        className={`relative w-full overflow-hidden ${backdrop}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          preload={preload}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/**
 * A capture's backdrop must match that capture's own page background, or the
 * gap around a slightly-off ratio paints as a coloured band. Light captures
 * (`home`, `fleet`) get white; the dark captures keep the brand canvas.
 */
const captureBackdrop = (light?: boolean) => (light ? "bg-white" : "bg-[#0A0A0B]");

/**
 * Compact gallery tile — one screen, its route, its caption, a full-size link.
 *
 * Tiles use `object-contain` so a capture is never cropped regardless of how
 * the grid stretches the card. The backdrop is matched to the capture's own
 * page background, making any letterbox invisible.
 */
function ScreenCard({
  shot,
}: {
  shot: WimaShot & { light?: boolean };
}) {
  const isMobile = shot.mobile;
  const containerBg = isMobile ? "bg-[#0B0D0E]" : "bg-[#F8FAFC]";

  return (
    <article className="wima-card group flex flex-col rounded-2xl border border-white/5 bg-neutral-900/30 p-3 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40">
      <div
        className={`relative w-full flex-1 overflow-hidden rounded-xl border border-white/10 aspect-[2/3] ${containerBg}`}
      >
        {isMobile ? (
          <div className="relative w-full h-full bg-[#0B0D0E] flex items-center justify-center p-4">
            {/* Phone Frame */}
            <div className="relative w-[190px] h-[380px] bg-[#1a1a1d] rounded-[40px] p-[6px] border-[3px] border-[#D1D5DB] shadow-[0_0_35px_rgba(217,35,42,0.25)] flex flex-col justify-center">
              {/* Inner Screen Container */}
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black">
                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-30 border border-white/10" />

                {/* Mobile Screenshot Image */}
                <Image
                  src="/projects/wima-car/mobile.webp" // Ensure this matches your exact image path
                  alt="Mobile flow"
                  fill
                  className="object-cover object-top"
                  sizes="190px"
                  priority
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={shot.image}
              alt={`${shot.title} — ${shot.caption}`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              quality={90}
              className="rounded-xl w-full h-full object-contain object-top"
            />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-white">{shot.title}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {shot.url}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-zinc-400">{shot.caption}</p>
        </div>
        <a
          href={shot.image}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${shot.title} capture full size`}
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors duration-300 hover:border-[#D71920]/60 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH CONSOLE CHART — impressions (area) + clicks (dashed line)
   ═══════════════════════════════════════════════════════════════════════════ */

const CHART = {
  x0: 70,
  x1: 870,
  y0: 30,
  y1: 210,
} as const;

function buildSeries(values: readonly number[]) {
  const { x0, x1, y0, y1 } = CHART;
  const max = Math.max(...values) || 1;
  const step = (x1 - x0) / (values.length - 1);
  return values.map((v, i) => ({
    x: x0 + step * i,
    y: y1 - (v / max) * (y1 - y0),
    v,
  }));
}

function PerformanceChart() {
  const { impressions, clicks, labels, launchLabel } = wimaPerformanceChart;
  const imp = buildSeries(impressions);
  const clk = buildSeries(clicks);

  const line = (pts: { x: number; y: number }[]) =>
    `M ${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;

  const areaPath = `${line(imp)} L ${CHART.x1},${CHART.y1} L ${CHART.x0},${CHART.y1} Z`;
  const impMax = Math.max(...impressions);
  const clkMax = Math.max(...clicks);

  return (
    <div className="wima-reveal self-start overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl">
      {/* Chrome */}
      <div className="flex items-center gap-2.5 border-b border-white/5 bg-neutral-900/80 px-3 py-2 sm:px-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/70 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-white/70 sm:h-2.5 sm:w-2.5" />
        </div>
        <span className="truncate rounded-full border border-white/5 bg-black/40 px-2.5 py-0.5 font-mono text-[8px] tracking-wide text-zinc-500 sm:text-[9px]">
          search.google.com/search-console
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/5 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] sm:text-[10px]">
        <span className="inline-flex items-center gap-2 text-zinc-300">
          <i className="h-2 w-2 rounded-full" style={{ backgroundColor: wimaAccent.base }} />
          Impressions · left axis
        </span>
        <span className="inline-flex items-center gap-2 text-zinc-300">
          <i className="h-2 w-2 rounded-full bg-zinc-200" />
          Clicks · right axis
        </span>
        <span className="ml-auto text-zinc-600">Weekly view</span>
      </div>

      <div className="p-3 sm:p-5">
        <svg
          viewBox="0 0 900 268"
          className="w-full"
          role="img"
          aria-label={`Impressions and clicks from ${labels[0]} to ${labels[labels.length - 1]}`}
        >
          <defs>
            <linearGradient id="wimaAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={wimaAccent.base} stopOpacity="0.36" />
              <stop offset="100%" stopColor={wimaAccent.base} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
            {[30, 75, 120, 165].map((y) => (
              <line key={y} x1={CHART.x0} y1={y} x2={CHART.x1} y2={y} />
            ))}
          </g>
          <line
            x1={CHART.x0}
            y1={CHART.y1}
            x2={CHART.x1}
            y2={CHART.y1}
            stroke="rgba(255,255,255,0.22)"
          />

          {/* Axis labels */}
          <g fontFamily="monospace" fontSize="10" fill="#5C626B">
            <text x="26" y="34">{(impMax / 1000).toFixed(1)}K</text>
            <text x="26" y="79">{Math.round(impMax * 0.75)}</text>
            <text x="26" y="124">{Math.round(impMax * 0.5)}</text>
            <text x="26" y="169">{Math.round(impMax * 0.25)}</text>
            <text x="46" y="214">0</text>
            <text x="852" y="34" textAnchor="end">{clkMax}</text>
            <text x="852" y="124" textAnchor="end">{Math.round(clkMax / 2)}</text>
            <text x="858" y="214" textAnchor="end">0</text>
          </g>

          {/* Impressions */}
          <path d={areaPath} fill="url(#wimaAreaFill)" />
          <path
            d={line(imp)}
            fill="none"
            stroke={wimaAccent.base}
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Clicks */}
          <path
            d={line(clk)}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Points */}
          <g fill={wimaAccent.base}>
            {imp.map((p, i) => (
              <circle
                key={`i-${i}`}
                cx={p.x}
                cy={p.y}
                r={i === imp.length - 1 ? 4.6 : 3.6}
                stroke="#0A0A0B"
                strokeWidth={i === imp.length - 1 ? 2 : 0}
              />
            ))}
          </g>
          <g fill="#F3F4F6">
            {clk.map((p, i) => (
              <circle key={`c-${i}`} cx={p.x} cy={p.y} r="3" />
            ))}
          </g>

          {/* X labels + launch marker */}
          <g fontFamily="monospace" fontSize="10" fill="#5C626B">
            {labels.map((l, i) => (
              <text
                key={l}
                x={imp[i].x}
                y="234"
                textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
              >
                {l}
              </text>
            ))}
            <text x={CHART.x0} y="256">{launchLabel}</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/** Relative-share query bars, exactly the shape Search Console shows. */
function QueryBars({ queries }: { queries: WimaQuery[] }) {
  return (
    <div className="divide-y divide-white/5">
      {queries.map((q, i) => (
        <div key={q.query} className="flex items-center gap-4 py-3">
          <span
            dir={q.rtl ? "rtl" : undefined}
            lang={q.rtl ? "ar" : undefined}
            className="w-[46%] shrink-0 truncate text-[12px] text-zinc-300 sm:text-[13px]"
          >
            {q.query}
          </span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${q.share}%`,
                background: `linear-gradient(90deg, ${wimaAccent.base}, ${wimaAccent.bright})`,
                opacity: 1 - i * 0.09,
              }}
            />
          </span>
          <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-zinc-600">
            {q.share}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BRAND COLOUR SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

function SwatchGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {wimaBrandPalette.map((s) => (
        <div
          key={s.name}
          className="wima-card overflow-hidden rounded-xl border border-white/5 bg-neutral-900/30 backdrop-blur-xl"
        >
          <div
            className="flex h-20 items-end justify-end border-b border-white/5 p-2 sm:h-24"
            style={{ backgroundColor: s.hex }}
          >
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[9px] tracking-wider"
              style={{
                backgroundColor: s.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
                color: s.dark ? "#FFFFFF" : "#0A0A0B",
              }}
            >
              {s.hex}
            </span>
          </div>
          <div className="px-3 py-3">
            <p className="text-[12px] font-bold tracking-tight text-white">{s.name}</p>
            <p className="mt-1 font-mono text-[9px] uppercase leading-snug tracking-wider text-zinc-500">
              {s.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function WimaCarCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionNavRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  /**
   * The section currently under the sticky headers — drives the red pill.
   * Empty while the hero is on screen: no section has been reached yet, so
   * nothing should read as active.
   */
  const [activeSection, setActiveSection] = useState<string>("");

  /**
   * Whether the strip can still scroll in each direction. Drives the edge
   * fades — the strip has no scrollbar, so without them nothing tells you the
   * row continues past the container edge.
   */
  const [navEdges, setNavEdges] = useState({ start: false, end: false });

  /* Land at the top of the page when arriving from the home page sections */
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  /**
   * Scroll-spy for the section nav.
   *
   * Deliberately a rAF-throttled scroll listener rather than an
   * IntersectionObserver: the page scrolls through Lenis, and "the last section
   * whose top has passed the sticky headers" is both cheaper to reason about and
   * immune to the observer firing order when several sections overlap the band.
   * The 180px line clears the fixed navbar plus the sticky section nav.
   */
  useEffect(() => {
    const hrefs = wimaSectionNav.map((s) => s.href);
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = 180;
      let current = "";
      for (const href of hrefs) {
        const el = document.querySelector<HTMLElement>(href);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = href;
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Keep the active pill inside the horizontally scrolling strip. Without this,
   * selecting a late section leaves the strip scrolled so that an item sits
   * half-clipped against the edge.
   */
  useEffect(() => {
    const nav = sectionNavRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    const pad = 16;

    if (itemRect.left < navRect.left + pad) {
      nav.scrollBy({ left: itemRect.left - navRect.left - pad, behavior: "smooth" });
    } else if (itemRect.right > navRect.right - pad) {
      nav.scrollBy({ left: itemRect.right - navRect.right + pad, behavior: "smooth" });
    }
  }, [activeSection]);

  /**
   * Track how far the strip can still travel. Measured on mount, on the strip's
   * own scroll, and on resize; the delayed pass catches webfonts landing after
   * first paint, which changes the total width of the row.
   */
  useEffect(() => {
    const nav = sectionNavRef.current;
    if (!nav) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const max = nav.scrollWidth - nav.clientWidth;
      const start = nav.scrollLeft > 4;
      const end = nav.scrollLeft < max - 4;
      setNavEdges((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      );
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    const settle = window.setTimeout(measure, 400);

    nav.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      nav.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Section navigation. Routed through Lenis — the same path the navbar uses —
   * because gsap/ScrollTrigger is lazy-loaded (see SmoothScroll): a plain
   * anchor jump can land before the triggers exist and leave the target
   * section sitting at `opacity: 0`. Lenis frames are forwarded to
   * ScrollTrigger by the LenisGSAPBridge, so the reveals always fire.
   *
   * The offset clears the fixed navbar *and* the sticky section nav.
   */
  const SECTION_OFFSET = -132;

  const scrollToSection =
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      lenis?.scrollTo(target, { offset: SECTION_OFFSET, duration: 1.1 });
      if (!lenis) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + SECTION_OFFSET,
          behavior: "smooth",
        });
      }
      // Clean URL without the section hash
      window.history.pushState(null, "", window.location.pathname);
    };

  useGSAP(
    () => {
      // Heading reveal — brand red washes into white as the block settles
      gsap.utils.toArray<HTMLElement>(".wima-heading").forEach((el) => {
        gsap.set(el, {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          color: wimaAccent.base,
          skewX: 3,
        });
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 1 } })
          .to(el, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            skewX: 0,
            duration: 0.7,
            ease: "power2.out",
          })
          .to(el, { color: "#FFFFFF", duration: 0.4, ease: "power1.inOut" }, "<0.3");
      });

      // Generic fade-up
      gsap.utils.toArray<HTMLElement>(".wima-reveal").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 28 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1 },
        });
      });

      // Batched cards
      gsap.set(".wima-card", { y: 45, opacity: 0 });
      ScrollTrigger.batch(".wima-card", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          }),
        onLeaveBack: (els) => gsap.set(els, { y: 45, opacity: 0, overwrite: true }),
      });
    },
    { scope: containerRef },
  );

  const [wordA, wordB] = wimaIdentity.wordmark;

  /*
    `overflow-x-clip` on <main>, never `overflow-x-hidden`.

    `hidden` on one axis forces the other to compute to `auto`, which turns
    <main> into a scroll container. A `position: sticky` descendant is then
    confined to *that* scrollport — and since <main> only ever grows to fit its
    content, it never scrolls, so the section nav just scrolls away with the
    page instead of pinning under the navbar.

    `clip` trims the same horizontal overflow without creating a scroll
    container, so the sticky nav keeps pinning to the viewport.
  */
  return (
    <main ref={containerRef} className="relative z-10 min-h-svh overflow-x-clip">
      {/* ═════════════════════════════════════════════════════════════════════
          HERO — the cover, with its own data
        ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[140px] sm:h-[760px] sm:w-[760px]"
          style={{ backgroundColor: wimaAccent.soft }}
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <div className="wima-reveal">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-sm sm:text-xs"
                  style={{
                    borderColor: wimaAccent.border,
                    color: wimaAccent.bright,
                    backgroundColor: wimaAccent.soft,
                  }}
                >
                  {wimaIdentity.heroLabel}
                </span>
              </div>

              <h1 className="wima-heading mt-7 text-6xl font-bold leading-[0.85] tracking-tighter sm:text-7xl md:text-8xl lg:text-[7.5rem]">
                {wordA}
                <span style={{ color: wimaAccent.base }}>.</span>
                <br />
                <span style={{ color: wimaAccent.base }}>{wordB}</span>
              </h1>

              <p className="wima-reveal mx-auto mt-6 max-w-xl text-lg font-light tracking-tight text-white/90 sm:text-xl md:text-2xl lg:mx-0">
                {wimaIdentity.tagline}
              </p>

              <p className="wima-reveal mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base lg:mx-0">
                {wimaIdentity.heroDescription}
              </p>

              <div className="wima-reveal mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {["Next.js", "React", "TypeScript", "Tailwind", "SEO", "Local Search"].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="wima-reveal mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href={wimaIdentity.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-white transition-transform duration-300 active:scale-[0.98]"
                  style={{
                    backgroundColor: wimaAccent.base,
                    boxShadow: `0 0 28px ${wimaAccent.glow}`,
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit the live site
                </a>
                <a
                  href="#wima-brand"
                  onClick={scrollToSection("#wima-brand")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-white/80 transition-colors duration-300 hover:border-white/50 hover:text-white"
                >
                  <Palette className="h-4 w-4" />
                  See the colour system
                </a>
              </div>
            </div>

            {/* The shipped homepage */}
            <div className="wima-reveal relative mx-auto w-full max-w-[620px] lg:max-w-none">
              <BrowserFrame
                src={wimaAssets.home}
                alt="WIMA CAR homepage — “Location de voitures à Rabat” hero with language switcher, reservation call to action and the fleet entry points"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 600px"
                ratio={wimaScreenRatio.home}
                label="www.wimacar.com/fr"
                backdrop="bg-white"
                preload
              />
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 lg:text-left">
                Localized homepage — FR · AR · EN · ES · IT
              </p>
            </div>
          </div>

          {/* ── THE COVER, CARRYING THE PROJECT'S DATA ─────────────────── */}
          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
            <div className="wima-reveal">
              <BrowserFrame
                src={wimaAssets.cover}
                alt="WIMA CAR case-study cover — wordmark, the “location de voitures à Rabat” positioning and the launch metrics from Google Search Console"
                sizes="(max-width: 1024px) 92vw, 60vw"
                ratio={wimaScreenRatio.cover}
                label="wima-car — cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {wimaCoverFacts.map((f) => (
                  <MetricBlock key={f.label} metric={f} compact />
                ))}
              </div>

              <dl className="wima-reveal flex-1 rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl">
                {wimaCoverMeta.map((m, i) => (
                  <div
                    key={m.label}
                    className={`py-3 ${i ? "border-t border-white/5" : "pt-0"} ${i === wimaCoverMeta.length - 1 ? "pb-0" : ""
                      }`}
                  >
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
                      {m.label}
                    </dt>
                    <dd className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-300">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ── THE NUMBERS, IN FULL ──────────────────────────────────── */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {wimaCoverMetrics.map((m) => (
              <MetricBlock key={m.label} metric={m} />
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {wimaCoverFootnote}
          </p>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION NAVIGATION
        ═════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-[58px] z-40 sm:top-[72px] py-2 sm:py-4 pointer-events-none">
        <Container className="relative pointer-events-auto">
          {/*
            The strip is framed as a floating pill. `w-fit max-w-full mx-auto` keeps it centered 
            and compact, expanding up to the grid boundary where overflow-x-auto kicks in.
          */}
          <div className="relative mx-auto w-fit max-w-full rounded-full border border-white/10 bg-[#0A0A0B]/90 shadow-2xl backdrop-blur-md">
            <nav
              ref={sectionNavRef}
              aria-label="Case-study sections"
              className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto px-4 py-2"
            >
              {wimaSectionNav.map((s) => {
                const isActive = activeSection === s.href;
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    onClick={scrollToSection(s.href)}
                    data-active={isActive ? "true" : undefined}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 sm:text-[10px] ${isActive
                        ? "border-[#D71920] bg-[#D71920]/10 text-white shadow-[0_0_18px_-6px_rgba(215,25,32,0.75)]"
                        : "border-white/10 text-zinc-500 hover:border-[#D71920]/50 hover:bg-[#D71920]/10 hover:text-white"
                      }`}
                  >
                    <span
                      className="transition-colors duration-300"
                      style={{ color: isActive ? wimaAccent.bright : wimaAccent.base }}
                    >
                      {s.index}
                    </span>
                    {s.label}
                  </a>
                );
              })}
            </nav>

            {/*
              Edge fades. These sit inside the pill, matching its rounded corners and background color.
            */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-full bg-gradient-to-r from-[#0A0A0B] to-transparent transition-opacity duration-300 ${navEdges.start ? "opacity-100" : "opacity-0"
                }`}
            />
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-full bg-gradient-to-l from-[#0A0A0B] to-transparent transition-opacity duration-300 ${navEdges.end ? "opacity-100" : "opacity-0"
                }`}
            />
          </div>
        </Container>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          01 — THE CHALLENGE
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-challenge">
        <Container>
          <SectionHeading
            index={wimaChallengeSection.index}
            eyebrow={wimaChallengeSection.eyebrow}
            heading={wimaChallengeSection.heading}
            lead={wimaChallengeLead}
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            {/* Priorities */}
            <div className="wima-reveal">
              <Eyebrow className="mb-5">Before launch — priorities</Eyebrow>
              <ol className="space-y-3">
                {wimaPriorities.map((p) => (
                  <li
                    key={p.num}
                    className="flex items-start gap-4 rounded-xl border border-white/5 bg-neutral-900/30 p-4 backdrop-blur-xl"
                  >
                    <span
                      className="mt-0.5 font-mono text-[11px] font-bold tracking-widest"
                      style={{ color: wimaAccent.base }}
                    >
                      {p.num}
                    </span>
                    <p className="text-[13.5px] leading-relaxed text-zinc-300">{p.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Role */}
            <div>
              <Eyebrow className="wima-reveal mb-5">My role — end to end</Eyebrow>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {wimaRoleCards.map((r) => {
                  const Icon = ICONS[r.icon];
                  return (
                    <article
                      key={r.area}
                      className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4" style={{ color: wimaAccent.base }} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                          {r.num} — {r.area}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
                        {r.detail}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          02 — BUILDING THE PLATFORM
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-platform">
        <Container>
          <SectionHeading
            index={wimaPlatformSection.index}
            eyebrow={wimaPlatformSection.eyebrow}
            heading={wimaPlatformSection.heading}
            lead={wimaPlatformLead}
          />

          {/* Architecture chain */}
          <div className="wima-reveal scrollbar-hide -mx-4 flex items-stretch gap-3 overflow-x-auto px-4 pb-2">
            {wimaArchitectureNodes.map((node, i) => (
              <React.Fragment key={node.key}>
                {i > 0 ? (
                  <span className="flex shrink-0 items-center text-zinc-700">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                ) : null}
                <div
                  className="min-w-[168px] shrink-0 rounded-xl border p-4 backdrop-blur-xl"
                  style={{
                    borderColor: node.hot ? wimaAccent.border : "rgba(255,255,255,0.06)",
                    backgroundColor: node.hot ? wimaAccent.soft : "rgba(23,24,28,0.5)",
                  }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                    {node.key}
                  </p>
                  <p className="mt-2 text-[13.5px] font-bold leading-tight tracking-tight text-white">
                    {node.value}
                  </p>
                  <p
                    className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em]"
                    style={{ color: node.hot ? wimaAccent.bright : "#5C626B" }}
                  >
                    {node.sub}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Screens */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wimaPlatformShots.map((shot) =>
              shot.mobile ? (
                <article
                  key={shot.url}
                  className="wima-card flex flex-col rounded-2xl border border-white/5 bg-neutral-900/30 p-3 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  {/* Fixed-height media box: the phone frame below is a fixed 190×380,
                      so the slot needs a definite height for the snippet's `h-full`. */}
                  <div className="relative w-full flex-1 overflow-hidden rounded-xl border border-white/10 aspect-[2/3] bg-[#0B0D0E]">
                    <div className="relative w-full h-full bg-[#0B0D0E] flex items-center justify-center p-4">
                      {/* Phone Frame */}
                      <div className="relative w-[190px] h-[380px] bg-[#1a1a1d] rounded-[40px] p-[6px] border-[3px] border-[#D1D5DB] shadow-[0_0_35px_rgba(217,35,42,0.25)] flex flex-col justify-center">
                        {/* Inner Screen Container */}
                        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black">
                          {/* Dynamic Island Notch */}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-30 border border-white/10" />
                          {/* Mobile Screenshot Image */}
                          <Image
                            src="/projects/wima-car/mobile.webp"
                            alt="Mobile flow"
                            fill
                            className="object-cover object-top"
                            sizes="190px"
                            preload
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-1 pb-1">
                    <p className="text-sm font-bold tracking-tight text-white">{shot.title}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {shot.url}
                    </p>
                    <p className="mt-2 text-[12px] leading-snug text-zinc-400">{shot.caption}</p>
                  </div>
                </article>
              ) : (
                <ScreenCard key={shot.url} shot={shot} />
              ),
            )}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          03 — SEO, THE INFRASTRUCTURE
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-seo">
        <Container>
          <SectionHeading
            index={wimaSeoSection.index}
            eyebrow={wimaSeoSection.eyebrow}
            heading={wimaSeoSection.heading}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
            {/* Performance + queries */}
            <div className="space-y-6">
              <PerformanceChart />

              <div className="wima-reveal overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                    Top queries
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                    relative share
                  </span>
                </div>
                <div className="px-4 py-1">
                  <QueryBars queries={wimaTopQueries} />
                </div>
              </div>
            </div>

            {/* Pillars */}
            <div className="space-y-4">
              {wimaSeoPillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl"
                >
                  <Eyebrow>{pillar.label}</Eyebrow>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pillar.items.map((item) => (
                      <Chip
                        key={item}
                        tone={pillar.accent ? "red" : "accent"}
                        rtl={/[\u0600-\u06FF]/.test(item)}
                      >
                        {item}
                      </Chip>
                    ))}
                  </div>
                  {pillar.note ? (
                    <p className="mt-4 font-mono text-[10px] leading-relaxed text-zinc-600">
                      {pillar.note}
                    </p>
                  ) : null}
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3">
                {wimaIndexationStats.map((s) => (
                  <MetricBlock key={s.label} metric={s} compact />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          04 — RESULTS
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-results">
        <Container>
          <SectionHeading
            index={wimaResultsSection.index}
            eyebrow={wimaResultsSection.eyebrow}
            heading={wimaResultsSection.heading}
            lead={wimaResultsLead}
          />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {wimaCoverMetrics.map((m) => (
              <MetricBlock key={m.label} metric={m} />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
            <PerformanceChart />

            <div className="space-y-4">
              <div className="wima-reveal rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl">
                <Eyebrow>What changed</Eyebrow>
                <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-300">
                  {wimaResultsCopy}
                </p>
              </div>

              {wimaIntentFamilies.map((f) => (
                <div
                  key={f.label}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                    {f.label}
                  </span>
                  <p
                    dir={f.rtl ? "rtl" : undefined}
                    lang={f.rtl ? "ar" : undefined}
                    className="mt-3 text-[15px] font-bold tracking-tight text-white"
                  >
                    {f.primary}
                  </p>
                  <p className="mt-1.5 text-[12px] text-zinc-400">{f.secondary}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {wimaResultsNote}
          </p>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          05 — THE SEARCH FOOTPRINT
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-footprint">
        <Container>
          <SectionHeading
            index={wimaFootprintSection.index}
            eyebrow={wimaFootprintSection.eyebrow}
            heading={wimaFootprintSection.heading}
            lead={wimaFootprintLead}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {wimaFootprintIntents.map((intent) => (
                <div
                  key={intent.label}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: wimaAccent.base }}
                  >
                    {intent.label}
                  </span>
                  <p
                    dir={intent.rtl ? "rtl" : undefined}
                    lang={intent.rtl ? "ar" : undefined}
                    className="mt-3 text-[15px] font-bold leading-snug tracking-tight text-white"
                  >
                    {intent.query}
                  </p>
                </div>
              ))}
            </div>

            <div className="wima-reveal overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 border-b border-white/5 bg-neutral-900/80 px-3 py-2 sm:px-4">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/70 sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/70 sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-white/70 sm:h-2.5 sm:w-2.5" />
                </div>
                <span className="truncate rounded-full border border-white/5 bg-black/40 px-2.5 py-0.5 font-mono text-[8px] tracking-wide text-zinc-500 sm:text-[9px]">
                  search-console · queries / pages
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                  Queries
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  08 Aug → 14 Sep 2026
                </span>
              </div>
              <div className="px-4 pb-4">
                <QueryBars queries={wimaTopQueries} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          06 — GOOGLE BUSINESS PROFILE
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-gbp">
        <Container>
          <SectionHeading
            index={wimaGbpSection.index}
            eyebrow={wimaGbpSection.eyebrow}
            heading={wimaGbpSection.heading}
            lead={wimaGbpLead}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wimaGbpCards.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <article
                  key={card.label}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4" style={{ color: wimaAccent.base }} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">{card.detail}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.chips.map((c) => (
                      <Chip key={c} tone="muted">
                        {c}
                      </Chip>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8">
            {/* Business profile mock */}
            <div className="wima-reveal overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 border-b border-white/5 bg-neutral-900/80 px-3 py-2 sm:px-4">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/70 sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/70 sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-white/70 sm:h-2.5 sm:w-2.5" />
                </div>
                <span className="truncate rounded-full border border-white/5 bg-black/40 px-2.5 py-0.5 font-mono text-[8px] tracking-wide text-zinc-500 sm:text-[9px]">
                  business.google.com · Rabat, Morocco
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold text-white"
                    style={{ backgroundColor: wimaAccent.base, width: 52, height: 52 }}
                  >
                    W
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{wimaIdentity.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      CAR RENTAL · RABAT, MOROCCO
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Categories", "Services", "Photos"].map((c) => (
                        <Chip key={c} tone="muted">
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-lg border border-white/5"
                      style={{
                        background: `linear-gradient(140deg, rgba(215,25,32,${0.16 - i * 0.04}), rgba(23,24,28,0.9))`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Consistency */}
            <div className="wima-reveal flex flex-col justify-center rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-xl">
              <Eyebrow>{wimaGbpConsistency.label}</Eyebrow>
              <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-300">
                {wimaGbpConsistency.body}
              </p>
              <p className="mt-5 border-t border-white/5 pt-4 font-mono text-[10px] leading-relaxed text-zinc-600">
                {wimaGbpConsistency.disclaimer}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          07 — VISUAL & BRAND SYSTEM  (the colour system)
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-brand">
        <Container>
          <SectionHeading
            index={wimaBrandSection.index}
            eyebrow={wimaBrandSection.eyebrow}
            heading={wimaBrandSection.heading}
            lead={wimaBrandLead}
          />

          {/* Colour system */}
          <div className="wima-reveal mb-6 flex flex-wrap items-end justify-between gap-3">
            <Eyebrow>Colour system</Eyebrow>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              One red · strict greyscale ramp
            </span>
          </div>
          <SwatchGrid />

          {/* Type scale */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {wimaBrandType.map((t) => (
              <div
                key={t.name}
                className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                  {t.name}
                </span>
                <p
                  className={`mt-3 truncate text-white ${t.name === "Display"
                      ? "text-2xl font-extrabold tracking-tighter"
                      : t.name === "Body"
                        ? "text-[13px]"
                        : "font-mono text-[12px] tracking-wide text-zinc-300"
                    }`}
                >
                  {t.sample}
                </p>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                  {t.stack}
                </p>
              </div>
            ))}
          </div>

          {/* Asset system */}
          <div className="wima-reveal mb-6 mt-12 flex flex-wrap items-end justify-between gap-3">
            <Eyebrow>Asset system</Eyebrow>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Logo · photography · UI · local & social
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {wimaBrandTiles.map((tile, i) => {
              const Icon = ICONS[tile.icon];
              return (
                <div
                  key={`${tile.label}-${i}`}
                  className="wima-card overflow-hidden rounded-xl border backdrop-blur-xl"
                  style={{
                    borderColor: tile.accent ? wimaAccent.border : "rgba(255,255,255,0.05)",
                    backgroundColor: tile.accent ? wimaAccent.soft : "rgba(18,19,22,0.55)",
                  }}
                >
                  <div
                    className="flex h-20 items-center justify-center border-b border-white/5 sm:h-24"
                    style={{
                      background: tile.accent
                        ? `linear-gradient(140deg, ${wimaAccent.base}, #7E0F13)`
                        : "linear-gradient(140deg, rgba(215,25,32,0.10), rgba(16,17,20,0.95))",
                    }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: tile.accent ? "#FFFFFF" : wimaAccent.base }}
                    />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[12px] font-bold tracking-tight text-white">
                      {tile.label}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase leading-snug tracking-wider text-zinc-500">
                      {tile.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          08 — MEASUREMENT & SEARCH MONITORING
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-monitoring">
        <Container>
          <SectionHeading
            index={wimaMonitoringSection.index}
            eyebrow={wimaMonitoringSection.eyebrow}
            heading={wimaMonitoringSection.heading}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wimaMonitoringTools.map((tool) => {
              const Icon = ICONS[tool.icon];
              return (
                <article
                  key={tool.title}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4" style={{ color: wimaAccent.base }} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                      {tool.label}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">{tool.detail}</p>
                  <p className="mt-5 border-t border-white/5 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                    {tool.stack}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {wimaMonitoringNote}
          </p>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          09 — UNDER THE HOOD
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-stack">
        <Container>
          <SectionHeading
            index={wimaStackSection.index}
            eyebrow={wimaStackSection.eyebrow}
            heading={wimaStackSection.heading}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {wimaTechStack.map((tech) => (
              <div
                key={tech}
                className="wima-card flex items-center gap-3 rounded-xl border border-white/5 bg-neutral-900/30 px-4 py-4 backdrop-blur-xl transition-colors duration-300 hover:border-[#D71920]/40"
                style={{ backgroundColor: "rgba(18,19,22,0.55)" }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: wimaAccent.base }}
                />
                <span className="font-mono text-[11px] tracking-wide text-zinc-300">{tech}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          10 — OUTCOME
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-outcome">
        <Container>
          <SectionHeading
            index={wimaOutcomeSection.index}
            eyebrow={wimaOutcomeSection.eyebrow}
            heading={wimaOutcomeSection.heading}
          />

          <div className="wima-reveal grid grid-cols-1 overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/30 backdrop-blur-xl lg:grid-cols-2">
            {/* Before */}
            <div className="border-b border-white/5 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Before
                </span>
                <TriangleAlert className="h-5 w-5 text-zinc-700" />
              </div>
              <ul className="mt-6 space-y-4">
                {wimaBeforeAfter.before.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] text-zinc-500">
                      ✕
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-zinc-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="p-7 sm:p-10" style={{ backgroundColor: "rgba(215,25,32,0.03)" }}>
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: wimaAccent.bright }}
                >
                  After
                </span>
                <CircleCheckBig className="h-5 w-5" style={{ color: wimaAccent.base }} />
              </div>
              <ul className="mt-6 space-y-4">
                {wimaBeforeAfter.after.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: wimaAccent.base }}
                    />
                    <span className="text-[13.5px] leading-relaxed text-zinc-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="wima-reveal scrollbar-hide mt-8 -mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-2">
            {wimaTimeline.map((step, i) => (
              <React.Fragment key={step.label}>
                {i > 0 ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700" />
                ) : null}
                <span
                  className="shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{
                    borderColor: step.launch ? wimaAccent.border : "rgba(255,255,255,0.08)",
                    backgroundColor: step.launch ? wimaAccent.base : "rgba(23,24,28,0.6)",
                    color: step.launch ? "#FFFFFF" : "#A1A1AA",
                  }}
                >
                  {step.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          11 — NEXT PHASE
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="wima-next">
        <Container>
          <SectionHeading
            index={wimaNextSection.index}
            eyebrow={wimaNextSection.eyebrow}
            heading={wimaNextSection.heading}
            lead={wimaNextLead}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {wimaNextPhases.map((phase) => {
              const Icon = ICONS[phase.icon];
              return (
                <article
                  key={phase.num}
                  className="wima-card rounded-xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[#D71920]/40"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[11px] font-bold tracking-widest"
                      style={{ color: wimaAccent.base }}
                    >
                      {phase.num}
                    </span>
                    <Icon className="h-4 w-4 text-zinc-600" />
                  </div>
                  <h3 className="mt-4 text-[15.5px] font-bold tracking-tight text-white">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
                    {phase.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          FOOTER — the engagement this case study exists to win
        ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-white/5 py-20 sm:py-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{ backgroundColor: wimaAccent.soft }}
        />
        <Container className="relative z-10">
          <div className="wima-reveal mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Work with me</Eyebrow>
            </div>
            <h2 className="wima-heading mt-5 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {wimaFooter.cta.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              {wimaFooter.cta.body}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white transition-transform duration-300 active:scale-[0.98]"
                style={{ backgroundColor: wimaAccent.base, boxShadow: `0 0 30px ${wimaAccent.glow}` }}
              >
                {wimaFooter.cta.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white/80 transition-colors duration-300 hover:border-white/50 hover:text-white"
              >
                <Layers className="h-4 w-4" />
                All projects
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/5 pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              <span>{wimaFooter.line}</span>
              {wimaFooter.nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={scrollToSection(n.href)}
                  className="transition-colors duration-300 hover:text-[#FF3B41]"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
