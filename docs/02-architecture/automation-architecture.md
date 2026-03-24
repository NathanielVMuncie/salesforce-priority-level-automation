# Automation Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 3 — Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document defines the automation architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes the structural design of the After-Save Record-Triggered Flow — how it is organized, what each segment is responsible for, how the segments connect, and why the architecture is designed the way it is.

This document covers architecture — the segments, connections, and design decisions of the Flow as a whole. Element-level configuration details are documented in `lead-scoring-and-priority-assignment.md`. Logic-level documentation for individual components is in the Phase 2 automation logic documents.

---

## 2. Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| Version | V7 |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

---

## 3. Automation Architecture Overview

The Flow is organized into five sequential segments. Each segment has a defined responsibility and passes execution to the next segment only when its responsibility is complete. No segment executes before its predecessor and no segment is skipped for qualified Leads.

```
Entry Condition Check
(LeadSource = Céleste Vineyards - Business Inquiry Form)
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 1 — Qualification Gate         │
│  Determine Business Type Score          │
│  (Decision — Gatekeeper + BT Score)     │
│                                         │
│  Qualified ──────────────────────────►  │
│  Not Qualified → Set varQualified=False │
│                → End                    │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 2 — Weighted Scoring           │
│  Determine Role Score (Decision)        │
│  Determine Purchasing Timeline Score    │
│  (Decision)                             │
│                                         │
│  Accumulates varTotalScore (3–15)       │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 3 — Priority Assignment        │
│  Determine Priority Level (Decision)    │
│                                         │
│  High / Medium / Low → varPriorityLevel │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 4 — Escalation                 │
│  Initialize OwnerId (Default)           │
│  Escalate High Priority to Sophia       │
│  (Decision)                             │
│                                         │
│  High → varOwnerID = Sophia Delgado     │
│  Medium / Low → varOwnerID retained     │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 5 — Single DML Write           │
│  Update Lead Priority and Score         │
│  (Update Records)                       │
│                                         │
│  Writes: OwnerId, Priority_Level__c,    │
│          Qualified__c                   │
│  DML Count: 1 of 150                   │
└─────────────────────────────────────────┘
        |
        ▼
       End
```

---

## 4. Segment Definitions

### 4.1 Segment 1 — Qualification Gate

**Responsibility:** Determine whether the Lead Record meets minimum qualification criteria before any scoring logic executes.

**Elements:** `Determine Business Type Score` (Decision), `Set Qualification State Disqualified` (Assignment)

The Qualification Gate is the first element in the Flow. It is implemented as a dual-purpose Decision element that simultaneously enforces the qualification gate and assigns the Business Type dimension score for qualified Leads. This design eliminates the need for a separate pre-screening element and keeps the gate and scoring logic in one auditable location.

**Qualified path:** One of five qualified Business Type outcomes executes, the Business Type score is added to `varTotalScore`, and execution passes to Segment 2.

**Not Qualified path:** The Gatekeeper Fail outcome executes, `varQualified` is set to False, and the Flow routes directly to End. No further elements execute.

| Outcome | Condition | Result |
|---|---|---|
| Qualified | `Business_Type__c` matches any qualified picklist value | Business Type score added — continues to Segment 2 |
| Not Qualified | `Business_Type__c` Equals `Personal/Individual (Non-Business)` | `varQualified` = False — Flow exits at End |

---

### 4.2 Segment 2 — Weighted Scoring

**Responsibility:** Calculate the composite Priority Score by evaluating the Role and Purchasing Timeline dimensions and accumulating their point values into `varTotalScore`.

**Elements:** `Determine Role Score` (Decision), `Determine Purchasing Timeline Score` (Decision), and their corresponding Assignment elements

Segment 2 begins after the Business Type score is already in `varTotalScore` from Segment 1. Two additional Decision elements evaluate `Role__c` and `Purchasing_Timeline__c` respectively. Each Decision routes to a dedicated Assignment element that adds the dimension score to `varTotalScore` using the Add operator, preserving the running total.

At the conclusion of Segment 2, `varTotalScore` holds the complete composite score — the sum of all three dimension scores.

| Dimension | Field | Decision Element | Score Range |
|---|---|---|---|
| Business Type | `Business_Type__c` | Determine Business Type Score | 1–5 |
| Role | `Role__c` | Determine Role Score | 1–5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | Determine Purchasing Timeline Score | 1–5 |
| **Total** | | | **3–15** |

**Default Outcome behavior:** If `Role__c` or `Purchasing_Timeline__c` contains a value not matching any defined outcome, the Default Outcome routes the Flow to End. This prevents a partial score from being assigned a Priority Level and written to the Lead Record.

---

### 4.3 Segment 3 — Priority Assignment

**Responsibility:** Map the composite `varTotalScore` to a Priority Level and store it in `varPriorityLevel`.

**Elements:** `Determine Priority Level` (Decision), `High` (Assignment), `Medium Priority` (Assignment), `Low` (Assignment)

The `Determine Priority Level` Decision evaluates `varTotalScore` against two fixed thresholds. Outcomes are evaluated in order — High first, then Medium, then Low as the Default Outcome. This ordering ensures a score of 12 always resolves to High before the Medium condition is evaluated.

| Outcome | Condition | `varPriorityLevel` Set To |
|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` |
| Medium | `varTotalScore` ≥ 8 | `Medium` |
| Low | Default Outcome | `Low` |

All three Assignment elements converge at Segment 4.

---

### 4.4 Segment 4 — Escalation

**Responsibility:** Determine the final OwnerId value by either retaining the regional Queue OwnerId or overriding it with Sophia Delgado's User ID based on Priority Level.

**Elements:** `Initialize OwnerId (Default)` (Assignment), `Escalate High Priority to Sophia` (Decision), `Set OwnerId to Sophia` (Assignment)

Segment 4 begins with the `Initialize OwnerId (Default)` Assignment element, which captures `{!$Record.OwnerId}` into `varOwnerID`. At this point in execution, the Lead Assignment Rule has already fired and the Record's OwnerId holds the regional Queue ID. This capture establishes the default ownership baseline.

The `Escalate High Priority to Sophia` Decision then evaluates `varPriorityLevel`. If High, `varOwnerID` is overwritten with Sophia Delgado's User ID. If Medium or Low, `varOwnerID` retains the regional Queue value.

| Outcome | Condition | `varOwnerID` Result |
|---|---|---|
| Is High | `varPriorityLevel` Equals `High` | Sophia Delgado User ID |
| Is Not High | Default Outcome | Regional Queue OwnerId retained |

Both paths converge at Segment 5.

---

### 4.5 Segment 5 — Single DML Write

**Responsibility:** Commit all automation results to the Lead Record in a single DML operation.

**Elements:** `Update Lead Priority and Score` (Update Records)

`Update Lead Priority and Score` is the sole Update Records element in the Flow. It executes after all five segments of logic are complete and writes three Fields to the triggering Lead Record simultaneously.

| Field Label | API Name | Source Variable |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |
| Qualified | `Qualified__c` | `{!varQualified}` |

**Condition Requirements:** None — Always Update Record.

**DML Count:** 1 of 150 per transaction.

Consolidating all writes into a single Update Records element prevents recursive trigger cycles, contains governor limit exposure within predictable bounds, and ensures the Record is updated atomically at the conclusion of the Flow interview.

---

## 5. Flow Variables

Four variables carry state across segments. Each variable is initialized at Flow start and written by the appropriate segment.

| Variable | Data Type | Default | Written By | Purpose |
|---|---|---|---|---|
| `varTotalScore` | Number | 0 | Segment 2 Assignment elements | Accumulates weighted dimension scores |
| `varPriorityLevel` | Text | — | Segment 3 Assignment elements | Stores the assigned Priority Level string |
| `varOwnerID` | Text | — | Segment 4 Assignment elements | Stores the OwnerId to be written at DML |
| `varQualified` | Boolean | True | Segment 1 (disqualified path only) | Flags qualification state for DML write |

---

## 6. Entry Condition

The Flow fires exclusively on Lead Records where `LeadSource` equals `Céleste Vineyards - Business Inquiry Form`. Lead Records created through any other mechanism — manual entry, data import, or other integrations — do not trigger this Flow.

This entry condition ensures the automation is scoped to the Wix inquiry form pipeline only and does not interfere with Lead Records originating from other sources.

---

## 7. Element Count

The Flow contains 27 elements across all five segments.

| Category | Element Type | Count |
|---|---|---|
| Decision elements | Decision | 5 |
| Scoring Assignment elements | Assignment | 15 |
| Priority Level Assignment elements | Assignment | 3 |
| Gatekeeper disqualification Assignment | Assignment | 1 |
| OwnerId Assignment elements | Assignment | 2 |
| Update Records element | Update Records | 1 |
| **Total** | | **27** |

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
| Status | Final |
| Phase | 3 — Routing, Escalation, and Ownership |
| File Path | docs/02-architecture/automation-architecture.md |
| Date Produced | 2026-03-22 |
| Next Document | docs/06-build-assets/test-scenarios.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
