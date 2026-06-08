# Corrected Files Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Knowledge Bank

---

## 1. Document Purpose

This document is the canonical tracking index for the Céleste Vineyards corpus audit remediation. It records every file flagged during the audit, the specific violations identified, the correction priority, and the current status of each file.

Files are organized into three tiers — Critical, Moderate, and Minor — based on the severity and scope of violations. A maximum of three corrected files are produced per session. Files are worked in tier order: Critical first, then Moderate, then Minor.

This document is updated at the close of every session in which a file correction is completed.

---

## 2. Completed Corrections

| File | Repo Path | Violations Resolved | Session |
|---|---|---|---|
| `field-dictionary.md` | `docs/03-data-model/field-dictionary.md` | Prohibited fields removed (`Qualified__c`, `Lead_Score__c`); prohibited variable removed (`varQualified`); write authority corrected | 2026-05 |
| `field-inventory.md` | `docs/03-data-model/field-inventory.md` | Prohibited fields removed from inventory and write authority table; coverage summary corrected | 2026-05 |
| `queue-definitions.md` | `docs/04-automation-logic/queue-definitions.md` | New file — written from scratch; Queue Labels confirmed from org screenshot 2026-05-29 | 2026-06-01 |
| `source-to-lead-mapping.md` | `docs/05-integration/source-to-lead-mapping.md` | New file — written from scratch; complete field-by-field mapping from Wix payload to Salesforce Lead fields documented | 2026-06-07 |
| `routing-architecture.md` | `docs/02-architecture/routing-architecture.md` | Retired lead names replaced with L-01 through L-05 canonical set; Queue Label and Assignment Rule API name currency verified | 2026-06-07 |
| `uat-session-log.md` | `test-artifacts/uat-session-log.md` | Retired lead names replaced with L-01 through L-05 canonical set; test scenarios aligned with canonical validation set | 2026-06-07 |
| `defects.md` | `test-artifacts/defects.md` | Prohibited fields removed (`Qualified__c`, `Qualification_Status__c`, `varQualified`); retired lead names removed; defect log reconstituted against current architecture | 2026-06-07 |
| `screenshots-index.md` | `test-artifacts/screenshots-index.md` | Retired lead names replaced with L-01 through L-05; prohibited fields removed; invalid picklist value `Priority_Level__c = Not Applicable` removed | 2026-06-07 |
| `territorial-routing-logic.md` | `docs/04-automation-logic/territorial-routing-logic.md` | Queue Labels corrected (`lnava`/`jchen`/`pdesa` → `East Coast Region`/`West Coast Region`/`Central Region`); retired lead names replaced with L-01 through L-05; execution order corrected in Section 1; Section 8 rewritten; Document Status section added | 2026-06-07 |

---

## 3. Critical Tier

Files with systemic violations — prohibited artifacts, retired lead sets, or missing files that block downstream documentation.

### 3.1 `source-to-lead-mapping.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/05-integration/source-to-lead-mapping.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Critical — 1 |

**Violations resolved:** File was absent from the repository. Written from scratch. Complete field-by-field mapping from Wix payload to Salesforce Lead fields via `Module 12`.

---

### 3.2 `routing-architecture.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/02-architecture/routing-architecture.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Critical — 2 |

**Violations resolved:** Retired lead names in Live Validation replaced with L-01 through L-05 canonical set. Assignment Rule API name and Queue Label currency verified against locked architecture.

---

### 3.3 `uat-session-log.md`

| Attribute | Value |
|---|---|
| Repo Path | `test-artifacts/uat-session-log.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Critical — 3 |

**Violations resolved:** Retired lead names replaced with L-01 through L-05 canonical set. Test scenarios and execution results aligned with canonical validation set across all five records.

---

## 4. Moderate Tier

Files with section-level violations — isolated prohibited artifacts, alias model references, or retired lead names in validation sections.

### 4.1 `defects.md`

| Attribute | Value |
|---|---|
| Repo Path | `test-artifacts/defects.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Moderate — 1 |

**Violations resolved:** Prohibited fields removed (`Qualified__c`, `Qualification_Status__c`); prohibited variable removed (`varQualified`); retired lead names removed; defect log reconstituted against current architecture — no defects identified during canonical UAT execution.

---

### 4.2 `screenshots-index.md`

| Attribute | Value |
|---|---|
| Repo Path | `test-artifacts/screenshots-index.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Moderate — 2 |

**Violations resolved:** Retired lead names S-01 through S-06 replaced with L-01 through L-05 canonical set. `Qualification_Status__c` removed from What to Capture column. Invalid picklist value `Priority_Level__c = Not Applicable` removed.

---

### 4.3 `territorial-routing-logic.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/04-automation-logic/territorial-routing-logic.md` |
| Status | ✅ Complete — committed to `main` |
| Priority | Moderate — 3 |

**Violations resolved:** Queue Labels corrected throughout — `lnava` → `East Coast Region`, `jchen` → `West Coast Region`, `pdesa` → `Central Region`. Live Validation section replaced with L-01 through L-05 canonical set. Section 1 execution order corrected. Section 8 rewritten to remove alias model reference. Document Status section added. Footer em dash corrected.

---

### 4.4 `scoring-logic.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/04-automation-logic/scoring-logic.md` |
| Status | ❌ Requires correction |
| Priority | Moderate — 4 |

**Violations:**
- Live Validation section (Section 11) references retired lead names — Tamara Nguyen, Jerome Castillo, Vivienne Okafor, Kenji Watanabe; must be replaced with canonical L-01 through L-05 set with correct score compositions

---

### 4.5 `priority-formulas.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/03-data-model/priority-formulas.md` |
| Status | ❌ Requires correction |
| Priority | Moderate — 5 |

**Violations:**
- `Qualification_Status__c` — documented as a Formula Field in Section 3; prohibited — entire section must be removed
- `Qualified__c` — referenced in Section 3.5 design notes; prohibited
- Formula Field Summary table (Section 5) includes `Qualification_Status__c` column — must be removed

---

### 4.6 `scoring-model.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/03-data-model/scoring-model.md` |
| Status | ⚠️ Pending standards verification |
| Priority | Moderate — 6 |

**Violations flagged at audit:** Gatekeeper framing language to verify; `Personal/Individual (Non-Business)` reference in scoring table to confirm correct scoping. Full 7-gate check required.

---

### 4.7 `priority-thresholds.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/03-data-model/priority-thresholds.md` |
| Status | ⚠️ Pending standards verification |
| Priority | Moderate — 7 |

**Violations flagged at audit:** Downstream effect table and escalation language to verify against locked Flow element names (`Escalate OwnerId to Sophia`, decision outcomes `Is High - Escalate` / `Is Not High`). Full 7-gate check required.

---

## 5. Minor Tier

Files with isolated terminology violations or single non-canonical references.

### 5.1 `state-management-risk.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/02-architecture/state-management-risk.md` |
| Status | ❌ Requires correction |
| Priority | Minor — 1 |

**Violations:**
- Section 3.2 references "Neil Thompson Record" — non-canonical lead name; must be replaced with correct canonical Lead from L-01 through L-05 set
- Section 4 path label "Qualified — High" — prohibited framing; must be replaced with "Priority Level High"

---

### 5.2 `automation-architecture.md`

| Attribute | Value |
|---|---|
| Repo Path | `docs/02-architecture/automation-architecture.md` |
| Status | ⚠️ Pending standards verification |
| Priority | Minor — 2 |

**Violations flagged at audit:** Element count and Decision outcome label currency to verify against locked V26 constants (26 elements, 5 Decisions, 20 Assignments, 1 Update Records; outcomes `Is High - Escalate` / `Is Not High`; escalation element `Escalate OwnerId to Sophia`). Full 7-gate check required.

---

## 6. Remaining Summary

| Tier | Total Files | Completed | Remaining |
|---|---|---|---|
| Critical | 3 | 3 | 0 |
| Moderate | 7 | 3 | 4 |
| Minor | 2 | 0 | 2 |
| **Total** | **12** | **6** | **6** |

---

## 7. Session Log

| Session | Files Corrected |
|---|---|
| 2026-05 (prior) | `field-dictionary.md`, `field-inventory.md` |
| 2026-06-01 | `queue-definitions.md` (new file) |
| 2026-06-07 | `source-to-lead-mapping.md` (new file), `routing-architecture.md`, `uat-session-log.md`, `defects.md`, `screenshots-index.md`, `territorial-routing-logic.md` |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Knowledge Bank |
| File Path | `corrected-files-index-v3.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
