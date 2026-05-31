# Salesforce Case Study: Lead — Priority Level Automation

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## Project Summary

This repository documents the Céleste Vineyards Lead Priority Level Automation system — a fully automated, end-to-end B2B Lead intake, scoring, and routing pipeline spanning three platforms: Wix, Make.com, and Salesforce Sales Cloud.

The system solves a specific operational failure: Céleste Vineyards had no standardized Lead intake process, no scoring mechanism to distinguish high-value contacts from low-value ones at the point of entry, and no territorial routing logic. This system replaces manual triage entirely. Every inbound B2B Lead now receives a composite Priority Score, is assigned a Priority Level of `High`, `Medium`, or `Low` at creation, and is routed to the correct owner with zero manual steps.

---

## Technology Stack

| Platform | Role | Component |
|---|---|---|
| Wix | Gatekeeper and intake | B2B inquiry form with conditional display logic |
| Make.com | Middleware | `Wix_To_CelesteProd_B2B_Lead_Engine_v1` scenario |
| Salesforce Sales Cloud | CRM and automation | Lead Object, Assignment Rule, After-Save Flow |

---

## Pipeline Architecture

```
[WIX]
Qualification Gate — Personal/Individual (Non-Business) collapses the form
Form submission → Wix Automation fires → payload to Make.com
        |
        ▼
[MAKE.COM]
Module 2 — Custom Webhook receives payload
Module 12 — Field normalization (phone format) + Salesforce Create Record via API
        |
        ▼
[SALESFORCE]
Lead Record created
Assignment Rule fires → regional Sales Representative assigned (by State/Province)
After-Save Flow fires (Lead_Scoring_and_Priority_Level_Assignment)
  Segment 1 — Business Type Score (1–5 pts)
  Segment 2 — Role Score (1–5 pts)
  Segment 3 — Purchasing Timeline Score (1–5 pts)
  Segment 4 — Priority Level assigned (High / Medium / Low)
  Segment 5 — Escalation check — Priority Level High → Sophia Delgado
Single DML write — OwnerId and Priority_Level__c committed
        |
        ▼
Lead owned by correct Sales Representative or Sophia Delgado
```

The Qualification Gate operates entirely within Wix before any submission occurs. Every Lead Record in Salesforce is a confirmed B2B submission by definition. No qualification fields, qualification variables, or disqualification paths exist anywhere in Make.com or Salesforce.

---

## Scoring Model

| Dimension | Field | Score Range |
|---|---|---|
| Business Type | `Business_Type__c` | 1–5 |
| Role | `Role__c` | 1–5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | 1–5 |
| **Composite Score** | `varTotalScore` | **3–15** |

| Priority Level | Threshold |
|---|---|
| `High` | `varTotalScore` ≥ 12 |
| `Medium` | `varTotalScore` ≥ 8 and < 12 |
| `Low` | `varTotalScore` < 8 |

---

## Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Version | V26 |
| Flow Type | Record-Triggered — After-Save |
| Trigger Event | A Record is Created |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

---

## Personnel

### Escalation Target

| Name | Title | Role in System |
|---|---|---|
| Sophia Delgado | National Sales Director | Receives all Priority Level `High` Leads via Flow escalation override |

### Regional Sales Representatives

| Name | Alias | Region | Queue |
|---|---|---|---|
| Luis Navarro | `lnava` | East Coast | `East_Coast_Region` |
| Jordan Chen | `jchen` | West Coast | `West_Coast_Region` |
| Priya Desai | `pdesa` | Central | `Central_Region` |

---

## DevOrg Constraint

This system is built in a Salesforce Developer Edition org. The org supports one active Standard User license. Only one named Sales Representative holds direct Lead ownership via the Assignment Rule at any given time — the remaining regions are covered by their regional Queue as a proxy owner. This is a DevOrg constraint, not a design limitation. In a production org, all representatives hold provisioned licenses simultaneously.

Sophia Delgado's escalation assignment is not subject to this constraint. Her User ID is written directly by the Flow, not the Assignment Rule. She receives all Priority Level `High` Leads in all license configurations.

---

## Repository Structure

```
salesforce-priority-level-automation/
│
├── docs/
│   ├── 01-overview/
│   │   ├── business-objective.md
│   │   ├── project-overview.md
│   │   ├── scope-boundaries.md
│   │   └── devorg-constraints-and-ownership-model.md
│   │
│   ├── 02-architecture/
│   │   ├── system-architecture.md
│   │   ├── automation-architecture.md
│   │   ├── routing-architecture.md
│   │   ├── gatekeeper-logic.md
│   │   └── state-management-risk.md
│   │
│   ├── 03-data-model/
│   │   ├── field-inventory.md
│   │   ├── field-dictionary.md
│   │   ├── scoring-model.md
│   │   ├── priority-thresholds.md
│   │   └── priority-formulas.md
│   │
│   ├── 04-automation-logic/
│   │   ├── scoring-logic.md
│   │   ├── scoring-matrix.md
│   │   ├── territorial-routing-logic.md
│   │   └── queue-definitions.md
│   │
│   ├── 05-integration/
│   │   └── middleware-responsibilities.md
│   │
│   └── 06-build-assets/
│       ├── lead-test-records.md
│       └── coverage-validation-matrix.md
│
├── test-artifacts/
│   ├── uat-session-log.md
│   ├── defects.md
│   └── screenshots-index.md
│
├── metadata/
│   └── [SFDX-retrieved org metadata]
│
└── README.md
```

---

## Validation Summary

Five canonical Lead Records were used to validate all automation paths:

| ID | Lead | Priority Level | Score | Territory | Final Owner |
|---|---|---|---|---|---|
| L-01 | Marcus Thibodeau | `High` | 14 | East Coast | Sophia Delgado |
| L-02 | Renata Voss | `High` | 13 | West Coast | Sophia Delgado |
| L-03 | Dominic Reyes | `Medium` | 9 | Central | Priya Desai |
| L-04 | Janelle Harmon | `Medium` | 8 | East Coast | Luis Navarro |
| L-05 | Britta Sandoval | `Low` | 3 | West Coast | Jordan Chen |

All five scenarios passed UAT. Full results in `test-artifacts/uat-session-log.md`.

---

## Built By

**Nathaniel V. Muncie** — Salesforce Administrator  
Case study designed and built as a portfolio demonstration of declarative automation, middleware integration, and territory-based Lead routing.

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
