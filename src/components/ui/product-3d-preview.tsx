"use client"

import * as React from "react"
import * as THREE from "three"
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Layers, 
  Info,
  Compass
} from "lucide-react"

export type ProductArchetype = 
  | "planter" 
  | "organizer" 
  | "shelf" 
  | "bag" 
  | "lantern" 
  | "generic"

export interface Product3DPreviewProps {
  productTitle: string
  materialCategory?: string
  description?: string
  className?: string
  showFullscreenToggle?: boolean
}

/**
 * Determines which procedural 3D model archetype to generate based on title and category keywords.
 */
function detectArchetype(title: string, category?: string): ProductArchetype {
  const t = (title + " " + (category || "")).toLowerCase()
  if (t.includes("plant") || t.includes("pot") || t.includes("herb") || t.includes("seedling") || t.includes("vase")) {
    return "planter"
  }
  if (t.includes("organizer") || t.includes("desk") || t.includes("pencil") || t.includes("caddy") || t.includes("holder")) {
    return "organizer"
  }
  if (t.includes("shelf") || t.includes("drawer") || t.includes("rack") || t.includes("box") || t.includes("crate") || t.includes("pallet")) {
    return "shelf"
  }
  if (t.includes("bag") || t.includes("tote") || t.includes("pouch") || t.includes("textile") || t.includes("cushion") || t.includes("mat")) {
    return "bag"
  }
  if (t.includes("lamp") || t.includes("light") || t.includes("lantern") || t.includes("candle")) {
    return "lantern"
  }
  return "generic"
}

export function Product3DPreview({
  productTitle,
  materialCategory,
  description,
  className = "",
  showFullscreenToggle = true,
}: Product3DPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasWebGLError, setHasWebGLError] = React.useState(false)
  const [isInteracting, setIsInteracting] = React.useState(false)

  const archetype = React.useMemo(() => detectArchetype(productTitle, materialCategory), [productTitle, materialCategory])

  // Camera reset trigger
  const resetRef = React.useRef<() => void>(() => {})
  const zoomInRef = React.useRef<() => void>(() => {})
  const zoomOutRef = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number
    let isVisible = true

    // Check WebGL availability
    const testCanvas = document.createElement("canvas")
    const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")
    if (!gl) {
      setHasWebGLError(true)
      setIsLoading(false)
      return
    }

    // Three.js Scene Setup
    const width = container.clientWidth || 400
    const height = container.clientHeight || 320

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    const initialCamPos = new THREE.Vector3(0, 1.8, 4.5)
    camera.position.copy(initialCamPos)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)
    } catch {
      setHasWebGLError(true)
      setIsLoading(false)
      return
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x2fc48a, 1.8) // Emerald key light
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x9be7bd, 1.2)
    fillLight.position.set(-4, 2, -2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
    rimLight.position.set(0, -3, -3)
    scene.add(rimLight)

    // Root model group
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // Build procedural 3D mesh based on archetype
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x2fc48a,
      roughness: 0.35,
      metalness: 0.15,
    })
    const darkForestMat = new THREE.MeshStandardMaterial({
      color: 0x102a22,
      roughness: 0.6,
      metalness: 0.1,
    })
    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x9be7bd,
      roughness: 0.4,
    })
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.9,
    })
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.7,
    })
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
    })

    if (archetype === "planter") {
      // 1. Planter pot (repurposed bottle / jar)
      const potGeo = new THREE.CylinderGeometry(0.9, 0.75, 1.4, 24, 1, true)
      const potMesh = new THREE.Mesh(potGeo, emeraldMat)
      potMesh.position.y = 0.7
      modelGroup.add(potMesh)

      // Pot base
      const baseGeo = new THREE.CircleGeometry(0.75, 24)
      const baseMesh = new THREE.Mesh(baseGeo, darkForestMat)
      baseMesh.rotation.x = Math.PI / 2
      baseMesh.position.y = 0.01
      modelGroup.add(baseMesh)

      // Pot rim collar
      const rimGeo = new THREE.TorusGeometry(0.92, 0.06, 16, 32)
      const rimMesh = new THREE.Mesh(rimGeo, mintMat)
      rimMesh.rotation.x = Math.PI / 2
      rimMesh.position.y = 1.4
      modelGroup.add(rimMesh)

      // Soil inside
      const soilGeo = new THREE.CylinderGeometry(0.85, 0.7, 0.4, 24)
      const soilMesh = new THREE.Mesh(soilGeo, soilMat)
      soilMesh.position.y = 1.15
      modelGroup.add(soilMesh)

      // Plant stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.8, 12)
      const stemMesh = new THREE.Mesh(stemGeo, mintMat)
      stemMesh.position.y = 1.65
      modelGroup.add(stemMesh)

      // Sprout leaves
      for (let i = 0; i < 4; i++) {
        const leafGeo = new THREE.SphereGeometry(0.25, 12, 8)
        leafGeo.scale(1.8, 0.2, 0.6)
        const leafMesh = new THREE.Mesh(leafGeo, emeraldMat)
        const angle = (i * Math.PI) / 2
        leafMesh.position.set(Math.cos(angle) * 0.35, 1.85 + (i % 2) * 0.1, Math.sin(angle) * 0.35)
        leafMesh.rotation.y = angle
        leafMesh.rotation.z = 0.25
        modelGroup.add(leafMesh)
      }
    } else if (archetype === "organizer") {
      // 2. Desk Caddy / Organizer
      const baseBoxGeo = new THREE.BoxGeometry(2, 1, 1.2)
      const baseBox = new THREE.Mesh(baseBoxGeo, darkForestMat)
      baseBox.position.y = 0.5
      modelGroup.add(baseBox)

      // Front drawer / pocket
      const frontGeo = new THREE.BoxGeometry(1.8, 0.8, 0.1)
      const frontMesh = new THREE.Mesh(frontGeo, emeraldMat)
      frontMesh.position.set(0, 0.5, 0.65)
      modelGroup.add(frontMesh)

      // Partition divider
      const dividerGeo = new THREE.BoxGeometry(0.08, 1.2, 1.1)
      const divider = new THREE.Mesh(dividerGeo, mintMat)
      divider.position.set(0, 0.6, 0)
      modelGroup.add(divider)

      // Colorful pencils / stationery sticking out
      const colors = [0xef4444, 0x3b82f6, 0xf59e0b, 0x2fc48a]
      for (let i = 0; i < 4; i++) {
        const pencilGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8)
        const pMat = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.3 })
        const pMesh = new THREE.Mesh(pencilGeo, pMat)
        pMesh.position.set(-0.5 + i * 0.3, 1.1, (i % 2) * 0.15)
        pMesh.rotation.z = (i - 1.5) * 0.12
        modelGroup.add(pMesh)
      }
    } else if (archetype === "shelf") {
      // 3. Wooden / Cardboard Multi-tier Shelf
      // Shelf plates
      for (let i = 0; i < 3; i++) {
        const plateGeo = new THREE.BoxGeometry(2.4, 0.08, 1.1)
        const plate = new THREE.Mesh(plateGeo, woodMat)
        plate.position.y = 0.2 + i * 0.75
        modelGroup.add(plate)
      }

      // Vertical side supports
      for (const x of [-1.15, 1.15]) {
        const supportGeo = new THREE.BoxGeometry(0.08, 1.8, 1.1)
        const support = new THREE.Mesh(supportGeo, darkForestMat)
        support.position.set(x, 0.95, 0)
        modelGroup.add(support)
      }

      // Stored eco item on shelf
      const itemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16)
      const itemMesh = new THREE.Mesh(itemGeo, emeraldMat)
      itemMesh.position.set(-0.5, 0.45, 0)
      modelGroup.add(itemMesh)

      const bookGeo = new THREE.BoxGeometry(0.15, 0.5, 0.4)
      const bookMesh = new THREE.Mesh(bookGeo, accentMat)
      bookMesh.position.set(0.4, 1.25, 0)
      modelGroup.add(bookMesh)
    } else if (archetype === "bag") {
      // 4. Textile Tote Bag
      const bagGeo = new THREE.BoxGeometry(1.6, 1.8, 0.6)
      bagGeo.scale(1, 1, 0.8)
      const bagMesh = new THREE.Mesh(bagGeo, emeraldMat)
      bagMesh.position.y = 0.9
      modelGroup.add(bagMesh)

      // Handles
      for (const z of [-0.25, 0.25]) {
        const handleCurve = new THREE.TorusGeometry(0.35, 0.04, 12, 24, Math.PI)
        const handle = new THREE.Mesh(handleCurve, mintMat)
        handle.rotation.x = Math.PI
        handle.position.set(0, 1.8, z)
        modelGroup.add(handle)
      }

      // Stitched pocket
      const pocketGeo = new THREE.BoxGeometry(0.9, 0.8, 0.04)
      const pocket = new THREE.Mesh(pocketGeo, darkForestMat)
      pocket.position.set(0, 0.8, 0.32)
      modelGroup.add(pocket)
    } else if (archetype === "lantern") {
      // 5. Ambient Lantern / Candle Holder
      const jarGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 24, 1, true)
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x9be7bd,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.65,
      })
      const jarMesh = new THREE.Mesh(jarGeo, glassMat)
      jarMesh.position.y = 0.8
      modelGroup.add(jarMesh)

      // Base & Top metal cap
      const capGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.1, 24)
      const baseMesh = new THREE.Mesh(capGeo, darkForestMat)
      baseMesh.position.y = 0.05
      modelGroup.add(baseMesh)

      const topMesh = new THREE.Mesh(capGeo, emeraldMat)
      topMesh.position.y = 1.6
      modelGroup.add(topMesh)

      // Internal warm candle/light
      const candleGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16)
      const candle = new THREE.Mesh(candleGeo, accentMat)
      candle.position.y = 0.4
      modelGroup.add(candle)

      // Glowing flame sphere
      const flameGeo = new THREE.SphereGeometry(0.12, 12, 12)
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb })
      const flame = new THREE.Mesh(flameGeo, flameMat)
      flame.position.y = 0.78
      modelGroup.add(flame)
    } else {
      // 6. Generic Circular Possibility Sculpture
      const torusGeo = new THREE.TorusGeometry(1, 0.18, 16, 48)
      const torus1 = new THREE.Mesh(torusGeo, emeraldMat)
      torus1.rotation.x = Math.PI / 4
      torus1.position.y = 1.0
      modelGroup.add(torus1)

      const torus2 = new THREE.Mesh(torusGeo, mintMat)
      torus2.rotation.y = Math.PI / 3
      torus2.position.y = 1.0
      modelGroup.add(torus2)

      const coreSphere = new THREE.SphereGeometry(0.4, 24, 24)
      const core = new THREE.Mesh(coreSphere, darkForestMat)
      core.position.y = 1.0
      modelGroup.add(core)
    }

    // Shadow plane
    const shadowGeo = new THREE.CircleGeometry(1.6, 32)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x071410,
      transparent: true,
      opacity: 0.45,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = -0.01
    scene.add(shadowMesh)

    // Center model vertical alignment
    modelGroup.position.y = -0.5

    setIsLoading(false)

    // Interaction Controls (Drag to rotate horizontal + vertical, scroll to zoom)
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0.5
    let currentRotationX = 0
    let currentRotationY = 0.5
    let targetDistance = 4.5
    let currentDistance = 4.5

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      setIsInteracting(true)
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      targetRotationY += deltaX * 0.012
      targetRotationX += deltaY * 0.008
      // Clamp vertical tilt
      targetRotationX = Math.max(-0.6, Math.min(0.8, targetRotationX))
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseUp = () => {
      isDragging = false
      setTimeout(() => setIsInteracting(false), 1200)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetDistance += e.deltaY * 0.003
      targetDistance = Math.max(2.8, Math.min(6.5, targetDistance))
    }

    // Touch controls
    let touchStartDist = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        setIsInteracting(true)
        prevMouseX = e.touches[0].clientX
        prevMouseY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - prevMouseX
        const deltaY = e.touches[0].clientY - prevMouseY
        targetRotationY += deltaX * 0.014
        targetRotationX += deltaY * 0.009
        targetRotationX = Math.max(-0.6, Math.min(0.8, targetRotationX))
        prevMouseX = e.touches[0].clientX
        prevMouseY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const factor = (touchStartDist - dist) * 0.01
        targetDistance += factor
        targetDistance = Math.max(2.8, Math.min(6.5, targetDistance))
        touchStartDist = dist
      }
    }

    const onTouchEnd = () => {
      isDragging = false
      setTimeout(() => setIsInteracting(false), 1200)
    }

    const domEl = renderer.domElement
    domEl.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    domEl.addEventListener("wheel", onWheel, { passive: false })
    domEl.addEventListener("touchstart", onTouchStart, { passive: true })
    domEl.addEventListener("touchmove", onTouchMove, { passive: true })
    domEl.addEventListener("touchend", onTouchEnd)

    // Button controls
    resetRef.current = () => {
      targetRotationX = 0
      targetRotationY = 0.5
      targetDistance = 4.5
    }
    zoomInRef.current = () => {
      targetDistance = Math.max(2.8, targetDistance - 0.6)
    }
    zoomOutRef.current = () => {
      targetDistance = Math.min(6.5, targetDistance + 0.6)
    }

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    // Intersection observer to pause rendering when off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    intersectionObserver.observe(container)

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      // Smooth auto-spin when user is not interacting and reduced motion is off
      if (!isDragging && !prefersReducedMotion) {
        targetRotationY += 0.003
      }

      // Smooth damping / interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.1
      currentRotationY += (targetRotationY - currentRotationY) * 0.1
      currentDistance += (targetDistance - currentDistance) * 0.1

      modelGroup.rotation.x = currentRotationX
      modelGroup.rotation.y = currentRotationY

      // Position camera along orbit
      camera.position.z = currentDistance
      camera.position.y = 1.6 + currentRotationX * 0.5
      camera.lookAt(0, 0.4, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup WebGL resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()

      domEl.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      domEl.removeEventListener("wheel", onWheel)
      domEl.removeEventListener("touchstart", onTouchStart)
      domEl.removeEventListener("touchmove", onTouchMove)
      domEl.removeEventListener("touchend", onTouchEnd)

      // Dispose geometries & materials
      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else if (child.material) {
            child.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [archetype])

  return (
    <div
      className={`relative w-full rounded-2xl bg-[#081511]/90 border border-white/10 overflow-hidden select-none transition-all ${
        isFullscreen ? "fixed inset-4 z-50 rounded-3xl shadow-2xl bg-[#081511]" : ""
      } ${className}`}
    >
      {/* 3D Header overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#18352A]/90 border border-emerald-primary/30 backdrop-blur-sm text-[11px] font-semibold text-emerald-light flex items-center gap-1.5 shadow-sm">
            <Compass className="w-3 h-3 text-emerald-primary animate-spin" style={{ animationDuration: "12s" }} />
            <span>Interactive 3D Preview</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#C0CEC5] uppercase tracking-wider">
            {archetype} model
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => zoomInRef.current()}
            title="Zoom in"
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[#C0CEC5] hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomOutRef.current()}
            title="Zoom out"
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[#C0CEC5] hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => resetRef.current()}
            title="Reset view"
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[#C0CEC5] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {showFullscreenToggle && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[#C0CEC5] hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full cursor-grab active:cursor-grabbing ${
          isFullscreen ? "h-[calc(100vh-140px)]" : "h-[280px] sm:h-[320px]"
        }`}
      />

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#081511]/90 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-primary border-t-transparent animate-spin mb-3" />
          <span className="text-xs text-[#C0CEC5] font-medium">Generating 3D model...</span>
        </div>
      )}

      {/* Fallback Screen: If WebGL is not supported */}
      {hasWebGLError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#081511] p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-primary/10 border border-emerald-primary/20 flex items-center justify-center text-emerald-primary mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase mb-2">
            Illustrative Preview
          </span>
          <h4 className="text-sm font-bold text-[#F4F8F5] mb-1">{productTitle}</h4>
          <p className="text-xs text-[#C0CEC5] max-w-xs leading-relaxed">
            {description || "Interactive 3D preview requires WebGL acceleration on your device."}
          </p>
        </div>
      )}

      {/* Bottom Hint Strip */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[10px] text-[#C0CEC5]/75 pointer-events-none">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-emerald-primary shrink-0" />
          <span>Drag to rotate • Scroll to zoom</span>
        </span>
        <span className="italic hidden sm:inline">
          Illustrative preview — conceptual model
        </span>
      </div>
    </div>
  )
}
