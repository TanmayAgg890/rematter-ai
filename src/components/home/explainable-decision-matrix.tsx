"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Repeat, 
  Recycle, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Wrench, 
  Flame, 
  Leaf, 
  Zap, 
  Clock, 
  Coins 
} from "lucide-react"

interface DecisionScenario {
  id: string
  title: string
  material: string
  condition: string
  bestChoice: "reuse" | "repurpose" | "recycle"
  whyBest: string
  whyNotOthers: {
    reuse?: string
    repurpose?: string
    recycle?: string
  }
  metrics: {
    energyPreserved: string
    toolDifficulty: "None" | "Beginner Hand Tools" | "Specialized Hub"
    costEstimate: string
    safetyStatus: "Safe At Home" | "Requires Ventilation" | "Hazardous (Pro Only)"
  }
}

const SCENARIOS: DecisionScenario[] = [
  {
    id: "glass-bottle",
    title: "Clean Glass Beverage Bottle",
    material: "Type 71 Soda-lime Glass",
    condition: "Intact, clean, label removable",
    bestChoice: "reuse",
    whyBest: "Direct reuse preserves 100% of the embedded energy with zero carbon emissions. Clean glass needs no structural alteration to store food, beverages, or dry goods.",
    whyNotOthers: {
      repurpose: "Cutting or drilling glass at home requires diamond tile drill bits, water cooling, and carries risk of micro-shards.",
      recycle: "Recycling requires transporting to an industrial facility and reheating to 1,400°C in a furnace. Direct reuse bypasses this energy cost entirely.",
    },
    metrics: {
      energyPreserved: "100%",
      toolDifficulty: "None",
      costEstimate: "₹0",
      safetyStatus: "Safe At Home",
    },
  },
  {
    id: "wooden-pallet",
    title: "Discarded Shipping Pallet (HT)",
    material: "Heat-Treated Solid Pine",
    condition: "Weathered, sturdy, heat-treated (HT stamp)",
    bestChoice: "repurpose",
    whyBest: "Creative repurposing converts solid timber into high-utility furniture, raised planters, or shelving, saving ₹2,000+ in raw timber costs with basic hand saw and sandpaper.",
    whyNotOthers: {
      reuse: "Direct reuse as a pallet requires warehouse logistics and forklift infrastructure, which is not viable for home users.",
      recycle: "Chipping into particle board downcycles high-quality dimensional lumber prematurely.",
    },
    metrics: {
      energyPreserved: "92%",
      toolDifficulty: "Beginner Hand Tools",
      costEstimate: "< ₹200 (hardware)",
      safetyStatus: "Requires Ventilation",
    },
  },
  {
    id: "lithium-battery",
    title: "Swollen Lithium-Ion Battery",
    material: "LiCoO2 / NMC Chemistry",
    condition: "Puffed casing, degraded capacity",
    bestChoice: "recycle",
    whyBest: "Authorized recycling is the ONLY safe pathway. CPCB-certified e-waste recyclers discharge batteries under inert conditions and safely recover lithium, cobalt, and nickel.",
    whyNotOthers: {
      reuse: "NEVER reuse a swollen cell. Thermal runaway can generate explosive flames over 600°C within seconds.",
      repurpose: "Strict deterministic safety gate: ReMatter strictly forbids all DIY projects involving damaged or swollen chemical batteries.",
    },
    metrics: {
      energyPreserved: "70% (raw elements)",
      toolDifficulty: "Specialized Hub",
      costEstimate: "Free drop-off",
      safetyStatus: "Hazardous (Pro Only)",
    },
  },
  {
    id: "cotton-denim",
    title: "Worn Cotton Denim Jeans",
    material: "100% Woven Cotton Twill",
    condition: "Torn knees, intact pockets and legs",
    bestChoice: "repurpose",
    whyBest: "High tensile denim twill makes indestructible tote bags, heat-resistant pot holders, or workshop apron organizers with basic needle and thread.",
    whyNotOthers: {
      reuse: "Cannot be worn directly without repair due to large tears.",
      recycle: "Mechanical textile shredding cuts fiber length, reducing resale value. Upcycling keeps long fiber strength intact.",
    },
    metrics: {
      energyPreserved: "88%",
      toolDifficulty: "Beginner Hand Tools",
      costEstimate: "₹0",
      safetyStatus: "Safe At Home",
    },
  },
]

export function ExplainableDecisionMatrix() {
  const [activeScenarioId, setActiveScenarioId] = React.useState<string>("glass-bottle")
  const [filterNoTools, setFilterNoTools] = React.useState(false)

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]

  // If user toggles "No Tools Available", demonstrate how the AI transparently adapts
  const effectiveBestChoice = filterNoTools && activeScenario.bestChoice === "repurpose" 
    ? "reuse" 
    : activeScenario.bestChoice

  return (
    <section className="py-24 px-4 sm:px-6 bg-white dark:bg-[#0B1713] text-textLightPrimary dark:text-[#F4F8F5] transition-colors duration-200">
      <div className="max-w-container mx-auto">
        {/* Eyebrow & Headline */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full bg-emerald-primary/10 text-emerald-primary text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Explainable Circular Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-4 text-textLightPrimary dark:text-[#F4F8F5]">
            Why This, Not That?
          </h2>
          <p className="text-textLightSecondary dark:text-[#C0CEC5] text-base leading-relaxed">
            Most recycling advice treats every material identically. ReMatter AI deterministically evaluates material condition, energy preservation, and user constraints to justify the optimal circular pathway.
          </p>

          {/* Interactive constraint simulator toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 px-3.5 rounded-full bg-ivory-soft dark:bg-forest-surface border border-borderLightSubtle dark:border-white/10 text-xs">
            <span className="font-semibold text-textLightPrimary dark:text-textDarkPrimary flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-primary" />
              Simulate Constraint:
            </span>
            <button
              type="button"
              onClick={() => setFilterNoTools(!filterNoTools)}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                filterNoTools 
                  ? "bg-emerald-primary text-forest-950 shadow-sm" 
                  : "bg-white dark:bg-[#18352A] text-textLightSecondary dark:text-[#C0CEC5] border border-borderLightSubtle dark:border-white/10"
              }`}
            >
              {filterNoTools ? "✓ 'I Have Zero Tools' Active" : "Click: Test 'I Have Zero Tools'"}
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenarioId(s.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-ring ${
                activeScenarioId === s.id
                  ? "bg-emerald-primary text-forest-950 shadow-md font-bold"
                  : "bg-ivory-soft dark:bg-[#102A22] text-textLightSecondary dark:text-[#C0CEC5] hover:text-textLightPrimary dark:hover:text-[#F4F8F5] border border-borderLightSubtle dark:border-white/10"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Explainable Decision Card */}
        <div className="rounded-2xl bg-white dark:bg-[#102A22] border border-borderLightSubtle dark:border-white/15 p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          {/* Header row with material info and recommended badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderLightSubtle dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-primary uppercase tracking-wider mb-1">
                <span>Material: {activeScenario.material}</span>
                <span>•</span>
                <span>Condition: {activeScenario.condition}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-textLightPrimary dark:text-[#F4F8F5]">
                {activeScenario.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-textLightSecondary dark:text-[#C0CEC5] font-medium">ReMatter Verdict:</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                effectiveBestChoice === "reuse" 
                  ? "bg-emerald-primary/15 text-emerald-primary border border-emerald-primary/30"
                  : effectiveBestChoice === "repurpose"
                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}>
                {effectiveBestChoice === "reuse" && <Repeat className="w-3.5 h-3.5" />}
                {effectiveBestChoice === "repurpose" && <Sparkles className="w-3.5 h-3.5" />}
                {effectiveBestChoice === "recycle" && <Recycle className="w-3.5 h-3.5" />}
                <span>
                  {effectiveBestChoice === "reuse" ? "1. Direct Reuse" : effectiveBestChoice === "repurpose" ? "2. Creative Upcycle" : "3. Certified Recycle"}
                </span>
              </span>
            </div>
          </div>

          {/* Constraint Notice if simulated */}
          {filterNoTools && activeScenario.bestChoice === "repurpose" && (
            <div className="my-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Dynamic Constraint Adaptation:</strong> Normally, this item is best repurposed with tools. Because you selected <em>Zero Tools</em>, ReMatter AI demotes power-tool upcycling and prioritizes no-tool direct reuse or neighborhood drop-off.
              </div>
            </div>
          )}

          {/* The "Why This" Winner rationale */}
          <div className="my-6 p-5 rounded-xl bg-emerald-primary/5 dark:bg-[#18352A]/60 border border-emerald-primary/20">
            <h4 className="text-sm font-bold text-emerald-primary flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Why This Pathway Wins:
            </h4>
            <p className="text-sm text-textLightPrimary dark:text-[#F4F8F5] leading-relaxed">
              {filterNoTools && activeScenario.bestChoice === "repurpose"
                ? "Directly clean and reuse as a simple floor riser or modular storage with zero fasteners required, respecting your zero-tool constraint."
                : activeScenario.whyBest}
            </p>
          </div>

          {/* The "Why NOT That" Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {activeScenario.bestChoice !== "reuse" && activeScenario.whyNotOthers.reuse && (
              <div className="p-4 rounded-xl bg-ivory-soft dark:bg-[#0C1E17] border border-borderLightSubtle dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-500 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Direct Reuse:</span>
                </div>
                <p className="text-xs text-textLightSecondary dark:text-[#C0CEC5] leading-relaxed">
                  {activeScenario.whyNotOthers.reuse}
                </p>
              </div>
            )}

            {activeScenario.bestChoice !== "repurpose" && activeScenario.whyNotOthers.repurpose && (
              <div className="p-4 rounded-xl bg-ivory-soft dark:bg-[#0C1E17] border border-borderLightSubtle dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-500 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Repurposing / DIY:</span>
                </div>
                <p className="text-xs text-textLightSecondary dark:text-[#C0CEC5] leading-relaxed">
                  {activeScenario.whyNotOthers.repurpose}
                </p>
              </div>
            )}

            {activeScenario.bestChoice !== "recycle" && activeScenario.whyNotOthers.recycle && (
              <div className="p-4 rounded-xl bg-ivory-soft dark:bg-[#0C1E17] border border-borderLightSubtle dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Premature Recycling:</span>
                </div>
                <p className="text-xs text-textLightSecondary dark:text-[#C0CEC5] leading-relaxed">
                  {activeScenario.whyNotOthers.recycle}
                </p>
              </div>
            )}
          </div>

          {/* Key Feasibility & Ecological Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-borderLightSubtle dark:border-white/10 text-center">
            <div className="p-3 rounded-lg bg-ivory-soft dark:bg-[#081511]">
              <span className="block text-[11px] text-textLightSecondary dark:text-[#C0CEC5]/70 font-medium">Energy Preserved</span>
              <span className="text-base font-bold text-emerald-primary mt-0.5 block">
                {activeScenario.metrics.energyPreserved}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-ivory-soft dark:bg-[#081511]">
              <span className="block text-[11px] text-textLightSecondary dark:text-[#C0CEC5]/70 font-medium">Tool Barrier</span>
              <span className="text-xs font-bold text-textLightPrimary dark:text-[#F4F8F5] mt-1 block">
                {filterNoTools ? "None (Adapted)" : activeScenario.metrics.toolDifficulty}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-ivory-soft dark:bg-[#081511]">
              <span className="block text-[11px] text-textLightSecondary dark:text-[#C0CEC5]/70 font-medium">Estimated Cost</span>
              <span className="text-xs font-bold text-textLightPrimary dark:text-[#F4F8F5] mt-1 block">
                {activeScenario.metrics.costEstimate}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-ivory-soft dark:bg-[#081511]">
              <span className="block text-[11px] text-textLightSecondary dark:text-[#C0CEC5]/70 font-medium">Safety Assessment</span>
              <span className={`text-xs font-bold mt-1 block ${
                activeScenario.metrics.safetyStatus.includes("Hazardous") ? "text-rose-400" : "text-emerald-primary"
              }`}>
                {activeScenario.metrics.safetyStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Link */}
        <div className="mt-12 text-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-primary hover:text-emerald-400 transition-colors"
          >
            <span>Scan your own item to run this deterministic check</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
