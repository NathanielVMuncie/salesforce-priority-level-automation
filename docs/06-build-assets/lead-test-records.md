# Lead Test Records

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Build Assets

---

## 1. Document Purpose

This document defines the five canonical Lead Records used to validate the Céleste Vineyards Lead Priority Level Automation system. Each record is constructed with a specific score composition, territory, and expected owner to confirm all happy paths across the scoring model, priority thresholds, escalation logic, and territorial routing.

These records represent the complete canonical validation set. No fault path is demonstrated by a canonical record. Fault path behavior is documented as defensive architecture in `docs/02-architecture/automation-architecture.md`.

---

## 2. Canonical Lead Set

| ID | Name | Email | Phone | Priority | Score | Territory | Final Owner |
|---|---|---|---|---|---|---|---|
<<<<<<< HEAD
| L-01 | Marcus Thibodeau | m.thibodeau@thibodeauwines.com | +1 (404) 882-3317 | High | 14 | East Coast | Sophia Delgado |
| L-02 | Renata Voss | r.voss@pacificcrestwine.com | +1 (503) 741-6290 | High | 13 | West Coast | Sophia Delgado |
| L-03 | Dominic Reyes | d.reyes@greystonekitchen.com | +1 (312) 558-4473 | Medium | 9 | Central | Priya Desai |
| L-04 | Janelle Harmon | j.harmon@harmonfinewines.com | +1 (571) 334-8851 | Medium | 8 | East Coast | Luis Navarro |
| L-05 | Britta Sandoval | b.sandoval@pacificeventscatering.com | +1 (206) 917-3042 | Low | 3 | West Coast | Jordan Chen |
=======
| L-01 | Marcus Thibodeau | m.thibodeau@thibodeauwines.com | +1 (404) 882-3317 | High | 14 | East Coast Region | Sophia Delgado |
| L-02 | Renata Voss | r.voss@pacificcrestwine.com | +1 (503) 741-6290 | High | 13 | West Coast Region | Sophia Delgado |
| L-03 | Dominic Reyes | d.reyes@greystonekitchen.com | +1 (312) 558-4473 | Medium | 9 | Central Region | Priya Desai |
| L-04 | Janelle Harmon | j.harmon@harmonfinewines.com | +1 (571) 334-8851 | Medium | 8 | East Coast Region | Luis Navarro |
| L-05 | Britta Sandoval | b.sandoval@pacificeventscatering.com | +1 (206) 917-3042 | Low | 3 | West Coast Region | Jordan Chen |

>>>>>>> 157c524 (lead-test-records.md)
---

## 3. Lead Record Definitions

### L-01 — Marcus Thibodeau

| Field | Value |
|---|---|
| First Name | Marcus |
| Last Name | Thibodeau |
| Company | Thibodeau Premier Wines |
| Email | m.thibodeau@thibodeauwines.com |
| Phone | +1 (404) 882-3317 |
| State | Georgia |
| `Business_Type__c` | `Premium Wine Distributor` |
| `Role__c` | `Owner` |
| `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` |
| `Customer_Note__c` | Looking to expand our distribution portfolio with premium labels for the Southeast market. Interested in volume pricing and exclusivity options. |
| `varTotalScore` | 14 |
| `Priority_Level__c` | `High` |
| Assignment Rule Output | `East Coast Region Queue` → Flow escalates to Sophia Delgado |
| Final `OwnerId` | Sophia Delgado |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Premium Wine Distributor` | 5 |
| Tier 2 | `Role__c` | `Owner` | 5 |
| Tier 3 | `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` | 4 |
| **Total** | | | **14** |

---

### L-02 — Renata Voss

| Field | Value |
|---|---|
| First Name | Renata |
| Last Name | Voss |
| Company | Pacific Crest Wine Group |
| Email | r.voss@pacificcrestwine.com |
| Phone | +1 (503) 741-6290 |
| State | Oregon |
| `Business_Type__c` | `Premium Wine Distributor` |
| `Role__c` | `Purchasing Manager` |
| `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` |
| `Customer_Note__c` | Evaluating new supplier partnerships for our Pacific Northwest accounts. Interested in your allocation model and lead times. |
| `varTotalScore` | 13 |
| `Priority_Level__c` | `High` |
| Assignment Rule Output | `West Coast Region Queue` → Flow escalates to Sophia Delgado |
| Final `OwnerId` | Sophia Delgado |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Premium Wine Distributor` | 5 |
| Tier 2 | `Role__c` | `Purchasing Manager` | 4 |
| Tier 3 | `Purchasing_Timeline__c` | `Short-Term (Within 30 Days)` | 4 |
| **Total** | | | **13** |

---

### L-03 — Dominic Reyes

| Field | Value |
|---|---|
| First Name | Dominic |
| Last Name | Reyes |
| Company | The Greystone Kitchen |
| Email | d.reyes@greystonekitchen.com |
| Phone | +1 (312) 558-4473 |
| State | Illinois |
| `Business_Type__c` | `Upscale Restaurant` |
| `Role__c` | `General Manager` |
| `Purchasing_Timeline__c` | `Evaluating Vendors (Next 90 Days)` |
| `Customer_Note__c` | Reviewing wine program options for our seasonal menu refresh. Looking for a reliable supplier with flexible ordering minimums. |
| `varTotalScore` | 9 |
| `Priority_Level__c` | `Medium` |
| Assignment Rule Output | Priya Desai |
| Final `OwnerId` | Priya Desai |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Upscale Restaurant` | 3 |
| Tier 2 | `Role__c` | `General Manager` | 3 |
| Tier 3 | `Purchasing_Timeline__c` | `Evaluating Vendors (Next 90 Days)` | 3 |
| **Total** | | | **9** |

---

### L-04 — Janelle Harmon

| Field | Value |
|---|---|
| First Name | Janelle |
| Last Name | Harmon |
| Company | Harmon Fine Wines & Spirits |
| Email | j.harmon@harmonfinewines.com |
| Phone | +1 (571) 334-8851 |
| State | Virginia |
| `Business_Type__c` | `High-End Wine Store` |
| `Role__c` | `Sales Manager` |
| `Purchasing_Timeline__c` | `Budget Planning (Future Quarter)` |
| `Customer_Note__c` | Planning next fiscal year's premium wine inventory. Would like to understand your wholesale pricing tiers and minimum order requirements. |
| `varTotalScore` | 8 |
| `Priority_Level__c` | `Medium` |
| Assignment Rule Output | Luis Navarro |
| Final `OwnerId` | Luis Navarro |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `High-End Wine Store` | 4 |
| Tier 2 | `Role__c` | `Sales Manager` | 2 |
| Tier 3 | `Purchasing_Timeline__c` | `Budget Planning (Future Quarter)` | 2 |
| **Total** | | | **8** |

---

### L-05 — Britta Sandoval

| Field | Value |
|---|---|
| First Name | Britta |
| Last Name | Sandoval |
| Company | Pacific Events & Catering |
| Email | b.sandoval@pacificeventscatering.com |
| Phone | +1 (206) 917-3042 |
| State | Washington |
| `Business_Type__c` | `Catering & Event Company` |
| `Role__c` | `Event Coordinator` |
| `Purchasing_Timeline__c` | `Information Gathering` |
| `Customer_Note__c` | Gathering information on wine options for corporate event packages. No immediate purchase planned — exploring for future events. |
| `varTotalScore` | 3 |
| `Priority_Level__c` | `Low` |
| Assignment Rule Output | Jordan Chen |
| Final `OwnerId` | Jordan Chen |

**Score Composition:**

| Tier | Field | Value | Points |
|---|---|---|---|
| Tier 1 | `Business_Type__c` | `Catering & Event Company` | 1 |
| Tier 2 | `Role__c` | `Event Coordinator` | 1 |
| Tier 3 | `Purchasing_Timeline__c` | `Information Gathering` | 1 |
| **Total** | | | **3** |

---

## 4. Territory and Routing Summary

| Lead | State | Territory | Assignment Rule Output | Flow Escalation | Final Owner |
|---|---|---|---|---|---|
| L-01 | Georgia | East Coast Region | East Coast Region Queue | Yes — escalates to Sophia Delgado | Sophia Delgado |
| L-02 | Oregon | West Coast Region | West Coast Region Queue | Yes — escalates to Sophia Delgado | Sophia Delgado |
| L-03 | Illinois | Central Region | Priya Desai | No | Priya Desai |
| L-04 | Virginia | East Coast Region | Luis Navarro | No | Luis Navarro |
| L-05 | Washington | West Coast Region | Jordan Chen | No | Jordan Chen |

---

## 5. License Rotation Sequence

Lead Records must be created in the following order to ensure each owner holds a valid Salesforce license at the time of record creation. Only one user holds a Standard License at any given moment. The licensed user’s own territory receives leads directly; all other territories are represented by queues.

| Step | Licensed User | Records Created | Assignment Rule Behaviour |
|------|---------------|----------------|---------------------------|
| 1 | Sophia Delgado | L‑01, L‑02 | All leads go to territory queues; High priority leads escalate to Sophia |
| 2 | Swap Sophia → Priya Desai | L‑03 | Central Region leads go directly to Priya; other regions go to queues |
| 3 | Swap Priya → Luis Navarro | L‑04 | East Coast Region leads go directly to Luis; other regions go to queues |
| 4 | Swap Luis → Jordan Chen | L‑05 | West Coast Region leads go directly to Jordan; other regions go to queues |

**Total license swaps:** 3

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Build Assets |
| File Path | `docs/06-build-assets/lead-test-records.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*