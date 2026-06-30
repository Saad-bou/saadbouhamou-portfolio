import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import AboutSystem from "@/sections/AboutSystem";
import ContactSection from "@/sections/ContactSection";

export default function Home() {
  return (
    <main className="relative z-10 min-h-svh">
      <Hero />
      <Projects />
      <AboutSystem />
      <ContactSection />
    </main>
  );
}
