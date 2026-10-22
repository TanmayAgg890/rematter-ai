"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { ReuseIdea } from "@/types"
import { ProductReferenceCard } from "@/components/ui/product-reference-card"
import { 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  ThumbsDown, 
  RotateCcw, 
  Wrench, 
  Coins, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2,
  Filter,
  Recycle,
  Eye,
  SlidersHorizontal,
  X
} from "lucide-react"

// ─── Idea Detail Panel ────────────────────────────────────────────────────────
function IdeaDetailPanel({ idea, isSaved, onToggleSave, onFeedback }: {
  idea: ReuseIdea
  isSaved: boolean
  onToggleSave: () => void
  onFeedback: () => void
}) {
  const score = idea.feasibility.score
  const breakdown = idea.feasibility.breakdown

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-sm">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            idea.category === "reuse"
              ? "bg-mocha/40 text-lavender border border-lavender-accent/30"
              : idea.category === "repurpose"
              ? "bg-mocha-deep text-platinum-light border border-mocha-light/30"
              : "bg-amber-950/40 text-amber-300 border border-amber-600/30"
          }`}>
            {idea.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/10 text-platinum border border-white/10">
            Level {idea.level}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-2">
          {idea.title}
        </h2>
        <p className="text-sm text-platinum leading-relaxed mb-4">
          {idea.description}
        </p>

        {/* Why this fits */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3F3] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-lavender-accent shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-white">Why this fits your profile: </strong>
            <span className="text-platinum">{idea.whyThisFits}</span>
          </div>
        </div>
      </div>

      {/* Real-World Reference Image (Replaces fake 3D viewer) */}
      <ProductReferenceCard
        productTitle={idea.title}
        materialCategory={idea.category}
        description={idea.description}
        ideaId={idea.id}
      />

      {/* Quick Specs */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-lavender-accent" /> Est. Time
            </span>
            <span className="font-semibold text-[#F5F3F3]">
              {idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}
            </span>
          </div>
          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-lavender-accent" /> Extra Cost
            </span>
            <span className="font-semibold text-[#F5F3F3]">
              {idea.estimatedCostINR
                ? idea.estimatedCostINR.max === 0
                  ? "₹0 (Free)"
                  : `₹${idea.estimatedCostINR.min}–₹${idea.estimatedCostINR.max}`
                : "₹0"}
            </span>
          </div>
          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-lavender-accent" /> Tools
            </span>
            <span className="font-semibold text-[#F5F3F3] truncate block" title={idea.requiredTools.join(", ")}>
              {idea.requiredTools.length > 0 ? idea.requiredTools.slice(0, 2).join(", ") : "None"}
            </span>
          </div>
          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-lavender-accent" /> Difficulty
            </span>
            <span className="font-semibold text-[#F5F3F3] capitalize">
              {idea.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Feasibility Score Breakdown */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#F5F3F3] uppercase tracking-wider">
            Feasibility Breakdown
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-display font-bold ${
              score !== null && score >= 70 ? "text-lavender-accent" :
              score !== null && score >= 40 ? "text-amber-400" : "text-red-400"
            }`}>
              {score !== null ? `${score}` : "—"}
            </span>
            <span className="text-xs text-platinum">/ 100</span>
          </div>
        </div>

        {breakdown && (
          <div className="space-y-2.5">
            {[
              { label: "Tool Availability", value: breakdown.tool, weight: "25%" },
              { label: "Budget Match", value: breakdown.budget, weight: "20%" },
              { label: "Skill Match", value: breakdown.skill, weight: "20%" },
              { label: "Time Feasibility", value: breakdown.time, weight: "15%" },
              { label: "Material Suitability", value: breakdown.material, weight: "20%" },
            ].map((factor) => (
              <div key={factor.label} className="text-xs">
                <div className="flex justify-between text-platinum mb-1">
                  <span>{factor.label} <span className="opacity-60 text-[10px]">({factor.weight})</span></span>
                  <span className="font-mono text-[#F5F3F3]">{Math.round((factor.value || 0) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-mocha transition-all"
                    style={{ width: `${(factor.value || 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Notes */}
      {idea.safetyNotes && idea.safetyNotes.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-200 bg-amber-950/30 p-3.5 rounded-xl border border-amber-600/40">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Safety: </strong>
            <span>{idea.safetyNotes[0]}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors focus-ring ${
              isSaved
                ? "bg-mocha text-white border-lavender-accent"
                : "bg-white/10 text-platinum border-white/10 hover:border-lavender-accent hover:text-white"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-lavender" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? "Saved" : "Save Idea"}</span>
          </button>

          <button
            type="button"
            onClick={onFeedback}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-platinum hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-colors focus-ring"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Not for Me</span>
          </button>
        </div>

        <Link
          href={`/ideas/${idea.id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-bold transition-all shadow-md focus-ring border border-mocha-light/20"
        >
          <span>View Full Guide & Instructions</span>
          <ArrowRight className="w-3.5 h-3.5 text-platinum-light" />
        </Link>
      </div>
    </div>
  )
}

// ─── Idea Card (Left Panel) ───────────────────────────────────────────────────
function IdeaCard({ idea, index, isSelected, onClick }: {
  idea: ReuseIdea
  index: number
  isSelected: boolean
  onClick: () => void
}) {
  const score = idea.feasibility.score

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all focus-ring backdrop-blur-md ${
        isSelected
          ? "bg-mocha/40 border-lavender-accent shadow-md text-[#F5F3F3]"
          : "bg-[#211D1C]/75 border-white/10 hover:border-white/20 text-platinum hover:text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-5 h-5 rounded-full bg-mocha-deep text-lavender text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border border-lavender-accent/30">
            {index + 1}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            idea.category === "reuse"
              ? "bg-mocha/30 text-lavender border border-lavender-accent/30"
              : idea.category === "repurpose"
              ? "bg-mocha-deep text-platinum-light"
              : "bg-amber-950/40 text-amber-300"
          }`}>
            {idea.category}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-sm font-bold font-mono ${
            score !== null && score >= 70 ? "text-lavender-accent" :
            score !== null && score >= 40 ? "text-amber-400" : "text-red-400"
          }`}>
            {score !== null ? `${score}` : "—"}
          </span>
          <span className="text-[10px] text-platinum/70">/100</span>
        </div>
      </div>

      <h3 className="text-sm font-bold mb-1 text-white">
        {idea.title}
      </h3>

      <p className="text-xs text-platinum line-clamp-2 leading-relaxed mb-2.5">
        {idea.description}
      </p>

      <div className="flex items-center gap-3 text-[10px] text-platinum/80">
        {idea.estimatedMinutes && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-lavender-accent" /> {idea.estimatedMinutes}m
          </span>
        )}
        <span className="flex items-center gap-1">
          <Coins className="w-3 h-3 text-lavender-accent" />
          {idea.estimatedCostINR?.max === 0 ? "Free" : `₹${idea.estimatedCostINR?.max || 0}`}
        </span>
        <span className="capitalize">{idea.difficulty}</span>
        {isSelected && (
          <span className="ml-auto flex items-center gap-1 text-lavender font-semibold">
            <Eye className="w-3 h-3" /> Viewing
          </span>
        )}
      </div>
    </button>
  )
}

// ─── Main Results Page ────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter()
  const { 
    ideas, 
    assessment, 
    fallbackReason, 
    savedIdeaIds, 
    toggleSaveIdea,
    resetScan 
  } = useScanStore()

  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false)
  const [selectedIdeaForFeedback, setSelectedIdeaForFeedback] = React.useState<ReuseIdea | null>(null)
  const [feedbackReason, setFeedbackReason] = React.useState("Lacks required tools or equipment")
  const [feedbackSent, setFeedbackSent] = React.useState(false)
  const [hiddenIdeaIds, setHiddenIdeaIds] = React.useState<string[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = React.useState<string | null>(null)
  const [compareModalOpen, setCompareModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
    }
  }, [assessment, router])

  const visibleIdeas = ideas.filter((idea) => !hiddenIdeaIds.includes(idea.id))
  const hasFeasibleIdeas = visibleIdeas.length > 0 && !fallbackReason

  React.useEffect(() => {
    if (visibleIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(visibleIdeas[0].id)
    }
  }, [visibleIdeas, selectedIdeaId])

  if (!assessment) return null

  const selectedIdea = visibleIdeas.find(i => i.id === selectedIdeaId) ?? visibleIdeas[0] ?? null

  const handleOpenFeedback = (idea: ReuseIdea) => {
    setSelectedIdeaForFeedback(idea)
    setFeedbackModalOpen(true)
    setFeedbackSent(false)
  }

  const handleSendFeedback = async () => {
    if (!selectedIdeaForFeedback) return
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "not_suitable",
          targetId: selectedIdeaForFeedback.id,
          reason: feedbackReason,
        }),
      })
      setHiddenIdeaIds((prev) => [...prev, selectedIdeaForFeedback.id])
      setFeedbackSent(true)
      setTimeout(() => {
        setFeedbackModalOpen(false)
        setSelectedIdeaForFeedback(null)
      }, 1000)
    } catch {
      setFeedbackModalOpen(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider border border-lavender-accent/30">
              Ranked Possibilities
            </span>
            <span className="text-xs text-platinum">
              Material: <strong className="text-white">{assessment?.detectedMaterial}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F3F3]">
            Your Personalized Circular Pathways
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {visibleIdeas.length > 1 && (
            <button
              type="button"
              onClick={() => setCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-mocha-surface hover:bg-mocha-deep text-lavender border border-lavender-accent/30 text-xs font-semibold transition-colors focus-ring"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-lavender-accent" />
              <span>Compare Top Ideas</span>
            </button>
          )}
          <Link
            href="/preferences"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
          >
            <Filter className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Adjust Resources</span>
          </Link>
          <Link
            href="/recycling"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
          >
            <Recycle className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Recycling Center</span>
          </Link>
          <button
            type="button"
            onClick={() => { resetScan(); router.push("/scan") }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5 text-platinum" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        </div>
      </div>

      {/* No Ideas Fallback */}
      {!hasFeasibleIdeas ? (
        <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-950/40 border border-amber-600/40 text-amber-300 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-[#F5F3F3] mb-3">
            No Confident DIY Fit Found
          </h2>
          <p className="text-sm text-platinum leading-relaxed mb-6">
            {fallbackReason ||
              "We couldn't find a reuse idea that confidently fits your current tools, budget, and material condition. Let's find a better next step."}
          </p>
          <div className="space-y-3">
            <Link
              href="/recycling"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-mocha hover:bg-mocha-hover text-white font-semibold text-sm transition-colors shadow-sm focus-ring border border-mocha-light/20"
            >
              <Recycle className="w-4 h-4 text-lavender" />
              <span>Find Authorized Recycling Drop-offs</span>
            </Link>
            <Link
              href="/preferences"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 font-semibold text-sm transition-colors focus-ring"
            >
              <Filter className="w-4 h-4 text-lavender-accent" />
              <span>Change My Tools & Budget Limits</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Two-Column Layout */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Panel: Scrollable Card List */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lavender-accent" />
              <span className="text-xs font-bold text-platinum uppercase tracking-wider">
                {visibleIdeas.length} idea{visibleIdeas.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <div className="space-y-3 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-1">
              {visibleIdeas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  isSelected={selectedIdea?.id === idea.id}
                  onClick={() => setSelectedIdeaId(idea.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel: Selected Idea Detail Panel with Real Product Reference Image */}
          <div className="flex-1 w-full min-w-0">
            {selectedIdea && (
              <IdeaDetailPanel
                idea={selectedIdea}
                isSaved={savedIdeaIds.includes(selectedIdea.id)}
                onToggleSave={() => toggleSaveIdea(selectedIdea.id)}
                onFeedback={() => handleOpenFeedback(selectedIdea)}
              />
            )}
          </div>
        </div>
      )}

      {/* Not Suitable Feedback Modal */}
      {feedbackModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#211D1C] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-[#F5F3F3]">Why is this not suitable?</h3>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-platinum hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedbackSent ? (
              <div className="py-6 text-center text-lavender-accent font-semibold text-sm">
                Feedback noted. Idea removed from this session.
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  "Lacks required tools or equipment",
                  "Material condition is unsuitable or degraded",
                  "Takes too much time",
                  "Not interested in this specific object",
                  "Safety or contamination concern",
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-platinum hover:bg-white/10 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="feedback-reason"
                      value={reason}
                      checked={feedbackReason === reason}
                      onChange={(e) => setFeedbackReason(e.target.value)}
                      className="text-mocha focus:ring-lavender-accent"
                    />
                    <span>{reason}</span>
                  </label>
                ))}

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs text-platinum hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendFeedback}
                    className="px-5 py-2 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-bold shadow-md"
                  >
                    Hide Idea
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
