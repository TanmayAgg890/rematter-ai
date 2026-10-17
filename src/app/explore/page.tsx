"use client"

import * as React from "react"
import Link from "next/link"
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
  X
} from "lucide-react"

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("all")
  const [selectedLevel, setSelectedLevel] = React.useState<string>("all")

  // Flatten all curated ideas from fixtures
  const allCuratedIdeas: ReuseIdea[] = React.useMemo(() => {
    return Object.values(FIXTURE_ITEMS).flatMap((item) => item.candidateIdeas)
  }, [])

  const filteredIdeas = allCuratedIdeas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.requiredMaterials.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDifficulty =
      selectedDifficulty === "all" || idea.difficulty === selectedDifficulty

    const matchesLevel =
      selectedLevel === "all" || String(idea.level) === selectedLevel

    return matchesSearch && matchesDifficulty && matchesLevel
  })

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedLevel("all")
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-bold uppercase tracking-wider inline-block mb-3">
          Curated Gallery
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-textPrimary mb-3">
          Explore Possibilities
        </h1>
        <p className="text-textSecondary text-sm leading-relaxed">
          Search tested, safe upcycling and circular disposal ideas across materials, tools, and budget constraints.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-borderLight shadow-sm mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-textSecondary absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, tool, or material (e.g. bottle, planter, cardboard)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-borderLight text-sm text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-3.5 text-textSecondary hover:text-textPrimary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-full border border-borderLight text-xs bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-emerald"
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
              className="px-3 py-2 rounded-full border border-borderLight text-xs bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1 (DIY at Home)</option>
              <option value="2">Level 2 (Workshop)</option>
              <option value="3">Level 3 (Recycling)</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-borderLight">
          <p className="text-textPrimary font-semibold mb-2">No matching ideas found</p>
          <p className="text-xs text-textSecondary mb-4">Try adjusting your search terms or clearing filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-full bg-ivory border border-borderLight text-xs font-semibold text-textPrimary hover:border-emerald"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-2xl border border-borderLight hover:border-slate-300 transition-all p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-textPrimary text-[11px] font-bold uppercase tracking-wider">
                    {idea.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      idea.level === 1
                        ? "bg-emerald/15 text-emerald-800"
                        : idea.level === 2
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    Level {idea.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-textPrimary mb-2">{idea.title}</h3>
                <p className="text-xs text-textSecondary leading-relaxed mb-4 line-clamp-3">
                  {idea.description}
                </p>

                <div className="space-y-1.5 text-xs text-textSecondary pt-3 border-t border-slate-100 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time:</span>
                    <strong className="text-textPrimary">{idea.estimatedMinutes ? `~${idea.estimatedMinutes} mins` : "Quick"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> Extra Cost:</span>
                    <strong className="text-textPrimary">
                      {idea.estimatedCostINR ? (idea.estimatedCostINR.max === 0 ? "₹0 (Free)" : `₹${idea.estimatedCostINR.max}`) : "₹0"}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href={`/ideas/${idea.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-forest text-white text-xs font-semibold hover:bg-forest/90 transition-colors shadow-sm"
                >
                  <span>Open Full Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start Scan Banner */}
      <div className="bg-[#102A22] text-[#F7FAF7] rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border border-white/10 shadow-xl">
        <h2 className="text-2xl font-display font-semibold mb-2">Have a specific waste item?</h2>
        <p className="text-xs text-[#C3D0C8] mb-6 leading-relaxed">
          Get custom ideas personalized to your exact tools, skill level, and budget.
        </p>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald text-white text-xs font-semibold hover:bg-emerald/90 transition-colors shadow-md"
        >
          <Sparkles className="w-4 h-4 text-lime" />
          <span>Start a Waste Scan</span>
        </Link>
      </div>
    </div>
  )
}
