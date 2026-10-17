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
  Check, 
  ShieldAlert,
  Loader2,
  FileText
} from "lucide-react"

const SCAN_STAGES = [
  "Reading image and metadata...",
  "Identifying likely materials and resin markings...",
  "Evaluating contamination and condition...",
  "Formulating safety and uncertainty boundaries...",
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
  const [consent, setConsent] = React.useState(consentGiven)
  const [preview, setPreview] = React.useState<string | null>(imagePreviewUrl)
  const [base64Image, setBase64Image] = React.useState<string | null>(null)
  const [mimeType, setMimeType] = React.useState<string | null>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const [currentStageIndex, setCurrentStageIndex] = React.useState(0)

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

  const handleFileSelected = (file: File) => {
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
      // Extract base64
      const parts = result.split(",")
      if (parts.length === 2) {
        setBase64Image(parts[1])
        setMimeType(file.type)
      }
    }
    reader.readAsDataURL(file)
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

    // Save inputs to persisted store
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

  // Quick Demo Buttons
  const loadDemoItem = (name: string, desc: string, defaultQty: string) => {
    setDescription(desc)
    setQty(defaultQty)
    setConsent(true)
    setValidationError(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-forest mb-2">
          What would you like to do with your waste?
        </h1>
        <p className="text-secondaryText text-sm">
          Upload a photo or describe the material. Our safety and material analysis will assess feasible circular pathways.
        </p>
      </div>

      {/* Quick Demo Pre-fills for Testing */}
      <div className="mb-6 p-4 bg-white rounded-card border border-borderTone">
        <span className="text-xs font-semibold text-forest uppercase tracking-wider block mb-2">
          Quick Test Samples (Demo Mode):
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => loadDemoItem("Plastic Bottle", "Clear 1-liter plastic PET water bottle with cap", "1 bottle")}
            className="px-3 py-1.5 rounded-pill bg-ivory text-forest border border-borderTone hover:border-leaf-green transition-colors"
          >
            🍾 Clear PET Bottle
          </button>
          <button
            type="button"
            onClick={() => loadDemoItem("Cardboard Box", "Corrugated kraft cardboard shipping box", "1 box")}
            className="px-3 py-1.5 rounded-pill bg-ivory text-forest border border-borderTone hover:border-leaf-green transition-colors"
          >
            📦 Shipping Carton
          </button>
          <button
            type="button"
            onClick={() => loadDemoItem("Old T-Shirt", "100% cotton crewneck t-shirt with worn collar", "1 shirt")}
            className="px-3 py-1.5 rounded-pill bg-ivory text-forest border border-borderTone hover:border-leaf-green transition-colors"
          >
            👕 Cotton T-Shirt
          </button>
          <button
            type="button"
            onClick={() => loadDemoItem("Old Phone", "Old smartphone with cracked screen and bulging swollen battery", "1 phone")}
            className="px-3 py-1.5 rounded-pill bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-400 transition-colors"
          >
            ⚠️ Swollen Battery (Hazardous Test)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload / Camera Box */}
        <div className="bg-white p-6 rounded-card border border-borderTone shadow-sm">
          <label className="block text-sm font-semibold text-forest mb-2">
            Item Photo (Optional but Recommended)
          </label>

          {preview ? (
            <div className="relative rounded-lg overflow-hidden border border-borderTone bg-slate-50 flex items-center justify-center max-h-80">
              <img
                src={preview}
                alt="Waste item preview"
                className="max-h-80 w-auto object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="absolute top-3 right-3 p-1.5 bg-forest-ink/80 text-white rounded-full hover:bg-forest-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-borderTone hover:border-leaf-green transition-colors rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer bg-ivory/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-leaf-green mb-3" />
              <p className="text-sm font-medium text-forest mb-1">
                Drag and drop your photo here, or browse
              </p>
              <p className="text-xs text-secondaryText mb-4">
                JPEG, PNG, or WebP up to 10 MB
              </p>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-pill bg-white border border-borderTone text-xs font-semibold hover:border-leaf-green transition-colors shadow-sm"
                >
                  Choose File
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-white border border-borderTone text-xs font-semibold hover:border-leaf-green transition-colors shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Take Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              />
            </div>
          )}
        </div>

        {/* Item Description */}
        <div className="bg-white p-6 rounded-card border border-borderTone shadow-sm space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-forest mb-1">
              Description & Visible Details {!preview && <span className="text-danger">*</span>}
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Empty 2L plastic soda bottle with #1 PET mark, or cotton denim jeans with broken zipper..."
              className="w-full px-4 py-2.5 rounded-lg border border-borderTone text-sm focus:outline-none focus:ring-2 focus:ring-leaf-green"
            />
            <p className="text-xs text-secondaryText mt-1">
              Include any numbers stamped inside the triangle recycling symbol (e.g. 1, 2, 5).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-forest mb-1">
                Estimated Quantity
              </label>
              <input
                id="quantity"
                type="text"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 1 unit, 5 bottles, 2 kg"
                className="w-full px-4 py-2 rounded-lg border border-borderTone text-sm focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-semibold text-forest mb-1">
                Cleanliness & Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-borderTone text-sm bg-white focus:outline-none focus:ring-2 focus:ring-leaf-green"
              >
                <option value="clean">Clean / Rinsed</option>
                <option value="lightly_soiled">Lightly soiled (needs rinse)</option>
                <option value="contaminated">Greasy / Heavily contaminated</option>
                <option value="damaged">Broken / Damaged</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consent Notice */}
        <div className="p-4 rounded-card bg-ivory-200/80 border border-borderTone text-xs text-secondaryText flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-borderTone text-leaf-green focus:ring-leaf-green w-4 h-4 cursor-pointer"
          />
          <label htmlFor="consent" className="cursor-pointer">
            <strong>Privacy Consent:</strong> I agree to submit this photo and description for AI material and feasibility evaluation. Images are processed ephemerally and are never used to train public AI models.
          </label>
        </div>

        {/* Validation / Server Errors */}
        {(validationError || assessmentError) && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-danger text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to proceed</p>
              <p>{validationError || assessmentError}</p>
            </div>
          </div>
        )}

        {/* Submit Button & Analysis Animation */}
        <div>
          {isAssessing ? (
            <div className="p-6 rounded-card bg-forest-ink text-ivory text-center space-y-3 animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-lime-fresh" />
                <span className="text-sm font-semibold text-lime-fresh">
                  Analyzing Waste Stream
                </span>
              </div>
              <p className="text-xs text-ivory/80 font-mono">
                {SCAN_STAGES[currentStageIndex]}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full h-13 py-3.5 px-6 rounded-pill bg-leaf-green text-white font-semibold text-base hover:bg-leaf-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-lime-fresh" />
              <span>Assess Material Possibilities</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
