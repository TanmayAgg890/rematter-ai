import Link from "next/link"
import { HeroSection } from "@/components/hero/hero-section"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion/reveal"
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Coins, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  Cpu, 
  Shirt, 
  Layers, 
  Trees, 
  Leaf,
  Info
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-ivory">
      {/* 1. Fluid Particles Hero Section */}
      <HeroSection />

      {/* 2. Trust & Principles Strip */}
      <section className="bg-forest-950 border-b border-white/10 py-4 px-4 overflow-hidden">
        <div className="max-w-container mx-auto flex flex-wrap items-center justify-between gap-6 text-xs text-textLightMuted font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-primary inline-block animate-pulse" />
            <span>Deterministic Safety Eligibility Gates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-primary inline-block" />
            <span>Explainable Feasibility Scoring ($S = 100 \cdot \sum w_f \cdot s_f$)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-primary inline-block" />
            <span>Sourced & Verified Recycling Facilities</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-primary inline-block" />
            <span>Zero Hallucinated Safe Claims</span>
          </div>
        </div>
      </section>

      {/* 3. How It Works (4 Steps) */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 max-w-container mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-pill bg-emerald-primary/10 text-emerald-dark text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-textPrimary mb-4">
            How ReMatter Works
          </h2>
          <p className="text-textSecondary text-base">
            From an overlooked item to a practical, safe next step in four structured stages.
          </p>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <StaggerItem className="bg-white p-7 rounded-card border border-borderLight shadow-sm flex flex-col justify-between hover:border-emerald-primary/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-full bg-emerald-primary/15 text-forest-900 font-display font-bold flex items-center justify-center mb-5 text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-textPrimary mb-2">Upload or Describe</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Provide a photo or description of your item, including quantity and visible resin codes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borderLight/70 text-xs text-emerald-dark font-medium">
              Client & server validated
            </div>
          </StaggerItem>

          {/* Step 2 */}
          <StaggerItem className="bg-white p-7 rounded-card border border-borderLight shadow-sm flex flex-col justify-between hover:border-emerald-primary/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-full bg-emerald-primary/15 text-forest-900 font-display font-bold flex items-center justify-center mb-5 text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-textPrimary mb-2">Confirm Material</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Review detected material candidates, visible evidence, and answer targeted follow-ups.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borderLight/70 text-xs text-emerald-dark font-medium">
              Transparent uncertainty
            </div>
          </StaggerItem>

          {/* Step 3 */}
          <StaggerItem className="bg-white p-7 rounded-card border border-borderLight shadow-sm flex flex-col justify-between hover:border-emerald-primary/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-full bg-emerald-primary/15 text-forest-900 font-display font-bold flex items-center justify-center mb-5 text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-textPrimary mb-2">Personalize Resources</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Specify your available tools, budget tier (from ₹0), skill level, and available time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borderLight/70 text-xs text-emerald-dark font-medium">
              Zero forced assumptions
            </div>
          </StaggerItem>

          {/* Step 4 */}
          <StaggerItem className="bg-white p-7 rounded-card border border-borderLight shadow-sm flex flex-col justify-between hover:border-emerald-primary/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-full bg-emerald-primary/15 text-forest-900 font-display font-bold flex items-center justify-center mb-5 text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-textPrimary mb-2">Practical Next Steps</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Receive filtered, ranked pathways with full step-by-step guides or verified recycling routes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borderLight/70 text-xs text-emerald-dark font-medium">
              Safety is never compromised
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 4. Explore Possibilities (6 Curated Categories) */}
      <section className="py-24 bg-forest-900 text-textLight">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-14">
            <span className="px-3 py-1 rounded-pill bg-emerald-primary/20 text-emerald-light text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Materials
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold mb-4 text-textLight">
              Explore Material Possibilities
            </h2>
            <p className="text-textLightMuted text-base">
              Each waste stream behaves differently. ReMatter evaluates material characteristics before proposing a pathway.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Plastic */}
            <div className="bg-forest-800 p-6 rounded-card border border-white/10 hover:border-emerald-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-emerald-light mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight">Plastic & Packaging</h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Bottles, jugs, HDPE containers, bubble wraps. Evaluated for food-safety boundaries and mechanical cut stability.
              </p>
              <Link href="/explore?category=plastic" className="text-xs font-semibold text-emerald-light hover:underline inline-flex items-center gap-1">
                Explore plastic ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Paper & Cardboard */}
            <div className="bg-forest-800 p-6 rounded-card border border-white/10 hover:border-emerald-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-emerald-light mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight">Paper & Cardboard</h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Shipping cartons, kraft paper, pulp trays. Assessed for structural dry storage, custom dividers, and garden mulching.
              </p>
              <Link href="/explore?category=paper_cardboard" className="text-xs font-semibold text-emerald-light hover:underline inline-flex items-center gap-1">
                Explore cardboard ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Textiles */}
            <div className="bg-forest-800 p-6 rounded-card border border-white/10 hover:border-emerald-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-emerald-light mb-4">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight">Textile & Worn Apparel</h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Cotton tees, denim, linen scraps. Filtered for no-sew functional bags, shop rags, and fiber shredding.
              </p>
              <Link href="/explore?category=textile" className="text-xs font-semibold text-emerald-light hover:underline inline-flex items-center gap-1">
                Explore textile ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Wood & Offcuts */}
            <div className="bg-forest-800 p-6 rounded-card border border-white/10 hover:border-emerald-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-emerald-light mb-4">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight">Reclaimed Wood & Pallets</h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Untreated pallet timber, carpentry scraps, crates. Evaluated for chemical treatment stamps (HT vs MB).
              </p>
              <Link href="/explore?category=wood" className="text-xs font-semibold text-emerald-light hover:underline inline-flex items-center gap-1">
                Explore timber ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Organic */}
            <div className="bg-forest-800 p-6 rounded-card border border-white/10 hover:border-emerald-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-forest-700 flex items-center justify-center text-emerald-light mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight">Organic & Food Scraps</h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Coffee grounds, citrus peels, dry leaves. Guided aerobic composting and natural cleaning infusions.
              </p>
              <Link href="/explore?category=organic" className="text-xs font-semibold text-emerald-light hover:underline inline-flex items-center gap-1">
                Explore organic ideas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. E-Waste */}
            <div className="bg-forest-800 p-6 rounded-card border border-amber-500/30 hover:border-amber-400/60 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 flex items-center justify-center text-amber-300 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-textLight flex items-center gap-2">
                <span>E-Waste & Electronics</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Specialist</span>
              </h3>
              <p className="text-sm text-textLightMuted leading-relaxed mb-4">
                Swollen batteries, motherboards, chargers. Strictly routed to Level 3 certified hazardous recyclers.
              </p>
              <Link href="/recycling" className="text-xs font-semibold text-amber-300 hover:underline inline-flex items-center gap-1">
                Find authorized recyclers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feasibility Framework */}
      <section id="feasibility" className="py-24 px-4 sm:px-6 max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="px-3 py-1 rounded-pill bg-emerald-primary/10 text-emerald-dark text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Explainable AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-textPrimary mb-5">
              Feasibility is Not a Guess. It is a Mathematical Match.
            </h2>
            <p className="text-textSecondary text-base leading-relaxed mb-6">
              Most AI apps suggest projects that look impressive online but end up discarded because you lack a drill press or spend more on glue than buying new.
            </p>
            <p className="text-textSecondary text-base leading-relaxed mb-6">
              ReMatter uses a transparent, deterministic scoring equation normalized across 5 specific constraints before an idea is ranked.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-emerald-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-textPrimary">Tool Tier (w = 0.25):</strong> Household scissors vs basic drills vs full workshop machinery.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-emerald-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-textPrimary">Budget Tier (w = 0.20):</strong> From ₹0 strict zero-cost to flexible investments.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-textPrimary">Skill Level (w = 0.20):</strong> Beginner-friendly steps with zero specialized training.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-textPrimary">Time Limit (w = 0.15):</strong> 15-minute quick fixes vs multi-day builds.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <strong className="text-textPrimary">Material Suitability (w = 0.20):</strong> Structural integrity, contamination, and degradation.
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="bg-forest-900 text-textLight p-8 rounded-card border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs uppercase tracking-wider font-mono text-emerald-light">Deterministic Formulation</span>
              <span className="text-xs text-textLightMuted font-mono">Eq. 2</span>
            </div>

            <div className="bg-forest-800 p-5 rounded-lg border border-white/10 font-mono text-sm mb-6 text-center text-emerald-light">
              S = 100 · Σ ( w_f · s_f )
            </div>

            <p className="text-xs text-textLightMuted leading-relaxed mb-6">
              Where each factor score <code className="text-emerald-light">s_f ∈ [0, 1]</code> is calculated against your stated resources. The composite score <code className="text-emerald-light">S</code> is displayed only when all 5 inputs are known.
            </p>

            <div className="p-4 rounded-lg bg-forest-800/60 border border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-primary mt-0.5 shrink-0" />
              <p className="text-xs text-textLightMuted leading-relaxed">
                <strong>Safety is an eligibility gate, never a score:</strong> If an idea violates safety boundaries (e.g. food contact with uncertified plastic, hazardous electronics), it is dropped completely regardless of score.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Three-Level System */}
      <section id="three-levels" className="py-24 bg-white border-y border-borderLight">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-pill bg-emerald-primary/10 text-emerald-dark text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Hierarchy
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-textPrimary mb-4">
              The Three-Level Circular System
            </h2>
            <p className="text-textSecondary text-base">
              Every recommendation belongs to a verified execution tier.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ivory p-7 rounded-card border border-borderLight shadow-sm">
              <div className="inline-block px-3 py-1 rounded-pill bg-emerald-primary/15 text-emerald-dark text-xs font-bold mb-4">
                Level 1
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">DIY at Home</h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Safe, low-effort repurposing using household scissors, twine, or clean jars. Zero workshop machinery needed.
              </p>
              <ul className="text-xs text-textSecondary space-y-1.5 pt-4 border-t border-borderLight">
                <li>• Self-watering herb planters</li>
                <li>• Slotted cardboard drawer grids</li>
                <li>• No-sew t-shirt produce totes</li>
              </ul>
            </div>

            <div className="bg-ivory p-7 rounded-card border border-borderLight shadow-sm">
              <div className="inline-block px-3 py-1 rounded-pill bg-blue-100 text-blue-900 text-xs font-bold mb-4">
                Level 2
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">Workshop / Community</h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Projects requiring maker spaces, hand drills, sewing machines, or community repair cafes.
              </p>
              <ul className="text-xs text-textSecondary space-y-1.5 pt-4 border-t border-borderLight">
                <li>• Pallet vertical planters with hand saws</li>
                <li>• Machine-stitched textile patchwork</li>
                <li>• Shredded HDPE sheet compression</li>
              </ul>
            </div>

            <div className="bg-ivory p-7 rounded-card border border-borderLight shadow-sm">
              <div className="inline-block px-3 py-1 rounded-pill bg-purple-100 text-purple-900 text-xs font-bold mb-4">
                Level 3
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">Professional Recycling</h3>
              <p className="text-sm text-textSecondary leading-relaxed mb-4">
                Specialized recycling routes for complex or hazardous streams that cannot be safely managed domestically.
              </p>
              <ul className="text-xs text-textSecondary space-y-1.5 pt-4 border-t border-borderLight">
                <li>• Swollen lithium battery PRO drop-offs</li>
                <li>• Municipal MRF dry-waste sorting</li>
                <li>• Closed-loop rPET spinning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Responsible Recycling */}
      <section id="responsible-recycling" className="py-20 px-4 sm:px-6 max-w-container mx-auto">
        <div className="bg-forest-900 text-textLight rounded-card p-8 sm:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-amber-400/20 text-amber-300 text-xs font-semibold mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety & Honesty Rule</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-3 text-textLight">
              Not every waste should become a DIY project.
            </h2>
            <p className="text-sm text-textLightMuted leading-relaxed mb-4">
              If an item is heavily contaminated, hazardous (e-waste, batteries, toxic containers), or inefficient to upcycle at home, ReMatter will never force a craft idea. We route you straight to a verified collection point.
            </p>
            <div className="text-xs text-emerald-light font-medium">
              Real safety means knowing when to stop cutting and start recycling.
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <Link
              href="/recycling"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-emerald-primary text-forest-950 font-bold text-sm hover:bg-emerald-400 transition-colors shadow"
            >
              Find Recycling Centers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 text-center max-w-2xl mx-auto">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-textPrimary mb-4">
            Ready to find a better use for your waste?
          </h2>
          <p className="text-textSecondary text-base mb-8">
            Upload a photo or describe what you have. Get personalized, realistic next steps in less than 60 seconds.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-pill bg-emerald-primary text-forest-950 font-bold text-base hover:bg-emerald-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-forest-950" />
            <span>Start a Waste Scan</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
