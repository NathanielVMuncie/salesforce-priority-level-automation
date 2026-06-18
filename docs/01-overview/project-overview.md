# Project Overview

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document provides a top-level orientation to the Céleste Vineyards Lead Priority Level Automation system. It defines what the system is, what it does, the technologies it spans, the personnel it involves, and where each component is documented in this repository.

This document is the correct starting point for anyone reviewing this case study. Detailed specifications for each layer of the system are found in the component documents linked throughout.

---

## 2. Project Summary

The Céleste Vineyards Lead Priority Level Automation system is a fully automated, end-to-end B2B Lead intake, scoring, and routing pipeline. It spans three platforms — Wix, Make.com, and Salesforce Sales Cloud — and executes without manual intervention from the moment a prospect submits the inquiry form through to Lead owner assignment in Salesforce.

The system solves a specific operational failure: Céleste Vineyards had no standardized intake process, no mechanism for distinguishing high-value Leads from low-value ones at the point of contact, and no territorial routing logic. Leads arrived through uncontrolled channels, were routed by individual judgment, and were lost with structural inevitability when that judgment chain failed. This system replaces all of it.

Every inbound B2B Lead now receives a composite Priority Score across three dimensions, is assigned a Priority Level of `High`, `Medium`, or `Low` at the moment of creation, and is routed to the correct owner — the National Sales Director for Priority Level High, or the correct regional Sales Representative for Priority Level Medium and Low — with zero manual steps required.

---

## 3. Technology Stack

| Platform | Role | Component |
|---|---|---|
| Wix | Gatekeeper and intake | B2B inquiry form with conditional display logic |
| Make.com | Middleware | `Wix_Inquiry_To_Salesforce_Lead` scenario |
| Salesforce Sales Cloud | CRM and automation | Lead Object, Assignment Rule, After-Save Flow |

---

## 4. Pipeline Architecture

The system is a linear, event-driven pipeline with a defined entry point, a fixed execution sequence, and a defined termination point.

```
[WIX]
Gatekeeper — blocks Personal/Individual (Non-Business)
Form submission → Wix Automation fires → payload to Make.com
        |
        ▼
[MAKE.COM]
Custom Webhook receives payload
Field normalization (phone format)
Salesforce Create Record via API
        |
        ▼
[SALESFORCE]
Lead Record created
Assignment Rule fires → regional Sales Representative assigned
After-Save Flow fires
  Tier 1 — Business Type Score (1–5)
  Tier 2 — Role Score (1–5)
  Tier 3 — Purchasing Timeline Score (1–5)
  Priority Level assigned (High / Medium / Low)
  Escalation check — Priority Level High → Sophia Delgado
Single DML write — OwnerId and Priority_Level__c committed
        |
        ▼
Lead owned by correct Sales Representative or Sophia Delgado
```

The Gatekeeper is the outermost boundary of the system. It operates entirely within the Wix form before any submission occurs. Every Lead Record that exists in Salesforce is a confirmed B2B submission by definition. No qualification fields, qualification variables, or disqualification paths exist anywhere in Make.com or Salesforce.

Full architecture documentation: `docs/02-architecture/system-architecture.md`

---

## 5. Component Summary

### 5.1 Wix — Gatekeeper and Intake

The Wix B2B inquiry form is the sole intake channel for inbound Leads. The Business Type dropdown is the first field on the form. When `Personal/Individual (Non-Business)` is selected, the form immediately collapses — all remaining fields are hidden, the submit control is disabled, and a message renders informing the prospect that Céleste Vineyards operates on a strictly B2B model. The Wix Automation never fires. No payload is transmitted. The prospect exits at the Wix layer with no record created anywhere in the pipeline.

When any B2B business type is selected, the form remains active. On submission, Wix Automation `WA_Inquiry_To_Make` — via action `POST_WH_Wix_Inquiry_To_Make` — transmits the payload to Make.com.

Documentation: `docs/02-architecture/gatekeeper-logic.md`

### 5.2 Make.com — Middleware

The Make.com scenario `Wix_Inquiry_To_Salesforce_Lead` is a single-path, two-module pipeline. The `WH_Wix_Inquiry_To_Make` Custom Webhook module receives the B2B payload from Wix. The `SF_Make_Lead_To_Salesforce` Salesforce Create Record module normalizes the phone field, maps all payload keys to Salesforce Lead field API names, hardcodes `LeadSource` as `Céleste Vineyards — Business Inquiry Form`, and creates the Lead Record via the Salesforce REST API.

Make.com has no awareness of scoring, priority assignment, or routing logic. It is the data conduit between Wix and Salesforce.

Documentation: `docs/05-integration/middleware-responsibilities.md`

### 5.3 Salesforce — Assignment Rule

The Lead Assignment Rule fires at Record creation. It evaluates the `State/Province` field and assigns the Lead to the correct regional Sales Representative across three territories: East Coast, West Coast, and Central. All 50 US states and the District of Columbia are covered.

In the DevOrg environment, a single Standard User license constraint means only one named Sales Representative holds direct ownership at a time. The remaining regions are covered by their corresponding Queue as a proxy. This is a DevOrg constraint, not a design gap. In a production org, all representatives hold provisioned licenses simultaneously.

Documentation: `docs/04-automation-logic/territorial-routing-logic.md`

### 5.4 Salesforce — After-Save Flow

The `Lead_Scoring_and_Priority_Level_Assignment` Flow is a Record-Triggered After-Save Flow that fires on Lead creation when `LeadSource` equals `Céleste Vineyards — Business Inquiry Form`. It executes four segments in a fixed sequence:

**Segment 1 — Weighted Scoring.** Three Decision elements evaluate `Business_Type__c`, `Role__c`, and `Purchasing_Timeline__c` in sequence. Each contributes 1–5 points to `varTotalScore`. Score range: 3–15.

**Segment 2 — Priority Assignment.** `varTotalScore` is evaluated against fixed thresholds. Scores ≥ 12 assign `High`. Scores ≥ 8 assign `Medium`. All remaining scores assign `Low`. The result is stored in `varPriorityLevel`.

**Segment 3 — Escalation.** The regional Queue `OwnerId` written by the Assignment Rule is captured into `varOwnerID`. If `varPriorityLevel` equals `High`, `varOwnerID` is overridden with Sophia Delgado's User ID. Priority Level Medium and Low Leads retain the regional Queue value.

**Segment 4 — Single DML Write.** The `Update Lead Priority and Score` Update Records element commits `OwnerId` and `Priority_Level__c` to the Lead Record in a single DML operation.

Documentation: `docs/04-automation-logic/scoring-logic.md`, `docs/02-architecture/automation-architecture.md`

---

## 6. Personnel

### 6.1 Escalation Target

| Name | Title | Role in System |
|---|---|---|
| Sophia Delgado | National Sales Director | Receives all Priority Level High Leads via Flow escalation override |

Sophia Delgado's assignment is triggered by Priority Level — not territory. She receives Priority Level High Leads from all regions.

### 6.2 Regional Sales Representatives

| Name | Region | Queue |
|---|---|---|
| Luis Navarro | East Coast | `East_Coast_Region` |
| Priya Desai | Central | `Central_Region` |
| Jordan Chen | West Coast | `West_Coast_Region` |

Each representative is the design-intent owner for Priority Level Medium and Low Leads in their territory. The corresponding Queue serves as a proxy when the representative does not hold the active license in the DevOrg environment.

---

## 7. Scoring Model Summary

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

Priority Level reflects the composite commercial value of the Lead across all three scoring dimensions. It is not a measure of urgency alone.

Full scoring documentation: `docs/03-data-model/scoring-model.md`, `docs/04-automation-logic/scoring-logic.md`

---

## 8. Repository Navigation

| Folder | Contents |
|---|---|
| `docs/01-overview/` | Business objective, scope boundaries, DevOrg constraints, this file |
| `docs/02-architecture/` | System architecture, automation architecture, gatekeeper logic, state management risk |
| `docs/03-data-model/` | Field inventory, field dictionary, scoring model, priority thresholds, formula definitions |
| `docs/04-automation-logic/` | Scoring logic, territorial routing logic, queue definitions |
| `docs/05-integration/` | Middleware responsibilities |
| `docs/06-build-assets/` | Lead test records, coverage validation matrix |
| `docs/07-portfolio/` | Portfolio-facing summary materials |
| `test-artifacts/` | UAT session log, defect log, screenshots index |
| `metadata/` | SFDX-retrieved org metadata |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/project-overview.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
