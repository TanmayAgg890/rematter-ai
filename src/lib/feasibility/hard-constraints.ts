import { 
  ReuseIdea, 
  MaterialAssessment, 
  UserPreferences 
} from "@/types"
import { evaluateIdeaSafety } from "./safety-rules"

export interface ConstraintFilterResult {
  passed: boolean
  rejectionReason?: string
}

/**
 * Hard Constraints Filter:
 * Evaluates candidate ideas BEFORE ranking. Infeasible or unsafe ideas are removed.
 * Safety is an eligibility gate, never a score.
 */
export function checkHardConstraints(
  idea: ReuseIdea,
  assessment: MaterialAssessment,
  prefs: UserPreferences
): ConstraintFilterResult {
  // 1. Safety Gate Check
  const safety = evaluateIdeaSafety(idea, assessment)
  if (!safety.isSafe) {
    return {
      passed: false,
      rejectionReason: `Safety violation: ${safety.violations.join(" ")}`,
    }
  }

  // 2. Hazardous Routing Level Gate
  if (assessment.isHazardous || assessment.routingLevel === 3) {
    if (idea.level !== 3) {
      return {
        passed: false,
        rejectionReason: "Hazardous or complex electronic waste is strictly restricted to certified recycling facilities (Level 3).",
      }
    }
  }

  // 3. Essential Equipment Gate
  // If user only has household items, reject projects requiring specialized power equipment (welder, lathe, heavy saws)
  if (prefs.tools === "household") {
    const heavyTools = ["welder", "lathe", "table saw", "miter saw", "angle grinder", "router", "drill press"]
    const hasHeavy = idea.requiredTools.some((t) =>
      heavyTools.some((ht) => t.toLowerCase().includes(ht))
    )
    if (hasHeavy) {
      return {
        passed: false,
        rejectionReason: "Requires workshop equipment not available in typical household toolkits.",
      }
    }
  }

  // 4. Strict Budget Gate
  // If user selected ₹0 budget, reject ideas with mandatory minimum cost > ₹100
  if (prefs.budget === "free" && idea.estimatedCostINR && idea.estimatedCostINR.min > 100) {
    return {
      passed: false,
      rejectionReason: `Requires purchasing extra materials (est. min ₹${idea.estimatedCostINR.min}) exceeding a strict zero-budget constraint.`,
    }
  }

  // 5. Skill Level Gap Gate
  // Beginners should not be assigned Advanced DIY projects that risk injury or severe frustration
  if (prefs.experience === "beginner" && idea.difficulty === "advanced") {
    return {
      passed: false,
      rejectionReason: "Project difficulty is advanced, requiring specialized craftsmanship skills.",
    }
  }

  // 6. Time Constraint Gate
  // If user has 15 min, reject multi-day projects
  if (prefs.time === "15_min" && idea.estimatedMinutes && idea.estimatedMinutes > 90) {
    return {
      passed: false,
      rejectionReason: `Estimated time (${idea.estimatedMinutes} mins) significantly exceeds 15-minute quick fix limit.`,
    }
  }

  return { passed: true }
}

/**
 * Filter an array of candidate ideas against hard constraints
 */
export function filterFeasibleIdeas(
  ideas: ReuseIdea[],
  assessment: MaterialAssessment,
  prefs: UserPreferences
): { feasible: ReuseIdea[]; rejected: { idea: ReuseIdea; reason: string }[] } {
  const feasible: ReuseIdea[] = []
  const rejected: { idea: ReuseIdea; reason: string }[] = []

  for (const idea of ideas) {
    const result = checkHardConstraints(idea, assessment, prefs)
    if (result.passed) {
      feasible.push(idea)
    } else {
      rejected.push({
        idea,
        reason: result.rejectionReason || "Failed hard constraint criteria",
      })
    }
  }

  return { feasible, rejected }
}
