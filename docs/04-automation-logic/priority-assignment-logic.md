# Priority Assignment Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the priority assignment logic implemented in the `Lead_Scoring_and_Priority_Level_Assignment` Flow. It records how `varTotalScore` is evaluated against fixed thresholds, how each outcome maps to a Priority Level, and how `varPriorityLevel` is written and carried forward to the Update Records element.

Priority assignment is Segment 3 of the Flow. It executes after all three scoring tiers have completed and `varTotalScore` holds the full composite score. It produces `varPriorityLevel` as its output — the value that drives both the escalation decision and the final Field write.

This document covers Flow implementation only. Threshold definitions and score distribution are documented in `docs/03-data-model/priority-thresholds.md`. Escalation logic that consumes `varPriorityLevel` is documented in `docs/04-automation-logic/escalation-logic.md`. Scoring logic that produces `varTotalScore` is documented in `docs/04-automation-logic/scoring-logic.md`.

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

## 3. Segment Position

Priority assignment is Segment 3 of five. It receives `varTotalScore` from Segment 2 and passes `varPriorityLevel` to Segment 4.

```
Segment 1 — Qualification Gate (Gatekeeper + Business Type Score)
        |
Segment 2 — Weighted Scoring (Role Score + Purchasing Timeline Score)
        |
        ▼
Segment 3 — Priority Assignment ← THIS DOCUMENT
        |
Segment 4 — Escalation
        |
Segment 5 — Single DML Write
```

---

## 4. Input — varTotalScore

`varTotalScore` enters Segment 3 as the complete composite score — the accumulated sum of all three scoring tier values.

| Variable | Data Type | Default | Range at Segment 3 Entry |
|---|---|---|---|
| `varTotalScore` | Number | 0 | 3–15 |

`varTotalScore` is the sole input evaluated at this segment. No Field on the Lead Record is read directly. No other variable is consulted.

---

## 5. Decision Element — Determine Priority Level

### 5.1 Element Identity

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Priority Level` |
| Variable Evaluated | `varTotalScore` |
| Outcome Count | 3 |
| Default Outcome | `Is Priority Level Low` |

### 5.2 Outcome Definitions

Outcomes are evaluated in order. The first matching condition wins. `Is Priority Level High` is evaluated before `Is Priority Level Medium`. `Is Priority Level Low` is the Default Outcome and fires when no named condition is matched.

| Outcome Label | Condition | Score Range |
|---|---|---|
| `Is Priority Level High` | `varTotalScore` ≥ 12 | 12–15 |
| `Is Priority Level Medium` | `varTotalScore` ≥ 8 | 8–11 |
| `Is Priority Level Low` | Default Outcome | 3–7 |

**Outcome order is architecturally required.** A score of 12 satisfies both the `Is Priority Level High` condition (≥ 12) and the `Is Priority Level Medium` condition (≥ 8). Because `Is Priority Level High` is evaluated first, scores of 12–15 always resolve to `High`. If `Is Priority Level Medium` were evaluated first, scores of 12–15 would incorrectly resolve to `Medium`.

---

## 6. Assignment Elements

Each outcome in the `Determine Priority Level` Decision routes to a dedicated Assignment element that writes the Priority Level string to `varPriorityLevel`.

### 6.1 Priority Level High

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| Element Label | `Priority Level High` |
| Fires When | `Is Priority Level High` outcome matches (`varTotalScore` ≥ 12) |
| Variable Written | `varPriorityLevel` |
| Operator | Equals |
| Value Written | `High` |

### 6.2 Priority Level Medium

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| Element Label | `Priority Level Medium` |
| Fires When | `Is Priority Level Medium` outcome matches (`varTotalScore` ≥ 8 and < 12) |
| Variable Written | `varPriorityLevel` |
| Operator | Equals |
| Value Written | `Medium` |

### 6.3 Priority Level Low

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| Element Label | `Priority Level Low` |
| Fires When | `Is Priority Level Low` Default Outcome fires (`varTotalScore` 3–7) |
| Variable Written | `varPriorityLevel` |
| Operator | Equals |
| Value Written | `Low` |

All three Assignment elements converge at Segment 4 — Escalation.

---

## 7. Output — varPriorityLevel

`varPriorityLevel` exits Segment 3 holding one of three string values.

| Variable | Data Type | Default | Possible Values After Segment 3 |
|---|---|---|---|
| `varPriorityLevel` | Text | — | `High`, `Medium`, `Low` |

`varPriorityLevel` is consumed by two downstream elements:

- The `Escalate High Priority to Sophia` Decision in Segment 4 — evaluates whether the value is `High` to determine Owner override
- The `Update Lead Priority and Score` Update Records element in Segment 5 — writes `varPriorityLevel` to `Priority_Level__c` on the Lead Record

`varPriorityLevel` is not written to any Field until the single DML write in Segment 5.

---

## 8. Priority_Level__c Field

`Priority_Level__c` is the Picklist Field on the Lead Object that stores the assigned Priority Level. It is written exclusively by the `Update Lead Priority and Score` Update Records element for qualified Leads. On the non-qualified path, Make.com `Module 13` writes `Not Applicable` to this Field before the Record is created.

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Written By (qualified path) | Flow — `Update Lead Priority and Score` |
| Written By (non-qualified path) | Make.com `Module 13` — hardcoded `Not Applicable` |

| Picklist Value | Source | Condition |
|---|---|---|
| `High` | Flow — `Update Lead Priority and Score` | `varTotalScore` ≥ 12 |
| `Medium` | Flow — `Update Lead Priority and Score` | `varTotalScore` ≥ 8 and < 12 |
| `Low` | Flow — `Update Lead Priority and Score` | `varTotalScore` 3–7 (Default Outcome) |
| `Not Applicable` | Make.com `Module 13` | Non-qualified path — pre-Record creation |

---

## 9. Score Distribution Reference

| Score | Priority Level | Example Composition |
|---|---|---|
| 15 | `High` | Premium Wine Distributor (5) + Owner (5) + Immediate Need (Contracting) (5) |
| 14 | `High` | Premium Wine Distributor (5) + Owner (5) + Short-Term (Within 30 Days) (4) |
| 12 | `High` | Threshold minimum — multiple valid compositions |
| 11 | `Medium` | Threshold maximum |
| 9 | `Medium` | Upscale Restaurant (3) + General Manager (3) + Evaluating Vendors (Next 90 Days) (3) |
| 8 | `Medium` | Threshold minimum — multiple valid compositions |
| 7 | `Low` | Threshold maximum |
| 3 | `Low` | Catering & Event Company (1) + Event Coordinator (1) + Information Gathering (1) |

---

## 10. Live Validation

| Lead | `varTotalScore` | Outcome Matched | `varPriorityLevel` | `Priority_Level__c` |
|---|---|---|---|---|
| Tamara Nguyen (S-03) | 3 | `Is Priority Level Low` (Default) | `Low` | `Low` |
| Jerome Castillo (S-04) | 9 | `Is Priority Level Medium` | `Medium` | `Medium` |
| Vivienne Okafor (S-05) | 13 | `Is Priority Level High` | `High` | `High` |
| Kenji Watanabe (S-06) | 13 | `Is Priority Level High` | `High` | `High` |

Confirmed via Flow debug logs. All three Priority Level outcomes resolved correctly across the score range.

---

## 11. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/priority-assignment-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
