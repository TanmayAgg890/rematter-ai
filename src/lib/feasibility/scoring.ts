import { 
  UserPreferences, 
  ReuseIdea, 
  MaterialAssessment, 
  FeasibilityBreakdown,
  ExperienceLevel,
  ToolAvailability,
  BudgetTier,
  TimeCommitment 
} from "@/types"

export interface ScoringWeights {
  tool: number
  budget: number
  skill: number
  time: number
  material: number
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  tool: 0.25,
  budget: 0.20,
  skill: 0.20,
  time: 0.15,
  material: 0.20,
}

// Validate weights sum to 1.0 (within floating point margin)
export function validateWeights(weights: ScoringWeights): boolean {
  const sum = weights.tool + weights.budget + weights.skill + weights.time + weights.material
  return Math.abs(sum - 1.0) < 0.0001
}

const TOOL_TIERS: Record<ToolAvailability, number> = {
  household: 1,
  basic_tools: 2,
  workshop: 3,
}

const SKILL_TIERS: Record<ExperienceLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

/**
 * Calculates Tool Compatibility Score s_tool in [0, 1]
 */
export function calculateToolScore(requiredTools: string[], userTools: ToolAvailability): number {
  if (requiredTools.length === 0) return 1.0
  const userTier = TOOL_TIERS[userTools]

  // Identify highest tier needed by required tools
  let neededTier = 1
  for (const tool of requiredTools) {
    const t = tool.toLowerCase()
    if (t.includes("saw") || t.includes("drill") || t.includes("hammer") || t.includes("pliers") || t.includes("wrench")) {
      neededTier = Math.max(neededTier, 2)
    }
    if (t.includes("power") || t.includes("lathe") || t.includes("welder") || t.includes("sander") || t.includes("dremel") || t.includes("router")) {
      neededTier = Math.max(neededTier, 3)
    }
  }

  if (userTier >= neededTier) return 1.0
  if (userTier === neededTier - 1) return 0.5 // one tier above -> partial
  return 0.1 // severe mismatch
}

/**
 * Calculates Budget Compatibility Score s_budget in [0, 1]
 */
export function calculateBudgetScore(
  costEst: { min: number; max: number; isEstimate?: boolean } | null,
  userBudget: BudgetTier
): number {
  if (!costEst || costEst.max === 0) return 1.0 // Free / no cost
  const maxCost = costEst.max

  switch (userBudget) {
    case "free":
      return maxCost === 0 ? 1.0 : maxCost <= 50 ? 0.3 : 0.0
    case "under_200":
      if (maxCost <= 100) return 1.0
      if (maxCost <= 200) return 0.8
      if (maxCost <= 400) return 0.3
      return 0.0
    case "200_1000":
      if (maxCost <= 500) return 1.0
      if (maxCost <= 1000) return 0.8
      return 0.4
    case "flexible":
      return 1.0
    default:
      return 0.5
  }
}

/**
 * Calculates Skill Compatibility Score s_skill in [0, 1]
 */
export function calculateSkillScore(difficulty: ExperienceLevel, userSkill: ExperienceLevel): number {
  const req = SKILL_TIERS[difficulty]
  const user = SKILL_TIERS[userSkill]

  if (user >= req) return 1.0
  if (user === req - 1) return 0.6 // 1 step ahead -> feasible with guidance
  return 0.2 // 2 steps ahead -> very hard
}

/**
 * Calculates Time Compatibility Score s_time in [0, 1]
 */
export function calculateTimeScore(estMinutes: number | null, userTime: TimeCommitment): number {
  if (estMinutes === null) return 0.7
  const timeLimits: Record<TimeCommitment, number> = {
    "15_min": 25,
    "1_hour": 75,
    few_hours: 240,
    multiple_days: 2000,
  }

  const limit = timeLimits[userTime]
  if (estMinutes <= limit) return 1.0
  if (estMinutes <= limit * 1.5) return 0.6
  return 0.2
}

/**
 * Calculates Material Suitability Score s_material in [0, 1]
 */
export function calculateMaterialScore(
  assessment: MaterialAssessment,
  idea: ReuseIdea
): number {
  let score = 1.0
  if (assessment.condition === "damaged" && idea.category === "reuse") {
    score -= 0.4 // damaged item is harder to direct-reuse
  }
  if (assessment.condition === "lightly_soiled") {
    score -= 0.1 // requires cleaning step
  }
  if (assessment.category === "hazardous" || assessment.isHazardous) {
    if (idea.level !== 3) return 0.0
  }
  return Math.max(0.1, score)
}

/**
 * Computes FeasibilityBreakdown (Eq. 1, Eq. 2, Eq. 3)
 */
export function computeFeasibility(
  idea: ReuseIdea,
  assessment: MaterialAssessment,
  prefs: UserPreferences,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): FeasibilityBreakdown {
  if (!validateWeights(weights)) {
    throw new Error("Feasibility scoring weights must sum to 1.0")
  }

  const s_tool = calculateToolScore(idea.requiredTools, prefs.tools)
  const s_budget = calculateBudgetScore(idea.estimatedCostINR, prefs.budget)
  const s_skill = calculateSkillScore(idea.difficulty, prefs.experience)
  const s_time = calculateTimeScore(idea.estimatedMinutes, prefs.time)
  const s_material = calculateMaterialScore(assessment, idea)

  // Weighted score S = 100 * sum(w_f * s_f)
  const rawScore = 100 * (
    weights.tool * s_tool +
    weights.budget * s_budget +
    weights.skill * s_skill +
    weights.time * s_time +
    weights.material * s_material
  )

  const finalScore = Math.round(rawScore)

  let qualitativeLabel: FeasibilityBreakdown["qualitativeLabel"] = "Possible fit"
  if (finalScore >= 80) qualitativeLabel = "Good fit"
  else if (finalScore >= 55) qualitativeLabel = "Possible fit"
  else qualitativeLabel = "Needs more info"

  let explanation = ""
  if (s_tool >= 0.9 && s_budget >= 0.9 && s_skill >= 0.9) {
    explanation = "Excellent match for your available tools, budget, and skill level."
  } else if (s_tool < 0.6) {
    explanation = `Requires specific tools (${idea.requiredTools.slice(0, 2).join(", ")}) that may exceed basic household equipment.`
  } else if (s_budget < 0.6) {
    explanation = `Estimated cost (₹${idea.estimatedCostINR?.max || "extra"}) is near or exceeds your target budget.`
  } else if (s_skill < 0.7) {
    explanation = `Rated ${idea.difficulty} difficulty, which is a step up from your current experience.`
  } else {
    explanation = "Solid overall match with moderate preparation required."
  }

  return {
    score: finalScore,
    qualitativeLabel,
    breakdown: {
      tool: Math.round(s_tool * 100) / 100,
      budget: Math.round(s_budget * 100) / 100,
      skill: Math.round(s_skill * 100) / 100,
      time: Math.round(s_time * 100) / 100,
      material: Math.round(s_material * 100) / 100,
    },
    explanation,
  }
}
