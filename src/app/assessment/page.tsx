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
  Info,
  Check
} from "lucide-react"

export default function AssessmentPage() {
  const router = useRouter()
  const { assessment, setAssessment } = useScanStore()

  const [confirmed, setConfirmed] = React.useState(assessment?.userConfirmed || false)
  const [editing, setEditing] = React.useState(false)
  const [editedMaterial, setEditedMaterial] = React.useState(assessment?.detectedMaterial || "")
  const [notSureExpanded, setNotSureExpanded] = React.useState(false)

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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary transition-colors focus-ring"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload a Clearer Photo (Keeps description)</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-pill bg-emerald-primary/10 text-emerald-primary dark:text-mint text-xs font-bold uppercase tracking-wider">
            Material Assessment
          </span>
          {isHazardous ? (
            <span className="px-2.5 py-0.5 rounded-pill bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 text-xs font-bold uppercase">
              Hazardous / Level 3
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-pill bg-emerald-primary/15 text-emerald-primary dark:text-mint text-xs font-bold uppercase">
              Domestic Stream
            </span>
          )}
        </div>
        <h1 className="text-3xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-2">
          Verified Material Identity
        </h1>
        <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm">
          Please review direct observations vs AI hypotheses before selecting personalized DIY or recycling pathways.
        </p>
      </div>

      {/* Hazardous Material Warning Banner */}
      {isHazardous && (
        <div className="mb-8 p-5 rounded-card bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 text-amber-950 dark:text-amber-200 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 mb-1">
              Safety Routing Applied: Professional Recycling Only (Level 3)
            </h3>
            <p className="text-sm text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
              This item contains pressurized batteries, electronics, or chemical hazards. For personal safety and environmental protection, DIY alterations are locked out. We will connect you directly to authorized local drop-offs.
            </p>
          </div>
        </div>
      )}

      {/* Core Detected Material Card */}
      <div className="bg-white dark:bg-forest-surface rounded-card border border-borderLightSubtle dark:border-white/10 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderLightSubtle dark:border-white/10">
          <div>
            <span className="text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary uppercase tracking-wider block mb-1">
              Primary Assessment
            </span>
            {editing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editedMaterial}
                  onChange={(e) => setEditedMaterial(e.target.value)}
                  className="px-3 py-1.5 rounded border border-borderLightSubtle dark:border-white/10 bg-white dark:bg-forest-elevated text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary focus:outline-none focus:ring-2 focus:ring-emerald-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    handleConfirm()
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-primary text-forest-950 text-xs font-bold focus-ring"
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-textLightPrimary dark:text-textDarkPrimary flex items-center gap-2">
                <span>{editedMaterial || assessment.detectedMaterial}</span>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  aria-label="Edit material name"
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-forest-elevated text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </h2>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-textLightSecondary dark:text-textDarkSecondary">
              <span>Category: <strong className="text-textLightPrimary dark:text-textDarkPrimary capitalize">{assessment.category}</strong></span>
              <span>•</span>
              <span>Condition: <strong className="text-textLightPrimary dark:text-textDarkPrimary capitalize">{assessment.condition}</strong></span>
              <span>•</span>
              <span>Quantity: <strong className="text-textLightPrimary dark:text-textDarkPrimary">{assessment.quantity}</strong></span>
            </div>
          </div>

          <div>
            {confirmed ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-emerald-primary/10 border border-emerald-primary/30 text-emerald-primary dark:text-mint text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-primary" />
                <span>Material Confirmed</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm focus-ring"
              >
                <CheckCircle2 className="w-4 h-4 text-mint" />
                <span>Confirm Material</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Alternatives */}
        {assessment.candidateMaterials && assessment.candidateMaterials.length > 1 && (
          <div className="py-5 border-b border-borderLightSubtle dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textLightSecondary dark:text-textDarkSecondary mb-3">
              Candidate Hypotheses (AI Probability)
            </h3>
            <div className="space-y-2">
              {assessment.candidateMaterials.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-ivory/60 dark:bg-forest-elevated/60 border border-borderLightSubtle dark:border-white/10 text-xs"
                >
                  <div>
                    <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">{c.name}</span>
                    {c.notes && <p className="text-textLightSecondary dark:text-textDarkSecondary text-[11px] mt-0.5">{c.notes}</p>}
                  </div>
                  <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary bg-white dark:bg-forest-surface px-2 py-0.5 rounded border border-borderLightSubtle dark:border-white/10">
                    {Math.round(c.confidence * 100)}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visible Evidence vs Uncertainties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Direct Observation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
              <span>Direct Visible Evidence</span>
            </h3>
            <ul className="space-y-2 text-xs text-textLightSecondary dark:text-textDarkSecondary">
              {assessment.visibleEvidence && assessment.visibleEvidence.length > 0 ? (
                assessment.visibleEvidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-primary font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))
              ) : (
                <li className="italic">Based primarily on user text description</li>
              )}
            </ul>
          </div>

          {/* Uncertainties */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary" />
              <span>Known Uncertainties</span>
            </h3>
            <ul className="space-y-2 text-xs text-textLightSecondary dark:text-textDarkSecondary">
              {assessment.uncertainties && assessment.uncertainties.length > 0 ? (
                assessment.uncertainties.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
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

      {/* "Not Sure?" Guidance */}
      <div className="mb-8 p-4 rounded-card bg-ivory dark:bg-forest-surface/80 border border-borderLightSubtle dark:border-white/10">
        <button
          type="button"
          onClick={() => setNotSureExpanded(!notSureExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:text-emerald-primary focus-ring"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-primary" />
            <span>Not sure if this assessment is accurate?</span>
          </span>
          <span className="text-emerald-primary underline">{notSureExpanded ? "Hide Guidance" : "Check Tips"}</span>
        </button>

        {notSureExpanded && (
          <div className="mt-4 pt-4 border-t border-borderLightSubtle dark:border-white/10 text-xs text-textLightSecondary dark:text-textDarkSecondary space-y-2">
            <p>
              • Look at the bottom of plastic containers for a 3-arrow triangle with a resin number (1 to 7).
            </p>
            <p>
              • If clothing, check the inside hip seam for the fabric content tag (e.g. 100% cotton vs polyester).
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
          className="text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
        >
          ← Edit Photo & Description
        </Link>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-pill bg-emerald-primary text-forest-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-md focus-ring"
        >
          <span>Continue to Personalization</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
