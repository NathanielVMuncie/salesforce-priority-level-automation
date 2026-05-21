# Automation Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the automation architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes the structural design of the After-Save Record-Triggered Flow — how it is organized, what each tier is responsible for, how the tiers connect, and why the architecture is designed the way it is.

This document covers architecture — the tiers, connections, and design decisions of the Flow as a whole. Element-level configuration details are in `docs/04-automation-logic/scoring-logic.md` and related automation logic documents.

Every Lead Record that enters the flow is a confirmed B2B submission. With a gatekeeper at the Wix form, known in the sales pipeline formally as Céleste Vineyards — Business Inquiry Form, it acts as a barrier keeping all unqualified non-businesses from entering the pipeline and ensuring
only qualified businesses pass through.

---

## 2. Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

---

## 3. Automation Architecture Overview

The Flow is organized into four sequential tiers. Each tier has a defined responsibility and passes execution to the next tier only when its responsibility is complete. No tier executes before its predecessor and no tier is skipped for any Lead that enters the Flow.

After all four tiers complete, the Flow executes the OwnerId escalation logic and commits all results to the Lead Record in a single DML write.

```
Entry Condition Check
(LeadSource = Céleste Vineyards - Business Inquiry Form)
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 1 — Business Type                 │
│  Determine Business Type Score          │
│  (Decision)                             │
│                                         │
│  Scoring Dimension: 1–5 points          │
│  Contributes to varTotalScore           │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 2 — Role                          │
│  Determine Role Score (Decision)        │
│                                         │
│  Scoring Dimension: 1–5 points          │
│  Contributes to varTotalScore           │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 3 — Purchasing Timeline           │
│  Determine Purchasing Timeline Score    │
│  (Decision)                             │
│                                         │
│  Scoring Dimension: 1–5 points          │
│  Contributes to varTotalScore           │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 4 — Priority Level                │
│  Determine Priority Level (Decision)    │
│                                         │
│  Priority Dimension: Low / Medium /     │
│  High → varPriorityLevel                │
│                                         │
│  High → Escalation fires                │
│         varOwnerID = Sophia Delgado     │
│  Medium / Low → varOwnerID retained     │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SINGLE DML WRITE                       │
│  Update Lead Priority and Score         │
│  (Update Records)                       │
│                                         │
│  Writes: OwnerId, Priority_Level__c     │
│  DML Count: 1 of 150                    │
└─────────────────────────────────────────┘
        |
        ▼
       End
```

---

## 4. Tier Definitions

### 4.1 Tier 1 — Business Type

**Responsibility:** Evaluate the `Business_Type__c` field and contribute the corresponding scoring dimension value to `varTotalScore`.

**Elements:** `Determine Business Type Score` (Decision) and its five corresponding Assignment elements

The `Determine Business Type Score` Decision element evaluates `Business_Type__c` against five named outcomes. Each outcome routes to a dedicated Assignment element that adds the dimension score to `varTotalScore` using the Add operator. All five outcomes converge before Tier 2 executes.

The Default Outcome on this Decision element routes the Flow to End. Because every Lead that enters the Flow is a confirmed B2B submission from the Wix form with a valid `Business_Type__c` value, the Default Outcome is a fault-path exit only. It cannot fire under normal pipeline conditions. If it does fire, no scoring occurs, no Priority Level is assigned, and the Lead remains owned by whichever named user the Assignment Rule designated.

| Scoring Dimension | Condition | Points Added to `varTotalScore` |
|---|---|---|
| `Premium Wine Distributor` | `Business_Type__c` Equals `Premium Wine Distributor` | 5 |
| `High-End Wine Store` | `Business_Type__c` Equals `High-End Wine Store` | 4 |
| `Upscale Restaurant` | `Business_Type__c` Equals `Upscale Restaurant` | 3 |
| `Specialty Gourmet Grocer` | `Business_Type__c` Equals `Specialty Gourmet Grocer` | 2 |
| `Catering & Event Company` | `Business_Type__c` Equals `Catering & Event Company` | 1 |
| Default Outcome | No condition matched | Routes to End |

---

### 4.2 Tier 2 — Role

**Responsibility:** Evaluate the `Role__c` field and contribute the corresponding scoring dimension value to `varTotalScore`.

**Elements:** `Determine Role Score` (Decision) and its five corresponding Assignment elements

The `Determine Role Score` Decision element evaluates `Role__c` against five named outcomes. Each outcome routes to a dedicated Assignment element that adds the dimension score to `varTotalScore` using the Add operator. At this point `varTotalScore` already holds the Tier 1 value — the Add operator extends the running total without overwriting it. All five outcomes converge before Tier 3 executes.

| Scoring Dimension | Condition | Points Added to `varTotalScore` |
|---|---|---|
| `Owner` | `Role__c` Equals `Owner` | 5 |
| `Purchasing Manager` | `Role__c` Equals `Purchasing Manager` | 4 |
| `General Manager` | `Role__c` Equals `General Manager` | 3 |
| `Sales Manager` | `Role__c` Equals `Sales Manager` | 2 |
| `Event Coordinator` | `Role__c` Equals `Event Coordinator` | 1 |
| Default Outcome | No condition matched | Routes to End |

---

### 4.3 Tier 3 — Purchasing Timeline

**Responsibility:** Evaluate the `Purchasing_Timeline__c` field and contribute the corresponding scoring dimension value to `varTotalScore`, producing the final composite score.

**Elements:** `Determine Purchasing Timeline Score` (Decision) and its five corresponding Assignment elements

The `Determine Purchasing Timeline Score` Decision element evaluates `Purchasing_Timeline__c` against five named outcomes. Each outcome routes to a dedicated Assignment element that adds the dimension score to `varTotalScore` using the Add operator. At this point `varTotalScore` holds the sum of Tier 1 and Tier 2 values — the Add operator produces the final composite score. All five outcomes converge before Tier 4 executes.

| Scoring Dimension | Condition | Points Added to `varTotalScore` |
|---|---|---|
| `Immediate Need (Contracting)` | `Purchasing_Timeline__c` Equals `Immediate Need (Contracting)` | 5 |
| `Short-Term (Within 30 Days)` | `Purchasing_Timeline__c` Equals `Short-Term (Within 30 Days)` | 4 |
| `Evaluating Vendors (Next 90 Days)` | `Purchasing_Timeline__c` Equals `Evaluating Vendors (Next 90 Days)` | 3 |
| `Budget Planning (Future Quarter)` | `Purchasing_Timeline__c` Equals `Budget Planning (Future Quarter)` | 2 |
| `Information Gathering` | `Purchasing_Timeline__c` Equals `Information Gathering` | 1 |
| Default Outcome | No condition matched | Routes to End |

**Score range after Tier 3:** Minimum 3 — Maximum 15.

---

### 4.4 Tier 4 — Priority Level

**Responsibility:** Map the composite `varTotalScore` to a priority dimension value of `Low`, `Medium`, or `High`, store it in `varPriorityLevel`, and execute escalation logic for Priority Level High Leads.

**Elements:** `Determine Priority Level` (Decision), `Priority Level High` (Assignment), `Priority Level Medium` (Assignment), `Priority Level Low` (Assignment), `Initialize OwnerId (Default)` (Assignment), `Escalate High Priority to Sophia` (Decision), `Set OwnerId to Sophia` (Assignment)

The `Determine Priority Level` Decision evaluates `varTotalScore` against two fixed thresholds. Outcomes are evaluated in order — High first, then Medium, then Low as the Default Outcome. This ordering ensures a score of 12 always resolves to High before the Medium condition is evaluated.

| Priority Dimension | Condition | `varPriorityLevel` Set To |
|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` |
| Medium | `varTotalScore` ≥ 8 | `Medium` |
| Low | Default Outcome | `Low` |

After the priority dimension is assigned, Tier 4 executes the escalation logic. The `Initialize OwnerId (Default)` Assignment element captures `{!$Record.OwnerId}` — the named user assigned by the Lead Assignment Rule — into `varOwnerID`. The `Escalate High Priority to Sophia` Decision then evaluates `varPriorityLevel`. If Priority Level High, `varOwnerID` is overwritten with Sophia Delgado's User ID, escalating ownership to the National Sales Director. If Priority Level Medium or Low, `varOwnerID` retains the named user value from the Assignment Rule.

| Escalation Outcome | Condition | `varOwnerID` Result |
|---|---|---|
| Is High | `varPriorityLevel` Equals `High` | Sophia Delgado User ID |
| Is Not High | Default Outcome | Named user `OwnerId` retained |

All paths converge at the Single DML Write.

---

## 5. Single DML Write

`Update Lead Priority and Score` is the sole Update Records element in the Flow. It executes after all four tiers and the escalation logic complete, and writes two fields to the triggering Lead Record simultaneously.

| Field Label | API Name | Source Variable |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |

**Condition Requirements:** None — Always Update Record.

**DML Count:** 1 of 150 per transaction.

Consolidating all writes into a single Update Records element prevents recursive trigger cycles, contains governor limit exposure within predictable bounds, and ensures the Record is updated atomically at the conclusion of the Flow interview.

---

## 6. Flow Variables

Three variables carry state across all four tiers. Each variable is initialized at Flow start and written by the appropriate tier.

| Variable | Data Type | Default | Written By | Purpose |
|---|---|---|---|---|
| `varTotalScore` | Number | 0 | Tiers 1–3 Assignment elements | Accumulates weighted scoring dimension values |
| `varPriorityLevel` | Text | — | Tier 4 Assignment elements | Stores the assigned priority dimension value |
| `varOwnerID` | Text | — | Tier 4 escalation Assignment elements | Stores the OwnerId to be written at DML |

---

## 7. Entry Condition

The Flow fires exclusively on Lead Records where `LeadSource` equals `Céleste Vineyards - Business Inquiry Form`. Lead Records created through any other mechanism — manual entry, data import, or other integrations — do not trigger this Flow.

This entry condition ensures the automation is scoped to the Wix inquiry form pipeline only and does not interfere with Lead Records originating from other sources.

---

## 8. Queue Role

Queues exist in the org as fault-path catch-alls only. If the Flow exits abnormally — through a Default Outcome in Tiers 1, 2, or 3 — the Lead remains owned by whichever value the Assignment Rule wrote at Record creation. Under normal operating conditions no Lead is ever owned by a Queue at the conclusion of the pipeline. Named users are the intended and actual owners on every correctly processed Lead Record.

---

## 9. Element Count

The Flow contains 25 elements across all four tiers and the Single DML Write.

| Category | Element Type | Count |
|---|---|---|
| Decision elements | Decision | 4 |
| Scoring Assignment elements | Assignment | 15 |
| Priority Level Assignment elements | Assignment | 3 |
| `OwnerId` Assignment elements | Assignment | 2 |
| Update Records element | Update Records | 1 |
| **Total** | | **25** |

---

## 10. Governor Limit Exposure

| Resource | Used | Limit | Notes |
|---|---|---|---|
| DML Statements | 1 | 150 | Single Update Records element — all writes consolidated |
| DML Rows | 1 | 10,000 | One triggering Lead Record updated per Flow interview |

The Single-DML pattern keeps this Flow well within governor limits under any volume of Lead creation, including bulk API operations from Make.com.

---

## 11. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/automation-architecture.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
