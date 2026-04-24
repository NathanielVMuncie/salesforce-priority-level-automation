# Scoring Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the scoring logic implemented in the `Lead_Scoring_and_Priority_Level_Assignment` Flow. It records the three-tier scoring sequence, every Decision element and its outcomes, every Assignment element and the operator applied, how `varTotalScore` accumulates across all three tiers, and how the composite score maps to a Priority Level.

Every Lead Record that reaches the Flow has already passed the qualification gate at the Wix form level. No disqualification path exists in the Flow. Every Flow interview that fires produces a complete score and a Priority Level.

This document covers Flow implementation only. Scoring dimension definitions and point values are documented in `docs/03-data-model/scoring-model.md`. Priority threshold logic is documented in `docs/03-data-model/priority-thresholds.md`.

---

## 2. Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Version | V15 |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

---

## 3. Scoring Variables

Two Flow variables carry state across the three-tier scoring sequence.

| Variable | Data Type | Default Value | Purpose |
|---|---|---|---|
| `varTotalScore` | Number | 0 | Accumulates the sum of all three tier scores across the full scoring sequence |
| `varPriorityLevel` | Text | — | Stores the Priority Level string assigned based on `varTotalScore` |

`varTotalScore` is initialized at 0 and incremented by each tier's Assignment elements using the Add operator. It is never reset or overwritten during scoring — only incremented. At the conclusion of all three tiers, `varTotalScore` holds the complete composite score.

---

## 4. Scoring Sequence Overview

The Flow executes scoring across three tiers in a fixed sequence. Each tier is implemented as a Decision element that evaluates one scoring Field, routes to a dedicated Assignment element, and adds that tier's point value to `varTotalScore`. All five outcomes in each tier converge before the next tier's Decision element executes.

```
Run Immediately
        |
        ▼
[TIER 1] Determine Business Type Score (Decision)
        |
        ├── Is Premium Wine Distributor → Premium Wine Distributor, Add 5 Points (Assignment)
        ├── Is High-End Wine Store      → High-End Wine Store, Add 4 Points (Assignment)
        ├── Is Upscale Restaurant       → Upscale Restaurant, Add 3 Points (Assignment)
        ├── Is Specialty Gourmet Grocer → Specialty Gourmet Grocer, Add 2 Points (Assignment)
        ├── Is Catering & Event Company → Add Catering & Event Company, Add 1 Point (Assignment)
        └── Default Outcome             → End
                    |
                    ▼ (all five qualified outcomes converge)
[TIER 2] Determine Role Score (Decision)
        |
        ├── Is Owner                    → Owner, Add 5 Points (Assignment)
        ├── Is Purchasing Manager       → Purchasing Manager, Add 4 Points (Assignment)
        ├── Is General Manager          → General Manager, Add 3 Points (Assignment)
        ├── Is Sales Manager            → Sales Manager, Add 2 Points (Assignment)
        ├── Is Event Coordinator        → Event Coordinator, Add 1 Point (Assignment)
        └── Default Outcome             → End
                    |
                    ▼ (all five outcomes converge)
[TIER 3] Determine Purchasing Timeline Score (Decision)
        |
        ├── Is Immediate Need (Contracting)      → Immediate Need (Contracting), Add 5 Points (Assignment)
        ├── Is Short-Term (Within 30 Days)       → Short-Term (Within 30 Days), Add 4 Points (Assignment)
        ├── Is Evaluating Vendors (Next 90 Days) → Evaluating Vendors (Next 90 Days), Add 3 Points (Assignment)
        ├── Is Budget Planning (Future Quarter)  → Budget Planning (Future Quarter), Add 2 Points (Assignment)
        ├── Is Information Gathering             → Information Gathering, Add 1 Point (Assignment)
        └── Default Outcome                      → End
                    |
                    ▼ (all five outcomes converge)
Determine Priority Level (Decision)
        |
        ├── Is Priority Level High   → Priority Level High (Assignment)
        ├── Is Priority Level Medium → Priority Level Medium (Assignment)
        └── Is Priority Level Low    → Priority Level Low (Assignment)
```

---

## 5. Tier 1 — Business Type Score

### 5.1 Decision Element

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Business Type Score` |
| Field Evaluated | `Business_Type__c` |
| Outcome Count | 5 |

### 5.2 Outcomes and Assignment Elements

| Outcome Label | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Premium Wine Distributor` | `Business_Type__c` Equals `Premium Wine Distributor` | `Premium Wine Distributor, Add 5 Points` | 5 |
| `Is High-End Wine Store` | `Business_Type__c` Equals `High-End Wine Store` | `High-End Wine Store, Add 4 Points` | 4 |
| `Is Upscale Restaurant` | `Business_Type__c` Equals `Upscale Restaurant` | `Upscale Restaurant, Add 3 Points` | 3 |
| `Is Specialty Gourmet Grocer` | `Business_Type__c` Equals `Specialty Gourmet Grocer` | `Specialty Gourmet Grocer, Add 2 Points` | 2 |
| `Is Catering & Event Company` | `Business_Type__c` Equals `Catering & Event Company` | `Add Catering & Event Company, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End | — |

### 5.3 Assignment Operator

All five Assignment elements in Tier 1 use the **Add** operator: `varTotalScore = varTotalScore + [points]`. The Equals operator is never used — it would overwrite the running total rather than increment it.

### 5.4 Default Outcome Behavior

The Default Outcome routes the Flow to End. Because every Lead Record that reaches the Flow was submitted through the Wix form with a valid `Business_Type__c` value, the Default Outcome is a defensive backstop only. It cannot fire under normal pipeline conditions.

---

## 6. Tier 2 — Role Score

### 6.1 Decision Element

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Role Score` |
| Field Evaluated | `Role__c` |
| Outcome Count | 5 |

### 6.2 Outcomes and Assignment Elements

| Outcome Label | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Owner` | `Role__c` Equals `Owner` | `Owner, Add 5 Points` | 5 |
| `Is Purchasing Manager` | `Role__c` Equals `Purchasing Manager` | `Purchasing Manager, Add 4 Points` | 4 |
| `Is General Manager` | `Role__c` Equals `General Manager` | `General Manager, Add 3 Points` | 3 |
| `Is Sales Manager` | `Role__c` Equals `Sales Manager` | `Sales Manager, Add 2 Points` | 2 |
| `Is Event Coordinator` | `Role__c` Equals `Event Coordinator` | `Event Coordinator, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End | — |

### 6.3 Assignment Operator

All five Assignment elements in Tier 2 use the **Add** operator. `varTotalScore` at this point already holds the Tier 1 point value. The Add operator preserves and extends the running total.

---

## 7. Tier 3 — Purchasing Timeline Score

### 7.1 Decision Element

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Purchasing Timeline Score` |
| Field Evaluated | `Purchasing_Timeline__c` |
| Outcome Count | 5 |

### 7.2 Outcomes and Assignment Elements

| Outcome Label | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Immediate Need (Contracting)` | `Purchasing_Timeline__c` Equals `Immediate Need (Contracting)` | `Immediate Need (Contracting), Add 5 Points` | 5 |
| `Is Short-Term (Within 30 Days)` | `Purchasing_Timeline__c` Equals `Short-Term (Within 30 Days)` | `Short-Term (Within 30 Days), Add 4 Points` | 4 |
| `Is Evaluating Vendors (Next 90 Days)` | `Purchasing_Timeline__c` Equals `Evaluating Vendors (Next 90 Days)` | `Evaluating Vendors (Next 90 Days), Add 3 Points` | 3 |
| `Is Budget Planning (Future Quarter)` | `Purchasing_Timeline__c` Equals `Budget Planning (Future Quarter)` | `Budget Planning (Future Quarter), Add 2 Points` | 2 |
| `Is Information Gathering` | `Purchasing_Timeline__c` Equals `Information Gathering` | `Information Gathering, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End | — |

### 7.3 Assignment Operator

All five Assignment elements in Tier 3 use the **Add** operator. At the point Tier 3 executes, `varTotalScore` holds the sum of Tier 1 and Tier 2 scores. The Add operator produces the final composite score.

---

## 8. varTotalScore Accumulation

`varTotalScore` accumulates across all three tiers in a single Flow interview. Each tier contributes exactly one point value. No tier is skipped, repeated, or conditionally excluded for any Lead Record that enters the scoring sequence.

| After | `varTotalScore` Holds |
|---|---|
| Tier 1 completes | Business Type score (1–5) |
| Tier 2 completes | Business Type + Role score (2–10) |
| Tier 3 completes | Business Type + Role + Purchasing Timeline score (3–15) |

**Score range:** Minimum 3 — Maximum 15.

---

## 9. Priority Level Assignment

After all three tiers complete, `varTotalScore` is evaluated by the `Determine Priority Level` Decision element. Outcomes are evaluated in order — `High` first, then `Medium`, then `Low` as the Default Outcome. The first matching condition wins.

### 9.1 Decision Element

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Priority Level` |
| Variable Evaluated | `varTotalScore` |
| Output Variable | `varPriorityLevel` |

### 9.2 Outcomes and Assignment Elements

| Outcome Label | Condition | Assignment Element | `varPriorityLevel` Set To |
|---|---|---|---|
| `Is Priority Level High` | `varTotalScore` ≥ 12 | `Priority Level High` | `High` |
| `Is Priority Level Medium` | `varTotalScore` ≥ 8 | `Priority Level Medium` | `Medium` |
| `Is Priority Level Low` | Default Outcome | `Priority Level Low` | `Low` |

**Outcome order is required.** A score of 12 satisfies both the `Is Priority Level High` condition (≥ 12) and the `Is Priority Level Medium` condition (≥ 8). Because `Is Priority Level High` is evaluated first, scores of 12–15 always resolve to `High`. Reversing the order would cause scores of 12–15 to incorrectly resolve to `Medium`.

All three Assignment elements converge at the escalation segment of the Flow.

---

## 10. Score Range Reference

| Score | Priority Level | Example Composition |
|---|---|---|
| 15 | `High` | Premium Wine Distributor (5) + Owner (5) + Immediate Need (Contracting) (5) |
| 13 | `High` | Premium Wine Distributor (5) + Owner (5) + Short-Term Within 30 Days (4) — or other combinations summing to 13 |
| 12 | `High` | Threshold minimum — multiple valid compositions |
| 11 | `Medium` | Threshold maximum |
| 9 | `Medium` | Upscale Restaurant (3) + General Manager (3) + Evaluating Vendors Next 90 Days (3) |
| 8 | `Medium` | Threshold minimum — multiple valid compositions |
| 7 | `Low` | Threshold maximum |
| 3 | `Low` | Catering & Event Company (1) + Event Coordinator (1) + Information Gathering (1) |

---

## 11. Live Validation

| Lead | `Business_Type__c` | `Role__c` | `Purchasing_Timeline__c` | `varTotalScore` | `Priority_Level__c` |
|---|---|---|---|---|---|
| Tamara Nguyen | `Catering & Event Company` | `Event Coordinator` | `Information Gathering` | 3 | `Low` |
| Jerome Castillo | `Upscale Restaurant` | `General Manager` | `Evaluating Vendors (Next 90 Days)` | 9 | `Medium` |
| Vivienne Okafor | `Premium Wine Distributor` | `Owner` | `Short-Term (Within 30 Days)` | 14 | `High` |
| Kenji Watanabe | `Premium Wine Distributor` | `Purchasing Manager` | `Short-Term (Within 30 Days)` | 13 | `High` |

Confirmed via Flow debug logs. All three Priority Level outcomes confirmed operational across the score range.

---

## 12. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/scoring-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*