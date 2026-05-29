# Priority Thresholds

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document defines the Priority Level threshold logic applied in the Céleste Vineyards Lead Priority Level Automation system. It records the fixed score thresholds mapped to each Priority Level, the decision structure that evaluates them, the output variable produced, and the downstream effect of each outcome.

Priority Level thresholds are evaluated after all three scoring tiers complete and `varTotalScore` holds the composite score for the Lead. Threshold logic is implemented in the `Determine Priority Level` Decision element of the `Lead_Scoring_and_Priority_Level_Assignment` Flow. Scoring dimension definitions and point values are documented in `docs/03-data-model/scoring-model.md`. Flow implementation details are documented in `docs/04-automation-logic/scoring-logic.md`.

---

## 2. Threshold Definitions

`varTotalScore` is evaluated against two fixed thresholds. Outcomes are evaluated in order — `High` first, then `Medium`, then `Low` as the Default Outcome. The first matching condition wins.

| Priority Level | Threshold Condition | `varPriorityLevel` Set To | Score Range |
|---|---|---|---|
| `High` | `varTotalScore` ≥ 12 | `High` | 12–15 |
| `Medium` | `varTotalScore` ≥ 8 and < 12 | `Medium` | 8–11 |
| `Low` | Default Outcome (`varTotalScore` < 8) | `Low` | 3–7 |

**Outcome order is required.** A score of 12 satisfies both the `High` condition (≥ 12) and the `Medium` condition (≥ 8). Because `High` is evaluated first, scores of 12–15 always resolve to `High`. Reversing the order would cause scores of 12–15 to incorrectly resolve to `Medium`.

---

## 3. Decision Element Configuration

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Priority Level` |
| Variable Evaluated | `varTotalScore` |
| Output Variable | `varPriorityLevel` |
| Outcome Count | 3 |
| Default Outcome | `Is Priority Level Low` |

### 3.1 Outcome Definitions

| Outcome Label | Condition | Assignment Element | `varPriorityLevel` Result |
|---|---|---|---|
| `Is Priority Level High` | `varTotalScore` ≥ 12 | `Priority Level High` | `High` |
| `Is Priority Level Medium` | `varTotalScore` ≥ 8 | `Priority Level Medium` | `Medium` |
| `Is Priority Level Low` | Default Outcome | `Priority Level Low` | `Low` |

All three Assignment elements converge at Segment 3 — Escalation.

---

## 4. Composite Score Range

`varTotalScore` is constrained to a range of 3–15 by the scoring model. No score outside this range is possible under normal pipeline conditions.

| Boundary | Score | Composition |
|---|---|---|
| Maximum | 15 | `Premium Wine Distributor` (5) + `Owner` (5) + `Immediate Need (Contracting)` (5) |
| Minimum | 3 | `Catering & Event Company` (1) + `Event Coordinator` (1) + `Information Gathering` (1) |

| Priority Level | Score Range | Width |
|---|---|---|
| `High` | 12–15 | 4 points |
| `Medium` | 8–11 | 4 points |
| `Low` | 3–7 | 5 points |

---

## 5. Downstream Effect by Priority Level

Priority Level determines two downstream outcomes: the value written to `Priority_Level__c` and the `OwnerId` committed to the Lead Record.

| Priority Level | `Priority_Level__c` Written | `OwnerId` Outcome | Escalation Fires |
|---|---|---|---|
| `High` | `High` | Sophia Delgado (Flow override) | Yes |
| `Medium` | `Medium` | Assignment Rule output retained | No |
| `Low` | `Low` | Assignment Rule output retained | No |

Priority Level `High` triggers the escalation segment of the Flow. The `Escalate High Priority to Sophia` Decision evaluates `varPriorityLevel` and overwrites `varOwnerID` with Sophia Delgado's User ID. Priority Level `Medium` and `Low` Leads retain the `OwnerId` written by the Assignment Rule unchanged.

Both `Priority_Level__c` and `OwnerId` are committed to the Lead Record by the `Update Lead Priority and Score` Update Records element — the sole DML operation in the Flow.

---

## 6. Design Notes

**Priority Level reflects composite commercial value.** It is derived from the sum of all three scoring dimensions — Business Type, Role, and Purchasing Timeline. It is not a measure of contact urgency alone.

**Thresholds are fixed.** The threshold values — 12 for `High`, 8 for `Medium` — are not configurable at runtime. They are hardcoded in the Decision element outcome conditions and require a Flow version increment to modify.

**`varTotalScore` is not written to any Lead field.** The composite score exists only within the Flow interview. `Priority_Level__c` is the only scored output persisted to the Lead Record.

**Every Lead receives a Priority Level.** No Lead that enters the Flow exits without a `varPriorityLevel` value. The Default Outcome ensures `Low` is assigned to any score below the `Medium` threshold.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/priority-thresholds.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*