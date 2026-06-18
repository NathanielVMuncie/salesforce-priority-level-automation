# Screenshots Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Validation and Evidence

---

## 1. Document Purpose

This document catalogs every screenshot required to provide photographic evidence for the Céleste Vineyards Lead Priority Level Automation portfolio case study. Screenshots span all three pipeline layers — Wix, Make.com, and Salesforce — and the UAT validation set.

Each entry is assigned a unique ID, a canonical filename, and a description of what the screenshot proves. Screenshot files are stored in `assets/screenshots/`.

---

## 2. Screenshot Inventory

### 2.1 Wix — Gatekeeper and Automation Configuration

| ID | Filename | Component | Evidences |
|---|---|---|---|
| `WIX-001` | `wix-form-b2b-active.png` | Inquiry form — B2B selection | Form is fully displayed with all fields active and the submit button enabled when a business type is selected. Confirms the Gatekeeper passes qualified submissions. |
| `WIX-002` | `wix-form-gate-triggered.png` | Inquiry form — qualification gate | Form is collapsed, required fields are hidden, and the submit button is disabled when Personal/Individual (Non-Business) is selected. Confirms no disqualified payload reaches Make.com. |
| `WIX-003` | `wix-automation-webhook.png` | Wix Automation — HTTP POST trigger | Wix Automation rule configuration showing the HTTP POST action targeting the `WH_Wix_Inquiry_To_Make` webhook URL. Confirms the form-to-Make.com transmission layer. |

### 2.2 Make.com — Middleware Pipeline

| ID | Filename | Component | Evidences |
|---|---|---|---|
| `MK-001` | `make-scenario-canvas.png` | Scenario canvas — `Wix_Inquiry_To_Salesforce_Lead` | Full two-module scenario canvas. Confirms the pipeline is a linear two-module path with no Router and no branching. |
| `MK-002` | `make-module-webhook.png` | `WH_Wix_Inquiry_To_Make` — webhook module | Module configuration showing the webhook URL and incoming payload structure. Confirms the receive endpoint and data contract from Wix. |
| `MK-003` | `make-module-salesforce-mapping.png` | `SF_Make_Lead_To_Salesforce` — field mapping | Module configuration showing the complete field mapping from Wix payload keys to Salesforce Lead field API names, hardcoded `LeadSource`, and phone normalization formula. |
| `MK-004` | `make-execution-history.png` | Scenario execution history | Successful scenario execution run log. Confirms the pipeline processed at least one submission end-to-end without error. |

### 2.3 Salesforce — Data Model

| ID | Filename | Component | Evidences |
|---|---|---|---|
| `SF-DM-001` | `sf-lead-fields-list.png` | Lead Object — custom field list (Setup) | Object Manager view of custom fields on the Lead Object. Confirms `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Priority_Level__c`, `Customer_Note__c`, `Region__c`, and `Lead_Created__c` exist in the org. |
| `SF-DM-002` | `sf-field-business-type-picklist.png` | `Business_Type__c` — picklist values | Field configuration showing all picklist values for `Business_Type__c`. Confirms values align with the scoring model Tier 1 inputs. |
| `SF-DM-003` | `sf-field-role-picklist.png` | `Role__c` — picklist values | Field configuration showing all picklist values for `Role__c`. Confirms values align with the scoring model Tier 2 inputs. |
| `SF-DM-004` | `sf-field-purchasing-timeline-picklist.png` | `Purchasing_Timeline__c` — picklist values | Field configuration showing all picklist values for `Purchasing_Timeline__c`. Confirms values align with the scoring model Tier 3 inputs. |
| `SF-DM-005` | `sf-field-priority-level-picklist.png` | `Priority_Level__c` — picklist values | Field configuration showing picklist values `High`, `Medium`, and `Low`. Confirms the restricted picklist is defined correctly as the Flow output target. |
| `SF-DM-006` | `sf-field-region-formula.png` | `Region__c` — formula definition | Formula field configuration showing the CASE statement on `State/Province`. Confirms `Region__c` is a self-resolving formula field not written by the Flow or Assignment Rule. |

### 2.4 Salesforce — Flow

| ID | Filename | Component | Evidences |
|---|---|---|---|
| `SF-FL-001` | `sf-flow-canvas.png` | Flow canvas — `Lead_Scoring_and_Priority_Level_Assignment` (V26) | Full canvas view showing all 26 elements in sequence. Confirms the complete scoring, priority assignment, escalation, and DML write structure. |
| `SF-FL-002` | `sf-flow-trigger.png` | Flow trigger and entry criteria | Start element configuration showing the After-Save trigger on Lead creation filtered to `LeadSource` equals `Céleste Vineyards - Business Inquiry Form`. |
| `SF-FL-003` | `sf-flow-variables.png` | Flow variables panel | Variables panel showing `varTotalScore` (Number), `varPriorityLevel` (Text), and `varOwnerID` (Text). Confirms the three Flow variables and their types. |
| `SF-FL-004` | `sf-flow-decision-business-type.png` | `Determine Business Type Score` Decision element | Decision configuration showing all five outcome branches mapped to `Business_Type__c` picklist values and their corresponding point Assignment elements. |
| `SF-FL-005` | `sf-flow-decision-role.png` | `Determine Role Score` Decision element | Decision configuration showing all five outcome branches mapped to `Role__c` picklist values and their corresponding point Assignment elements. |
| `SF-FL-006` | `sf-flow-decision-purchasing-timeline.png` | `Determine Purchasing Timeline Score` Decision element | Decision configuration showing all five outcome branches mapped to `Purchasing_Timeline__c` picklist values and their corresponding point Assignment elements. |
| `SF-FL-007` | `sf-flow-decision-priority-level.png` | `Determine Priority Level` Decision element | Decision configuration showing `Is Priority Level High` (≥ 12), `Is Priority Level Medium` (≥ 8), and default `Is Priority Level Low` outcome branches evaluated against `varTotalScore`. |
| `SF-FL-008` | `sf-flow-assignment-initialize-owner.png` | `Initialize OwnerId Default` Assignment element | Assignment element configuration showing `varOwnerID` set to `{!$Record.OwnerId}`. Confirms the Assignment Rule Queue value is captured before escalation logic runs. |
| `SF-FL-009` | `sf-flow-decision-escalation.png` | `Is High - Escalate` Decision element | Decision configuration showing the `Is Not High` and `Is High - Escalate` outcome branches evaluated against `varPriorityLevel`. |
| `SF-FL-010` | `sf-flow-assignment-escalate-sophia.png` | `Escalate OwnerId to Sophia` Assignment element | Assignment element configuration showing `varOwnerID` set to Sophia Delgado's User ID. Confirms the Priority Level `High` `OwnerId` override. |
| `SF-FL-011` | `sf-flow-update-records.png` | `Update Lead Priority and Score` Update Records element | Update Records element configuration showing `OwnerId` and `Priority_Level__c` as the only two fields written. Confirms the single-DML pattern. |

### 2.5 Salesforce — Routing

| ID | Filename | Component | Evidences |
|---|---|---|---|
| `SF-RT-001` | `sf-assignment-rule-list.png` | Assignment Rule list view | Setup view showing `regional_territory_assignment` as the active default Assignment Rule for the Lead Object. |
| `SF-RT-002` | `sf-assignment-rule-entries.png` | Assignment Rule — rule entries | Rule entry detail showing all three territory criteria entries covering East Coast, West Coast, and Central regions by `State/Province`. Confirms full 50-state coverage. |
| `SF-RT-003` | `sf-queues-list.png` | Queue list view | Setup view showing `East Coast Region`, `West Coast Region`, and `Central Region` queues. Confirms Queue Labels match the live org. |
| `SF-RT-004` | `sf-queue-member-example.png` | Queue member configuration | Member configuration for one Queue (example: `East Coast Region`) showing the supported object (Lead) and assigned user or fallback configuration. |

### 2.6 UAT Evidence — Lead Records

One Lead Record detail view is required per canonical Lead. Each view must display `Priority_Level__c`, `Region__c`, and `OwnerId` (Owner) to confirm all three automation outputs.

| ID | Filename | Lead | Priority Level | Final Owner | Evidences |
|---|---|---|---|---|---|
| `UAT-REC-L01` | `uat-record-l01-thibodeau.png` | L-01 — Marcus Thibodeau | `High` | Sophia Delgado | Confirms Priority Level `High` assignment and Flow escalation override to Sophia Delgado for an East Coast Lead. |
| `UAT-REC-L02` | `uat-record-l02-voss.png` | L-02 — Renata Voss | `High` | Sophia Delgado | Confirms Priority Level `High` assignment and Flow escalation override to Sophia Delgado for a West Coast Lead. |
| `UAT-REC-L03` | `uat-record-l03-reyes.png` | L-03 — Dominic Reyes | `Medium` | Priya Desai | Confirms Priority Level `Medium` assignment and Central territory routing with no escalation. |
| `UAT-REC-L04` | `uat-record-l04-harmon.png` | L-04 — Janelle Harmon | `Medium` | Luis Navarro | Confirms Priority Level `Medium` assignment and East Coast territory routing with no escalation. Boundary score of 8. |
| `UAT-REC-L05` | `uat-record-l05-sandoval.png` | L-05 — Britta Sandoval | `Low` | Jordan Chen | Confirms Priority Level `Low` assignment and West Coast territory routing with no escalation. Minimum score of 3. |

### 2.7 UAT Evidence — Flow Debug Logs

One Flow debug log is required per canonical Lead. Each log must display the execution path through `Lead_Scoring_and_Priority_Level_Assignment` (V26), confirming variable values and element traversal.

| ID | Filename | Lead | Score | Escalated | Evidences |
|---|---|---|---|---|---|
| `UAT-DBG-L01` | `uat-debug-l01-thibodeau.png` | L-01 — Marcus Thibodeau | 14 | Yes | Confirms `varTotalScore` = 14, `varPriorityLevel` = `High`, `varOwnerID` override to Sophia Delgado's User ID. |
| `UAT-DBG-L02` | `uat-debug-l02-voss.png` | L-02 — Renata Voss | 13 | Yes | Confirms `varTotalScore` = 13, `varPriorityLevel` = `High`, `varOwnerID` override to Sophia Delgado's User ID. |
| `UAT-DBG-L03` | `uat-debug-l03-reyes.png` | L-03 — Dominic Reyes | 9 | No | Confirms `varTotalScore` = 9, `varPriorityLevel` = `Medium`, `varOwnerID` retained as `Central_Region` Queue value. |
| `UAT-DBG-L04` | `uat-debug-l04-harmon.png` | L-04 — Janelle Harmon | 8 | No | Confirms `varTotalScore` = 8, `varPriorityLevel` = `Medium`, `varOwnerID` retained as `East_Coast_Region` Queue value. Boundary score confirmed. |
| `UAT-DBG-L05` | `uat-debug-l05-sandoval.png` | L-05 — Britta Sandoval | 3 | No | Confirms `varTotalScore` = 3, `varPriorityLevel` = `Low`, `varOwnerID` retained as `West_Coast_Region` Queue value. |

---

## 3. Coverage Summary

| Coverage Dimension | Screenshot IDs | Count |
|---|---|---|
| Wix Gatekeeper — both states | `WIX-001`, `WIX-002` | 2 |
| Wix Automation transmission | `WIX-003` | 1 |
| Make.com two-module pipeline | `MK-001`, `MK-002`, `MK-003`, `MK-004` | 4 |
| Salesforce custom field inventory | `SF-DM-001` | 1 |
| Scoring model picklist configurations | `SF-DM-002`, `SF-DM-003`, `SF-DM-004` | 3 |
| Priority Level and Region formula fields | `SF-DM-005`, `SF-DM-006` | 2 |
| Flow structure and element configuration | `SF-FL-001` through `SF-FL-011` | 11 |
| Assignment Rule and Queue configuration | `SF-RT-001`, `SF-RT-002`, `SF-RT-003`, `SF-RT-004` | 4 |
| UAT Lead Record output confirmation | `UAT-REC-L01` through `UAT-REC-L05` | 5 |
| UAT Flow debug log confirmation | `UAT-DBG-L01` through `UAT-DBG-L05` | 5 |
| **Total** | | **38** |

| UAT Validation Dimension | Lead(s) | Screenshot IDs |
|---|---|---|
| Priority Level `High` — escalation to Sophia Delgado | L-01, L-02 | `UAT-REC-L01`, `UAT-REC-L02`, `UAT-DBG-L01`, `UAT-DBG-L02` |
| Priority Level `Medium` — no escalation | L-03, L-04 | `UAT-REC-L03`, `UAT-REC-L04`, `UAT-DBG-L03`, `UAT-DBG-L04` |
| Priority Level `Low` — no escalation | L-05 | `UAT-REC-L05`, `UAT-DBG-L05` |
| East Coast territory routing | L-01, L-04 | `UAT-REC-L01`, `UAT-REC-L04` |
| West Coast territory routing | L-02, L-05 | `UAT-REC-L02`, `UAT-REC-L05` |
| Central territory routing | L-03 | `UAT-REC-L03` |
| `Region__c` formula resolution | L-01 through L-05 | `UAT-REC-L01` through `UAT-REC-L05` |
| `varOwnerID` escalation override — Priority Level `High` | L-01, L-02 | `UAT-DBG-L01`, `UAT-DBG-L02` |
| `varOwnerID` retention — Priority Level Medium and Low | L-03, L-04, L-05 | `UAT-DBG-L03`, `UAT-DBG-L04`, `UAT-DBG-L05` |
| Single DML write — `Update Lead Priority and Score` | L-01 through L-05 | `SF-FL-011` |
| Boundary score validation (score = 8, Priority Level `Medium`) | L-04 | `UAT-REC-L04`, `UAT-DBG-L04` |
| Minimum score validation (score = 3, Priority Level `Low`) | L-05 | `UAT-REC-L05`, `UAT-DBG-L05` |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Validation and Evidence |
| File Path | `test-artifacts/screenshots-index.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
