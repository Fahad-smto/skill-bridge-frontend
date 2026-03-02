import { ThemeProvider } from 'next-themes'
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"    
          enableSystem={false}    
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}