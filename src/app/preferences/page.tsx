"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

  // Adaptive contextual question states based on detected material
  const [contextualAnswer, setContextualAnswer] = React.useState<string>("clean")

  React.useEffect(() => {
    if (!assessment) {
      router.push("/scan")
    }
  }, [assessment, router])

  if (!assessment) return null

  const category = assessment.category || "plastic"

  // Contextual question definition based on detected material
  const getContextualQuestion = () => {
    switch (category) {
      case "textile":
        return {
          title: "Clothing & Textile Wearability",
          subtitle: "What is the structural condition of this garment?",
          options: [
            { id: "wearable", label: "Wearable & intact", desc: "Suitable for direct use, repair, or gentle upcycling" },
            { id: "slightly_damaged", label: "Slightly torn or missing buttons", desc: "Easy to patch, refashion, or hem" },
            { id: "heavily_damaged", label: "Heavily worn or frayed scraps", desc: "Best for rag strips, organizers, or textile recovery" },
            { id: "unknown", label: "Not sure / blend unknown", desc: "Broad circular options" },
          ],
        }
      case "plastic":
        return {
          title: "Plastic Container Sub-Type",
          subtitle: "What kind of plastic item is this?",
          options: [
            { id: "pet_bottle", label: "Transparent PET drink bottle", desc: "Clean beverage container, ideal for planters & funnels" },
            { id: "hdpe_jug", label: "Opaque milk / detergent jug (HDPE)", desc: "Rigid durable walls, scoop & organizer projects" },
            { id: "flexible_wrap", label: "Flexible packaging or film", desc: "Bag liner, wrapping, or MRF plastic recovery" },
            { id: "unknown", label: "Unknown / mixed plastic", desc: "Safe cut-free projects or recycling drop-off" },
          ],
        }
      case "paper_cardboard":
        return {
          title: "Cardboard Moisture & Food Cleanliness",
          subtitle: "Is the cardboard completely dry and grease-free?",
          options: [
            { id: "clean_dry", label: "Clean, dry, and rigid", desc: "Ideal for modular desk storage, dividers & craft" },
            { id: "damp_salvageable", label: "Slightly bent or damp but salvageable", desc: "Planter liners, seedling pots, or mulch" },
            { id: "greasy", label: "Soiled with food grease or oil", desc: "Cannot be recycled with dry paper; route to compost" },
            { id: "unknown", label: "Not sure", desc: "General cardboard reuse" },
          ],
        }
      case "glass":
        return {
          title: "Glass Structural Integrity",
          subtitle: "What is the condition of the glass container?",
          options: [
            { id: "intact_jar", label: "Intact food jar with lid", desc: "Safe for pantry storage, candle vessels & organizers" },
            { id: "intact_bottle", label: "Intact beverage bottle", desc: "Self-watering reservoirs & decorative reuse" },
            { id: "chipped", label: "Chipped rim or hairline crack", desc: "Do not cut at home; route to certified cullet recycling" },
            { id: "unknown", label: "Not sure", desc: "Safe handling guidance" },
          ],
        }
      default:
        return {
          title: "Material Sub-Characteristics",
          subtitle: "Tell us about any specific material qualities",
          options: [
            { id: "clean", label: "Clean and ready to work with", desc: "Zero additional prep required" },
            { id: "dirty", label: "Needs washing or de-labeling", desc: "Simple soak or brush cleaning" },
            { id: "parts_attached", label: "Mixed hardware attached (screws, tape)", desc: "Requires disassembly" },
            { id: "unknown", label: "Not sure", desc: "Standard guidance" },
          ],
        }
    }
  }

  const contextualQ = getContextualQuestion()

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
      extraConstraints: extraConstraints.trim() 
        ? `${extraConstraints.trim()} (Condition detail: ${contextualAnswer})` 
        : `Condition detail: ${contextualAnswer}`,
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
        throw new Error(data.error || "Failed to generate personalized ideas.")
      }

      setIdeas(data.data.ideas, data.data.fallbackMessage)
      router.push("/results")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Recommendations failed."
      setIdeasError(message)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-platinum mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-lavender-accent font-mono">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-mocha transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container (Translucent Glassmorphic) */}
      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-xl mb-6">
        {/* Step 1: Contextual Material Detail */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider border border-lavender-accent/30">
                Contextual Question
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-1">
              {contextualQ.title}
            </h2>
            <p className="text-platinum text-sm mb-6 leading-relaxed">
              {contextualQ.subtitle}
            </p>

            <div className="space-y-3">
              {contextualQ.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setContextualAnswer(opt.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between ${
                    contextualAnswer === opt.id
                      ? "bg-mocha/40 border-lavender-accent text-[#F5F3F3] shadow-sm"
                      : "bg-white/5 border-white/10 text-platinum hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{opt.label}</span>
                    <span className="text-xs text-platinum/80">{opt.desc}</span>
                  </div>
                  {contextualAnswer === opt.id && (
                    <Check className="w-5 h-5 text-lavender-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Available Tools */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-lavender-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-platinum">
                Available Tools
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-2">
              What tools do you actually have access to?
            </h2>
            <p className="text-platinum text-sm mb-6">
              We never recommend ideas requiring tools you don&apos;t own.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "household" as ToolAvailability,
                  title: "Household Scissors & Cleaners Only (Zero Tools)",
                  desc: "Scissors, utility tape, cotton string, soapy water. No power drills or saws.",
                },
                {
                  id: "basic_tools" as ToolAvailability,
                  title: "Basic Hand & DIY Tools",
                  desc: "Hammer, screwdrivers, hand drill, sandpaper, glue gun, small hand saw.",
                },
                {
                  id: "workshop" as ToolAvailability,
                  title: "Workshop / Community Makerspace",
                  desc: "Power tools, drill press, jigsaw, clamps, soldering iron, orbital sander.",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTools(t.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between ${
                    tools === t.id
                      ? "bg-mocha/40 border-lavender-accent text-[#F5F3F3] shadow-sm"
                      : "bg-white/5 border-white/10 text-platinum hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{t.title}</span>
                    <span className="text-xs text-platinum/80">{t.desc}</span>
                  </div>
                  {tools === t.id && (
                    <Check className="w-5 h-5 text-lavender-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget Tier */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-lavender-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-platinum">
                Additional Budget
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-2">
              What extra budget are you willing to spend?
            </h2>
            <p className="text-platinum text-sm mb-6">
              Many of the best circular solutions cost exactly ₹0.
            </p>

            <div className="space-y-3">
              {[
                { id: "free" as BudgetTier, title: "Strict ₹0 (Zero Added Cost)", desc: "Use only what you already have at home." },
                { id: "under_200" as BudgetTier, title: "Micro-Budget (Under ₹200)", desc: "Affordable hardware like twine, small glue, or seeds." },
                { id: "200_1000" as BudgetTier, title: "Small Project Budget (₹200 – ₹1,000)", desc: "Paint, specialty fasteners, or small hardware." },
                { id: "flexible" as BudgetTier, title: "Flexible Budget", desc: "Open to higher quality long-lasting builds." },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between ${
                    budget === b.id
                      ? "bg-mocha/40 border-lavender-accent text-[#F5F3F3] shadow-sm"
                      : "bg-white/5 border-white/10 text-platinum hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{b.title}</span>
                    <span className="text-xs text-platinum/80">{b.desc}</span>
                  </div>
                  {budget === b.id && (
                    <Check className="w-5 h-5 text-lavender-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-lavender-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-platinum">
                Primary Goal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-2">
              What outcome matters most to you?
            </h2>
            <p className="text-platinum text-sm mb-6">
              We rank suggestions according to your practical motivation.
            </p>

            <div className="space-y-3">
              {[
                { id: "useful" as ProjectGoal, title: "Functional Everyday Object", desc: "Organizers, planters, tools, storage items." },
                { id: "min_effort" as ProjectGoal, title: "Quick & Minimum Effort", desc: "Simple 10-minute repurpose or immediate reuse." },
                { id: "sellable" as ProjectGoal, title: "Aesthetic / Sellable Upcycle", desc: "High craft quality for home decor or gifting." },
                { id: "recycle" as ProjectGoal, title: "Clean & Certified Recycling", desc: "Route to authorized collection centers." },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between ${
                    goal === g.id
                      ? "bg-mocha/40 border-lavender-accent text-[#F5F3F3] shadow-sm"
                      : "bg-white/5 border-white/10 text-platinum hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{g.title}</span>
                    <span className="text-xs text-platinum/80">{g.desc}</span>
                  </div>
                  {goal === g.id && (
                    <Check className="w-5 h-5 text-lavender-accent shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Skill & Time Commitment */}
        {step === 5 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-lavender-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-platinum">
                Time & Skills
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#F5F3F3] mb-4">
              How much time and DIY skill do you have?
            </h2>

            {/* Time */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-platinum mb-2">
                Available Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "15_min" as TimeCommitment, label: "15 minutes" },
                  { id: "1_hour" as TimeCommitment, label: "Under 1 hour" },
                  { id: "few_hours" as TimeCommitment, label: "2–3 hours" },
                  { id: "multiple_days" as TimeCommitment, label: "Weekend craft" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTime(t.id)}
                    className={`p-3 rounded-xl text-xs font-semibold text-center transition-all border ${
                      time === t.id
                        ? "bg-mocha text-white border-lavender-accent"
                        : "bg-white/5 border-white/10 text-platinum hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-platinum mb-2">
                DIY Experience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "beginner" as ExperienceLevel, label: "Beginner" },
                  { id: "intermediate" as ExperienceLevel, label: "Intermediate" },
                  { id: "advanced" as ExperienceLevel, label: "Advanced" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setExperience(s.id)}
                    className={`p-3 rounded-xl text-xs font-semibold text-center transition-all border ${
                      experience === s.id
                        ? "bg-mocha text-white border-lavender-accent"
                        : "bg-white/5 border-white/10 text-platinum hover:bg-white/10"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {ideasError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{ideasError}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-platinum hover:text-white transition-colors focus-ring"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? "Back to Assessment" : "Previous Step"}</span>
        </button>

        {step < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mocha hover:bg-mocha-hover text-white text-xs font-bold transition-all shadow-md focus-ring border border-mocha-light/20"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4 text-platinum-light" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGeneratingIdeas}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-mocha hover:bg-mocha-hover text-white text-sm font-bold transition-all shadow-lg focus-ring border border-mocha-light/20 disabled:opacity-50"
          >
            {isGeneratingIdeas ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-lavender" />
                <span>Formulating Feasible Ideas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-lavender" />
                <span>Generate Tailored Ideas</span>
                <ArrowRight className="w-4 h-4 text-platinum-light" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
