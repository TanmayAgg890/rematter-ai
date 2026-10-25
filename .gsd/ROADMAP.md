# ReMatter AI — Product Roadmap

ReMatter AI is a production-grade, AI-powered circular materials intelligence platform designed to help users identify discarded household materials, understand realistic upcycling and reuse pathways, and follow grounded, feasible instructions without unverified claims.

---

## 1. Overall Project Goals

- **Accurate Material Intelligence:** Provide reliable, honest multimodal vision classification for discarded materials with visible evidence breakdowns and transparent uncertainty.
- **Feasible Upcycling Discovery:** Match materials to realistic DIY upcycling or repair projects calibrated against real-world user constraints (tools, budget, skill level, time).
- **Zero Hallucinated Circularity:** Ground collection hubs in verified CPCB/PRO registries and enforce strict deterministic safety gates before cosmetic feasibility.
- **Instruction Execution with Progress Tracking:** Guide users through step-by-step DIY guides with real-world product reference photography, verified YouTube tutorial search integrations, and persistent checklist progress.
- **Enterprise-Grade UI/UX:** Cohesive visual identity combining Mocha Brown, Platinum Silver, and Pale Lavender over an interactive 21st.dev Fluid Particles Background.

---

## 2. Current Project Status

| Milestone | Status | Description |
| :--- | :---: | :--- |
| **M1: Design System & Fluid Particles** | **Complete** | Full Mocha/Platinum/Lavender palette applied across all 17 routes over global fluid particle canvas. |
| **M2: Hero & Minimal Messaging** | **Complete** | High-impact typography, single-line description ("Turn everyday waste into something useful."), dual CTAs. |
| **M3: Native Clipboard Pasting** | **Complete** | Global `Ctrl+V` listener supporting immediate clipboard image detection, preview, and validation. |
| **M4: Honest AI Vision & Re-Analysis** | **Complete** | Multimodal Gemini prompt separating denim/textiles from plastics; qualitative confidence; fresh "Analyze Again" flow. |
| **M5: Real Reference Photography** | **Complete** | Curated real-world project photography replacing geometric 3D placeholders, complete with source attribution. |
| **M6: Interactive Progress Tracking** | **Complete** | Step-by-step checkboxes with persistent `sessionStorage` progress, completion banner, and reset options. |
| **M7: Verified Recycling Directory** | **Complete** | Geolocation-enabled center lookup grounded in official directories with user reporting. |

---

## 3. Pending & Future Milestones

- [ ] **Milestone 8 (M8): Supabase User Project Persistence**
  - Save completed project checklists and custom user scans directly to Supabase `user_projects` table when authenticated.
  - Implement RLS policies for private user project history.
- [ ] **Milestone 9 (M9): Multi-Item Waste Identification**
  - Allow users to upload photos containing multiple discarded items simultaneously.
  - Decompose items into separate sub-assessments with individual feasibility scores.
- [ ] **Milestone 10 (M10): Offline Scan Caching & PWA Support**
  - Cache recent guides and reference photos in service worker storage for low-connectivity environments.
- [ ] **Milestone 11 (M11): Automated CI/CD Code Review**
  - Integrate CodeRabbit for automated PR reviews and vulnerability scanning.
