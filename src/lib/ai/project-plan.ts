import { ReuseIdea, MaterialAssessment, UserPreferences, ProjectPlan } from "@/types"
import { ProjectPlanResponseSchema } from "./schemas"
import { generateStructuredAI, getAIConfig } from "./provider"
import { FIXTURE_ITEMS } from "@/data/fixtures"

export interface GeneratePlanParams {
  idea: ReuseIdea
  assessment: MaterialAssessment
  preferences: UserPreferences
}

/**
 * Generates a full step-by-step project plan with tools, materials,
 * numbered steps, safety warnings, common mistakes, and checklists.
 */
export async function generateProjectPlan(
  params: GeneratePlanParams
): Promise<{ plan: ProjectPlan; isDemo: boolean }> {
  const config = getAIConfig()
  const { idea, assessment, preferences } = params

  // Check if a fixture plan exists for this idea
  for (const itemKey of Object.keys(FIXTURE_ITEMS)) {
    const fixtureItem = FIXTURE_ITEMS[itemKey]
    if (fixtureItem.plans[idea.id]) {
      return {
        plan: fixtureItem.plans[idea.id],
        isDemo: true,
      }
    }
  }

  if (config.isDemoMode) {
    // Generate a structured fallback plan from the idea metadata
    return {
      plan: buildFallbackPlanFromIdea(idea, assessment),
      isDemo: true,
    }
  }

  const systemInstruction = `You are ReMatter AI's master upcycling instructor and safety engineer.
Generate an actionable, step-by-step project execution plan.
Rules:
1. Steps must be plain, practical, numbered, and safe.
2. Label estimates clearly.
3. Include specific safety warnings for tool operations and material prep.
4. Output valid JSON matching ProjectPlanResponseSchema.`

  const prompt = `Create a complete step-by-step plan for this project:
Title: "${idea.title}"
Category: ${idea.category} (Level: ${idea.level})
Material: ${assessment.detectedMaterial} (Condition: ${assessment.condition})
User Skill: ${preferences.experience}
User Tools: ${preferences.tools}
Description: ${idea.description}
Estimated Time: ${idea.estimatedMinutes || 30} minutes
Estimated Budget: ₹${idea.estimatedCostINR?.min || 0} - ₹${idea.estimatedCostINR?.max || 50}

Generate the full plan in JSON with:
- id
- ideaId: "${idea.id}"
- title
- outcome
- whyItFits
- difficulty
- prepTimeMinutes
- executionTimeMinutes
- budgetEstimate
- materialsNeeded: array of { name, alreadyHaveLikely }
- toolsNeeded: array of { name, alreadyHaveLikely }
- steps: array of { stepNumber, title, instruction, tip, safetyWarning }
- safetyChecklist: array of critical precautions
- commonMistakes: array of pitfalls to avoid
- completionChecklist: array of verification criteria
- alternatives: 2 simpler or different variations
- recyclingAlternative: responsible recycling fallback route
- sources: array of { title, url }`

  const aiResult = await generateStructuredAI(prompt, ProjectPlanResponseSchema, {
    systemInstruction,
  })

  if (aiResult.success && aiResult.data) {
    return {
      plan: aiResult.data,
      isDemo: false,
    }
  }

  // Graceful fallback to synthesized plan
  return {
    plan: buildFallbackPlanFromIdea(idea, assessment),
    isDemo: true,
  }
}

function buildFallbackPlanFromIdea(idea: ReuseIdea, assessment: MaterialAssessment): ProjectPlan {
  return {
    id: `plan-${idea.id}-${Date.now()}`,
    ideaId: idea.id,
    title: `${idea.title} - Step-by-Step Guide`,
    outcome: idea.description,
    whyItFits: idea.whyThisFits || "Matches your available tools, budget, and materials.",
    difficulty: idea.difficulty,
    prepTimeMinutes: 5,
    executionTimeMinutes: idea.estimatedMinutes ? Math.max(10, idea.estimatedMinutes - 5) : 25,
    budgetEstimate: idea.estimatedCostINR ? `₹${idea.estimatedCostINR.min} - ₹${idea.estimatedCostINR.max}` : "₹0",
    materialsNeeded: idea.requiredMaterials.map((m) => ({ name: m, alreadyHaveLikely: true })),
    toolsNeeded: idea.requiredTools.map((t) => ({ name: t, alreadyHaveLikely: true })),
    steps: [
      {
        stepNumber: 1,
        title: "Clean and sanitize the reclaimed material",
        instruction: `Inspect the ${assessment.detectedMaterial}. Remove dirt, residue, or loose labels using lukewarm water and mild soap. Ensure it is completely dry before proceeding.`,
        tip: "Avoid harsh chemicals that might weaken the material integrity.",
      },
      {
        stepNumber: 2,
        title: "Measure and mark layout dimensions",
        instruction: "Use a pencil or non-permanent marker to map out cuts, fold lines, or puncture points accurately.",
        safetyWarning: "Double-check measurements before cutting to avoid wasting material.",
      },
      {
        stepNumber: 3,
        title: "Execute primary shaping and modifications",
        instruction: `Carefully cut or shape the material according to the outline using ${idea.requiredTools[0] || 'household scissors'}.`,
        safetyWarning: "Always cut away from your body and keep hands behind the blade edge.",
      },
      {
        stepNumber: 4,
        title: "Final assembly and finishing",
        instruction: "Assemble the parts together. Smooth any sharp edges with sandpaper or tape to ensure safe everyday handling.",
      },
      {
        stepNumber: 5,
        title: "Functional testing and deployment",
        instruction: "Test the finished item with a light load or in its intended location.",
        tip: "Share your result or note down any tweaks for future iterations.",
      },
    ],
    safetyChecklist: [
      ...idea.safetyNotes,
      "Ensure adequate lighting and ventilation in your workspace.",
      "Keep sharp blades and tools stored safely away from children.",
    ],
    commonMistakes: [
      "Skipping the initial cleaning step, leaving oily residues.",
      "Rushing cuts through curved surfaces.",
    ],
    completionChecklist: [
      "Material cleaned and prepped without sharp burrs",
      "Item functions smoothly for its intended purpose",
    ],
    alternatives: [
      idea.lowerEffortAlternative || "Direct storage use without modifications",
      "Donate to local maker club or school art project",
    ],
    recyclingAlternative: "If not completed, deposit in municipal dry waste or designated recycling drop-off.",
    sources: idea.sources,
  }
}
