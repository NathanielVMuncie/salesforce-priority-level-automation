# Routing Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document defines the complete routing architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes how Lead Records are owned at the point of creation, how the Assignment Rule and Flow escalation logic interact to determine final ownership, and how the system ensures every Lead Record exits the pipeline with a correct and deliberate owner assignment.

This document covers architecture — the structural decisions, component interactions, and ownership outcomes. Component-level configuration details are documented in `territorial-routing-logic.md`, `escalation-logic.md`, and `queue-definitions.md`.

---

## 2. Routing Architecture Overview

Lead ownership is determined by two components operating in sequence: the Lead Assignment Rule and the After-Save Flow. These two components do not conflict — they are designed to work together. The Assignment Rule establishes the default territorial ownership. The Flow either preserves or overrides that ownership based on Priority Level.

```
Lead Record Created (Make.com API Call)
        |
        ▼
Lead Assignment Rule Fires
(Evaluates State/Province → Assigns Regional Queue)
        |
        ▼
After-Save Flow Fires
(Evaluates Priority Level → Retains or Overrides OwnerId)
        |
        ▼
Update Records — Single DML Write
(Commits OwnerId, Priority_Level__c, Qualified__c)
        |
        ▼
Lead Record Owned by:
  ┌─────────────────────────────────────────────┐
  │  High Priority  →  Sophia Delgado           │
  │  Medium Priority  →  Regional Queue         │
  │  Low Priority  →  Regional Queue            │
  │  Disqualified  →  Regional Queue            │
  └─────────────────────────────────────────────┘
```

---

## 3. Component Responsibilities

### 3.1 Lead Assignment Rule

The Lead Assignment Rule is responsible for territorial ownership. It evaluates the `State/Province` Field on the Lead Record and assigns the Record to the correct regional Queue based on geographic territory.

| Responsibility | Detail |
|---|---|
| Fires on | Lead Record creation |
| Evaluates | `State/Province` Field |
| Output | Regional Queue OwnerId written to Record |
| Scope | All Lead Records — qualified, disqualified, and all Priority Levels |
| Awareness of Priority Level | None — the Assignment Rule does not evaluate Priority Level |

The Assignment Rule fires before the Flow. At the point the Flow begins executing, the Lead Record is already owned by the correct regional Queue.

### 3.2 After-Save Flow — Escalation Logic

The Flow is responsible for priority-based ownership override. After scoring and Priority Level assignment are complete, the Flow evaluates whether the assigned Priority Level requires escalation. If the Priority Level is High, the Flow overwrites the regional Queue OwnerId with Sophia Delgado's User ID. If the Priority Level is Medium or Low, the regional Queue OwnerId is retained unchanged.

| Responsibility | Detail |
|---|---|
| Fires on | Lead Record creation — After-Save |
| Evaluates | `varPriorityLevel` (after scoring is complete) |
| Output | `varOwnerID` set to Sophia Delgado (High) or retained as regional Queue (Medium / Low) |
| Scope | Qualified Leads only — disqualified Leads exit the Flow before escalation logic executes |
| Awareness of Territory | Indirect — captures regional Queue OwnerId via `{!$Record.OwnerId}` before evaluating escalation |

---

## 4. Ownership Determination Sequence

The following sequence defines exactly how ownership is determined for every Lead Record that enters the system.

| Step | Component | Action | Record State After Step |
|---|---|---|---|
| 1 | Make.com | Creates Lead Record via API | Record exists — OwnerId is the creating user or default |
| 2 | Assignment Rule | Evaluates `State/Province` — assigns regional Queue | OwnerId = Regional Queue |
| 3 | Flow — Gatekeeper | Evaluates `Business_Type__c` — qualifies or disqualifies | Qualified: continues. Disqualified: Flow exits — OwnerId remains Regional Queue |
| 4 | Flow — Scoring | Calculates `varTotalScore` across three Dimensions | Score accumulated in `varTotalScore` |
| 5 | Flow — Priority Assignment | Maps `varTotalScore` to Priority Level | `varPriorityLevel` set to High, Medium, or Low |
| 6 | Flow — OwnerId Initialization | Captures `{!$Record.OwnerId}` into `varOwnerID` | `varOwnerID` = Regional Queue OwnerId |
| 7 | Flow — Escalation Decision | Evaluates `varPriorityLevel` | High: `varOwnerID` overwritten with Sophia Delgado User ID. Medium / Low: `varOwnerID` unchanged |
| 8 | Flow — Update Records | Writes `OwnerId`, `Priority_Level__c`, `Qualified__c` in single DML | Record ownership committed — pipeline complete |

---

## 5. Ownership Outcomes by Path

Every Lead Record that enters the system exits with one of four ownership states. The table below maps each path to its final ownership outcome.

| Path | Condition | Final OwnerId | Priority_Level__c | Qualified__c |
|---|---|---|---|---|
| Qualified — High | Score ≥ 12 | Sophia Delgado | High | True |
| Qualified — Medium | Score 8–11 | Regional Queue | Medium | True |
| Qualified — Low | Score 3–7 | Regional Queue | Low | True |
| Disqualified | Business_Type__c = Personal/Individual (Non-Business) | Regional Queue | Not Applicable | False |

---

## 6. Region__c Field — Preserved Across All Paths

The `Region__c` Field is written by the Assignment Rule and reflects the Lead's geographic territory. It is not touched by the Flow under any circumstances. This means:

- A High priority Lead owned by Sophia Delgado still carries the correct `Region__c` value for the territory the Lead originated from.
- A Disqualified Lead owned by a regional Queue carries the correct `Region__c` value.
- `Region__c` is always reliable as a territorial classification Field regardless of who owns the Record.

This design preserves regional pipeline visibility for reporting purposes even when escalation overrides Queue ownership.

---

## 7. Routing Architecture — Design Decisions

### 7.1 Why the Assignment Rule Fires Before the Flow

Salesforce executes Lead Assignment Rules synchronously at record creation, before After-Save Flow logic runs. This sequencing is native platform behavior. The system design leverages this behavior deliberately — the Assignment Rule establishes the territorial Queue OwnerId first, and the Flow reads that value via `{!$Record.OwnerId}` to use as the default before evaluating escalation.

This means the Flow does not need to contain territory evaluation logic. Territory is handled entirely by the Assignment Rule. The Flow only needs to decide whether to keep or override the value the Assignment Rule already set.

### 7.2 Why Disqualified Leads Receive a Queue Assignment

Disqualified Leads exit the Flow at the Gatekeeper Decision before any escalation logic executes. The Assignment Rule has already routed the Record to the correct regional Queue at that point, and the Flow does not override it. This is intentional — disqualified Leads should still be geographically classified and owned by a regional Queue for visibility and follow-up purposes, even though they carry no Priority Level.

### 7.3 Why OwnerId Is Written by the Flow, Not the Assignment Rule Alone

For Medium and Low priority Leads, the Assignment Rule's Queue assignment is the final ownership state — the Flow retains it. For High priority Leads, the Flow must override it. Writing `OwnerId` through the Flow's Update Records element ensures the Single-DML pattern is maintained — all Field writes occur in one operation, including the ownership override.

---

## 8. Live Validation — Ownership Outcomes Confirmed

| Lead | Priority Level | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|---|
| Richard Miranda | Low | East_Coast_Region (Inava) | No | Inava (East_Coast_Region) |
| Dylan Moss | Not Applicable | Central_Region (pdesa) | No | pdesa (Central_Region) |
| Neil Thompson | High | West_Coast_Region (jchen) | Yes — Sophia Delgado | Sophia Delgado |

All three routing paths — qualified Low, disqualified, and qualified High with escalation — confirmed operational on live Lead Records.

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | docs/02-architecture/routing-architecture.md |
| Date Produced | 2026-03-22 |
| Next Document | docs/02-architecture/automation-architecture.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
