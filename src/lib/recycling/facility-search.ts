import { RecyclingFacility, MaterialCategory } from "@/types"
import { RECYCLING_FACILITIES } from "@/data/fixtures/../recycling-facilities"

export interface FacilitySearchParams {
  material?: MaterialCategory | string
  query?: string
  city?: string
  facilityType?: string
  verifiedOnly?: boolean
  userLat?: number
  userLng?: number
}

export interface FacilityWithDistance extends RecyclingFacility {
  distanceKm?: number
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export function searchRecyclingFacilities(params: FacilitySearchParams): FacilityWithDistance[] {
  let results = [...RECYCLING_FACILITIES]

  if (params.material) {
    const mat = params.material.toLowerCase()
    results = results.filter((f) =>
      f.acceptedMaterials.some((m) => m.toLowerCase().includes(mat))
    )
  }

  if (params.city) {
    const city = params.city.toLowerCase()
    results = results.filter((f) => f.city.toLowerCase().includes(city))
  }

  if (params.facilityType) {
    results = results.filter((f) => f.facilityType === params.facilityType)
  }

  if (params.verifiedOnly) {
    results = results.filter((f) => f.isVerified)
  }

  if (params.query) {
    const q = params.query.toLowerCase().trim()
    results = results.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.state.toLowerCase().includes(q) ||
        f.acceptedMaterials.some((m) => m.toLowerCase().includes(q))
    )
  }

  const enriched: FacilityWithDistance[] = results.map((f) => {
    if (params.userLat !== undefined && params.userLng !== undefined && f.latitude && f.longitude) {
      const distanceKm = calculateDistanceKm(params.userLat, params.userLng, f.latitude, f.longitude)
      return { ...f, distanceKm }
    }
    return f
  })

  // Sort by distance if location provided, else verified first
  if (params.userLat !== undefined && params.userLng !== undefined) {
    enriched.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
  } else {
    enriched.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0))
  }

  return enriched
}
