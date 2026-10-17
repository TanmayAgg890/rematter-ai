import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"

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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ivory text-forest antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
