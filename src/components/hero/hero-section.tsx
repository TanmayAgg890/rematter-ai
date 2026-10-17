"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Dynamically import SculptureHero with SSR disabled for WebGL2 canvas compatibility
const DynamicSculptureHero = dynamic(
  () => import("@/components/ui/liquid-sculpture-hero"),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
)

function HeroFallback() {
  return (
    <section className="relative w-full min-h-[650px] lg:h-[88svh] bg-forest-ink text-ivory flex flex-col justify-between p-8 lg:p-14 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <img
          src="/images/rematter-sculpture.webp"
          alt="Sculptural form made from reclaimed and recycled materials"
          className="max-w-[70%] max-h-[70%] object-contain"
        />
      </div>
      <div className="relative z-10 max-w-xl mt-auto pt-20">
        <p className="text-xs font-semibold tracking-widest text-lime-fresh uppercase mb-3">
          Discover a second life for waste
        </p>
        <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight mb-5">
          Your waste has another <span className="italic text-lime-fresh font-normal">purpose.</span>
        </h1>
        <p className="text-base text-ivory/80 leading-relaxed mb-8 max-w-lg">
          Turn discarded materials into practical possibilities. Discover what you can reuse, create, or recycle based on your resources, skills, and goals.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-pill bg-ivory text-forest text-sm font-semibold hover:bg-white transition-transform hover:-translate-y-0.5 shadow-md"
          >
            Start a Waste Scan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ivory border-b border-ivory/30 pb-0.5 hover:border-ivory"
          >
            Explore Possibilities
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HeroSection() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <HeroFallback />
  }

  return (
    <div className="relative w-full bg-forest-ink">
      <DynamicSculptureHero
        src="/images/rematter-sculpture.webp"
        darkSrc="/images/rematter-sculpture.webp"
        mobileSrc="/images/rematter-sculpture-mobile.webp"
        mobileDarkSrc="/images/rematter-sculpture-mobile.webp"
        imageAlt="Sculptural form made from reclaimed and recycled materials"
        imageBackground="#FFFFFF"
        showNav={false}
        eyebrow="DISCOVER A SECOND LIFE FOR WASTE"
        headline={"Your waste has another\npurpose."}
        headlineAccent="purpose."
        body="Turn discarded materials into practical possibilities. Discover what you can reuse, create, or recycle based on your resources, skills, and goals."
        primaryCta={{ label: "Start a Waste Scan", href: "/scan" }}
        secondaryCta={{ label: "Explore Possibilities", href: "/explore" }}
        background="#10251F"
        darkBackground="#10251F"
        textColor="#F7F7F0"
        accentColor="#D8F3BD"
        theme="dark"
        themeToggle={false}
        loadFonts={false}
        interactive={true}
        strength={0.8}
        radius={190}
        particleDensity={0.8}
        dotSize={0.9}
        particleSpread={0.8}
        turbulence={0.7}
        liquid={0.7}
        streaks={true}
        restStyle="image"
        returnSpeed={1.1}
        ambient={true}
        ambientIntensity={0.25}
        speed={0.7}
        intro={true}
        height="min(880px, 92svh)"
        backdropText=""
        showCredit={true}
      />
    </div>
  )
}
