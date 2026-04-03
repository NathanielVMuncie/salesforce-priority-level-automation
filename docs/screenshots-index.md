# Screenshots Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 5 — Validation and Evidence

---

## 1. Document Purpose

This document serves as the index for all screenshots and visual assets captured during the build and validation of the Céleste Vineyards Lead Priority Level Automation system. It documents what each asset shows, which scenario or component it validates, and its location in the repository.

Screenshots are stored in `assets/screenshots/`. This index provides the reference map between each screenshot file and the build component it documents.

---

## 2. Asset Categories

| Category | Description |
|---|---|
| Wix Form | Inquiry form structure, conditional display logic, and front-end qualification gate |
| Make.com Configuration | Scenario canvas, Router routing, module field mapping, and execution logs |
| Salesforce — User Configuration | Profile permissions for Territory Managers and National Sales Director |
| Salesforce — Queues | Regional Queue definitions and member configuration |
| Salesforce — Assignment Rules | Lead Assignment Rule entries and territorial routing logic |
| Salesforce — Lightning Pages | Lead Record page layouts for Territory Manager and National Sales Director |
| Salesforce — Lead Records | Live Lead Records showing final field values after automation executed |
| Salesforce — Flow Configuration | Flow Builder canvas and element-level configuration |
| Salesforce — Flow Debug Logs | Debug log output confirming execution path and variable values |
| Salesforce — Object Manager | Custom field configuration on the Lead object |

---

## 3. Wix Form Screenshots

| File Name | Description | Validates |
|---|---|---|
| `wix-form-default-state.png` | Inquiry form — default state with all fields visible | Form structure, field layout, B2B field set |
| `wix-form-nonbusiness-selected.png` | Inquiry form — Personal/Individual selected, conditional rule fired | Role, Purchasing Timeline, Company fields hidden; disqualification message displayed |
| `wix-form-disqualification-message.png` | Close-up of disqualification message rendered on non-business selection | Front-end gatekeeper layer 1 confirmed |

---

## 4. Make.com Configuration Screenshots

| File Name | Description | Validates |
|---|---|---|
| `make-scenario-canvas.png` | Full Make.com scenario canvas — `Wix_To_CelesteProd_B2B_Lead_Engine_v1` | Four-module architecture: Webhook, Router, Module 12, Module 13 |
| `make-router-configuration.png` | Router module — Route 1 and Route 2 filter conditions | Qualified vs. non-qualified routing logic |
| `make-module12-field-mapping.png` | Module 12 field mapping configuration — qualified path | All standard and custom fields mapped; LeadSource hardcoded |
| `make-module12-phone-formula.png` | Module 12 phone normalization formula | Regex formula output: `+1 (xxx) xxx-xxxx` format |
| `make-module13-field-mapping.png` | Module 13 field mapping configuration — non-qualified path | Placeholder values for Role__c, Purchasing_Timeline__c, Priority_Level__c |
| `make-module12-execution.png` | Module 12 execution log — qualified path | S-01, S-02: Router directed to Module 12, all fields mapped, Record created |
| `make-module13-execution.png` | Module 13 execution log — non-qualified path | S-03: Router directed to Module 13, placeholder values written, Record created |

---

## 5. Salesforce — User and Profile Configuration

> **DevOrg License Context:** This system is built in a Salesforce Developer Edition org with a single Standard User license. That license is assigned to Sophia Delgado — National Sales Director. Territory Managers (regional reps) are represented by regional Queues and rotate the Standard User license as a proof-of-concept pattern. Screenshots reflect this DevOrg constraint accurately.

| File Name | Description | Validates |
|---|---|---|
| `profile-territory-manager.png` | Profile configuration for Territory Manager role — object permissions and field-level security on Lead custom fields | Territory Manager access scope: Read/Edit Lead, custom field visibility |
| `profile-national-sales-director.png` | Profile configuration for Sophia Delgado — National Sales Director | Full Lead object permissions; owner of escalated High priority Records |
| `user-sophia-delgado-record.png` | Sophia Delgado user record — active Standard User license assignment | Confirms the only active license in the DevOrg; escalation target user record |

---

## 6. Salesforce — Queue Configuration

| File Name | Description | Validates |
|---|---|---|
| `queue-east-coast-region.png` | East_Coast_Region Queue detail — supported objects, members | Queue supports Lead object; Territory Manager license rotation context |
| `queue-west-coast-region.png` | West_Coast_Region Queue detail — supported objects, members | Queue supports Lead object; Territory Manager license rotation context |
| `queue-central-region.png` | Central_Region Queue detail — supported objects, members | Queue supports Lead object; Territory Manager license rotation context |
| `queue-list-overview.png` | All three regional Queues in Queue list view | Full regional Queue set confirmed: East Coast, West Coast, Central |

---

## 7. Salesforce — Lead Assignment Rule

| File Name | Description | Validates |
|---|---|---|
| `assignment-rule-overview.png` | Lead Assignment Rule — all three rule entries in list view | Rule is active; three entries covering all 50 states and DC |
| `assignment-rule-entry-east-coast.png` | Rule Entry 1 — East Coast state list and Queue assignment | 20 states + DC mapped to East_Coast_Region |
| `assignment-rule-entry-west-coast.png` | Rule Entry 2 — West Coast state list and Queue assignment | 13 states mapped to West_Coast_Region |
| `assignment-rule-entry-central.png` | Rule Entry 3 — Central state list and Queue assignment | 18 states mapped to Central_Region |

---

## 8. Salesforce — Lightning Pages

| File Name | Description | Validates |
|---|---|---|
| `lightning-page-territory-manager.png` | Lead Record Lightning page — Territory Manager view | Custom fields surfaced: Priority_Level__c, Qualification_Status__c, Region__c, Lead_Score__c, Business_Type__c, Role__c, Purchasing_Timeline__c |
| `lightning-page-national-sales-director.png` | Lead Record Lightning page — National Sales Director view | Same custom field set; Owner field confirms Sophia Delgado on High priority Records |

---

## 9. Salesforce — Lead Records (Validation)

| File Name | Description | Scenario | Validates |
|---|---|---|---|
| `lead-richard-miranda-record.png` | Full Lead Record view — Richard Miranda | S-01 | Priority_Level__c = Low, Qualified__c = True, OwnerId = Inava (East_Coast_Region), Region__c = East Coast |
| `lead-neil-thompson-record.png` | Full Lead Record view — Neil Thompson | S-02 | Priority_Level__c = High, OwnerId = Sophia Delgado, Region__c = West Coast |
| `lead-dylan-moss-record.png` | Full Lead Record view — Dylan Moss | S-03 | Qualification_Status__c = ❌ Disqualified, Priority_Level__c = Not Applicable, OwnerId = pdesa (Central_Region) |

---

## 10. Salesforce — Flow Configuration

| File Name | Description | Component |
|---|---|---|
| `flow-builder-overview.png` | Flow Builder canvas — full Flow layout across all five segments | Flow — Lead_Scoring_and_Priority_Level_Assignment V7 |
| `flow-entry-condition.png` | Flow entry condition — LeadSource equals Céleste Vineyards - Business Inquiry Form | Confirms Flow scope is restricted to Wix inquiry pipeline |
| `flow-gatekeeper-decision.png` | Gatekeeper Decision element — all six outcomes including Gatekeeper Fail | Flow — Determine Business Type Score |
| `flow-role-scoring-decision.png` | Role scoring Decision element configuration | Flow — Determine Role Score |
| `flow-timeline-scoring-decision.png` | Purchasing Timeline scoring Decision element configuration | Flow — Determine Purchasing Timeline Score |
| `flow-priority-decision.png` | Priority Level Decision element — High, Medium, Low thresholds | Flow — Determine Priority Level |
| `flow-escalation-decision.png` | Escalation Decision element — Is High outcome routes to Sophia | Flow — Escalate High Priority to Sophia |
| `flow-update-records.png` | Update Records element — OwnerId, Priority_Level__c, Qualified__c | Flow — Update Lead Priority and Score; DML count = 1 |

---

## 11. Salesforce — Flow Debug Logs

| File Name | Description | Scenario | Validates |
|---|---|---|---|
| `debug-richard-miranda-flow.png` | Flow debug log — Richard Miranda | S-01 | varTotalScore = 6, Low outcome, no escalation, DML count = 1 |
| `debug-neil-thompson-flow.png` | Flow debug log — Neil Thompson | S-02 | varTotalScore = 13, High outcome, escalation fired, Sophia Delgado OwnerId written, DML count = 1 |
| `debug-dylan-moss-flow.png` | Flow debug log — Dylan Moss | S-03 | Gatekeeper Fail outcome, Flow terminated at End, no scoring elements executed |

---

## 12. Salesforce — Object Manager

| File Name | Description | Component |
|---|---|---|
| `object-manager-custom-fields-list.png` | Lead object — custom fields list showing all custom fields in this build | Confirms all custom fields exist on Lead object |
| `object-manager-qualified-field.png` | Qualified__c field configuration — default value = True (Checked) | Defect D-01 resolution confirmed |
| `object-manager-qualification-status-formula.png` | Qualification_Status__c formula field configuration | IF(Qualified__c) formula confirmed |
| `object-manager-priority-level-picklist.png` | Priority_Level__c picklist values — High, Medium, Low, Not Applicable | All four values present and active |

---

## 13. Note on DevOrg License Constraint

This system is built and validated in a Salesforce Developer Edition org operating under a single Standard User license. Regional Territory Managers are represented by Queues (`East_Coast_Region`, `West_Coast_Region`, `Central_Region`) rather than provisioned named users. The Standard User license rotates to whichever Territory Manager role requires active Salesforce access at a given time. This is a known and documented DevOrg constraint. All automation logic, routing rules, and Queue definitions are production-equivalent and require no architectural changes for deployment to a production org — only the addition of provisioned named users to each Queue.

---

## 14. Document Status

| Attribute | Value |
|---|---|
| File Path | `docs/06-build-assets/screenshots-index.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead — Priority Level Automation / Built by Nathaniel V. Muncie*
