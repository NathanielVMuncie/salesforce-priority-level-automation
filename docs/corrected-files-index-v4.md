# Corpus Remediation Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Knowledge Bank

---

## 1. Document Purpose

This index tracks the remediation status of every documentation file in the Lead Priority Level Automation corpus. It records file-by-file correction status, purge decisions, session attribution, and remaining work. This document is a Knowledge Bank artifact. It is not committed to the repository.

---

## 2. Completed Corrections

| # | File | Session | Action |
|---|---|---|---|
| 1 | `docs/01-overview/field-dictionary.md` | 2026-05 (prior) | Corrected |
| 2 | `docs/01-overview/field-inventory.md` | 2026-05 (prior) | Corrected |
| 3 | `docs/05-integration/queue-definitions.md` | 2026-06-01 | New file |
| 4 | `docs/05-integration/source-to-lead-mapping.md` | 2026-06-07 | New file |
| 5 | `docs/02-architecture/routing-architecture.md` | 2026-06-07 | Corrected |
| 6 | `test-artifacts/uat-session-log.md` | 2026-06-07 | Corrected |
| 7 | `test-artifacts/defects.md` | 2026-06-07 | Corrected |
| 8 | `test-artifacts/screenshots-index.md` | 2026-06-07 | Corrected |
| 9 | `docs/04-automation-logic/territorial-routing-logic.md` | 2026-06-07 | Corrected — M-3 |
| 10 | `docs/04-automation-logic/scoring-logic.md` | 2026-06-07 | Corrected — M-4 |
| 11 | `docs/03-data-model/scoring-model.md` | 2026-06-08 | Validated — M-6 — no changes |
| 12 | `docs/03-data-model/priority-thresholds.md` | 2026-06-08 | Corrected — M-7 |

---

## 3. Purge Log

| File | Session | Disposition |
|---|---|---|
| `docs/03-data-model/priority-formulas.md` | 2026-06-08 | PURGED — M-5 — architectural obsolescence. Documents formula-field priority architecture fully superseded by deterministic Flow. All referenced fields (`Qualification_Status__c`, `Qualified__c`, `Lead_Score__c`) are org-purged and prohibited per `document-standards.md` § 8. No version of this file is committable. Must not appear in repo or KB. |

---

## 4. Remaining Files

| ID | File | Required Action |
|---|---|---|
| mn-1 | `docs/02-architecture/state-management-risk.md` | Full 7-gate check; "Neil Thompson Record" → canonical L-01–L-05 lead; "Qualified — High" path label → `Priority Level High` |
| mn-2 | `docs/02-architecture/automation-architecture.md` | Full 7-gate check; element count and V26 outcome label currency to verify |

---

## 5. Remaining Summary

| Metric | Count |
|---|---|
| Original corpus files in scope | 12 |
| Purged — removed from corpus | 1 |
| Active corpus files | 11 |
| Corrected or validated this and prior sessions | 10 |
| Validated this session — no changes | 1 |
| Corrected this session | 1 |
| Total addressed | 12 |
| Remaining | 2 |

---

## 6. Session Log

| Session | Files Addressed |
|---|---|
| 2026-05 (prior) | `field-dictionary.md`, `field-inventory.md` |
| 2026-06-01 | `queue-definitions.md` (new file) |
| 2026-06-07 | `source-to-lead-mapping.md` (new file), `routing-architecture.md`, `uat-session-log.md`, `defects.md`, `screenshots-index.md`, `territorial-routing-logic.md`, `scoring-logic.md` |
| 2026-06-08 | `scoring-model.md` (validated — M-6), `priority-thresholds.md` (corrected — M-7), `priority-formulas.md` (purged — M-5) |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Knowledge Bank |
| File Path | `corrected-files-index-v3.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
