import { describe, it, expect } from "vitest"
import { 
  DEFAULT_WEIGHTS, 
  validateWeights, 
  calculateToolScore, 
  calculateBudgetScore, 
  calculateSkillScore, 
  calculateTimeScore, 
  computeFeasibility 
} from "@/lib/feasibility/scoring"
import { ReuseIdea, MaterialAssessment, UserPreferences } from "@/types"

describe("Feasibility Scoring Equations (Eq. 1, 2, 3)", () => {
  it("enforces default weights sum strictly to 1.0", () => {
    expect(validateWeights(DEFAULT_WEIGHTS)).toBe(true)
    const sum =
      DEFAULT_WEIGHTS.tool +
      DEFAULT_WEIGHTS.budget +
      DEFAULT_WEIGHTS.skill +
      DEFAULT_WEIGHTS.time +
      DEFAULT_WEIGHTS.material
    expect(sum).toBeCloseTo(1.0, 5)
  })

  it("calculates tool compatibility score based on tiers", () => {
    // Household user vs household required -> 1.0
    expect(calculateToolScore(["scissors", "tape"], "household")).toBe(1.0)
    // Household user vs power drill required -> 0.5 (one tier above)
    expect(calculateToolScore(["power drill"], "household")).toBe(0.1)
    // Workshop user vs power drill -> 1.0
    expect(calculateToolScore(["power drill"], "workshop")).toBe(1.0)
  })

  it("calculates budget compatibility score for zero-budget constraints", () => {
    expect(calculateBudgetScore({ min: 0, max: 0, isEstimate: false }, "free")).toBe(1.0)
    expect(calculateBudgetScore({ min: 50, max: 250, isEstimate: true }, "free")).toBe(0.0)
    expect(calculateBudgetScore({ min: 50, max: 150, isEstimate: true }, "under_200")).toBe(0.8)
  })

  it("calculates skill compatibility score properly", () => {
    expect(calculateSkillScore("beginner", "beginner")).toBe(1.0)
    expect(calculateSkillScore("intermediate", "beginner")).toBe(0.6)
    expect(calculateSkillScore("advanced", "beginner")).toBe(0.2)
  })

  it("computes composite weighted feasibility score correctly", () => {
    const mockIdea: ReuseIdea = {
      id: "mock-planter",
      title: "Self-Watering Planter",
      category: "repurpose",
      level: 1,
      description: "Cut bottle planter",
      difficulty: "beginner",
      estimatedMinutes: 20,
      estimatedCostINR: { min: 0, max: 0, isEstimate: false },
      requiredTools: ["scissors"],
      requiredMaterials: ["cotton twine"],
      suitabilityConditions: [],
      safetyNotes: [],
      feasibility: { score: null, qualitativeLabel: "Possible fit", explanation: "" },
      sources: [],
      reviewStatus: "verified",
      requiresSpecialist: false,
      whyThisFits: "Easy match",
    }

    const mockAssessment: MaterialAssessment = {
      id: "assess-01",
      detectedMaterial: "PET Plastic",
      category: "plastic",
      candidateMaterials: [],
      visibleEvidence: [],
      labelsOrCodes: [],
      uncertainties: [],
      missingInfo: [],
      followUpQuestions: [],
      condition: "clean",
      quantity: "1 unit",
      isHazardous: false,
      requiresSpecialist: false,
      routingLevel: 1,
      userConfirmed: true,
    }

    const mockPrefs: UserPreferences = {
      experience: "beginner",
      tools: "household",
      budget: "free",
      time: "1_hour",
      goal: "useful",
    }

    const result = computeFeasibility(mockIdea, mockAssessment, mockPrefs)
    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.qualitativeLabel).toBe("Good fit")
    expect(result.breakdown).toBeDefined()
    expect(result.breakdown?.tool).toBe(1.0)
    expect(result.breakdown?.budget).toBe(1.0)
    expect(result.breakdown?.skill).toBe(1.0)
  })
})
