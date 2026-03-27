# Salesforce Lead Priority Level Automation

Salesforce Lead scoring and priority automation — Wix → Make.com → Salesforce | Flow, Assignment Rules, and escalation logic

**Repository:** [github.com/NathanielVMuncie/salesforce-priority-level-automation](https://github.com/NathanielVMuncie/salesforce-priority-level-automation)
**Author:** Nathaniel Muncie — Salesforce Administrator candidate

---

## Table of Contents

- [Project Overview](#project-overview)
- [Business Objective](#business-objective)
- [Stack](#stack)
- [Core Design Principles](#core-design-principles)
- [System Architecture](#system-architecture)
- [Scoring Model](#scoring-model)
- [Repository Structure](#repository-structure)
- [Documentation Index](#documentation-index)
  - [Overview](#overview)
  - [Architecture](#architecture)
  - [Data Model](#data-model)
  - [Automation Logic](#automation-logic)
  - [Integration](#integration)
  - [Validation and Evidence](#validation-and-evidence)
  - [Metadata](#metadata)
  - [Portfolio](#portfolio)
- [Build Status](#build-status)

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

## System Architecture

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

## Scoring Model

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

### Overview

| File | Description |
|---|---|
| `docs/01-overview/project-overview.md` | Full project identity, context, and system summary |
| `docs/01-overview/business-objective.md` | Business problem, objective, and success criteria |
| `docs/01-overview/scope-boundaries.md` | Explicit in-scope and out-of-scope definitions |

---

### Architecture

| File | Description |
|---|---|
| `docs/02-architecture/system-architecture.md` | Layer definitions, execution sequence, and architectural constraints |
| `docs/02-architecture/automation-architecture.md` | Flow segment structure, element responsibilities, and governor limit analysis |
| `docs/02-architecture/routing-architecture.md` | Assignment Rule and Flow escalation interaction, ownership determination sequence |
| `docs/02-architecture/state-management-risk.md` | State risks, failure modes, and resolutions across all paths |

---

### Data Model

| File | Description |
|---|---|
| `docs/03-data-model/field-inventory.md` | Complete custom Field inventory on the Lead Object |
| `docs/03-data-model/field-dictionary.md` | Field-level definitions, types, and purpose documentation |
| `docs/03-data-model/scoring-model.md` | Scoring dimension design and weighted point values |
| `docs/03-data-model/priority-thresholds.md` | Threshold definitions and Priority Level mapping |

---

### Automation Logic

| File | Description |
|---|---|
| `docs/04-automation-logic/gatekeeper-logic.md` | Dual-purpose gatekeeper Decision design and qualification criteria |
| `docs/04-automation-logic/scoring-logic.md` | Role and Purchasing Timeline scoring Decision element logic |
| `docs/04-automation-logic/priority-assignment-logic.md` | Priority Level threshold evaluation and assignment |
| `docs/04-automation-logic/escalation-logic.md` | High priority escalation path and OwnerId override sequence |
| `docs/04-automation-logic/territorial-routing-logic.md` | Assignment Rule configuration, state-to-region mapping, and routing behavior |

---

### Integration

| File | Description |
|---|---|
| `docs/05-integration/wix-form-and-submission-automation.md` | Wix form structure, key/value mapping, and Wix Automation configuration |
| `docs/05-integration/key-value-mapping.md` | Form field key/value reference — Wix to Make.com payload contract |
| `docs/05-integration/make-com-integration.md` | Make.com scenario architecture and module configuration |
| `docs/05-integration/salesforce-integration.md` | Salesforce connection, API ingestion, and integration behavior |
| `docs/05-integration/wix-make-salesforce-ingestion.md` | End-to-end ingestion path from form submission to Lead Record creation |
| `docs/05-integration/source-to-lead-mapping.md` | Complete field-level mapping — Wix payload to Salesforce Lead Object |
| `docs/05-integration/middleware-responsibilities.md` | Make.com responsibility boundary and explicit non-responsibilities |

---

### Validation and Evidence

| File | Description |
|---|---|
| `docs/06-build-assets/configuration-checklist.md` | Complete configuration checklist across Wix, Make.com, and Salesforce |
| `docs/06-build-assets/test-scenarios.md` | Input values, expected behavior, and expected Record state for all three test paths |
| `docs/06-build-assets/uat-matrix.md` | UAT acceptance criteria, actual results, and pass/fail status |
| `docs/06-build-assets/screenshots-index.md` | Index of all screenshots captured during build and validation |
| `test-artifacts/scenario-inputs/lead-test-records.md` | Exact input values submitted for each test Lead |
| `test-artifacts/expected-results/priority-routing-results.md` | Expected vs. actual output values across all three scenarios |
| `test-artifacts/uat-evidence/uat-session-log.md` | Session log with observations, defects identified, and sign-off |
| `test-artifacts/defect-log/defects.md` | Defect register — D-01 root cause, resolution, and verification |

---

### Metadata

| File | Description |
|---|---|
| `metadata/custom-fields/lead-fields.md` | Custom field metadata reference — API names, types, and defaults |
| `metadata/formulas/priority-formulas.md` | Formula Field definitions — `Qualification_Status__c` |
| `metadata/queues/queue-definitions.md` | Queue identities, API names, and supported objects |
| `metadata/assignment-rules/lead-assignment-rules.md` | Assignment Rule entries, conditions, and complete state-to-queue reference |
| `metadata/flow-notes/lead-scoring-and-priority-assignment.md` | Element-level configuration notes for the Flow |

---

### Portfolio

| File | Description |
|---|---|
| `docs/07-portfolio/case-study-summary.md` | Full case study narrative — problem, solution, design decisions, and validation |
| `docs/07-portfolio/recruiter-readable-summary.md` | Non-technical plain-English summary for recruiters |
| `docs/07-portfolio/design-insight-gatekeeper-sequencing.md` | Design decision rationale — dual-purpose gatekeeper vs. two-element alternative |
| `portfolio/resume-bullets/resume-bullets.md` | Resume-ready bullets organized by Salesforce Administrator competency area |
| `portfolio/recruiter-summary/recruiter-summary.md` | Recruiter-facing project summary with competency evidence table |
| `portfolio/website-copy/project-page-copy.md` | Portfolio website copy for the project page |

---

The system is fully operational. Documentation is produced from a live Salesforce Developer Edition org with confirmed working automation, routing, escalation, and integration across Wix, Make.com, and Salesforce.

**Data Model blocker:** Four files require `.field-meta.xml` exports from the SFDX project to complete. Upload files from `force-app/main/default/objects/Lead/fields/` to unblock.

---

*Built by Nathaniel Muncie — Salesforce Administrator candidate*
