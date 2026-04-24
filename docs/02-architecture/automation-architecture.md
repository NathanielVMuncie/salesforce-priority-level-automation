# Automation Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the automation architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes the structural design of the After-Save Record-Triggered Flow — how it is organized, what each segment is responsible for, how the segments connect, and why the architecture is designed the way it is.

This document covers architecture — the segments, connections, and design decisions of the Flow as a whole. Element-level configuration details are in `docs/04-automation-logic/scoring-logic.md` and related automation logic documents.

Every Lead Record that enters the Flow is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any data is transmitted. No qualification logic, qualification fields, or disqualification paths exist in this Flow.

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

The Flow is organized into four sequential segments. Each segment has a defined responsibility and passes execution to the next segment only when its responsibility is complete. No segment executes before its predecessor and no segment is skipped for any Lead that enters the Flow.

```
Entry Condition Check
(LeadSource = Céleste Vineyards - Business Inquiry Form)
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 1 — Weighted Scoring           │
│  Determine Business Type Score          │
│  (Decision)                             │
│  Determine Role Score (Decision)        │
│  Determine Purchasing Timeline Score    │
│  (Decision)                             │
│                                         │
│  Accumulates varTotalScore (3–15)       │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 2 — Priority Assignment        │
│  Determine Priority Level (Decision)    │
│                                         │
│  High / Medium / Low → varPriorityLevel │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 3 — Escalation                 │
│  Initialize OwnerId (Default)           │
│  Escalate High Priority to Sophia       │
│  (Decision)                             │
│                                         │
│  Priority Level High → varOwnerID =     │
│                        Sophia Delgado   │
│  Medium / Low → varOwnerID retained     │
└─────────────────────────────────────────┘
        |
        ▼
┌─────────────────────────────────────────┐
│  SEGMENT 4 — Single DML Write           │
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

## 4. Segment Definitions

### 4.1 Segment 1 — Weighted Scoring

**Responsibility:** Calculate the composite Priority Score by evaluating all three scoring dimensions and accumulating their point values into `varTotalScore`.

**Elements:** `Determine Business Type Score` (Decision), `Determine Role Score` (Decision), `Determine Purchasing Timeline Score` (Decision), and their corresponding Assignment elements

Segment 1 executes three Decision elements in sequence. Each evaluates one scoring Field, routes to a dedicated Assignment element that adds the dimension score to `varTotalScore` using the Add operator, and converges before the next Decision element executes. At the conclusion of Segment 1, `varTotalScore` holds the complete composite score — the sum of all three dimension scores.

Every Lead that enters the Flow carries valid B2B values in `Business_Type__c`, `Role__c`, and `Purchasing_Timeline__c`. The Default Outcome in each Decision element is a defensive backstop only — it cannot fire under normal pipeline conditions.

| Dimension | Field | Decision Element | Score Range |
|---|---|---|---|
| Business Type | `Business_Type__c` | `Determine Business Type Score` | 1–5 |
| Role | `Role__c` | `Determine Role Score` | 1–5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | `Determine Purchasing Timeline Score` | 1–5 |
| **Total** | | | **3–15** |

---

### 4.2 Segment 2 — Priority Assignment

**Responsibility:** Map the composite `varTotalScore` to a Priority Level and store it in `varPriorityLevel`.

**Elements:** `Determine Priority Level` (Decision), `High` (Assignment), `Medium` (Assignment), `Low` (Assignment)

The `Determine Priority Level` Decision evaluates `varTotalScore` against two fixed thresholds. Outcomes are evaluated in order — High first, then Medium, then Low as the Default Outcome. This ordering ensures a score of 12 always resolves to High before the Medium condition is evaluated.

| Outcome | Condition | `varPriorityLevel` Set To |
|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` |
| Medium | `varTotalScore` ≥ 8 | `Medium` |
| Low | Default Outcome | `Low` |

All three Assignment elements converge at Segment 3.

---

### 4.3 Segment 3 — Escalation

**Responsibility:** Determine the final `OwnerId` value by either retaining the regional Queue `OwnerId` or overriding it with Sophia Delgado's User ID based on Priority Level.

**Elements:** `Initialize OwnerId (Default)` (Assignment), `Escalate High Priority to Sophia` (Decision), `Set OwnerId to Sophia` (Assignment)

Segment 3 begins with the `Initialize OwnerId (Default)` Assignment element, which captures `{!$Record.OwnerId}` into `varOwnerID`. At this point in execution, the Lead Assignment Rule has already fired and the Record's `OwnerId` holds the regional Queue ID. This capture establishes the default ownership baseline.

The `Escalate High Priority to Sophia` Decision then evaluates `varPriorityLevel`. If Priority Level High, `varOwnerID` is overwritten with Sophia Delgado's User ID. If Priority Level Medium or Low, `varOwnerID` retains the regional Queue value.

| Outcome | Condition | `varOwnerID` Result |
|---|---|---|
| Is High | `varPriorityLevel` Equals `High` | Sophia Delgado User ID |
| Is Not High | Default Outcome | Regional Queue `OwnerId` retained |

Both paths converge at Segment 4.

---

### 4.4 Segment 4 — Single DML Write

**Responsibility:** Commit all automation results to the Lead Record in a single DML operation.

**Elements:** `Update Lead Priority and Score` (Update Records)

`Update Lead Priority and Score` is the sole Update Records element in the Flow. It executes after all four segments of logic are complete and writes two Fields to the triggering Lead Record simultaneously.

| Field Label | API Name | Source Variable |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |

**Condition Requirements:** None — Always Update Record.

**DML Count:** 1 of 150 per transaction.

Consolidating all writes into a single Update Records element prevents recursive trigger cycles, contains governor limit exposure within predictable bounds, and ensures the Record is updated atomically at the conclusion of the Flow interview.

---

## 5. Flow Variables

Three variables carry state across segments. Each variable is initialized at Flow start and written by the appropriate segment.

| Variable | Data Type | Default | Written By | Purpose |
|---|---|---|---|---|
| `varTotalScore` | Number | 0 | Segment 1 Assignment elements | Accumulates weighted dimension scores |
| `varPriorityLevel` | Text | — | Segment 2 Assignment elements | Stores the assigned Priority Level string |
| `varOwnerID` | Text | — | Segment 3 Assignment elements | Stores the OwnerId to be written at DML |

---

## 6. Entry Condition

The Flow fires exclusively on Lead Records where `LeadSource` equals `Céleste Vineyards - Business Inquiry Form`. Lead Records created through any other mechanism — manual entry, data import, or other integrations — do not trigger this Flow.

This entry condition ensures the automation is scoped to the Wix inquiry form pipeline only and does not interfere with Lead Records originating from other sources.

---

## 7. Element Count

The Flow contains 24 elements across all four segments.

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
