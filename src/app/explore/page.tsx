"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FIXTURE_ITEMS } from "@/data/fixtures"
import { ReuseIdea, MaterialCategory } from "@/types"
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  Coins, 
  Wrench, 
  CheckCircle2, 
  Sparkles,
  X,
  Boxes,
  Layers,
  Shirt,
  Trees,
  Leaf,
  Cpu,
  Info,
  ShieldCheck,
  AlertTriangle,
  Recycle
} from "lucide-react"

interface MaterialDetailGuide {
  id: string
  name: string
  category: MaterialCategory
  icon: any
  properties: string
  conditionConsiderations: string
  reuseOptions: string[]
  repurposeIdeas: string[]
  recyclingPathway: string
  safetyNotes: string
}

const MATERIAL_GUIDES: Record<string, MaterialDetailGuide> = {
  plastic: {
    id: "plastic",
    name: "Plastic & Synthetic Polymers",
    category: "plastic",
    icon: Boxes,
    properties: "Thermoplastic resins (PET #1, HDPE #2, PP #5). Waterproof, durable, lightweight, flexible or rigid.",
    conditionConsiderations: "Must be thoroughly cleaned of dairy, oils, or chemicals. Contaminated plastics cannot be reused safely.",
    reuseOptions: [
      "Bulk dry pantry storage (if food-grade HDPE #2 or PP #5)",
      "Nursery pot drainage liners",
      "Washed squeeze bottles for workshop lubrication",
    ],
    repurposeIdeas: [
      "Self-watering sub-irrigation herb planters",
      "Modular drawer organizers from cut gallon jugs",
      "Protective outdoor cord rain-shields",
    ],
    recyclingPathway: "Standard municipal blue bin (clean bottles/jugs). Take flexible films (#4 LDPE) to supermarket drop-offs.",
    safetyNotes: "Never melt or heat plastics at home; fumes contain toxic volatile organic compounds. Never use non-food containers for edible storage.",
  },
  paper_cardboard: {
    id: "paper_cardboard",
    name: "Paper & Corrugated Cardboard",
    category: "paper_cardboard",
    icon: Layers,
    properties: "Cellulose fiber matrix. Lightweight, structurally rigid when corrugated, moisture-sensitive, biodegradable.",
    conditionConsiderations: "Greasy pizza box bases, wax-coated cartons, and wet pulp cannot be recycled domestically.",
    reuseOptions: [
      "Shipping box reuse for parcel postage",
      "Document archival storage",
      "Floor protection during home painting",
    ],
    repurposeIdeas: [
      "Interlocking drawer grid dividers",
      "Garden sheet mulching and weed suppression",
      "Biodegradable seed starting pots",
    ],
    recyclingPathway: "Dry waste collection / municipal paper sorting. Keep dry and flattened.",
    safetyNotes: "Use a safe cutting mat and retractable safety blade when scoring corrugated board. Keep away from open pilot flames.",
  },
  textile: {
    id: "textile",
    name: "Textiles & Worn Apparel",
    category: "textile",
    icon: Shirt,
    properties: "Woven or knit cotton, polyester, denim, wool. High tensile strength, washable, absorbent.",
    conditionConsiderations: "Oil-soaked industrial rags or mildew-stained fabrics must be cleaned or quarantined.",
    reuseOptions: [
      "Clothing swap or donation if wearable",
      "Machine cleaning rags and workshop wipes",
      "Furniture padding during moving",
    ],
    repurposeIdeas: [
      "No-sew t-shirt grocery produce totes",
      "Braided draft stoppers for winter doorways",
      "Denim tool rolls and workshop organizers",
    ],
    recyclingPathway: "Textile bank collection or specialized PRO fiber shredding programs.",
    safetyNotes: "Wash worn clothing before repurposing. Discard fabrics with chemical or mold contamination.",
  },
  wood: {
    id: "wood",
    name: "Reclaimed Wood & Timber Offcuts",
    category: "wood",
    icon: Trees,
    properties: "Natural softwood/hardwood, timber planks, plywood offcuts. High structural strength, machinable.",
    conditionConsiderations: "Check stamp markings: 'HT' (Heat Treated) is safe; 'MB' (Methyl Bromide) is toxic and prohibited for home crafts.",
    reuseOptions: [
      "Raw timber offcut blocks for leveling and workbench shims",
      "Garden pathway border edging",
    ],
    repurposeIdeas: [
      "Vertical tiered wall planter with hanging brackets",
      "Minimalist laptop stand or monitor riser",
      "Coat hook rack with reclaimed metal hooks",
    ],
    recyclingPathway: "Municipal green waste / timber recycling. Untreated wood can be chipped for mulch.",
    safetyNotes: "Wear safety goggles and dust mask when sawing. Inspect thoroughly for embedded rusty nails or staples.",
  },
  e_waste: {
    id: "e_waste",
    name: "E-Waste & Electronics",
    category: "e_waste",
    icon: Cpu,
    properties: "Printed circuit boards, lithium-ion/polymer cells, copper wiring, silicon components.",
    conditionConsiderations: "Swollen cells, cracked battery casings, or burnt boards must be handled with fireproof containment.",
    reuseOptions: [
      "Working peripheral repurposing (cables, monitors)",
      "RAM or storage drive salvage into external enclosures",
    ],
    repurposeIdeas: [
      "Strictly Level 3 certified recycling. ReMatter never recommends dangerous domestic hacking of hazardous batteries.",
    ],
    recyclingPathway: "Authorized CPCB / PRO e-waste collection center. Certified handlers extract precious metals and neutralize toxins.",
    safetyNotes: "DANGER: Never puncture, crush, solder, or submerge lithium battery packs. Tape terminals with electrical tape before drop-off.",
  },
}

export default function ExplorePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("all")
  const [selectedLevel, setSelectedLevel] = React.useState<string>("all")
  const [activeGuideKey, setActiveGuideKey] = React.useState<string | null>(null)

  // Flatten all curated ideas from fixtures
  const allCuratedIdeas: ReuseIdea[] = React.useMemo(() => {
    return Object.values(FIXTURE_ITEMS).flatMap((item) => item.candidateIdeas)
  }, [])

  const filteredIdeas = allCuratedIdeas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.requiredMaterials.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || idea.category.toLowerCase() === selectedCategory.toLowerCase()

    const matchesDifficulty =
      selectedDifficulty === "all" || idea.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()

    const matchesLevel =
      selectedLevel === "all" || String(idea.level) === selectedLevel

    return matchesSearch && matchesCategory && matchesDifficulty && matchesLevel
  })

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedLevel("all")
  }

  const activeGuide = activeGuideKey ? MATERIAL_GUIDES[activeGuideKey] : null

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-primary/10 text-emerald-primary text-xs font-bold uppercase tracking-wider inline-block mb-3">
          Curated Discovery
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-3">
          Explore Materials & Possibilities
        </h1>
        <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm leading-relaxed">
          Search tested, safe upcycling and circular disposal ideas across materials, tools, and budget constraints.
        </p>
      </div>

      {/* Material Category Quick Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textLightSecondary dark:text-textDarkSecondary">
            Browse Supported Material Streams
          </h2>
          <span className="text-[11px] text-emerald-primary font-medium">Click for deep properties & safety rules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(MATERIAL_GUIDES).map(([key, guide]) => {
            const Icon = guide.icon
            const isSelected = selectedCategory === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedCategory(isSelected ? "all" : key)
                  setActiveGuideKey(key)
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between focus-ring ${
                  isSelected
                    ? "bg-emerald-primary/10 border-emerald-primary shadow-sm"
                    : "bg-white dark:bg-forest-surface border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-primary/15 text-emerald-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-textLightSecondary dark:text-textDarkSecondary uppercase font-mono">
                    Specs
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-textLightPrimary dark:text-textDarkPrimary truncate">
                    {guide.name}
                  </h3>
                  <span className="text-[11px] text-emerald-primary font-medium block mt-0.5">
                    View profile →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-forest-surface p-5 rounded-2xl border border-borderLightSubtle dark:border-white/10 shadow-sm mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, tool, or material (e.g. bottle, planter, cardboard)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-borderLightSubtle dark:border-white/10 bg-ivory dark:bg-forest-elevated text-sm text-textLightPrimary dark:text-textDarkPrimary placeholder:text-textLightSecondary/60 dark:placeholder:text-textDarkSecondary/60 focus-ring"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-3.5 text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary focus-ring"
            >
              <option value="all">All Materials</option>
              <option value="plastic">Plastic</option>
              <option value="paper_cardboard">Paper / Cardboard</option>
              <option value="textile">Textile</option>
              <option value="wood">Wood</option>
              <option value="organic">Organic</option>
              <option value="e_waste">E-Waste</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3.5 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary focus-ring"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary focus-ring"
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1 (DIY at Home)</option>
              <option value="2">Level 2 (Workshop)</option>
              <option value="3">Level 3 (Recycling)</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-emerald-primary focus-ring rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10">
          <p className="text-textLightPrimary dark:text-textDarkPrimary font-semibold mb-2">No matching ideas found</p>
          <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary mb-4">Try adjusting your search terms or clearing filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-full bg-ivory dark:bg-forest-elevated border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary focus-ring"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary/40 transition-all p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-ivory-200 dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary text-[11px] font-bold uppercase tracking-wider">
                    {idea.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      idea.level === 1
                        ? "bg-emerald-primary/15 text-emerald-primary"
                        : idea.level === 2
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                        : "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    Level {idea.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">{idea.title}</h3>
                <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary leading-relaxed mb-4 line-clamp-3">
                  {idea.description}
                </p>

                <div className="space-y-1.5 text-xs text-textLightSecondary dark:text-textDarkSecondary pt-3 border-t border-borderLightSubtle/50 dark:border-white/5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-primary" /> Time:</span>
                    <strong className="text-textLightPrimary dark:text-textDarkPrimary">{idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-emerald-primary" /> Extra Cost:</span>
                    <strong className="text-textLightPrimary dark:text-textDarkPrimary">
                      {idea.estimatedCostINR ? (idea.estimatedCostINR.max === 0 ? "₹0 (Free)" : `₹${idea.estimatedCostINR.max}`) : "₹0"}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href={`/ideas/${idea.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-forest dark:bg-forest-elevated text-white text-xs font-semibold hover:bg-forest-700 active:scale-95 transition-all shadow-sm focus-ring"
                >
                  <span>Open Full Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-primary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Detail Modal/Drawer */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-forest-surface rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-borderLightSubtle dark:border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-primary/15 text-emerald-primary text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                  Material Profile & Safety Guide
                </span>
                <h3 className="text-xl font-display font-bold text-textLightPrimary dark:text-textDarkPrimary">
                  {activeGuide.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuideKey(null)}
                className="p-1.5 rounded-full text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-textLightSecondary dark:text-textDarkSecondary">
              <div>
                <h4 className="font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-primary" />
                  <span>Physical Properties & Condition:</span>
                </h4>
                <p className="leading-relaxed">{activeGuide.properties}</p>
                <p className="mt-1 text-textLightPrimary dark:text-textDarkPrimary font-medium">{activeGuide.conditionConsiderations}</p>
              </div>

              <div>
                <h4 className="font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-primary" />
                  <span>Recommended Direct Reuse:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activeGuide.reuseOptions.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-primary" />
                  <span>Creative Repurposing Pathways:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activeGuide.repurposeIdeas.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-ivory dark:bg-forest-elevated border border-borderLightSubtle dark:border-white/5">
                <h4 className="font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1 flex items-center gap-1.5">
                  <Recycle className="w-3.5 h-3.5 text-emerald-primary" />
                  <span>Certified Recycling Pathway:</span>
                </h4>
                <p className="leading-relaxed">{activeGuide.recyclingPathway}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200">
                <h4 className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Safety Gate:</span>
                </h4>
                <p className="leading-relaxed">{activeGuide.safetyNotes}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-borderLightSubtle dark:border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveGuideKey(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary focus-ring"
              >
                Close
              </button>

              <Link
                href="/scan"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-primary text-forest-950 text-xs font-bold hover:bg-emerald-400 active:scale-95 transition-all shadow focus-ring"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan {activeGuide.name.split(" ")[0]} Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Start Scan Banner */}
      <div className="bg-[#102A22] text-[#F4F8F5] rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border border-white/10 shadow-xl">
        <h2 className="text-2xl font-display font-semibold mb-2">Have a specific waste item?</h2>
        <p className="text-xs text-[#C0CEC5] mb-6 leading-relaxed">
          Get custom ideas personalized to your exact tools, skill level, and budget.
        </p>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-primary text-forest-950 text-xs font-semibold hover:bg-emerald-400 active:scale-95 transition-colors shadow-md focus-ring"
        >
          <Sparkles className="w-4 h-4 text-forest-950" />
          <span>Start a Waste Scan</span>
        </Link>
      </div>
    </div>
  )
}
