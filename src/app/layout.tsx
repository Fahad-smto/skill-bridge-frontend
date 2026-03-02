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

        {children}

      </body>
    </html>
  )
}