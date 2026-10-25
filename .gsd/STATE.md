# ReMatter AI — Active Project State

This file tracks the current active phase, ongoing work slices, blockers, architectural decisions, and immediate next steps.

---

## Current Development Phase

- **Phase Status:** Setup & Architecture Preparation
- **Active Task:** Establishing GSD-inspired lightweight planning workflow (Stage 1).
- **Target Milestone:** Milestone 8 (Supabase User Project Persistence & Saved History).

---

## Active Architectural Decisions

| Decision | Status | Context & Impact |
| :--- | :---: | :--- |
| **Mocha/Platinum/Lavender Design System** | **Locked** | Replaces all legacy green styling. Opaque backgrounds restricted strictly to moving word ticker. |
| **Product Reference Photography** | **Locked** | Real-world photography used in place of procedural 3D models across results and guide pages. |
| **Deterministic Feasibility Model** | **Locked** | Feasibility computed via $S = 100 \cdot \sum (w_f \cdot s_f)$; safety gates act as absolute binary disqualifiers. |
| **SessionStorage Progress Fallback** | **Active** | Anonymous users retain step completion in `rematter_plan_progress_{id}` without authentication. |
| **English-Only Scan Interface** | **Locked** | Homepage prompts and suggestion chips standardized in English for clarity and clean presentation. |

---

## Current Blockers & Risks

- **Blockers:** None currently active.
- **Risks Monitored:**
  - Database schema changes in Supabase must maintain strict RLS policies to prevent cross-user data leakage.
  - Vercel serverless API execution limits (ensure multimodal Gemini vision calls remain well within 15-second timeouts).

---

## Immediate Next Steps

1. Verify GSD workflow initialization and inspect created documentation.
2. Formulate Phase 1 specification (`.gsd/phases/01-supabase-persistence.md`) using the 4-phase cycle: Discuss ➔ Plan ➔ Execute ➔ Verify.
3. Transition to Stage 2: CodeRabbit connection review.
