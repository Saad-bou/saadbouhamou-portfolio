import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CodeBackground from "@/components/layout/CodeBackground"; 

export const metadata = {
  title: "Saad Bouhamou | Full-stack Developer",
  description: "Building the next generation of AI-driven web applications",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body dir="ltr" className={`${GeistSans.className} bg-[#0a0a0a] text-[#fafafa] antialiased`} suppressHydrationWarning>
        <CodeBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}