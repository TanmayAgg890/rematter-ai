"use client"

import * as React from "react"
import { getProductReferenceImage, ProductReferenceImage } from "@/data/reference-images"
import { ExternalLink, Image as ImageIcon, Sparkles, ZoomIn, X } from "lucide-react"

export interface ProductReferenceCardProps {
  productTitle: string
  materialCategory?: string
  description?: string
  ideaId?: string
  className?: string
}

/**
 * ProductReferenceCard displays genuine real-world product reference images
 * with clear source attribution, honest disclosure, zoom modal, and graceful fallback.
 * Completely replaces geometric placeholder 3D viewers.
 */
export function ProductReferenceCard({
  productTitle,
  materialCategory,
  description,
  ideaId,
  className = "",
}: ProductReferenceCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const [isZoomed, setIsZoomed] = React.useState(false)

  const refImage: ProductReferenceImage = React.useMemo(() => {
    return getProductReferenceImage({
      id: ideaId,
      title: productTitle,
      category: materialCategory,
      description,
    })
  }, [ideaId, productTitle, materialCategory, description])

  return (
    <>
      <div className={`rounded-2xl border border-white/15 bg-[#211D1C]/80 backdrop-blur-md overflow-hidden shadow-lg ${className}`}>
        {/* Top Header Label */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-lavender-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-platinum">
              Real-World Product Reference
            </span>
          </div>
          <span className="text-[11px] text-platinum/70 italic">
            Visual Guide
          </span>
        </div>

        {/* Image Frame */}
        <div className="relative w-full h-64 sm:h-72 bg-[#171515] overflow-hidden group">
          {!imageError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={refImage.imageUrl}
                alt={refImage.alt || productTitle}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Zoom hover trigger */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                aria-label="Enlarge reference image"
                className="absolute bottom-3 right-3 p-2 rounded-full bg-mocha-deep/80 hover:bg-mocha text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-md focus-ring"
              >
                <ZoomIn className="w-4 h-4 text-lavender" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-platinum">
              <ImageIcon className="w-10 h-10 mb-2 text-platinum/40" />
              <p className="text-sm font-semibold text-white mb-1">{productTitle}</p>
              <p className="text-xs text-platinum/70">Reference image currently unavailable</p>
            </div>
          )}
        </div>

        {/* Source Attribution & Caption */}
        <div className="p-4 bg-white/5 border-t border-white/10 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="text-[11px] text-platinum leading-relaxed">
            <span className="font-semibold text-white block sm:inline">{refImage.sourceTitle}</span>
            <span className="text-platinum/60 block sm:inline sm:ml-1.5">
              • Reference only (actual build varies by tools & waste item)
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-lavender">
            <span>Source: {refImage.sourceDomain}</span>
          </div>
        </div>
      </div>

      {/* Enlarged Modal */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-3xl w-full bg-[#211D1C] rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <span className="text-sm font-bold text-white">{productTitle}</span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded-lg text-platinum hover:text-white hover:bg-white/10 focus-ring"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={refImage.imageUrl}
              alt={refImage.alt || productTitle}
              className="w-full max-h-[75vh] object-contain bg-[#171515]"
            />
            <div className="p-4 text-xs text-platinum bg-white/5 border-t border-white/10">
              {refImage.sourceTitle} — {refImage.sourceDomain}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
