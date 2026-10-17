import { MaterialAssessment, UserPreferences, ReuseIdea } from "@/types"
import { CandidateGenerationResponseSchema } from "./schemas"
import { generateStructuredAI, getAIConfig } from "./provider"
import { FIXTURE_ITEMS } from "@/data/fixtures"

export interface GenerateCandidatesParams {
  assessment: MaterialAssessment
  preferences: UserPreferences
}

/**
 * Generates reuse, repurpose, and recycling candidates using Gemini AI
 * or returns curated fixtures in DEMO_MODE.
 */
export async function generateCandidateIdeas(
  params: GenerateCandidatesParams
): Promise<{ ideas: ReuseIdea[]; isDemo: boolean }> {
  const config = getAIConfig()
  const { assessment, preferences } = params

  if (config.isDemoMode) {
    let fixtureKey = "plastic_bottle"
    if (assessment.category === "paper_cardboard") {
      fixtureKey = "cardboard_box"
    } else if (assessment.category === "textile") {
      fixtureKey = "old_tshirt"
    } else if (assessment.category === "e_waste" || assessment.category === "hazardous" || assessment.isHazardous) {
      fixtureKey = "smartphone_battery"
    }

    const fixture = FIXTURE_ITEMS[fixtureKey]
    return {
      ideas: fixture.candidateIdeas,
      isDemo: true,
    }
  }

  const systemInstruction = `You are ReMatter AI's sustainable product engineer and circular pathways generator.
Given a verified material assessment and user constraints (skills, tools, budget, time, goal), generate 3 to 5 realistic next steps.
Category definitions:
- reuse: use the item again with little/no transformation (e.g. cleaning rags, storage containers)
- repurpose: transform the item into another use (e.g. self-watering planter, drawer dividers)
- recycle: route to certified municipal or commercial recycling when DIY is unsafe or inefficient

Strict Rules:
1. Prefer realistic, low-effort, safe options over impressive impractical ones.
2. If the item is hazardous or electronic waste, ONLY output Level 3 recycling ideas. NO DIY projects.
3. All cost estimates must be in INR and labelled as estimates.
4. Output strict JSON matching the CandidateGenerationResponseSchema.`

  const prompt = `Generate circular pathways for this item:
Material: ${assessment.detectedMaterial} (Category: ${assessment.category})
Condition: ${assessment.condition}
Quantity: ${assessment.quantity}
Hazardous: ${assessment.isHazardous ? "YES (Hazardous - Level 3 only)" : "No"}

User Constraints:
- Experience: ${preferences.experience}
- Tools Available: ${preferences.tools}
- Budget Tier: ${preferences.budget}
- Available Time: ${preferences.time}
- Primary Goal: ${preferences.goal}
${preferences.extraConstraints ? `Extra Constraints: ${preferences.extraConstraints}` : ''}

Generate candidate pathways with:
- id
- title
- category (reuse | repurpose | recycle)
- level (1: DIY at home, 2: Workshop / Maker, 3: Professional Recycling)
- description
- difficulty (beginner | intermediate | advanced)
- estimatedMinutes
- estimatedCostINR (min, max, isEstimate: true)
- requiredTools
- requiredMaterials
- suitabilityConditions
- safetyNotes
- whyThisFits
- sources (real organizations / guides only)
- requiresSpecialist
- lowerEffortAlternative`

  const aiResult = await generateStructuredAI(prompt, CandidateGenerationResponseSchema, {
    systemInstruction,
  })

  if (aiResult.success && aiResult.data && aiResult.data.ideas.length > 0) {
    const ideasWithInitialFeasibility: ReuseIdea[] = aiResult.data.ideas.map((idea) => ({
      ...idea,
      feasibility: {
        score: null,
        qualitativeLabel: "Possible fit",
        explanation: "Evaluating against your specific tools and constraints...",
      },
      reviewStatus: "automated_suggestion",
    }))

    return {
      ideas: ideasWithInitialFeasibility,
      isDemo: false,
    }
  }

  // Graceful fallback to fixture
  console.warn("[ReMatter AI] AI candidate generation failed or returned empty; using verified fixtures.")
  const fallback = FIXTURE_ITEMS.plastic_bottle
  return {
    ideas: fallback.candidateIdeas,
    isDemo: true,
  }
}
