import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const FeedbackRequestSchema = z.object({
  type: z.enum(["not_suitable", "incorrect_advice", "facility_report", "general"]),
  targetId: z.string().optional(),
  reason: z.string().min(1),
  details: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = FeedbackRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid feedback payload" },
        { status: 400 }
      )
    }

    const { type, targetId, reason, details } = parsed.data
    // In production with Supabase, writes to feedback table
    console.info(`[ReMatter Feedback Logged] Type: ${type}, Target: ${targetId || 'N/A'}, Reason: ${reason}`)

    return NextResponse.json({
      ok: true,
      data: {
        recordedAt: new Date().toISOString(),
        message: "Thank you. Your feedback has been noted for this session.",
      },
    })
  } catch (error: unknown) {
    console.error("[API /api/feedback error]", error)
    return NextResponse.json(
      { ok: false, error: "Failed to record feedback." },
      { status: 500 }
    )
  }
}
