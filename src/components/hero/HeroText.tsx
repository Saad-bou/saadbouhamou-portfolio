import { Button } from "@/components/ui/button";

export default function HeroText() {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-1">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-6 uppercase">
        Building <br />
        <span className="text-terminal drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
          Empires
        </span>
        <span className="opacity-20 ml-2 sm:ml-4 inline-block">2026.</span>
      </h1>

      <p className="max-w-md text-zinc-400 text-base sm:text-lg font-light leading-relaxed mb-8">
        Saad Bouhamou — Full-stack Developer & AI Strategist. Crafting premium
        digital experiences with precision and purpose.
      </p>

      <div className="flex flex-wrap justify-center lg:justify-start gap-4 relative z-10">
        <Button
          size="lg"
          className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 h-11 transition-all"
        >
          View Projects
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 border-white/10 text-white hover:bg-white/5 h-11"
        >
          Resume
        </Button>
      </div>
    </div>
  );
}
