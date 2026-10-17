import { MaterialCategory, MaterialAssessment, ReuseIdea } from "@/types"

export interface SafetyCheckResult {
  isSafe: boolean
  violations: string[]
  mandatoryLevel?: 1 | 2 | 3
}

const HAZARDOUS_CATEGORIES: MaterialCategory[] = ["e_waste", "hazardous"]

const HAZARDOUS_KEYWORDS = [
  "battery",
  "lithium",
  "cell",
  "chemical",
  "pesticide",
  "acid",
  "solvent",
  "fluorescent",
  "mercury",
  "asbestos",
  "lead",
  "circuit board",
  "capacitor",
  "crt",
  "smoke detector",
  "gas cylinder",
  "pressurized",
]

/**
 * Checks whether an item or material is inherently hazardous and MUST be routed
 * to Level 3 (Professional Specialist Recycling) with NO DIY instructions.
 */
export function checkHazardousMaterial(
  assessment: Partial<MaterialAssessment>,
  description = ""
): SafetyCheckResult {
  const violations: string[] = []
  const textToScan = `${assessment.detectedMaterial || ""} ${description} ${(assessment.visibleEvidence || []).join(" ")}`.toLowerCase()

  if (assessment.category && HAZARDOUS_CATEGORIES.includes(assessment.category)) {
    violations.push(
      `Material category '${assessment.category}' contains hazardous substances requiring regulated professional recycling.`
    )
  }

  for (const keyword of HAZARDOUS_KEYWORDS) {
    if (textToScan.includes(keyword)) {
      violations.push(
        `Detected hazardous component/substance ('${keyword}'). Cannot safely perform domestic DIY processing.`
      )
      break
    }
  }

  if (assessment.condition === "contaminated") {
    violations.push(
      "Item is heavily contaminated with unknown or potentially toxic residue."
    )
  }

  if (violations.length > 0) {
    return {
      isSafe: false,
      violations,
      mandatoryLevel: 3, // Force Level 3 only
    }
  }

  return { isSafe: true, violations: [] }
}

/**
 * Safety Eligibility Gate:
 * Evaluates a candidate idea against critical safety boundaries.
 * Safety is an eligibility gate, NEVER a compensatory score.
 */
export function evaluateIdeaSafety(
  idea: ReuseIdea,
  assessment: MaterialAssessment
): SafetyCheckResult {
  const violations: string[] = []

  // Rule 1: Hazardous materials must NEVER have Level 1 or Level 2 DIY instructions
  if (assessment.isHazardous || assessment.category === "e_waste" || assessment.category === "hazardous") {
    if (idea.level !== 3) {
      violations.push(
        "Hazardous materials or electronic waste cannot be safely repurposed at home or in a basic workshop."
      )
    }
  }

  const ideaText = `${idea.title} ${idea.description} ${idea.suitabilityConditions.join(" ")}`.toLowerCase()

  // Rule 2: Food or Beverage Contact prohibition for recycled plastics without certified food-grade verification
  const foodKeywords = ["drink", "eat", "food", "cup", "plate", "bowl", "straw", "utensil", "cooking", "feed"]
  const touchesFood = foodKeywords.some((w) => ideaText.includes(w))
  if (touchesFood && assessment.category === "plastic") {
    violations.push(
      "Uncertified post-consumer plastics cannot be safely repurposed for direct food or beverage contact due to chemical leaching."
    )
  }

  // Rule 3: Child or infant contact safety
  const infantKeywords = ["baby", "infant", "toddler", "toy", "chew", "crib"]
  const forInfants = infantKeywords.some((w) => ideaText.includes(w))
  if (forInfants) {
    violations.push(
      "Items made from unsanitized reclaimed waste must not be used as toys or items for infants/toddlers due to choking and toxicity hazards."
    )
  }

  // Rule 4: Structural or life-safety applications
  const safetyKeywords = ["helmet", "structural beam", "load bearing", "ladder", "harness", "electrical plug", "wiring"]
  if (safetyKeywords.some((w) => ideaText.includes(w))) {
    violations.push(
      "Reclaimed materials of unverified structural integrity cannot be used in life-safety or high-load applications."
    )
  }

  return {
    isSafe: violations.length === 0,
    violations,
  }
}
