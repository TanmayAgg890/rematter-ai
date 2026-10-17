"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { 
  MaterialAssessment, 
  UserPreferences, 
  ReuseIdea, 
  UserProjectProgress 
} from "@/types"

export interface ScanStoreState {
  // Input stage
  itemDescription: string
  imagePreviewUrl: string | null
  imageFile: File | null
  quantity: string
  itemCondition: "clean" | "lightly_soiled" | "contaminated" | "damaged" | "unknown"
  consentGiven: boolean

  // Assessment stage
  assessment: MaterialAssessment | null
  isAssessing: boolean
  assessmentError: string | null

  // Preferences stage
  preferences: UserPreferences

  // Results stage
  ideas: ReuseIdea[]
  isGeneratingIdeas: boolean
  ideasError: string | null
  fallbackReason: string | null

  // Saved / Progress
  savedIdeaIds: string[]
  projectProgress: Record<string, UserProjectProgress> // ideaId -> progress

  // Actions
  setScanInput: (data: Partial<{
    itemDescription: string
    imagePreviewUrl: string | null
    quantity: string
    itemCondition: "clean" | "lightly_soiled" | "contaminated" | "damaged" | "unknown"
    consentGiven: boolean
  }>) => void
  setAssessment: (assessment: MaterialAssessment | null) => void
  setIsAssessing: (loading: boolean) => void
  setAssessmentError: (err: string | null) => void
  setPreferences: (prefs: Partial<UserPreferences>) => void
  setIdeas: (ideas: ReuseIdea[], fallbackReason?: string | null) => void
  setIsGeneratingIdeas: (loading: boolean) => void
  setIdeasError: (err: string | null) => void
  toggleSaveIdea: (ideaId: string) => void
  updateProjectProgress: (ideaId: string, progress: Partial<UserProjectProgress>) => void
  resetScan: () => void
}

const defaultPreferences: UserPreferences = {
  experience: "beginner",
  tools: "household",
  budget: "free",
  time: "1_hour",
  goal: "useful",
}

export const useScanStore = create<ScanStoreState>()(
  persist(
    (set, get) => ({
      itemDescription: "",
      imagePreviewUrl: null,
      imageFile: null,
      quantity: "1 unit",
      itemCondition: "clean",
      consentGiven: false,

      assessment: null,
      isAssessing: false,
      assessmentError: null,

      preferences: defaultPreferences,

      ideas: [],
      isGeneratingIdeas: false,
      ideasError: null,
      fallbackReason: null,

      savedIdeaIds: [],
      projectProgress: {},

      setScanInput: (data) => set((state) => ({ ...state, ...data })),
      setAssessment: (assessment) => set({ assessment, assessmentError: null }),
      setIsAssessing: (isAssessing) => set({ isAssessing }),
      setAssessmentError: (assessmentError) => set({ assessmentError }),
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      setIdeas: (ideas, fallbackReason = null) =>
        set({ ideas, fallbackReason, ideasError: null }),
      setIsGeneratingIdeas: (isGeneratingIdeas) => set({ isGeneratingIdeas }),
      setIdeasError: (ideasError) => set({ ideasError }),

      toggleSaveIdea: (ideaId) => {
        const { savedIdeaIds } = get()
        if (savedIdeaIds.includes(ideaId)) {
          set({ savedIdeaIds: savedIdeaIds.filter((id) => id !== ideaId) })
        } else {
          set({ savedIdeaIds: [...savedIdeaIds, ideaId] })
        }
      },

      updateProjectProgress: (ideaId, progressUpdate) => {
        const current = get().projectProgress[ideaId] || {
          ideaId,
          currentStep: 1,
          totalSteps: 5,
          completedStepIds: [],
          isCompleted: false,
        }
        set({
          projectProgress: {
            ...get().projectProgress,
            [ideaId]: { ...current, ...progressUpdate },
          },
        })
      },

      resetScan: () =>
        set({
          itemDescription: "",
          imagePreviewUrl: null,
          imageFile: null,
          quantity: "1 unit",
          itemCondition: "clean",
          assessment: null,
          isAssessing: false,
          assessmentError: null,
          ideas: [],
          isGeneratingIdeas: false,
          ideasError: null,
          fallbackReason: null,
        }),
    }),
    {
      name: "rematter-scan-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        itemDescription: state.itemDescription,
        imagePreviewUrl: state.imagePreviewUrl,
        quantity: state.quantity,
        itemCondition: state.itemCondition,
        consentGiven: state.consentGiven,
        assessment: state.assessment,
        preferences: state.preferences,
        ideas: state.ideas,
        fallbackReason: state.fallbackReason,
        savedIdeaIds: state.savedIdeaIds,
        projectProgress: state.projectProgress,
      }),
    }
  )
)
