# Priority Thresholds

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document defines the priority threshold logic applied in the Céleste Vineyards Lead Priority Level Automation system. It records how `varTotalScore` is evaluated, how each threshold condition maps to a Priority Level, and how the Decision element structure ensures correct outcome resolution.

This document covers threshold evaluation only. Scoring dimension logic — how `varTotalScore` is built — is documented in `docs/03-data-model/scoring-model.md`. Escalation logic triggered by the Priority Level output is documented in `docs/04-automation-logic/escalation-logic.md`.

---

## 2. Input — varTotalScore

`varTotalScore` is a Flow Number variable initialized at 0. It accumulates weighted dimension scores across three tiers — Business Type, Role, and Purchasing Timeline — via Assignment elements in the Flow. Each tier contributes 1–5 points.

| Variable | Data Type | Default | Range (Qualified Leads) |
|---|---|---|---|
| `varTotalScore` | Number | 0 | 3–15 |

- **Minimum (3):** Lowest qualifying value in all three tiers — Catering & Event Company (1) + Event Coordinator (1) + Information Gathering (1)
- **Maximum (15):** Highest value in all three tiers — Premium Wine Distributor (5) + Owner (5) + Immediate Need (Contracting) (5)

`varTotalScore` is the sole input to the Priority Level threshold Decision element. No other variable or field is evaluated at this stage.

---

## 3. Threshold Logic

### 3.1 Decision Element

| Attribute | Value |
|---|---|
| Flow | `Lead_Scoring_and_Priority_Level_Assignment` |
| Element Type | Decision |
| Element Label | `Determine Priority Level` |
| Input Evaluated | `varTotalScore` |
| Output Written | `varPriorityLevel` |

### 3.2 Outcome Definitions

Outcomes are evaluated in order. The first matching condition wins. High is evaluated before Medium. Low is the Default Outcome and requires no condition.

| Outcome | Condition | `varPriorityLevel` Set To | Score Range |
|---|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` | 12–15 |
| Medium | `varTotalScore` ≥ 8 | `Medium` | 8–11 |
| Low | Default Outcome | `Low` | 3–7 |

**Outcome order is architecturally significant.** A score of 12 satisfies both the High condition (≥ 12) and the Medium condition (≥ 8). Because High is evaluated first, a score of 12 always resolves to High. If Medium were evaluated first, scores of 12–15 would incorrectly resolve to Medium.

### 3.3 Assignment Elements

Each outcome routes to a dedicated Assignment element that writes the Priority Level string to `varPriorityLevel`.

| Assignment Element | Sets `varPriorityLevel` To |
|---|---|
| `High` | `High` |
| `Medium` | `Medium` |
| `Low` | `Low` |

All three Assignment elements converge at the Escalation segment (Segment 4) of the Flow.

---

## 4. Output — varPriorityLevel

`varPriorityLevel` is a Flow Text variable with no default value. It is written by one of the three Assignment elements in this segment and carries the Priority Level string forward to the Escalation Decision and ultimately to the `Update Lead Priority and Score` Update Records element.

| Variable | Data Type | Default | Possible Values |
|---|---|---|---|
| `varPriorityLevel` | Text | — | `High`, `Medium`, `Low` |

`varPriorityLevel` is written to `Priority_Level__c` on the Lead Record by the single `Update Lead Priority and Score` Update Records element at the conclusion of the Flow.

---

## 5. Priority Level Field

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Written By | Flow — `Update Lead Priority and Score` Update Records element (qualified path) |
| Written By (non-qualified path) | Make.com Module 13 — hardcoded `Not Applicable` before Record creation |

| Picklist Value | Source | Condition |
|---|---|---|
| `High` | Flow — qualified path | `varTotalScore` ≥ 12 |
| `Medium` | Flow — qualified path | `varTotalScore` ≥ 8 and < 12 |
| `Low` | Flow — qualified path | `varTotalScore` ≤ 7 (Default Outcome) |
| `Not Applicable` | Make.com Module 13 | Non-qualified path — Gatekeeper Fail |

---

## 6. Threshold Boundaries — Score Distribution

| Score | Priority Level | Example Composition |
|---|---|---|
| 15 | High | Premium Wine Distributor (5) + Owner (5) + Immediate Need (5) |
| 13 | High | Premium Wine Distributor (5) + Owner (5) + Short-Term Within 30 Days (3) — or other combinations summing to 13 |
| 12 | High | Threshold minimum — multiple valid compositions |
| 11 | Medium | Threshold maximum |
| 8 | Medium | Threshold minimum — multiple valid compositions |
| 7 | Low | Threshold maximum |
| 3 | Low | Threshold minimum — Catering & Event Company (1) + Event Coordinator (1) + Information Gathering (1) |

---

## 7. Live Validation

| Lead | `varTotalScore` | Priority Level Assigned | Path |
|---|---|---|---|
| Tamara Nguyen (S-03) | 3 | Low | Qualified — No Escalation |
| Jerome Castillo (S-04) | 9 | Medium | Qualified — No Escalation |
| Vivienne Okafor (S-05) | 13 | High | Qualified — Escalated |
| Kenji Watanabe (S-06) | 13 | High | Qualified — Escalated |

Confirmed via Flow debug logs. All threshold conditions resolved correctly across the score range.

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/priority-thresholds.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
