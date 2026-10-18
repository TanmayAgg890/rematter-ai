"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Boxes,
  Layers,
  Shirt,
  Trees,
  Cpu,
  Leaf,
  Recycle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  SkipForward,
} from "lucide-react"
import { useScanStore } from "@/lib/store/use-scan-store"

// ─── Types ────────────────────────────────────────────────────────────────────

type MaterialType =
  | "plastic"
  | "paper_cardboard"
  | "textile"
  | "wood"
  | "electronic"
  | "glass"
  | "metal"
  | "organic"
  | null

interface ClassifierState {
  step: number
  materialType: MaterialType
  answers: Record<string, string>
}

// ─── Material Category Grid ────────────────────────────────────────────────────

const MATERIAL_CATEGORIES: {
  id: Exclude<MaterialType, null>
  label: string
  icon: React.ReactNode
  description: string
}[] = [
  {
    id: "plastic",
    label: "Plastic & Packaging",
    icon: <Boxes className="w-5 h-5" />,
    description: "Bottles, containers, packaging foam",
  },
  {
    id: "paper_cardboard",
    label: "Paper & Cardboard",
    icon: <Layers className="w-5 h-5" />,
    description: "Boxes, kraft paper, pulp trays",
  },
  {
    id: "textile",
    label: "Textile & Apparel",
    icon: <Shirt className="w-5 h-5" />,
    description: "Cotton, denim, linen, synthetic fabric",
  },
  {
    id: "wood",
    label: "Wood & Pallets",
    icon: <Trees className="w-5 h-5" />,
    description: "Timber offcuts, pallets, wooden crates",
  },
  {
    id: "electronic",
    label: "Electronics & E-waste",
    icon: <Cpu className="w-5 h-5" />,
    description: "Peripherals, cables, small devices",
  },
  {
    id: "glass",
    label: "Glass",
    icon: <Recycle className="w-5 h-5" />,
    description: "Bottles, jars, window glass",
  },
  {
    id: "metal",
    label: "Metal & Alloys",
    icon: <Layers className="w-5 h-5" />,
    description: "Cans, steel parts, copper wire",
  },
  {
    id: "organic",
    label: "Organic & Biomass",
    icon: <Leaf className="w-5 h-5" />,
    description: "Food scraps, garden clippings, coffee grounds",
  },
]

// ─── Per-material Questions ────────────────────────────────────────────────────

interface Question {
  key: string
  question: string
  options: string[]
  optional?: boolean
  safetyGate?: string  // If this answer triggers a safety gate
  safetyGateAnswer?: string
}

const MATERIAL_QUESTIONS: Record<Exclude<MaterialType, null>, Question[]> = {
  plastic: [
    {
      key: "type",
      question: "What type of plastic do you have?",
      options: ["Beverage bottles (PET)", "Milk jugs / HDPE containers", "Flexible packaging / bags", "Foam / polystyrene", "Mixed / unknown"],
    },
    {
      key: "condition",
      question: "What is the condition?",
      options: ["Clean and dry", "Slightly soiled — can be washed", "Contaminated / food waste", "Broken / cracked"],
    },
    {
      key: "goal",
      question: "What is your primary goal?",
      options: ["Make a functional object (planter, organizer)", "Decorative upcycle", "Find a recycling route", "Sell or donate"],
    },
  ],
  paper_cardboard: [
    {
      key: "condition",
      question: "What is the condition of your paper / cardboard?",
      options: ["Dry and clean", "Slightly damp but salvageable", "Wet or moldy", "Mixed with plastic tape or labels"],
    },
    {
      key: "type",
      question: "What type of paper material do you have?",
      options: ["Corrugated cardboard boxes", "Kraft paper / brown paper", "Newspaper or magazine", "Pulp egg / fruit trays", "Mixed or printed paper"],
    },
    {
      key: "goal",
      question: "What would you like to make or do?",
      options: ["Storage organizer or dividers", "Garden mulch or composting", "Art or craft project", "Find recycling route"],
    },
  ],
  textile: [
    {
      key: "fabric",
      question: "What type of fabric or textile do you have?",
      options: ["Cotton t-shirts or shirts", "Denim jeans or jackets", "Linen or natural fiber", "Synthetic (polyester, nylon)", "Wool or blended fabric"],
    },
    {
      key: "condition",
      question: "What is the condition of the textile?",
      options: ["Clean and wearable condition", "Stained but structurally intact", "Torn or worn through", "Mixed / multiple items"],
    },
    {
      key: "tools",
      question: "Do you have a sewing machine?",
      options: ["Yes — I have a sewing machine", "No — hand sewing only", "No tools at all (no-sew preferred)"],
      optional: true,
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Functional bag or tote", "Home textile (rug, cushion, cloth)", "Donate or resell", "Shred for stuffing or cleaning"],
    },
  ],
  wood: [
    {
      key: "treatment",
      question: "Is the wood treated or stamped?",
      options: ["HT (Heat Treated) — safe for DIY", "MB (Methyl Bromide) — do not use", "No stamps — untreated timber", "Not sure / no markings visible"],
    },
    {
      key: "condition",
      question: "What is the condition of the wood?",
      options: ["Clean and structurally sound", "Minor splitting or warping", "Nails or screws still attached", "Rotting or water damaged"],
    },
    {
      key: "goal",
      question: "What would you like to build?",
      options: ["Planter or garden bed", "Furniture (shelf, bench, table)", "Small organizer or storage", "Art or decorative piece"],
    },
  ],
  electronic: [
    {
      key: "device",
      question: "What type of electronics do you have?",
      options: ["Laptop or desktop PC", "Mobile phone or tablet", "Cables, chargers, peripherals", "Small appliance (fan, radio, lamp)", "Batteries or power banks"],
      safetyGate: "⚠️ Batteries and swollen lithium cells must go to certified e-waste collection only. Do not attempt to open or repurpose them.",
      safetyGateAnswer: "Batteries or power banks",
    },
    {
      key: "battery_status",
      question: "Does the device have a lithium battery?",
      options: ["Yes — and it appears swollen or damaged", "Yes — but it appears normal", "No battery", "Not sure"],
      safetyGate: "⚠️ Swollen or damaged lithium batteries are a fire hazard. This item must go to a certified e-waste recycler. No DIY options available.",
      safetyGateAnswer: "Yes — and it appears swollen or damaged",
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Harvest components (for makers)", "Donate or resell the device", "Find a certified recycling route", "Repurpose the enclosure / casing"],
    },
  ],
  glass: [
    {
      key: "type",
      question: "What type of glass do you have?",
      options: ["Food jars (jam, pickle, sauce)", "Beverage bottles", "Vases or decorative glass", "Window or flat glass (avoid cutting)"],
    },
    {
      key: "condition",
      question: "What is the condition?",
      options: ["Intact and clean", "Chipped but usable", "Cracked or broken shards"],
    },
    {
      key: "goal",
      question: "What would you like to make?",
      options: ["Planter, vase, or vessel", "Storage or organizer", "Decorative (candle holder, light)", "Find recycling route"],
    },
  ],
  metal: [
    {
      key: "type",
      question: "What type of metal do you have?",
      options: ["Aluminium cans", "Steel or tin cans", "Copper wire or pipes", "Scrap iron or steel sheet", "Mixed metal scraps"],
    },
    {
      key: "condition",
      question: "What is the condition?",
      options: ["Clean and rust-free", "Slightly rusted but salvageable", "Heavily corroded", "Sharp edges present"],
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["DIY functional item (organizer, planter)", "Artistic / sculptural project", "Sell as scrap metal", "Find a recycling facility"],
    },
  ],
  organic: [
    {
      key: "type",
      question: "What type of organic waste do you have?",
      options: ["Kitchen scraps (vegetable/fruit peels)", "Coffee grounds or tea leaves", "Eggshells", "Garden clippings or leaves", "Mixed compostable waste"],
    },
    {
      key: "quantity",
      question: "How much do you have approximately?",
      options: ["A handful (< 1 kg)", "A bucket full (1–5 kg)", "Large amounts (> 5 kg / ongoing)"],
      optional: true,
    },
    {
      key: "goal",
      question: "What is your goal?",
      options: ["Compost for garden soil", "Natural fertilizer or plant feed", "Pest deterrent (eggshell, coffee)", "Find organic waste collection point"],
    },
  ],
}

// ─── Result Suggestions ────────────────────────────────────────────────────────

function buildPrefilledScan(materialType: Exclude<MaterialType, null>, answers: Record<string, string>): string {
  const parts: string[] = []
  const matLabel = MATERIAL_CATEGORIES.find(m => m.id === materialType)?.label || materialType

  parts.push(`Material: ${matLabel}.`)

  if (answers.type) parts.push(`Type: ${answers.type}.`)
  if (answers.fabric) parts.push(`Fabric: ${answers.fabric}.`)
  if (answers.device) parts.push(`Device: ${answers.device}.`)
  if (answers.condition) parts.push(`Condition: ${answers.condition}.`)
  if (answers.treatment) parts.push(`Wood treatment: ${answers.treatment}.`)
  if (answers.tools) parts.push(`Sewing capability: ${answers.tools}.`)
  if (answers.quantity) parts.push(`Quantity: ${answers.quantity}.`)
  if (answers.goal) parts.push(`Goal: ${answers.goal}.`)

  return parts.join(" ")
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MaterialClassifier() {
  const router = useRouter()
  const { setScanInput } = useScanStore()

  const [state, setState] = React.useState<ClassifierState>({
    step: 0,
    materialType: null,
    answers: {},
  })

  const [safetyGateMessage, setSafetyGateMessage] = React.useState<string | null>(null)

  const questions =
    state.materialType ? MATERIAL_QUESTIONS[state.materialType] : []
  const currentQuestion = questions[state.step - 1] ?? null
  const totalSteps = questions.length

  const handleSelectMaterial = (id: Exclude<MaterialType, null>) => {
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
      // Complete
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

  // ── Step 0: Category Selection ──
  if (state.step === 0) {
    return (
      <div className="py-6">
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-emerald-primary/10 text-emerald-primary text-xs font-bold uppercase tracking-wider inline-block mb-3">
            Material Classification
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-3">
            What material do you have?
          </h2>
          <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary max-w-lg mx-auto">
            Select the material type to get a guided assessment and find the best reuse, repurpose, or recycle pathway.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectMaterial(cat.id)}
              className="group p-4 rounded-2xl bg-white/80 dark:bg-forest-surface/75 backdrop-blur-md border border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary/60 hover:shadow-md transition-all text-left focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-primary/10 flex items-center justify-center text-emerald-primary mb-3 group-hover:bg-emerald-primary/20 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-textLightPrimary dark:text-textDarkPrimary mb-1 leading-tight">
                {cat.label}
              </h3>
              <p className="text-[11px] text-textLightSecondary dark:text-textDarkSecondary leading-tight">
                {cat.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Complete State ──
  if (isComplete) {
    const prefilledText = buildPrefilledScan(state.materialType!, state.answers)

    return (
      <div className="py-8 max-w-xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-primary/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-primary" />
        </div>
        <h2 className="text-xl font-display font-bold text-textLightPrimary dark:text-textDarkPrimary mb-2">
          Classification Complete
        </h2>
        <p className="text-sm text-textLightSecondary dark:text-textDarkSecondary mb-6 leading-relaxed">
          Based on your answers, we&apos;ve built a pre-filled description for your waste scan. You can refine it on the next screen.
        </p>

        <div className="bg-white/80 dark:bg-forest-surface/75 backdrop-blur-md border border-borderLightSubtle dark:border-white/10 rounded-xl p-4 text-left text-xs text-textLightSecondary dark:text-textDarkSecondary font-mono mb-6 leading-relaxed">
          {prefilledText}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-forest-elevated/80 backdrop-blur-md border border-borderLightSubtle dark:border-white/10 text-sm font-semibold text-textLightPrimary dark:text-textDarkPrimary hover:border-emerald-primary transition-colors focus-ring"
          >
            <ChevronLeft className="w-4 h-4" />
            Adjust Answers
          </button>
          <button
            type="button"
            onClick={handleStartScan}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-primary text-forest-950 text-sm font-bold hover:bg-emerald-400 transition-all shadow-sm focus-ring"
          >
            <Sparkles className="w-4 h-4 text-forest-950" />
            Start AI Scan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setState({ step: 0, materialType: null, answers: {} })}
          className="mt-4 text-xs text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
        >
          ← Start over with a different material
        </button>
      </div>
    )
  }

  // ── Question Steps ──
  if (!currentQuestion) return null

  return (
    <div className="py-8 max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-primary rounded-full transition-all"
            style={{ width: `${(state.step / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-textLightSecondary dark:text-textDarkSecondary font-mono shrink-0">
          {state.step}/{totalSteps}
        </span>
      </div>

      {/* Material Badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-primary/10 text-emerald-primary text-xs font-bold uppercase tracking-wider">
          {MATERIAL_CATEGORIES.find(m => m.id === state.materialType)?.label}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-textLightSecondary dark:text-textDarkSecondary" />
        <span className="text-xs text-textLightSecondary dark:text-textDarkSecondary">
          Question {state.step}
        </span>
      </div>

      {/* Safety Gate Alert */}
      {safetyGateMessage && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-1">Safety Notice</strong>
            <span className="text-xs leading-relaxed">{safetyGateMessage}</span>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => router.push("/recycling")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors focus-ring"
              >
                <Recycle className="w-3.5 h-3.5" />
                Find Certified Recycling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <h2 className="text-xl font-display font-semibold text-textLightPrimary dark:text-textDarkPrimary mb-5">
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(currentQuestion.key, option)}
            className="w-full text-left p-4 rounded-xl bg-white/80 dark:bg-forest-surface/75 backdrop-blur-md border border-borderLightSubtle dark:border-white/10 hover:border-emerald-primary/60 hover:bg-emerald-primary/5 dark:hover:bg-emerald-primary/10 transition-all text-sm text-textLightPrimary dark:text-textDarkPrimary font-medium flex items-center justify-between group focus-ring"
          >
            <span>{option}</span>
            <ChevronRight className="w-4 h-4 text-textLightSecondary dark:text-textDarkSecondary group-hover:text-emerald-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* Skip (optional questions only) */}
      {currentQuestion.optional && (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-textLightSecondary dark:text-textDarkSecondary hover:text-textLightPrimary dark:hover:text-textDarkPrimary focus-ring"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Skip this question
        </button>
      )}
    </div>
  )
}
