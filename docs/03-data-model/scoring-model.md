# Scoring Model

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document defines the scoring model applied in the Céleste Vineyards Lead Priority Level Automation system. It records the three scoring dimensions, their picklist values, point assignments, score range, and priority thresholds.

This document covers the model itself — what dimensions exist and what each answer is worth. Flow element implementation of the scoring model is documented in `docs/04-automation-logic/scoring-logic.md`. Priority threshold logic is documented in `docs/03-data-model/priority-thresholds.md`.

---

## 2. Scoring Dimensions

Lead scoring operates across three dimensions. Each dimension contributes 1–5 points to `varTotalScore`. All three dimensions must resolve for a score to be complete.

| Dimension | Field | Max Points |
|---|---|---|
| Business Type | `Business_Type__c` | 5 |
| Role | `Role__c` | 5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | 5 |
| **Total Maximum** | | **15** |

---

## 3. Business Type (Business_Type__c)

`Business_Type__c` is the first scoring dimension. It also serves as the qualification gate — `Personal/Individual (Non-Business)` is the Default Outcome that disqualifies the Lead and exits the Flow before any score is calculated.

| Picklist Value | Points | Notes |
|---|---|---|
| Premium Wine Distributor | 5 | Highest value |
| High-End Wine Store | 4 | |
| Upscale Restaurant | 3 | |
| Specialty Gourmet Grocer | 2 | |
| Catering & Event Company | 1 | Lowest qualifying value |
| Personal/Individual (Non-Business) | — | **Gatekeeper Fail — disqualifies Lead, Flow exits** |
| Not Applicable | — | Placeholder — non-qualified path (Module 13) |

---

## 4. Role (Role__c)

`Role__c` is the second scoring dimension. It evaluates the decision-making authority of the individual submitting the inquiry.

| Picklist Value | Points | Notes |
|---|---|---|
| Owner | 5 | Highest authority |
| Purchasing Manager | 4 | Decision-maker |
| General Manager | 3 | Decision-maker |
| Sales Manager | 2 | Partial authority |
| Event Coordinator | 1 | Low authority |
| Not Applicable | — | Placeholder — non-qualified path (Module 13) |

---

## 5. Purchasing Timeline (Purchasing_Timeline__c)

`Purchasing_Timeline__c` is the third scoring dimension. It assesses the expressed urgency and readiness to transact.

| Picklist Value | Points | Notes |
|---|---|---|
| Immediate Need (Contracting) | 5 | Highest urgency |
| Short-Term (Within 30 Days) | 4 | High urgency |
| Evaluating Vendors (Next 90 Days) | 3 | Mid urgency |
| Budget Planning (Future Quarter) | 2 | Low urgency |
| Information Gathering | 1 | No urgency |
| Not Applicable | — | Placeholder — non-qualified path (Module 13) |

---

## 6. Score Range

| Attribute | Value |
|---|---|
| Minimum Score | 3 |
| Maximum Score | 15 |

- **Minimum (3):** Catering & Event Company (1) + Event Coordinator (1) + Information Gathering (1)
- **Maximum (15):** Premium Wine Distributor (5) + Owner (5) + Immediate Need (Contracting) (5)

---

## 7. Priority Level Thresholds

`varTotalScore` is evaluated against fixed thresholds to determine `Priority_Level__c`.

| Priority Level | Condition | Score Range |
|---|---|---|
| High | `varTotalScore` ≥ 12 | 12–15 |
| Medium | `varTotalScore` ≥ 8 and < 12 | 8–11 |
| Low | Default Outcome | 3–7 |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/scoring-model.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
