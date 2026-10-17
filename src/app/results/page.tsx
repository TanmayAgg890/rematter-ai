"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { ReuseIdea } from "@/types"
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
  ChevronRight, 
  Info,
  Filter,
  Recycle,
  Layers
} from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const { 
    ideas, 
    assessment, 
    preferences, 
    fallbackReason, 
    savedIdeaIds, 
    toggleSaveIdea,
    resetScan 
  } = useScanStore()

  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false)
  const [selectedIdeaForFeedback, setSelectedIdeaForFeedback] = React.useState<ReuseIdea | null>(null)
  const [feedbackReason, setFeedbackReason] = React.useState("Lacks required tools")
  const [feedbackSent, setFeedbackSent] = React.useState(false)
  const [hiddenIdeaIds, setHiddenIdeaIds] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
    }
  }, [assessment, router])

  if (!assessment) return null

  const visibleIdeas = ideas.filter((idea) => !hiddenIdeaIds.includes(idea.id))
  const hasFeasibleIdeas = visibleIdeas.length > 0 && !fallbackReason

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-borderLightSubtle dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-primary/10 text-emerald-primary dark:text-mint text-xs font-bold uppercase tracking-wider">
              Ranked Possibilities
            </span>
            <span className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
              Item: <strong className="text-textLightPrimary dark:text-textDarkPrimary">{assessment.detectedMaterial}</strong>
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary">
            Your Personalized Circular Pathways
          </h1>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Fallback Screen: When no DIY ideas fit constraints */}
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
              <span>Change My Tools & Budget Limits</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                resetScan()
                router.push("/scan")
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over with Another Item</span>
            </button>
          </div>
        </div>
      ) : (
        /* Idea Cards List */
        <div className="space-y-6">
          {visibleIdeas.map((idea, index) => {
            const isSaved = savedIdeaIds.includes(idea.id)
            const score = idea.feasibility.score
            const breakdown = idea.feasibility.breakdown

            return (
              <div
                key={idea.id}
                className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all p-6 sm:p-7 shadow-sm"
              >
                {/* Card Top: Badges & Rank */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-forest text-mint text-xs font-mono font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary text-xs font-bold uppercase tracking-wider">
                      {idea.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        idea.level === 1
                          ? "bg-emerald/15 dark:bg-emerald/20 text-emerald-800 dark:text-mint"
                          : idea.level === 2
                          ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                          : "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300"
                      }`}
                    >
                      Level {idea.level}
                    </span>
                    {idea.reviewStatus === "demo_fixture" && (
                      <span className="px-2 py-0.5 rounded bg-lime/40 text-forest text-[10px] font-semibold">
                        Demo fixture
                      </span>
                    )}
                  </div>

                  {/* Feasibility Pill */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-textLightPrimary dark:text-textDarkPrimary flex items-center gap-1 justify-end">
                        <span className="text-textLightSecondary dark:text-textDarkSecondary font-normal">Feasibility:</span>
                        <span className="text-emerald-primary font-bold">{score !== null ? `${score}/100` : "Assessing"}</span>
                      </div>
                      <span className="text-[11px] text-textLightSecondary dark:text-textDarkSecondary block">
                        {idea.feasibility.qualitativeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h2 className="text-xl font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
                  {idea.title}
                </h2>
                <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm leading-relaxed mb-4">
                  {idea.description}
                </p>

                {/* "Why This Fits You" */}
                <div className="p-3.5 rounded-xl bg-ivory/80 dark:bg-forest-elevated/80 border border-borderLightSubtle dark:border-white/10 mb-5 text-xs text-textLightPrimary dark:text-textDarkPrimary flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Why this fits your profile: </strong>
                    <span className="text-textLightSecondary dark:text-textDarkSecondary">{idea.whyThisFits}</span>
                  </div>
                </div>

                {/* Constraints Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-borderLightSubtle dark:border-white/10 mb-5 text-xs">
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
                          : `₹${idea.estimatedCostINR.min} - ₹${idea.estimatedCostINR.max} (est.)`
                        : "₹0"}
                    </span>
                  </div>

                  <div>
                    <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Tools Needed
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

                {/* Feasibility Breakdown Bars */}
                {breakdown && (
                  <div className="mb-5 bg-slate-50 dark:bg-forest-elevated/40 p-4 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                    <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary block mb-1">
                      Deterministic Feasibility Factor Breakdown:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textLightSecondary dark:text-textDarkSecondary">Tools (25%)</span>
                          <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary">{Math.round(breakdown.tool * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-primary" style={{ width: `${breakdown.tool * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textLightSecondary dark:text-textDarkSecondary">Budget (20%)</span>
                          <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary">{Math.round(breakdown.budget * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-primary" style={{ width: `${breakdown.budget * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textLightSecondary dark:text-textDarkSecondary">Skill (20%)</span>
                          <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary">{Math.round(breakdown.skill * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-primary" style={{ width: `${breakdown.skill * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textLightSecondary dark:text-textDarkSecondary">Time (15%)</span>
                          <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary">{Math.round(breakdown.time * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-primary" style={{ width: `${breakdown.time * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textLightSecondary dark:text-textDarkSecondary">Material (20%)</span>
                          <span className="font-mono font-medium text-textLightPrimary dark:text-textDarkPrimary">{Math.round(breakdown.material * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-primary" style={{ width: `${breakdown.material * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Safety Notes if any */}
                {idea.safetyNotes && idea.safetyNotes.length > 0 && (
                  <div className="mb-5 flex items-start gap-2 text-xs text-amber-950 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Safety Precaution: </strong>
                      <span>{idea.safetyNotes[0]}</span>
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSaveIdea(idea.id)}
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
                      onClick={() => handleOpenFeedback(idea)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-textLightSecondary dark:text-textDarkSecondary hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800/40 transition-colors focus-ring"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Not Suitable for Me</span>
                    </button>
                  </div>

                  <Link
                    href={`/ideas/${idea.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-all shadow-sm hover:translate-x-0.5 focus-ring"
                  >
                    <span>View Full Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-mint" />
                  </Link>
                </div>
              </div>
            )
          })}
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
    </div>
  )
}
