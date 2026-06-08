# Scoring Model

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document defines the scoring model applied to every Lead Record entering the Céleste Vineyards Lead Priority Level Automation pipeline. It records the three scoring dimensions, the point values assigned to each picklist value within each dimension, the composite score variable, and the Priority Level thresholds derived from the composite score.

Every Lead Record that enters the scoring model has already passed the Gatekeeper at the Wix form layer. The Gatekeeper blocks all `Personal/Individual (Non-Business)` submissions before any payload reaches Make.com or Salesforce. No disqualification logic exists in the scoring model. Every Lead evaluated here is a confirmed B2B submission.

This document defines the scoring dimensions and point values only. Flow implementation of the scoring sequence — Decision elements, Assignment elements, and operator configuration — is documented in `docs/04-automation-logic/scoring-logic.md`. Priority Level threshold logic is also defined here in Section 4, and referenced by `docs/04-automation-logic/scoring-logic.md`.

---

## 2. Scoring Architecture

The scoring model evaluates three dimensions in sequence. Each dimension is a custom Picklist Field on the Lead Object, populated by Make.com from the Wix form payload before the Flow fires. Each dimension contributes 1–5 points to the composite score variable `varTotalScore`. The three dimensions are independent — no dimension is weighted against another, and no dimension is skipped for any qualified Lead.

| Dimension | Field | Score Range | Flow Tier |
|---|---|---|---|
| Business Type | `Business_Type__c` | 1–5 | Tier 1 |
| Role | `Role__c` | 1–5 | Tier 2 |
| Purchasing Timeline | `Purchasing_Timeline__c` | 1–5 | Tier 3 |
| **Composite Score** | `varTotalScore` | **3–15** | — |

---

## 3. Scoring Dimensions

### 3.1 Business Type — `Business_Type__c`

Business Type reflects the category of the prospect's organization. It is the primary scoring dimension and the first evaluated in the Flow. Point values reflect the commercial value of each business type to Céleste Vineyards' distribution model.

| Picklist Value | Points |
|---|---|
| `Premium Wine Distributor` | 5 |
| `High-End Wine Store` | 4 |
| `Upscale Restaurant` | 3 |
| `Specialty Gourmet Grocer` | 2 |
| `Catering & Event Company` | 1 |

`Personal/Individual (Non-Business)` is not a valid scoring value. It is the Gatekeeper trigger at the Wix form layer and never reaches the Flow.

---

### 3.2 Role — `Role__c`

Role reflects the prospect's position within their organization. It is the second scoring dimension. Point values reflect the prospect's purchasing authority and likelihood of advancing a commercial relationship.

| Picklist Value | Points |
|---|---|
| `Owner` | 5 |
| `Purchasing Manager` | 4 |
| `General Manager` | 3 |
| `Sales Manager` | 2 |
| `Event Coordinator` | 1 |

---

### 3.3 Purchasing Timeline — `Purchasing_Timeline__c`

Purchasing Timeline reflects the prospect's stated readiness to purchase. It is the third scoring dimension. Point values reflect the immediacy of the commercial opportunity.

| Picklist Value | Points |
|---|---|
| `Immediate Need (Contracting)` | 5 |
| `Short-Term (Within 30 Days)` | 4 |
| `Evaluating Vendors (Next 90 Days)` | 3 |
| `Budget Planning (Future Quarter)` | 2 |
| `Information Gathering` | 1 |

---

## 4. Composite Score — varTotalScore

`varTotalScore` is a Flow Number variable initialized at 0 at the start of every Flow interview. It accumulates the sum of all three dimension scores using the Add operator across the three scoring tiers. It is never reset or overwritten during a single Flow interview — only incremented.

| After Tier | `varTotalScore` Holds |
|---|---|
| Tier 1 completes | Business Type score (1–5) |
| Tier 2 completes | Business Type + Role score (2–10) |
| Tier 3 completes | Business Type + Role + Purchasing Timeline score (3–15) |

**Minimum score:** 3 — achieved when all three dimensions return their lowest value.
**Maximum score:** 15 — achieved when all three dimensions return their highest value.

`varTotalScore` is the sole scoring mechanism. It is not written to any Lead field. Priority Level assignment is the only downstream use of this variable.

---

## 5. Priority Level Thresholds

After all three tiers complete, `varTotalScore` is evaluated by the `Determine Priority Level` Decision element. The Decision evaluates outcomes in order — `High` first, then `Medium`, then `Low` as the Default Outcome. The first matching condition wins.

| Priority Level | Threshold | `varPriorityLevel` Set To |
|---|---|---|
| `High` | `varTotalScore` ≥ 12 | `High` |
| `Medium` | `varTotalScore` ≥ 8 and < 12 | `Medium` |
| `Low` | `varTotalScore` < 8 (Default Outcome) | `Low` |

**Outcome order is required.** A score of 12 satisfies both the `High` condition (≥ 12) and the `Medium` condition (≥ 8). Because `High` is evaluated first, scores of 12–15 always resolve to `High`. Reversing the order would cause scores of 12–15 to incorrectly resolve to `Medium`.

Priority Level reflects the composite commercial value of a Lead across all three scoring dimensions. It is not a measure of contact urgency alone.

---

## 6. Score Range Reference

| Score | Priority Level | Example Composition |
|---|---|---|
| 15 | `High` | `Premium Wine Distributor` (5) + `Owner` (5) + `Immediate Need (Contracting)` (5) |
| 14 | `High` | `Premium Wine Distributor` (5) + `Owner` (5) + `Short-Term (Within 30 Days)` (4) |
| 13 | `High` | `Premium Wine Distributor` (5) + `Purchasing Manager` (4) + `Short-Term (Within 30 Days)` (4) |
| 12 | `High` | Threshold minimum — multiple valid compositions |
| 11 | `Medium` | Threshold maximum |
| 9 | `Medium` | `Upscale Restaurant` (3) + `General Manager` (3) + `Evaluating Vendors (Next 90 Days)` (3) |
| 8 | `Medium` | Threshold minimum — multiple valid compositions |
| 7 | `Low` | Threshold maximum |
| 3 | `Low` | `Catering & Event Company` (1) + `Event Coordinator` (1) + `Information Gathering` (1) |

---

## 7. Scoring Constraints

- **No partial scoring.** Every qualified Lead receives a full three-dimension evaluation. No dimension is skipped or conditionally excluded.
- **No overlap.** The Gatekeeper and the scoring model operate at separate layers. Qualification is enforced at Wix. Scoring begins only after a confirmed B2B submission reaches Salesforce.
- **No field write.** `varTotalScore` is never written to a Lead field. It exists only within the Flow interview.
- **Deterministic.** Identical input values across all three dimensions always produce the same `varTotalScore` and the same `Priority_Level__c` output.

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/scoring-model.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
