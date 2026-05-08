import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

export default function Hero() {
  return (
    <Section className="flex min-h-[85vh] items-center justify-center">
      <Container className="flex flex-col items-center text-center">
        {/* Title مع داك الـ Tracking اللي كيعطي Quiet Luxury */}
        <h1 className="max-w-5xl text-6xl font-bold tracking-tighter sm:text-7xl md:text-9xl leading-[0.8] mb-8 uppercase">
          Building <br />
          <span className="text-terminal drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
            Empires
          </span>
          <span className="opacity-20 ml-4">2026.</span>
        </h1>

        {/* Subtitle نقي وموزون */}
        <p className="max-w-xl text-zinc-400 text-lg md:text-xl font-light leading-relaxed mb-10">
          Saad Bouhamou — Full-stack Developer & AI Strategist. Crafting premium
          digital experiences with precision and purpose.
        </p>

        {/* هنا غانستعملو الـ Button ديال Shadcn اللي وريتيني */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-10 bg-white text-black hover:bg-zinc-200 h-12 text-base"
          >
            View Projects
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-10 border-white/10 text-white hover:bg-white/5 h-12 text-base"
          >
            Resume
          </Button>
        </div>
      </Container>
    </Section>
  );
}
