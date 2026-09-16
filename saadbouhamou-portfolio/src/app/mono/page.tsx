"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brain,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Cloud,
  Database,
  Download,
  ExternalLink,
  FileText,
  Github,
  Heart,
  Layers,
  Lightbulb,
  Lock,
  Monitor,
  Package,
  Presentation,
  Receipt,
  Rotate3d,
  Ruler,
  Server,
  Shirt,
  ShoppingCart,
  Sparkles,
  Terminal,
  TriangleAlert,
  Workflow,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import {
  monoAccent,
  monoArchitectureLead,
  monoArchitectureNodes,
  monoArchitectureSection,
  monoAssets,
  monoCodeSnippet,
  monoContext,
  monoDatabaseEntities,
  monoDatabaseNote,
  monoDocumentCards,
  monoFeatures,
  monoFeaturesSection,
  monoFooter,
  monoHeroTech,
  monoIdentity,
  monoLimitations,
  monoLimitationsLabel,
  monoLimitsSection,
  monoObjectives,
  monoOverviewCards,
  monoOverviewLead,
  monoOverviewSection,
  monoPerspectives,
  monoPerspectivesLabel,
  monoPipelineLead,
  monoPipelineSection,
  monoProblemsExternalNote,
  monoProblemsSection,
  monoProblemsSolved,
  monoReportCover,
  monoReportIntro,
  monoReportOutline,
  monoReportOutlineLabel,
  monoReportSection,
  monoResultActions,
  monoResultChecklist,
  monoResultDescription,
  monoResultSection,
  monoResults,
  monoSlideOutline,
  monoSlideOutlineLabel,
  monoSlideThumbnails,
  monoTechStack,
  monoTryOnDescription,
  monoTryOnHighlights,
  monoTryOnPipeline,
  monoTryOnSection,
  monoValidationLabel,
  type MonoDocumentCard,
  type MonoIconKey,
  type MonoPipelineStep,
  type MonoSlideThumb,
} from "@/data/mono";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ICON REGISTRY — the data module stores string keys, the page owns the icons
   ═══════════════════════════════════════════════════════════════════════════ */

const ICONS: Record<MonoIconKey, LucideIcon> = {
  alert: TriangleAlert,
  architecture: Boxes,
  solution: Lightbulb,
  features: Layers,
  sparkles: Sparkles,
  poses: Rotate3d,
  fit: Ruler,
  frontend: Monitor,
  api: Server,
  database: Database,
  ai: Brain,
  auth: Lock,
  products: Package,
  cart: ShoppingCart,
  wishlist: Heart,
  orders: Receipt,
  tryon: Shirt,
  pipeline: Workflow,
  shield: CircleCheckBig,
  terminal: Terminal,
  check: CircleCheckBig,
  slides: Presentation,
  report: FileText,
  camera: Camera,
  cloud: Cloud,
};

/** Palette per pipeline layer — keeps the 15 steps readable at a glance. */
const LAYER_STYLE: Record<MonoPipelineStep["layer"], { label: string; color: string }> = {
  frontend: { label: "FRONTEND", color: monoAccent.base },
  backend: { label: "BACKEND", color: "#38BDF8" },
  ai: { label: "AI PROVIDER", color: "#A78BFA" },
  data: { label: "DATABASE", color: "#FBBF24" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL BUILDING BLOCKS
   ═══════════════════════════════════════════════════════════════════════════ */

function Eyebrow({
  children,
  className = "",
  color = monoAccent.base,
}: {
  children: React.ReactNode;
  className?: string;
  /** Brand accent by default; warning blocks pass their own tone. */
  color?: string;
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

function SectionHeading({
  eyebrow,
  heading,
  lead,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="mono-reveal">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mono-heading mt-3 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
          {heading}
        </h2>
      </div>
      {lead ? (
        <p className="mono-reveal mt-5 text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Pill chip used for tech tags, meta and inline labels. */
function Chip({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted";
}) {
  const tones =
    tone === "accent"
      ? "border-white/25 bg-white/5 text-white"
      : "border-white/10 bg-white/5 text-zinc-400";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase ${tones}`}
    >
      {children}
    </span>
  );
}

/**
 * Action button. Renders a real link when the URL exists — opening it in a tab
 * (report, GitHub) or saving it (`download`, the PPTX deck). A missing URL
 * becomes a clearly marked, non-clickable placeholder — we never invent a
 * demo / repo / document URL.
 */
function ActionButton({
  href,
  label,
  icon: Icon,
  variant = "primary",
  meta,
  /** Save the target instead of opening it in a new tab. */
  download = false,
  /** Badge shown on a disabled action, e.g. "COMING SOON". */
  badge = "TODO",
  /** Tooltip for a disabled action. */
  disabledHint = "TODO: link not available yet",
}: {
  href: string | null;
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "outline";
  meta?: string;
  download?: boolean;
  badge?: string;
  disabledHint?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold tracking-widest uppercase transition-all duration-300";
  const skin =
    variant === "primary"
      ? "bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
      : "border border-white/15 text-white/80 hover:border-white/50 hover:text-white";

  const content = (
    <>
      <Icon className="w-4 h-4" />
      {label}
      {meta ? <span className="ml-1 font-normal opacity-70">{meta}</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={download ? undefined : "_blank"}
        rel={download ? undefined : "noopener noreferrer"}
        download={download ? "" : undefined}
        className={`${base} ${skin} active:scale-[0.98]`}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      role="link"
      aria-disabled="true"
      title={disabledHint}
      className={`${base} ${skin} cursor-not-allowed opacity-60`}
    >
      {content}
      <span className="rounded border border-white/30 px-1.5 py-0.5 text-[8px] tracking-widest">
        {badge}
      </span>
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-zinc-300">
      <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-white" />
      <span>{children}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REAL PRODUCT SCREENS
   The screenshots come from the MONO build itself and are served from /public —
   local assets only, the site runs under a strict CSP.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Natural aspect ratios of the supplied assets, used as frame ratios: every
 * frame carries the ratio of the file it holds, so the whole capture stays
 * visible — a screen is never cropped.
 */
const SCREEN_RATIO = {
  /** AI try-on concept visual — the case-study hero. */
  tryOnHero: "aspect-[1678/937]",
  /** Storefront homepage. */
  home: "aspect-[1918/878]",
  /** Product detail page. */
  product: "aspect-[1387/1134]",
  /** Checkout flow. */
  checkout: "aspect-[817/804]",
  /** Report cover — portrait page. */
  cover: "aspect-[1061/1483]",
  /** The try-on recording is a 1918×876 capture of the same storefront. */
  demo: "aspect-[1918/876]",
} as const;

/**
 * A real screenshot inside the browser chrome used across the page, so the
 * screens read as one product instead of unrelated images.
 *
 * Cropping: the frame is given the image's own ratio (see `SCREEN_RATIO`) and
 * the image is drawn with `object-contain`. Frame ratio === image ratio, so the
 * capture fills the frame edge to edge with nothing cut off on any side. The
 * `backdrop` matches the capture's own page background, which keeps any
 * sub-pixel gap invisible while the file decodes.
 */
function BrowserFrame({
  src,
  alt,
  sizes,
  ratio,
  backdrop = "bg-[#F8F8F8]",
  /** Address-bar label — names the screen the chrome wraps. */
  label = "mono — storefront",
  /** Preload the above-the-fold image (the LCP candidate). */
  preload = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Frame ratio — must be the ratio of `src`. */
  ratio: string;
  backdrop?: string;
  label?: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 shadow-[0_0_70px_rgba(255,255,255,0.10)] backdrop-blur-xl ${className}`}
    >
      {/* Window chrome */}
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

      {/* Frame ratio === image ratio → the whole screen is visible */}
      <div className={`relative w-full ${ratio} ${backdrop}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          preload={preload}
          className="object-contain"
        />
      </div>
    </div>
  );
}

/** The three real screens of the shipped build, one ratio per capture. */
const SCREENS = [
  {
    src: monoAssets.home,
    title: "MONO — Storefront",
    label: "Homepage",
    caption:
      "Oversized serif display on a warm cream canvas, a full-height lookbook hero and direct entry points into the collection.",
    alt: "MONO storefront homepage — the “Redefining Minimalist Luxury” serif display with EXPLORE COLLECTION and OUR STORY, next to a full-height lookbook image",
    ratio: SCREEN_RATIO.home,
    backdrop: "bg-white",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw",
  },
  {
    src: monoAssets.product,
    title: "MONO — Product page",
    label: "Product detail",
    caption:
      "Colour swatches, size selector, wishlist and the AI Try-On entry point that starts a virtual fitting.",
    alt: "MONO product page for the “Essential Oversized Tee” at €89 — colour swatches, size row, SAVE TO WISHLIST and the AI TRY-ON button",
    ratio: SCREEN_RATIO.product,
    backdrop: "bg-[#F8F8F8]",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw",
  },
  {
    src: monoAssets.checkout,
    title: "MONO — Checkout",
    label: "Checkout",
    caption:
      "Cash-on-delivery checkout: contact, shipping, payment method and a live order summary.",
    alt: "MONO checkout — contact information, shipping address and cash-on-delivery payment method beside the order summary and PLACE ORDER",
    ratio: SCREEN_RATIO.checkout,
    backdrop: "bg-white",
    sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw",
  },
] as const;

/** Compact gallery tile: one real screen, its label, its caption and a full-size link. */
function ScreenCard({ screen }: { screen: (typeof SCREENS)[number] }) {
  return (
    <article className="mono-card rounded-2xl border border-white/5 bg-neutral-900/30 p-3 backdrop-blur-xl transition-colors duration-500 hover:border-white/20">
      {/* Frame ratio === this capture's ratio → nothing is cropped */}
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-white/10 ${screen.backdrop} ${screen.ratio}`}
      >
        <Image
          src={screen.src}
          alt={screen.alt}
          fill
          sizes={screen.sizes}
          quality={90}
          className="object-contain"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 px-1 pb-1">
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-white">{screen.title}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {screen.label}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-zinc-400">{screen.caption}</p>
        </div>
        <a
          href={screen.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${screen.title} full size`}
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors duration-300 hover:border-white/40 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CODE PANEL — the API snippet from the blueprint
   ═══════════════════════════════════════════════════════════════════════════ */

const CODE_TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|async|function|await|return|const|let|try|catch|new|if|else|true|false|null)\b|\b(\d+)\b/g;

function highlightLine(line: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  CODE_TOKEN_RE.lastIndex = 0;

  while ((match = CODE_TOKEN_RE.exec(line)) !== null) {
    if (match.index > last) out.push(line.slice(last, match.index));
    const className = match[1]
      ? "text-zinc-500 italic"
      : match[2]
        ? "text-zinc-300/80"
        : match[3]
          ? "text-white"
          : "text-zinc-400";
    out.push(
      <span key={`${keyPrefix}-${i++}`} className={className}>
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function CodePanel() {
  const lines = monoCodeSnippet.code.split("\n");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/80 shadow-[0_0_50px_rgba(255,255,255,0.07)] backdrop-blur-xl">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-neutral-900/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
        </div>
        <span className="truncate font-mono text-[10px] tracking-wide text-zinc-400">
          {monoCodeSnippet.filename}
        </span>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4 sm:p-5">
        <pre className="font-mono text-[10px] leading-[1.7] sm:text-[11.5px]">
          <code>
            {lines.map((line, idx) => (
              <div key={`line-${idx}`} className="flex gap-4 whitespace-pre">
                <span className="w-4 shrink-0 select-none text-right text-zinc-700">
                  {idx + 1}
                </span>
                <span className="text-zinc-300">{highlightLine(line, `l${idx}`)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOCUMENTATION — the two real deliverables
   Both files are served from /public and carry their verified metadata
   (page / slide count and size). The strict CSP forbids remote documents.
   ═══════════════════════════════════════════════════════════════════════════ */

/** One real deliverable — the written report or the defence deck. */
function DocumentCard({ doc }: { doc: MonoDocumentCard }) {
  const Icon = ICONS[doc.icon];
  /** The report opens in a tab; the deck saves to disk. */
  const CtaIcon = doc.download ? Download : ExternalLink;

  return (
    <article className="mono-card flex h-full flex-col rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-white/25 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{ borderColor: monoAccent.border, backgroundColor: monoAccent.soft }}
        >
          <Icon className="h-4 w-4" style={{ color: monoAccent.base }} />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
          {doc.kicker}
        </span>
      </div>

      <h3 className="text-lg font-bold tracking-tight text-white">{doc.title}</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white">
        {doc.meta}
      </p>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-zinc-400">{doc.description}</p>

      <div className="mt-5">
        <ActionButton
          href={doc.href}
          label={doc.cta}
          icon={CtaIcon}
          download={doc.download}
        />
      </div>
    </article>
  );
}

/**
 * The real cover of the written report, uncropped in a portrait frame, with the
 * cover's own metadata listed under it. Nothing is redrawn here: the visual is
 * the published cover page and the block below it is the exact set of facts
 * printed on that page and on the PDF file itself.
 */
function ReportCover() {
  const cover = monoReportCover;

  /** The cover's metadata, exactly as printed on the page. */
  const coverMetadata = [
    `Author — ${cover.author}`,
    `Encadrant — ${cover.supervisor}`,
    `Président du jury — ${cover.jury.president}`,
    `Examinateur — ${cover.jury.examiner}`,
    `Year — ${cover.academicYear}`,
  ].join(" · ");

  return (
    <div className="w-full max-w-[300px] sm:max-w-[340px]">
      <div className="relative">
        {/* Stacked pages behind the cover */}
        <div className="absolute -right-2.5 top-2.5 h-full w-full rounded-r-xl border border-white/10 bg-white/[0.06]" />
        <div className="absolute -right-1.5 top-1.5 h-full w-full rounded-r-xl border border-white/10 bg-white/[0.09]" />

        {/* Portrait frame at the cover's own ratio — the page is never cropped */}
        <div
          className={`relative overflow-hidden rounded-xl border border-white/20 bg-white shadow-[0_0_60px_rgba(255,255,255,0.10)] ${SCREEN_RATIO.cover}`}
        >
          <Image
            src={monoAssets.cover}
            alt="Cover page of the MONO project report — ISMAGI, Licence Professionnelle en Développement Web et Mobile, “MONO AI Fashion Store”, by Saad Bouhamou"
            fill
            sizes="(max-width: 640px) 76vw, (max-width: 1024px) 40vw, 340px"
            quality={90}
            className="object-contain"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-5 space-y-2.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white">
          {cover.school}
        </p>
        <p className="font-mono text-[10px] leading-relaxed text-zinc-500">{cover.degree}</p>
        <p className="pt-1 text-2xl font-bold tracking-tighter text-white">{cover.title}</p>
        <p className="text-[13px] leading-relaxed text-zinc-200">{cover.projectTitle}</p>
        <p className="text-[11px] leading-relaxed text-zinc-500">{cover.subtitle}</p>
        <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
          {cover.kind}
        </p>
        <p className="font-mono text-[10px] leading-relaxed text-zinc-400">{coverMetadata}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {cover.meta}
        </p>
      </div>
    </div>
  );
}

/** Abstract mini-slide — no text-dense content, just the deck's visual rhythm. */
function SlideThumb({ slide }: { slide: MonoSlideThumb }) {
  return (
    <div className="flex-shrink-0 snap-center">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-950/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_70%)]" />

        {slide.kind === "cover" ? (
          <div className="relative flex h-full flex-col justify-center p-3">
            <span className="text-[10px] font-bold tracking-tighter text-white">MONO</span>
            <span className="mt-1 h-1 w-8 rounded-full bg-white" />
          </div>
        ) : null}

        {slide.kind === "architecture" ? (
          <div className="relative flex h-full items-center justify-center gap-1.5 p-3">
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <span className="h-5 w-6 rounded-[3px] border border-white/40 bg-white/5" />
                {i < 2 ? <span className="h-px w-2 bg-white/50" /> : null}
              </React.Fragment>
            ))}
          </div>
        ) : null}

        {slide.kind === "ai" ? (
          <div className="relative flex h-full items-center justify-center gap-2 p-3">
            <span className="h-8 w-6 rounded-[3px] bg-gradient-to-b from-zinc-700 to-zinc-900" />
            <ArrowRight className="h-3 w-3 text-white" />
            <span className="h-8 w-6 rounded-[3px] bg-gradient-to-b from-white/40 to-white/5" />
          </div>
        ) : null}

        {slide.kind === "results" ? (
          <div className="relative flex h-full items-end justify-center gap-1 p-3">
            {[40, 65, 50, 85].map((h, i) => (
              <span
                key={i}
                className="w-2 rounded-t bg-white/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        ) : null}

        <span className="absolute right-2 top-1.5 font-mono text-[8px] text-zinc-600">
          {slide.n}
        </span>
      </div>
      <p className="mt-2 truncate text-[11px] font-medium text-zinc-400">{slide.title}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function MonoCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  /* Land at the top of the page when arriving from the home page sections */
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const scrollSlides = useCallback((dir: 1 | -1) => {
    const el = slidesRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  }, []);

  useGSAP(
    () => {
      // Heading reveal — dimmed white → full white (the accent is monochrome)
      gsap.utils.toArray<HTMLElement>(".mono-heading").forEach((el) => {
        gsap.set(el, {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          color: "rgba(255, 255, 255, 0.45)",
          skewX: 3,
        });
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 88%", end: "top 55%", scrub: 1 } })
          .to(el, { opacity: 1, y: 0, filter: "blur(0px)", skewX: 0, duration: 0.7, ease: "power2.out" })
          .to(el, { color: monoAccent.base, duration: 0.4, ease: "power1.inOut" }, "<0.3");
      });

      // Generic fade-up
      gsap.utils.toArray<HTMLElement>(".mono-reveal").forEach((el) => {
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
      gsap.set(".mono-card", { y: 45, opacity: 0 });
      ScrollTrigger.batch(".mono-card", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true }),
        onLeaveBack: (els) => gsap.set(els, { y: 45, opacity: 0, overwrite: true }),
      });
    },
    { scope: containerRef },
  );

  return (
    <main ref={containerRef} className="relative z-10 min-h-svh overflow-x-hidden">
      {/* ═════════════════════════════════════════════════════════════════════
          HERO
        ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[140px] sm:h-[760px] sm:w-[760px]"
          style={{ backgroundColor: monoAccent.soft }}
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <div className="mono-reveal">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-sm sm:text-xs"
                  style={{ borderColor: monoAccent.border, color: monoAccent.base, backgroundColor: monoAccent.soft }}
                >
                  {monoIdentity.heroLabel}
                </span>
              </div>

              <h1 className="mono-heading mt-7 text-6xl font-bold leading-[0.85] tracking-tighter sm:text-7xl md:text-8xl lg:text-[8.5rem]">
                {monoIdentity.name}
              </h1>

              <p className="mono-reveal mx-auto mt-6 max-w-xl text-lg font-light tracking-tight text-white/90 sm:text-xl md:text-2xl lg:mx-0">
                {monoIdentity.tagline}
              </p>

              <p className="mono-reveal mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base lg:mx-0">
                {monoIdentity.heroDescription}
              </p>

              <div className="mono-reveal mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {monoHeroTech.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>

              <div className="mono-reveal mt-9 flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 lg:items-start">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
                  <span className="text-zinc-300">{monoIdentity.projectType}</span>
                  <span className="text-zinc-700">/</span>
                  <span>{monoIdentity.school}</span>
                  <span className="text-zinc-700">/</span>
                  <span>{monoIdentity.academicYear}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
                  <span>By {monoIdentity.author}</span>
                  <span className="text-zinc-700">/</span>
                  <span>{monoIdentity.degree}</span>
                </div>
              </div>
            </div>

            {/* Shipped storefront homepage */}
            <div className="mono-reveal relative mx-auto w-full max-w-[620px] lg:max-w-none">
              <BrowserFrame
                src={monoAssets.home}
                alt="MONO storefront homepage — oversized serif display on a cream canvas, a full-height lookbook hero and direct collection entry points"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 600px"
                ratio={SCREEN_RATIO.home}
                backdrop="bg-white"
                label="mono — storefront"
                preload
              />
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 lg:text-left">
                Storefront — the shipped homepage
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          01 — PROJECT OVERVIEW
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="overview">
        <Container>
          <SectionHeading
            eyebrow={monoOverviewSection.eyebrow}
            heading={monoOverviewSection.heading}
            lead={monoOverviewLead}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
            {/* Four cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {monoOverviewCards.map((card) => {
                const Icon = ICONS[card.icon];
                return (
                  <article
                    key={card.title}
                    className="mono-card rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-white/25 sm:p-6"
                  >
                    <div
                      className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border"
                      style={{ borderColor: monoAccent.border, backgroundColor: monoAccent.soft }}
                    >
                      <Icon className="h-4 w-4" style={{ color: monoAccent.base }} />
                    </div>
                    <h3 className="mb-2 text-base font-bold tracking-tight text-white sm:text-lg">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{card.body}</p>
                    {card.bullets ? (
                      <ul className="mt-4 space-y-2">
                        {card.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-300">
                            <ArrowRight
                              className="mt-0.5 h-3.5 w-3.5 shrink-0"
                              style={{ color: monoAccent.base }}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
            </div>

            {/* Context + code */}
            <div className="space-y-5">
              <div className="mono-reveal rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl sm:p-6">
                <Eyebrow>Context</Eyebrow>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{monoContext.problem}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{monoContext.solution}</p>
              </div>
              <div className="mono-reveal">
                <CodePanel />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="mono-reveal mt-12 rounded-2xl border border-white/5 bg-neutral-900/20 p-5 backdrop-blur-xl sm:p-7">
            <Eyebrow>Objectives</Eyebrow>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {monoObjectives.map((o) => {
                const Icon = ICONS[o.icon];
                return (
                  <div key={o.n} className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs" style={{ color: monoAccent.base }}>
                      {o.n}
                    </span>
                    <div className="min-w-0">
                      <Icon className="mb-1.5 h-4 w-4 text-zinc-500" />
                      <p className="text-sm leading-snug text-zinc-300">{o.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          02 — AI VIRTUAL TRY-ON SPOTLIGHT
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="ai-try-on">
        <Container>
          <SectionHeading
            eyebrow={monoTryOnSection.eyebrow}
            heading={monoTryOnSection.heading}
            lead={monoTryOnDescription}
          />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <ul className="mono-reveal space-y-6">
              {monoTryOnHighlights.map((h) => {
                const Icon = ICONS[h.icon];
                return (
                  <li key={h.title} className="flex items-start gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{ borderColor: monoAccent.border, backgroundColor: monoAccent.soft }}
                    >
                      <Icon className="h-4 w-4" style={{ color: monoAccent.base }} />
                    </span>
                    <div>
                      <p className="text-base font-bold tracking-tight text-white">{h.title}</p>
                      <p className="mt-0.5 text-sm text-zinc-400">{h.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mono-reveal">
              <BrowserFrame
                src={monoAssets.product}
                alt="MONO product page — “Essential Oversized Tee” at €89 with colour swatches, a size row and the AI TRY-ON button"
                sizes="(max-width: 1024px) 92vw, 680px"
                ratio={SCREEN_RATIO.product}
                backdrop="bg-[#F8F8F8]"
                label="mono — product"
              />
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 lg:text-left">
                Real screen · product page, where the try-on starts
              </p>
            </div>
          </div>

          {/* Demo recording — 33 MB, so it never autoplays and never preloads */}
          <div className="mono-reveal mt-14">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <Eyebrow>Demo recording</Eyebrow>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                  The module running end to end: photo upload, generation and the before → after
                  comparison.
                </p>
              </div>
              <Chip tone="muted">MP4 · 33 MB · CLICK TO PLAY</Chip>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_70px_rgba(255,255,255,0.08)]">
              <video
                src={monoAssets.demoVideo}
                poster={monoAssets.product}
                controls
                playsInline
                preload="none"
                className={`w-full ${SCREEN_RATIO.demo} bg-black object-contain`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          03 — AI TRY-ON PIPELINE (15 steps)
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="pipeline">
        <Container>
          <SectionHeading
            eyebrow={monoPipelineSection.eyebrow}
            heading={monoPipelineSection.heading}
            lead={monoPipelineLead}
          />

          {/* Layer legend */}
          <div className="mono-reveal mb-8 flex flex-wrap gap-2">
            {Object.values(LAYER_STYLE).map((l) => (
              <span
                key={l.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-400"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}` }}
                />
                {l.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monoTryOnPipeline.map((s) => {
              const layer = LAYER_STYLE[s.layer];
              return (
                <article
                  key={s.step}
                  className="mono-card group relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-white/15"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${layer.color}, transparent)` }}
                  />
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs" style={{ color: layer.color }}>
                      {s.step}
                    </span>
                    <span
                      className="rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest"
                      style={{ borderColor: `${layer.color}50`, color: layer.color }}
                    >
                      {layer.label}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-bold tracking-tight text-white sm:text-base">
                    {s.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-zinc-400">{s.detail}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          04 — SYSTEM ARCHITECTURE
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="architecture">
        <Container>
          <SectionHeading
            eyebrow={monoArchitectureSection.eyebrow}
            heading={monoArchitectureSection.heading}
            lead={monoArchitectureLead}
          />

          {/* Flow */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {monoArchitectureNodes.map((node, idx) => {
              const Icon = ICONS[node.icon];
              return (
                <div key={node.step} className="relative">
                  <article className="mono-card h-full rounded-2xl border border-white/5 bg-neutral-900/30 p-5 text-center backdrop-blur-xl transition-colors duration-500 hover:border-white/30 sm:p-6">
                    <div
                      className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border"
                      style={{ borderColor: monoAccent.border, backgroundColor: monoAccent.soft }}
                    >
                      <Icon className="h-5 w-5" style={{ color: monoAccent.base }} />
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                      {node.step}
                    </p>
                    <h3 className="mt-1 text-base font-bold tracking-tight text-white">
                      {node.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300">{node.stack}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-zinc-500">{node.detail}</p>
                  </article>

                  {idx < monoArchitectureNodes.length - 1 ? (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-zinc-700 lg:block" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Tech stack */}
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
            {monoTechStack.map((group) => {
              const Icon = ICONS[group.icon];
              return (
                <article
                  key={group.layer}
                  className="mono-card rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl sm:p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="h-4 w-4" style={{ color: monoAccent.base }} />
                    <h3 className="text-base font-bold tracking-tight text-white">{group.layer}</h3>
                  </div>
                  <p className="mb-4 text-[13px] text-zinc-400">{group.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Database entities */}
          <div className="mono-reveal mt-8 rounded-2xl border border-white/5 bg-neutral-900/20 p-5 backdrop-blur-xl sm:p-7">
            <Eyebrow>Database design</Eyebrow>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {monoDatabaseEntities.map((entity) => (
                <div
                  key={entity.name}
                  className="rounded-xl border border-white/5 bg-black/40 p-3.5"
                >
                  <p className="font-mono text-[11px] font-bold tracking-wide text-white">
                    {entity.name}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-zinc-500">{entity.role}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">{monoDatabaseNote}</p>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          05 — MAIN FEATURES
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="features">
        <Container>
          <SectionHeading
            eyebrow={monoFeaturesSection.eyebrow}
            heading={monoFeaturesSection.heading}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monoFeatures.map((f) => {
              const Icon = ICONS[f.icon];
              return (
                <article
                  key={f.title}
                  className="mono-card group rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:bg-neutral-900/50 sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{ borderColor: monoAccent.border, backgroundColor: monoAccent.soft }}
                    >
                      <Icon className="h-4 w-4" style={{ color: monoAccent.base }} />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-700 transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 text-base font-bold tracking-tight text-white sm:text-lg">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{f.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>




      {/* ═════════════════════════════════════════════════════════════════════
          07 — PROBLEMS SOLVED
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="troubleshooting">
        <Container>
          <SectionHeading
            eyebrow={monoProblemsSection.eyebrow}
            heading={monoProblemsSection.heading}
            lead="Six blockers hit while wiring the AI try-on to a real model — and how each one was fixed."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monoProblemsSolved.map((p) => (
              <article
                key={p.n}
                className="mono-card overflow-hidden rounded-2xl border border-white/5 bg-black/60 p-5 backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-zinc-600">#{p.n}</span>
                  <Terminal className="h-3.5 w-3.5 text-red-400/80" />
                  <span className="truncate text-red-300/90">{p.error}</span>
                </div>
                <div className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-400">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" />
                  <span>{p.fix}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mono-reveal mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" />
            <p className="text-[13px] leading-relaxed text-zinc-400">
              <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400/90">
                External limitation ·{" "}
              </span>
              {monoProblemsExternalNote}
            </p>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          08 — PROJECT REPORT / DOCUMENTATION
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="documentation">
        <Container>
          <div className="mb-12 md:mb-16">
            <div className="mono-reveal">
              <Eyebrow>{monoReportSection.eyebrow}</Eyebrow>
              <h2 className="mono-heading mt-3 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {monoReportIntro.heading}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
            {/* Report cover */}
            <div className="mono-reveal flex justify-center lg:justify-start">
              <ReportCover />
            </div>

            {/* Deliverables: the real report + the real deck */}
            <div className="min-w-0">
              <div className="mono-reveal">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                  {monoReportIntro.kicker}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {monoReportIntro.cardsTitle}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {monoReportIntro.description}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {monoDocumentCards.map((doc) => (
                  <DocumentCard key={doc.title} doc={doc} />
                ))}
              </div>

              {/* Report structure */}
              <div className="mono-reveal mt-10">
                <Eyebrow>{monoReportOutlineLabel}</Eyebrow>
                <ol className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {monoReportOutline.map((s) => (
                    <li key={s.n} className="flex items-baseline gap-3 text-[13px]">
                      <span className="font-mono text-[10px] text-zinc-600">{s.n}</span>
                      <span className="text-zinc-300">{s.title}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Slides */}
              <div className="mono-reveal mt-12">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                      {monoReportIntro.slidesKicker}
                    </p>
                    {/* The deck title, exactly as printed on its first slide */}
                    <p className="mt-2 text-sm font-medium text-white">
                      “{monoIdentity.deckTitleEn}”
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{monoReportIntro.slidesNote}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollSlides(-1)}
                      aria-label="Previous slides"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-white/40 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSlides(1)}
                      aria-label="Next slides"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors duration-300 hover:border-white/40 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  ref={slidesRef}
                  className="scrollbar-hide mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
                >
                  {monoSlideThumbnails.map((slide) => (
                    <div key={slide.n} className="w-[150px] shrink-0 sm:w-[168px]">
                      <SlideThumb slide={slide} />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Eyebrow>{monoSlideOutlineLabel}</Eyebrow>
                  <ol className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {monoSlideOutline.map((s) => (
                      <li key={s.n} className="flex items-baseline gap-3 text-[13px]">
                        <span className="font-mono text-[10px] text-zinc-600">{s.n}</span>
                        <span className="text-zinc-300">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          09 — RESULT / WHAT I BUILT
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="result">
        <Container>
          <SectionHeading
            eyebrow={monoResultSection.eyebrow}
            heading={monoResultSection.heading}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="mono-reveal">
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {monoResultDescription}
              </p>

              <ul className="mt-7 space-y-3">
                {monoResultChecklist.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ActionButton
                  href={monoIdentity.liveDemoUrl}
                  label={monoResultActions.liveDemoLabel}
                  icon={ExternalLink}
                  badge={monoResultActions.liveDemoBadge}
                  disabledHint={monoResultActions.liveDemoHint}
                />
                <ActionButton
                  href={monoIdentity.githubUrl}
                  label={monoResultActions.githubLabel}
                  icon={Github}
                  variant="outline"
                />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {monoResultActions.footnote}
              </p>
            </div>

            {/* Validated results */}
            <div className="mono-reveal rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-xl sm:p-7">
              <Eyebrow>{monoValidationLabel}</Eyebrow>
              <ul className="mt-5 space-y-4">
                {monoResults.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    <span className="text-sm leading-relaxed text-zinc-300">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          10 — LIMITATIONS & PERSPECTIVES
        ═════════════════════════════════════════════════════════════════════ */}
      <Section id="limits">
        <Container>
          <SectionHeading eyebrow={monoLimitsSection.eyebrow} heading={monoLimitsSection.heading} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="mono-card rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <TriangleAlert className="h-4 w-4 text-amber-400/90" />
                <Eyebrow color="rgba(251, 191, 36, 0.9)">{monoLimitationsLabel}</Eyebrow>
              </div>
              <ul className="space-y-4">
                {monoLimitations.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mono-card rounded-2xl border border-white/15 bg-neutral-900/30 p-6 backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="h-4 w-4" style={{ color: monoAccent.base }} />
                <Eyebrow>{monoPerspectivesLabel}</Eyebrow>
              </div>
              <ul className="space-y-4">
                {monoPerspectives.map((p, i) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
                    <span className="font-mono text-[10px] text-zinc-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═════════════════════════════════════════════════════════════════════
          FOOTER — project identity + stack
        ═════════════════════════════════════════════════════════════════════ */}
      <footer className="relative mt-8 border-t border-white/5 px-4 pb-16 pt-10 md:px-8">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <p className="text-3xl font-bold tracking-tighter text-white">
                {monoFooter.name}
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                {monoFooter.tagline} — {monoFooter.taglineShort}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-zinc-600">
                {monoFooter.projectType} · {monoFooter.school} · {monoFooter.academicYear}
                <br />
                {monoFooter.author}
              </p>
            </div>

            <div className="lg:text-right">
              <Eyebrow>Tech stack</Eyebrow>
              <div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
                {monoFooter.stack.map((tech) => (
                  <Chip key={tech} tone="muted">
                    {tech}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            <FileText className="h-3.5 w-3.5" />
            {monoIdentity.category}
          </div>
        </Container>
      </footer>
    </main>
  );
}
