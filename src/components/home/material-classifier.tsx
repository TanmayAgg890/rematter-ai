"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useScanStore } from "@/lib/store/use-scan-store"
import { MaterialCategory } from "@/types"
import { 
  Boxes, 
  Layers, 
  Shirt, 
  Trees, 
  Cpu, 
  Leaf, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Recycle,
  SkipForward,
  Wine,
  Hammer,
  ArrowRight
} from "lucide-react"

// ─── Material Categories with icons and contextual questions ────────────────
interface MaterialCategoryDef {
  id: MaterialCategory
  label: string
  icon: React.ReactNode
  description: string
}

export const MATERIAL_CATEGORIES: MaterialCategoryDef[] = [
  {
    id: "plastic",
    label: "Plastic",
    icon: <Boxes className="w-5 h-5" />,
    description: "PET bottles, HDPE jugs, containers, flexible wrap",
  },
  {
    id: "paper_cardboard",
    label: "Paper & Cardboard",
    icon: <Layers className="w-5 h-5" />,
    description: "Shipping cartons, pulp trays, kraft paper",
  },
  {
    id: "textile",
    label: "Clothing & Textiles",
    icon: <Shirt className="w-5 h-5" />,
    description: "Denim jeans, cotton t-shirts, linens, fabric scraps",
  },
  {
    id: "glass",
    label: "Glass",
    icon: <Wine className="w-5 h-5" />,
    description: "Jars, drink bottles, culinary containers",
  },
  {
    id: "wood",
    label: "Wood & Pallets",
    icon: <Trees className="w-5 h-5" />,
    description: "Clean pallets, timber offcuts, wooden crates",
  },
  {
    id: "metal",
    label: "Metal",
    icon: <Hammer className="w-5 h-5" />,
    description: "Aluminum cans, tin containers, copper scrap",
  },
  {
    id: "e_waste",
    label: "Electronic Waste",
    icon: <Cpu className="w-5 h-5" />,
    description: "Old peripherals, cables, small electronics",
  },
  {
    id: "organic",
    label: "Organic & Biomass",
    icon: <Leaf className="w-5 h-5" />,
    description: "Coffee grounds, fruit peels, yard clippings",
  },
]

// ─── Per-material Contextual Questions ─────────────────────────────────────────

interface Question {
  key: string
  question: string
  options: string[]
  optional?: boolean
  safetyGate?: string
  safetyGateAnswer?: string
}

const MATERIAL_QUESTIONS: Record<MaterialCategory, Question[]> = {
  plastic: [
    {
      key: "type",
      question: "What type of plastic bottle or container do you have?",
      options: [
        "Transparent beverage bottle (PET #1)", 
        "Opaque milk / detergent jug (HDPE #2)", 
        "Food takeout tub / container (PP #5)", 
        "Flexible packaging or bag", 
        "Other / not sure"
      ],
    },
    {
      key: "condition",
      question: "What is its observed condition?",
      options: [
        "Clean and intact", 
        "Slightly soiled — easily rinsed with mild soap", 
        "Contaminated with oil or chemical residue", 
        "Crushed or heavily damaged", 
        "Not sure"
      ],
      safetyGate: "⚠️ Chemical- or oil-contaminated plastic cannot be safely reused for household DIY. Route to an authorized hazardous/industrial recycling center.",
      safetyGateAnswer: "Contaminated with oil or chemical residue",
    },
    {
      key: "quantity",
      question: "How many units do you have?",
      options: ["Single unit (1 bottle)", "A few bottles (2–5 units)", "Large batch (6+ units)"],
    },
    {
      key: "goal",
      question: "What is your primary goal?",
      options: [
        "Make a functional DIY product (herb planter, funnel, storage)", 
        "Create a decorative craft item", 
        "Find a simple direct reuse", 
        "Find an authorized recycling drop-off"
      ],
    },
  ],
  textile: [
    {
      key: "type",
      question: "What clothing or textile item do you have?",
      options: [
        "Denim jeans / jacket", 
        "Cotton t-shirt / jersey knit", 
        "Linen or woven shirt", 
        "Wool / synthetic blend sweater", 
        "Fabric scraps / offcuts"
      ],
    },
    {
      key: "condition",
      question: "Is the garment wearable or damaged?",
      options: [
        "Wearable and clean — great for donation or gentle reuse", 
        "Slightly torn or missing buttons — easy to repair", 
        "Heavily worn or frayed — best for upcycled organizers or rag strips", 
        "Mildewed or stained beyond washing"
      ],
    },
    {
      key: "hardware",
      question: "Are zippers, buttons, or metal rivets attached?",
      options: ["Yes, metal hardware present", "Elastic or plastic buttons only", "Plain fabric only", "Not sure"],
    },
    {
      key: "goal",
      question: "What would you like to achieve?",
      options: [
        "Repurpose into a useful organizer or shopping bag", 
        "Simple no-sew cleaning cloths or mats", 
        "Repair or refashion", 
        "Find a local clothing donation or textile recycler"
      ],
    },
  ],
  paper_cardboard: [
    {
      key: "type",
      question: "What type of paper / cardboard do you have?",
      options: [
        "Corrugated delivery boxes (Amazon/shipping)", 
        "Kraft brown wrapping paper", 
        "Pulp egg / fruit trays", 
        "Printed carton packaging / cereal boxes", 
        "Mixed paper scraps"
      ],
    },
    {
      key: "condition",
      question: "Is the cardboard completely dry and grease-free?",
      options: [
        "Clean, dry, and rigid", 
        "Slightly damp or bent but salvageable", 
        "Greasy / soiled with food oil (e.g. pizza residue)", 
        "Not sure"
      ],
      safetyGate: "⚠️ Greasy cardboard cannot be repurposed for dry storage or processed in standard paper recycling mills. Best routed to organic compost or garden mulch.",
      safetyGateAnswer: "Greasy / soiled with food oil (e.g. pizza residue)",
    },
    {
      key: "quantity",
      question: "How many boxes do you have?",
      options: ["A single box", "2–4 boxes", "A large stack (5+ boxes)"],
    },
    {
      key: "goal",
      question: "What is your primary goal?",
      options: [
        "Desk organization or drawer dividers", 
        "Sturdy household storage caddy", 
        "Seedling starter pots or garden mulch", 
        "Cardboard bundle recycling"
      ],
    },
  ],
  glass: [
    {
      key: "type",
      question: "What type of glass container do you have?",
      options: [
        "Food jar with metal screw lid (jam, pickle, sauce)", 
        "Clear beverage bottle", 
        "Decorative bottle / vase", 
        "Broken glass shards or window pane"
      ],
      safetyGate: "⚠️ Broken window pane or cracked glass cannot be cut safely at home without professional lapidary equipment. Route to certified cullet recycling.",
      safetyGateAnswer: "Broken glass shards or window pane",
    },
    {
      key: "condition",
      question: "Is the glass fully intact?",
      options: ["Intact and clean", "Intact but needs label removal", "Slightly chipped around lip", "Cracked"],
    },
    {
      key: "goal",
      question: "What would you like to make?",
      options: [
        "Pantry storage or airtight organizer", 
        "Planter or self-watering vase", 
        "Candle holder / desk organizer", 
        "Find a glass bottle recycling point"
      ],
    },
  ],
  wood: [
    {
      key: "type",
      question: "What type of wood do you have?",
      options: [
        "Heat-treated wooden pallet (stamped HT)", 
        "Untreated pine / timber offcuts", 
        "Engineered plywood / MDF scraps", 
        "Chemically treated pallet (stamped MB)"
      ],
      safetyGate: "⚠️ Pallets stamped 'MB' were treated with methyl bromide and are unsafe for indoor crafts, furniture, or vegetable planters. Dispose through commercial timber waste.",
      safetyGateAnswer: "Chemically treated pallet (stamped MB)",
    },
    {
      key: "condition",
      question: "What is the wood's condition?",
      options: ["Clean and dry", "Splintered but solid", "Nails/screws still embedded", "Rotten or weathered"],
    },
    {
      key: "goal",
      question: "What would you like to build?",
      options: ["Outdoor herb planter", "Simple wall shelf", "Small storage crate", "Drop off at wood recovery hub"],
    },
  ],
  metal: [
    {
      key: "type",
      question: "What metal item do you have?",
      options: ["Aluminum soda cans", "Steel soup / food cans", "Copper wire or piping", "Mixed metal hardware scraps"],
    },
    {
      key: "condition",
      question: "What is the condition?",
      options: ["Clean and rust-free", "Slightly rusted or sharp edges", "Greasy / contaminated", "Crushed"],
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Desk pen holder or utensil organizer", "Seedling pots", "Scrap metal recovery", "Authorized drop-off"],
    },
  ],
  e_waste: [
    {
      key: "battery_status",
      question: "Does the device have a battery?",
      options: [
        "Yes — and it appears swollen or cracked", 
        "Yes — but battery looks normal", 
        "No battery / external power only", 
        "Not sure"
      ],
      safetyGate: "⚠️ Swollen lithium batteries are a severe fire and toxic fume hazard. Never attempt DIY dismantling. Take immediately to an authorized e-waste recycler.",
      safetyGateAnswer: "Yes — and it appears swollen or cracked",
    },
    {
      key: "goal",
      question: "What would you like to do?",
      options: [
        "Harvest harmless cables/housing", 
        "Donate or refurbish device", 
        "Find an authorized electronic recycler", 
        "Not sure"
      ],
    },
  ],
  organic: [
    {
      key: "type",
      question: "What type of organic material do you have?",
      options: ["Coffee grounds", "Citrus / vegetable peels", "Eggshells", "Dry garden clippings / leaves"],
    },
    {
      key: "quantity",
      question: "How much material do you have?",
      options: ["Small handful", "1–2 kg bucket", "Ongoing bulk supply"],
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Natural garden fertilizer / compost", "Odor neutralizer", "Plant pest repellant", "Community composting"],
    },
  ],
  composite: [
    {
      key: "type",
      question: "What composite item do you have?",
      options: ["Tetra Pak / beverage carton", "Multi-layer bubble mailer", "Laminated packaging", "Unknown blend"],
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Direct storage organizer", "Seed starter pots", "Specialist composite recycling", "Not sure"],
    },
  ],
  hazardous: [
    {
      key: "type",
      question: "What material is present?",
      options: ["Lithium battery", "Aerosol / chemical canister", "Paints / solvents", "Biohazard / sharps"],
      safetyGate: "⚠️ Hazardous items require specialized municipal recovery. DIY repurposing is locked out for personal safety.",
      safetyGateAnswer: "Lithium battery",
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Find authorized hazardous drop-off location"],
    },
  ],
}

function buildPrefilledScan(material: MaterialCategory, answers: Record<string, string>): string {
  const parts: string[] = []
  const cat = MATERIAL_CATEGORIES.find(m => m.id === material)
  if (cat) parts.push(`Material: ${cat.label}`)
  for (const [key, value] of Object.entries(answers)) {
    parts.push(`${key}: ${value}`)
  }
  return parts.join(" | ")
}

export function MaterialClassifier() {
  const router = useRouter()
  const setScanInput = useScanStore((state) => state.setScanInput)

  const [state, setState] = React.useState<{
    step: number // 0 = category select, 1..N = question, N+1 = complete
    materialType: MaterialCategory | null
    answers: Record<string, string>
  }>({
    step: 0,
    materialType: null,
    answers: {},
  })

  const [safetyGateMessage, setSafetyGateMessage] = React.useState<string | null>(null)

  const questions: Question[] = state.materialType ? MATERIAL_QUESTIONS[state.materialType] || [] : []
  const totalSteps = questions.length
  const currentQuestion = state.step >= 1 && state.step <= totalSteps ? questions[state.step - 1] : null

  const handleSelectMaterial = (id: MaterialCategory) => {
    setState({ step: 1, materialType: id, answers: {} })
    setSafetyGateMessage(null)
  }

  const handleAnswer = (questionKey: string, answer: string) => {
    const newAnswers = { ...state.answers, [questionKey]: answer }

    // Check safety gate
    if (currentQuestion?.safetyGate && currentQuestion.safetyGateAnswer === answer) {
      setSafetyGateMessage(currentQuestion.safetyGate)
      setState(s => ({ ...s, answers: newAnswers }))
      return
    }

    setSafetyGateMessage(null)
    const nextStep = state.step + 1

    if (nextStep > totalSteps) {
      setState(s => ({ ...s, answers: newAnswers, step: totalSteps + 1 }))
    } else {
      setState(s => ({ ...s, answers: newAnswers, step: nextStep }))
    }
  }

  const handleSkip = () => {
    const nextStep = state.step + 1
    setSafetyGateMessage(null)
    if (nextStep > totalSteps) {
      setState(s => ({ ...s, step: totalSteps + 1 }))
    } else {
      setState(s => ({ ...s, step: nextStep }))
    }
  }

  const handleBack = () => {
    setSafetyGateMessage(null)
    if (state.step <= 1) {
      setState({ step: 0, materialType: null, answers: {} })
    } else {
      setState(s => ({ ...s, step: s.step - 1 }))
    }
  }

  const handleStartScan = () => {
    if (!state.materialType) return
    const prefilledText = buildPrefilledScan(state.materialType, state.answers)
    setScanInput({ itemDescription: prefilledText })
    router.push("/scan")
  }

  const isComplete = state.materialType && state.step > totalSteps

  // Step 0: Category Selection
  if (state.step === 0) {
    return (
      <div className="py-6">
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider inline-block mb-3 border border-lavender-accent/30">
            Material Classification
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F3F3] mb-3">
            What material do you have?
          </h2>
          <p className="text-sm text-platinum max-w-lg mx-auto">
            Select a material category to start a guided contextual assessment and find the best reuse, repurpose, or recycle pathway.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectMaterial(cat.id)}
              className="group p-4 rounded-2xl bg-[#211D1C]/80 backdrop-blur-md border border-white/10 hover:border-lavender-accent/60 hover:shadow-lg transition-all text-left focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-mocha-deep/80 border border-lavender-accent/30 flex items-center justify-center text-lavender-accent mb-3 group-hover:bg-mocha transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1 leading-tight">
                {cat.label}
              </h3>
              <p className="text-[11px] text-platinum leading-tight">
                {cat.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Complete State
  if (isComplete) {
    const prefilledText = buildPrefilledScan(state.materialType!, state.answers)

    return (
      <div className="py-8 max-w-xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-mocha-deep text-lavender flex items-center justify-center mx-auto mb-4 border border-lavender-accent/40 shadow-sm">
          <CheckCircle2 className="w-7 h-7 text-lavender-accent" />
        </div>
        <h2 className="text-xl font-display font-bold text-[#F5F3F3] mb-2">
          Contextual Classification Complete
        </h2>
        <p className="text-sm text-platinum mb-6 leading-relaxed">
          Based on your answers, we have structured a tailored profile for your waste scan. You can refine or scan now.
        </p>

        <div className="bg-[#211D1C]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 text-left text-xs text-platinum font-mono mb-6 leading-relaxed">
          {prefilledText}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-sm font-semibold text-white border border-white/10 focus-ring"
          >
            <ChevronLeft className="w-4 h-4" />
            Adjust Answers
          </button>
          <button
            type="button"
            onClick={handleStartScan}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-mocha hover:bg-mocha-hover text-white text-sm font-bold shadow-md focus-ring border border-mocha-light/20"
          >
            <Sparkles className="w-4 h-4 text-lavender" />
            Start AI Scan
            <ArrowRight className="w-4 h-4 text-platinum-light" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setState({ step: 0, materialType: null, answers: {} })}
          className="mt-4 text-xs text-platinum hover:text-white focus-ring"
        >
          ← Choose a different material
        </button>
      </div>
    )
  }

  // Question Steps
  if (!currentQuestion) return null

  return (
    <div className="py-8 max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-platinum hover:text-white focus-ring"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-mocha rounded-full transition-all"
            style={{ width: `${(state.step / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-platinum font-mono shrink-0">
          {state.step}/{totalSteps}
        </span>
      </div>

      {/* Material Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-0.5 rounded-full bg-mocha-deep text-lavender text-xs font-bold uppercase tracking-wider border border-lavender-accent/30">
          {MATERIAL_CATEGORIES.find(m => m.id === state.materialType)?.label}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-platinum/60" />
        <span className="text-xs text-platinum">
          Question {state.step}
        </span>
      </div>

      {/* Safety Gate Alert */}
      {safetyGateMessage && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-amber-950/40 backdrop-blur-md border border-amber-600/40 text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-1">Safety Notice</strong>
            <span className="text-xs leading-relaxed">{safetyGateMessage}</span>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => router.push("/recycling")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors focus-ring"
              >
                <Recycle className="w-3.5 h-3.5" />
                Find Certified Recycling Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <h2 className="text-xl font-display font-semibold text-[#F5F3F3] mb-5">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(currentQuestion.key, option)}
            className="w-full text-left p-4 rounded-xl bg-[#211D1C]/80 backdrop-blur-md border border-white/10 hover:border-lavender-accent/60 hover:bg-white/10 transition-all text-sm text-white font-medium flex items-center justify-between group focus-ring"
          >
            <span>{option}</span>
            <ChevronRight className="w-4 h-4 text-platinum/60 group-hover:text-lavender transition-colors" />
          </button>
        ))}
      </div>

      {/* Skip (optional questions only) */}
      {currentQuestion.optional && (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-platinum hover:text-white focus-ring"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Skip this question
        </button>
      )}
    </div>
  )
}
