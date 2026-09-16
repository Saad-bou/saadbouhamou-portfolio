import type { Metadata } from "next";

import { monoIdentity } from "@/data/mono";

export const metadata: Metadata = {
  title: "MONO — Case Study",
  description:
    "MONO — Full-stack e-commerce platform with an AI virtual try-on. Next.js, Node.js, Express, Prisma, MySQL, JWT and a provider-based AI try-on pipeline. Projet de Fin d'Études (PFE) at ISMAGI by Saad Bouhamou — the written report and the defence slide deck ship with the case study.",
  keywords: [
    "MONO",
    "MONO AI Fashion Store",
    "AI Virtual Try-On",
    "E-commerce",
    "Next.js",
    "Node.js",
    "Express",
    "Prisma",
    "MySQL",
    "JWT",
    "PFE ISMAGI",
    "Projet de Fin d'Études",
    "Saad Bouhamou",
  ],
  alternates: { canonical: "/mono" },
  openGraph: {
    type: "article",
    url: "/mono",
    title: "MONO — Full-Stack E-commerce Platform + AI Virtual Try-On",
    description:
      "Case study: a full-stack e-commerce platform with an AI virtual try-on, from the Next.js interface to the provider-based try-on pipeline.",
    images: [
      {
        url: "/projects/mono/home.webp",
        width: 1918,
        height: 878,
        alt: "MONO storefront homepage — “Redefining Minimalist Luxury”",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONO — Full-Stack E-commerce Platform + AI Virtual Try-On",
    description:
      "Case study: a full-stack e-commerce platform with an AI virtual try-on, from the Next.js interface to the provider-based try-on pipeline.",
    images: ["/projects/mono/home.webp"],
  },
  authors: [{ name: monoIdentity.author }],
  creator: monoIdentity.author,
};

export default function MonoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
