import { Button } from "@/components/ui/button";

export default function HeroText() {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-1">
      <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-6 uppercase [@media(min-width:1800px)]:text-[8.5vw] [@media(min-width:1800px)]:leading-[0.85] [@media(min-width:1800px)]:mb-[3vw]">
        <span className="sr-only">Saad Bouhamou — Full-Stack Developer Building Empires</span>
        Building <br />
        <span className="text-terminal drop-shadow-[0_0_15px_rgba(0,255,65,0.3)]">
          Empires
        </span>
        <br className="block xs:hidden" />
        <span className="opacity-20 ml-2 sm:ml-4 inline-block">2026.</span>
      </h1>

      <p className="max-w-md text-zinc-400 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 [@media(min-width:1800px)]:max-w-[45vw] [@media(min-width:1800px)]:text-[1.5vw] [@media(min-width:1800px)]:leading-relaxed [@media(min-width:1800px)]:mb-[4vw]">
        Saad Bouhamou — Full-stack Developer & AI Strategist. Crafting premium
        digital experiences with precision and purpose.
      </p>

      <div className="flex flex-wrap justify-center lg:justify-start gap-4 relative z-10">
        <Button
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector('#projects');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
          className="rounded-full px-6 sm:px-8 bg-white text-black hover:bg-zinc-200 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 active:scale-95 [@media(min-width:1800px)]:px-[3vw] [@media(min-width:1800px)]:h-[4vw] [@media(min-width:1800px)]:text-[1.2vw]"
        >
          View Projects
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-6 sm:px-8 border-white/10 text-white hover:bg-white/5 h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 active:scale-95 [@media(min-width:1800px)]:px-[3vw] [@media(min-width:1800px)]:h-[4vw] [@media(min-width:1800px)]:text-[1.2vw]"
        >
          <a href="/CV_Saad_Bouhamou.dev.pdf" target="_blank" rel="noopener noreferrer" title="Download Saad Bouhamou Resume - Full-Stack Developer & AI Strategist">
            Resume
          </a>
        </Button>
      </div>
    </div>
  );
}
