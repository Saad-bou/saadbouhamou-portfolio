"use client";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import HeroText from "@/components/hero/HeroText";
import ScannedPhoto from "@/components/hero/ScannedPhoto";
import { useScanAnimation } from "@/hooks/useScanAnimation";

export default function Hero() {
  const { scanComplete, scanStarted } = useScanAnimation();

  return (
    <Section className="min-h-[95vh] flex items-center justify-center overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terminal/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <HeroText />
          <ScannedPhoto
            scanComplete={scanComplete}
            scanStarted={scanStarted}
          />
        </div>
      </Container>
    </Section>
  );
}
