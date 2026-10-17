"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, ShieldCheck, Cpu, RefreshCw } from "lucide-react"
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[700px] flex items-center justify-center bg-[#0B1713] text-[#F4F8F5] overflow-hidden py-20 px-4 sm:px-6">
      {/* 1. Fluid Particles Background Canvas */}
      <FluidParticlesBackground 
        particleCount={750}
        mobileParticleCount={320}
        interactive={true}
        backgroundColor="#102A22"
        particleColors={["#2FC48A", "#9BE7BD", "#18352A", "#F4F8F5", "#5FD69E"]}
      />

      {/* 2. Centered Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18352A]/90 border border-[#2FC48A]/30 backdrop-blur-sm mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-light">
            AI-Powered Circular Materials Platform
          </span>
        </div>

        {/* Main Headline (Clean non-editable text, zero caret/cursor artifact) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-[#F4F8F5] leading-[1.08] mb-6 select-text">
          Your waste has <br className="hidden sm:inline" />
          another <span className="font-semibold text-emerald-primary italic">purpose.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#C0CEC5] max-w-xl mx-auto leading-relaxed mb-9">
          Turn discarded materials into practical possibilities. Discover what you can reuse, create, or recycle based on your resources, skills, and budget.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
          <Link
            href="/scan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-full bg-emerald-primary text-forest-950 text-sm font-bold hover:bg-emerald-400 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg focus-ring"
          >
            <Sparkles className="w-4 h-4 text-forest-950" />
            <span>Start a Waste Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#18352A]/80 hover:bg-[#215344]/80 border border-white/15 text-[#F4F8F5] text-sm font-semibold transition-colors duration-200 focus-ring"
          >
            <span>Explore Materials</span>
          </Link>
        </div>

        {/* Compact Trust / Product Indicators */}
        <div className="pt-6 border-t border-white/10 w-full max-w-lg flex flex-wrap items-center justify-center gap-6 text-xs text-[#C0CEC5]/80 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Deterministic Safety Gates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Transparent Feasibility Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Zero Hallucinated Recyclers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
