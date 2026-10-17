import { describe, it, expect } from "vitest"
import { 
  MaterialAssessmentResponseSchema, 
  CandidateGenerationResponseSchema, 
  ProjectPlanResponseSchema 
} from "@/lib/ai/schemas"

describe("AI Output Schema Validation", () => {
  it("successfully parses valid material assessment JSON", () => {
    const valid = {
      detectedMaterial: "PET Plastic #1",
      category: "plastic",
      candidateMaterials: [
        {
          name: "PET",
          confidence: 0.95,
          category: "plastic",
          notes: "Transparent with molded mark",
        },
      ],
      visibleEvidence: ["Resin code 1 at bottom"],
      labelsOrCodes: ["PET 1"],
      uncertainties: ["Previous liquid residue"],
      missingInfo: ["Cleanliness state"],
      followUpQuestions: ["Did it contain oil?"],
      condition: "clean",
      quantity: "1 bottle",
      isHazardous: false,
      requiresSpecialist: false,
      routingLevel: 1,
    }

    const parsed = MaterialAssessmentResponseSchema.safeParse(valid)
    expect(parsed.success).toBe(true)
  })

  it("fails when required fields are missing or invalid category supplied", () => {
    const invalid = {
      detectedMaterial: "Unknown substance",
      category: "radioactive_unsupported_category", // Invalid category
      visibleEvidence: [],
    }

    const parsed = MaterialAssessmentResponseSchema.safeParse(invalid)
    expect(parsed.success).toBe(false)
  })

  it("validates candidate ideas array schema", () => {
    const validCandidates = {
      ideas: [
        {
          id: "idea-1",
          title: "Storage Box",
          category: "repurpose",
          level: 1,
          description: "Cut box into organizer",
          difficulty: "beginner",
          estimatedMinutes: 15,
          estimatedCostINR: { min: 0, max: 0, isEstimate: false },
          requiredTools: ["scissors"],
          requiredMaterials: ["cardboard"],
          suitabilityConditions: ["Dry cardboard"],
          safetyNotes: ["Watch fingers"],
          whyThisFits: "Easy and free",
          sources: [{ title: "EPA", url: "https://epa.gov" }],
          requiresSpecialist: false,
        },
      ],
    }

    const parsed = CandidateGenerationResponseSchema.safeParse(validCandidates)
    expect(parsed.success).toBe(true)
  })
})
