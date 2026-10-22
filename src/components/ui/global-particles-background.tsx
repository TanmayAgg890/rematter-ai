"use client"

import * as React from "react"
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background"

/**
 * Renders the global ambient fluid particles as a fixed, non-interactive background.
 * Recolored to mocha brown, platinum silver, and pale lavender with high continuous performance.
 */
export function GlobalParticlesBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <FluidParticlesBackground
        particleCount={720}
        mobileParticleCount={300}
        interactive={true}
        backgroundColor="#171515"
        particleColors={[
          "#DCD6F7", // Pale Lavender
          "#B9A9EE", // Lavender Accent
          "#D5D6D8", // Platinum Silver
          "#ECEBED", // Light Platinum
          "#6F5148", // Mocha Brown
          "#A0847B", // Light Mocha
          "#F5F3F3", // Primary Light Text highlight
        ]}
      />
    </div>
  )
}
