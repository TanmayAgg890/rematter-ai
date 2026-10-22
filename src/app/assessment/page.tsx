"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { MaterialCategory } from "@/types"
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Info,
  Check,
  RotateCcw,
  Loader2,
  ChevronDown
} from "lucide-react"

const ALL_CATEGORIES: { id: MaterialCategory; label: string }[] = [
  { id: "textile", label: "Textile & Clothing" },
  { id: "plastic", label: "Plastic & Packaging" },
  { id: "paper_cardboard", label: "Paper & Cardboard" },
  { id: "glass", label: "Glass & Ceramics" },
  { id: "metal", label: "Metals & Cans" },
  { id: "wood", label: "Wood & Pallets" },
  { id: "e_waste", label: "Electronics & Cables" },
  { id: "organic", label: "Organic & Biomass" },
  { id: "composite", label: "Composite / Mixed" },
  { id: "hazardous", label: "Hazardous / Specialist" },
]

export default function AssessmentPage() {
  const router = useRouter()
  const { 
    assessment, 
    setAssessment, 
    itemDescription,
    imagePreviewUrl,
    quantity,
    itemCondition
  } = useScanStore()

  const [confirmed, setConfirmed] = React.useState(assessment?.userConfirmed || false)
  const [editing, setEditing] = React.useState(false)
  const [editedMaterial, setEditedMaterial] = React.useState(assessment?.detectedMaterial || "")
  const [selectedCategory, setSelectedCategory] = React.useState<MaterialCategory>(assessment?.category || "plastic")
  const [notSureExpanded, setNotSureExpanded] = React.useState(false)
  const [isReanalyzing, setIsReanalyzing] = React.useState(false)
  const [reanalyzeError, setReanalyzeError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
    } else {
      setEditedMaterial(assessment.detectedMaterial)
      setSelectedCategory(assessment.category)
    }
  }, [assessment, router])

  if (!assessment) {
    return null
  }

  const handleConfirm = () => {
    setConfirmed(true)
    setAssessment({
      ...assessment,
      detectedMaterial: editedMaterial || assessment.detectedMaterial,
      category: selectedCategory,
      userConfirmed: true,
    })
  }

  const handleContinue = () => {
    if (!confirmed) {
      handleConfirm()
    }
    router.push("/preferences")
  }

  // Genuine "Analyze Again" Action: Resets old predictions and sends a fresh inference request
  const handleAnalyzeAgain = async () => {
    setIsReanalyzing(true)
    setReanalyzeError(null)

    try {
      let base64: string | undefined = undefined
      let mimeType: string | undefined = undefined

      if (imagePreviewUrl && imagePreviewUrl.startsWith("data:")) {
        const parts = imagePreviewUrl.split(",")
        if (parts.length === 2) {
          base64 = parts[1]
          const mimeMatch = imagePreviewUrl.match(/data:([^;]+);/)
          mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg"
        }
      }

      const res = await fetch("/api/material/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: itemDescription,
          quantity: quantity,
          condition: itemCondition,
          imageBase64: base64,
          imageMimeType: mimeType,
          bypassCache: true,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Re-analysis failed. Please try again.")
      }

      const newAssessment = data.data.assessment
      setAssessment(newAssessment)
      setEditedMaterial(newAssessment.detectedMaterial)
      setSelectedCategory(newAssessment.category)
      setConfirmed(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Re-analysis failed."
      setReanalyzeError(msg)
    } finally {
      setIsReanalyzing(false)
    }
  }

  const isHazardous = assessment.isHazardous || assessment.routingLevel === 3

  // Format confidence honestly as qualitative status + calibrated estimate
  const getConfidenceBadge = (confidenceVal?: number) => {
    if (confidenceVal === undefined || confidenceVal === null) {
      return { label: "Estimated Match", color: "bg-platinum/20 text-platinum" }
    }
    if (confidenceVal >= 0.85) {
      return { 
        label: `High confidence (~${Math.round(confidenceVal * 100)}%)`, 
        color: "bg-mocha-deep text-lavender border border-lavender-accent/40" 
      }
    }
    if (confidenceVal >= 0.65) {
      return { 
        label: `Moderate confidence (~${Math.round(confidenceVal * 100)}%)`, 
        color: "bg-amber-950/40 text-amber-300 border border-amber-500/30" 
      }
    }
    return { 
      label: `Low confidence (~${Math.round(confidenceVal * 100)}%) — please confirm`, 
      color: "bg-red-950/40 text-red-300 border border-red-500/30" 
    }
  }

  const primaryConfidence = assessment.candidateMaterials?.[0]?.confidence
  const confBadge = getConfidenceBadge(primaryConfidence)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back button & Action Row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/scan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload Another Photo</span>
        </Link>

        {/* Genuine Analyze Again button */}
        <button
          type="button"
          onClick={handleAnalyzeAgain}
          disabled={isReanalyzing}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mocha-surface hover:bg-mocha-deep border border-lavender-accent/30 text-lavender-accent text-xs font-semibold transition-all focus-ring disabled:opacity-50"
        >
          {isReanalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing again...</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analyze Again</span>
            </>
          )}
        </button>
      </div>

      {reanalyzeError && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{reanalyzeError}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-3 py-0.5 rounded-full bg-mocha-deep/80 border border-lavender-accent/30 text-lavender text-xs font-bold uppercase tracking-wider">
            Material Assessment
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${confBadge.color}`}>
            {confBadge.label}
          </span>
          {isHazardous && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-200 border border-amber-600/50 text-xs font-bold uppercase">
              Hazardous / Level 3
            </span>
          )}
        </div>
        <h1 className="text-3xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-2">
          Verified Material Identity
        </h1>
        <p className="text-platinum text-sm leading-relaxed">
          Review concrete visual evidence versus AI hypotheses before generating personalized repurposing or recycling pathways.
        </p>
      </div>

      {/* Hazardous Material Warning Banner */}
      {isHazardous && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-950/30 border border-amber-600/50 text-amber-200 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-200 mb-1">
              Safety Routing Applied: Certified Recycling Only (Level 3)
            </h3>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              This item contains lithium batteries, pressurized cells, or hazardous electronic components. For fire and toxic fume safety, DIY alterations are locked out. We will connect you to certified local drop-offs.
            </p>
          </div>
        </div>
      )}

      {/* Core Detected Material Card */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex-1">
            <span className="text-xs font-semibold text-platinum uppercase tracking-wider block mb-1">
              Primary Assessment
            </span>
            {editing ? (
              <div className="space-y-3 mt-2">
                <input
                  type="text"
                  value={editedMaterial}
                  onChange={(e) => setEditedMaterial(e.target.value)}
                  placeholder="Specific item / material name"
                  className="w-full px-3.5 py-2 rounded-xl border border-white/20 bg-[#171515] text-base font-bold text-[#F5F3F3] focus:outline-none focus:ring-2 focus:ring-lavender-accent"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as MaterialCategory)}
                    className="px-3 py-1.5 rounded-lg border border-white/20 bg-[#171515] text-xs font-semibold text-platinum"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      handleConfirm()
                    }}
                    className="px-4 py-1.5 rounded-lg bg-mocha hover:bg-mocha-hover text-white text-xs font-bold focus-ring"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-[#F5F3F3] flex items-center gap-2.5">
                  <span>{editedMaterial || assessment.detectedMaterial}</span>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    aria-label="Edit material name or category"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-platinum hover:text-white transition-colors focus-ring"
                    title="Change material or category"
                  >
                    <Edit3 className="w-4 h-4 text-lavender" />
                  </button>
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-platinum">
                  <span>Category: <strong className="text-white capitalize">{selectedCategory.replace("_", " ")}</strong></span>
                  <span>•</span>
                  <span>Condition: <strong className="text-white capitalize">{assessment.condition}</strong></span>
                  <span>•</span>
                  <span>Quantity: <strong className="text-white">{assessment.quantity}</strong></span>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0">
            {confirmed ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mocha/40 border border-lavender-accent/40 text-lavender text-xs font-bold">
                <Check className="w-4 h-4 text-lavender-accent" />
                <span>Material Confirmed</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-bold transition-all shadow-md focus-ring border border-mocha-light/20"
              >
                <CheckCircle2 className="w-4 h-4 text-lavender" />
                <span>Confirm This Material</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Alternatives / Probabilities */}
        {assessment.candidateMaterials && assessment.candidateMaterials.length > 1 && (
          <div className="py-5 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-platinum mb-3">
              Candidate Hypotheses (AI Probability)
            </h3>
            <div className="space-y-2">
              {assessment.candidateMaterials.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">{c.name}</span>
                    {c.notes && <p className="text-platinum text-[11px] mt-0.5">{c.notes}</p>}
                  </div>
                  <span className="font-mono text-[11px] font-medium text-lavender bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    ~{Math.round(c.confidence * 100)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concrete Visible Evidence vs Uncertainties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Direct Visible Evidence */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3F3] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-lavender-accent" />
              <span>Direct Visible Evidence</span>
            </h3>
            <ul className="space-y-2 text-xs text-platinum">
              {assessment.visibleEvidence && assessment.visibleEvidence.length > 0 ? (
                assessment.visibleEvidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-lavender-accent font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))
              ) : (
                <li className="italic">Based primarily on user text description</li>
              )}
            </ul>
          </div>

          {/* Known Uncertainties */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F3F3] mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-platinum" />
              <span>Known Uncertainties</span>
            </h3>
            <ul className="space-y-2 text-xs text-platinum">
              {assessment.uncertainties && assessment.uncertainties.length > 0 ? (
                assessment.uncertainties.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{u}</span>
                  </li>
                ))
              ) : (
                <li>Exact chemical formulation requires physical laboratory testing</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Manual Material Correction Helper */}
      <div className="mb-8 p-5 rounded-2xl bg-[#211D1C]/75 backdrop-blur-md border border-white/10">
        <button
          type="button"
          onClick={() => setNotSureExpanded(!notSureExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-platinum hover:text-white focus-ring"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-lavender-accent" />
            <span>Need to change the detected material or category?</span>
          </span>
          <span className="text-lavender-accent underline">
            {notSureExpanded ? "Close Material Selector" : "Choose Another Material"}
          </span>
        </button>

        {notSureExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <p className="text-xs text-platinum leading-relaxed">
              If the image was misidentified (e.g. clothing predicted as plastic), select the correct material below:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id)
                    setEditedMaterial(cat.label)
                    setConfirmed(true)
                    setAssessment({
                      ...assessment,
                      category: cat.id,
                      detectedMaterial: cat.label,
                      userConfirmed: true,
                    })
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-mocha text-white border-lavender-accent shadow-sm"
                      : "bg-white/5 text-platinum hover:bg-white/10 border-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/scan"
          className="text-xs font-semibold text-platinum hover:text-white focus-ring"
        >
          ← Retake Photo
        </Link>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-mocha hover:bg-mocha-hover active:scale-95 text-white font-bold text-sm transition-all shadow-lg focus-ring border border-mocha-light/20"
        >
          <span>Continue to Personalization</span>
          <ArrowRight className="w-4 h-4 text-platinum-light" />
        </button>
      </div>
    </div>
  )
}
