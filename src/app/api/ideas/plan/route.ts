import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateProjectPlan } from "@/lib/ai/project-plan"

const PlanRequestSchema = z.object({
  idea: z.any(),
  assessment: z.any(),
  preferences: z.any(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = PlanRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid plan request payload" },
        { status: 400 }
      )
    }

    const { idea, assessment, preferences } = parsed.data
    const { plan, isDemo } = await generateProjectPlan({
      idea,
      assessment,
      preferences,
    })

    return NextResponse.json({
      ok: true,
      data: {
        plan,
        isDemo,
      },
    })
  } catch (error: unknown) {
    console.error("[API /api/ideas/plan error]", error)
    return NextResponse.json(
      { ok: false, error: "Failed to generate project plan." },
      { status: 500 }
    )
  }
}
