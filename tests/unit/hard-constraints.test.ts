import { describe, it, expect } from "vitest"
import { checkHardConstraints, filterFeasibleIdeas } from "@/lib/feasibility/hard-constraints"
import { evaluateIdeaSafety, checkHazardousMaterial } from "@/lib/feasibility/safety-rules"
import { ReuseIdea, MaterialAssessment, UserPreferences } from "@/types"

describe("Hard Constraints & Safety Eligibility Gates", () => {
  const baseAssessment: MaterialAssessment = {
    id: "assess-plastic",
    detectedMaterial: "PET Plastic Bottle",
    category: "plastic",
    candidateMaterials: [],
    visibleEvidence: [],
    labelsOrCodes: [],
    uncertainties: [],
    missingInfo: [],
    followUpQuestions: [],
    condition: "clean",
    quantity: "1 bottle",
    isHazardous: false,
    requiresSpecialist: false,
    routingLevel: 1,
    userConfirmed: true,
  }

  const basePrefs: UserPreferences = {
    experience: "beginner",
    tools: "household",
    budget: "free",
    time: "1_hour",
    goal: "useful",
  }

  it("CRITICAL RULE: Rejects DIY ideas for hazardous materials even if high score", () => {
    const hazardousAssessment: MaterialAssessment = {
      ...baseAssessment,
      category: "e_waste",
      detectedMaterial: "Swollen Lithium Battery",
      isHazardous: true,
      routingLevel: 3,
    }

    const diyIdea: ReuseIdea = {
      id: "fake-diy",
      title: "DIY Battery Powerbank Enclosure",
      category: "repurpose",
      level: 1, // Invalid Level 1 for hazardous item
      description: "Cut and solder cells together",
      difficulty: "beginner",
      estimatedMinutes: 20,
      estimatedCostINR: { min: 0, max: 0, isEstimate: false },
      requiredTools: ["scissors"],
      requiredMaterials: [],
      suitabilityConditions: [],
      safetyNotes: [],
      feasibility: { score: 95, qualitativeLabel: "Good fit", explanation: "" },
      sources: [],
      reviewStatus: "verified",
      requiresSpecialist: false,
      whyThisFits: "High score fit",
    }

    const check = checkHardConstraints(diyIdea, hazardousAssessment, basePrefs)
    expect(check.passed).toBe(false)
    expect(check.rejectionReason).toContain("Safety violation")
  })

  it("Rejects food-contact applications for recycled plastics", () => {
    const foodContactIdea: ReuseIdea = {
      id: "food-bowl",
      title: "Direct Food Contact Salad Bowl",
      category: "reuse",
      level: 1,
      description: "Use bottom to eat your lunch or food",
      difficulty: "beginner",
      estimatedMinutes: 10,
      estimatedCostINR: { min: 0, max: 0, isEstimate: false },
      requiredTools: ["scissors"],
      requiredMaterials: [],
      suitabilityConditions: [],
      safetyNotes: [],
      feasibility: { score: 90, qualitativeLabel: "Good fit", explanation: "" },
      sources: [],
      reviewStatus: "verified",
      requiresSpecialist: false,
      whyThisFits: "Easy",
    }

    const safety = evaluateIdeaSafety(foodContactIdea, baseAssessment)
    expect(safety.isSafe).toBe(false)
    expect(safety.violations[0]).toContain("food or beverage contact")
  })

  it("Rejects ideas requiring unavailable workshop machinery for household users", () => {
    const workshopIdea: ReuseIdea = {
      id: "welded-art",
      title: "Welded Metal & Plastic Structure",
      category: "repurpose",
      level: 2,
      description: "Weld frame and grind edges",
      difficulty: "intermediate",
      estimatedMinutes: 60,
      estimatedCostINR: { min: 50, max: 100, isEstimate: false },
      requiredTools: ["table saw", "angle grinder"],
      requiredMaterials: [],
      suitabilityConditions: [],
      safetyNotes: [],
      feasibility: { score: 70, qualitativeLabel: "Possible fit", explanation: "" },
      sources: [],
      reviewStatus: "verified",
      requiresSpecialist: false,
      whyThisFits: "Workshop",
    }

    const check = checkHardConstraints(workshopIdea, baseAssessment, basePrefs)
    expect(check.passed).toBe(false)
    expect(check.rejectionReason).toContain("workshop equipment not available")
  })

  it("Rejects ideas with non-zero minimum spend under strict zero-budget constraint", () => {
    const costlyIdea: ReuseIdea = {
      id: "expensive-kit",
      title: "Resin Cast Paperweight",
      category: "repurpose",
      level: 1,
      description: "Requires epoxy resin kit",
      difficulty: "beginner",
      estimatedMinutes: 45,
      estimatedCostINR: { min: 450, max: 800, isEstimate: false },
      requiredTools: ["scissors"],
      requiredMaterials: ["epoxy resin kit"],
      suitabilityConditions: [],
      safetyNotes: [],
      feasibility: { score: 60, qualitativeLabel: "Possible fit", explanation: "" },
      sources: [],
      reviewStatus: "verified",
      requiresSpecialist: false,
      whyThisFits: "Resin",
    }

    const check = checkHardConstraints(costlyIdea, baseAssessment, { ...basePrefs, budget: "free" })
    expect(check.passed).toBe(false)
    expect(check.rejectionReason).toContain("exceeding a strict zero-budget constraint")
  })
})
