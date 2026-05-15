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
    description: 'Building the next generation of AI-driven web applications.',
    siteName: 'Saad Bouhamou',
    images: [{ url: '/saadbouhamou.png', width: 1200, height: 630, alt: 'Saad Bouhamou' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saad Bouhamou — Full-Stack Developer',
    description: 'Building the next generation of AI-driven web applications.',
    images: ['/saadbouhamou.png'],
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

// JSON-LD structured data — SEO boost كبير
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Saad Bouhamou',
  url: SITE_URL,
  jobTitle: 'Full-Stack Developer',
  image: `${SITE_URL}/saadbouhamou.png`,
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* interactive-widget باش Android Chrome يعاود يحسب الـ viewport ملي الكيبورد تطلع */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
      </head>
      <body
        dir="ltr"
        className={`${GeistSans.className} bg-black text-[#fafafa] antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
