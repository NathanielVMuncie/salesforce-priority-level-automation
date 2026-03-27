# UAT Matrix

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document provides the User Acceptance Testing matrix for the Céleste Vineyards Lead Priority Level Automation system. It maps each test scenario to its acceptance criteria, the actual results observed on live Records in the Salesforce Developer Edition org, and the pass/fail status for each criterion.

---

## 2. UAT Summary

| Scenario | Lead | Path | Overall Status |
|---|---|---|---|
| S-01 | Richard Miranda | Qualified — Low | ✅ Pass |
| S-02 | Neil Thompson | Qualified — High with Escalation | ✅ Pass |
| S-03 | Dylan Moss | Non-Qualified — Disqualified | ✅ Pass |

All three scenarios passed. The system is confirmed operational across all paths.

---

## 3. S-01 — Richard Miranda — Qualified, Low Priority

| # | Acceptance Criterion | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Flow fires on Lead creation | Flow executes | Flow executed — confirmed in debug log | ✅ Pass |
| 2 | Gatekeeper passes qualified Lead | Scoring begins | Specialty Gourmet Grocer outcome executed | ✅ Pass |
| 3 | Business Type score correct | 2 points | varTotalScore = 2 after BT assignment | ✅ Pass |
| 4 | Role score correct | 2 points | varTotalScore = 4 after Role assignment | ✅ Pass |
| 5 | Purchasing Timeline score correct | 2 points | varTotalScore = 6 after Timeline assignment | ✅ Pass |
| 6 | Priority Level assigned correctly | Low | Priority_Level__c = Low | ✅ Pass |
| 7 | No escalation fires | OwnerId = regional Queue | varOwnerID retained as East_Coast_Region | ✅ Pass |
| 8 | Qualified__c = True | True | True (Field default confirmed) | ✅ Pass |
| 9 | Qualification_Status__c displays correctly | ✅ Qualified | ✅ Qualified | ✅ Pass |
| 10 | Lead routed to correct Queue | East_Coast_Region (Inava) | Lead Owner = Inava | ✅ Pass |
| 11 | Region__c populated correctly | East Coast | Region__c = East Coast | ✅ Pass |
| 12 | Phone normalized correctly | +1 (404) 447-4092 | +1 (404) 447-4092 | ✅ Pass |

---

## 4. S-02 — Neil Thompson — Qualified, High Priority, Escalated

| # | Acceptance Criterion | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Flow fires on Lead creation | Flow executes | Flow executed — confirmed in debug log | ✅ Pass |
| 2 | Gatekeeper passes qualified Lead | Scoring begins | Premium Wine Distributor outcome executed | ✅ Pass |
| 3 | Business Type score correct | 5 points | varTotalScore = 5 after BT assignment | ✅ Pass |
| 4 | Role score correct | 4 points | varTotalScore = 9 after Role assignment | ✅ Pass |
| 5 | Purchasing Timeline score correct | 4 points | varTotalScore = 13 after Timeline assignment | ✅ Pass |
| 6 | Priority Level assigned correctly | High | Priority_Level__c = High | ✅ Pass |
| 7 | Escalation fires correctly | OwnerId = Sophia Delgado | varOwnerID overwritten with Sophia Delgado User ID | ✅ Pass |
| 8 | Lead assigned to Sophia Delgado | Sophia Delgado | Lead Owner = Sophia Delgado | ✅ Pass |
| 9 | Qualified__c = True | True | True (Field default confirmed) | ✅ Pass |
| 10 | Qualification_Status__c displays correctly | ✅ Qualified | ✅ Qualified | ✅ Pass |
| 11 | Region__c reflects correct territory despite escalation | West Coast | Region__c = West Coast | ✅ Pass |
| 12 | Assignment Rule still evaluates correctly | West Coast Queue assigned before override | West_Coast_Region Queue assigned — then overridden | ✅ Pass |

---

## 5. S-03 — Dylan Moss — Non-Qualified, Disqualified

| # | Acceptance Criterion | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Make.com routes to Module 13 | Route 2 taken | Router directed to Module 13 | ✅ Pass |
| 2 | Module 13 writes placeholder values | Role__c = Not Applicable, Purchasing_Timeline__c = Not Applicable, Priority_Level__c = Not Applicable | All three placeholder values written | ✅ Pass |
| 3 | Flow fires on Lead creation | Flow executes | Flow executed — confirmed in debug log | ✅ Pass |
| 4 | Gatekeeper Fail outcome executes | Flow exits at End | Gatekeeper Fail outcome executed | ✅ Pass |
| 5 | No scoring elements execute | varTotalScore remains 0 | Scoring Decision elements not reached | ✅ Pass |
| 6 | No Priority Level assigned by Flow | Priority_Level__c = Not Applicable (from Make.com) | Priority_Level__c = Not Applicable | ✅ Pass |
| 7 | Qualification_Status__c displays correctly | ❌ Disqualified | ❌ Disqualified | ✅ Pass |
| 8 | Lead routed to correct regional Queue | Central_Region (pdesa) — Louisiana | Lead Owner = pdesa | ✅ Pass |
| 9 | Region__c populated correctly | Central | Region__c = Central | ✅ Pass |

---

## 6. Known Issue — Resolved During Testing

During initial testing, S-01 and S-02 failed criterion 9 (Qualification_Status__c) — both displayed `❌ Disqualified` on qualified Leads. Root cause and resolution are documented in `salesforce-integration.md` Section 13 and `test-artifacts/defect-log/defects.md`.

**Resolution:** `Qualified__c` default value set to True in Object Manager. Both Scenarios re-confirmed as passing after the fix.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | docs/06-build-assets/uat-matrix.md |
| Date Produced | 2026-03-23 |
| Next Document | test-artifacts/scenario-inputs/lead-test-records.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
