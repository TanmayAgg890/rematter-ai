"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { ProjectPlan, ReuseIdea } from "@/types"
import { FIXTURE_ITEMS } from "@/data/fixtures"
import { ProductReferenceCard } from "@/components/ui/product-reference-card"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Coins, 
  Wrench, 
  AlertTriangle, 
  Check, 
  ExternalLink, 
  Recycle, 
  RotateCcw,
  Sparkles,
  Flag,
  Search,
  RotateCw
} from "lucide-react"

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

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
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false)

  // Find the idea object
  const currentIdea: ReuseIdea | undefined = 
    ideas.find((i) => i.id === ideaId) ||
    Object.values(FIXTURE_ITEMS)
      .flatMap((f) => f.candidateIdeas)
      .find((i) => i.id === ideaId)

  // Restore progress from persistent store on mount
  React.useEffect(() => {
    const savedProg = projectProgress[ideaId]
    if (savedProg) {
      setActiveStep(savedProg.currentStep)
      setCompletedSteps(savedProg.completedStepIds || [])
      setIsCompleted(savedProg.isCompleted || false)
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
        <h2 className="text-xl font-bold text-white mb-2">Project Plan Not Found</h2>
        <p className="text-sm text-platinum mb-6">
          The requested idea could not be located in your current session.
        </p>
        <Link
          href="/results"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mocha text-white text-xs font-semibold hover:bg-mocha-hover transition-colors shadow-sm"
        >
          Return to Recommendations
        </Link>
      </div>
    )
  }

  const isSaved = savedIdeaIds.includes(ideaId)
  const totalSteps = plan?.steps?.length || 5
  const progressPercent = Math.round((completedSteps.length / Math.max(totalSteps, 1)) * 100)

  // Step completion toggle with instant state and persistent store sync
  const handleToggleStepComplete = (stepNum: number) => {
    let updated: number[]
    if (completedSteps.includes(stepNum)) {
      updated = completedSteps.filter((s) => s !== stepNum)
    } else {
      updated = [...completedSteps, stepNum]
    }
    setCompletedSteps(updated)
    const allDone = updated.length >= totalSteps
    setIsCompleted(allDone)

    updateProjectProgress(ideaId, {
      completedStepIds: updated,
      currentStep: stepNum,
      totalSteps,
      isCompleted: allDone,
    })
  }

  const handleResetProgress = () => {
    setCompletedSteps([])
    setIsCompleted(false)
    setActiveStep(1)
    setResetConfirmOpen(false)

    updateProjectProgress(ideaId, {
      completedStepIds: [],
      currentStep: 1,
      isCompleted: false,
    })
  }

  const handleMarkProjectCompleted = () => {
    const allStepNums = plan?.steps?.map(s => s.stepNumber) || [1, 2, 3, 4, 5]
    setCompletedSteps(allStepNums)
    setIsCompleted(true)
    updateProjectProgress(ideaId, {
      completedStepIds: allStepNums,
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

  const projectTitle = plan?.title || currentIdea?.title || "Reclaimed Item Project"
  const projectDescription = plan?.outcome || currentIdea?.description || ""
  const searchQuery = encodeURIComponent(`${projectTitle} DIY tutorial step by step`)
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/results"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Ideas</span>
        </Link>

        {completedSteps.length > 0 && (
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-platinum/70 hover:text-platinum focus-ring"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>

      {/* Confirmation modal for Reset Progress */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#211D1C] border border-white/20 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-base font-bold text-white mb-2">Reset step progress?</h3>
            <p className="text-xs text-platinum mb-5 leading-relaxed">
              This will uncheck all marked steps for this project.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-full text-xs text-platinum hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section A: Product Title & Category */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider border border-lavender-accent/30">
              {currentIdea?.category || "Project Plan"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-platinum text-xs font-bold uppercase border border-white/10">
              Level {currentIdea?.level || 1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSaveIdea(ideaId)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors focus-ring ${
                isSaved
                  ? "bg-mocha text-white border-lavender-accent"
                  : "bg-white/10 text-platinum border-white/10 hover:border-lavender-accent hover:text-white"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-lavender" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              title="Report incorrect or unsafe advice"
              className="p-1.5 rounded-full text-platinum hover:text-red-400 hover:bg-red-950/30 transition-colors focus-ring"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F3F3] mb-4">
          {projectTitle}
        </h1>

        {/* Section B: Short Description FIRST */}
        <p className="text-platinum text-sm leading-relaxed mb-6">
          {projectDescription}
        </p>

        {/* Quick Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-lavender-accent" /> Prep Time
            </span>
            <span className="font-semibold text-white">
              {plan?.prepTimeMinutes || 5} mins
            </span>
          </div>

          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-lavender-accent" /> Execution
            </span>
            <span className="font-semibold text-white">
              {plan?.executionTimeMinutes || currentIdea?.estimatedMinutes || 25} mins
            </span>
          </div>

          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-lavender-accent" /> Extra Budget
            </span>
            <span className="font-semibold text-white">
              {plan?.budgetEstimate || "₹0 (Free)"}
            </span>
          </div>

          <div>
            <span className="text-platinum block mb-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-lavender-accent" /> Difficulty
            </span>
            <span className="font-semibold text-white capitalize">
              {plan?.difficulty || currentIdea?.difficulty || "Beginner"}
            </span>
          </div>
        </div>
      </div>

      {/* Section C: Real Product Reference Image (Replaces 3D model) */}
      <div className="mb-6">
        <ProductReferenceCard
          productTitle={projectTitle}
          materialCategory={currentIdea?.category}
          description={projectDescription}
          ideaId={ideaId}
        />
      </div>

      {/* Section D: YouTube Tutorial Search Link (Near top, before step instructions) */}
      <div className="mb-8 bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center shrink-0">
            <YoutubeIcon className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#F5F3F3] mb-1 flex items-center gap-2">
              Watch It Being Made
            </h2>
            <p className="text-xs text-platinum mb-3 leading-relaxed">
              Explore step-by-step video tutorials demonstrating this project on YouTube.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/10 text-xs mb-3">
              <Search className="w-3.5 h-3.5 text-platinum shrink-0" />
              <span className="text-platinum truncate font-mono">
                {decodeURIComponent(searchQuery)}
              </span>
            </div>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm focus-ring"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>Search Tutorial on YouTube</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <p className="text-[10px] text-platinum/60 mt-2 italic">
              YouTube Search link for verified relevant project builds
            </p>
          </div>
        </div>
      </div>

      {/* Section E: Materials & Tools Checklist (Already Have vs Need to Get) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Materials */}
        <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-platinum mb-4 flex items-center gap-2">
            <span>Materials Checklist</span>
          </h2>
          <ul className="space-y-2.5 text-xs">
            {plan?.materialsNeeded && plan.materialsNeeded.length > 0 ? (
              plan.materialsNeeded.map((m, i) => (
                <li key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-medium text-white">{m.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      m.alreadyHaveLikely
                        ? "bg-mocha/40 text-lavender border border-lavender-accent/30"
                        : "bg-amber-950/40 text-amber-300 border border-amber-600/30"
                    }`}
                  >
                    {m.alreadyHaveLikely ? "Already have" : "Need to get"}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-platinum italic">Only your primary reclaimed item</li>
            )}
          </ul>
        </div>

        {/* Tools */}
        <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-platinum mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-lavender-accent" />
            <span>Required Equipment</span>
          </h2>
          <ul className="space-y-2.5 text-xs">
            {plan?.toolsNeeded && plan.toolsNeeded.length > 0 ? (
              plan.toolsNeeded.map((t, i) => (
                <li key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-medium text-white">{t.name}</span>
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-platinum text-[10px] font-semibold border border-white/10">
                    Standard tool
                  </span>
                </li>
              ))
            ) : (
              <li className="text-platinum italic">No tools required (no-cut / zero-tool reuse)</li>
            )}
          </ul>
        </div>
      </div>

      {/* Section F: Step-by-Step Instructions & Interactive Completion Tracking */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-sm mb-8">
        {/* Progress Bar & Header */}
        <div className="pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-[#F5F3F3]">
              Step-by-Step Execution
            </h2>
            <span className="text-xs font-mono text-lavender-accent font-semibold">
              {completedSteps.length} of {totalSteps} completed ({progressPercent}%)
            </span>
          </div>

          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-mocha transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {plan?.steps && plan.steps.map((st) => {
            const isStepDone = completedSteps.includes(st.stepNumber)
            return (
              <div
                key={st.stepNumber}
                className={`p-5 rounded-xl border transition-all ${
                  isStepDone
                    ? "bg-mocha/20 border-lavender-accent/40 text-white"
                    : "bg-white/5 border-white/10 text-platinum"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border ${
                      isStepDone 
                        ? "bg-mocha text-white border-lavender-accent" 
                        : "bg-white/10 text-platinum border-white/15"
                    }`}>
                      {st.stepNumber}
                    </span>
                    <h3 className="text-base font-bold text-[#F5F3F3]">{st.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStepComplete(st.stepNumber)}
                    aria-label={`Mark step ${st.stepNumber} complete`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all focus-ring ${
                      isStepDone
                        ? "bg-mocha text-white border-lavender-accent shadow-sm"
                        : "bg-white/10 text-platinum border-white/10 hover:border-lavender-accent hover:text-white"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isStepDone ? "Completed ✓" : "Mark as Complete"}</span>
                  </button>
                </div>

                <p className="text-sm leading-relaxed pl-10 mb-3 text-platinum">
                  {st.instruction}
                </p>

                {/* Safety Warning */}
                {st.safetyWarning && (
                  <div className="ml-10 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Precaution:</strong> {st.safetyWarning}</span>
                  </div>
                )}

                {/* Pro-tip */}
                {st.tip && (
                  <div className="ml-10 text-xs text-lavender italic font-medium">
                    💡 Pro Tip: {st.tip}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion State */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-white bg-mocha/40 px-5 py-2.5 rounded-full border border-lavender-accent/40 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-lavender-accent" />
                <span>All steps completed! Great work circular maker.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleMarkProjectCompleted}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mocha hover:bg-mocha-hover text-white text-sm font-semibold transition-all shadow-md focus-ring border border-mocha-light/20"
              >
                <CheckCircle2 className="w-4 h-4 text-lavender" />
                <span>Mark All Steps Complete</span>
              </button>
            )}
          </div>

          <Link
            href="/recycling"
            className="text-xs font-semibold text-platinum hover:text-white inline-flex items-center gap-1.5 focus-ring"
          >
            <Recycle className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Recycling alternative if project is abandoned</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
