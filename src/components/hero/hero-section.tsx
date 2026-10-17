"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, ShieldCheck, Cpu, RefreshCw } from "lucide-react"
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[720px] flex items-center justify-center bg-forest-900 text-textLight overflow-hidden py-20 px-4 sm:px-6">
      {/* 1. Fluid Particles Background Canvas */}
      <FluidParticlesBackground 
        particleCount={750}
        mobileParticleCount={340}
        interactive={true}
        backgroundColor="#102A22"
        particleColors={["#2FBF83", "#8CE6B0", "#48A987", "#F7FAF7", "#5FD69E"]}
      />

      {/* 2. Centered Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-forest-800/80 border border-emerald-primary/30 backdrop-blur-sm mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-light">
            AI-Powered Circular Decision Support
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-textLight leading-[1.08] mb-6">
          Your waste has <br className="hidden sm:inline" />
          another <span className="font-semibold text-emerald-primary italic">purpose.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-textLightMuted max-w-xl mx-auto leading-relaxed mb-9">
          Turn discarded materials into practical possibilities. Discover what you can realistically reuse, create, or recycle based on your resources, skills, and budget.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
          <Link
            href="/scan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-7 rounded-pill bg-emerald-primary text-forest-950 text-sm font-bold hover:bg-emerald-400 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-light focus:ring-offset-2 focus:ring-offset-forest-900"
          >
            <Sparkles className="w-4 h-4 text-forest-950" />
            <span>Start a Waste Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-forest-800/80 hover:bg-forest-700/80 border border-white/10 text-textLight text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <span>Explore Possibilities</span>
          </Link>
        </div>

        {/* Compact Trust / Product Indicators */}
        <div className="pt-6 border-t border-white/10 w-full max-w-lg flex flex-wrap items-center justify-center gap-6 text-xs text-textLightMuted/80 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Deterministic Safety Gates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Feasibility Scoring ($S$)</span>
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
