import { describe, it, expect } from "vitest"
import { validateImageUpload, validateScanInput, MAX_FILE_SIZE_BYTES } from "@/lib/validation/upload"

describe("Upload and Input Validation", () => {
  it("rejects file exceeding max size limit (10MB)", () => {
    const oversizedBlob = new Blob([new Uint8Array(MAX_FILE_SIZE_BYTES + 1024)], { type: "image/jpeg" })
    const result = validateImageUpload(oversizedBlob)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("exceeds maximum allowed limit")
  })

  it("accepts valid JPEG, PNG, and WebP files under 10MB", () => {
    const validJpeg = new Blob([new Uint8Array(1024)], { type: "image/jpeg" })
    const validPng = new Blob([new Uint8Array(1024)], { type: "image/png" })
    const validWebp = new Blob([new Uint8Array(1024)], { type: "image/webp" })

    expect(validateImageUpload(validJpeg).isValid).toBe(true)
    expect(validateImageUpload(validPng).isValid).toBe(true)
    expect(validateImageUpload(validWebp).isValid).toBe(true)
  })

  it("rejects unsupported MIME types like PDF or GIF", () => {
    const invalidPdf = new Blob([new Uint8Array(1024)], { type: "application/pdf" })
    const result = validateImageUpload(invalidPdf)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("Unsupported file format")
  })

  it("validates scan text inputs honestly", () => {
    // If no file, description must be at least 3 chars
    expect(validateScanInput("", false).isValid).toBe(false)
    expect(validateScanInput("ab", false).isValid).toBe(false)
    expect(validateScanInput("PET bottle", false).isValid).toBe(true)

    // If file present, empty description is allowed
    expect(validateScanInput("", true).isValid).toBe(true)
  })
})
