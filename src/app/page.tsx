"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Sparkles, 
  Layers, 
  Repeat, 
  Recycle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  Shirt, 
  Trees, 
  Cpu, 
  Leaf, 
  Wrench, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Info 
} from "lucide-react"
import { HeroSection } from "@/components/hero/hero-section"
import { InteractiveWasteInput } from "@/components/home/interactive-waste-input"
import { MaterialClassifier } from "@/components/home/material-classifier"
import { ExplainableDecisionMatrix } from "@/components/home/explainable-decision-matrix"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/reveal"

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<"scan" | "classify">("scan")

  return (
    <div className="flex flex-col w-full bg-transparent transition-colors duration-200">
      {/* 1. Fluid Particles Hero Section */}
      <HeroSection />

      {/* 2. Tab Switcher: Scan vs Classify */}
      <div id="waste-input" className="bg-transparent">
        {/* Tab Bar */}
        <div className="max-w-container mx-auto px-4 sm:px-6 pt-6">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("scan")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all focus-ring ${
                activeTab === "scan"
                  ? "bg-mocha text-white shadow-sm border border-lavender-accent/30"
                  : "text-platinum hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-lavender" />
              Scan Your Waste
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("classify")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all focus-ring ${
                activeTab === "classify"
                  ? "bg-mocha text-white shadow-sm border border-lavender-accent/30"
                  : "text-platinum hover:text-white hover:bg-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-lavender" />
              Classify Your Items
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "scan" ? (
          <InteractiveWasteInput />
        ) : (
          <div className="max-w-container mx-auto px-4 sm:px-6 pb-12">
            <MaterialClassifier />
          </div>
        )}
      </div>

      {/* 3. Explore Materials (6 Supported Categories) */}
      <section className="py-24 bg-transparent text-[#F5F3F3] transition-colors duration-200">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-14">
            <span className="px-3.5 py-1 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider inline-block mb-3 border border-lavender-accent/30">
              Materials
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-4 text-[#F5F3F3]">
              Explore Material Possibilities
            </h2>
            <p className="text-platinum text-base">
              Each waste stream behaves differently. ReMatter evaluates material characteristics before proposing a pathway.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Plastic */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Plastic & Packaging</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Bottles, jugs, HDPE containers, bubble wraps. Evaluated for food-safety boundaries and mechanical cut stability.
              </p>
              <Link href="/explore?category=plastic" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore plastic ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Paper & Cardboard */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Paper & Cardboard</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Shipping cartons, kraft paper, pulp trays. Assessed for structural dry storage, custom dividers, and garden mulching.
              </p>
              <Link href="/explore?category=paper_cardboard" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore cardboard ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Textiles */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Textile & Worn Apparel</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Cotton tees, denim, linen scraps. Filtered for no-sew functional bags, shop rags, and fiber shredding.
              </p>
              <Link href="/explore?category=textile" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore textile ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Wood & Offcuts */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Reclaimed Wood & Pallets</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Clean pallets, timber offcuts, wooden crates. Screened for chemical treatment stamps (HT vs MB) and splinter risks.
              </p>
              <Link href="/explore?category=wood" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore wood ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Electronics */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Electronics & Cables</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Peripherals, charging cords, small enclosures. Safe component harvesting for makers, zero lithium battery tampering.
              </p>
              <Link href="/explore?category=electronic" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore e-waste ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Organics */}
            <div className="bg-[#211D1C]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-lavender-accent/40 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-mocha-deep border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Organic & Biomass</h3>
              <p className="text-sm text-platinum leading-relaxed mb-4">
                Coffee grounds, citrus peels, eggshells, garden clippings. Guided hot composting, natural odor absorbers, and soil amendments.
              </p>
              <Link href="/explore?category=organic" className="text-xs font-semibold text-lavender-accent hover:underline inline-flex items-center gap-1 focus-ring rounded">
                Explore organic ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Understand Your Options (3 Circular Pathways) */}
      <section className="py-24 px-4 sm:px-6 max-w-container mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider inline-block mb-3 border border-lavender-accent/30">
            Circularity
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F3F3] mb-4">
            Understand Your Options
          </h2>
          <p className="text-platinum text-base leading-relaxed">
            Not all circular paths are equal. ReMatter prioritizes retaining the highest material value with the least required energy.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Reuse */}
          <div className="bg-[#211D1C]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-lavender-accent/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mocha-deep text-lavender flex items-center justify-center mb-6 border border-lavender-accent/30">
                <Repeat className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-lavender text-xs font-bold uppercase mb-3 border border-white/10">
                Direct Utilization
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Direct Reuse
              </h3>
              <p className="text-sm text-platinum leading-relaxed mb-5">
                Using an item again for its original purpose or an identical utility without structural modification.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-platinum">
              <strong>Examples:</strong> Refilling glass jars, reusing sturdy delivery boxes, sanitizing spray bottles.
            </div>
          </div>

          {/* Repurpose */}
          <div className="bg-[#211D1C]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-lavender-accent/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mocha-deep text-lavender flex items-center justify-center mb-6 border border-lavender-accent/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-lavender text-xs font-bold uppercase mb-3 border border-white/10">
                Adaptive Upcycling
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Creative Repurposing
              </h3>
              <p className="text-sm text-platinum leading-relaxed mb-5">
                Modifying the shape or combining with other materials to create a completely new functional object.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-platinum">
              <strong>Examples:</strong> Pallet planters, denim tool rolls, acoustic panels from egg trays.
            </div>
          </div>

          {/* Recycle */}
          <div className="bg-[#211D1C]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col justify-between hover:border-lavender-accent/40 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mocha-deep text-lavender flex items-center justify-center mb-6 border border-lavender-accent/30">
                <Recycle className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-lavender text-xs font-bold uppercase mb-3 border border-white/10">
                Certified Recovery
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Authorized Recycling
              </h3>
              <p className="text-sm text-platinum leading-relaxed mb-5">
                Processing raw material through industrial recovery when DIY is unsafe, contaminated, or inefficient.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-platinum">
              <strong>Examples:</strong> Swollen lithium cells, PET pelletizing, municipal MRF recovery.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why This, Not That? (Explainable Circular Decisions) */}
      <ExplainableDecisionMatrix />

      {/* 6. Feasibility Framework (Explainable Math) */}
      <section id="feasibility" className="py-24 px-4 sm:px-6 bg-transparent border-y border-white/10 transition-colors duration-200">
        <div className="max-w-container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="px-3.5 py-1 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider inline-block mb-3 border border-lavender-accent/30">
              Explainable AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F3F3] mb-5">
              Feasibility is Not a Guess. It is a Mathematical Match.
            </h2>
            <p className="text-platinum text-base leading-relaxed mb-6">
              Most DIY apps suggest ideas that look impressive online but end up abandoned because you lack a drill press or spend more on glue than buying new.
            </p>
            <p className="text-platinum text-base leading-relaxed mb-6">
              ReMatter evaluates feasibility across 5 practical constraint factors:
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-lavender-accent mt-0.5 shrink-0" />
                <div className="text-sm text-platinum">
                  <strong className="text-white">Tool Factor (w = 0.25):</strong> Household scissors vs basic drills vs full workshop machinery.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-lavender-accent mt-0.5 shrink-0" />
                <div className="text-sm text-platinum">
                  <strong className="text-white">Budget Factor (w = 0.20):</strong> Strict ₹0 zero-cost upcycling vs optional small investments.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-lavender-accent mt-0.5 shrink-0" />
                <div className="text-sm text-platinum">
                  <strong className="text-white">Skill Level (w = 0.20):</strong> Beginner-friendly steps with zero specialized carpentry training.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-lavender-accent mt-0.5 shrink-0" />
                <div className="text-sm text-platinum">
                  <strong className="text-white">Time Investment (w = 0.15):</strong> 15-minute quick fixes vs multi-day craft builds.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-lavender-accent mt-0.5 shrink-0" />
                <div className="text-sm text-platinum">
                  <strong className="text-white">Material Suitability (w = 0.20):</strong> Structural integrity, contamination, and degradation.
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="bg-[#211D1C]/80 backdrop-blur-md text-[#F5F3F3] p-8 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs uppercase tracking-wider font-mono text-lavender font-semibold">Deterministic Formulation</span>
              <span className="text-xs text-platinum font-mono">Eq. 2</span>
            </div>

            <div className="bg-[#171515] p-5 rounded-xl border border-white/10 font-mono text-sm mb-6 text-center text-lavender-accent font-bold">
              S = 100 · Σ ( w_f · s_f )
            </div>

            <p className="text-xs text-platinum leading-relaxed mb-6">
              Where each factor score <code className="text-lavender font-mono font-semibold">s_f ∈ [0, 1]</code> is calculated against your stated resources. The composite score <code className="text-lavender font-mono font-semibold">S</code> is displayed only when inputs are known.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-lavender-accent mt-0.5 shrink-0" />
              <p className="text-xs text-platinum leading-relaxed">
                <strong className="text-white">Safety is an eligibility gate, never a score:</strong> If an idea violates safety boundaries (e.g. food contact with uncertified plastic, hazardous electronics), it is dropped completely regardless of score.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Safety and Responsible Use Callout */}
      <section id="responsible-recycling" className="py-20 px-4 sm:px-6 max-w-container mx-auto">
        <div className="bg-[#211D1C]/85 backdrop-blur-md text-[#F5F3F3] rounded-3xl p-8 sm:p-12 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 text-amber-300 border border-amber-600/30 text-xs font-semibold mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety & Responsible Use</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-3 text-[#F5F3F3]">
              Not every waste should become a DIY project.
            </h2>
            <p className="text-sm text-platinum leading-relaxed mb-4">
              If an item is contaminated, hazardous (swollen lithium batteries, chemical toxins, unverified plastics), or unsafe to cut at home, ReMatter will never force a craft idea. We route you straight to a verified collection point.
            </p>
            <div className="text-xs text-lavender font-medium">
              Real safety means knowing when to stop cutting and start recycling.
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <Link
              href="/recycling"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-mocha hover:bg-mocha-hover active:scale-95 text-white font-bold text-sm transition-all shadow-md focus-ring border border-mocha-light/20"
            >
              <Recycle className="w-4 h-4 text-lavender" />
              <span>Find Verified Recyclers</span>
              <ArrowRight className="w-4 h-4 text-platinum-light" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
