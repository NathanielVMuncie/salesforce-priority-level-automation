# Routing Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the complete routing architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes how Lead Records are owned at the point of creation, how the Assignment Rule and Flow escalation logic interact to determine final ownership, and how the system ensures every Lead Record exits the pipeline with a correct and deliberate owner assignment.

This document covers architecture — the structural decisions, component interactions, and ownership outcomes. Component-level configuration details are documented in `docs/04-automation-logic/territorial-routing-logic.md` and `docs/04-automation-logic/escalation-logic.md`.

Every Lead Record that enters the routing pipeline is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer. No non-business Lead Record exists in Salesforce.

---

## 2. Routing Architecture Overview

Lead ownership is determined by two components operating in sequence: the Lead Assignment Rule and the After-Save Flow. These two components do not conflict — they are designed to work together. The Assignment Rule establishes the default territorial ownership. The Flow either preserves or overrides that ownership based on Priority Level.

```
Lead Record Created (Make.com API Call — B2B submissions only)
        |
        ▼
Lead Assignment Rule Fires
(Evaluates State/Province → Assigns Regional Queue)
        |
        ▼
After-Save Flow Fires
(Scores Lead → Evaluates Priority Level → Retains or Overrides OwnerId)
        |
        ▼
Update Records — Single DML Write
(Commits OwnerId, Priority_Level__c)
        |
        ▼
Lead Record Owned by:
  ┌─────────────────────────────────────────────┐
  │  High Priority  →  Sophia Delgado           │
  │  Medium Priority  →  Regional Queue         │
  │  Low Priority  →  Regional Queue            │
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
| Output | Regional Queue `OwnerId` written to Record |
| Scope | All Lead Records — all Priority Levels |
| Awareness of Priority Level | None — the Assignment Rule does not evaluate Priority Level |

The Assignment Rule fires before the Flow. At the point the Flow begins executing, the Lead Record is already owned by the correct regional Queue.

### 3.2 After-Save Flow — Escalation Logic

The Flow is responsible for scoring the Lead and applying priority-based ownership override. After scoring and Priority Level assignment are complete, the Flow evaluates whether the assigned Priority Level requires escalation. If the Priority Level is High, the Flow overwrites the regional Queue `OwnerId` with Sophia Delgado's User ID. If the Priority Level is Medium or Low, the regional Queue `OwnerId` is retained unchanged.

| Responsibility | Detail |
|---|---|
| Fires on | Lead Record creation — After-Save |
| Evaluates | `varPriorityLevel` (after scoring is complete) |
| Output | `varOwnerID` set to Sophia Delgado (High) or retained as regional Queue (Medium / Low) |
| Scope | All Lead Records that enter Salesforce |
| Awareness of Territory | Indirect — captures regional Queue OwnerId via `{!$Record.OwnerId}` before evaluating escalation |

---

## 4. Ownership Determination Sequence

The following sequence defines exactly how ownership is determined for every Lead Record that enters the system.

| Step | Component | Action | Record State After Step |
|---|---|---|---|
| 1 | Make.com | Creates Lead Record via API | Record exists — `OwnerId` is the creating user or default |
| 2 | Assignment Rule | Evaluates `State/Province` — assigns regional Queue | OwnerId = Regional Queue |
| 3 | Flow — Weighted Scoring | Calculates `varTotalScore` across three dimensions | Score accumulated in `varTotalScore` |
| 4 | Flow — Priority Assignment | Maps `varTotalScore` to Priority Level | `varPriorityLevel` set to `High`, `Medium`, or `Low` |
| 5 | Flow — OwnerId Initialization | Captures `{!$Record.OwnerId}` into `varOwnerID` | `varOwnerID` = Regional Queue OwnerId |
| 6 | Flow — Escalation Decision | Evaluates `varPriorityLevel` | High: `varOwnerID` overwritten with Sophia Delgado User ID. Medium / Low: `varOwnerID` unchanged |
| 7 | Flow — Update Records | Writes `OwnerId`, `Priority_Level__c` in single DML | Record ownership committed — pipeline complete |

---

## 5. Ownership Outcomes by Path

Every Lead Record that enters the system exits with one of three ownership states. The table below maps each path to its final ownership outcome.

| Path | Condition | Final OwnerId | `Priority_Level__c` |
|---|---|---|---|
| Qualified — High | `varTotalScore` ≥ 12 | Sophia Delgado | `High` |
| Qualified — Medium | `varTotalScore` 8–11 | Regional Queue | `Medium` |
| Qualified — Low | `varTotalScore` 3–7 | Regional Queue | `Low` |

---

## 6. `Region__c` Field — Preserved Across All Paths

The `Region__c` Formula Field derives the Lead's territorial classification from `State/Province` at read time. It is not written by the Assignment Rule, the Flow, or Make.com under any circumstances.

- A High priority Lead owned by Sophia Delgado retains the correct `Region__c` value for the territory the Lead originated from.
- `Region__c` is always reliable as a territorial classification Field regardless of who owns the Record.

This design preserves regional pipeline visibility for reporting purposes even when escalation overrides Queue ownership.

---

## 7. Routing Architecture — Design Decisions

### 7.1 Why the Assignment Rule Fires Before the Flow

Salesforce executes Lead Assignment Rules synchronously at Record creation, before After-Save Flow logic runs. This sequencing is native platform behavior. The system design leverages this behavior deliberately — the Assignment Rule establishes the territorial Queue OwnerId first, and the Flow reads that value via `{!$Record.OwnerId}` to use as the default before evaluating escalation.

The Flow does not need to contain territory evaluation logic. Territory is handled entirely by the Assignment Rule. The Flow only needs to decide whether to keep or override the value the Assignment Rule already set.

### 7.2 Why `OwnerId` Is Written by the Flow, Not the Assignment Rule Alone

For Medium and Low priority Leads, the Assignment Rule's Queue assignment is the final ownership state — the Flow retains it. For High priority Leads, the Flow must override it. Writing `OwnerId` through the Flow's Update Records element ensures the Single-DML pattern is maintained — all Field writes occur in one operation, including the ownership override.

---

## 8. Live Validation — Ownership Outcomes Confirmed

| Lead | Priority Level | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|---|
| Richard Miranda | Low | `East_Coast_Region` (lnava) | No | lnava (`East_Coast_Region`) |
| Neil Thompson | High | `West_Coast_Region` (jchen) | Yes — Sophia Delgado | Sophia Delgado |

Both routing paths — qualified Low and qualified High with escalation — confirmed operational on live Lead Records.

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/routing-architecture.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
