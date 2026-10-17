import { MaterialAssessment } from "@/types"
import { MaterialAssessmentResponseSchema } from "./schemas"
import { generateStructuredAI, getAIConfig } from "./provider"
import { FIXTURE_ITEMS } from "@/data/fixtures"

export interface AnalyzeMaterialParams {
  description: string
  quantity?: string
  condition?: "clean" | "lightly_soiled" | "contaminated" | "damaged" | "unknown"
  imageBase64?: string
  imageMimeType?: string
}

/**
 * Analyzes waste item materials through server-side vision AI
 * with deterministic safety routing and honest uncertainty disclosure.
 */
export async function analyzeMaterial(
  params: AnalyzeMaterialParams
): Promise<{ assessment: MaterialAssessment; isDemo: boolean }> {
  const config = getAIConfig()
  const lowerDesc = (params.description || "").toLowerCase()

  // If in DEMO_MODE or key not present, check matching fixture or default to plastic bottle
  if (config.isDemoMode) {
    let fixtureKey = "plastic_bottle"
    if (lowerDesc.includes("cardboard") || lowerDesc.includes("box") || lowerDesc.includes("carton")) {
      fixtureKey = "cardboard_box"
    } else if (lowerDesc.includes("shirt") || lowerDesc.includes("cloth") || lowerDesc.includes("textile") || lowerDesc.includes("fabric")) {
      fixtureKey = "old_tshirt"
    } else if (lowerDesc.includes("phone") || lowerDesc.includes("battery") || lowerDesc.includes("lithium") || lowerDesc.includes("electronic")) {
      fixtureKey = "smartphone_battery"
    }

    const fixture = FIXTURE_ITEMS[fixtureKey]
    return {
      assessment: {
        ...fixture.assessment,
        id: `assessment-${Date.now()}`,
        quantity: params.quantity || fixture.assessment.quantity,
        condition: params.condition || fixture.assessment.condition,
        userConfirmed: false,
      },
      isDemo: true,
    }
  }

  const systemInstruction = `You are ReMatter AI's materials scientist and circular economy analyst.
Analyze the provided image and/or user description of discarded waste.
Strict Ground Rules:
1. Never claim a photo can identify exact chemical purity, internal contamination, or hidden electrical hazards.
2. Clearly distinguish visible evidence (molded symbols, weave, grain) from probabilistic hypotheses.
3. If the item contains batteries, unknown chemicals, or electronic circuitry, flag isHazardous: true and routingLevel: 3.
4. Output strict JSON matching the requested schema.`

  const prompt = `Analyze this waste item:
Description: "${params.description}"
Quantity: "${params.quantity || '1 unit'}"
Reported Condition: "${params.condition || 'clean'}"

Provide a thorough material assessment in valid JSON with:
- detectedMaterial (clear, plain language name)
- category (one of: plastic, paper_cardboard, textile, wood, organic, metal, glass, e_waste, composite, hazardous)
- candidateMaterials (array with name, confidence 0-1, category, notes)
- visibleEvidence (concrete visual observations only)
- labelsOrCodes (detected recycling resin codes, marks, or empty array)
- uncertainties (what cannot be confirmed without laboratory testing)
- missingInfo (critical context needed from user)
- followUpQuestions (questions to clarify condition/suitability)
- condition
- quantity
- isHazardous (boolean)
- requiresSpecialist (boolean)
- routingLevel (1 for DIY at home, 2 for workshop/maker, 3 for professional specialist recycling)`

  const aiResult = await generateStructuredAI(prompt, MaterialAssessmentResponseSchema, {
    systemInstruction,
    imageBase64: params.imageBase64,
    imageMimeType: params.imageMimeType,
  })

  if (aiResult.success && aiResult.data) {
    return {
      assessment: {
        ...aiResult.data,
        id: `assessment-${Date.now()}`,
        userConfirmed: false,
      },
      isDemo: false,
    }
  }

  // Graceful fallback to fixture if live AI call fails
  console.warn("[ReMatter AI] Live material analysis failed or unconfigured, falling back to verified fixture.")
  const fallbackFixture = FIXTURE_ITEMS.plastic_bottle
  return {
    assessment: {
      ...fallbackFixture.assessment,
      id: `assessment-${Date.now()}`,
      quantity: params.quantity || fallbackFixture.assessment.quantity,
      condition: params.condition || fallbackFixture.assessment.condition,
      userConfirmed: false,
    },
    isDemo: true,
  }
}
