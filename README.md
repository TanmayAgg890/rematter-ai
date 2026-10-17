# ReMatter AI — Hackathon Edition (v2)

> **Waste in. Possibilities out.**  
> *Discover what you can realistically reuse, create, repurpose, or recycle with AI.*

---

## 1. Product Overview

**ReMatter AI** is a personalized circular economy decision-support system. Instead of generating generic creative crafts, ReMatter focuses on **practical, personalized, and safety-aware next steps**.

### Core Differentiator
- **Safety is an eligibility gate, never a score:** Hazardous materials (batteries, e-waste, unknown chemicals) are strictly diverted to certified Level 3 recycling facilities with zero DIY advice.
- **Explainable Feasibility Scoring ($S = 100 \cdot \sum w_f \cdot s_f$):** Evaluates tools, budget ($\ge ₹0$), skill, time, and material condition before recommending a project.
- **Three-Level Circular Hierarchy:**
  - **Level 1:** DIY at Home (household tools, zero cost)
  - **Level 2:** Workshop or Community (power tools, maker spaces)
  - **Level 3:** Professional Specialist Recycling (certified facilities)
- **Zero Hallucinated Recycling Facilities:** Curated ground-truth listings with CPCB / PRO source attribution.

---

## 2. Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript (Strict)
- **Styling & Theme:** Tailwind CSS with Nature-inspired Tokens (Forest Ink `#10251F`, Fresh Lime `#D8F3BD`, Warm Ivory `#F7F7F0`, Leaf Green `#477B55`)
- **Hero Artwork:** WebGL2 GPGPU Particle Sculpture Hero (`liquid-sculpture-hero.tsx` by guglielmogiannattasio.it) with static responsive fallback
- **State Management:** Zustand with Session/Local Storage persistence
- **AI Vision & Pathways:** Google Gemini API (`@google/generative-ai`) isolated behind `src/lib/ai/provider.ts` with strict Zod validation
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Unit & Integration Testing:** Vitest, React Testing Library, JSDOM

---

## 3. Quick Start & Setup

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd rematter-ai
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:
```env
# AI Provider (Gemini API)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Supabase (Database, Auth, Storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Demo Mode (Defaults to true out-of-the-box for offline testing)
DEMO_MODE=true
```
*Note: With `DEMO_MODE=true`, ReMatter runs entirely offline with verified sample fixtures for tested items without requiring an API key.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Database Migrations & Seeding (Supabase)

1. Open your Supabase SQL Editor.
2. Execute the schema migration in `supabase/migrations/01_init.sql` to establish:
   - Profiles, Scans, Material Assessments, User Preferences
   - Recommendation Sets, Ideas, Saved Ideas, Project Progress, Feedback
   - Recycling Facilities table with Row-Level Security (RLS) policies.
3. Execute `supabase/seed.sql` to populate verified recycling centers.

---

## 5. Running the Tests

ReMatter includes a complete unit test suite verifying upload constraints, feasibility math, safety eligibility gates, and AI schema validation:

```bash
# Run unit tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Production build
npm run build
```

---

## 6. Judge Demo Script (End-to-End Walkthrough)

1. **Landing (`/`):**
   - Interact with the WebGL Liquid Particle Sculpture (cursor / touch turns particles liquid).
   - Review the Four-Step process, Feasibility Formula ($S = 100 \cdot \sum w_f \cdot s_f$), and Three-Level System.
   - Click **"Start a Waste Scan"**.
2. **Waste Scan (`/scan`):**
   - Click the test button **"🍾 Clear PET Bottle"** (or upload your own photo).
   - Notice the rotating live scan stages ("Reading image", "Identifying likely materials", "Checking constraints").
3. **Assessment (`/assessment`):**
   - Inspect detected material candidate ($94\%$ PET, $88\%$ HDPE cap).
   - Review direct visible evidence vs. known chemical uncertainties.
   - Click **"Confirm Material"** and **"Continue to Personalization"**.
4. **Preferences Wizard (`/preferences`):**
   - Select: **Beginner** $\rightarrow$ **Household Essentials Only** $\rightarrow$ **₹0 (Strict Zero-Cost)** $\rightarrow$ **~1 Hour** $\rightarrow$ **Make Something Useful**.
   - Click **"Show My Personalized Ideas"**.
5. **Results (`/results`):**
   - Observe Idea #1: *Self-Watering Indoor Herb Planter* with feasibility score and breakdown bars ($100\%$ tools, $100\%$ budget, $100\%$ skill).
   - Click **"Not Suitable for Me"** on an item to see session-level re-ranking.
6. **Full Plan (`/ideas/[id]`):**
   - Open the full step-by-step guide with tools, materials checklist ("Have vs Need"), safety checklist, and completion tracking.
7. **Hazardous Test Route:**
   - Return to `/scan` and click **"⚠️ Swollen Battery (Hazardous Test)"**.
   - Watch the system lock out DIY alterations and route directly to authorized E-Waste PRO facilities.
8. **Recycling Directory (`/recycling`):**
   - Filter by material and location with verified CPCB/PRO partner badges and Google Maps directions.

---

## 7. License & Attribution

- Built for the ReMatter AI circular economy initiative.
- Liquid Sculpture Hero engine by [guglielmogiannattasio.it](https://guglielmogiannattasio.it).
