import { z } from "zod"

export const MaterialCategorySchema = z.enum([
  "plastic",
  "paper_cardboard",
  "textile",
  "wood",
  "organic",
  "metal",
  "glass",
  "e_waste",
  "composite",
  "hazardous",
])

export const MaterialAssessmentResponseSchema = z.object({
  detectedMaterial: z.string().min(1),
  category: MaterialCategorySchema,
  candidateMaterials: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1),
      category: MaterialCategorySchema,
      notes: z.string().optional(),
    })
  ),
  visibleEvidence: z.array(z.string()),
  labelsOrCodes: z.array(z.string()),
  uncertainties: z.array(z.string()),
  missingInfo: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  condition: z.enum(["clean", "lightly_soiled", "contaminated", "damaged", "unknown"]),
  quantity: z.string(),
  isHazardous: z.boolean(),
  requiresSpecialist: z.boolean(),
  routingLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
})

export const ReuseIdeaCandidateSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(["reuse", "repurpose", "recycle"]),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  description: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedMinutes: z.number().nullable(),
  estimatedCostINR: z
    .object({
      min: z.number(),
      max: z.number(),
      isEstimate: z.boolean(),
    })
    .nullable(),
  requiredTools: z.array(z.string()),
  requiredMaterials: z.array(z.string()),
  suitabilityConditions: z.array(z.string()),
  safetyNotes: z.array(z.string()),
  whyThisFits: z.string(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
    })
  ),
  requiresSpecialist: z.boolean(),
  lowerEffortAlternative: z.string().optional(),
})

export const CandidateGenerationResponseSchema = z.object({
  ideas: z.array(ReuseIdeaCandidateSchema),
})

export const PlanStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  instruction: z.string(),
  tip: z.string().optional(),
  safetyWarning: z.string().optional(),
})

export const ProjectPlanResponseSchema = z.object({
  id: z.string(),
  ideaId: z.string(),
  title: z.string(),
  outcome: z.string(),
  whyItFits: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  prepTimeMinutes: z.number(),
  executionTimeMinutes: z.number(),
  budgetEstimate: z.string(),
  materialsNeeded: z.array(
    z.object({
      name: z.string(),
      alreadyHaveLikely: z.boolean(),
    })
  ),
  toolsNeeded: z.array(
    z.object({
      name: z.string(),
      alreadyHaveLikely: z.boolean(),
    })
  ),
  steps: z.array(PlanStepSchema),
  safetyChecklist: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  completionChecklist: z.array(z.string()),
  alternatives: z.array(z.string()),
  recyclingAlternative: z.string(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
    })
  ),
})
