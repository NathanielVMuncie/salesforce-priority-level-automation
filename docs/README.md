# Salesforce Case Study: Lead — Priority Level Automation

**Céleste Vineyards | B2B Lead Intake, Scoring, and Routing Pipeline**

Built by Nathaniel V. Muncie

---

## Overview

This case study documents a fully automated, end-to-end B2B Lead intake, scoring, and routing pipeline spanning three platforms — Wix, Make.com, and Salesforce Sales Cloud. The system replaces an informal, judgment-dependent intake process with a deterministic automation pipeline that captures, scores, prioritizes, and routes every inbound B2B Lead without manual intervention.

Every Lead Record that enters Salesforce receives a composite Priority Score across three weighted scoring tiers, a Priority Level of `High`, `Medium`, or `Low`, and an owner assignment — all executed at the moment of Record creation with zero manual steps.

---

## Technology Stack

| Platform | Role |
|---|---|
| Wix | B2B inquiry form with front-end qualification gate |
| Make.com | Middleware — payload normalization and Salesforce API ingestion |
| Salesforce Sales Cloud | CRM, Record-Triggered Flow, Assignment Rule, and routing |

---

## Pipeline Architecture

The system is a linear, event-driven pipeline with a defined entry point, fixed execution sequence, and defined termination point.

```
[WIX]
Qualification Gate — blocks Personal/Individual (Non-Business) at the form layer
B2B submission → Wix Automation fires → payload transmitted to Make.com
        |
        ▼
[MAKE.COM]
Custom Webhook receives B2B payload
Field normalization — phone format standardization
Salesforce Create Record via REST API
        |
        ▼
[SALESFORCE]
Lead Record created
Regional Territory Assignment Rule fires → named Sales Representative assigned
After-Save Flow fires — Lead_Scoring_and_Priority_Level_Assignment (V26)
  Tier 1 — Business Type Score (1–5 pts)
  Tier 2 — Role Score (1–5 pts)
  Tier 3 — Purchasing Timeline Score (1–5 pts)
  Priority Level assigned — High / Medium / Low
  Escalation — Priority Level High → Sophia Delgado (National Sales Director)
  Single DML Write — OwnerId and Priority_Level__c committed
        |
        ▼
Lead owned by correct Sales Representative or Sophia Delgado
```

---

## Key Components

### Qualification Gate — Wix

The Business Type dropdown is the first field on the Céleste Vineyards B2B inquiry form. Selecting `Personal/Individual (Non-Business)` immediately collapses all remaining fields, disables the submit control, and renders a gate message. No Wix Automation fires, no payload is transmitted, and no Lead Record is created in Salesforce. The gate is self-contained within Wix and requires no downstream logic to enforce it.

Every Lead Record in this repository originated from a confirmed B2B submission.

### Middleware — Make.com

**Scenario:** `Wix_To_CelesteProd_B2B_Lead_Engine_v1`

A two-module, single-stream pipeline. `Module 2` (Custom Webhook) receives the B2B payload from Wix. `Module 12` (Salesforce Create Record) normalizes the phone field, maps all payload keys to Salesforce Lead field API names, hardcodes `LeadSource` as `Céleste Vineyards - Business Inquiry Form`, and creates the Lead Record via the Salesforce REST API. Make.com has no awareness of scoring, priority assignment, or routing logic. It is the ingestion layer only.

### Scoring Flow — Salesforce

**Flow:** `Lead_Scoring_and_Priority_Level_Assignment` — V26  
**Type:** Record-Triggered After-Save  
**Object:** Lead  
**Trigger:** Record is Created  
**Entry Condition:** `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form`  
**Elements:** 26 total (5 Decisions, 20 Assignments, 1 Update Records)

The Flow executes four segments in a fixed sequence. No segment is skipped for any Lead that enters the Flow.

| Segment | Responsibility |
|---|---|
| Segment 1 — Weighted Scoring | Evaluates Tiers 1–3, accumulates `varTotalScore` (range: 3–15) |
| Segment 2 — Priority Assignment | Maps `varTotalScore` to `High`, `Medium`, or `Low` via fixed thresholds |
| Segment 3 — Escalation | Overrides `OwnerId` to Sophia Delgado for Priority Level `High` Leads |
| Segment 4 — Single DML Write | Commits `OwnerId` and `Priority_Level__c` in one Update Records operation |

**Flow Variables:**

| Variable | Type | Purpose |
|---|---|---|
| `varTotalScore` | Number | Accumulates weighted dimension scores across all three tiers |
| `varPriorityLevel` | Text | Stores the assigned Priority Level string |
| `varOwnerID` | Text | Stores the final `OwnerId` value committed at DML |

### Assignment Rule — Salesforce

**Rule Label:** Regional Territory Assignment  
**API Name:** `regional_territory_assignment`

Three rule entries covering all 50 US states and the District of Columbia. Evaluates `State/Province` at Record creation and assigns the Lead to the correct regional Sales Representative. Fires before the Flow executes — the Flow's Segment 3 escalation logic either retains or overrides this assignment depending on Priority Level.

---

## Scoring Model

The scoring model evaluates three tiers in sequence. Each tier contributes 1–5 points to `varTotalScore`. Tiers are independent — no tier is weighted against another and no tier is skipped for any Lead that enters the Flow.

| Tier | Field | Score Range |
|---|---|---|
| Tier 1 | `Business_Type__c` | 1–5 |
| Tier 2 | `Role__c` | 1–5 |
| Tier 3 | `Purchasing_Timeline__c` | 1–5 |
| **Composite** | `varTotalScore` | **3–15** |

**Priority Level Thresholds:**

| Priority Level | Threshold | Escalation |
|---|---|---|
| `High` | `varTotalScore` ≥ 12 | Yes — Sophia Delgado |
| `Medium` | `varTotalScore` ≥ 8 and < 12 | No |
| `Low` | `varTotalScore` < 8 | No |

Priority Level reflects the composite commercial value of a Lead across all three scoring tiers. It is not a measure of contact urgency alone. Identical input values always produce identical output — the model is fully deterministic.

---

## Personnel

| Name | Title | Role in System |
|---|---|---|
| Sophia Delgado | National Sales Director | Escalation target — receives all Priority Level `High` Leads via Flow `OwnerId` override |
| Luis Navarro | East Coast Sales Representative | East Coast territory — `East_Coast_Region` |
| Jordan Chen | West Coast Sales Representative | West Coast territory — `West_Coast_Region` |
| Priya Desai | Central Sales Representative | Central territory — `Central_Region` |

Sophia Delgado's assignment is not territory-based. She receives Priority Level `High` Leads from all three regions. Her `OwnerId` is written directly by the Flow, not by the Assignment Rule, making her assignment independent of the DevOrg license-cycling constraint.

---

## Validation

Five canonical Lead Records cover all three Priority Levels, all three territories, and both routing outcomes (escalation and non-escalation). All records were created through the Make.com scenario and validated against live Flow debug logs and Lead Record inspection.

| ID | Name | Priority | Score | Territory | Final Owner |
|---|---|---|---|---|---|
| L-01 | Marcus Thibodeau | `High` | 14 | East Coast | Sophia Delgado |
| L-02 | Renata Voss | `High` | 13 | West Coast | Sophia Delgado |
| L-03 | Dominic Reyes | `Medium` | 9 | Central | Priya Desai |
| L-04 | Janelle Harmon | `Medium` | 8 | East Coast | Luis Navarro |
| L-05 | Britta Sandoval | `Low` | 3 | West Coast | Jordan Chen |

All five UAT scenarios passed. No unexpected outcomes. Full results in `test-artifacts/uat-session-log.md`.

---

## Repository Structure

```
/
├── docs/
│   ├── 01-overview/         Business objective, scope boundaries, DevOrg constraints
│   ├── 02-architecture/     System, automation, gatekeeper, routing, state management
│   ├── 03-data-model/       Field inventory, field dictionary, scoring model, thresholds, formulas
│   ├── 04-automation-logic/ Scoring logic, territorial routing, queue definitions
│   ├── 05-integration/      Middleware responsibilities
│   └── 06-build-assets/     Lead test records, coverage validation matrix
├── test-artifacts/          UAT session log, defect log, screenshots index
└── metadata/                SFDX-retrieved org metadata (API v66.0)
```

---

## DevOrg Context

This system is built in a Salesforce Developer Edition org (single Standard User license). The license constraint means only one named Sales Representative can hold direct Lead ownership via the Assignment Rule at any given time. The two representatives without the active license are covered by their corresponding regional Queue as a license-gap placeholder. This is a DevOrg constraint — not a design gap. In a production org, all three representatives and Sophia Delgado hold provisioned licenses simultaneously.

All automation logic, Flow execution, scoring, escalation, and routing operate identically to a production org. The Assignment Rule logic and state-to-territory mappings require no modification for production deployment.

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
