# Salesforce Case Study: Lead — Priority Level Automation

A fully automated, end-to-end B2B Lead intake, scoring, and routing system built for Céleste Vineyards across Wix, Make.com, and Salesforce Sales Cloud.

---

## Business Objective

Céleste Vineyards is a fictional mid-sized B2B wine company that required a deterministic Lead intake system to replace manual handling and eliminate inconsistency at the point of pipeline entry.

The primary objectives were:

- **Qualification Enforcement:** Prevent non-business submissions from entering the pipeline entirely — enforced at the Wix form before any data is transmitted.
- **Priority Determination:** Assign a Priority Level to every Lead at creation based on a weighted scoring model reflecting potential business value.
- **Territorial Routing:** Assign each Lead to the correct regional Queue based on geographic territory using Salesforce Assignment Rules.
- **Escalation Control:** Automatically route Priority Level High Leads to the National Sales Director without manual intervention.
- **Zero-Touch Processing:** Ensure all scoring and routing decisions are handled automatically from form submission through owner assignment.

Without this system, high-value Leads risked being overlooked, routing was inconsistent, and no standardized Priority Level existed at the point of entry. This architecture enforces immediate scoring, prioritization, and ownership assignment for every B2B Lead.

---

## How the System Works

The automation operates as a linear pipeline. The qualification gate is the outermost boundary — it is not a pipeline layer, it is the wall that determines whether a prospect enters the pipeline at all. Everything downstream of the gate operates on confirmed B2B submissions only.

```
Wix Form — Qualification Gate
        |
        | Personal/Individual (Non-Business) selected:
        | form collapses, no submission possible, pipeline never reached
        |
        | B2B selection: form active, prospect submits
        ▼
Make.com (Middleware)
        |
        | Normalizes payload, maps Fields, creates Lead Record via Salesforce API
        ▼
Salesforce Lead Record Created
        |
        ▼
Lead Assignment Rule
        |
        | Evaluates State/Province → assigns regional Queue
        ▼
After-Save Flow: Lead_Scoring_and_Priority_Level_Assignment
        |
        ▼
Weighted Scoring
Business Type (1–5) + Role (1–5) + Purchasing Timeline (1–5)
        |
        | varTotalScore range: 3–15
        ▼
Priority Assignment
High (≥ 12) | Medium (≥ 8) | Low (< 8)
        |
        ▼
Escalation Check
Priority Level High → OwnerId overridden to Sophia Delgado (National Sales Director)
Priority Level Medium / Low → Regional Queue retained
        |
        ▼
Single DML Write
OwnerId + Priority_Level__c committed to Lead Record
        |
        ▼
Lead owned — pipeline complete
```

---

## Qualification Gate — Wix Form

The Wix inquiry form is the qualification gate for the entire system. It is not a pipeline layer — it is the structural boundary that determines whether a prospect enters the pipeline at all.

When a prospect selects `Personal/Individual (Non-Business)` from the Business Type field, the form immediately transforms: all remaining fields collapse and the form becomes unsubmittable. The Wix Automation that would transmit the payload to Make.com is triggered only by form submission — because no submission occurs, no Wix Automation fires, no payload is generated, and no data reaches Make.com or Salesforce. The prospect exits entirely at the Wix layer.

Every Lead Record that exists in Salesforce originated from a B2B submission. No qualification logic, qualification fields, or disqualification paths exist anywhere in the Salesforce layer — they are not needed.

---

## Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Qualification Gate | Wix | Form-level B2B gate — blocks non-business submissions before any data transmits |
| Middleware | Make.com | Payload normalization, Field mapping, Salesforce API ingestion |
| CRM | Salesforce Sales Cloud | Scoring, priority assignment, escalation, routing |
| Automation | Record-Triggered After-Save Flow | Weighted scoring + priority assignment + escalation override |
| Routing | Lead Assignment Rules + Queues | Territory-based owner assignment |

---

## Scoring Model

Every Lead that reaches Salesforce is scored across three dimensions. Each dimension contributes 1–5 points to `varTotalScore`. The composite score determines `Priority_Level__c`.

### Business Type (`Business_Type__c`)

| Picklist Value | Points |
|---|---|
| Premium Wine Distributor | 5 |
| High-End Wine Store | 4 |
| Upscale Restaurant | 3 |
| Specialty Gourmet Grocer | 2 |
| Catering & Event Company | 1 |

### Role (`Role__c`)

| Picklist Value | Points |
|---|---|
| Owner | 5 |
| Purchasing Manager | 4 |
| General Manager | 3 |
| Sales Manager | 2 |
| Event Coordinator | 1 |

### Purchasing Timeline (`Purchasing_Timeline__c`)

| Picklist Value | Points |
|---|---|
| Immediate Need (Contracting) | 5 |
| Short-Term (Within 30 Days) | 4 |
| Evaluating Vendors (Next 90 Days) | 3 |
| Budget Planning (Future Quarter) | 2 |
| Information Gathering | 1 |

### Priority Level Thresholds

| Priority Level | Condition | Score Range |
|---|---|---|
| High | `varTotalScore` ≥ 12 | 12–15 |
| Medium | `varTotalScore` ≥ 8 | 8–11 |
| Low | Default | 3–7 |

---

## Territorial Routing

The Lead Assignment Rule evaluates `State/Province` on every incoming Lead Record and assigns ownership to one of three regional Queues. The Assignment Rule fires before the Flow and establishes the territorial ownership baseline.

| Region | Queue API Name | States Covered |
|---|---|---|
| East Coast | `East_Coast_Region` | 20 states + DC |
| West Coast | `West_Coast_Region` | 13 states |
| Central | `Central_Region` | 18 states |

All 50 US states and the District of Columbia are covered. No Lead is unassigned by territory.

---

## Escalation

Priority Level High Leads are escalated to **Sophia Delgado**, National Sales Director, via Flow escalation logic. The Flow captures the regional Queue `OwnerId` set by the Assignment Rule, evaluates `varPriorityLevel`, and overwrites `OwnerId` with Sophia Delgado's User ID when Priority Level is High. Priority Level Medium and Low Leads retain regional Queue ownership.

The `Region__c` Formula Field preserves the correct territorial classification on all Lead Records regardless of who owns them — escalated Leads owned by Sophia Delgado still carry the correct regional value for pipeline reporting.

---

## Core Design Principles

| Principle | Description |
|---|---|
| Gate at the Source | Non-business contacts are blocked at the Wix form before any data is transmitted. The gate is the wall — nothing that does not belong enters the pipeline. |
| Single-DML Pattern | All custom Field writes occur in one Flow Update Records element. No recursive triggers. Governor limit exposure is contained and predictable. |
| Separation of Concerns | Each layer owns exactly one responsibility. Wix enforces the gate. Make.com ingests. Salesforce scores, prioritizes, and routes. No layer duplicates another. |
| Deterministic Output | Identical input values always produce identical output — Priority Level and Owner. No subjective assessment. |
| Bulk-Safe Design | Flow logic handles batch Lead creation without violating Salesforce governor limits. |

---

## Core System Components

### Custom Fields — Lead Object

| Field Label | API Name | Type | Purpose |
|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | Scoring dimension 1 |
| Role | `Role__c` | Picklist | Scoring dimension 2 |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | Scoring dimension 3 |
| Lead Score | `Lead_Score__c` | Number | Composite score (3–15) |
| Priority Level | `Priority_Level__c` | Picklist | Assigned priority tier |
| Customer Note | `Customer_Note__c` | Text Area | Prospect-submitted free text |
| Region | `Region__c` | Formula (Text) | Territorial classification derived from `State/Province` |
| Lead Created | `Lead_Created__c` | Formula (Date) | Audit timestamp derived from `CreatedDate` |

### Flow

| Attribute | Value |
|---|---|
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Type | Record-Triggered — After-Save |
| Trigger | Record Created |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| DML Operations | 1 |

### Flow Variables

| Variable | Type | Purpose |
|---|---|---|
| `varTotalScore` | Number | Accumulates weighted dimension scores (3–15) |
| `varPriorityLevel` | Text | Stores assigned Priority Level string |
| `varOwnerID` | Text | Stores `OwnerId` for final DML write |

---

## Repository Structure

```
salesforce-priority-level-automation/
├── README.md
├── Wix_To_CelesteProd_B2B_Lead_Engine_v1 scenario.blueprint.json
│
├── assets/
│   ├── diagrams/
│   │   ├── celeste-flow-logic.png
│   │   ├── celeste-routing-architecture.png
│   │   └── celeste-system-architecture.png
│   ├── exports/
│   └── screenshots/
│       ├── debug-logs/
│       ├── lead-records/
│       ├── make-com/
│       ├── wix/
│       └── salesforce-configuration/
│           ├── assignment-rules/
│           ├── flow/
│           ├── lightning-pages/
│           ├── object-manager/
│           ├── profiles/
│           └── queues/
│
├── docs/
│   ├── document-standards.md
│   ├── repository-structure.md
│   ├── scoring-matrix.md
│   ├── 01-overview/
│   │   ├── business-objective.md
│   │   ├── devorg-constraints-and-ownership-model.md
│   │   ├── project-overview.md
│   │   └── scope-boundaries.md
│   ├── 02-architecture/
│   │   ├── automation-architecture.md
│   │   ├── gatekeeper-logic.md
│   │   ├── routing-architecture.md
│   │   ├── state-management-risk.md
│   │   └── system-architecture.md
│   ├── 03-data-model/
│   │   ├── field-dictionary.md
│   │   ├── field-inventory.md
│   │   ├── priority-thresholds.md
│   │   └── scoring-model.md
│   ├── 04-automation-logic/
│   │   ├── scoring-logic.md
│   │   ├── scoring-matrix.md
│   │   └── territorial-routing-logic.md
│   ├── 05-integration/
│   │   ├── middleware-responsibilities.md
│   │   ├── source-to-lead-mapping.md
│   │   └── wix-make-salesforce-ingestion.md
│   ├── 06-build-assets/
│   │   ├── configuration-checklist.md
│   │   ├── defects.md
│   │   ├── lead-test-records.md
│   │   ├── priority-routing-results.md
│   │   ├── screenshots-index.md
│   │   ├── test-scenarios.md
│   │   ├── uat-matrix.md
│   │   └── uat-session-log.md
│   └── 07-portfolio/
│       ├── case-study-summary.md
│       ├── design-insight-gatekeeper-sequencing.md
│       ├── project-page-copy.md
│       ├── recruiter-readable-summary.md
│       ├── recruiter-summary.md
│       └── resume-bullets.md
│
├── metadata/
│   ├── assignment-rules/
│   │   └── lead-assignment-rules.md
│   ├── custom-fields/
│   │   ├── lead-fields.md
│   │   └── lead-fieldss.md
│   ├── flow-notes/
│   │   └── lead-scoring-and-priority-assignment.md
│   ├── formulas/
│   │   └── priority-formulas.md
│   └── queues/
│       └── queue-definitions.md
│
├── notes/
│   ├── claude-project-instructions.md
│   └── claude-project-instructions.txt
│
├── portfolio/
│   ├── case-study-snippets/
│   ├── recruiter-summary/
│   ├── resume-bullets/
│   └── website-copy/
│
└── test-artifacts/
    ├── defect-log/
    ├── expected-results/
    ├── scenario-inputs/
    └── uat-evidence/
        └── coverage-orbital-matrix.md
```

---

## Operational Status

- Fully implemented and operational in a Salesforce Developer Edition Org
- Integrated end-to-end: Wix → Make.com → Salesforce
- Four canonical Lead Records validate all paths — Priority Level Low, Medium, and High with escalation across all three regional territories
- Documentation produced via reverse documentation from the live system

---

## Developer Edition Org Context

This system is built in a Salesforce Developer Edition org. Two constraints are documented as scope acknowledgments, not gaps.

**Single active user license.** The org supports one Standard User license, assigned to Sophia Delgado. Regional Queues — `East_Coast_Region`, `West_Coast_Region`, `Central_Region` — operate as proof-of-concept ownership placeholders. In a production deployment, each Queue would contain provisioned named users.

**No production sandbox.** All test records, debug logs, and UAT evidence are produced in the Developer Edition org. Sandbox migration procedures are not demonstrated. This does not affect the correctness or completeness of any automation logic documented in this repository.

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
