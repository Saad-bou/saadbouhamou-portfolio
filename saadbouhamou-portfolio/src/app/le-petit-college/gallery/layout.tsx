import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Kit Gallery — Le Petit Collège",
  description:
    "Full-resolution design system and UI kit frames for Le Petit Collège — a case study by Saad Bouhamou.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
