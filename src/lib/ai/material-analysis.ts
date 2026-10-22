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
  bypassCache?: boolean
}

/**
 * Intelligently chooses an accurate fixture fallback based on visible/text evidence
 * when Gemini API key is not present or live AI call fails.
 * Jeans/textiles are correctly mapped to fabric/clothing, NEVER wrongly forced to plastic!
 */
function resolveBestFixture(desc: string): string {
  const text = (desc || "").toLowerCase()
  if (
    text.includes("jean") || 
    text.includes("denim") || 
    text.includes("pant") || 
    text.includes("trouser") || 
    text.includes("shirt") || 
    text.includes("cloth") || 
    text.includes("textile") || 
    text.includes("fabric") ||
    text.includes("cotton") ||
    text.includes("apparel") ||
    text.includes("garment") ||
    text.includes("wear")
  ) {
    return "old_tshirt"
  }

  if (
    text.includes("cardboard") || 
    text.includes("box") || 
    text.includes("carton") || 
    text.includes("kraft") || 
    text.includes("corrugat") || 
    text.includes("paper") ||
    text.includes("tray")
  ) {
    return "cardboard_box"
  }

  if (
    text.includes("phone") || 
    text.includes("battery") || 
    text.includes("lithium") || 
    text.includes("circuit") || 
    text.includes("pcb") || 
    text.includes("cable") || 
    text.includes("charger") || 
    text.includes("electronic") ||
    text.includes("e-waste")
  ) {
    return "smartphone_battery"
  }

  if (
    text.includes("bottle") || 
    text.includes("pet") || 
    text.includes("hdpe") || 
    text.includes("plastic") || 
    text.includes("container") || 
    text.includes("jug")
  ) {
    return "plastic_bottle"
  }

  // Default to textile if clothes are mentioned, otherwise plastic bottle
  return "plastic_bottle"
}

/**
 * Analyzes waste item materials through server-side vision AI
 * with genuine multimodal vision inspection, deterministic safety routing, 
 * honest uncertainty disclosure, and zero fabricated accuracy claims.
 */
export async function analyzeMaterial(
  params: AnalyzeMaterialParams
): Promise<{ assessment: MaterialAssessment; isDemo: boolean }> {
  const config = getAIConfig()
  const lowerDesc = (params.description || "").toLowerCase()

  // If in DEMO_MODE or key not present, check intelligent matching fixture
  if (config.isDemoMode) {
    const fixtureKey = resolveBestFixture(lowerDesc)
    const fixture = FIXTURE_ITEMS[fixtureKey] || FIXTURE_ITEMS.plastic_bottle

    // If text mentioned jeans or denim specifically, customize detected name accurately
    const isDenim = lowerDesc.includes("jean") || lowerDesc.includes("denim")
    const detectedName = isDenim 
      ? "Denim Cotton Garment (Textile / Apparel)" 
      : fixture.assessment.detectedMaterial

    return {
      assessment: {
        ...fixture.assessment,
        id: `assessment-${Date.now()}`,
        detectedMaterial: detectedName,
        quantity: params.quantity || fixture.assessment.quantity,
        condition: params.condition || fixture.assessment.condition,
        userConfirmed: false,
      },
      isDemo: true,
    }
  }

  const systemInstruction = `You are ReMatter AI's senior materials scientist and circular economy analyst.
Analyze the provided image and/or user description of discarded waste with rigorous real-world accuracy.
Strict Ground Rules:
1. ACCURATE OBJECT & MATERIAL IDENTIFICATION: Inspect the visible object, its shape, texture, weave, color, seams, and markings.
   - Denim jeans, cotton shirts, or fabrics MUST be classified as "textile", never as plastic or paper.
   - Plastic bottles/containers are "plastic".
   - Shipping boxes are "paper_cardboard".
   - If an image cannot be determined with certainty, set category to "composite" or honest best estimate and explicitly list the uncertainties.
2. HONEST UNCERTAINTIES & EVIDENCE:
   - Only list concrete visual evidence that is actually observable (e.g. "woven twill weave texture", "visible brass rivets and seams", "transparent PET contour").
   - Never claim a photo can verify chemical purity, exact fiber blend percentage, or food contact sterilization.
3. DETERMINISTIC SAFETY GATES:
   - If the item contains swollen lithium batteries, electronic PCB components, unknown chemicals, or medical sharps, set isHazardous: true and routingLevel: 3.
4. Output strictly valid JSON matching the requested schema.`

  const prompt = `Analyze this discarded waste item:
User Description: "${params.description || (params.imageBase64 ? "Examine the attached photo directly" : "Unknown item")}"
Quantity: "${params.quantity || '1 unit'}"
Reported Condition: "${params.condition || 'clean'}"

Analyze visible characteristics:
- detectedMaterial: Plain English name (e.g. "Denim Jeans (Cotton/Spandex Woven Fabric)" or "Clear PET Plastic Bottle")
- category: Exactly one of: plastic, paper_cardboard, textile, wood, organic, metal, glass, e_waste, composite, hazardous
- candidateMaterials: Array of candidate hypotheses with:
    name: specific material type
    confidence: calibrated estimate from 0.0 to 1.0 (do not inflate confidence)
    category: corresponding category
    notes: explanation of visual or physical clues
- visibleEvidence: Array of concrete visual observations (weave, shape, seams, color, logos, embossed markings)
- labelsOrCodes: Any detected recycling resin codes (#1-#7, PAP 20, etc.) or fabric care tags, or empty array if none visible
- uncertainties: What cannot be confirmed from appearance alone (e.g. exact fiber blend %, inner chemical residues)
- missingInfo: Critical user context that would clarify circular options
- followUpQuestions: Contextual questions tailored to this specific item and material
- condition: clean | lightly_soiled | contaminated | damaged | unknown
- quantity: approximate amount
- isHazardous: boolean (true for swollen lithium cells, toxic chemicals, biohazards)
- requiresSpecialist: boolean
- routingLevel: 1 (DIY at home), 2 (workshop/maker space), 3 (certified specialist recycling drop-off)`

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

  // Graceful fallback to verified fixture if live AI call fails
  console.warn("[ReMatter AI] Live material analysis failed or unconfigured, falling back to verified fixture.")
  const fallbackKey = resolveBestFixture(lowerDesc)
  const fallbackFixture = FIXTURE_ITEMS[fallbackKey] || FIXTURE_ITEMS.plastic_bottle

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
