"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  UploadCloud, 
  ShieldCheck, 
  Info,
  Check
} from "lucide-react"

export default function AssessmentPage() {
  const router = useRouter()
  const { assessment, setAssessment, imagePreviewUrl, itemDescription } = useScanStore()

  const [confirmed, setConfirmed] = React.useState(assessment?.userConfirmed || false)
  const [editing, setEditing] = React.useState(false)
  const [editedMaterial, setEditedMaterial] = React.useState(assessment?.detectedMaterial || "")
  const [notSureExpanded, setNotSureExpanded] = React.useState(false)

  // Redirect if no assessment in session
  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
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
      userConfirmed: true,
    })
  }

  const handleContinue = () => {
    if (!confirmed) {
      handleConfirm()
    }
    router.push("/preferences")
  }

  const isHazardous = assessment.isHazardous || assessment.routingLevel === 3

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/scan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondaryText hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload a Clearer Photo (Keeps description)</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-pill bg-leaf-green/15 text-leaf-green text-xs font-bold uppercase tracking-wider">
            Material Assessment
          </span>
          {isHazardous ? (
            <span className="px-2.5 py-0.5 rounded-pill bg-amber-100 text-amber-800 text-xs font-bold uppercase">
              Hazardous / Level 3
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-pill bg-lime-fresh/40 text-forest text-xs font-bold uppercase">
              Domestic Stream
            </span>
          )}
        </div>
        <h1 className="text-3xl font-display font-semibold text-forest mb-2">
          Verified Material Identity
        </h1>
        <p className="text-secondaryText text-sm">
          Please review direct observations vs AI hypotheses before selecting personalized DIY or recycling pathways.
        </p>
      </div>

      {/* Hazardous Material Warning Banner */}
      {isHazardous && (
        <div className="mb-8 p-5 rounded-card bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-900 mb-1">
              Safety Routing Applied: Professional Recycling Only (Level 3)
            </h3>
            <p className="text-sm text-amber-900/90 leading-relaxed">
              This item contains pressurized batteries, electronics, or chemical hazards. For personal safety and environmental protection, DIY alterations are locked out. We will connect you directly to authorized local drop-offs.
            </p>
          </div>
        </div>
      )}

      {/* Core Detected Material Card */}
      <div className="bg-white rounded-card border border-borderTone p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderTone">
          <div>
            <span className="text-xs font-semibold text-secondaryText uppercase tracking-wider block mb-1">
              Primary Assessment
            </span>
            {editing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editedMaterial}
                  onChange={(e) => setEditedMaterial(e.target.value)}
                  className="px-3 py-1.5 rounded border border-borderTone text-lg font-bold text-forest focus:outline-none focus:ring-2 focus:ring-leaf-green"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    handleConfirm()
                  }}
                  className="px-3 py-1.5 rounded bg-leaf-green text-white text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-forest flex items-center gap-2">
                <span>{editedMaterial || assessment.detectedMaterial}</span>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  aria-label="Edit material name"
                  className="p-1 rounded hover:bg-slate-100 text-secondaryText hover:text-forest"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </h2>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-secondaryText">
              <span>Category: <strong className="text-forest capitalize">{assessment.category}</strong></span>
              <span>•</span>
              <span>Condition: <strong className="text-forest capitalize">{assessment.condition}</strong></span>
              <span>•</span>
              <span>Quantity: <strong className="text-forest">{assessment.quantity}</strong></span>
            </div>
          </div>

          <div>
            {confirmed ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <Check className="w-4 h-4" />
                <span>Material Confirmed</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill bg-forest text-white text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-lime-fresh" />
                <span>Confirm Material</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Alternatives */}
        {assessment.candidateMaterials && assessment.candidateMaterials.length > 1 && (
          <div className="py-5 border-b border-borderTone">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondaryText mb-3">
              Candidate Hypotheses (AI Probability)
            </h3>
            <div className="space-y-2">
              {assessment.candidateMaterials.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-ivory/60 border border-borderTone/80 text-xs"
                >
                  <div>
                    <span className="font-semibold text-forest">{c.name}</span>
                    {c.notes && <p className="text-secondaryText text-[11px] mt-0.5">{c.notes}</p>}
                  </div>
                  <span className="font-mono font-medium text-forest bg-white px-2 py-0.5 rounded border border-borderTone">
                    {Math.round(c.confidence * 100)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visible Evidence vs Uncertainties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Direct Observation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-leaf-green" />
              <span>Direct Visible Evidence</span>
            </h3>
            <ul className="space-y-2 text-xs text-secondaryText">
              {assessment.visibleEvidence && assessment.visibleEvidence.length > 0 ? (
                assessment.visibleEvidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-leaf-green font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))
              ) : (
                <li className="italic">Based primarily on user text description</li>
              )}
            </ul>
          </div>

          {/* Uncertainties (Honest AI) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-secondaryText" />
              <span>Known Uncertainties</span>
            </h3>
            <ul className="space-y-2 text-xs text-secondaryText">
              {assessment.uncertainties && assessment.uncertainties.length > 0 ? (
                assessment.uncertainties.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-caution font-bold">•</span>
                    <span>{u}</span>
                  </li>
                ))
              ) : (
                <li>No micro-chemical contamination detected</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* "Not Sure?" Clarification Drawer */}
      <div className="mb-8 p-4 rounded-card bg-ivory border border-borderTone">
        <button
          type="button"
          onClick={() => setNotSureExpanded(!notSureExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-forest hover:text-leaf-green"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-leaf-green" />
            <span>Not sure if this assessment is accurate?</span>
          </span>
          <span className="text-leaf-green underline">{notSureExpanded ? "Hide Guidance" : "Check Tips"}</span>
        </button>

        {notSureExpanded && (
          <div className="mt-4 pt-4 border-t border-borderTone text-xs text-secondaryText space-y-2">
            <p>
              • Look at the bottom of plastic bottles/containers for a 3-arrow triangle with a number from 1 to 7.
            </p>
            <p>
              • If clothing, check the inside hip seam for the fabric content tag (e.g. 100% cotton vs polyester blend).
            </p>
            <p>
              • You can edit the material name directly above, or continue with broad category recommendations.
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/scan"
          className="text-xs font-semibold text-secondaryText hover:text-forest"
        >
          ← Edit Photo & Description
        </Link>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-pill bg-leaf-green text-white font-semibold text-sm hover:bg-leaf-600 transition-all shadow-md"
        >
          <span>Continue to Personalization</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
