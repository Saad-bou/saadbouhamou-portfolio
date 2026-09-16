/**
 * MONO — Projet de Fin d'Études (PFE)
 * Single source of truth for:
 *   1. the /mono case-study page (src/app/mono/page.tsx renders from this file)
 *   2. the final written report  → `monoReportOutline` + `monoDefenseQa`
 *   3. the defence slide deck    → `monoSlideOutline` + `monoSlideThumbnails`
 *
 * Rules for this file:
 *   - No React / no JSX here: it stays framework-agnostic so a report or a deck
 *     generator can consume the exact same objects. Icons are string keys that
 *     the page maps to lucide-react components.
 *   - Page copy is English (the portfolio is English); the report and the deck
 *     themselves are French.
 *   - The two academic deliverables (the 48-page report and the 16-slide deck),
 *     the jury and the GitHub repository are real, so their paths / URLs live
 *     here. The live demo is the only link that does not exist yet: it stays
 *     `null` and is rendered as an explicit "coming soon" placeholder.
 */

/* ══════════════════════════════════════════════════════════════════════════
   SHARED TYPES
   ══════════════════════════════════════════════════════════════════════════ */

/** Icon keys — mapped to lucide-react components in src/app/mono/page.tsx. */
export type MonoIconKey =
  | "alert"
  | "architecture"
  | "solution"
  | "features"
  | "sparkles"
  | "poses"
  | "fit"
  | "frontend"
  | "api"
  | "database"
  | "ai"
  | "auth"
  | "products"
  | "cart"
  | "wishlist"
  | "orders"
  | "tryon"
  | "pipeline"
  | "shield"
  | "terminal"
  | "check"
  | "slides"
  | "report"
  | "camera"
  | "cloud";

/** A labelled block of body copy (used by every section of the page). */
export interface MonoSectionLabels {
  /** Small green eyebrow, e.g. "PROJECT". */
  eyebrow: string;
  /** Big white display heading, e.g. "OVERVIEW". */
  heading: string;
}

/* ══════════════════════════════════════════════════════════════════════════
   1. IDENTITY
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The two real PFE deliverables, served as local files from /public.
 * Declared before the identity block so the identity, the asset map and the
 * page share one path per file — the site runs under a strict CSP
 * (`default-src 'self'`), so these are never remote URLs.
 */
export const monoDocumentPaths = {
  reportPdf: "/projects/mono/MONO_Rapport_PFE.pdf",
  slidesPptx: "/projects/mono/MONO_Presentation_PFE.pptx",
} as const;

/** The PFE jury, exactly as printed on the report cover. */
export interface MonoJury {
  /** Encadrant. */
  supervisor: string;
  /** Président du jury. */
  president: string;
  /** Examinateur. */
  examiner: string;
}

export interface MonoIdentity {
  name: string;
  tagline: string;
  heroLabel: string;
  heroDescription: string;
  projectType: string;
  /** Full French title, as printed on the report cover. */
  projectTitleFr: string;
  /** Deck title, as printed on slide 1 of the defence deck. */
  deckTitleEn: string;
  school: string;
  degree: string;
  author: string;
  /** Encadrant — Nassim Kharmoum (report cover + Remerciements). */
  supervisor: string;
  jury: MonoJury;
  academicYear: string;
  category: string;
  reportLanguage: string;
  /* Links. The live demo is the only one that does not exist yet. */
  liveDemoUrl: string | null;
  /** false until MONO is deployed — the page renders a "coming soon" badge. */
  liveDemoAvailable: boolean;
  githubUrl: string;
  reportPdfUrl: string;
  slidesPptxUrl: string;
}

export const monoIdentity: MonoIdentity = {
  name: "MONO",
  tagline: "Full-Stack E-commerce Platform + AI Virtual Try-On",
  heroLabel: "CASE STUDY · FULL-STACK + AI",
  heroDescription:
    "MONO is a modern e-commerce platform that combines a seamless shopping experience with an AI-powered virtual try-on, allowing customers to see how clothes look on them before they buy.",
  projectType: "Projet de Fin d'Études (PFE)",
  projectTitleFr:
    "MONO AI Fashion Store : Plateforme e-commerce intelligente avec essayage virtuel assisté par l'IA",
  deckTitleEn: "AI-Powered Fashion E-Commerce with AI Virtual Try-On",
  school: "ISMAGI",
  degree: "Licence Professionnelle en Développement Web et Mobile",
  author: "Saad Bouhamou",
  supervisor: "Nassim Kharmoum",
  jury: {
    supervisor: "Nassim Kharmoum",
    president: "Yassine Rayri",
    examiner: "Kamal Najem",
  },
  academicYear: "2025 – 2026",
  category: "E-commerce · Full-Stack · Artificial Intelligence",
  reportLanguage: "French (report & slides) — page copy in English",
  liveDemoUrl: null,
  liveDemoAvailable: false,
  githubUrl: "https://github.com/Saad-bou/MONO-PFE-",
  reportPdfUrl: monoDocumentPaths.reportPdf,
  slidesPptxUrl: monoDocumentPaths.slidesPptx,
};

/**
 * MONO brand accent — white / monochrome.
 * The brand is a black & white minimalist store (light UI, black text, serif
 * display), so the portfolio accent is plain white instead of a colour.
 */
export const monoAccent = {
  base: "#FFFFFF",
  glow: "rgba(255, 255, 255, 0.42)",
  soft: "rgba(255, 255, 255, 0.10)",
  border: "rgba(255, 255, 255, 0.28)",
} as const;

/**
 * Real product screenshots, the try-on visual, the report cover and the two
 * academic deliverables, all served from /public.
 * Local files only — the site runs under a strict CSP.
 *
 * Every still is WebP, and the case-study page frames each file at its own
 * natural ratio (see SCREEN_RATIO in src/app/mono/page.tsx) so a capture is
 * never cropped. The older PNGs stay on disk for the assets that still
 * reference them.
 */
export interface MonoAssets {
  /** Concept visual of the AI virtual try-on — the case-study hero. */
  tryonHero: string;
  /** Storefront homepage. */
  home: string;
  /** Product detail page (AI Try-On entry point). */
  product: string;
  /** Checkout flow. */
  checkout: string;
  /** Cover page of the written report (portrait). */
  cover: string;
  /** Screen recording of the AI virtual try-on. */
  demoVideo: string;
  /** Final-year report — 48 pages, French. */
  reportPdf: string;
  /** Defence slide deck — 16 slides, French. */
  slidesPptx: string;
}

export const monoAssets: MonoAssets = {
  tryonHero: "/projects/mono/tryon-hero.webp",
  home: "/projects/mono/home.webp",
  product: "/projects/mono/product.webp",
  checkout: "/projects/mono/checkout.webp",
  cover: "/projects/mono/cover.webp",
  demoVideo: "/projects/mono/tryon-demo.mp4",
  reportPdf: monoDocumentPaths.reportPdf,
  slidesPptx: monoDocumentPaths.slidesPptx,
};

export const monoHeroTech: string[] = [
  "Next.js",
  "Node.js",
  "Express",
  "Prisma",
  "MySQL",
  "JWT",
  "AI",
];

/* ══════════════════════════════════════════════════════════════════════════
   2. CONTEXT — PROBLEM / SOLUTION / OBJECTIVES
   ══════════════════════════════════════════════════════════════════════════ */

export const monoContext = {
  problem:
    "Fashion e-commerce is one of the largest markets online, but customers still cannot try clothes on before buying. That uncertainty means more returns, more frustration and less trust in online stores.",
  solution:
    "MONO — a modern e-commerce platform with an AI-powered virtual try-on, so customers can see how a garment fits on their own body before they order it.",
  category: monoIdentity.category,
};

export interface MonoObjective {
  n: string;
  title: string;
  icon: MonoIconKey;
}

export const monoObjectives: MonoObjective[] = [
  { n: "01", title: "Develop a modern e-commerce platform", icon: "products" },
  { n: "02", title: "Build a high-performance full-stack architecture", icon: "architecture" },
  { n: "03", title: "Integrate an AI virtual try-on system", icon: "sparkles" },
  { n: "04", title: "Improve the user experience", icon: "features" },
];

/* ══════════════════════════════════════════════════════════════════════════
   3. PROJECT OVERVIEW
   ══════════════════════════════════════════════════════════════════════════ */

export interface MonoOverviewCard {
  title: string;
  body: string;
  bullets?: string[];
  icon: MonoIconKey;
}

export const monoOverviewSection: MonoSectionLabels = {
  eyebrow: "PROJECT",
  heading: "OVERVIEW",
};

export const monoOverviewLead =
  "A complete full-stack e-commerce platform with AI virtual try-on, built to deliver a smooth, modern and intelligent shopping experience.";

export const monoOverviewCards: MonoOverviewCard[] = [
  {
    title: "Problem",
    body: "Traditional online shopping lacks the ability to try clothes virtually, leading to uncertainty, higher return rates and less customer satisfaction.",
    icon: "alert",
  },
  {
    title: "Architecture",
    body: "Modern full-stack architecture: Next.js frontend, Node.js + Express REST API, Prisma ORM with a MySQL database, and an AI service for virtual try-on.",
    icon: "architecture",
  },
  {
    title: "Solution",
    body: "A full-stack e-commerce platform with AI virtual try-on, allowing users to visualise clothing on their own body, with a seamless and secure shopping experience.",
    icon: "solution",
  },
  {
    title: "Key Features",
    body: "Everything a store needs, plus the AI module that makes MONO different.",
    bullets: [
      "Secure authentication & authorization",
      "Product catalog & search",
      "Shopping cart & wishlist",
      "Order management",
      "AI virtual try-on",
    ],
    icon: "features",
  },
];

/** Dark code-editor snippet shown next to the overview cards. */
export const monoCodeSnippet = {
  filename: "src/app/api/products/route.ts",
  language: "TypeScript",
  code: `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, images: true },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}`,
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   4. AI VIRTUAL TRY-ON SPOTLIGHT
   ══════════════════════════════════════════════════════════════════════════ */

export const monoTryOnSection: MonoSectionLabels = {
  eyebrow: "AI POWERED",
  heading: "AI VIRTUAL TRY-ON",
};

export const monoTryOnDescription =
  "See how it looks on you, in real time. MONO's AI pipeline maps the garment onto your own photo and returns a realistic preview you can compare before ordering.";

export interface MonoTryOnHighlight {
  title: string;
  body: string;
  icon: MonoIconKey;
}

export const monoTryOnHighlights: MonoTryOnHighlight[] = [
  { title: "Realistic results", body: "Powered by advanced AI models", icon: "sparkles" },
  { title: "Multiple poses", body: "View from different angles", icon: "poses" },
  { title: "Accurate fit", body: "Better shopping decisions", icon: "fit" },
];

/** Product used by the product-page mock-up inside the try-on section. */
export const monoProductPreview = {
  name: "Essential Hoodie",
  price: "$79.00",
  rating: "4.8",
  reviews: 124,
  colors: ["#1F2937", "#6B7280", "#065F46"],
  sizes: ["S", "M", "L", "XL"],
  defaultSize: "M",
  addToCart: "Add to Cart",
  tryOn: "Try On",
  badge: "AI GENERATED",
} as const;

export const monoPipelineSection: MonoSectionLabels = {
  eyebrow: "PIPELINE",
  heading: "END-TO-END FLOW",
};

export const monoPipelineLead =
  "From the “Try On” click to the Before → After comparison: the 15 steps of the AI try-on, across the frontend, the backend, the AI provider and the database.";

export interface MonoPipelineStep {
  step: string;
  title: string;
  detail: string;
  layer: "frontend" | "backend" | "ai" | "data";
}

/** The end-to-end virtual try-on pipeline, exactly as implemented. */
export const monoTryOnPipeline: MonoPipelineStep[] = [
  {
    step: "01",
    title: "Frontend",
    detail:
      "The user opens a product page, clicks “Try On”, selects a photo and clicks “Generate AI Try-On”.",
    layer: "frontend",
  },
  {
    step: "02",
    title: "Upload",
    detail:
      "Frontend calls POST /api/upload/try-on. The backend stores the file (uploads/try-on/<timestamp>.jpg) and returns its public URL.",
    layer: "backend",
  },
  {
    step: "03",
    title: "Frontend → Backend",
    detail:
      'POST /api/ai-try-on with { "productId": "...", "userImage": "http://.../uploads/..." }.',
    layer: "backend",
  },
  {
    step: "04",
    title: "Controller",
    detail:
      "The controller stays thin — Route → Controller → Service → Response. No business logic inside the controller.",
    layer: "backend",
  },
  {
    step: "05",
    title: "AI Try-On Service",
    detail:
      "findProduct(productId) reads the product from the database and resolves its main image.",
    layer: "backend",
  },
  {
    step: "06",
    title: "Resolve product image",
    detail:
      "The internal path /assets/products/... is turned into an absolute public URL so the AI provider can fetch it.",
    layer: "backend",
  },
  {
    step: "07",
    title: "AI Provider Factory",
    detail:
      "The service only calls createAIProvider(). The factory reads AI_PROVIDER from .env and instantiates the right provider (new HuggingFaceProvider(), or a MockProvider) — the Provider Pattern.",
    layer: "ai",
  },
  {
    step: "08",
    title: "HuggingFace Provider",
    detail: "The provider receives two inputs: the person image and the garment image.",
    layer: "ai",
  },
  {
    step: "09",
    title: "File handling",
    detail:
      "HuggingFace cannot read localhost, relative or backend paths, so resolveAndHandleFile() downloads the URL to a temp file first.",
    layer: "ai",
  },
  {
    step: "10",
    title: "Gradio upload",
    detail:
      'handle_file() converts the image into Gradio\'s FileData format ({ type: "command", command: "upload_file" }).',
    layer: "ai",
  },
  {
    step: "11",
    title: "Space discovery",
    detail:
      "The provider tries Space1 → Space2 → Space3 → Space4 until it finds an endpoint exposing /tryon or /process_hd.",
    layer: "ai",
  },
  {
    step: "12",
    title: "Prediction",
    detail:
      "Person + garment + parameters are sent to the IDM-VTON model (GPU inference), which returns the generated image.",
    layer: "ai",
  },
  {
    step: "13",
    title: "Raw response",
    detail: "The generated image is read from the raw response (e.g. data.url).",
    layer: "ai",
  },
  {
    step: "14",
    title: "Database update",
    detail:
      "The service stores generatedImage through repository.update() and sets the TryOnJob status to SUCCESS.",
    layer: "data",
  },
  {
    step: "15",
    title: "Frontend",
    detail: "The frontend fetches generatedImage and shows a Before → After comparison.",
    layer: "frontend",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   5. SYSTEM ARCHITECTURE + TECH STACK + DATABASE
   ══════════════════════════════════════════════════════════════════════════ */

export const monoArchitectureSection: MonoSectionLabels = {
  eyebrow: "ARCHITECTURE",
  heading: "SYSTEM ARCHITECTURE",
};

export const monoArchitectureLead =
  "A scalable and secure architecture designed for performance, modularity and AI integration.";

export interface MonoArchitectureNode {
  step: string;
  title: string;
  stack: string;
  detail: string;
  icon: MonoIconKey;
}

export const monoArchitectureNodes: MonoArchitectureNode[] = [
  {
    step: "01",
    title: "Frontend",
    stack: "Next.js",
    detail: "(Web App)",
    icon: "frontend",
  },
  { step: "02", title: "API", stack: "Node.js + Express", detail: "(REST API)", icon: "api" },
  { step: "03", title: "Database", stack: "MySQL", detail: "(Prisma ORM)", icon: "database" },
  {
    step: "04",
    title: "AI Service",
    stack: "Virtual Try-On",
    detail: "(AI Model)",
    icon: "ai",
  },
];

export interface MonoTechGroup {
  layer: string;
  summary: string;
  items: string[];
  icon: MonoIconKey;
}

export const monoTechStack: MonoTechGroup[] = [
  {
    layer: "Frontend",
    summary: "Fully responsive, animation-driven interface.",
    items: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Zustand (state)",
      "GSAP + Lenis (animation & UX)",
    ],
    icon: "frontend",
  },
  {
    layer: "Backend",
    summary: "Layered REST API with JWT authentication.",
    items: [
      "Node.js",
      "Express.js",
      "Controllers → Services → Repositories",
      "REST API",
      "JWT auth",
      "Modules: Auth · Users · Products · Categories · Collections · Variants · Cart · Orders · Wishlist · Upload · AI Try-On",
    ],
    icon: "api",
  },
  {
    layer: "Database & ORM",
    summary: "Normalized, scalable and maintainable schema.",
    items: ["MySQL", "Prisma ORM", "Migrations", "Relational integrity", "15+ normalized entities"],
    icon: "database",
  },
  {
    layer: "AI",
    summary: "Provider Pattern — swap the AI without touching the app.",
    items: [
      "Provider Pattern / Provider Factory",
      "Mock Provider (development / simulation, ~5s)",
      "HuggingFace provider (real integration)",
      "Future: FASHN AI · Replicate",
    ],
    icon: "ai",
  },
];

export interface MonoEntity {
  name: string;
  role: string;
}

/** The core entities of the schema (15+ normalized tables in total). */
export const monoDatabaseEntities: MonoEntity[] = [
  { name: "User", role: "Accounts, credentials, roles" },
  { name: "Product", role: "Catalog, images, collections" },
  { name: "Variant", role: "Size / colour, stock and price" },
  { name: "Collection", role: "Curated product groupings" },
  { name: "Cart / CartItem", role: "Active basket and its line items" },
  { name: "Order / OrderItem", role: "Placed orders, status, line items" },
  { name: "Wishlist", role: "Saved products per user" },
  { name: "TryOnJob", role: "Person image, garment, generated image, status" },
];

export const monoDatabaseNote =
  "15+ normalized entities in total — the eight above are the core of the schema. A user can create multiple orders, add products to the cart and the wishlist, and run the AI Try-On module — every relation is enforced by the schema.";

/* ══════════════════════════════════════════════════════════════════════════
   6. MAIN FEATURES
   ══════════════════════════════════════════════════════════════════════════ */

export const monoFeaturesSection: MonoSectionLabels = {
  eyebrow: "KEY FEATURES",
  heading: "MAIN FEATURES",
};

export interface MonoFeature {
  title: string;
  body: string;
  icon: MonoIconKey;
}

export const monoFeatures: MonoFeature[] = [
  {
    title: "Authentication",
    body: "Secure login and registration, JWT tokens and protected routes.",
    icon: "auth",
  },
  {
    title: "Products",
    body: "Product catalog, categories, search and filters — full CRUD.",
    icon: "products",
  },
  { title: "Cart", body: "Add, remove and manage items in your cart.", icon: "cart" },
  {
    title: "Wishlist",
    body: "Save your favourite items for later.",
    icon: "wishlist",
  },
  { title: "Orders", body: "Track orders, history and invoices.", icon: "orders" },
  {
    title: "AI Try-On",
    body: "Upload your photo (or use the webcam) to see clothes on you.",
    icon: "tryon",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   7. PROBLEMS SOLVED DURING THE BUILD
   ══════════════════════════════════════════════════════════════════════════ */

export const monoProblemsSection: MonoSectionLabels = {
  eyebrow: "TROUBLESHOOTING",
  heading: "PROBLEMS SOLVED",
};

export interface MonoProblem {
  n: string;
  error: string;
  fix: string;
}

export const monoProblemsSolved: MonoProblem[] = [
  { n: "01", error: "“Could not resolve app config”", fix: "Solved with Space discovery." },
  { n: "02", error: "ENOENT", fix: "Wrong product path." },
  {
    n: "03",
    error: "localhost inaccessible",
    fix: "Download the image to a temp file before uploading it.",
  },
  { n: "04", error: "upload_file error", fix: "Use handle_file() instead." },
  {
    n: "05",
    error: "IndexError",
    fix: "Caused by unsuitable images / internal Space states — fixed after correcting how files were passed.",
  },
  {
    n: "06",
    error: "Final run",
    fix: "Prediction SUCCESS → Repository SUCCESS → generated image returned.",
  },
];

export const monoProblemsExternalNote =
  "The remaining “Could not resolve app config” that occurs across all public Spaces (Nymbo/IDM-VTON, John6666/IDM-VTON, yisol/IDM-VTON, levihsu/OOTDiffusion) is an EXTERNAL limitation — Spaces removed, renamed or sleeping, or a gradio_client update — not an application bug.";

/* ══════════════════════════════════════════════════════════════════════════
   8. RESULTS / LIMITATIONS / PERSPECTIVES
   ══════════════════════════════════════════════════════════════════════════ */

export const monoResultSection: MonoSectionLabels = {
  eyebrow: "RESULT",
  heading: "WHAT I BUILT",
};

export const monoResultDescription =
  "A complete, production-ready full-stack e-commerce platform with AI virtual try-on, showcasing modern web development, scalable architecture and real-world AI integration.";

export const monoResultChecklist: string[] = [
  "Full-stack application",
  "Clean & scalable code",
  "AI virtual try-on integration",
  "Responsive design",
];

/** Small eyebrow labels used inside the result / limits blocks. */
export const monoValidationLabel = "VALIDATION · TESTED";
export const monoLimitationsLabel = "LIMITATIONS";
export const monoPerspectivesLabel = "PERSPECTIVES";

/**
 * Result-section actions. The repository is public; the live demo is not
 * deployed yet, so it keeps `liveDemoUrl: null` and an explicit badge.
 */
export const monoResultActions = {
  liveDemoLabel: "View Live Demo",
  liveDemoBadge: "COMING SOON",
  liveDemoHint: "The live demo is not deployed yet — it is coming soon.",
  githubLabel: "GitHub",
  footnote: "Live demo coming soon · full source code on GitHub",
} as const;

export const monoLimitsSection: MonoSectionLabels = {
  eyebrow: "HONEST REVIEW",
  heading: "LIMITS & PERSPECTIVES",
};

export const monoResults: string[] = [
  "JWT authentication working",
  "Complete product catalog with all CRUD operations",
  "Cart, wishlist and orders work correctly",
  "Backend validated with Postman (REST APIs tested)",
  "Responsive app on desktop, tablet and mobile",
];

export const monoLimitations: string[] = [
  "Main limit: dependency on an external AI API, which is not always available.",
  "No online payment yet.",
  "Not deployed to the cloud yet.",
];

export const monoPerspectives: string[] = [
  "Integrate a more performant AI provider (FASHN AI or Replicate, behind the existing Provider Factory)",
  "Deploy the application to the cloud",
  "Add an online payment system",
  "Build a dashboard with more analytics and statistics",
  "Develop a mobile application",
];

/* ══════════════════════════════════════════════════════════════════════════
   9. REPORT / DOCUMENTATION (+ slides)
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The two real files that ship with the project, with their verified
 * properties (page / slide count and size read from the files themselves).
 */
export interface MonoDeliverable {
  /** Page count (report) or slide count (deck). */
  count: number;
  /** Unit of `count` — drives the "48 pages" / "16 slides" copy. */
  unit: "page" | "slide";
  /** File format, e.g. PDF. */
  format: string;
  /** Human-readable file size, e.g. "2.3 MB". */
  size: string;
  /** Local path under /public — never a remote host (strict CSP). */
  href: string;
  /** true → the link saves the file instead of opening it in a tab. */
  download: boolean;
}

export const monoDeliverables: { report: MonoDeliverable; slides: MonoDeliverable } = {
  report: {
    count: 48,
    unit: "page",
    format: "PDF",
    size: "2.3 MB",
    href: monoDocumentPaths.reportPdf,
    download: false,
  },
  slides: {
    count: 16,
    unit: "slide",
    format: "PPTX",
    size: "1.4 MB",
    href: monoDocumentPaths.slidesPptx,
    download: true,
  },
};

/** "48 pages · PDF · 2.3 MB" — one formatter for every piece of copy. */
export function monoDeliverableMeta(d: MonoDeliverable): string {
  return `${d.count} ${d.unit}s · ${d.format} · ${d.size}`;
}

export const monoReportSection = {
  eyebrow: "PROJECT REPORT / DOCUMENTATION",
  heading: "DOCUMENTATION",
} as const;

export const monoReportIntro = {
  kicker: "Deliverables",
  heading: "DOCUMENTATION",
  /** Sub-heading above the two document cards. */
  cardsTitle: "Report & slides",
  description:
    "The two PFE deliverables, published with the project: the full written report and the defence slide deck — both served as local files, never from an external host.",
  slidesKicker: "Presentation Slides",
  slidesNote: "The defence deck — 16 slides, French — follows the same structure as the report.",
} as const;

/** The two document cards of the Documentation section. */
export interface MonoDocumentCard {
  /** Small uppercase label, e.g. "Report". */
  kicker: string;
  title: string;
  description: string;
  /** Pre-formatted metadata line, e.g. "48 pages · PDF · 2.3 MB". */
  meta: string;
  cta: string;
  href: string;
  /** true → render the `download` attribute (saves instead of rendering). */
  download: boolean;
  icon: MonoIconKey;
}

export const monoDocumentCards: MonoDocumentCard[] = [
  {
    kicker: "Report",
    title: "Project Report",
    description:
      "The complete final-year report (French): context, architecture, implementation, results, difficulties and perspectives.",
    meta: monoDeliverableMeta(monoDeliverables.report),
    cta: "View Full Report",
    href: monoDeliverables.report.href,
    download: false,
    icon: "report",
  },
  {
    kicker: "Slides",
    title: "Presentation Slides",
    description:
      "The defence deck used in front of the jury: the same story, slide by slide.",
    meta: monoDeliverableMeta(monoDeliverables.slides),
    cta: "Download Slides",
    href: monoDeliverables.slides.href,
    download: true,
    icon: "slides",
  },
];

export interface MonoReportCover {
  title: string;
  /** Full French title, as printed on the real cover. */
  projectTitle: string;
  subtitle: string;
  kind: string;
  author: string;
  supervisor: string;
  jury: MonoJury;
  academicYear: string;
  school: string;
  degree: string;
  /** Metadata footer, e.g. "48 pages · PDF · 2.3 MB". */
  meta: string;
}

export const monoReportCover: MonoReportCover = {
  title: monoIdentity.name,
  projectTitle: monoIdentity.projectTitleFr,
  subtitle: monoIdentity.tagline,
  kind: "Project Report",
  author: monoIdentity.author,
  supervisor: monoIdentity.supervisor,
  jury: monoIdentity.jury,
  academicYear: monoIdentity.academicYear,
  school: monoIdentity.school,
  degree: monoIdentity.degree,
  meta: monoDeliverableMeta(monoDeliverables.report),
};

export interface MonoSlideThumb {
  n: string;
  title: string;
  kind: "cover" | "architecture" | "ai" | "results";
}

/** The four thumbnails of the "Presentation Slides" block of the mock-up. */
export const monoSlideThumbnails: MonoSlideThumb[] = [
  { n: "01", title: "MONO", kind: "cover" },
  { n: "02", title: "Architecture", kind: "architecture" },
  { n: "03", title: "AI Try-On", kind: "ai" },
  { n: "04", title: "Results", kind: "results" },
];

export const monoReportOutlineLabel = "Report structure · 48 pages";
export const monoSlideOutlineLabel = "Slide deck · 16 slides · main sections";

export interface MonoOutlineEntry {
  n: string;
  title: string;
}

/** Report structure — used by the written report (French) and listed on the page. */
export const monoReportOutline: MonoOutlineEntry[] = [
  { n: "01", title: "Introduction" },
  { n: "02", title: "Context & problématique" },
  { n: "03", title: "Objectives" },
  { n: "04", title: "General architecture" },
  { n: "05", title: "Technologies used" },
  { n: "06", title: "Realization — frontend" },
  { n: "07", title: "Realization — backend & database" },
  { n: "08", title: "AI Virtual Try-On module" },
  { n: "09", title: "Results" },
  { n: "10", title: "Difficulties encountered" },
  { n: "11", title: "Conclusion & perspectives" },
];

/** 14-slide defence deck outline. */
export const monoSlideOutline: MonoOutlineEntry[] = [
  { n: "01", title: "Title / thanks (MONO)" },
  { n: "02", title: "Plan" },
  { n: "03", title: "Context & problem" },
  { n: "04", title: "Objectives" },
  { n: "05", title: "General architecture" },
  { n: "06", title: "System design" },
  {
    n: "07",
    title:
      "Database design (User / Product / Variant / Collection / Order / Cart / Wishlist / TryOnJob)",
  },
  { n: "08", title: "Frontend (Next.js, React, Tailwind, Zustand, GSAP, Lenis)" },
  { n: "09", title: "Backend (Node/Express, Controllers-Services-Repositories, Prisma, REST)" },
  { n: "10", title: "AI Try-On module (Provider Factory)" },
  { n: "11", title: "Results" },
  { n: "12", title: "AI module deep-dive + limitations" },
  { n: "13", title: "Perspectives" },
  { n: "14", title: "Conclusion + Q&A" },
];

/* ══════════════════════════════════════════════════════════════════════════
   10. DEFENCE Q&A
   Consumed by the report / deck tooling (not rendered on the landing page).
   ══════════════════════════════════════════════════════════════════════════ */

export interface MonoQa {
  question: string;
  answer: string;
}

export const monoDefenseQa: MonoQa[] = [
  {
    question: "Why this project?",
    answer:
      "Fashion e-commerce is huge, but customers cannot try clothes on online: that means uncertainty, more returns and less satisfaction. MONO answers a real problem and lets me cover the whole stack — frontend, backend, database and AI — in one project.",
  },
  {
    question: "Why Next.js?",
    answer:
      "One framework for the React frontend and the API routes, with file-based routing, built-in image optimisation and a production-ready performance base.",
  },
  {
    question: "Why Node.js?",
    answer:
      "The same language on both sides of the application, a non-blocking I/O model that fits an API serving many concurrent requests, and a single runtime for the whole project.",
  },
  {
    question: "Why Express?",
    answer:
      "A minimal, battle-tested REST framework: middleware for JWT authentication, validation and error handling, with a small surface I can structure myself in layers.",
  },
  {
    question: "Why Prisma ORM?",
    answer:
      "Type-safe database access, a readable schema and migrations, and no raw SQL boilerplate — relations between users, products, orders, cart, wishlist and try-on history stay explicit.",
  },
  {
    question: "Why MySQL?",
    answer:
      "The data is highly relational (users → orders, cart, wishlist). A mature relational database with a normalized schema guarantees integrity and is easy to justify and maintain.",
  },
  {
    question: "Why JWT?",
    answer:
      "Stateless authentication: the token carries the user identity, the API keeps no session in memory, protected routes simply verify the token, and the backend stays horizontally scalable.",
  },
  {
    question: "Why Zustand?",
    answer:
      "A very light global store for the cart, wishlist and auth state — simple hooks, no provider pyramid and far less boilerplate than Redux.",
  },
  {
    question: "Why Tailwind CSS?",
    answer:
      "Designing directly in the markup with consistent spacing and colours, a tiny production CSS bundle, and responsive utilities that keep the UI coherent from mobile to desktop.",
  },
  {
    question: "Why GSAP?",
    answer:
      "Timeline-based, high-performance animations. Combined with ScrollTrigger and Lenis it produces the smooth scroll reveals and the polished feel of the interface.",
  },
  {
    question: "Why the Provider Pattern?",
    answer:
      "The AI try-on sits behind an interface: the service only calls createAIProvider(), and the factory reads AI_PROVIDER from .env to build the right implementation. The rest of the application never knows which AI is used, so the provider can be swapped without touching the controller, the service or the frontend.",
  },
  {
    question: "Why a Mock Provider?",
    answer:
      "Development and tests must run without spending GPU time or depending on an external service, and the whole pipeline (upload → controller → service → history record) stays testable even when the AI is unavailable.",
  },
  {
    question: "Why HuggingFace?",
    answer:
      "It exposes IDM-VTON-class virtual try-on models through a Gradio API, so I could integrate real AI without training or hosting a model myself.",
  },
  {
    question: "Why does HuggingFace not always work?",
    answer:
      "It is an external limitation: the public Spaces (Nymbo/IDM-VTON, John6666/IDM-VTON, yisol/IDM-VTON, levihsu/OOTDiffusion) get removed, renamed or put to sleep, and the gradio_client contract changes — that is the “Could not resolve app config” error seen across all of them. It is not an application bug.",
  },
  {
    question: "Biggest difficulty?",
    answer:
      "Integrating the AI try-on with an external API: file formats, unreachable localhost URLs, the Gradio upload_file/handle_file contract, Space discovery and unstable public Spaces. I solved it step by step until a prediction returned SUCCESS and the generated image was stored in the database.",
  },
  {
    question: "Your personal contribution?",
    answer:
      "All of it: the frontend (Next.js, React, Tailwind, Zustand, GSAP/Lenis), the backend (Node/Express with Controllers → Services → Repositories), the MySQL schema through Prisma, the REST API tested with Postman, and the entire AI try-on module design (upload, provider factory, pipeline, history).",
  },
  {
    question: "Why a layered architecture?",
    answer:
      "Separation of concerns: routes only map URLs, controllers stay thin, services hold the business rules, repositories own data access. Each layer can be tested and changed without breaking the others.",
  },
  {
    question: "What is CRUD?",
    answer:
      "Create, Read, Update, Delete — the four basic operations of a persistent application. Products are fully CRUD; cart, wishlist and orders use the operations they need.",
  },
  {
    question: "What is a REST API?",
    answer:
      "An HTTP API organised around resources and verbs — GET /api/products, POST /api/ai-try-on, DELETE /api/cart/:id — with stateless requests, JSON payloads and standard status codes.",
  },
  {
    question: "Frontend vs backend?",
    answer:
      "The frontend runs in the browser (the React/Next.js interface, state and animations). The backend runs on the server (the Express API): it enforces the rules, reads and writes MySQL through Prisma, and calls the AI provider.",
  },
  {
    question: "Why React?",
    answer:
      "A component model with hooks and a huge ecosystem. The catalog, cart, wishlist and try-on flow are reusable components with predictable state updates.",
  },
  {
    question: "What is Prisma ORM?",
    answer:
      "An Object-Relational Mapper: models and relations are declared in schema.prisma, Prisma generates a typed client and manages migrations, so the code calls prisma.product.findMany() instead of writing SQL strings.",
  },
  {
    question: "With more time, what would you do?",
    answer:
      "A stronger AI provider, cloud deployment, online payment, an analytics dashboard and a mobile application — the architecture already allows each of them.",
  },
  {
    question: "Future of the project?",
    answer:
      "Deploy MONO to the cloud, plug in a more performant try-on provider (Replicate, FASHN AI), add online payments and a statistics dashboard, then reuse the same REST API for a mobile app.",
  },
  {
    question: "Are you satisfied?",
    answer:
      "Yes. The platform is complete — authentication, catalog with CRUD, cart, wishlist, orders and a responsive interface — and the AI try-on pipeline works end to end. The remaining limit is the availability of the external AI service, and the provider layer is already designed to replace it.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   11. FOOTER
   ══════════════════════════════════════════════════════════════════════════ */

export const monoFooter = {
  name: monoIdentity.name,
  tagline: monoIdentity.tagline,
  taglineShort: "Better fit. Smarter shopping.",
  projectType: monoIdentity.projectType,
  school: monoIdentity.school,
  degree: monoIdentity.degree,
  author: monoIdentity.author,
  academicYear: monoIdentity.academicYear,
  stack: monoHeroTech,
} as const;
