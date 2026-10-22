"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useScanStore } from "@/lib/store/use-scan-store"
import { validateImageUpload, validateScanInput } from "@/lib/validation/upload"
import { 
  Upload, 
  Camera, 
  X, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Loader2,
  Clipboard
} from "lucide-react"

const SCAN_STAGES = [
  "Reading image and visual evidence...",
  "Identifying object contours, materials, and markings...",
  "Evaluating contamination, wear, and structural condition...",
  "Formulating safety eligibility gates and honest uncertainties...",
]

export default function ScanPage() {
  const router = useRouter()
  const { 
    itemDescription, 
    imagePreviewUrl, 
    quantity, 
    itemCondition, 
    consentGiven,
    setScanInput,
    setAssessment,
    isAssessing,
    setIsAssessing,
    assessmentError,
    setAssessmentError
  } = useScanStore()

  const [description, setDescription] = React.useState(itemDescription)
  const [qty, setQty] = React.useState(quantity)
  const [condition, setCondition] = React.useState(itemCondition)
  const [consent, setConsent] = React.useState<boolean>(Boolean(consentGiven))
  const [preview, setPreview] = React.useState<string | null>(imagePreviewUrl)
  const [base64Image, setBase64Image] = React.useState<string | null>(null)
  const [mimeType, setMimeType] = React.useState<string | null>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const [currentStageIndex, setCurrentStageIndex] = React.useState(0)
  const [pastedStatus, setPastedStatus] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  // Rotating status message during scan analysis
  React.useEffect(() => {
    if (!isAssessing) return
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % SCAN_STAGES.length)
    }, 1400)
    return () => clearInterval(interval)
  }, [isAssessing])

  const processFile = React.useCallback((file: File, isFromPaste = false) => {
    setValidationError(null)
    setAssessmentError(null)

    const validation = validateImageUpload(file)
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      const parts = result.split(",")
      if (parts.length === 2) {
        setBase64Image(parts[1])
        setMimeType(file.type || "image/png")
      }
      if (isFromPaste) {
        setPastedStatus("Image pasted successfully")
        setTimeout(() => setPastedStatus(null), 3000)
      }
    }
    reader.readAsDataURL(file)
  }, [setAssessmentError])

  // Native Clipboard Ctrl+V Paste Handler for the Scan Page
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // If user is pasting into a text input or textarea, let default text paste happen unless it contains an image file
      const items = e.clipboardData?.items
      if (!items) return

      let foundImage = false
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile()
          if (file) {
            foundImage = true
            processFile(file, true)
            e.preventDefault()
            break
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [processFile])

  const handleFileSelected = (file: File) => {
    processFile(file, false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setBase64Image(null)
    setMimeType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    setAssessmentError(null)

    const inputValidation = validateScanInput(description, !!preview)
    if (!inputValidation.isValid) {
      setValidationError(inputValidation.error || "Invalid input")
      return
    }

    if (!consent) {
      setValidationError("Please check the consent box to process this image with our AI assessment service.")
      return
    }

    setScanInput({
      itemDescription: description,
      imagePreviewUrl: preview,
      quantity: qty,
      itemCondition: condition,
      consentGiven: consent,
    })

    setIsAssessing(true)

    try {
      const res = await fetch("/api/material/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          quantity: qty,
          condition,
          imageBase64: base64Image || undefined,
          imageMimeType: mimeType || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Material analysis failed. Please try again.")
      }

      setAssessment(data.data.assessment)
      router.push("/assessment")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis request failed."
      setAssessmentError(message)
    } finally {
      setIsAssessing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Toast Notification for Clipboard Paste */}
      {pastedStatus && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-mocha text-white text-xs font-bold shadow-2xl border border-lavender-accent/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Clipboard className="w-4 h-4 text-lavender" />
          <span>{pastedStatus}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-mocha-deep/80 border border-lavender-accent/30 text-lavender-accent text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-lavender" />
          <span>Visual & Text Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-2">
          Scan Your Waste Item
        </h1>
        <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm leading-relaxed">
          Upload or paste a photo (<kbd className="px-1.5 py-0.5 rounded bg-white/10 text-lavender-accent font-mono text-xs">Ctrl+V</kbd>), or describe what you have. ReMatter AI deterministically identifies materials and conditions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Area with Drag-and-Drop + Paste Support */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative rounded-2xl border-2 border-dashed border-platinum/25 hover:border-lavender-accent/60 bg-[#211D1C]/65 backdrop-blur-md p-8 text-center transition-all shadow-sm"
        >
          {preview ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected waste item"
                className="max-h-72 w-auto mx-auto rounded-xl shadow-md border border-white/15 object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove uploaded image"
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-mocha-deep/80 border border-lavender-accent/30 text-lavender-accent flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-1">
                  Drag and drop a photo here, paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-white/10 text-lavender-accent font-mono text-xs">Ctrl+V</kbd>), or browse
                </p>
                <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
                  Accepts JPEG, PNG, or WebP up to 10 MB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-semibold transition-colors focus-ring border border-mocha-light/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 hover:bg-white/15 text-textLightPrimary dark:text-textDarkPrimary border border-white/10 text-xs font-semibold transition-colors focus-ring"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Use Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0])
              }
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0])
              }
            }}
          />
        </div>

        {/* Text Description Box */}
        <div className="bg-[#211D1C]/75 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-sm">
          <label
            htmlFor="item-description"
            className="block text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-2"
          >
            Item Description & Context
          </label>
          <textarea
            id="item-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 5 transparent plastic water bottles, clean and empty with caps on. Looking for functional home organizers."
            className="w-full rounded-xl border border-white/10 bg-[#171515]/90 p-3.5 text-sm text-[#F5F3F3] placeholder:text-platinum/50 focus:outline-none focus:border-lavender-accent/60 focus:ring-1 focus:ring-lavender-accent/40 resize-none transition-all leading-relaxed"
          />
          <p className="text-[11px] text-textLightSecondary dark:text-textDarkSecondary mt-1.5">
            Tip: Mention any markings, resin codes (like #1 PET), or special hardware attached.
          </p>
        </div>

        {/* Quantity & Observed Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#211D1C]/75 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-sm">
            <label
              htmlFor="item-quantity"
              className="block text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-2"
            >
              Approximate Quantity
            </label>
            <input
              id="item-quantity"
              type="text"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="e.g. 1 bottle, 5 units, 2 kg"
              className="w-full rounded-xl border border-white/10 bg-[#171515]/90 p-3 text-sm text-[#F5F3F3] focus:outline-none focus:border-lavender-accent/60 focus:ring-1 focus:ring-lavender-accent/40"
            />
          </div>

          <div className="bg-[#211D1C]/75 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-sm">
            <label
              htmlFor="item-condition"
              className="block text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-2"
            >
              Observed Condition
            </label>
            <select
              id="item-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-[#171515]/90 p-3 text-sm text-[#F5F3F3] focus:outline-none focus:border-lavender-accent/60 focus:ring-1 focus:ring-lavender-accent/40"
            >
              <option value="clean">Clean & Intact</option>
              <option value="lightly_soiled">Lightly Soiled (Rinsable)</option>
              <option value="contaminated">Contaminated / Food Residue</option>
              <option value="damaged">Broken / Crushed / Fractured</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
          <input
            id="ai-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 text-mocha focus:ring-lavender-accent"
          />
          <label htmlFor="ai-consent" className="text-xs text-textLightSecondary dark:text-textDarkSecondary leading-relaxed">
            I consent to processing this image and description with ReMatter AI for material identification and safety assessment. Photos are evaluated in-session and not stored publicly.
          </label>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Assessment Error Banner */}
        {assessmentError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{assessmentError}</span>
          </div>
        )}

        {/* Rotating Loading Screen during AI Assessment */}
        {isAssessing && (
          <div className="p-6 rounded-2xl bg-[#211D1C]/90 border border-lavender-accent/40 text-center space-y-3 animate-in fade-in duration-300">
            <Loader2 className="w-8 h-8 animate-spin text-lavender-accent mx-auto" />
            <p className="text-sm font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {SCAN_STAGES[currentStageIndex]}
            </p>
            <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
              Vision processing with Gemini Multimodal model...
            </p>
          </div>
        )}

        {/* Submit Button */}
        {!isAssessing && (
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-mocha hover:bg-mocha-hover active:scale-[0.99] text-white font-bold text-base transition-all shadow-lg focus-ring border border-mocha-light/20"
          >
            <span>Proceed to Material Verification</span>
            <ArrowRight className="w-4 h-4 text-platinum-light" />
          </button>
        )}
      </form>
    </div>
  )
}
