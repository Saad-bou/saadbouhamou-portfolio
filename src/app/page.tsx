import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="py-24">
        <Container>
          <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
            Building <span className="text-blue-500">Empire</span> 2026.
          </h1>
          <p className="mt-8 text-zinc-400 max-w-lg text-lg sm:text-xl">
            Saad Bouhamou — Full-stack Developer & AI Strategist. crafting premium digital experiences with precision and purpose.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition-all">
              View Projects
            </button>
            <button className="rounded-full border border-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-all">
              Resume
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}
