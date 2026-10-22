"use client"

import * as React from "react"
import { 
  CheckCircle2, 
  XCircle, 
  Repeat, 
  Sparkles, 
  Recycle, 
  ArrowRight, 
  Wrench,
  HelpCircle
} from "lucide-react"

interface ScenarioDecision {
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
}

const SCENARIOS: ScenarioDecision[] = [
  {
    id: "clean-glass-jar",
    title: "Clean Glass Food Jar (Jam / Pickle)",
    material: "Flint Glass (#70 GL) with Steel Lid",
    condition: "Intact, clean, zero fractures",
    bestChoice: "reuse",
    whyBest: "Direct reuse preserves 100% of embodied manufacturing energy with zero thermal reprocessing or industrial melting required.",
    whyNotOthers: {
      repurpose: "Cutting or drilling glass at home introduces severe micro-fracture and silica splinter risks for negligible utility gain.",
      recycle: "Melting intact culinary glass in a furnace consumes substantial thermal energy compared to simply washing and refilling.",
    },
  },
  {
    id: "torn-denim-jeans",
    title: "Torn Denim Jeans (Worn Fabric)",
    material: "Woven Cotton Twill (100% Cellulose)",
    condition: "Ripped knees, intact back pockets & legs",
    bestChoice: "repurpose",
    whyBest: "Repurposing into a hanging wall pocket organizer or utility tool roll maximizes the high tensile strength of denim without needing a sewing machine.",
    whyNotOthers: {
      reuse: "No longer wearable as daily pants without substantial patching or alterations.",
      recycle: "Municipal textile shredding often downgrades long staple fibers into low-value insulation rather than retaining functional household utility.",
    },
  },
  {
    id: "corrugated-cardboard-box",
    title: "Dry Shipping Box (Amazon Cartons)",
    material: "Corrugated Kraft Fiberboard (PAP 20)",
    condition: "Dry, clean, rigid structure",
    bestChoice: "repurpose",
    whyBest: "Cardboard has excellent structural compressive strength. Turning it into custom modular drawer organizers costs ₹0 and eliminates buying plastic organizers.",
    whyNotOthers: {
      reuse: "Tape labels and shipping seals limit clean shipping reuse without re-taping.",
      recycle: "While cardboard is highly recyclable, keeping it in active household use delays energy-intensive pulping cycles.",
    },
  },
  {
    id: "swollen-lithium-battery",
    title: "Swollen Lithium-Ion Phone Battery",
    material: "Lithium Polymer Cell",
    condition: "Puffed/bulging, chemical gas build-up",
    bestChoice: "recycle",
    whyBest: "Safety is an eligibility gate: Swollen lithium cells are an immediate thermal runaway fire hazard. They must be routed directly to certified e-waste handlers.",
    whyNotOthers: {
      reuse: "Extremely dangerous. Pressurized internal gases can rupture and ignite spontaneously.",
      repurpose: "Never attempt DIY crafting, puncturing, or harvesting swollen battery packs.",
    },
  },
]

export function ExplainableDecisionMatrix() {
  const [activeScenarioId, setActiveScenarioId] = React.useState<string>(SCENARIOS[0].id)
  const [filterNoTools, setFilterNoTools] = React.useState(false)

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]

  const effectiveBestChoice = filterNoTools && activeScenario.bestChoice === "repurpose" 
    ? "reuse" 
    : activeScenario.bestChoice

  return (
    <section className="py-24 px-4 sm:px-6 bg-transparent text-[#F5F3F3] transition-colors duration-200">
      <div className="max-w-container mx-auto">
        {/* Eyebrow & Headline */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider inline-block mb-3 border border-lavender-accent/30">
            Explainable Circular Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-4 text-[#F5F3F3]">
            Why This, Not That?
          </h2>
          <p className="text-platinum text-base leading-relaxed">
            Most recycling advice treats every material identically. ReMatter AI deterministically evaluates material condition, energy preservation, and user constraints to justify the optimal circular pathway.
          </p>

          {/* Interactive constraint simulator toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 px-3.5 rounded-full bg-[#211D1C]/80 backdrop-blur-md border border-white/10 text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-lavender-accent" />
              Simulate Constraint:
            </span>
            <button
              type="button"
              onClick={() => setFilterNoTools(!filterNoTools)}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                filterNoTools 
                  ? "bg-mocha text-white shadow-sm border border-lavender-accent/40" 
                  : "bg-white/10 text-platinum border border-white/10"
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
                  ? "bg-mocha text-white shadow-md font-bold border border-lavender-accent/30"
                  : "bg-[#211D1C]/70 backdrop-blur-md text-platinum hover:text-white border border-white/10"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Explainable Decision Card */}
        <div className="rounded-2xl bg-[#211D1C]/80 backdrop-blur-md border border-white/15 p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          {/* Header row with material info and recommended badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-lavender-accent uppercase tracking-wider mb-1">
                <span>Material: {activeScenario.material}</span>
                <span>•</span>
                <span>Condition: {activeScenario.condition}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F3F3]">
                {activeScenario.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-platinum font-medium">ReMatter Verdict:</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                effectiveBestChoice === "reuse" 
                  ? "bg-mocha/40 text-lavender border border-lavender-accent/30"
                  : effectiveBestChoice === "repurpose"
                  ? "bg-mocha-deep text-platinum-light border border-mocha-light/30"
                  : "bg-red-950/40 text-red-300 border border-red-500/30"
              }`}>
                {effectiveBestChoice === "reuse" && <Repeat className="w-3.5 h-3.5 text-lavender" />}
                {effectiveBestChoice === "repurpose" && <Sparkles className="w-3.5 h-3.5 text-lavender-accent" />}
                {effectiveBestChoice === "recycle" && <Recycle className="w-3.5 h-3.5 text-red-400" />}
                <span>
                  {effectiveBestChoice === "reuse" ? "1. Direct Reuse" : effectiveBestChoice === "repurpose" ? "2. Creative Upcycle" : "3. Certified Recycle"}
                </span>
              </span>
            </div>
          </div>

          {/* Constraint Notice if simulated */}
          {filterNoTools && activeScenario.bestChoice === "repurpose" && (
            <div className="my-5 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong>Dynamic Constraint Adaptation:</strong> Normally, this item is best repurposed with tools. Because you selected <em>Zero Tools</em>, ReMatter AI demotes power-tool upcycling and prioritizes no-tool direct reuse or neighborhood drop-off.
              </div>
            </div>
          )}

          {/* The "Why This" Winner rationale */}
          <div className="my-6 p-5 rounded-xl bg-mocha-deep/40 border border-lavender-accent/30">
            <h4 className="text-sm font-bold text-lavender-accent flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Why This Pathway Wins:
            </h4>
            <p className="text-sm text-[#F5F3F3] leading-relaxed">
              {filterNoTools && activeScenario.bestChoice === "repurpose"
                ? "Directly clean and reuse as a simple floor riser or modular storage with zero fasteners required, respecting your zero-tool constraint."
                : activeScenario.whyBest}
            </p>
          </div>

          {/* The "Why NOT That" Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {activeScenario.bestChoice !== "reuse" && activeScenario.whyNotOthers.reuse && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Direct Reuse:</span>
                </div>
                <p className="text-xs text-platinum leading-relaxed">
                  {activeScenario.whyNotOthers.reuse}
                </p>
              </div>
            )}

            {activeScenario.bestChoice !== "repurpose" && activeScenario.whyNotOthers.repurpose && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Repurposing / DIY:</span>
                </div>
                <p className="text-xs text-platinum leading-relaxed">
                  {activeScenario.whyNotOthers.repurpose}
                </p>
              </div>
            )}

            {activeScenario.bestChoice !== "recycle" && activeScenario.whyNotOthers.recycle && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Why NOT Immediate Recycling:</span>
                </div>
                <p className="text-xs text-platinum leading-relaxed">
                  {activeScenario.whyNotOthers.recycle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
