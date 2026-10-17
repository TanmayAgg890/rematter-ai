"use client"

import * as React from "react"
import Link from "next/link"
import { useScanStore } from "@/lib/store/use-scan-store"
import { FIXTURE_ITEMS } from "@/data/fixtures"
import { ReuseIdea } from "@/types"
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FolderKanban,
  RotateCcw,
  AlertTriangle
} from "lucide-react"

export default function DashboardPage() {
  const { 
    savedIdeaIds, 
    toggleSaveIdea, 
    ideas, 
    projectProgress, 
    assessment, 
    resetScan 
  } = useScanStore()

  const [deleteScanDialogOpen, setDeleteScanDialogOpen] = React.useState(false)

  // Collect all known ideas
  const allKnownIdeas: ReuseIdea[] = React.useMemo(() => {
    const list = [...ideas]
    for (const item of Object.values(FIXTURE_ITEMS)) {
      for (const i of item.candidateIdeas) {
        if (!list.some((existing) => existing.id === i.id)) {
          list.push(i)
        }
      }
    }
    return list
  }, [ideas])

  const savedIdeas = allKnownIdeas.filter((i) => savedIdeaIds.includes(i.id))
  const inProgressProjects = Object.values(projectProgress).filter((p) => !p.isCompleted)
  const completedProjects = Object.values(projectProgress).filter((p) => p.isCompleted)

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      {/* Dashboard Top */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderTone mb-10">
        <div>
          <span className="px-2.5 py-0.5 rounded-pill bg-leaf-green/15 text-leaf-green text-xs font-bold uppercase tracking-wider block mb-1">
            Personal Workspace
          </span>
          <h1 className="text-3xl font-display font-semibold text-forest">
            Your Projects & Saved Pathways
          </h1>
        </div>

        <Link
          href="/scan"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-leaf-green text-white text-xs font-semibold hover:bg-leaf-600 transition-colors shadow-sm self-start"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-fresh" />
          <span>New Waste Scan</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Scan Session */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-card border border-borderTone shadow-sm">
            <h2 className="text-sm font-bold text-forest uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Active Scan Session</span>
              {assessment && (
                <button
                  type="button"
                  onClick={() => setDeleteScanDialogOpen(true)}
                  title="Delete scan and clear memory"
                  className="text-secondaryText hover:text-danger p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </h2>

            {assessment ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-ivory border border-borderTone/80">
                  <span className="text-xs text-secondaryText block mb-0.5">Assessed Material:</span>
                  <span className="text-sm font-bold text-forest block mb-1">
                    {assessment.detectedMaterial}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-secondaryText">
                    <span className="capitalize">{assessment.category}</span>
                    <span>•</span>
                    <span className="capitalize">{assessment.condition}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/results"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-pill bg-forest text-white text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm"
                  >
                    <span>Open Results</span>
                    <ArrowRight className="w-3.5 h-3.5 text-lime-fresh" />
                  </Link>
                  <Link
                    href="/preferences"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-pill bg-ivory border border-borderTone text-xs font-medium text-forest hover:border-leaf-green transition-colors"
                  >
                    <span>Change Resources</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-secondaryText mb-3">No active scan in this session.</p>
                <Link
                  href="/scan"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-green hover:underline"
                >
                  <span>Start a scan now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Projects In Progress & Completed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Saved Ideas */}
          <div>
            <h2 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-leaf-green" />
              <span>Saved Ideas ({savedIdeas.length})</span>
            </h2>

            {savedIdeas.length === 0 ? (
              <div className="bg-white rounded-card border border-borderTone p-8 text-center text-xs text-secondaryText">
                You haven't bookmarked any ideas yet. Explore ideas from the recommendations or the gallery.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white p-5 rounded-card border border-borderTone shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-pill bg-slate-100 text-forest">
                          Level {idea.level}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSaveIdea(idea.id)}
                          title="Remove from saved"
                          className="text-secondaryText hover:text-danger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-sm text-forest mb-1">{idea.title}</h3>
                      <p className="text-xs text-secondaryText line-clamp-2 mb-3">{idea.description}</p>
                    </div>

                    <Link
                      href={`/ideas/${idea.id}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 rounded-pill bg-forest text-white text-xs font-semibold hover:bg-forest-800 transition-colors"
                    >
                      <span>Resume Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-lime-fresh" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Projects */}
          <div>
            <h2 className="text-lg font-bold text-forest mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Completed Projects ({completedProjects.length})</span>
            </h2>

            {completedProjects.length === 0 ? (
              <div className="bg-white rounded-card border border-borderTone p-6 text-center text-xs text-secondaryText">
                No completed builds yet. Mark an idea completed inside its full plan guide to log it here.
              </div>
            ) : (
              <div className="space-y-3">
                {completedProjects.map((p) => {
                  const idea = allKnownIdeas.find((i) => i.id === p.ideaId)
                  return (
                    <div
                      key={p.ideaId}
                      className="bg-white p-4 rounded-xl border border-borderTone flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-forest">{idea?.title || "Completed Project"}</h3>
                        <p className="text-xs text-secondaryText">
                          Completed on: {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                      <Link
                        href={`/ideas/${p.ideaId}`}
                        className="text-xs font-semibold text-leaf-green hover:underline"
                      >
                        View Checklist
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Scan Confirm Dialog */}
      {deleteScanDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card max-w-sm w-full p-6 shadow-xl border border-borderTone">
            <h3 className="text-base font-bold text-forest mb-2">Delete Active Scan?</h3>
            <p className="text-xs text-secondaryText leading-relaxed mb-6">
              This will clear the current waste item assessment and generated ideas from this browser session.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeleteScanDialogOpen(false)}
                className="px-4 py-2 rounded-pill font-semibold text-secondaryText"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetScan()
                  setDeleteScanDialogOpen(false)
                }}
                className="px-4 py-2 rounded-pill bg-danger text-white font-semibold"
              >
                Delete Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
