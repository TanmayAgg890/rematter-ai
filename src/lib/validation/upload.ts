export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateImageUpload(file: File | Blob): FileValidationResult {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      isValid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB. Please upload a smaller image.`,
    }
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type}). ReMatter accepts JPEG, PNG, or WebP images.`,
    }
  }

  return { isValid: true }
}

export function validateScanInput(description: string, hasFile: boolean): { isValid: boolean; error?: string } {
  const trimmed = description.trim()
  if (!hasFile && trimmed.length < 3) {
    return {
      isValid: false,
      error: "Please provide either a photo of your waste or a brief description (at least 3 characters).",
    }
  }

  if (trimmed.length > 1000) {
    return {
      isValid: false,
      error: "Description is too long (maximum 1,000 characters).",
    }
  }

  return { isValid: true }
}
