---
name: project-start
description: >
  Restore full project context for the Céleste Vineyards Salesforce case study at the
  start of a working session. Use when beginning a new session, resuming work, or when
  Claude needs to be re-oriented to the project. Examples: "start project", "load context",
  "resume work", "what are we working on".
---

# Project Start — Céleste Vineyards Case Study

Restore full working context for this session.

## Workflow

Make a todo list for all tasks and work through them one at a time.

### 1. Read Project Instructions

Read `notes/claude-project-instructions.md` in full. This is the authoritative source for:
- Project identity and goals
- Build sequence and phase order
- Tone and communication style
- File naming conventions
- Repository structure

### 2. Report Phase Status

After reading the instructions, print a phase status table in this format:

| Phase | Name | Status |
|---|---|---|
| Phase 0 | Root Control Plane | ✅ / 🔄 / 🔒 |
| Phase 1 | Data Authority | ✅ / 🔄 / 🔒 |
| Phase 2 | Core Deterministic Logic | ✅ / 🔄 / 🔒 |
| Phase 3 | Routing, Escalation, and Ownership | ✅ / 🔄 / 🔒 |
| Phase 4 | Integration Boundary | ✅ / 🔄 / 🔒 |
| Phase 5 | Validation and Evidence | ✅ / 🔄 / 🔒 |
| Phase 6 | Portfolio Translation | ✅ / 🔄 / 🔒 |

Use the status values from the instructions file exactly as recorded.

### 3. Report Active Blockers

List any blockers identified in the instructions. For each blocker, state:
- What is blocked
- What is required to unblock it
- Which files are affected

### 4. Confirm Active Phase

Identify the current active phase (the earliest incomplete phase). State it clearly:

> **Active Phase:** Phase [X] — [Name]

If Phase 2 is the active phase, issue this notice before proceeding:

> **Model Switch Recommended:** Phase 2 involves scoring model design, gatekeeper
> architecture, and governor limit risk analysis. Switch to Claude Opus 4.6 before
> proceeding with any Phase 2 documents.

### 5. Remind of Conventions

Print a compact reference of the active conventions:

**Naming:** Date-first kebab-case (e.g., `2026-03-30-field-dictionary.md`)
**Formats:** `.md` default · `.docx` professional · `.pdf` final/shareable
**No YAML frontmatter** in any Markdown file (except skill files)
**Output:** Every document must be produced as a downloadable file — not inline chat text only

### 6. Prompt for Next Action

Ask: **"What would you like to work on this session?"**

## Wrap Up

Context is fully loaded. Claude is oriented to the current phase, blockers, and conventions. Ready for work.
