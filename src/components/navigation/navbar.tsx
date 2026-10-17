"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Recycle, Menu, X, ArrowRight, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme/theme-toggle"

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

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
          isScrolled
            ? "bg-white/95 dark:bg-[#0B1713]/95 backdrop-blur-md border-borderLightSubtle dark:border-white/10 shadow-sm"
            : "bg-white/80 dark:bg-[#102A22]/90 backdrop-blur-sm border-borderLightSubtle/60 dark:border-white/10"
        }`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight text-textLightPrimary dark:text-textDarkPrimary focus-ring rounded-lg px-1"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-primary/15 dark:bg-emerald-primary/20 flex items-center justify-center text-emerald-primary">
              <Recycle className="w-5 h-5 text-emerald-primary" />
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
                  className={`transition-colors duration-150 focus-ring rounded-md px-1 py-0.5 ${
                    active 
                      ? "text-emerald-primary font-semibold" 
                      : "text-textLightSecondary dark:text-textDarkSecondary hover:text-emerald-primary dark:hover:text-textDarkPrimary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Action CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-primary text-forest-950 text-sm font-bold hover:bg-emerald-400 active:scale-95 transition-all shadow-sm focus-ring"
            >
              <Sparkles className="w-4 h-4 text-forest-950" />
              <span>Start a Waste Scan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-textLightPrimary dark:text-textDarkPrimary hover:bg-black/5 dark:hover:bg-white/10 focus-ring"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-forest-surface text-textLightPrimary dark:text-textDarkPrimary border-b border-borderLightSubtle dark:border-white/10 px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-2 text-textLightSecondary dark:text-textDarkSecondary hover:text-emerald-primary border-b border-borderLightSubtle/50 dark:border-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/scan"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-primary text-forest-950 font-bold shadow-sm active:scale-95 transition-all"
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

      {/* Trust Demo Mode Indicator */}
      <div className="bg-[#071410] border-b border-white/10 py-1.5 px-4 text-center text-xs text-[#C0CEC5] flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
        <span>
          <strong className="text-emerald-light">Deterministic Decision Support:</strong> Ground-truth safety gates & verified circular pathways.
        </span>
      </div>
    </>
  )
}
