# Automation Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the automation architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes the structural design of the After-Save Record-Triggered Flow — how it is organized, what each tier is responsible for, how the tiers connect, and why the architecture is designed the way it is.

This document covers architecture — the tiers, connections, and design decisions of the Flow as a whole. Element-level configuration details are in `docs/04-automation-logic/scoring-logic.md` and related automation logic documents.

Every Lead Record that enters the Flow is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any data is transmitted, which means every Lead that triggers the Flow already carries valid B2B values across all three scoring fields. No qualification logic, qualification fields, or disqualification paths exist in this Flow.

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
| Version | V25 |
| Status | Active |

---

## 3. Automation Architecture Overview

The Flow is organized into four sequential tiers. Each tier has a defined responsibility and passes execution to the next tier only when its responsibility is complete. No tier executes before its predecessor and no tier is skipped for any Lead that enters the Flow.

```
Entry Condition Check
(LeadSource = Céleste Vineyards - Business Inquiry Form)
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 1 — Business Type Score           │
│  Determine Business Type Score          │
│  (Decision)                             │
│                                         │
│  Scoring dimension: 1–5 pts             │
│  Adds to varTotalScore                  │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 2 — Role Score                    │
│  Determine Role Score (Decision)        │
│                                         │
│  Scoring dimension: 1–5 pts             │
│  Adds to varTotalScore                  │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 3 — Purchasing Timeline Score     │
│  Determine Purchasing Timeline Score    │
│  (Decision)                             │
│                                         │
│  Scoring dimension: 1–5 pts             │
│  Adds to varTotalScore                  │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  TIER 4 — Priority Level and Escalation │
│  Determine Priority Level (Decision)    │
│  Initialize OwnerId (Assignment)        │
│  Escalate High Priority to Sophia       │
│  (Decision)                             │
│  Update Lead Priority and Score         │
│  (Update Records)                       │
│                                         │
│  Priority dimension: High/Medium/Low    │
│  High → varOwnerID = Sophia Delgado     │
│  Medium/Low → varOwnerID retained       │
│  Single DML write — OwnerId,            │
│  Priority_Level__c                      │
└─────────────────────────────────────────┘
        |
        ▼
       End
```

---

## 4. Tier Definitions

### 4.1 Tier 1 — Business Type Score

**Responsibility:** Evaluate `Business_Type__c` and add its scoring dimension value to `varTotalScore`.

**Elements:** `Determine Business Type Score` (Decision) and five corresponding Assignment elements

`Determine Business Type Score` evaluates `Business_Type__c` and routes to a dedicated Assignment element for each of the five qualified picklist values. Each Assignment element adds that tier's point value to `varTotalScore` using the Add operator. All five outcomes converge before Tier 2 executes.

Every Lead that enters the Flow carries a valid B2B `Business_Type__c` value. The Default Outcome is a defensive backstop only — it cannot fire under normal pipeline conditions.

| Scoring Dimension | Field | Decision Element | Score Range |
|---|---|---|---|
| Business Type | `Business_Type__c` | `Determine Business Type Score` | 1–5 |

---

### 4.2 Tier 2 — Role Score

**Responsibility:** Evaluate `Role__c` and add its scoring dimension value to `varTotalScore`.

**Elements:** `Determine Role Score` (Decision) and five corresponding Assignment elements

`Determine Role Score` evaluates `Role__c` and routes to a dedicated Assignment element for each of the five picklist values. Each Assignment element adds that tier's point value to `varTotalScore` using the Add operator. At the point Tier 2 executes, `varTotalScore` already holds the Tier 1 value — the Add operator extends the running total. All five outcomes converge before Tier 3 executes.

| Scoring Dimension | Field | Decision Element | Score Range |
|---|---|---|---|
| Role | `Role__c` | `Determine Role Score` | 1–5 |

---

### 4.3 Tier 3 — Purchasing Timeline Score

**Responsibility:** Evaluate `Purchasing_Timeline__c` and add its scoring dimension value to `varTotalScore`, producing the final composite score.

**Elements:** `Determine Purchasing Timeline Score` (Decision) and five corresponding Assignment elements

`Determine Purchasing Timeline Score` evaluates `Purchasing_Timeline__c` and routes to a dedicated Assignment element for each of the five picklist values. Each Assignment element adds that tier's point value to `varTotalScore` using the Add operator. At the point Tier 3 executes, `varTotalScore` holds the sum of Tier 1 and Tier 2 values — the Add operator produces the final composite score. All five outcomes converge before Tier 4 executes.

| Scoring Dimension | Field | Decision Element | Score Range |
|---|---|---|---|
| Purchasing Timeline | `Purchasing_Timeline__c` | `Determine Purchasing Timeline Score` | 1–5 |

**varTotalScore after all three scoring tiers:**

| After | `varTotalScore` Holds |
|---|---|
| Tier 1 completes | Business Type score (1–5) |
| Tier 2 completes | Business Type + Role score (2–10) |
| Tier 3 completes | Business Type + Role + Purchasing Timeline score (3–15) |

---

### 4.4 Tier 4 — Priority Level and Escalation

**Responsibility:** Map `varTotalScore` to a Priority Level, determine final `OwnerId`, and commit all results to the Lead Record in a single DML write.

**Elements:** `Determine Priority Level` (Decision), `Priority Level High` / `Priority Level Medium` / `Priority Level Low` (Assignment), `Initialize OwnerId (Default)` (Assignment), `Escalate High Priority to Sophia` (Decision), `Escalate OwnerId to Sophia` (Assignment), `Update Lead Priority and Score` (Update Records)

Tier 4 contains the priority dimension and the escalation logic that is its direct downstream consequence. It executes in three steps.

**Step 1 — Priority dimension.** `Determine Priority Level` evaluates `varTotalScore` against two fixed thresholds. Outcomes are evaluated in order — `High` first, then `Medium`, then `Low` as the Default Outcome. This ordering ensures a score of 12 always resolves to `High` before the `Medium` condition is evaluated. The matched Assignment element writes the Priority Level string to `varPriorityLevel`.

| Outcome | Condition | `varPriorityLevel` Set To |
|---|---|---|
| `Is Priority Level High` | `varTotalScore` ≥ 12 | `High` |
| `Is Priority Level Medium` | `varTotalScore` ≥ 8 | `Medium` |
| `Is Priority Level Low` | Default Outcome | `Low` |

**Step 2 — Escalation.** All three Priority Level Assignment elements converge at `Initialize OwnerId (Default)`, which captures `{!$Record.OwnerId}` — the named user's ID written by the Assignment Rule — into `varOwnerID`. The `Escalate High Priority to Sophia` Decision then evaluates `varPriorityLevel`. If Priority Level `High`, `varOwnerID` is overwritten with Sophia Delgado's User ID. If Priority Level `Medium` or `Low`, `varOwnerID` retains the named user's ID.

| Outcome | Condition | `varOwnerID` Result |
|---|---|---|
| `Is High - Escalate` | `varPriorityLevel` Equals `High` | Sophia Delgado User ID |
| `Is Not High` | Default Outcome | Named user's ID retained |

**Step 3 — Single DML write.** Both escalation paths converge at `Update Lead Priority and Score`, the sole Update Records element in the Flow. It writes two fields to the triggering Lead Record simultaneously.

| Field Label | API Name | Source Variable |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |

**Condition Requirements:** None — Always Update Record.

**DML Count:** 1 of 150 per transaction.

Consolidating all writes into a single Update Records element prevents recursive trigger cycles, contains governor limit exposure within predictable bounds, and ensures the Record is updated atomically at the conclusion of the Flow interview.

---

## 5. Flow Variables

Three variables carry state across all four tiers. Each variable is initialized at Flow start and written by the appropriate tier.

| Variable | Data Type | Default | Written By | Purpose |
|---|---|---|---|---|
| `varTotalScore` | Number | 0 | Tiers 1–3 Assignment elements | Accumulates the composite score across all three scoring tiers |
| `varPriorityLevel` | Text | — | Tier 4 Priority Level Assignment elements | Stores the assigned Priority Level string |
| `varOwnerID` | Text | — | Tier 4 Escalation Assignment elements | Stores the OwnerId to be written at DML |

---

## 6. Entry Condition

The Flow fires exclusively on Lead Records where `LeadSource` equals `Céleste Vineyards - Business Inquiry Form`. Make.com hardcodes this value on every Lead Record it creates. Lead Records created through any other mechanism — manual entry, data import, or other integrations — do not trigger this Flow.

This entry condition ensures the automation is scoped to the Wix inquiry form pipeline only and does not interfere with Lead Records originating from other sources.

---

## 7. Element Count

| Category | Element Type | Count |
|---|---|---|
| Decision elements | Decision | 4 |
| Scoring Assignment elements | Assignment | 15 |
| Priority Level Assignment elements | Assignment | 3 |
| `OwnerId` Assignment elements | Assignment | 2 |
| Update Records element | Update Records | 1 |
| **Total** | | **25** |

---

## 8. Governor Limit Exposure

| Resource | Used | Limit | Notes |
|---|---|---|---|
| DML Statements | 1 | 150 | Single Update Records element — all writes consolidated |
| DML Rows | 1 | 10,000 | One triggering Lead Record updated per Flow interview |

The Single-DML pattern keeps this Flow well within governor limits under any volume of Lead creation, including bulk API operations from Make.com.

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/automation-architecture.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
