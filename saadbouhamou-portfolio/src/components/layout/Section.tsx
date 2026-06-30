import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section 
      id={id} 
      // زدنا pt-24 باش ندفعو المحتوى لتحت بجهد الـ Navbar
      // وزدنا flex-col و items-center باش نضمنوا التوازن
      className={cn("reveal-section relative py-20 md:py-32 pt-28 md:pt-40", className)}
    >
      {children}
    </section>
  );
}
