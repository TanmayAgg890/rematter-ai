"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, ShieldCheck, Cpu, RefreshCw } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[540px] lg:min-h-[640px] flex items-center justify-center bg-transparent text-[#F5F3F3] overflow-hidden py-16 sm:py-20 px-4 sm:px-6">
      {/* Centered Content Container directly over fluid particles */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mocha-deep/80 border border-lavender-accent/30 backdrop-blur-md mb-6 sm:mb-7 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-lavender-accent animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-platinum-light">
            AI-Powered Circular Materials Platform
          </span>
        </div>

        {/* Main Headline with high-quality typography, confident weight, and letter spacing */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-[#F5F3F3] leading-[1.08] mb-4 sm:mb-5 select-text">
          Your Waste. <br className="hidden sm:inline" />
          A New <span className="font-semibold text-lavender-accent italic">Possibility.</span>
        </h1>

        {/* Minimal Single-line Description */}
        <p className="text-base sm:text-lg md:text-xl text-platinum max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-9 select-text md:whitespace-nowrap font-normal">
          Turn everyday waste into something useful.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 sm:mb-12">
          <a
            href="#waste-input"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-full bg-mocha hover:bg-mocha-hover active:scale-95 text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg focus-ring border border-mocha-light/30"
          >
            <Sparkles className="w-4 h-4 text-lavender" />
            <span>Start a Waste Scan</span>
            <ArrowRight className="w-4 h-4 text-platinum-light" />
          </a>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-mocha-surface/70 hover:bg-mocha-deep/80 border border-platinum/20 text-[#F5F3F3] text-sm font-semibold transition-colors duration-200 focus-ring backdrop-blur-md"
          >
            <span>Explore Materials</span>
          </Link>
        </div>

        {/* Compact Trust / Product Indicators */}
        <div className="pt-6 border-t border-platinum/15 w-full max-w-xl flex flex-wrap items-center justify-center gap-6 text-xs text-platinum font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Deterministic Safety Gates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Transparent Feasibility Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-lavender-accent" />
            <span>Zero Hallucinated Recyclers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
