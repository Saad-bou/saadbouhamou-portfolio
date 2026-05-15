"use client";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import HeroText from "@/components/hero/HeroText";
import ScannedPhoto from "@/components/hero/ScannedPhoto";
import { useScanAnimation } from "@/hooks/useScanAnimation";

export default function Hero() {
  const { scanComplete, scanStarted } = useScanAnimation();

  return (
    <Section className="flex items-center justify-center overflow-hidden relative min-h-[100svh] lg:min-h-[100dvh]">
      {/* Glow — محسن و مركّز مزيان */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal/5 blur-[120px] sm:h-[600px] sm:w-[600px]" />

      <Container className="relative z-10">
        {/* Mobile-first: الصورة فوق، والنص تحت. على lg+ كتنقلب */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12">
          <div className="order-2 lg:order-1">
            <HeroText />
          </div>
          <div className="order-1 lg:order-2">
            <ScannedPhoto scanComplete={scanComplete} scanStarted={scanStarted} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
