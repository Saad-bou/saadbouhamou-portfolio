import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import MatrixSectionReveal from "@/components/ui/MatrixSectionReveal";

export default function Home() {
  return (
    <main className="relative z-10 min-h-svh">
      <Hero />
      <MatrixSectionReveal className="relative z-10">
        <Projects />
      </MatrixSectionReveal>
    </main>
  );
}
