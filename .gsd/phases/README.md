# ReMatter AI — Feature Phases Directory

This directory contains modular phase documents for every major feature implemented in ReMatter AI.

---

## The GSD 4-Phase Cycle

Every feature follows four sequential phases to prevent context degradation and maintain high code quality:

```text
.gsd/phases/
├── XX-feature-name/
│   ├── 01-discuss.md    # Requirements, user stories, constraints, data model
│   ├── 02-plan.md       # Atomic task breakdown, acceptance criteria, test plan
│   ├── 03-execute.md    # Implementation log, modified files, diff references
│   └── 04-verify.md     # Test execution outputs, build traces, Playwright results
```

---

## Phase Template

When starting a new feature, initialize a phase document with this structure:

```markdown
# Phase [XX]: [Feature Title]

## 1. Discuss (Scope & Constraints)
- **Objective:** What problem does this feature solve?
- **User Story:** As a [user], I want to [action] so that [benefit].
- **Constraints:** Performance, backward-compatibility, security, palette rules.

## 2. Plan (Atomic Work Breakdown)
- [ ] Task 1: Inspect affected components and data stores.
- [ ] Task 2: Implement server/store updates with type-safety.
- [ ] Task 3: Build or update UI components using Mocha/Platinum/Lavender tokens.
- [ ] Task 4: Write or update unit and integration tests.

## 3. Execute (Implementation Log)
- Files modified:
- Architectural decisions made during implementation:

## 4. Verify (Stopping Criteria & Test Gate)
- [ ] TypeScript check: `npm run typecheck` exits 0.
- [ ] Unit tests: `npm test` passes all test suites.
- [ ] Next.js build: `npm run build` compiles all routes.
- [ ] UI / Playwright check: Layout, interactivity, and mobile responsiveness verified.
```
