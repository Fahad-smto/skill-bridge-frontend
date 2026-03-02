import HeroCarousel from "@/components/ui/HeroCarousel";
import "./globals.css";
import Navbar from '@/components/shared/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <HeroCarousel></HeroCarousel>
        {children}

      </body>
    </html>
  )
}