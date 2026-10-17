export type MaterialCategory = 
  | "plastic" 
  | "paper_cardboard" 
  | "textile" 
  | "wood" 
  | "organic" 
  | "metal" 
  | "glass" 
  | "e_waste" 
  | "composite" 
  | "hazardous";

export type ProjectLevel = 1 | 2 | 3; // 1: DIY at Home, 2: Workshop / Community, 3: Professional Recycling

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type ToolAvailability = "household" | "basic_tools" | "workshop";
export type BudgetTier = "free" | "under_200" | "200_1000" | "flexible";
export type TimeCommitment = "15_min" | "1_hour" | "few_hours" | "multiple_days";
export type ProjectGoal = "useful" | "sellable" | "min_effort" | "recycle";

export interface MaterialAssessment {
  id: string;
  detectedMaterial: string;
  category: MaterialCategory;
  candidateMaterials: Array<{
    name: string;
    confidence: number;
    category: MaterialCategory;
    notes?: string;
  }>;
  visibleEvidence: string[];
  labelsOrCodes: string[];
  uncertainties: string[];
  missingInfo: string[];
  followUpQuestions: string[];
  condition: "clean" | "lightly_soiled" | "contaminated" | "damaged" | "unknown";
  quantity: string;
  isHazardous: boolean;
  requiresSpecialist: boolean;
  routingLevel: ProjectLevel;
  imageUrl?: string;
  userConfirmed: boolean;
}

export interface UserPreferences {
  experience: ExperienceLevel;
  tools: ToolAvailability;
  budget: BudgetTier;
  time: TimeCommitment;
  goal: ProjectGoal;
  location?: string;
  extraConstraints?: string;
  preferredCategory?: string;
}

export interface CostEstimateINR {
  min: number;
  max: number;
  isEstimate: boolean;
}

export interface FeasibilityBreakdown {
  score: number | null; // 0-100 or null if incomplete
  qualitativeLabel: "Good fit" | "Possible fit" | "Needs more info" | "Infeasible";
  breakdown?: {
    tool: number; // 0-1
    budget: number; // 0-1
    skill: number; // 0-1
    time: number; // 0-1
    material: number; // 0-1
  };
  explanation: string;
}

export interface ReuseIdea {
  id: string;
  title: string;
  category: "reuse" | "repurpose" | "recycle";
  level: ProjectLevel;
  description: string;
  difficulty: ExperienceLevel;
  estimatedMinutes: number | null;
  estimatedCostINR: CostEstimateINR | null;
  requiredTools: string[];
  requiredMaterials: string[];
  suitabilityConditions: string[];
  safetyNotes: string[];
  feasibility: FeasibilityBreakdown;
  sources: { title: string; url: string }[];
  reviewStatus: "verified" | "automated_suggestion" | "demo_fixture";
  uncertainty?: string;
  sourceFreshness?: string;
  requiresSpecialist: boolean;
  whyThisFits: string;
  lowerEffortAlternative?: string;
}

export interface PlanStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  safetyWarning?: string;
}

export interface ProjectPlan {
  id: string;
  ideaId: string;
  title: string;
  outcome: string;
  whyItFits: string;
  difficulty: ExperienceLevel;
  prepTimeMinutes: number;
  executionTimeMinutes: number;
  budgetEstimate: string;
  materialsNeeded: { name: string; alreadyHaveLikely: boolean }[];
  toolsNeeded: { name: string; alreadyHaveLikely: boolean }[];
  steps: PlanStep[];
  safetyChecklist: string[];
  commonMistakes: string[];
  completionChecklist: string[];
  alternatives: string[];
  recyclingAlternative: string;
  sources: { title: string; url: string }[];
}

export interface RecyclingFacility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  acceptedMaterials: string[];
  contact: string;
  sourceUrl: string;
  isVerified: boolean;
  verifiedAt: string | null;
  facilityType: "municipal" | "private" | "specialist_dropoff" | "ngo";
  operatingHours?: string;
  notes?: string;
  isDemo?: boolean;
}

export interface UserProjectProgress {
  ideaId: string;
  currentStep: number;
  totalSteps: number;
  completedStepIds: number[];
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  userResultPhotoUrl?: string;
}
