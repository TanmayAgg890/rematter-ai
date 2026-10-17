import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod"

export interface AIProviderConfig {
  apiKey?: string
  modelName: string
  isDemoMode: boolean
}

export function getAIConfig(): AIProviderConfig {
  const apiKey = process.env.GEMINI_API_KEY
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  const isDemoMode = process.env.DEMO_MODE === "true" || !apiKey || apiKey.trim() === ""

  return {
    apiKey,
    modelName,
    isDemoMode,
  }
}

/**
 * Executes a structured prompt with Google Generative AI (Gemini)
 * and validates the JSON output against a Zod schema.
 */
export async function generateStructuredAI<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options: {
    systemInstruction?: string
    imageBase64?: string
    imageMimeType?: string
    maxRetries?: number
  } = {}
): Promise<{ success: boolean; data?: T; error?: string; isDemo: boolean }> {
  const config = getAIConfig()

  if (config.isDemoMode) {
    return {
      success: false,
      isDemo: true,
      error: "DEMO_MODE is active or GEMINI_API_KEY is not configured.",
    }
  }

  const genAI = new GoogleGenerativeAI(config.apiKey!)
  const model = genAI.getGenerativeModel({
    model: config.modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
    systemInstruction: options.systemInstruction,
  })

  const maxRetries = options.maxRetries ?? 1
  let lastError: string | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const parts: Array<string | { inlineData: { data: string; mimeType: string } }> = []

      if (options.imageBase64 && options.imageMimeType) {
        parts.push({
          inlineData: {
            data: options.imageBase64,
            mimeType: options.imageMimeType,
          },
        })
      }

      parts.push(prompt)

      const result = await model.generateContent(parts)
      const text = result.response.text()

      if (!text) {
        throw new Error("Empty response from AI model")
      }

      const parsedJson = JSON.parse(text)
      const validated = schema.parse(parsedJson)

      return {
        success: true,
        data: validated,
        isDemo: false,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      lastError = errorMsg
      console.warn(`[ReMatter AI] Attempt ${attempt + 1} failed: ${errorMsg}`)
    }
  }

  return {
    success: false,
    error: lastError || "Failed to parse structured response from AI model.",
    isDemo: false,
  }
}
