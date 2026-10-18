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
        particleCount={750}
        mobileParticleCount={320}
        interactive={true}
        backgroundColor="#0B1713"
        particleColors={["#2FC48A", "#9BE7BD", "#38D394", "#5FD69E", "#F4F8F5"]}
      />
    </div>
  )
}
