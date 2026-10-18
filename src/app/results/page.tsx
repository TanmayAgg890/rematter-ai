"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { ReuseIdea } from "@/types"
import { Product3DPreview } from "@/components/ui/product-3d-preview"
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
  Info,
  Filter,
  Recycle,
  ChevronRight,
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
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-6 shadow-sm">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            idea.category === "reuse"
              ? "bg-emerald-primary/10 text-emerald-primary dark:text-mint"
              : idea.category === "repurpose"
              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
              : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
          }`}>
            {idea.category}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
            idea.level === 1
              ? "bg-emerald/15 dark:bg-emerald/20 text-emerald-800 dark:text-mint"
              : idea.level === 2
              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
              : "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300"
          }`}>
            Level {idea.level}
          </span>
          {idea.reviewStatus === "demo_fixture" && (
            <span className="px-2 py-0.5 rounded bg-lime/40 text-forest text-[10px] font-semibold">Demo</span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
          {idea.title}
        </h2>
        <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary leading-relaxed mb-4">
          {idea.description}
        </p>

        {/* Why this fits */}
        <div className="p-3.5 rounded-xl bg-ivory/80 dark:bg-forest-elevated/80 border border-borderLightSubtle dark:border-white/10 text-xs text-textLightPrimary dark:text-textDarkPrimary flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-primary shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Why this fits your profile: </strong>
            <span className="text-textLightSecondary dark:text-textDarkSecondary">{idea.whyThisFits}</span>
          </div>
        </div>
      </div>

      {/* ── Rotatable 3D Product Preview ── */}
      <Product3DPreview
        productTitle={idea.title}
        materialCategory={idea.category}
        description={idea.description}
      />

      {/* Quick Specs */}
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Est. Time
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}
            </span>
          </div>
          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Extra Cost
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {idea.estimatedCostINR
                ? idea.estimatedCostINR.max === 0
                  ? "₹0 (Free)"
                  : `₹${idea.estimatedCostINR.min}–₹${idea.estimatedCostINR.max}`
                : "₹0"}
            </span>
          </div>
          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> Tools
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary truncate block" title={idea.requiredTools.join(", ")}>
              {idea.requiredTools.length > 0 ? idea.requiredTools.slice(0, 2).join(", ") : "None"}
            </span>
          </div>
          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Difficulty
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary capitalize">
              {idea.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Feasibility Score */}
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-textLightPrimary dark:text-textDarkPrimary uppercase tracking-wider">
            Feasibility Breakdown
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-emerald-primary">
              {score !== null ? `${score}` : "—"}
            </span>
            <span className="text-xs text-textLightSecondary dark:text-textDarkSecondary">/100</span>
          </div>
        </div>

        {/* Score progress bar */}
        {score !== null && (
          <div className="mb-4">
            <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  score >= 70 ? "bg-emerald-primary" : score >= 40 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-textLightSecondary dark:text-textDarkSecondary">{idea.feasibility.qualitativeLabel}</span>
            </div>
          </div>
        )}

        {breakdown && (
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { label: "Tools", key: "tool", weight: "25%" },
              { label: "Budget", key: "budget", weight: "20%" },
              { label: "Skill", key: "skill", weight: "20%" },
              { label: "Time", key: "time", weight: "15%" },
              { label: "Material", key: "material", weight: "20%" },
            ].map(({ label, key, weight }) => (
              <div key={key} className="text-center">
                <div className="text-[10px] text-textLightSecondary dark:text-textDarkSecondary mb-1">{label}</div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-emerald-primary" style={{ width: `${(breakdown as Record<string, number>)[key] * 100}%` }} />
                </div>
                <div className="text-[10px] font-mono text-textLightPrimary dark:text-textDarkPrimary">
                  {Math.round((breakdown as Record<string, number>)[key] * 100)}%
                </div>
                <div className="text-[9px] text-textLightSecondary dark:text-textDarkSecondary">w={weight}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Notes */}
      {idea.safetyNotes && idea.safetyNotes.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-950 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Safety: </strong>
            <span>{idea.safetyNotes[0]}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors focus-ring ${
              isSaved
                ? "bg-emerald-primary text-forest-950 border-emerald-primary"
                : "bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? "Saved" : "Save Idea"}</span>
          </button>

          <button
            type="button"
            onClick={onFeedback}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-textLightSecondary dark:text-textDarkSecondary hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800/40 transition-colors focus-ring"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Not for Me</span>
          </button>
        </div>

        <Link
          href={`/ideas/${idea.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-primary text-forest-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-sm focus-ring"
        >
          <span>View Full Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
      className={`w-full text-left p-4 rounded-2xl border transition-all focus-ring ${
        isSelected
          ? "bg-emerald-primary/5 dark:bg-emerald-primary/10 border-emerald-primary shadow-sm"
          : "bg-white dark:bg-forest-surface border-borderLightSubtle dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-5 h-5 rounded-full bg-forest text-mint text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            idea.category === "reuse"
              ? "bg-emerald-primary/10 text-emerald-primary dark:text-mint"
              : idea.category === "repurpose"
              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
              : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
          }`}>
            {idea.category}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-sm font-bold font-mono ${
            score !== null && score >= 70 ? "text-emerald-primary" :
            score !== null && score >= 40 ? "text-amber-500" : "text-red-400"
          }`}>
            {score !== null ? `${score}` : "—"}
          </span>
          <span className="text-[10px] text-textLightSecondary dark:text-textDarkSecondary">/100</span>
        </div>
      </div>

      <h3 className={`text-sm font-bold mb-1 ${
        isSelected
          ? "text-textLightPrimary dark:text-textDarkPrimary"
          : "text-textLightPrimary dark:text-textDarkPrimary"
      }`}>
        {idea.title}
      </h3>

      <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary line-clamp-2 leading-relaxed mb-2">
        {idea.description}
      </p>

      <div className="flex items-center gap-3 text-[10px] text-textLightSecondary dark:text-textDarkSecondary">
        {idea.estimatedMinutes && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {idea.estimatedMinutes}m
          </span>
        )}
        <span className="flex items-center gap-1">
          <Coins className="w-3 h-3" />
          {idea.estimatedCostINR?.max === 0 ? "Free" : `₹${idea.estimatedCostINR?.max || 0}`}
        </span>
        <span className="capitalize">{idea.difficulty}</span>
        {isSelected && (
          <span className="ml-auto flex items-center gap-1 text-emerald-primary font-semibold">
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

  // Default selection to first idea
  React.useEffect(() => {
    if (visibleIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(visibleIdeas[0].id)
    }
  }, [visibleIdeas, selectedIdeaId])

  // When an idea is hidden, re-select first visible
  React.useEffect(() => {
    if (selectedIdeaId && hiddenIdeaIds.includes(selectedIdeaId)) {
      const next = visibleIdeas.find(i => !hiddenIdeaIds.includes(i.id))
      setSelectedIdeaId(next?.id ?? null)
    }
  }, [hiddenIdeaIds, selectedIdeaId, visibleIdeas])

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
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-borderLightSubtle dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-primary/10 text-emerald-primary dark:text-mint text-xs font-bold uppercase tracking-wider">
              Ranked Possibilities
            </span>
            <span className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
              Material: <strong className="text-textLightPrimary dark:text-textDarkPrimary">{assessment?.detectedMaterial}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary">
            Your Personalized Circular Pathways
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {visibleIdeas.length > 1 && (
            <button
              type="button"
              onClick={() => setCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-primary/10 hover:bg-emerald-primary/20 text-emerald-primary border border-emerald-primary/30 text-xs font-semibold transition-colors focus-ring"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compare Top Ideas</span>
            </button>
          )}
          <Link
            href="/preferences"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
          >
            <Filter className="w-3.5 h-3.5 text-textLightSecondary dark:text-textDarkSecondary" />
            <span>Adjust Resources</span>
          </Link>
          <Link
            href="/recycling"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
          >
            <Recycle className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Recycling Center</span>
          </Link>
          <button
            type="button"
            onClick={() => { resetScan(); router.push("/scan") }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
          >
            <RotateCcw className="w-3.5 h-3.5 text-textLightSecondary dark:text-textDarkSecondary" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        </div>
      </div>

      {/* No Ideas Fallback */}
      {!hasFeasibleIdeas ? (
        <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-3">
            No Confident DIY Fit Found
          </h2>
          <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary leading-relaxed mb-6">
            {fallbackReason ||
              "We couldn't find a reuse idea that confidently fits your current tools, budget, and material condition. Let's find a better next step."}
          </p>
          <div className="space-y-3">
            <Link
              href="/recycling"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald-primary text-forest-950 font-semibold text-sm hover:bg-emerald-400 transition-colors shadow-sm focus-ring"
            >
              <Recycle className="w-4 h-4 text-forest-950" />
              <span>Find Authorized Recycling Drop-offs</span>
            </Link>
            <Link
              href="/preferences"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-ivory dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary border border-borderLightSubtle dark:border-white/10 font-semibold text-sm hover:border-emerald-primary transition-colors focus-ring"
            >
              <Filter className="w-4 h-4" />
              <span>Change My Tools &amp; Budget Limits</span>
            </Link>
            <button
              type="button"
              onClick={() => { resetScan(); router.push("/scan") }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over with Another Item</span>
            </button>
          </div>
        </div>
      ) : (
        /* Two-Column Layout */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left Panel: Scrollable Card List ── */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-primary" />
              <span className="text-xs font-bold text-textLightSecondary dark:text-textDarkSecondary uppercase tracking-wider">
                {visibleIdeas.length} idea{visibleIdeas.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <div className="space-y-3 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-1">
              {visibleIdeas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  isSelected={idea.id === selectedIdeaId}
                  onClick={() => setSelectedIdeaId(idea.id)}
                />
              ))}
            </div>
          </div>

          {/* ── Right Panel: Selected Idea Detail ── */}
          <div className="flex-1 min-w-0 lg:sticky lg:top-6">
            {selectedIdea ? (
              <IdeaDetailPanel
                idea={selectedIdea}
                isSaved={savedIdeaIds.includes(selectedIdea.id)}
                onToggleSave={() => toggleSaveIdea(selectedIdea.id)}
                onFeedback={() => handleOpenFeedback(selectedIdea)}
              />
            ) : (
              <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-12 text-center">
                <Info className="w-8 h-8 text-textLightSecondary dark:text-textDarkSecondary mx-auto mb-3" />
                <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary">
                  Select an idea from the left to see details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && selectedIdeaForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-forest-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-borderLightSubtle dark:border-white/10">
            <h3 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
              Why is this not suitable?
            </h3>
            <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary mb-4">
              Your feedback is stored for this session only to refine ranking and will never be used for generic AI training.
            </p>

            {feedbackSent ? (
              <div className="p-4 bg-emerald/10 text-emerald-800 dark:text-mint rounded-lg text-sm text-center font-medium">
                ✓ Feedback recorded. This idea has been removed from your list.
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-5">
                  {[
                    "Lacks required tools or equipment",
                    "Too expensive or requires extra purchases",
                    "Too complex or time-consuming",
                    "Safety or hygiene concern",
                    "Don't like the aesthetic outcome",
                  ].map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-borderLightSubtle dark:border-white/10 hover:bg-ivory dark:hover:bg-forest-elevated cursor-pointer text-xs text-textLightPrimary dark:text-textDarkPrimary"
                    >
                      <input
                        type="radio"
                        name="feedbackReason"
                        checked={feedbackReason === r}
                        onChange={() => setFeedbackReason(r)}
                        className="text-emerald-primary focus:ring-emerald-primary"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendFeedback}
                    className="px-5 py-2 rounded-full bg-emerald-primary text-forest-950 text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-sm focus-ring"
                  >
                    Submit Feedback
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Compare Ideas Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-forest-surface rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-borderLightSubtle dark:border-white/10 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-borderLightSubtle dark:border-white/10 mb-4">
              <div>
                <h3 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-primary" />
                  <span>Compare Top Circular Ideas</span>
                </h3>
                <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
                  Side-by-side evaluation across your constraints and feasibility factors
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-textLightSecondary dark:text-textDarkSecondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-borderLightSubtle dark:border-white/10">
                    <th className="p-3 font-semibold text-textLightSecondary dark:text-textDarkSecondary w-1/4">Criteria</th>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <th key={idea.id} className="p-3 font-bold text-textLightPrimary dark:text-textDarkPrimary w-1/4">
                        <span className="text-emerald-primary block text-[10px] uppercase font-mono">{idea.category}</span>
                        {idea.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLightSubtle dark:divide-white/5">
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Feasibility Match</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3">
                        <span className="font-bold text-sm text-emerald-primary font-mono">
                          {idea.feasibility.score !== null ? `${idea.feasibility.score}/100` : "—"}
                        </span>
                        <span className="block text-[10px] text-textLightSecondary dark:text-textDarkSecondary">
                          {idea.feasibility.qualitativeLabel}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Difficulty</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3 capitalize text-textLightPrimary dark:text-textDarkPrimary font-semibold">
                        {idea.difficulty} (Level {idea.level})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Est. Time</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3 text-textLightPrimary dark:text-textDarkPrimary">
                        {idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Extra Cost</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3 font-semibold text-textLightPrimary dark:text-textDarkPrimary">
                        {idea.estimatedCostINR?.max === 0 ? "₹0 (Free)" : `₹${idea.estimatedCostINR?.max || 0}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Required Tools</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3 text-textLightPrimary dark:text-textDarkPrimary">
                        {idea.requiredTools.length > 0 ? idea.requiredTools.join(", ") : "None"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Why It Fits</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3 text-[11px] text-textLightSecondary dark:text-textDarkSecondary leading-relaxed">
                        {idea.whyThisFits}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-textLightSecondary dark:text-textDarkSecondary">Action</td>
                    {visibleIdeas.slice(0, 3).map((idea) => (
                      <td key={idea.id} className="p-3">
                        <Link
                          href={`/ideas/${idea.id}`}
                          onClick={() => setCompareModalOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-primary text-forest-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                        >
                          <span>Open Guide</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
