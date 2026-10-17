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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-borderLight">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald text-xs font-bold uppercase tracking-wider">
              Ranked Possibilities
            </span>
            <span className="text-xs text-textSecondary">
              Item: <strong className="text-textPrimary">{assessment.detectedMaterial}</strong>
            </span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-textPrimary">
            Your Personalized Circular Pathways
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/preferences"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-borderLight text-xs font-semibold text-textPrimary hover:border-emerald transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-textSecondary" />
            <span>Adjust Resources</span>
          </Link>
          <Link
            href="/recycling"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-borderLight text-xs font-semibold text-textPrimary hover:border-emerald transition-colors"
          >
            <Recycle className="w-3.5 h-3.5 text-emerald" />
            <span>Recycling Center</span>
          </Link>
        </div>
      </div>

      {/* Fallback Screen: When no DIY ideas fit constraints */}
      {!hasFeasibleIdeas ? (
        <div className="bg-white rounded-2xl border border-borderLight p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-textPrimary mb-3">
            No Confident DIY Fit Found
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed mb-6">
            {fallbackReason ||
              "We couldn't find a reuse idea that confidently fits your current tools, budget, and material condition. Let's find a better next step."}
          </p>

          <div className="space-y-3">
            <Link
              href="/recycling"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald text-white font-semibold text-sm hover:bg-emerald/90 transition-colors shadow-sm"
            >
              <Recycle className="w-4 h-4 text-white" />
              <span>Find Authorized Recycling Drop-offs</span>
            </Link>

            <Link
              href="/preferences"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-ivory text-textPrimary border border-borderLight font-semibold text-sm hover:border-emerald transition-colors"
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
              className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary"
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
                className="bg-white rounded-2xl border border-borderLight hover:border-slate-300 transition-all p-6 sm:p-7 shadow-sm"
              >
                {/* Card Top: Badges & Rank */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-forest text-lime text-xs font-mono font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-textPrimary text-xs font-bold uppercase tracking-wider">
                      {idea.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        idea.level === 1
                          ? "bg-emerald/15 text-emerald-800"
                          : idea.level === 2
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
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
                      <div className="text-xs font-bold text-textPrimary flex items-center gap-1 justify-end">
                        <span className="text-textSecondary font-normal">Feasibility:</span>
                        <span className="text-emerald font-bold">{score !== null ? `${score}/100` : "Assessing"}</span>
                      </div>
                      <span className="text-[11px] text-textSecondary block">
                        {idea.feasibility.qualitativeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h2 className="text-xl font-bold text-textPrimary mb-2">
                  {idea.title}
                </h2>
                <p className="text-textSecondary text-sm leading-relaxed mb-4">
                  {idea.description}
                </p>

                {/* "Why This Fits You" */}
                <div className="p-3.5 rounded-xl bg-ivory/80 border border-borderLight mb-5 text-xs text-textPrimary flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Why this fits your profile: </strong>
                    <span className="text-textSecondary">{idea.whyThisFits}</span>
                  </div>
                </div>

                {/* Constraints Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-borderLight mb-5 text-xs">
                  <div>
                    <span className="text-textSecondary block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Est. Time
                    </span>
                    <span className="font-semibold text-textPrimary">
                      {idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}
                    </span>
                  </div>

                  <div>
                    <span className="text-textSecondary block mb-0.5 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> Extra Cost
                    </span>
                    <span className="font-semibold text-textPrimary">
                      {idea.estimatedCostINR
                        ? idea.estimatedCostINR.max === 0
                          ? "₹0 (Free)"
                          : `₹${idea.estimatedCostINR.min} - ₹${idea.estimatedCostINR.max} (est.)`
                        : "₹0"}
                    </span>
                  </div>

                  <div>
                    <span className="text-textSecondary block mb-0.5 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Tools Needed
                    </span>
                    <span className="font-semibold text-textPrimary truncate block" title={idea.requiredTools.join(", ")}>
                      {idea.requiredTools.length > 0 ? idea.requiredTools.slice(0, 2).join(", ") : "None"}
                    </span>
                  </div>

                  <div>
                    <span className="text-textSecondary block mb-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Difficulty
                    </span>
                    <span className="font-semibold text-textPrimary capitalize">
                      {idea.difficulty}
                    </span>
                  </div>
                </div>

                {/* Feasibility Breakdown Bars */}
                {breakdown && (
                  <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
                    <span className="font-semibold text-textPrimary block mb-1">
                      Deterministic Feasibility Factor Breakdown:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textSecondary">Tools (25%)</span>
                          <span className="font-mono font-medium text-textPrimary">{Math.round(breakdown.tool * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald" style={{ width: `${breakdown.tool * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textSecondary">Budget (20%)</span>
                          <span className="font-mono font-medium text-textPrimary">{Math.round(breakdown.budget * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald" style={{ width: `${breakdown.budget * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textSecondary">Skill (20%)</span>
                          <span className="font-mono font-medium text-textPrimary">{Math.round(breakdown.skill * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald" style={{ width: `${breakdown.skill * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textSecondary">Time (15%)</span>
                          <span className="font-mono font-medium text-textPrimary">{Math.round(breakdown.time * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald" style={{ width: `${breakdown.time * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-textSecondary">Material (20%)</span>
                          <span className="font-mono font-medium text-textPrimary">{Math.round(breakdown.material * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald" style={{ width: `${breakdown.material * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Safety Notes if any */}
                {idea.safetyNotes && idea.safetyNotes.length > 0 && (
                  <div className="mb-5 flex items-start gap-2 text-xs text-amber-900 bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
                        isSaved
                          ? "bg-emerald text-white border-emerald"
                          : "bg-white text-textPrimary border-borderLight hover:border-emerald"
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isSaved ? "Saved" : "Save Idea"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenFeedback(idea)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-textSecondary hover:text-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Not Suitable for Me</span>
                    </button>
                  </div>

                  <Link
                    href={`/ideas/${idea.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest/90 transition-all shadow-sm hover:translate-x-0.5"
                  >
                    <span>View Full Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-lime" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && selectedIdeaForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-borderLight">
            <h3 className="text-lg font-bold text-textPrimary mb-2">
              Why is this not suitable?
            </h3>
            <p className="text-xs text-textSecondary mb-4">
              Your feedback is stored for this session only to refine ranking and will never be used for generic AI training.
            </p>

            {feedbackSent ? (
              <div className="p-4 bg-emerald/10 text-emerald-800 rounded-lg text-sm text-center font-medium">
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
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-borderLight hover:bg-ivory cursor-pointer text-xs text-textPrimary"
                    >
                      <input
                        type="radio"
                        name="feedbackReason"
                        checked={feedbackReason === r}
                        onChange={() => setFeedbackReason(r)}
                        className="text-emerald focus:ring-emerald"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-textSecondary hover:text-textPrimary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendFeedback}
                    className="px-5 py-2 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald/90 transition-colors shadow-sm"
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
