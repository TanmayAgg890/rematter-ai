"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { ProjectPlan, ReuseIdea } from "@/types"
import { FIXTURE_ITEMS } from "@/data/fixtures"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Coins, 
  Wrench, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  ExternalLink, 
  Recycle, 
  RotateCcw,
  Sparkles,
  Flag,
  Share2
} from "lucide-react"

export default function IdeaPlanPage() {
  const params = useParams()
  const router = useRouter()
  const ideaId = params.id as string

  const { 
    ideas, 
    assessment, 
    preferences, 
    savedIdeaIds, 
    toggleSaveIdea,
    projectProgress,
    updateProjectProgress 
  } = useScanStore()

  const [plan, setPlan] = React.useState<ProjectPlan | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeStep, setActiveStep] = React.useState(1)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [reportReason, setReportReason] = React.useState("")
  const [reportSent, setReportSent] = React.useState(false)

  // Find the idea object
  const currentIdea: ReuseIdea | undefined = 
    ideas.find((i) => i.id === ideaId) ||
    Object.values(FIXTURE_ITEMS)
      .flatMap((f) => f.candidateIdeas)
      .find((i) => i.id === ideaId)

  // Restore progress from store if available
  React.useEffect(() => {
    const savedProg = projectProgress[ideaId]
    if (savedProg) {
      setActiveStep(savedProg.currentStep)
      setCompletedSteps(savedProg.completedStepIds)
      setIsCompleted(savedProg.isCompleted)
    }
  }, [ideaId, projectProgress])

  // Fetch or synthesize plan
  React.useEffect(() => {
    const loadPlan = async () => {
      setLoading(true)

      // 1. Check if a fixture plan exists
      for (const item of Object.values(FIXTURE_ITEMS)) {
        if (item.plans[ideaId]) {
          setPlan(item.plans[ideaId])
          setLoading(false)
          return
        }
      }

      // 2. Fetch from API or build
      if (currentIdea && assessment) {
        try {
          const res = await fetch("/api/ideas/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idea: currentIdea,
              assessment,
              preferences,
            }),
          })
          const data = await res.json()
          if (data.ok && data.data.plan) {
            setPlan(data.data.plan)
          }
        } catch (e) {
          console.error("Plan load error:", e)
        }
      }
      setLoading(false)
    }

    loadPlan()
  }, [ideaId, currentIdea, assessment, preferences])

  if (!currentIdea && !plan && !loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-textPrimary mb-2">Project Plan Not Found</h2>
        <p className="text-sm text-textSecondary mb-6">
          The requested idea could not be located in your current session.
        </p>
        <Link
          href="/results"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald/90 transition-colors shadow-sm"
        >
          Return to Recommendations
        </Link>
      </div>
    )
  }

  const isSaved = savedIdeaIds.includes(ideaId)

  const handleToggleStepComplete = (stepNum: number) => {
    let updated: number[]
    if (completedSteps.includes(stepNum)) {
      updated = completedSteps.filter((s) => s !== stepNum)
    } else {
      updated = [...completedSteps, stepNum]
    }
    setCompletedSteps(updated)
    updateProjectProgress(ideaId, {
      completedStepIds: updated,
      currentStep: activeStep,
    })
  }

  const handleMarkProjectCompleted = () => {
    setIsCompleted(true)
    updateProjectProgress(ideaId, {
      isCompleted: true,
      completedAt: new Date().toISOString(),
    })
  }

  const handleSendReport = async () => {
    if (!reportReason) return
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "incorrect_advice",
          targetId: ideaId,
          reason: reportReason,
        }),
      })
      setReportSent(true)
      setTimeout(() => {
        setReportModalOpen(false)
        setReportReason("")
        setReportSent(false)
      }, 1200)
    } catch {
      setReportModalOpen(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/results"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary transition-colors focus-ring"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Ideas</span>
        </Link>
      </div>

      {/* Plan Header */}
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-primary/10 text-emerald-primary dark:text-mint text-xs font-bold uppercase tracking-wider">
              {currentIdea?.category || "Project Plan"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary text-xs font-bold uppercase">
              Level {currentIdea?.level || 1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSaveIdea(ideaId)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors focus-ring ${
                isSaved
                  ? "bg-emerald-primary text-forest-950 border-emerald-primary"
                  : "bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              title="Report incorrect or unsafe advice"
              className="p-1.5 rounded-full text-textLightSecondary dark:text-textDarkSecondary hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800/40 transition-colors focus-ring"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-textLightPrimary dark:text-textDarkPrimary mb-3">
          {plan?.title || currentIdea?.title}
        </h1>

        <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm leading-relaxed mb-6">
          {plan?.outcome || currentIdea?.description}
        </p>

        {/* Quick Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-borderLightSubtle dark:border-white/10 text-xs">
          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Prep Time
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {plan?.prepTimeMinutes || 5} mins
            </span>
          </div>

          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Execution
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {plan?.executionTimeMinutes || currentIdea?.estimatedMinutes || 25} mins
            </span>
          </div>

          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Extra Budget
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary">
              {plan?.budgetEstimate || "₹0 (Free)"}
            </span>
          </div>

          <div>
            <span className="text-textLightSecondary dark:text-textDarkSecondary block mb-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Difficulty
            </span>
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary capitalize">
              {plan?.difficulty || currentIdea?.difficulty || "Beginner"}
            </span>
          </div>
        </div>
      </div>

      {/* Materials & Tools Needed ("Already Have vs Need to Get") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Materials */}
        <div className="bg-white dark:bg-forest-surface p-6 rounded-2xl border border-borderLightSubtle dark:border-white/10 shadow-sm">
          <h2 className="text-sm font-bold text-textLightPrimary dark:text-textDarkPrimary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>Materials Checklist</span>
          </h2>
          <ul className="space-y-2.5 text-xs">
            {plan?.materialsNeeded && plan.materialsNeeded.length > 0 ? (
              plan.materialsNeeded.map((m, i) => (
                <li key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-ivory/60 dark:bg-forest-elevated/60 border border-borderLightSubtle dark:border-white/10">
                  <span className="font-medium text-textLightPrimary dark:text-textDarkPrimary">{m.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      m.alreadyHaveLikely
                        ? "bg-emerald/15 dark:bg-emerald/20 text-emerald-800 dark:text-mint"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    {m.alreadyHaveLikely ? "Already have" : "Need to get"}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-textLightSecondary dark:text-textDarkSecondary italic">Only your primary reclaimed item</li>
            )}
          </ul>
        </div>

        {/* Tools */}
        <div className="bg-white dark:bg-forest-surface p-6 rounded-2xl border border-borderLightSubtle dark:border-white/10 shadow-sm">
          <h2 className="text-sm font-bold text-textLightPrimary dark:text-textDarkPrimary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-primary" />
            <span>Required Equipment</span>
          </h2>
          <ul className="space-y-2.5 text-xs">
            {plan?.toolsNeeded && plan.toolsNeeded.length > 0 ? (
              plan.toolsNeeded.map((t, i) => (
                <li key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-ivory/60 dark:bg-forest-elevated/60 border border-borderLightSubtle dark:border-white/10">
                  <span className="font-medium text-textLightPrimary dark:text-textDarkPrimary">{t.name}</span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary text-[10px] font-semibold">
                    Standard toolkit
                  </span>
                </li>
              ))
            ) : (
              <li className="text-textLightSecondary dark:text-textDarkSecondary italic">No tools required</li>
            )}
          </ul>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-borderLightSubtle dark:border-white/10 mb-6">
          <h2 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary">Numbered Execution Steps</h2>
          <span className="text-xs text-textLightSecondary dark:text-textDarkSecondary font-medium">
            {completedSteps.length} of {plan?.steps?.length || 0} completed
          </span>
        </div>

        <div className="space-y-6">
          {plan?.steps && plan.steps.map((st) => {
            const isStepDone = completedSteps.includes(st.stepNumber)
            return (
              <div
                key={st.stepNumber}
                className={`p-5 rounded-xl border transition-all ${
                  isStepDone
                    ? "bg-emerald/5 dark:bg-emerald/10 border-emerald/30 dark:border-emerald/40"
                    : "bg-ivory/40 dark:bg-forest-elevated/40 border-borderLightSubtle dark:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-forest-900 text-mint text-xs font-bold flex items-center justify-center shrink-0">
                      {st.stepNumber}
                    </span>
                    <h3 className="text-base font-bold text-textLightPrimary dark:text-textDarkPrimary">{st.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStepComplete(st.stepNumber)}
                    aria-label={`Mark step ${st.stepNumber} complete`}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-colors focus-ring ${
                      isStepDone
                        ? "bg-emerald-primary text-forest-950 border-emerald-primary"
                        : "bg-white dark:bg-forest-elevated text-textLightSecondary dark:text-textDarkSecondary border-borderLightSubtle dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isStepDone ? "Done" : "Mark Done"}</span>
                  </button>
                </div>

                <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary leading-relaxed pl-10 mb-3">
                  {st.instruction}
                </p>

                {/* Safety Warning if present */}
                {st.safetyWarning && (
                  <div className="ml-10 p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Precaution:</strong> {st.safetyWarning}</span>
                  </div>
                )}

                {/* Pro-tip if present */}
                {st.tip && (
                  <div className="ml-10 text-xs text-emerald-primary dark:text-mint italic font-medium">
                    💡 Tip: {st.tip}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion Action */}
        <div className="mt-8 pt-6 border-t border-borderLightSubtle dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-mint bg-emerald/10 px-4 py-2 rounded-full border border-emerald/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
                <span>Project marked completed!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleMarkProjectCompleted}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-primary text-forest-950 text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-sm focus-ring"
              >
                <CheckCircle2 className="w-4 h-4 text-forest-950" />
                <span>Mark Project as Completed</span>
              </button>
            )}
          </div>

          <Link
            href="/recycling"
            className="text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary inline-flex items-center gap-1.5 focus-ring"
          >
            <Recycle className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Recycling alternative if you abandon project</span>
          </Link>
        </div>
      </div>

      {/* Safety & Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-forest-surface p-6 rounded-2xl border border-borderLightSubtle dark:border-white/10 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Safety Checklist</span>
          </h3>
          <ul className="space-y-2 text-xs text-textLightSecondary dark:text-textDarkSecondary">
            {plan?.safetyChecklist && plan.safetyChecklist.map((sc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span>{sc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-forest-surface p-6 rounded-2xl border border-borderLightSubtle dark:border-white/10 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textLightPrimary dark:text-textDarkPrimary mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary" />
            <span>Common Pitfalls to Avoid</span>
          </h3>
          <ul className="space-y-2 text-xs text-textLightSecondary dark:text-textDarkSecondary">
            {plan?.commonMistakes && plan.commonMistakes.map((cm, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-textLightSecondary dark:text-textDarkSecondary font-bold">•</span>
                <span>{cm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-forest-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-borderLightSubtle dark:border-white/10">
            <h3 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
              Report Incorrect or Unsafe Advice
            </h3>
            <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary mb-4">
              Help maintain strict safety and material fidelity. Tell us what is incorrect about this plan.
            </p>

            {reportSent ? (
              <div className="p-4 bg-emerald/10 text-emerald-800 dark:text-mint rounded-lg text-sm text-center font-medium">
                ✓ Report submitted. Thank you for keeping ReMatter safe.
              </div>
            ) : (
              <>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g. Chemical incompatibility, unsafe cutting instruction, impossible tool requirement..."
                  className="w-full px-3.5 py-2.5 text-xs border border-borderLightSubtle dark:border-white/10 bg-white dark:bg-forest-elevated rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-primary text-textLightPrimary dark:text-textDarkPrimary placeholder:text-textLightSecondary/60 dark:placeholder:text-textDarkSecondary/60"
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReport}
                    className="px-5 py-2 rounded-full bg-danger text-white text-xs font-semibold shadow-sm focus-ring"
                  >
                    Send Report
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
