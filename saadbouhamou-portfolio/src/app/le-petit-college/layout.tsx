import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Petit Collège — Case Study",
  description:
    "Deep dive into AI-assisted cinematic video production and custom web architecture for Le Petit Collège, a prestigious educational institution in Rabat since 1981.",
};

export default function LePetitCollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
