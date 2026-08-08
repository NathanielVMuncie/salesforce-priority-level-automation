# Salesforce Case Study: Lead — Priority Level Automation

**Owner:** Nathaniel V. Muncie
**Repo:** NathanielVMuncie/salesforce-priority-level-automation
**Branch:** main

---

## Project Identity

This repository documents a B2B lead intake, scoring, and routing
pipeline built for **Céleste Vineyards** (fictional). The system spans
Wix (qualification gatekeeper), Make.com (middleware), and Salesforce
Sales Cloud (Flow scoring, priority assignment, territorial routing).

**Stack:** Wix · Make.com · Salesforce Sales Cloud (DevOrg)

---

## Architecture

Three layers:

1. **Wix** — sole qualification gatekeeper. Every lead reaching
   Salesforce is B2B by definition. No qualification logic exists in
   Make.com or Salesforce.
2. **Make.com** — single-stream two-module pipeline:
   `WA_Inquiry_To_Make` → `POST_WH_Wix_Inquiry_To_Make`.
   No router. No Module 13.
3. **Salesforce** — After-Save Record-Triggered Flow:
   `Lead_Scoring_and_Priority_Level_Assignment` (V26, 31 elements,
   5 Decisions, single-DML write pattern).

---

## Commit Conventions

| Prefix  | Usage                               |
|---------|-------------------------------------|
| `init:` | New file creation                   |
| `fix:`  | Corrections to existing files       |
| `docs:` | Documentation additions or updates  |

- One file per commit when working within `docs/`.
- Never commit to `main` without explicit instruction from Nathaniel.
- Never batch multiple file changes under one commit without instruction.

---

## Prohibited Patterns

Never write, reference, or create any artifact containing:

| Prohibited                       | Reason                                    |
|----------------------------------|-------------------------------------------|
| `Qualified__c`                   | Deleted field — treated as non-existent   |
| `Qualification_Status__c`        | Deleted field — treated as non-existent   |
| `Lead_Score__c`                  | Prohibited field — XML pending removal    |
| `varQualified`                   | Non-existent Flow variable                |
| Module sequence numbers          | Ephemeral — use display labels only       |
| "Router" in Make.com context     | Architecture is single-stream; no router  |
| Disqualification path            | Not in system — Wix is sole gate         |
| "segment" / "phase" as Flow labels | Prohibited structural labels            |
| Queue alias labels (lnava, jchen, pdesa) | Retired — use Queue Labels      |

---

## Repository Structure

```
salesforce-priority-level-automation/
├── README.md                        # Exempt: no three-line header
├── CLAUDE.md                        # Exempt: no three-line header
├── docs/
│   ├── 01-overview/
│   ├── 02-architecture/
│   ├── 03-data-model/
│   ├── 04-automation-logic/
│   ├── 05-integration/
│   ├── 06-build-assets/
│   └── 07-portfolio/
├── metadata/
│   └── flows/
├── force-app/
│   └── main/default/objects/Lead/fields/
├── test-artifacts/
│   └── uat-evidence/
└── assets/
    └── screenshots/
        ├── wix/
        ├── make/
        └── salesforce/
```

---

## Document Standards (all files under `docs/`)

**Three-line header (required — exceptions: README.md, CLAUDE.md):**

```
# [Document Title]

**Salesforce Case Study: Lead — Priority Level Automation**
[Category Label — plain text, never bolded]
```

**Footer (exact match required):**

```
*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
```

**Document Status section:** `Section` and `File Path` fields only.
No Date Produced. No Status. No Phase. No Next Document.

**Accent required:** Céleste (é) throughout — never "Celeste".

**Em dash required:** project name always uses — never hyphen.

---

## Governance Layer Roles

| Layer       | Role                                                     |
|-------------|----------------------------------------------------------|
| Notion      | Authoritative governance — never modified by Claude Code |
| Claude.ai   | Planning, content decisions, Write Gate authority        |
| Claude Code | File writes and git operations only                      |

All architecture decisions are locked in Notion. Do not infer,
override, or extend them.

---

## Key Locked Values

| Component           | Value                                               |
|---------------------|-----------------------------------------------------|
| Flow name           | `Lead_Scoring_and_Priority_Level_Assignment`        |
| Flow version        | V26                                                 |
| Flow element count  | 31                                                  |
| Flow variables      | `varTotalScore` · `varPriorityLevel` · `varOwnerID` |
| Score range         | 3–15                                                |
| Priority High       | `varTotalScore` ≥ 12                                |
| Priority Medium     | `varTotalScore` ≥ 8                                 |
| Priority Low        | `varTotalScore` < 8 (Default Outcome)               |
| LeadSource          | `Céleste Vineyards — Business Inquiry Form`         |
| Escalation target   | Sophia Delgado, National Sales Director             |
| DevOrg alias        | `celeste-dev`                                       |
| Assignment Rule     | `Regional Territory Assignment`                     |
