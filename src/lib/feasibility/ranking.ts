import { 
  ReuseIdea, 
  MaterialAssessment, 
  UserPreferences 
} from "@/types"
import { filterFeasibleIdeas } from "./hard-constraints"
import { computeFeasibility } from "./scoring"

export interface RankingResult {
  rankedIdeas: ReuseIdea[]
  rejectedCount: number
  hasFeasibleIdeas: boolean
  fallbackMessage: string | null
}

/**
 * Filter and Rank candidate ideas deterministically.
 * 1. Hard constraint filter drops infeasible/unsafe candidates first.
 * 2. Surviving ideas are scored with Eq. 1 & 2.
 * 3. Ideas are sorted descending by score.
 */
export function rankIdeas(
  candidates: ReuseIdea[],
  assessment: MaterialAssessment,
  prefs: UserPreferences
): RankingResult {
  // 1. Hard constraint filtering
  const { feasible, rejected } = filterFeasibleIdeas(candidates, assessment, prefs)

  if (feasible.length === 0) {
    return {
      rankedIdeas: [],
      rejectedCount: rejected.length,
      hasFeasibleIdeas: false,
      fallbackMessage:
        "We couldn't find a reuse idea that confidently fits your current tools, budget, and material condition. Let's find a better next step.",
    }
  }

  // 2. Score each surviving idea
  const scoredIdeas = feasible.map((idea) => {
    const feasibility = computeFeasibility(idea, assessment, prefs)
    return {
      ...idea,
      feasibility,
    }
  })

  // 3. Sort descending by score
  scoredIdeas.sort((a, b) => {
    const scoreA = a.feasibility.score ?? 0
    const scoreB = b.feasibility.score ?? 0
    return scoreB - scoreA
  })

  return {
    rankedIdeas: scoredIdeas,
    rejectedCount: rejected.length,
    hasFeasibleIdeas: true,
    fallbackMessage: null,
  }
}
