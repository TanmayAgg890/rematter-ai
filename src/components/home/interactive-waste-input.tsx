"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  X, 
  Wrench, 
  Coins, 
  Target, 
  Check, 
  Clipboard, 
  Languages,
  AlertCircle
} from "lucide-react"
import { useScanStore } from "@/lib/store/use-scan-store"

const QUICK_PROMPTS = [
  {
    label: "Plastic bottles → herb planters",
    text: "I have several 2-liter PET beverage bottles and leftover cotton rope. I want to make self-watering indoor herb planters with zero extra budget.",
  },
  {
    label: "Cardboard boxes → desk organizer",
    text: "I have lots of corrugated Amazon delivery boxes and packing foam. I want to build a desk organizer or storage drawer with zero budget.",
  },
  {
    label: "Old clothes → no-sew bag",
    text: "I have 3 old cotton t-shirts and torn denim jeans. How can I make a sturdy shopping bag or floor mat without a sewing machine?",
  },
  {
    label: "Glass jars + wood scraps → spice rack",
    text: "I have 4 clean glass jars and some wooden pallet offcuts. I want to make a zero-budget kitchen spice rack using simple hand tools.",
  },
  {
    label: "What can I make with e-waste?",
    text: "I have an old broken laptop, some USB cables, and keyboard parts. What can I safely repurpose or recycle from these electronics?",
  },
  {
    label: "Wood scraps → garden planter",
    text: "I have leftover untreated pine offcuts and some scrap plywood. What's the best beginner-friendly outdoor planter I can build?",
  },
]

const WASTE_WORDS_ROW_1 = [
  "REUSE", "REPURPOSE", "RECYCLE", "UPCYCLE", "CIRCULARITY", "GLASS", "CARDBOARD", "TEXTILE", "ORGANIC", "METALS", "RECOVER", "REIMAGINE"
]

const WASTE_WORDS_ROW_2 = [
  "PLASTICS", "E-WASTE", "BIOMASS", "WOOD", "ZERO WASTE", "UPCYCLE", "RESPONSIBLE", "REPAIR", "DIVERSIFY", "INNOVATE", "SUSTAINABLE", "REMATTER"
]

export function InteractiveWasteInput() {
  const router = useRouter()
  const setScanInput = useScanStore((state) => state.setScanInput)
  const setPreferences = useScanStore((state) => state.setPreferences)

  const [description, setDescription] = React.useState("")
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [mediaType, setMediaType] = React.useState<"image" | "video_frame" | "document" | null>(null)
  const [mediaNote, setMediaNote] = React.useState<string | null>(null)
  const [pastedStatus, setPastedStatus] = React.useState<string | null>(null)
  const [isProcessingMedia, setIsProcessingMedia] = React.useState(false)
  const [selectedTools, setSelectedTools] = React.useState<"household" | "basic_tools" | "workshop">("household")
  const [selectedBudget, setSelectedBudget] = React.useState<"free" | "under_200" | "flexible">("free")
  const [selectedGoal, setSelectedGoal] = React.useState<"useful" | "min_effort" | "sellable">("useful")

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const videoInputRef = React.useRef<HTMLInputElement>(null)
  const docInputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Listen for Clipboard Paste (Ctrl+V) anywhere within the container
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return
      const items = e.clipboardData.items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) {
            e.preventDefault()
            processImageFile(file, "Pasted from clipboard")
            break
          }
        }
      }
    }

    const node = containerRef.current
    if (node) {
      node.addEventListener("paste", handlePaste)
      return () => node.removeEventListener("paste", handlePaste)
    }
  }, [])

  const processImageFile = (file: File, sourceNote = "Attached photo") => {
    setIsProcessingMedia(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      setMediaType("image")
      setMediaNote(sourceNote)
      setPastedStatus(sourceNote)
      setIsProcessingMedia(false)
      setTimeout(() => setPastedStatus(null), 3500)
    }
    reader.onerror = () => {
      setIsProcessingMedia(false)
    }
    reader.readAsDataURL(file)
  }

  // Handle Video file by extracting a clean representative frame using Canvas
  const processVideoFile = (file: File) => {
    setIsProcessingMedia(true)
    setMediaNote("Extracting representative video frame...")
    const video = document.createElement("video")
    video.src = URL.createObjectURL(file)
    video.muted = true
    video.playsInline = true
    video.currentTime = 1.0

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, video.duration / 2)
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const frameData = canvas.toDataURL("image/jpeg", 0.85)
          setImagePreview(frameData)
          setMediaType("video_frame")
          setMediaNote("Representative video frame captured for visual AI analysis")
          setPastedStatus("Frame extracted from video")
          setTimeout(() => setPastedStatus(null), 3500)
        }
      } catch (err) {
        console.error("Frame extraction error", err)
      } finally {
        setIsProcessingMedia(false)
        URL.revokeObjectURL(video.src)
      }
    }

    video.onerror = () => {
      setIsProcessingMedia(false)
      setMediaNote(null)
    }
  }

  // Handle Document / Notes file
  const processDocFile = (file: File) => {
    setMediaType("document")
    setMediaNote(`Attached notes: ${file.name} (${Math.round(file.size / 1024)} KB)`)
    setPastedStatus(`Attached document: ${file.name}`)
    setTimeout(() => setPastedStatus(null), 3500)
  }

  const handleClearMedia = () => {
    setImagePreview(null)
    setMediaType(null)
    setMediaNote(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (docInputRef.current) docInputRef.current.value = ""
  }

  const handlePromptSelect = (promptText: string) => {
    setDescription(promptText)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = description.trim()
    if (!trimmed && !imagePreview) return

    // Save to global scan store
    setScanInput({
      itemDescription: trimmed || "Uploaded waste material item",
      imagePreviewUrl: imagePreview,
      quantity: "1 unit / batch",
      itemCondition: "clean",
      consentGiven: true,
    })

    setPreferences({
      tools: selectedTools,
      budget: selectedBudget,
      goal: selectedGoal,
    })

    // Route to the complete scan & assessment workflow
    router.push("/scan")
  }

  return (
    <section 
      id="waste-input" 
      ref={containerRef}
      className="relative w-full py-20 px-4 sm:px-6 bg-transparent text-[#F4F8F5] overflow-hidden border-y border-white/10"
    >
      {/* 1. Atmospheric Animated Waste Words Background */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-between py-6 opacity-25 select-none"
      >
        {/* Row 1 drifting left */}
        <div className="animate-waste-drift-left whitespace-nowrap text-4xl sm:text-6xl font-display font-black tracking-widest text-[#2FC48A]">
          {WASTE_WORDS_ROW_1.map((word, i) => (
            <span key={i} className="mx-8 sm:mx-14 inline-block hover:opacity-100 transition-opacity">
              {word} •
            </span>
          ))}
          {WASTE_WORDS_ROW_1.map((word, i) => (
            <span key={`dup-${i}`} className="mx-8 sm:mx-14 inline-block">
              {word} •
            </span>
          ))}
        </div>

        {/* Row 2 drifting right */}
        <div className="animate-waste-drift-right whitespace-nowrap text-4xl sm:text-6xl font-display font-black tracking-widest text-[#9BE7BD]">
          {WASTE_WORDS_ROW_2.map((word, i) => (
            <span key={i} className="mx-8 sm:mx-14 inline-block">
              {word} •
            </span>
          ))}
          {WASTE_WORDS_ROW_2.map((word, i) => (
            <span key={`dup2-${i}`} className="mx-8 sm:mx-14 inline-block">
              {word} •
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Interactive Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Eyebrow & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18352A]/80 border border-[#2FC48A]/30 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-light">
              Multimodal Waste Intelligence
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#F4F8F5] mb-3">
            What waste item do you want to solve?
          </h2>
          <p className="text-sm sm:text-base text-[#C0CEC5] leading-relaxed">
            Type in English, हिन्दी, or Hinglish. Paste an image with <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-light font-mono text-xs">Ctrl+V</kbd>, attach a video frame, or select a ready-to-test scenario.
          </p>
        </div>

        {/* Multilingual Quick Scenarios */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-[#C0CEC5] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-primary" />
              Quick Inspiration Scenarios:
            </span>
            <span className="text-[11px] text-[#C0CEC5]/70 hidden sm:inline">
              Click any chip to load description
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptSelect(prompt.text)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#122820]/75 hover:bg-[#18352A]/90 border border-white/10 hover:border-emerald-primary/40 text-[#C0CEC5] hover:text-[#F4F8F5] backdrop-blur-md transition-all text-left flex items-center gap-1.5 focus-ring"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-primary/70" />
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Input Box */}
        <form 
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[#081511]/75 backdrop-blur-md border border-white/15 p-5 sm:p-7 shadow-2xl relative overflow-hidden focus-within:border-emerald-primary/50 transition-colors"
        >
          {/* Notification toast if pasted */}
          {pastedStatus && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-primary text-forest-950 font-bold text-xs shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <Clipboard className="w-3.5 h-3.5" />
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
              placeholder="Describe what you have (e.g. '5 glass juice bottles, broken wood pallet, no power tools, zero budget. Looking for functional home organizers'). You can also press Ctrl+V to paste a photo directly..."
              className="w-full rounded-xl bg-[#081511]/90 border border-white/10 p-4 text-sm sm:text-base text-[#F4F8F5] placeholder:text-[#C0CEC5]/50 focus:outline-none focus:border-emerald-primary/60 focus:ring-1 focus:ring-emerald-primary/40 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Media Attachments Preview */}
          {imagePreview && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#081511]/80 border border-emerald-primary/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 bg-black shrink-0">
                  <img
                    src={imagePreview}
                    alt="Uploaded waste preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F4F8F5] truncate">
                      {mediaType === "video_frame" ? "Extracted Video Frame" : "Visual Media Attached"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-primary/20 text-emerald-light font-medium">
                      Ready for AI
                    </span>
                  </div>
                  {mediaNote && (
                    <p className="text-[11px] text-[#C0CEC5] truncate mt-0.5">
                      {mediaNote}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearMedia}
                className="p-1.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-[#C0CEC5] hover:text-rose-400 transition-colors focus-ring"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Document Note Preview */}
          {mediaType === "document" && mediaNote && (
            <div className="mb-5 p-3 rounded-xl bg-[#081511]/80 border border-white/15 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#C0CEC5]">
                <FileText className="w-4 h-4 text-emerald-primary" />
                <span>{mediaNote}</span>
              </div>
              <button
                type="button"
                onClick={handleClearMedia}
                className="text-[#C0CEC5] hover:text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Resource & Constraint Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 pt-2 border-t border-white/10">
            {/* Tools */}
            <div>
              <label className="block text-[11px] font-semibold text-[#C0CEC5] mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-emerald-primary" />
                Available Tools:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(["household", "basic_tools", "workshop"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTools(t)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium capitalize border transition-all ${
                      selectedTools === t
                        ? "bg-emerald-primary/20 border-emerald-primary text-[#F4F8F5]"
                        : "bg-[#081511] border-white/10 text-[#C0CEC5] hover:border-white/25"
                    }`}
                  >
                    {t === "household" ? "Household" : t === "basic_tools" ? "Hand Tools" : "Workshop"}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[11px] font-semibold text-[#C0CEC5] mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-emerald-primary" />
                Budget Limit:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(["free", "under_200", "flexible"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBudget(b)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border transition-all ${
                      selectedBudget === b
                        ? "bg-emerald-primary/20 border-emerald-primary text-[#F4F8F5]"
                        : "bg-[#081511] border-white/10 text-[#C0CEC5] hover:border-white/25"
                    }`}
                  >
                    {b === "free" ? "₹0 (Free)" : b === "under_200" ? "< ₹200" : "Flexible"}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-[11px] font-semibold text-[#C0CEC5] mb-1.5 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-emerald-primary" />
                Primary Goal:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(["useful", "min_effort", "sellable"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGoal(g)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium capitalize border transition-all ${
                      selectedGoal === g
                        ? "bg-emerald-primary/20 border-emerald-primary text-[#F4F8F5]"
                        : "bg-[#081511] border-white/10 text-[#C0CEC5] hover:border-white/25"
                    }`}
                  >
                    {g === "useful" ? "Functional" : g === "min_effort" ? "Easy Fix" : "Sellable"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer: Media Buttons + Submit */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            {/* Attachment buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Photo Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processImageFile(file, file.name)
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081511] hover:bg-[#122820] border border-white/10 text-xs font-medium text-[#C0CEC5] hover:text-[#F4F8F5] transition-colors focus-ring"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-primary" />
                <span>Upload Photo</span>
              </button>

              {/* Video Frame Extraction */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processVideoFile(file)
                }}
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081511] hover:bg-[#122820] border border-white/10 text-xs font-medium text-[#C0CEC5] hover:text-[#F4F8F5] transition-colors focus-ring"
                title="AI analyzes a clean extracted representative frame from your video"
              >
                <VideoIcon className="w-3.5 h-3.5 text-emerald-primary" />
                <span>Video Frame</span>
              </button>

              {/* Notes / Document */}
              <input
                ref={docInputRef}
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) processDocFile(file)
                }}
              />
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081511] hover:bg-[#122820] border border-white/10 text-xs font-medium text-[#C0CEC5] hover:text-[#F4F8F5] transition-colors focus-ring"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-primary" />
                <span>Attach Notes</span>
              </button>

              <span className="text-[11px] text-[#C0CEC5]/60 pl-2 hidden lg:inline">
                or press <kbd className="font-mono text-emerald-light">Ctrl+V</kbd>
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessingMedia || (!description.trim() && !imagePreview)}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-emerald-primary text-forest-950 font-bold text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg hover:shadow-emerald-primary/20 disabled:opacity-40 disabled:cursor-not-allowed focus-ring ml-auto"
            >
              <Sparkles className="w-4 h-4 text-forest-950" />
              <span>Evaluate Possibilities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Small Trust Disclaimer under box */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#C0CEC5]/75 text-center">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-primary" />
            Private & processed in-memory
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-primary" />
            Zero hazardous DIY recommendations
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-primary" />
            Instant feasibility & cost breakdown
          </span>
        </div>
      </div>
    </section>
  )
}
