# Priority and Routing Results

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document records the expected and actual output values for each test Lead Record after the full automation pipeline executed. It serves as the authoritative evidence that the system produced correct outputs for all three validation scenarios.

---

## 2. S-01 — Richard Miranda — Expected vs. Actual

| Field | Expected | Actual | Match |
|---|---|---|---|
| `Business_Type__c` | Specialty Gourmet Grocer | Specialty Gourmet Grocer | ✅ |
| `Role__c` | Sales Manager | Sales Manager | ✅ |
| `Purchasing_Timeline__c` | Budget Planning (Future Quarter) | Budget Planning (Future Quarter) | ✅ |
| `varTotalScore` | 6 | 6 | ✅ |
| `Priority_Level__c` | Low | Low | ✅ |
| `Qualified__c` | True | True | ✅ |
| `Qualification_Status__c` | ✅ Qualified | ✅ Qualified | ✅ |
| `OwnerId` | Inava (East_Coast_Region) | Inava (East_Coast_Region) | ✅ |
| `Region__c` | East Coast | East Coast | ✅ |
| `Phone` | +1 (404) 447-4092 | +1 (404) 447-4092 | ✅ |
| `LeadSource` | Céleste Vineyards - Business Inquiry Form | Céleste Vineyards - Business Inquiry Form | ✅ |

---

## 3. S-02 — Neil Thompson — Expected vs. Actual

| Field | Expected | Actual | Match |
|---|---|---|---|
| `Business_Type__c` | Premium Wine Distributor | Premium Wine Distributor | ✅ |
| `Role__c` | Purchasing Manager | Purchasing Manager | ✅ |
| `Purchasing_Timeline__c` | Short-Term (Within 30 Days) | Short-Term (Within 30 Days) | ✅ |
| `varTotalScore` | 13 | 13 | ✅ |
| `Priority_Level__c` | High | High | ✅ |
| `Qualified__c` | True | True | ✅ |
| `Qualification_Status__c` | ✅ Qualified | ✅ Qualified | ✅ |
| `OwnerId` | Sophia Delgado | Sophia Delgado | ✅ |
| `Region__c` | West Coast | West Coast | ✅ |
| `LeadSource` | Céleste Vineyards - Business Inquiry Form | Céleste Vineyards - Business Inquiry Form | ✅ |

---

## 4. S-03 — Dylan Moss — Expected vs. Actual

| Field | Expected | Actual | Match |
|---|---|---|---|
| `Business_Type__c` | Personal/Individual (Non-Business) | Personal/Individual (Non-Business) | ✅ |
| `Role__c` | Not Applicable | Not Applicable | ✅ |
| `Purchasing_Timeline__c` | Not Applicable | Not Applicable | ✅ |
| `Priority_Level__c` | Not Applicable | Not Applicable | ✅ |
| `Qualified__c` | True (Field default) | True | ✅ |
| `Qualification_Status__c` | ❌ Disqualified | ❌ Disqualified | ✅ |
| `OwnerId` | pdesa (Central_Region) | pdesa (Central_Region) | ✅ |
| `Region__c` | Central | Central | ✅ |
| `LeadSource` | Céleste Vineyards - Business Inquiry Form | Céleste Vineyards - Business Inquiry Form | ✅ |

---

## 5. Results Summary

| Scenario | Fields Tested | Fields Passed | Fields Failed |
|---|---|---|---|
| S-01 — Richard Miranda | 11 | 11 | 0 |
| S-02 — Neil Thompson | 10 | 10 | 0 |
| S-03 — Dylan Moss | 9 | 9 | 0 |
| **Total** | **30** | **30** | **0** |

All 30 Field-level assertions passed. The system produced correct outputs across all three paths.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | test-artifacts/expected-results/priority-routing-results.md |
| Date Produced | 2026-03-23 |
| Next Document | test-artifacts/uat-evidence/uat-session-log.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
