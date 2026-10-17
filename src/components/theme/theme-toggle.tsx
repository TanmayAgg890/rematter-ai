"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

interface ThemeToggleProps {
  className?: string
  compact?: boolean
}

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        aria-hidden="true" 
        className={`w-9 h-9 rounded-full bg-forest-800/40 border border-white/10 ${className}`} 
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 border ${
        isDark
          ? "bg-forest-800/70 border-white/15 text-emerald-light hover:bg-forest-700/80 hover:text-white"
          : "bg-ivory-200 border-borderLightSubtle text-forest hover:bg-white hover:text-emerald-primary"
      } ${
        compact 
          ? "w-8 h-8" 
          : "w-9 h-9"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-emerald-primary" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-forest" />
      )}
    </button>
  )
}
