import type { Metadata } from "next";

import { wimaAssets, wimaIdentity } from "@/data/wima";

export const metadata: Metadata = {
  title: "WIMA CAR — Case Study",
  description:
    "WIMA CAR case study — car rental, Rabat. A multilingual Next.js platform with a structured vehicle catalogue, technical SEO foundation and local search presence: 5 languages, 190 URLs submitted, 175 organic clicks and 5,340 impressions in the first period after launch. Web development, SEO and local acquisition by Saad Bouhamou.",
  keywords: [
    "WIMA CAR",
    "Location voiture Rabat",
    "Car rental Rabat",
    "location de voiture Maroc",
    "Technical SEO",
    "Local SEO",
    "Google Business Profile",
    "Multilingual website",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Search Console",
    "hreflang",
    "Schema.org",
    "Car rental website",
    "Saad Bouhamou",
  ],
  alternates: { canonical: "/wima-car" },
  openGraph: {
    type: "article",
    url: "/wima-car",
    title: "WIMA CAR — Car-rental digital transformation, SEO & local acquisition",
    description:
      "Case study: from a limited digital presence to a multilingual, search-ready car rental platform — Next.js, technical SEO, local search and measurable organic growth.",
    images: [
      {
        url: wimaAssets.cover,
        width: 1600,
        height: 1000,
        alt: "WIMA CAR case-study cover — brand wordmark, launch metrics from Google Search Console",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WIMA CAR — Car-rental digital transformation, SEO & local acquisition",
    description:
      "Case study: a multilingual Next.js car rental platform, technical SEO foundation and local search presence for WIMA CAR, Rabat.",
    images: [wimaAssets.cover],
  },
  authors: [{ name: "Saad Bouhamou" }],
  creator: "Saad Bouhamou",
  other: { "case-study-client": wimaIdentity.client },
};

export default function WimaCarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
