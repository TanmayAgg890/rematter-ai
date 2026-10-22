"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Clipboard, 
  AlertCircle
} from "lucide-react"
import { useScanStore } from "@/lib/store/use-scan-store"
import { validateImageUpload } from "@/lib/validation/upload"

// English-only suggestion scenarios reflecting the user requirements
const QUICK_PROMPTS = [
  {
    label: "Plastic Bottle → Self-Watering Planter",
    text: "I have several 2-liter PET beverage bottles and leftover cotton rope. I want to make self-watering indoor herb planters with zero extra budget.",
  },
  {
    label: "Old Jeans → Denim Organizer",
    text: "I have torn denim jeans and cotton scraps. I want to create a hanging wall pocket organizer using basic household scissors.",
  },
  {
    label: "Cardboard Box → Desk Organizer",
    text: "I have corrugated delivery boxes and kraft paper. I want to build a sturdy multi-tier desk organizer with zero extra budget.",
  },
  {
    label: "Glass Jar → Storage Container",
    text: "I have 4 clean glass food jars with intact metal lids. I want to turn them into airtight pantry or workshop storage containers.",
  },
  {
    label: "Wood Scraps → Small Planter",
    text: "I have leftover untreated timber offcuts and small wooden slats. I want to build a simple beginner windowsill planter box.",
  },
]

const WASTE_WORDS_ROW = [
  "RECOVER", "REIMAGINE", "REUSE", "REPURPOSE", "RECYCLE", "UPCYCLE", "CIRCULARITY", "GLASS", "CARDBOARD", "TEXTILE", "WOOD", "ORGANIC", "METALS", "ZERO WASTE"
]

export function InteractiveWasteInput() {
  const router = useRouter()
  const setScanInput = useScanStore((state) => state.setScanInput)

  const [description, setDescription] = React.useState("")
  const [selectedTools, setSelectedTools] = React.useState<"household" | "basic_tools" | "workshop">("household")
  const [selectedBudget, setSelectedBudget] = React.useState<"free" | "under_200" | "200_1000">("free")
  const [selectedGoal, setSelectedGoal] = React.useState<"useful" | "sellable" | "min_effort" | "recycle">("useful")

  // Media attachment states
  const [attachedImage, setAttachedImage] = React.useState<{ file: File; preview: string; name: string } | null>(null)
  const [mediaError, setMediaError] = React.useState<string | null>(null)
  const [pastedStatus, setPastedStatus] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Native Clipboard Ctrl+V pasting listener
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile()
          if (!file) continue

          const val = validateImageUpload(file)
          if (!val.isValid) {
            setMediaError(val.error || "Unsupported image from clipboard")
            return
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            const previewUrl = event.target?.result as string
            setAttachedImage({
              file,
              preview: previewUrl,
              name: `pasted-image-${Date.now().toString().slice(-4)}.png`,
            })
            setMediaError(null)
            setPastedStatus("Image pasted successfully")
            setTimeout(() => setPastedStatus(null), 3000)
          }
          reader.readAsDataURL(file)
          e.preventDefault()
          break
        }
      }
    }

    const currentElem = containerRef.current
    if (currentElem) {
      currentElem.addEventListener("paste", handlePaste)
    }

    return () => {
      if (currentElem) {
        currentElem.removeEventListener("paste", handlePaste)
      }
    }
  }, [])

  const handleImageUpload = (file: File) => {
    setMediaError(null)
    const val = validateImageUpload(file)
    if (!val.isValid) {
      setMediaError(val.error || "Invalid file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setAttachedImage({
        file,
        preview: e.target?.result as string,
        name: file.name,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setAttachedImage(null)
    setMediaError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handlePromptSelect = (promptText: string) => {
    setDescription(promptText)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() && !attachedImage) {
      setMediaError("Please describe your discarded item or attach a photo.")
      return
    }

    setScanInput({
      itemDescription: description,
      imagePreviewUrl: attachedImage?.preview || null,
      consentGiven: true,
    })

    const setPreferences = useScanStore.getState().setPreferences
    setPreferences({
      tools: selectedTools,
      budget: selectedBudget,
      goal: selectedGoal,
    })

    router.push("/scan")
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* 1. Moving Waste-Word Strip on a SINGLE solid mocha/dark-mocha background band */}
      <div 
        aria-hidden="true" 
        className="w-full bg-[#382923] dark:bg-[#2A1E1A] border-y border-white/10 py-3.5 overflow-hidden select-none shadow-inner"
      >
        <div className="animate-waste-drift-left whitespace-nowrap text-xs sm:text-sm font-display font-semibold tracking-widest text-[#DCD6F7]">
          {WASTE_WORDS_ROW.map((word, i) => (
            <span key={i} className="mx-6 sm:mx-10 inline-block opacity-90 hover:opacity-100 transition-opacity">
              {word} <span className="text-[#B9A9EE] mx-1.5">•</span>
            </span>
          ))}
          {WASTE_WORDS_ROW.map((word, i) => (
            <span key={`dup-${i}`} className="mx-6 sm:mx-10 inline-block opacity-90">
              {word} <span className="text-[#B9A9EE] mx-1.5">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Interactive Container directly over Fluid Particles Background */}
      <section 
        id="waste-input" 
        className="relative w-full py-16 px-4 sm:px-6 bg-transparent text-[#F5F3F3] overflow-hidden"
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow & Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mocha-deep/80 border border-lavender-accent/30 backdrop-blur-md mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-lavender-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-platinum-light">
                Multimodal Waste Intelligence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F3F3] mb-3">
              What waste item do you want to solve?
            </h2>
            <p className="text-sm sm:text-base text-platinum leading-relaxed">
              Describe what you have or press <kbd className="px-2 py-0.5 rounded bg-white/10 text-lavender-accent font-mono text-xs border border-white/10">Ctrl+V</kbd> to paste a photo directly from your clipboard.
            </p>
          </div>

          {/* Quick Suggestion Chips (English-Only) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-platinum flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lavender-accent" />
                Quick Inspiration Scenarios:
              </span>
              <span className="text-[11px] text-platinum/70 hidden sm:inline">
                Click any chip to load description
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptSelect(prompt.text)}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-mocha-surface/80 hover:bg-mocha-deep border border-platinum/15 hover:border-lavender-accent/50 text-platinum hover:text-[#F5F3F3] backdrop-blur-md transition-all text-left flex items-center gap-2 focus-ring"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lavender-accent/80" />
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Input Box (Translucent Glassmorphism) */}
          <form 
            onSubmit={handleSubmit}
            className="rounded-2xl bg-[#211D1C]/75 backdrop-blur-md border border-white/15 p-5 sm:p-7 shadow-2xl relative overflow-hidden focus-within:border-lavender-accent/50 transition-colors"
          >
            {/* Notification toast if pasted */}
            {pastedStatus && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mocha text-white font-bold text-xs shadow-lg border border-lavender-accent/40 animate-in fade-in slide-in-from-top-2 duration-200">
                <Clipboard className="w-3.5 h-3.5 text-lavender" />
                <span>{pastedStatus}</span>
              </div>
            )}

            {/* Textarea for Natural Language */}
            <div className="relative mb-5">
              <label htmlFor="waste-description" className="sr-only">
                Waste material description
              </label>
              <textarea
                id="waste-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you have (e.g. '5 glass juice bottles, broken wood pallet, zero budget. Looking for functional home organizers'). You can also press Ctrl+V to paste a photo directly..."
                className="w-full rounded-xl bg-[#171515]/90 border border-white/10 p-4 text-sm sm:text-base text-[#F5F3F3] placeholder:text-platinum/50 focus:outline-none focus:border-lavender-accent/60 focus:ring-1 focus:ring-lavender-accent/40 resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="mb-5 p-3 rounded-xl bg-mocha-deep/60 border border-lavender-accent/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachedImage.preview}
                    alt="Uploaded item"
                    className="w-14 h-14 object-cover rounded-lg border border-white/20"
                  />
                  <div>
                    <span className="text-xs font-semibold text-platinum-light block truncate max-w-[220px]">
                      {attachedImage.name}
                    </span>
                    <span className="text-[11px] text-lavender block">
                      Ready for vision analysis
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg text-platinum hover:text-white hover:bg-white/10 transition-colors focus-ring"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {mediaError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{mediaError}</span>
              </div>
            )}

            {/* Bottom Controls Row: File Picker & Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0])
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-platinum hover:text-[#F5F3F3] transition-colors focus-ring"
                >
                  <ImageIcon className="w-4 h-4 text-lavender-accent" />
                  <span>Choose Photo</span>
                </button>

                <span className="text-[11px] text-platinum/60 hidden sm:inline">
                  or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-lavender-accent font-mono text-[10px]">Ctrl+V</kbd> to paste
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-mocha hover:bg-mocha-hover active:scale-95 text-white font-bold text-sm shadow-md transition-all focus-ring border border-mocha-light/20"
              >
                <span>Analyze & Find Possibilities</span>
                <ArrowRight className="w-4 h-4 text-platinum-light" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
