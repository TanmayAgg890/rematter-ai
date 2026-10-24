"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  HelpCircle, 
  Recycle, 
  ShieldCheck, 
  ChevronDown,
  RotateCcw,
  Languages
} from "lucide-react"
import { RematterGuideCharacter } from "./rematter-guide-character"

interface Message {
  id: string
  sender: "assistant" | "user"
  text: string
  fullText?: string
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
      text: "Hi! I'm your ReMatter Guide. Ask me anything in English, हिन्दी, or Hinglish — about assessing waste, calculating feasibility, or finding certified recyclers.",
    },
  ])

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll inside chat
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isLoading])

  // Context-specific quick actions depending on pathname + multilingual questions
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
      default:
        // Homepage and general
        return [
          { label: "How Feasibility Works", query: "How does the feasibility formula S = 100 * sum(w_f * s_f) work?" },
          { label: "पुरानी बोतल से क्या बनाएं? (हिन्दी)", query: "पुरानी खाली कांच की बोतलों से क्या बना सकते हैं?" },
          { label: "Jeans Upcycle (Hinglish)", query: "Mere paas purani jeans hai, zero budget DIY idea batao" },
          { label: "Verified Recyclers", href: "/recycling" },
        ]
    }
  }, [pathname])

  // Word-by-word reveal for incoming assistant messages
  const streamReveal = (messageId: string, fullText: string, action?: { label: string; href: string }) => {
    const words = fullText.split(" ")
    let currentIdx = 0

    // Set initial with first word
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, text: words[0] || "" } : m))
    )

    const interval = setInterval(() => {
      currentIdx++
      if (currentIdx < words.length) {
        const partial = words.slice(0, currentIdx + 1).join(" ")
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text: partial } : m))
        )
      } else {
        clearInterval(interval)
        if (action) {
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, action } : m))
          )
        }
      }
    }, 28)
  }

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
      const assistantMsgId = `assistant-${Date.now()}`

      if (data.ok && data.data) {
        const replyText = data.data.reply
        const suggestedAction = data.data.suggestedAction || undefined

        // Insert message shell then stream words
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            sender: "assistant",
            text: "",
            fullText: replyText,
          },
        ])

        streamReveal(assistantMsgId, replyText, suggestedAction)
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
          text: "I'm currently running in offline guide mode. You can begin a waste scan or view verified recyclers below.",
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

  const handlePrimaryScanAction = () => {
    if (pathname === "/") {
      setIsOpen(false)
      const el = document.getElementById("waste-input")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        const textarea = document.getElementById("waste-description")
        setTimeout(() => textarea?.focus(), 500)
      } else {
        router.push("/scan")
      }
    } else {
      router.push("/scan")
      setIsOpen(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: "greeting",
        sender: "assistant",
        text: "Hi! I'm your ReMatter Guide. Ask me anything in English, हिन्दी, or Hinglish — about assessing waste, calculating feasibility, or finding certified recyclers.",
      },
    ])
  }

  return (
    <>
      {/* Floating launcher trigger with high-fidelity animated Character */}
      {!isOpen && (
        <aside aria-label="ReMatter AI Assistant Launcher" className="fixed bottom-6 right-6 z-40">
          <RematterGuideCharacter
            state={isLoading ? "thinking" : "idle"}
            size="md"
            onClick={() => setIsOpen(true)}
            showPillLabel={true}
          />
        </aside>
      )}

      {/* Floating Panel / Drawer */}
      {isOpen && (
        <aside
          role="region"
          aria-label="ReMatter Guide Assistant Panel"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] h-[600px] flex flex-col rounded-2xl bg-[#211D1C] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header with mini Robot character */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#171515] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <RematterGuideCharacter
                state={isLoading ? "thinking" : "speaking"}
                size="sm"
                showPillLabel={false}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-textLightPrimary dark:text-[#F4F8F5]">
                    ReMatter Guide
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-lavender-accent animate-pulse" />
                </div>
                <p className="text-[10px] text-textLightSecondary dark:text-platinum">
                  Multilingual Sustainability Companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-full text-textLightSecondary dark:text-platinum hover:text-lavender-accent transition-colors focus-ring"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close guide"
                className="p-1.5 rounded-full text-textLightSecondary dark:text-platinum hover:text-white transition-colors focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persistent Highlighted Call-To-Action Banner */}
          <div className="px-3.5 py-2 bg-mocha-deep/60 border-b border-lavender-accent/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-lavender-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Have an item to evaluate?</span>
            </div>
            <button
              type="button"
              onClick={handlePrimaryScanAction}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mocha hover:bg-mocha-hover active:scale-95 text-white font-bold text-[11px] transition-all shadow-sm focus-ring border border-mocha-light/20"
            >
              <span>Start a Waste Scan</span>
              <ArrowRight className="w-3 h-3 text-platinum-light" />
            </button>
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
                      ? "bg-mocha text-white font-medium rounded-br-none border border-mocha-light/30 shadow-sm"
                      : "bg-[#211D1C] text-platinum-light border border-white/10 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
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
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mocha-deep/80 text-lavender hover:bg-mocha hover:text-white text-[11px] font-bold border border-lavender-accent/30 transition-all focus-ring shadow-sm"
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-platinum text-xs py-2">
                <span className="w-2 h-2 rounded-full bg-lavender-accent animate-pulse" />
                <span>Thinking in English, हिन्दी & Hinglish...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context & Multilingual Actions */}
          <div className="px-3.5 py-2 bg-[#171515] border-t border-white/10 flex flex-wrap gap-1.5">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleActionClick(action)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#211D1C] border border-white/10 text-platinum hover:text-white hover:border-lavender-accent/50 transition-colors focus-ring"
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
            className="p-3 bg-[#211D1C] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask in English, हिन्दी, or Hinglish..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-full bg-[#171515] border border-white/10 text-platinum-light placeholder:text-platinum/50 focus-ring"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-full bg-mocha hover:bg-mocha-hover text-white flex items-center justify-center disabled:opacity-40 transition-colors focus-ring"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </aside>
      )}
    </>
  )
}
