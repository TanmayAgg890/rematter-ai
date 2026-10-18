import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { RematterGuide } from "@/components/assistant/rematter-guide"
import { GlobalParticlesBackground } from "@/components/ui/global-particles-background"

export const metadata: Metadata = {
  title: "ReMatter AI — Your waste has another purpose",
  description:
    "Discover what you can realistically reuse, create, repurpose, or recycle with AI. Personalized decision support grounded in safety and feasibility.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('rematter-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0B1713] dark:bg-[#0B1713] text-textDarkPrimary antialiased selection:bg-emerald-primary/30 selection:text-white">
        {/* Global ambient fluid particles — fixed background, pointer-events disabled */}
        <GlobalParticlesBackground />
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <RematterGuide />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

