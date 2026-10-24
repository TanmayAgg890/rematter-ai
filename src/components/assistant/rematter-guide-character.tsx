"use client"

import * as React from "react"

export interface GuideCharacterProps {
  state?: "idle" | "thinking" | "speaking" | "error"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  showPillLabel?: boolean
  unreadCount?: number
  className?: string
}

export function RematterGuideCharacter({
  state = "idle",
  size = "md",
  onClick,
  showPillLabel = true,
  unreadCount = 0,
  className = "",
}: GuideCharacterProps) {
  const dimension = size === "sm" ? 40 : size === "lg" ? 64 : 52

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open ReMatter Guide Assistant"
      className={`group relative inline-flex items-center gap-2.5 p-1 rounded-full focus-ring cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 rounded-full bg-lavender-accent/20 blur-md group-hover:bg-lavender-accent/35 transition-all" />

      {/* Robot Figure Container */}
      <div
        className="relative flex items-center justify-center rounded-full bg-[#211D1C] border-2 border-lavender-accent/40 shadow-xl overflow-visible p-1 group-hover:border-lavender-accent transition-colors"
        style={{ width: dimension, height: dimension }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-robot-hover overflow-visible"
        >
          {/* Antenna */}
          <line
            x1="32"
            y1="8"
            x2="32"
            y2="15"
            stroke="#2FC48A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="32"
            cy="7"
            r="3.5"
            fill={state === "error" ? "#E6A23C" : "#9BE7BD"}
            className="animate-pulse-glow"
          />

          {/* Ears / Side receivers */}
          <rect x="12" y="24" width="4" height="8" rx="2" fill="#18352A" stroke="#2FC48A" strokeWidth="1.2" />
          <rect x="48" y="24" width="4" height="8" rx="2" fill="#18352A" stroke="#2FC48A" strokeWidth="1.2" />

          {/* Head Capsule */}
          <rect
            x="14"
            y="14"
            width="36"
            height="28"
            rx="12"
            fill="#122820"
            stroke="#2FC48A"
            strokeWidth="1.8"
          />

          {/* Face Visor Display */}
          <rect
            x="18"
            y="20"
            width="28"
            height="16"
            rx="7"
            fill="#0B1713"
            stroke="rgba(47, 196, 138, 0.4)"
            strokeWidth="1.2"
          />

          {/* Digital Eyes */}
          {state === "thinking" ? (
            // Thinking: animated scanning dash
            <g className="animate-pulse">
              <circle cx="27" cy="28" r="2.5" fill="#9BE7BD" />
              <circle cx="37" cy="28" r="2.5" fill="#9BE7BD" />
              <line x1="24" y1="31" x2="40" y2="31" stroke="#2FC48A" strokeWidth="1.5" strokeDasharray="2 2" />
            </g>
          ) : (
            // Normal / Speaking: blinking digital rounded eyes
            <g className="animate-robot-blink">
              <ellipse cx="26" cy="28" rx="2.8" ry="3.5" fill="#2FC48A" />
              <circle cx="27" cy="26.8" r="1" fill="#FFFFFF" />
              <ellipse cx="38" cy="28" rx="2.8" ry="3.5" fill="#2FC48A" />
              <circle cx="39" cy="26.8" r="1" fill="#FFFFFF" />
            </g>
          )}

          {/* Sound / Mouth Wave (when speaking) */}
          {state === "speaking" && (
            <path
              d="M27 34 Q32 37 37 34"
              stroke="#9BE7BD"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
          )}

          {/* Torso Base */}
          <path
            d="M20 44 Q32 41 44 44 L41 53 Q32 55 23 53 Z"
            fill="#18352A"
            stroke="#2FC48A"
            strokeWidth="1.4"
          />

          {/* Chest Core Indicator */}
          <circle
            cx="32"
            cy="48"
            r="2.5"
            fill="#2FC48A"
            className="animate-pulse-glow"
          />
        </svg>

        {/* Live status badge indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#211D1C] ${
            state === "thinking"
              ? "bg-amber-400 animate-ping"
              : state === "speaking"
              ? "bg-lavender-accent animate-pulse"
              : "bg-lavender-accent"
          }`}
        />
      </div>

      {/* Pill Text Label */}
      {showPillLabel && (
        <div className="hidden sm:flex flex-col items-start pr-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-platinum-light tracking-wide">
              ReMatter Guide
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-mocha-deep text-lavender-accent font-semibold border border-lavender-accent/30">
              AI
            </span>
          </div>
          <span className="text-[10px] text-platinum/80 font-medium">
            {state === "thinking"
              ? "Thinking..."
              : state === "speaking"
              ? "Responding..."
              : "Ask anything"}
          </span>
        </div>
      )}

      {/* Unread Message Count Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-mocha text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
