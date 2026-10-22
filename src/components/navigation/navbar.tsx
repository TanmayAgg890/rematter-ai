"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Recycle, Menu, X, ArrowRight } from "lucide-react"
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

  // "How It Works" removed from primary navigation per user requirement
  const navLinks = [
    { label: "Explore Ideas", href: "/explore" },
    { label: "Recycling Hub", href: "/recycling" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
          isScrolled
            ? "bg-[#171515]/95 dark:bg-[#171515]/95 backdrop-blur-md border-white/10 shadow-sm"
            : "bg-[#171515]/80 dark:bg-[#211D1C]/80 backdrop-blur-sm border-white/10"
        }`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight text-textLightPrimary dark:text-textDarkPrimary focus-ring rounded-lg px-1"
          >
            <div className="w-8 h-8 rounded-full bg-mocha-deep dark:bg-mocha/30 border border-mocha/40 flex items-center justify-center text-lavender-accent">
              <Recycle className="w-5 h-5 text-lavender-accent" />
            </div>
            <span>ReMatter <span className="text-lavender-accent font-semibold">AI</span></span>
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
                      ? "text-lavender font-semibold border-b border-lavender-accent" 
                      : "text-textLightSecondary dark:text-textDarkSecondary hover:text-lavender dark:hover:text-lavender"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action + Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Primary Action Button */}
            <Link
              href="/scan"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-semibold transition-all shadow-sm focus-ring border border-mocha-light/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-lavender" />
              <span>Start a Waste Scan</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary hover:bg-white/5 focus-ring"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 top-16 z-40 bg-[#171515]/95 backdrop-blur-md md:hidden border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col p-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-base font-medium rounded-lg text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/scan"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-mocha text-white text-sm font-semibold shadow-md focus-ring"
              >
                <Sparkles className="w-4 h-4 text-lavender" />
                <span>Start a Waste Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
