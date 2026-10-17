"use client"

import * as React from "react"

export type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to "dark" for first-time visitors as strictly requested in the master prompt
  const [theme, setThemeState] = React.useState<Theme>("dark")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("rematter-theme") as Theme | null
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme)
        applyTheme(savedTheme)
      } else {
        // First-time visitor default: dark mode
        setThemeState("dark")
        applyTheme("dark")
      }
    } catch {
      // localStorage may fail in restricted privacy mode
      setThemeState("dark")
      applyTheme("dark")
    }
    setMounted(true)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.remove("dark")
      root.classList.add("light")
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem("rematter-theme", newTheme)
    } catch {}
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
