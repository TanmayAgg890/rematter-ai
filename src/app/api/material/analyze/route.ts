import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { analyzeMaterial } from "@/lib/ai/material-analysis"
import { validateScanInput } from "@/lib/validation/upload"

const AnalyzeRequestSchema = z.object({
  description: z.string().optional().default(""),
  quantity: z.string().optional().default("1 unit"),
  condition: z.enum(["clean", "lightly_soiled", "contaminated", "damaged", "unknown"]).optional().default("clean"),
  imageBase64: z.string().optional(),
  imageMimeType: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = AnalyzeRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { description, quantity, condition, imageBase64, imageMimeType } = parsed.data
    const inputValidation = validateScanInput(description, !!imageBase64)

    if (!inputValidation.isValid) {
      return NextResponse.json(
        { ok: false, error: inputValidation.error },
        { status: 400 }
      )
    }

    const result = await analyzeMaterial({
      description,
      quantity,
      condition,
      imageBase64,
      imageMimeType,
    })

    return NextResponse.json({
      ok: true,
      data: {
        assessment: result.assessment,
        isDemo: result.isDemo,
      },
    })
  } catch (error: unknown) {
    console.error("[API /api/material/analyze error]", error)
    return NextResponse.json(
      { ok: false, error: "An unexpected server error occurred during material analysis." },
      { status: 500 }
    )
  }
}
