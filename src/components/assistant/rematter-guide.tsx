"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  Compass, 
  HelpCircle, 
  Recycle, 
  ShieldCheck, 
  Layers,
  ChevronDown,
  RotateCcw
} from "lucide-react"

interface Message {
  id: string
  sender: "assistant" | "user"
  text: string
  action?: {
    label: string
    href: string
  }
}

export function RematterGuide() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputMessage, setInputMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "greeting",
      sender: "assistant",
      text: "Hi! I can help you understand ReMatter AI, assess a material, and explore suitable reuse or recycling options. Where would you like to start?",
    },
  ])

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll inside chat
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Context-specific quick actions depending on pathname
  const quickActions = React.useMemo(() => {
    switch (pathname) {
      case "/scan":
        return [
          { label: "Material Guidelines", query: "What materials can I scan safely?" },
          { label: "Photo Tips", query: "How should I photograph my waste item?" },
          { label: "Explore Gallery", href: "/explore" },
        ]
      case "/assessment":
        return [
          { label: "How Detection Works", query: "How does AI detect materials and conditions?" },
          { label: "Safety Flags", query: "What triggers a deterministic safety rejection?" },
          { label: "Change Item", href: "/scan" },
        ]
      case "/preferences":
        return [
          { label: "Why specify tools?", query: "Why does ReMatter need my tools and budget?" },
          { label: "Feasibility weights", query: "How are feasibility factors weighted?" },
        ]
      case "/results":
        return [
          { label: "Explain Feasibility", query: "How is the 0-100 feasibility score calculated?" },
          { label: "Find Recyclers", href: "/recycling" },
          { label: "Scan Another Item", href: "/scan" },
        ]
      case "/recycling":
        return [
          { label: "CPCB Verification", query: "How are recycling facilities verified?" },
          { label: "Hazardous E-Waste", query: "Where do swollen batteries or electronics go?" },
          { label: "Scan Waste Item", href: "/scan" },
        ]
      case "/dashboard":
        return [
          { label: "Saved Ideas Help", query: "How do I resume or complete a saved project?" },
          { label: "Start New Scan", href: "/scan" },
          { label: "Browse Materials", href: "/explore" },
        ]
      default:
        // Homepage and other routes
        return [
          { label: "Start a Waste Scan", href: "/scan" },
          { label: "Explore Materials", href: "/explore" },
          { label: "How Feasibility Works", query: "How does the feasibility formula work?" },
          { label: "Verified Recyclers", href: "/recycling" },
        ]
    }
  }, [pathname])

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || isLoading) return

    const userMsgId = `user-${Date.now()}`
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }])
    setInputMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          pathname,
        }),
      })

      const data = await res.json()
      if (data.ok && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: "assistant",
            text: data.data.reply,
            action: data.data.suggestedAction || undefined,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: "I can help you navigate ReMatter AI. Try starting a waste scan or exploring materials.",
            action: { label: "Start a Waste Scan", href: "/scan" },
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "I'm currently running in offline guide mode. You can begin a scan or view verified recyclers below.",
          action: { label: "Go to Waste Scan", href: "/scan" },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = (action: { label: string; href?: string; query?: string }) => {
    if (action.href) {
      router.push(action.href)
      setIsOpen(false)
    } else if (action.query) {
      handleSendMessage(action.query)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: "greeting",
        sender: "assistant",
        text: "Hi! I can help you understand ReMatter AI, assess a material, and explore suitable reuse or recycling options. Where would you like to start?",
      },
    ])
  }

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <aside aria-label="ReMatter AI Assistant Launcher" className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open ReMatter Guide Assistant"
            className="group flex items-center gap-2.5 h-12 pl-4 pr-5 rounded-full bg-emerald-primary text-forest-950 font-bold text-xs tracking-wide shadow-xl hover:shadow-2xl hover:bg-emerald-400 active:scale-95 transition-all duration-200 focus-ring"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-900 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-950"></span>
            </span>
            <Sparkles className="w-4 h-4 text-forest-950" />
            <span className="hidden sm:inline">ReMatter Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>
        </aside>
      )}

      {/* Floating Panel / Drawer */}
      {isOpen && (
        <aside
          role="region"
          aria-label="ReMatter Guide Assistant Panel"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[85vh] h-[580px] flex flex-col rounded-2xl bg-white dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-ivory-soft dark:bg-forest-elevated border-b border-borderLightSubtle dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-primary/15 dark:bg-emerald-primary/20 flex items-center justify-center text-emerald-primary">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-textLightPrimary dark:text-textDarkPrimary">
                    ReMatter Guide
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-primary" />
                </div>
                <p className="text-[10px] text-textLightSecondary dark:text-textDarkSecondary">
                  AI Contextual Navigator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-full text-textLightSecondary dark:text-textDarkSecondary hover:text-emerald-primary transition-colors focus-ring"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close guide"
                className="p-1.5 rounded-full text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary transition-colors focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-primary text-forest-950 font-medium rounded-br-none"
                      : "bg-ivory-warm dark:bg-forest-elevated/70 text-textLightPrimary dark:text-textDarkPrimary border border-borderLightSubtle/80 dark:border-white/5 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* 1-Click Action Button if provided */}
                {m.action && (
                  <button
                    type="button"
                    onClick={() => {
                      if (m.action?.href) {
                        router.push(m.action.href)
                        setIsOpen(false)
                      }
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-primary/10 dark:bg-emerald-primary/20 text-emerald-primary hover:bg-emerald-primary hover:text-forest-950 text-[11px] font-semibold border border-emerald-primary/30 transition-all focus-ring"
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-textLightSecondary dark:text-textDarkSecondary text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-primary animate-pulse" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Actions */}
          <div className="px-4 py-2 bg-ivory-warm/60 dark:bg-forest-elevated/30 border-t border-borderLightSubtle/60 dark:border-white/5 flex flex-wrap gap-1.5">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleActionClick(action)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="p-3 bg-white dark:bg-forest-surface border-t border-borderLightSubtle dark:border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about ReMatter..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-full bg-ivory-warm dark:bg-forest-elevated border border-borderLightSubtle dark:border-white/10 text-textLightPrimary dark:text-textDarkPrimary placeholder:text-textLightSecondary/60 dark:placeholder:text-textDarkSecondary/60 focus-ring"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-full bg-emerald-primary text-forest-950 flex items-center justify-center hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-primary transition-colors focus-ring"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </aside>
      )}
    </>
  )
}
