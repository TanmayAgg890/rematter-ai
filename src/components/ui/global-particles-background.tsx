"use client"

import * as React from "react"
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background"

/**
 * Renders the global ambient fluid particles as a fixed, non-interactive background.
 * Wrapped in a client boundary so layout.tsx (server component) can import it safely.
 */
export function GlobalParticlesBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <FluidParticlesBackground
        particleCount={600}
        mobileParticleCount={250}
        interactive={false}
        backgroundColor="#0B1713"
        particleColors={["#2FC48A", "#9BE7BD", "#18352A", "#5FD69E", "#C0CEC5"]}
      />
    </div>
  )
}
