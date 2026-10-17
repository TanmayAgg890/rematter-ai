"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { 
  UserPreferences, 
  ExperienceLevel, 
  ToolAvailability, 
  BudgetTier, 
  TimeCommitment, 
  ProjectGoal 
} from "@/types"
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Wrench, 
  Coins, 
  Clock, 
  Target, 
  GraduationCap,
  Loader2,
  AlertCircle
} from "lucide-react"

export default function PreferencesPage() {
  const router = useRouter()
  const { 
    preferences, 
    setPreferences, 
    assessment, 
    setIdeas, 
    isGeneratingIdeas, 
    setIsGeneratingIdeas, 
    ideasError, 
    setIdeasError 
  } = useScanStore()

  const [step, setStep] = React.useState(1)
  const totalSteps = 5

  const [experience, setExperience] = React.useState<ExperienceLevel>(preferences.experience)
  const [tools, setTools] = React.useState<ToolAvailability>(preferences.tools)
  const [budget, setBudget] = React.useState<BudgetTier>(preferences.budget)
  const [time, setTime] = React.useState<TimeCommitment>(preferences.time)
  const [goal, setGoal] = React.useState<ProjectGoal>(preferences.goal)
  const [extraConstraints, setExtraConstraints] = React.useState(preferences.extraConstraints || "")

  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
    }
  }, [assessment, router])

  if (!assessment) return null

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/assessment")
    }
  }

  const handleSubmit = async () => {
    const updatedPrefs: UserPreferences = {
      experience,
      tools,
      budget,
      time,
      goal,
      extraConstraints: extraConstraints.trim() || undefined,
    }

    setPreferences(updatedPrefs)
    setIsGeneratingIdeas(true)
    setIdeasError(null)

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment,
          preferences: updatedPrefs,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to generate recommendations.")
      }

      setIdeas(data.data.ideas, data.data.fallbackMessage)
      router.push("/results")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error contacting recommendation engine."
      setIdeasError(message)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-secondaryText mb-2">
          <span>Personalize Your Resources</span>
          <span>Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full h-1.5 bg-borderTone rounded-full overflow-hidden">
          <div
            className="h-full bg-leaf-green transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="bg-white rounded-card border border-borderTone p-6 sm:p-8 shadow-sm mb-6">
        {/* Step 1: Experience */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-leaf-green" />
              <h2 className="text-xl font-bold text-forest">What is your crafting / DIY experience?</h2>
            </div>
            <p className="text-secondaryText text-sm mb-6">
              ReMatter will never suggest complex joinery or dangerous tools to beginners.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "beginner",
                  label: "Beginner",
                  desc: "Comfortable with scissors, tape, and simple folding. No prior woodworking or craft training.",
                },
                {
                  id: "intermediate",
                  label: "Some Experience",
                  desc: "Familiar with manual hand tools, basic hand saws, hot glue, or basic sewing.",
                },
                {
                  id: "advanced",
                  label: "Experienced Maker",
                  desc: "Comfortable with power tools, soldering, precision joinery, or workshop machinery.",
                },
              ].map((opt) => {
                const selected = experience === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExperience(opt.id as ExperienceLevel)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                      selected
                        ? "border-leaf-green bg-lime-fresh/25 shadow-sm"
                        : "border-borderTone hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-forest text-sm block mb-1">{opt.label}</span>
                      <span className="text-xs text-secondaryText leading-relaxed">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-leaf-green border-leaf-green text-white" : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Tools */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-5 h-5 text-leaf-green" />
              <h2 className="text-xl font-bold text-forest">What tools do you have on hand?</h2>
            </div>
            <p className="text-secondaryText text-sm mb-6">
              Tool availability is our heaviest feasibility constraint (weight = 0.25).
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "household",
                  label: "Household Essentials Only",
                  desc: "Scissors, ruler, kitchen knife, cotton twine, basic glue or tape.",
                },
                {
                  id: "basic_tools",
                  label: "Basic Hand Toolkit",
                  desc: "Hammer, pliers, hand saw, screwdriver set, utility box-cutter, sandpaper.",
                },
                {
                  id: "workshop",
                  label: "Workshop / Specialized Equipment",
                  desc: "Drill press, angle grinder, sewing machine, soldering iron, or 3D printer.",
                },
              ].map((opt) => {
                const selected = tools === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTools(opt.id as ToolAvailability)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                      selected
                        ? "border-leaf-green bg-lime-fresh/25 shadow-sm"
                        : "border-borderTone hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-forest text-sm block mb-1">{opt.label}</span>
                      <span className="text-xs text-secondaryText leading-relaxed">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-leaf-green border-leaf-green text-white" : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-leaf-green" />
              <h2 className="text-xl font-bold text-forest">What is your extra budget for this project?</h2>
            </div>
            <p className="text-secondaryText text-sm mb-6">
              We strictly enforce ₹0 budgets by filtering out projects requiring purchases.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "free",
                  label: "₹0 (Strict Zero-Cost)",
                  desc: "Use only what you already have at home. Zero purchases required.",
                },
                {
                  id: "under_200",
                  label: "Under ₹200",
                  desc: "Willing to spend a small amount on screws, twine, adhesive, or potting soil.",
                },
                {
                  id: "200_1000",
                  label: "₹200 – ₹1,000",
                  desc: "Comfortable buying paint, fasteners, varnish, or specialized hardware.",
                },
                {
                  id: "flexible",
                  label: "Flexible",
                  desc: "Open to higher investment if creating a durable, sellable, or high-value piece.",
                },
              ].map((opt) => {
                const selected = budget === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBudget(opt.id as BudgetTier)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                      selected
                        ? "border-leaf-green bg-lime-fresh/25 shadow-sm"
                        : "border-borderTone hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-forest text-sm block mb-1">{opt.label}</span>
                      <span className="text-xs text-secondaryText leading-relaxed">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-leaf-green border-leaf-green text-white" : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Time Commitment */}
        {step === 4 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-leaf-green" />
              <h2 className="text-xl font-bold text-forest">How much time do you want to spend?</h2>
            </div>
            <p className="text-secondaryText text-sm mb-6">
              We penalize or filter out long multi-day builds if you just need a quick solution.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "15_min",
                  label: "~15 Minutes",
                  desc: "Quick modification, instant direct reuse, or fast functional adaptation.",
                },
                {
                  id: "1_hour",
                  label: "~1 Hour",
                  desc: "Single evening or weekend project with measuring, cutting, and assembly.",
                },
                {
                  id: "few_hours",
                  label: "A Few Hours",
                  desc: "Detailed project requiring drying, curing, multiple coats, or precision joints.",
                },
                {
                  id: "multiple_days",
                  label: "Multiple Days / Ongoing",
                  desc: "Comprehensive workshop craft or multi-stage circular build.",
                },
              ].map((opt) => {
                const selected = time === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTime(opt.id as TimeCommitment)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                      selected
                        ? "border-leaf-green bg-lime-fresh/25 shadow-sm"
                        : "border-borderTone hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-forest text-sm block mb-1">{opt.label}</span>
                      <span className="text-xs text-secondaryText leading-relaxed">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-leaf-green border-leaf-green text-white" : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 5: Goal & Extra Constraints */}
        {step === 5 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-leaf-green" />
              <h2 className="text-xl font-bold text-forest">What is your primary goal?</h2>
            </div>
            <p className="text-secondaryText text-sm mb-6">
              Aligning on purpose prevents useless clutter and ensures genuine value.
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  id: "useful",
                  label: "Make Something Useful for Home",
                  desc: "Practical organizers, planters, storage, or domestic utilities.",
                },
                {
                  id: "min_effort",
                  label: "Reduce Waste with Minimum Effort",
                  desc: "Fastest route to avoid landfill without complicated crafting.",
                },
                {
                  id: "sellable",
                  label: "Explore a Sellable / Giftable Product",
                  desc: "Aesthetic upcycled design suitable for craft markets or gifting.",
                },
                {
                  id: "recycle",
                  label: "Donate or Recycle Responsibly",
                  desc: "Prefer circular disposal and authorized processing facilities.",
                },
              ].map((opt) => {
                const selected = goal === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id as ProjectGoal)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between ${
                      selected
                        ? "border-leaf-green bg-lime-fresh/25 shadow-sm"
                        : "border-borderTone hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-forest text-sm block mb-1">{opt.label}</span>
                      <span className="text-xs text-secondaryText leading-relaxed">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-leaf-green border-leaf-green text-white" : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <div>
              <label htmlFor="extra" className="block text-xs font-semibold uppercase tracking-wider text-forest mb-1">
                Any specific room or constraint? (Optional)
              </label>
              <input
                id="extra"
                type="text"
                value={extraConstraints}
                onChange={(e) => setExtraConstraints(e.target.value)}
                placeholder="e.g. For kitchen herbs, no drilling into walls, compact balcony..."
                className="w-full px-4 py-2 rounded-lg border border-borderTone text-sm focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {ideasError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-danger text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{ideasError}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-pill text-xs font-semibold text-secondaryText hover:text-forest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {step < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-forest text-white text-sm font-semibold hover:bg-forest-800 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGeneratingIdeas}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-leaf-green text-white text-sm font-semibold hover:bg-leaf-600 transition-all shadow-md disabled:opacity-50"
          >
            {isGeneratingIdeas ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-lime-fresh" />
                <span>Computing Feasibility & Ranking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-lime-fresh" />
                <span>Show My Personalized Ideas</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
