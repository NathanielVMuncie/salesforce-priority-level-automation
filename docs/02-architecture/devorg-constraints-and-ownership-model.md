# Salesforce Lead Priority Level Automation

Salesforce Lead scoring and priority automation — Wix → Make.com → Salesforce | Flow, Assignment Rules, and escalation logic

---

## Project Overview

This repository documents the design, logic, and build of a Lead scoring and priority automation system built on Salesforce for Céleste Vineyards, a fictional winery used as a portfolio case study.

The system ingests Leads from a Wix web form, routes them through Make.com middleware, and processes them in Salesforce using a combination of custom Fields, weighted scoring logic, a Record-Triggered After-Save Flow, and Assignment Rules to automatically assign a Priority Level and route each Lead to the correct owner or Queue.

The system is fully operational. All automation logic, routing rules, and integration components are built and live in a Salesforce Developer Edition org. Documentation is produced in reverse documentation mode from the operational system.

---

## Business Objective

Eliminate manual Lead triage by automatically scoring and prioritizing incoming Leads at the point of creation, ensuring high-value Leads are routed immediately and no Lead enters the pipeline without a priority designation.

---

## Stack

| Layer | Technology |
|---|---|
| Lead Capture | Wix (web form) |
| Middleware | Make.com |
| CRM | Salesforce (Sales Cloud) |
| Automation | Salesforce Flow — Record-Triggered, After-Save |
| Routing | Assignment Rules, Queues |

---

## Core Design Principles

- **Qualification is separate from scoring.** A Lead must meet minimum criteria before scoring logic runs. This is enforced at the Flow level via a gatekeeper Decision that terminates non-qualified Leads before any score is calculated.
- **Single-DML pattern.** All Field writes occur in one Update Records element to avoid recursive trigger cycles and contain governor limit exposure within predictable bounds.
- **Bulk-safe design.** Flow logic is structured to handle batch Lead creation without violating Salesforce governor limits.
- **Deterministic priority assignment.** Priority Levels are assigned by fixed numeric thresholds. Given identical inputs, the system always produces identical output.

---

## System Architecture Summary

```
Wix Form → Make.com → Salesforce Lead (Created)
                              |
                     After-Save Flow Fires
                              |
                    Gatekeeper Check (Qualification)
                         |                |
                     Qualified        Not Qualified
                         |                |
                   Weighted Scoring    Flag and Exit
                   Business Type
                   + Role
                   + Purchasing Timeline
                         |
                  Priority Assignment
                  High / Medium / Low
                         |
                  Escalation Check
                  (High → Sophia Delgado)
                         |
                  Update Records (Single DML)
                         |
                 Assignment Rule → Queue Routing
                 East Coast | West Coast | Central
```

---

## Scoring Model Summary

Lead scoring operates across three dimensions. Each dimension contributes a weighted point value to `varTotalScore`. The cumulative score determines the Priority Level.

| Dimension | Field | Max Points |
|---|---|---|
| Business Type | `Business_Type__c` | 5 |
| Role | `Role__c` | 5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | 5 |
| **Total Possible** | | **15** |

### Priority Level Thresholds

| Priority Level | Score Condition |
|---|---|
| High | `varTotalScore` ≥ 12 |
| Medium | `varTotalScore` ≥ 8 |
| Low | Default (below 8) |

---

## Repository Structure

```
salesforce-priority-level-automation/
├── README.md
├── docs/
│   ├── 01-overview/
│   ├── 02-architecture/
│   ├── 03-data-model/
│   ├── 04-automation-logic/
│   ├── 05-integration/
│   ├── 06-build-assets/
│   └── 07-portfolio/
├── metadata/
│   ├── custom-fields/
│   ├── formulas/
│   ├── queues/
│   ├── assignment-rules/
│   └── flow-notes/
├── test-artifacts/
│   ├── scenario-inputs/
│   ├── expected-results/
│   ├── uat-evidence/
│   └── defect-log/
├── assets/
│   ├── screenshots/
│   └── exports/
├── portfolio/
│   ├── case-study-snippets/
│   ├── resume-bullets/
│   ├── recruiter-summary/
│   └── website-copy/
└── notes/
```

---

## Documentation Index

### Phase 0 — Overview ✅ Complete
- `docs/01-overview/project-overview.md` ✅
- `docs/01-overview/scope-boundaries.md` ✅
- `docs/01-overview/business-objective.md` ✅
- `docs/02-architecture/system-architecture.md` ✅

### Integration Layer ✅ Complete
- `docs/05-integration/wix-form-and-submission-automation.md` ✅
- `docs/05-integration/key-value-mapping.md` ✅
- `docs/05-integration/make-com-integration.md` ✅
- `docs/05-integration/salesforce-integration.md` ✅

### Phase 1 — Data Model 🔒 Pending CLI Access
- `docs/03-data-model/field-inventory.md`
- `docs/03-data-model/field-dictionary.md`
- `metadata/custom-fields/lead-fields.md`
- `metadata/formulas/priority-formulas.md`

### Phase 2 — Core Logic ✅ Complete
- `docs/03-data-model/scoring-model.md` ✅
- `docs/03-data-model/priority-thresholds.md` ✅
- `docs/04-automation-logic/gatekeeper-logic.md` ✅
- `docs/04-automation-logic/scoring-logic.md` ✅
- `docs/04-automation-logic/priority-assignment-logic.md` ✅

### Phase 3 — Routing, Escalation, and Ownership ✅ Complete
- `docs/04-automation-logic/escalation-logic.md` ✅
- `docs/04-automation-logic/territorial-routing-logic.md` ✅
- `docs/02-architecture/routing-architecture.md` ✅
- `docs/02-architecture/automation-architecture.md` ✅
- `docs/02-architecture/state-management-risk.md` ✅
- `metadata/queues/queue-definitions.md` ✅
- `metadata/assignment-rules/lead-assignment-rules.md` ✅
- `metadata/flow-notes/lead-scoring-and-priority-assignment.md` ✅

### Phase 4 — Integration Boundary ✅ Complete
- `docs/05-integration/wix-make-salesforce-ingestion.md` ✅
- `docs/05-integration/source-to-lead-mapping.md` ✅
- `docs/05-integration/middleware-responsibilities.md` ✅

### Phase 5 — Validation and Evidence ✅ Complete
- `docs/06-build-assets/configuration-checklist.md` ✅
- `docs/06-build-assets/test-scenarios.md` ✅
- `docs/06-build-assets/uat-matrix.md` ✅
- `docs/06-build-assets/screenshots-index.md` ✅
- `test-artifacts/scenario-inputs/lead-test-records.md` ✅
- `test-artifacts/expected-results/priority-routing-results.md` ✅
- `test-artifacts/uat-evidence/uat-session-log.md` ✅
- `test-artifacts/defect-log/defects.md` ✅

### Phase 6 — Portfolio ✅ Complete
- `docs/07-portfolio/case-study-summary.md` ✅
- `docs/07-portfolio/recruiter-readable-summary.md` ✅
- `docs/07-portfolio/design-insight-gatekeeper-sequencing.md` ✅
- `portfolio/resume-bullets/resume-bullets.md` ✅
- `portfolio/recruiter-summary/recruiter-summary.md` ✅
- `portfolio/website-copy/project-page-copy.md` ✅

---

## Status

✅ Phase 0 — Complete and committed
✅ Integration Layer — Complete and committed
🔒 Phase 1 — Data Model — Pending CLI access
✅ Phase 2 — Core Logic — Complete and committed
✅ Phase 3 — Routing, Escalation, and Ownership — Complete and committed
✅ Phase 4 — Integration Boundary — Complete and committed
✅ Phase 5 — Validation and Evidence — Complete and committed
✅ Phase 6 — Portfolio — Complete and committed

The system is fully operational. Documentation is produced from a live Salesforce Developer Edition org with confirmed working automation, routing, escalation, and integration across Wix, Make.com, and Salesforce.

---

*Built by Nathaniel Muncie — Salesforce Administrator candidate*