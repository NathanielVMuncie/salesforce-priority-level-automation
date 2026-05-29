# UAT Session Log

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Validation and Evidence

---

## 1. Document Purpose

This document records the User Acceptance Testing session for the Céleste Vineyards Lead Priority Level Automation system. It covers the test environment, the five canonical Lead Records used for validation, the expected output for each, the actual output confirmed via live Record inspection and Flow debug logs, and the overall coverage result.

The canonical validation set is five Lead Records — L-01 through L-05 — covering all three Priority Levels, all three territorial regions, and both routing outcomes. No fault path is demonstrated by a canonical record. Fault path behavior is documented as defensive architecture in `docs/02-architecture/automation-architecture.md`.

---

## 2. Test Environment

| Attribute | Value |
|---|---|
| Salesforce Org | `celeste-vineyards-dev-ed.develop.my.salesforce.com` |
| Org Alias | `celeste-dev` |
| API Version | v66.0 |
| Flow | `Lead_Scoring_and_Priority_Level_Assignment` — V26 |
| Assignment Rule | `regional_territory_assignment` |
| Make.com Scenario | `Wix_To_CelesteProd_B2B_Lead_Engine_v1` |
| Entry Condition | `LeadSource` = `Céleste Vineyards - Business Inquiry Form` |

---

## 3. License Rotation Sequence

The Developer Edition org supports one active Standard User license at a time. Lead Records were created in the following sequence to ensure the correct Sales Representative held the active license at the time of each Record creation, producing a named user Assignment Rule output for their territory.

| Step | Licensed User | Records Created |
|---|---|---|
| 1 | Luis Navarro | L-01, L-04 |
| 2 | Jordan Chen | L-02, L-05 |
| 3 | Priya Desai | L-03 |

Total license swaps: 2.

---

## 4. Test Scenario Definitions

### 4.1 L-01 — Marcus Thibodeau

| Field | Value |
|---|---|
| State | Georgia |
| `Business_Type__c` | `Premium Wine Distributor` |
| `Role__c` | `Owner` |
| `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Premium Wine Distributor` | 5 |
| Tier 2 | `Role__c` | `Owner` | 5 |
| Tier 3 | `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` | 4 |
| **Total** | | | **14** |

**Expected Outputs:**

| Attribute | Expected Value |
|---|---|
| `varTotalScore` | 14 |
| `Priority_Level__c` | `High` |
| `Region__c` | `East Coast` |
| Assignment Rule Output | Luis Navarro |
| Flow Escalation | Yes — Sophia Delgado |
| Final `OwnerId` | Sophia Delgado |

---

### 4.2 L-02 — Renata Voss

| Field | Value |
|---|---|
| State | Oregon |
| `Business_Type__c` | `Premium Wine Distributor` |
| `Role__c` | `Purchasing Manager` |
| `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Premium Wine Distributor` | 5 |
| Tier 2 | `Role__c` | `Purchasing Manager` | 4 |
| Tier 3 | `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` | 4 |
| **Total** | | | **13** |

**Expected Outputs:**

| Attribute | Expected Value |
|---|---|
| `varTotalScore` | 13 |
| `Priority_Level__c` | `High` |
| `Region__c` | `West Coast` |
| Assignment Rule Output | Jordan Chen |
| Flow Escalation | Yes — Sophia Delgado |
| Final `OwnerId` | Sophia Delgado |

---

### 4.3 L-03 — Dominic Reyes

| Field | Value |
|---|---|
| State | Illinois |
| `Business_Type__c` | `Upscale Restaurant` |
| `Role__c` | `General Manager` |
| `Purchasing_Timeline__c` | `Evaluating Vendors (Next 90 Days)` |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Upscale Restaurant` | 3 |
| Tier 2 | `Role__c` | `General Manager` | 3 |
| Tier 3 | `Purchasing_Timeline__c` | `Evaluating Vendors (Next 90 Days)` | 3 |
| **Total** | | | **9** |

**Expected Outputs:**

| Attribute | Expected Value |
|---|---|
| `varTotalScore` | 9 |
| `Priority_Level__c` | `Medium` |
| `Region__c` | `Central` |
| Assignment Rule Output | Priya Desai |
| Flow Escalation | No |
| Final `OwnerId` | Priya Desai |

---

### 4.4 L-04 — Janelle Harmon

| Field | Value |
|---|---|
| State | Virginia |
| `Business_Type__c` | `High-End Wine Store` |
| `Role__c` | `Sales Manager` |
| `Purchasing_Timeline__c` | `Budget Planning (Future Quarter)` |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `High-End Wine Store` | 4 |
| Tier 2 | `Role__c` | `Sales Manager` | 2 |
| Tier 3 | `Purchasing_Timeline__c` | `Budget Planning (Future Quarter)` | 2 |
| **Total** | | | **8** |

**Expected Outputs:**

| Attribute | Expected Value |
|---|---|
| `varTotalScore` | 8 |
| `Priority_Level__c` | `Medium` |
| `Region__c` | `East Coast` |
| Assignment Rule Output | Luis Navarro |
| Flow Escalation | No |
| Final `OwnerId` | Luis Navarro |

---

### 4.5 L-05 — Britta Sandoval

| Field | Value |
|---|---|
| State | Washington |
| `Business_Type__c` | `Catering & Event Company` |
| `Role__c` | `Event Coordinator` |
| `Purchasing_Timeline__c` | `Information Gathering` |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Catering & Event Company` | 1 |
| Tier 2 | `Role__c` | `Event Coordinator` | 1 |
| Tier 3 | `Purchasing_Timeline__c` | `Information Gathering` | 1 |
| **Total** | | | **3** |

**Expected Outputs:**

| Attribute | Expected Value |
|---|---|
| `varTotalScore` | 3 |
| `Priority_Level__c` | `Low` |
| `Region__c` | `West Coast` |
| Assignment Rule Output | Jordan Chen |
| Flow Escalation | No |
| Final `OwnerId` | Jordan Chen |

---

## 5. Execution Results

All five Lead Records were created through the Make.com scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1`. Flow debug logs were captured for each execution. Actual outputs were confirmed via live Lead Record inspection in the org.

| Lead | `varTotalScore` | `Priority_Level__c` | `Region__c` | Flow Escalation | Final `OwnerId` | Result |
|---|---|---|---|---|---|---|
| L-01 — Marcus Thibodeau | 14 | `High` | `East Coast` | Yes | Sophia Delgado | ✅ Pass |
| L-02 — Renata Voss | 13 | `High` | `West Coast` | Yes | Sophia Delgado | ✅ Pass |
| L-03 — Dominic Reyes | 9 | `Medium` | `Central` | No | Priya Desai | ✅ Pass |
| L-04 — Janelle Harmon | 8 | `Medium` | `East Coast` | No | Luis Navarro | ✅ Pass |
| L-05 — Britta Sandoval | 3 | `Low` | `West Coast` | No | Jordan Chen | ✅ Pass |

All five scenarios passed. No unexpected outcomes. All actual outputs matched expected outputs exactly.

---

## 6. Coverage Summary

| Coverage Dimension | Leads | Result |
|---|---|---|
| Priority Level `High` — escalation confirmed | L-01, L-02 | ✅ Pass |
| Priority Level `Medium` — no escalation confirmed | L-03, L-04 | ✅ Pass |
| Priority Level `Low` — no escalation confirmed | L-05 | ✅ Pass |
| East Coast territory routing | L-01, L-04 | ✅ Pass |
| West Coast territory routing | L-02, L-05 | ✅ Pass |
| Central territory routing | L-03 | ✅ Pass |
| `Region__c` formula resolution — all records | L-01 through L-05 | ✅ Pass |
| Single DML write — `Update Lead Priority and Score` | L-01 through L-05 | ✅ Pass |
| `varOwnerID` escalation override — Priority Level High | L-01, L-02 | ✅ Pass |
| `varOwnerID` retention — Priority Level Medium and Low | L-03, L-04, L-05 | ✅ Pass |

---

## 7. Defect Reference

One defect was identified and resolved during the build phase, prior to canonical UAT execution. The canonical records L-01 through L-05 were created after the defect was resolved. All canonical UAT results are clean.

| Defect ID | Status |
|---|---|
| D-01 | ✅ Resolved — see `test-artifacts/defects.md` |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Validation and Evidence |
| File Path | `test-artifacts/uat-session-log.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
