import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateCandidateIdeas } from "@/lib/ai/candidate-generation"
import { rankIdeas } from "@/lib/feasibility/ranking"
import { MaterialAssessmentResponseSchema } from "@/lib/ai/schemas"

const RecommendationsRequestSchema = z.object({
  assessment: MaterialAssessmentResponseSchema.extend({
    id: z.string(),
    userConfirmed: z.boolean().optional().default(true),
  }),
  preferences: z.object({
    experience: z.enum(["beginner", "intermediate", "advanced"]),
    tools: z.enum(["household", "basic_tools", "workshop"]),
    budget: z.enum(["free", "under_200", "200_1000", "flexible"]),
    time: z.enum(["15_min", "1_hour", "few_hours", "multiple_days"]),
    goal: z.enum(["useful", "sellable", "min_effort", "recycle"]),
    location: z.string().optional(),
    extraConstraints: z.string().optional(),
    preferredCategory: z.string().optional(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RecommendationsRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid recommendations request", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { assessment, preferences } = parsed.data

    // 1. Generate candidates (AI or Fixture)
    const { ideas: candidateIdeas, isDemo } = await generateCandidateIdeas({
      assessment: assessment as any,
      preferences,
    })

    // 2. Run Feasibility Pipeline (Hard Constraints -> Deterministic Scoring -> Ranking)
    const rankingResult = rankIdeas(candidateIdeas, assessment as any, preferences)

    return NextResponse.json({
      ok: true,
      data: {
        ideas: rankingResult.rankedIdeas,
        rejectedCount: rankingResult.rejectedCount,
        hasFeasibleIdeas: rankingResult.hasFeasibleIdeas,
        fallbackMessage: rankingResult.fallbackMessage,
        isDemo,
      },
    })
  } catch (error: unknown) {
    console.error("[API /api/recommendations error]", error)
    return NextResponse.json(
      { ok: false, error: "Failed to generate recommendations." },
      { status: 500 }
    )
  }
}
