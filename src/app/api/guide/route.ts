import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAIConfig } from "@/lib/ai/provider"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GuideRequestSchema = z.object({
  message: z.string().min(1).max(500),
  pathname: z.string().optional().default("/"),
  context: z.record(z.string(), z.any()).optional().default({}),
})

// Knowledge base grounded strictly in ReMatter AI's real architecture and guidelines
const SYSTEM_PROMPT = `You are ReMatter Guide, the intelligent contextual assistant for the ReMatter AI sustainability platform.
Your job is to help users navigate the site, understand waste assessment, evaluate feasibility scoring, and choose between reuse, repurposing, and certified recycling.

Ground rules:
1. ReMatter uses deterministic safety gates. Hazardous waste (swollen lithium batteries, chemical toxins, asbestos, biohazard, medical waste) is NEVER recommended for DIY; direct users to '/recycling'.
2. Feasibility scoring uses a weighted deterministic formula: S = 100 * sum(w_f * s_f), evaluating Tools (25%), Budget (20%), Skill (20%), Time (15%), and Material condition (20%). It is guidance, not an absolute guarantee.
3. Three Levels: Level 1 (At-home DIY with hand tools), Level 2 (Makerspace/workshop with power tools), Level 3 (Certified CPCB/PRO recycling partner).
4. Direct users to real paths:
   - To scan an item: '/scan'
   - To explore materials and curated ideas: '/explore'
   - To find verified recycling centers: '/recycling'
   - To view saved projects: '/dashboard'
5. Be concise (2-4 sentences max), friendly, practical, and articulate.
6. If the user asks for a navigation action, suggest the exact route in brackets like [navigate:/scan] so the UI can offer a 1-click button.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = GuideRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid guide request" },
        { status: 400 }
      )
    }

    const { message, pathname, context } = parsed.data
    const config = getAIConfig()

    // If Gemini API is configured and demo mode is false, call the model
    if (!config.isDemoMode && config.apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(config.apiKey)
        const model = genAI.getGenerativeModel({
          model: config.modelName,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250,
          },
          systemInstruction: SYSTEM_PROMPT,
        })

        const prompt = `Current page: ${pathname}\nContext data: ${JSON.stringify(
          context
        )}\nUser question: ${message}`
        const result = await model.generateContent(prompt)
        const replyText = result.response.text()

        return NextResponse.json({
          ok: true,
          data: {
            reply: replyText.trim(),
            suggestedAction: extractSuggestedAction(replyText, pathname),
          },
        })
      } catch (aiErr) {
        console.warn("[ReMatter Guide AI Fallback]", aiErr)
      }
    }

    // Deterministic fallback response when Gemini is not configured or fails
    const fallbackResponse = getFallbackResponse(message, pathname)
    return NextResponse.json({
      ok: true,
      data: fallbackResponse,
    })
  } catch (error) {
    console.error("[ReMatter Guide API Error]", error)
    return NextResponse.json(
      { ok: false, error: "Failed to process guide request." },
      { status: 500 }
    )
  }
}

function extractSuggestedAction(text: string, currentPath: string): { label: string; href: string } | null {
  const match = text.match(/\[navigate:(\/[a-z0-9\-_/]*)\]/i)
  if (match && match[1] !== currentPath) {
    const route = match[1]
    const label = route === "/scan" ? "Go to Waste Scan" :
                  route === "/explore" ? "Browse Materials" :
                  route === "/recycling" ? "View Recycling Directory" :
                  route === "/dashboard" ? "Open Dashboard" : "Open Page"
    return { label, href: route }
  }
  return null
}

function getFallbackResponse(message: string, pathname: string): { reply: string; suggestedAction: { label: string; href: string } | null } {
  const lower = message.toLowerCase()

  if (lower.includes("scan") || lower.includes("start") || lower.includes("upload") || lower.includes("camera") || lower.includes("assess")) {
    return {
      reply: "You can start a waste assessment by taking a photo or describing your item. ReMatter AI identifies the material and checks safety gates before recommending pathways.",
      suggestedAction: pathname === "/scan" ? null : { label: "Start a Waste Scan", href: "/scan" },
    }
  }

  if (lower.includes("recycle") || lower.includes("facility") || lower.includes("battery") || lower.includes("hazard") || lower.includes("e-waste")) {
    return {
      reply: "Hazardous or complex materials (such as lithium batteries and contaminated electronics) require certified disposal. Check our verified CPCB / PRO directory for drop-off hubs.",
      suggestedAction: pathname === "/recycling" ? null : { label: "Open Recycling Directory", href: "/recycling" },
    }
  }

  if (lower.includes("feasibility") || lower.includes("score") || lower.includes("formula") || lower.includes("how it works")) {
    return {
      reply: "Feasibility scores (0-100) are deterministically calculated based on 5 factors: Tools (25%), Budget (20%), Skill (20%), Time (15%), and Material condition (20%). It provides transparent guidance on what fits your profile.",
      suggestedAction: { label: "Learn How It Works", href: "/#how-it-works" },
    }
  }

  if (lower.includes("material") || lower.includes("wood") || lower.includes("glass") || lower.includes("plastic") || lower.includes("metal") || lower.includes("textile")) {
    return {
      reply: "ReMatter supports six primary reclaimed material categories: Glass, Wood, Textiles, Metals, Paper/Cardboard, and Polymers. Explore our curated ideas to see what is possible.",
      suggestedAction: pathname === "/explore" ? null : { label: "Explore Materials", href: "/explore" },
    }
  }

  if (lower.includes("dashboard") || lower.includes("saved") || lower.includes("progress")) {
    return {
      reply: "Your saved circular ideas, current scan sessions, and completed builds are organized in your Personal Workspace.",
      suggestedAction: pathname === "/dashboard" ? null : { label: "Open Dashboard", href: "/dashboard" },
    }
  }

  // Default contextual answer
  return {
    reply: "ReMatter AI guides you through turning discarded materials into practical possibilities through reuse, repurposing, or certified recycling. Where would you like to begin?",
    suggestedAction: pathname === "/scan" ? { label: "Explore Materials", href: "/explore" } : { label: "Start a Waste Scan", href: "/scan" },
  }
}
