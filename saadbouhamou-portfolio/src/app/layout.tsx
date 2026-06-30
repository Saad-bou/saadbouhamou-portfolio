import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CodeBackground from "@/components/layout/CodeBackground";
import SmoothScroll from "@/components/layout/SmoothScroll";

import AIChatAgent from "@/components/ui/AIChatAgent";

const SITE_URL = 'https://saadbouhamou.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Saad Bouhamou — Full-Stack Developer & AI Strategist',
    template: '%s | Saad Bouhamou',
  },
  description:
    'Saad Bouhamou — Full-stack Developer from Morocco. Building AI-driven, high-performance web experiences with Next.js, React & GSAP.',
  keywords: [
    'Saad Bouhamou', 'Full Stack Developer Morocco', 'Next.js Developer',
    'AI Web Apps', 'React Developer Rabat', 'Portfolio', 'Web Developer Morocco',
  ],
  authors: [{ name: 'Saad Bouhamou', url: SITE_URL }],
  creator: 'Saad Bouhamou',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Saad Bouhamou — Full-Stack Developer & AI Strategist',
    // Harmonized with the global description for consistent brand messaging
    description:
      'Saad Bouhamou — Full-stack Developer from Morocco. Building AI-driven, high-performance web experiences with Next.js, React & GSAP.',
    siteName: 'Saad Bouhamou',
    images: [{ url: '/saadbouhamou.webp', width: 1086, height: 1448, alt: 'Saad Bouhamou' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saad Bouhamou — Full-Stack Developer',
    description:
      'Saad Bouhamou — Full-stack Developer from Morocco. Building AI-driven, high-performance web experiences with Next.js, React & GSAP.',
    images: ['/saadbouhamou.webp'],
  },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',          // ضروري لـ dvh على iOS notch
  themeColor: '#000000',
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Saad Bouhamou',
  url: SITE_URL,
  jobTitle: 'Full-Stack Developer',
  image: `${SITE_URL}/saadbouhamou.webp`,
  sameAs: [
    'https://github.com/Saad-bou',
    'https://www.linkedin.com/in/saad-bouhamou-59278a3bb',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Saad Bouhamou',
  url: SITE_URL,
  description:
    'Portfolio of Saad Bouhamou — Full-Stack Developer & AI Strategist building premium web experiences.',
  author: {
    '@type': 'Person',
    name: 'Saad Bouhamou',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* interactive-widget باش Android Chrome يعاود يحسب الـ viewport ملي الكيبورد تطلع */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        {/* Preload LCP hero image — browser يبدأ يحمّلها قبل JS يتحمّل */}
        <link rel="preload" as="image" href="/saadbouhamou.webp" fetchPriority="high" />
      </head>
      <body
        dir="ltr"
        className={`${GeistSans.className} bg-black text-[#fafafa] antialiased`}
        suppressHydrationWarning
      >
        {/* Inject both Person + WebSite schemas as an array for richer structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema]) }}
        />
        <SmoothScroll>
          <CodeBackground />
          <Navbar />
          {children}
          <AIChatAgent />
        </SmoothScroll>
      </body>
    </html>
  );
}
