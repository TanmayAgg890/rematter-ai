"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Recycle, Menu, X, ArrowRight, ShieldCheck } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Explore Ideas", href: "/explore" },
    { label: "Recycling Hub", href: "/recycling" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  const isHome = pathname === "/"

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${
          isScrolled || !isHome
            ? "bg-forest-900/95 backdrop-blur-md border-b border-white/10 text-textLight shadow-sm"
            : "bg-forest-800/90 backdrop-blur-sm text-textLight border-b border-white/10"
        }`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-primary rounded-lg px-1 text-textLight"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-primary/20 flex items-center justify-center text-emerald-primary">
              <Recycle className="w-5 h-5 text-emerald-light" />
            </div>
            <span>ReMatter <span className="text-emerald-primary font-semibold">AI</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors duration-150 focus:outline-none focus:underline ${
                    active 
                      ? "text-emerald-light font-semibold" 
                      : "text-textLightMuted hover:text-textLight"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-emerald-primary text-forest-950 text-sm font-bold hover:bg-emerald-400 transition-all hover:translate-y-[-1px] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-primary"
            >
              <Sparkles className="w-4 h-4 text-forest-950" />
              <span>Start a Waste Scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-textLight hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-forest-900 text-textLight border-b border-white/10 px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-2 text-textLightMuted hover:text-emerald-light border-b border-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/scan"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-pill bg-emerald-primary text-forest-950 font-bold shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-forest-950" />
                  <span>Start a Waste Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Demo Mode Indicator */}
      <div className="bg-forest-950 border-b border-white/10 py-1.5 px-4 text-center text-xs text-textLightMuted flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
        <span>
          <strong className="text-emerald-light">Demo Mode Active:</strong> Verified sample fixtures available for instant testing.
        </span>
      </div>
    </>
  )
}
