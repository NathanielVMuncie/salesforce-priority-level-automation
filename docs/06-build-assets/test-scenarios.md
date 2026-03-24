# Test Scenarios

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 5 — Validation and Evidence

---

## 1. Document Purpose

This document defines the test scenarios used to validate the Céleste Vineyards Lead Priority Level Automation system. Each scenario specifies the input values, the expected system behavior at every stage of the pipeline, and the expected state of the Lead Record upon completion.

Three scenarios cover all major paths through the system: qualified Low priority, qualified High priority with escalation, and non-qualified disqualification. These scenarios correspond directly to the three live validation Records confirmed in the Salesforce Developer Edition org.

---

## 2. Scenario Overview

| Scenario | Lead Name | Path | Expected Priority Level | Expected Owner |
|---|---|---|---|---|
| S-01 | Richard Miranda | Qualified — Low | Low | Inava (East_Coast_Region) |
| S-02 | Neil Thompson | Qualified — High | High | Sophia Delgado |
| S-03 | Dylan Moss | Non-Qualified — Disqualified | Not Applicable | pdesa (Central_Region) |

---

## 3. S-01 — Qualified Lead, Low Priority

### 3.1 Input Values

| Field | Value |
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

### 3.2 Expected Scoring

| Dimension | Value | Points |
|---|---|---|
| Business Type | Specialty Gourmet Grocer | 2 |
| Role | Sales Manager | 2 |
| Purchasing Timeline | Budget Planning (Future Quarter) | 2 |
| **varTotalScore** | | **6** |

### 3.3 Expected Flow Behavior

| Step | Expected Behavior |
|---|---|
| Entry condition | `LeadSource` = `Céleste Vineyards - Business Inquiry Form` — Flow fires |
| Gatekeeper | `Business_Type__c` = `Specialty Gourmet Grocer` — qualified path |
| Business Type scoring | `varTotalScore` Add 2 → `varTotalScore` = 2 |
| Role scoring | `varTotalScore` Add 2 → `varTotalScore` = 4 |
| Timeline scoring | `varTotalScore` Add 2 → `varTotalScore` = 6 |
| Priority assignment | `varTotalScore` = 6 — Low Default Outcome — `varPriorityLevel` = Low |
| OwnerId initialization | `varOwnerID` = East_Coast_Region Queue ID |
| Escalation decision | `varPriorityLevel` = Low — Is Not High — no override |
| Update Records | `OwnerId` = East_Coast_Region, `Priority_Level__c` = Low, `Qualified__c` = True |

### 3.4 Expected Lead Record State

| Field | Expected Value |
|---|---|
| `Priority_Level__c` | Low |
| `Qualified__c` | True |
| `Qualification_Status__c` | ✅ Qualified |
| `OwnerId` | Inava (East_Coast_Region) |
| `Region__c` | East Coast |
| `Phone` | +1 (404) 447-4092 |

---

## 4. S-02 — Qualified Lead, High Priority with Escalation

### 4.1 Input Values

| Field | Value |
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

### 4.2 Expected Scoring

| Dimension | Value | Points |
|---|---|---|
| Business Type | Premium Wine Distributor | 5 |
| Role | Purchasing Manager | 4 |
| Purchasing Timeline | Short-Term (Within 30 Days) | 4 |
| **varTotalScore** | | **13** |

### 4.3 Expected Flow Behavior

| Step | Expected Behavior |
|---|---|
| Entry condition | `LeadSource` = `Céleste Vineyards - Business Inquiry Form` — Flow fires |
| Gatekeeper | `Business_Type__c` = `Premium Wine Distributor` — qualified path |
| Business Type scoring | `varTotalScore` Add 5 → `varTotalScore` = 5 |
| Role scoring | `varTotalScore` Add 4 → `varTotalScore` = 9 |
| Timeline scoring | `varTotalScore` Add 4 → `varTotalScore` = 13 |
| Priority assignment | `varTotalScore` = 13 ≥ 12 — High outcome — `varPriorityLevel` = High |
| OwnerId initialization | `varOwnerID` = West_Coast_Region Queue ID |
| Escalation decision | `varPriorityLevel` = High — Is High — `varOwnerID` overwritten with Sophia Delgado User ID |
| Update Records | `OwnerId` = Sophia Delgado, `Priority_Level__c` = High, `Qualified__c` = True |

### 4.4 Expected Lead Record State

| Field | Expected Value |
|---|---|
| `Priority_Level__c` | High |
| `Qualified__c` | True |
| `Qualification_Status__c` | ✅ Qualified |
| `OwnerId` | Sophia Delgado |
| `Region__c` | West Coast |

---

## 5. S-03 — Non-Qualified Lead, Disqualified

### 5.1 Input Values

| Field | Value |
|---|---|
| First Name | Dylan |
| Last Name | Moss |
| Email | dylan.moss@mailinator.com |
| Phone | +13185559876 |
| State | Louisiana |
| Business Type | Personal/Individual (Non-Business) |
| Role | *(hidden — not submitted)* |
| Purchasing Timeline | *(hidden — not submitted)* |

### 5.2 Expected Make.com Behavior

| Step | Expected Behavior |
|---|---|
| Router evaluation | `business_type` = `Personal/Individual (Non-Business)` — Route 2 |
| Module 13 | `Role__c` = `Not Applicable`, `Purchasing_Timeline__c` = `Not Applicable`, `Priority_Level__c` = `Not Applicable` |

### 5.3 Expected Flow Behavior

| Step | Expected Behavior |
|---|---|
| Entry condition | `LeadSource` = `Céleste Vineyards - Business Inquiry Form` — Flow fires |
| Gatekeeper | `Business_Type__c` = `Personal/Individual (Non-Business)` — Gatekeeper Fail outcome |
| Disqualification | `varQualified` = False — Flow routes to End |
| No further elements execute | Scoring, priority assignment, escalation, Update Records all bypassed |

### 5.4 Expected Lead Record State

| Field | Expected Value |
|---|---|
| `Business_Type__c` | Personal/Individual (Non-Business) |
| `Role__c` | Not Applicable |
| `Purchasing_Timeline__c` | Not Applicable |
| `Priority_Level__c` | Not Applicable |
| `Qualified__c` | True (Field default) |
| `Qualification_Status__c` | ❌ Disqualified |
| `OwnerId` | pdesa (Central_Region) |
| `Region__c` | Central |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 5 — Validation and Evidence |
| File Path | docs/06-build-assets/test-scenarios.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/06-build-assets/uat-matrix.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
