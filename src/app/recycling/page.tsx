"use client"

import * as React from "react"
import Link from "next/link"
import { RecyclingFacility } from "@/types"
import { RECYCLING_FACILITIES } from "@/data/recycling-facilities"
import { 
  Search, 
  MapPin, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Navigation, 
  Filter, 
  Clock, 
  Flag,
  X
} from "lucide-react"

export default function RecyclingPage() {
  const [facilities, setFacilities] = React.useState<RecyclingFacility[]>(RECYCLING_FACILITIES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedMaterial, setSelectedMaterial] = React.useState("all")
  const [selectedCity, setSelectedCity] = React.useState("all")
  const [verifiedOnly, setVerifiedOnly] = React.useState(false)
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = React.useState(false)
  const [locationError, setLocationError] = React.useState<string | null>(null)

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [selectedFacilityForReport, setSelectedFacilityForReport] = React.useState<RecyclingFacility | null>(null)
  const [reportText, setReportText] = React.useState("")
  const [reportSuccess, setReportSuccess] = React.useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }
    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLocating(false)
      },
      (err) => {
        setLocationError(`Location access denied or unavailable: ${err.message}`)
        setLocating(false)
      }
    )
  }

  // Filter facilities
  const filteredFacilities = facilities.filter((fac) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      fac.name.toLowerCase().includes(q) ||
      fac.address.toLowerCase().includes(q) ||
      fac.city.toLowerCase().includes(q) ||
      fac.acceptedMaterials.some((m) => m.toLowerCase().includes(q))

    const matchesMaterial =
      selectedMaterial === "all" ||
      fac.acceptedMaterials.some((m) => m.toLowerCase() === selectedMaterial.toLowerCase())

    const matchesCity =
      selectedCity === "all" || fac.city.toLowerCase() === selectedCity.toLowerCase()

    const matchesVerified = !verifiedOnly || fac.isVerified

    return matchesQuery && matchesMaterial && matchesCity && matchesVerified
  })

  const handleOpenReport = (fac: RecyclingFacility) => {
    setSelectedFacilityForReport(fac)
    setReportModalOpen(true)
    setReportSuccess(false)
  }

  const handleSendReport = async () => {
    if (!selectedFacilityForReport) return
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "facility_report",
          targetId: selectedFacilityForReport.id,
          reason: reportText || "Reported inaccurate facility information",
        }),
      })
      setReportSuccess(true)
      setTimeout(() => {
        setReportModalOpen(false)
        setReportText("")
        setSelectedFacilityForReport(null)
      }, 1200)
    } catch {
      setReportModalOpen(false)
    }
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-emerald-primary/10 text-emerald-primary dark:text-mint text-xs font-bold uppercase tracking-wider inline-block mb-3">
          Circular Infrastructure
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-3">
          Verified Recycling Directory
        </h1>
        <p className="text-textLightSecondary dark:text-textDarkSecondary text-sm leading-relaxed">
          Ground-truth collection hubs for hazardous e-waste, complex packaging, and municipal material recovery. Zero fabricated entries.
        </p>
      </div>

      {/* Filter and Location Bar */}
      <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-5 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, address, or material..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-borderLightSubtle dark:border-white/10 bg-white dark:bg-forest-elevated text-sm text-textLightPrimary dark:text-textDarkPrimary placeholder:text-textLightSecondary/60 dark:placeholder:text-textDarkSecondary/60 focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Material Filter */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="px-3 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            >
              <option value="all">All Materials</option>
              <option value="e_waste">E-Waste & Batteries</option>
              <option value="plastic">Plastic & Polymers</option>
              <option value="paper_cardboard">Paper & Cardboard</option>
              <option value="metal">Metals</option>
              <option value="glass">Glass</option>
              <option value="textile">Textiles</option>
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs bg-white dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary focus:outline-none focus:ring-2 focus:ring-emerald-primary"
            >
              <option value="all">All Cities</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="delhi">New Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
            </select>

            {/* Verified Only Checkbox */}
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary cursor-pointer hover:bg-slate-50 dark:hover:bg-forest-elevated">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="text-emerald-primary rounded focus:ring-emerald-primary"
              />
              <span>Verified Only</span>
            </label>

            {/* Geolocation Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ivory dark:bg-forest-elevated border border-borderLightSubtle dark:border-white/10 text-xs font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-primary" />
              <span>{userLocation ? "Location Set" : locating ? "Locating..." : "Use My Location"}</span>
            </button>
          </div>
        </div>

        {locationError && (
          <p className="text-xs text-danger">{locationError}</p>
        )}
      </div>

      {/* Facilities List */}
      {filteredFacilities.length === 0 ? (
        <div className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-textLightSecondary dark:text-textDarkSecondary mx-auto mb-3" />
          <h3 className="text-base font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1">No verified facilities match your filters</h3>
          <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary mb-5">
            We never fabricate facility locations or phone numbers. If no certified center exists in this dataset, please contact your municipal dry waste helpline.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setSelectedMaterial("all")
              setSelectedCity("all")
              setVerifiedOnly(false)
            }}
            className="px-4 py-2 rounded-full bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition-colors focus-ring"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((facility) => {
            const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${facility.name}, ${facility.address}, ${facility.city}`
            )}`

            return (
              <div
                key={facility.id}
                className="bg-white dark:bg-forest-surface rounded-2xl border border-borderLightSubtle dark:border-white/10 p-6 shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      {facility.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald/15 dark:bg-emerald/20 text-emerald-800 dark:text-mint text-[11px] font-bold uppercase tracking-wider mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-primary" />
                          <span>Verified CPCB / PRO Partner</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Demo Data (Unverified)</span>
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-textLightPrimary dark:text-textDarkPrimary">{facility.name}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenReport(facility)}
                      title="Report incorrect information"
                      className="p-1.5 text-textLightSecondary dark:text-textDarkSecondary hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors focus-ring"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-textLightSecondary dark:text-textDarkSecondary mb-3">
                    <MapPin className="w-4 h-4 text-emerald-primary shrink-0 mt-0.5" />
                    <span>
                      {facility.address}, {facility.city}, {facility.state} {facility.pincode}
                    </span>
                  </div>

                  {/* Operating Hours */}
                  {facility.operatingHours && (
                    <div className="flex items-center gap-2 text-xs text-textLightSecondary dark:text-textDarkSecondary mb-3">
                      <Clock className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary shrink-0" />
                      <span>{facility.operatingHours}</span>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="flex items-center gap-2 text-xs text-textLightPrimary dark:text-textDarkPrimary font-medium mb-4">
                    <Phone className="w-4 h-4 text-emerald-primary shrink-0" />
                    <span>{facility.contact}</span>
                  </div>

                  {/* Accepted Materials Badges */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-textLightSecondary dark:text-textDarkSecondary block mb-1.5 uppercase tracking-wider">
                      Accepted Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {facility.acceptedMaterials.map((mat) => (
                        <span
                          key={mat}
                          className="px-2.5 py-0.5 rounded-full bg-ivory dark:bg-forest-elevated text-textLightPrimary dark:text-textDarkPrimary text-[11px] font-medium border border-borderLightSubtle dark:border-white/10 capitalize"
                        >
                          {mat.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {facility.notes && (
                    <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary italic mb-4">
                      "{facility.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-borderLightSubtle dark:border-white/10 flex items-center justify-between gap-3 text-xs">
                  <a
                    href={facility.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-primary dark:text-mint font-semibold hover:underline inline-flex items-center gap-1 focus-ring"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 text-white font-semibold hover:bg-forest-800 transition-colors shadow-sm focus-ring"
                  >
                    <Navigation className="w-3.5 h-3.5 text-mint" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && selectedFacilityForReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-forest-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-borderLightSubtle dark:border-white/10">
            <h3 className="text-base font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
              Report Incorrect Facility Data
            </h3>
            <p className="text-xs text-textLightSecondary dark:text-textDarkSecondary mb-4">
              Reporting: <strong className="text-textLightPrimary dark:text-textDarkPrimary">{selectedFacilityForReport.name}</strong>
            </p>

            {reportSuccess ? (
              <div className="p-3 bg-emerald/10 text-emerald-800 dark:text-mint rounded-lg text-xs text-center font-medium">
                ✓ Report logged. Our curation team will verify this listing.
              </div>
            ) : (
              <>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Phone number out of service, does not accept lithium batteries, new operating hours..."
                  className="w-full px-3.5 py-2.5 text-xs border border-borderLightSubtle dark:border-white/10 bg-white dark:bg-forest-elevated rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-primary text-textLightPrimary dark:text-textDarkPrimary placeholder:text-textLightSecondary/60 dark:placeholder:text-textDarkSecondary/60"
                />
                <div className="flex items-center justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-full font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReport}
                    className="px-4 py-2 rounded-full bg-emerald-primary text-forest-950 font-semibold hover:bg-emerald-400 transition-colors shadow-sm focus-ring"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
