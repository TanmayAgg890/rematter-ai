import { NextRequest, NextResponse } from "next/server"
import { searchRecyclingFacilities } from "@/lib/recycling/facility-search"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const material = searchParams.get("material") || undefined
    const query = searchParams.get("query") || undefined
    const city = searchParams.get("city") || undefined
    const facilityType = searchParams.get("facilityType") || undefined
    const verifiedOnly = searchParams.get("verifiedOnly") === "true"

    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")
    const userLat = latParam ? parseFloat(latParam) : undefined
    const userLng = lngParam ? parseFloat(lngParam) : undefined

    const facilities = searchRecyclingFacilities({
      material,
      query,
      city,
      facilityType,
      verifiedOnly,
      userLat,
      userLng,
    })

    return NextResponse.json({
      ok: true,
      data: facilities,
    })
  } catch (error: unknown) {
    console.error("[API /api/recycling error]", error)
    return NextResponse.json(
      { ok: false, error: "Failed to fetch recycling facilities." },
      { status: 500 }
    )
  }
}
