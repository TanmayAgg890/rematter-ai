"use client"

import * as React from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  originX: number
  originY: number
  color: string
  size: number
  alpha: number
  angle: number
  speed: number
  life: number
  maxLife: number
}

interface FluidParticlesBackgroundProps {
  className?: string
  particleCount?: number
  mobileParticleCount?: number
  interactive?: boolean
  backgroundColor?: string
  particleColors?: string[]
}

/**
 * Fluid Particles Background component
 * High-performance canvas-based particle flow field with subtle cursor interactivity,
 * ResizeObserver containment, proper rAF cleanup, and prefers-reduced-motion support.
 * Themed to Mocha Brown, Platinum Silver, and Pale Lavender.
 */
export function FluidParticlesBackground({
  className = "",
  particleCount = 720,
  mobileParticleCount = 300,
  interactive = true,
  backgroundColor = "#171515",
  particleColors = ["#DCD6F7", "#B9A9EE", "#D5D6D8", "#ECEBED", "#6F5148", "#A0847B", "#F5F3F3"],
}: FluidParticlesBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let particles: Particle[] = []

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Mouse coordinates relative to canvas
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 140,
      isHovered: false,
    }

    // Determine target count based on container width
    const getTargetCount = (w: number) => {
      if (prefersReducedMotion) return 100
      return w < 768 ? mobileParticleCount : particleCount
    }

    const initParticle = (w: number, h: number, randomLife = false): Particle => {
      const x = Math.random() * w
      const y = Math.random() * h
      const maxLife = 200 + Math.random() * 260
      const color = particleColors[Math.floor(Math.random() * particleColors.length)]
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        originX: x,
        originY: y,
        color,
        size: Math.random() < 0.25 ? 2.4 : 1.2 + Math.random() * 0.9,
        alpha: 0.18 + Math.random() * 0.58,
        angle: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.65,
        life: randomLife ? Math.random() * maxLife : 0,
        maxLife,
      }
    }

    const resetParticles = (w: number, h: number) => {
      const count = getTargetCount(w)
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push(initParticle(w, h, true))
      }
    }

    const handleResize = () => {
      if (!container || !canvas) return
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)
      resetParticles(width, height)
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(container)

    // Flow field angle generator based on coordinates & time
    let time = 0
    const getFlowAngle = (x: number, y: number, t: number) => {
      const scale = 0.003
      // Coherent smooth multi-frequency harmonic flow field
      const n1 = Math.sin(x * scale + t * 0.25)
      const n2 = Math.cos(y * scale * 1.2 - t * 0.2)
      const n3 = Math.sin((x + y) * scale * 0.7 + t * 0.15)
      return (n1 + n2 + n3) * Math.PI
    }

    // Interactive mouse listeners — attach to window so pointer is tracked across all page content
    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isHovered = true
    }

    const onPointerLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.isHovered = false
    }

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      document.addEventListener("pointerleave", onPointerLeave, { passive: true })
    }

    // Animation Loop
    const render = () => {
      time += 0.005

      // Smooth trail persistence matching dark mocha theme background #171515
      ctx.fillStyle = "rgba(23, 21, 21, 0.22)"
      ctx.fillRect(0, 0, width, height)

      const pLength = particles.length
      for (let i = 0; i < pLength; i++) {
        const p = particles[i]

        // Flow field vector
        const angle = getFlowAngle(p.x, p.y, time)
        const targetVx = Math.cos(angle) * p.speed
        const targetVy = Math.sin(angle) * p.speed

        // Smooth steering
        p.vx += (targetVx - p.vx) * 0.05
        p.vy += (targetVy - p.vy) * 0.05

        // Interactive mouse gentle push
        if (mouse.isHovered) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distSq = dx * dx + dy * dy
          const rSq = mouse.radius * mouse.radius
          if (distSq < rSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            const force = (1 - dist / mouse.radius) * 1.8
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.x += p.vx
        p.y += p.vy
        p.life++

        // Edge wrapping & respawning
        if (p.x < -10) p.x = width + 10
        else if (p.x > width + 10) p.x = -10

        if (p.y < -10) p.y = height + 10
        else if (p.y > height + 10) p.y = -10

        if (p.life >= p.maxLife) {
          particles[i] = initParticle(width, height, false)
          continue
        }

        // Fade in and out life curve
        const halfLife = p.maxLife / 2
        const lifeAlpha =
          p.life < halfLife
            ? p.life / halfLife
            : (p.maxLife - p.life) / halfLife
        const currentAlpha = p.alpha * lifeAlpha

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha))
        ctx.fill()
      }

      ctx.globalAlpha = 1.0

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    handleResize()
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove)
        document.removeEventListener("pointerleave", onPointerLeave)
      }
    }
  }, [particleCount, mobileParticleCount, interactive, particleColors, backgroundColor])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ backgroundColor }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
      {/* Subtle radial vignette that keeps particles brilliant and clear while maintaining text readability */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(23, 21, 21, 0) 0%, rgba(23, 21, 21, 0.50) 100%)"
        }}
      />
    </div>
  )
}
