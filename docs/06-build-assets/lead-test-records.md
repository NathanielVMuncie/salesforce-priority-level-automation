# Lead Test Records

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document records the input values used for each test Lead Record submitted through the Céleste Vineyards automation pipeline. These are the exact values entered on the Wix form and transmitted to Make.com for each of the three validation scenarios.

---

## 2. Test Record — Richard Miranda (S-01)

**Scenario:** Qualified Lead — Low Priority
**Path:** Wix → Make.com Module 12 → Salesforce → Flow → Low Priority → East Coast Queue

| Field | Value Submitted |
|---|---|
| First Name | Richard |
| Last Name | Miranda |
| Company | Fitzpatrick and Quinn Associates |
| Email | sezyz@mailinator.com |
| Phone | +14044474092 |
| State | Connecticut |
| Business Type | Specialty Gourmet Grocer |
| Role | Sales Manager |
| Purchasing Timeline | Budget Planning (Future Quarter) |
| Customer Note | Hello |

---

## 3. Test Record — Neil Thompson (S-02)

**Scenario:** Qualified Lead — High Priority with Escalation
**Path:** Wix → Make.com Module 12 → Salesforce → Flow → High Priority → Sophia Delgado

| Field | Value Submitted |
|---|---|
| First Name | Neil |
| Last Name | Thompson |
| Company | Thompson Distribution |
| Email | neil.thompson@mailinator.com |
| Phone | +19075551234 |
| State | Alaska |
| Business Type | Premium Wine Distributor |
| Role | Purchasing Manager |
| Purchasing Timeline | Short-Term (Within 30 Days) |
| Customer Note | *(not submitted)* |

---

## 4. Test Record — Dylan Moss (S-03)

**Scenario:** Non-Qualified Lead — Disqualified
**Path:** Wix → Make.com Module 13 → Salesforce → Flow → Gatekeeper Fail → Central Queue

| Field | Value Submitted |
|---|---|
| First Name | Dylan |
| Last Name | Moss |
| Company | *(hidden — not submitted)* |
| Email | dylan.moss@mailinator.com |
| Phone | +13185559876 |
| State | Louisiana |
| Business Type | Personal/Individual (Non-Business) |
| Role | *(hidden — not submitted)* |
| Purchasing Timeline | *(hidden — not submitted)* |
| Customer Note | *(not submitted)* |

**Note:** `role`, `purchasing_timeline`, and `company` Fields were hidden on the Wix form by the conditional display rule when `Personal/Individual (Non-Business)` was selected. These Fields were absent from the submission payload.

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | test-artifacts/scenario-inputs/lead-test-records.md |
| Date Produced | 2026-03-23 |
| Next Document | test-artifacts/expected-results/priority-routing-results.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
