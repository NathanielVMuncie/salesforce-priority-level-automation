# Screenshots Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 5 — Validation and Evidence

---

## 1. Document Purpose

This document serves as the index for all screenshots captured during the build and validation of the Céleste Vineyards Lead Priority Level Automation system. It documents what each screenshot shows, which scenario or component it validates, and its location in the repository.

Screenshots are stored in `assets/screenshots/`. This index provides the reference map between each screenshot file and the build component it documents.

---

## 2. Screenshot Categories

| Category | Description |
|---|---|
| Lead Records | Salesforce Lead Record views showing final Field values after automation executed |
| Flow Debug Logs | Flow debug log output confirming execution path and Variable values |
| Make.com Execution | Make.com scenario execution logs confirming module routing and Field mapping |
| Salesforce Configuration | Object Manager, Flow Builder, Assignment Rule, and Queue configuration screenshots |

---

## 3. Lead Record Screenshots

| File Name | Description | Scenario | Validates |
|---|---|---|---|
| `lead-richard-miranda-record.png` | Full Lead Record view — Richard Miranda | S-01 | Priority_Level__c = Low, Qualified__c = True, OwnerId = Inava, Region__c = East Coast |
| `lead-neil-thompson-record.png` | Full Lead Record view — Neil Thompson | S-02 | Priority_Level__c = High, OwnerId = Sophia Delgado, Region__c = West Coast |
| `lead-dylan-moss-record.png` | Full Lead Record view — Dylan Moss | S-03 | Qualification_Status__c = ❌ Disqualified, Priority_Level__c = Not Applicable, OwnerId = pdesa |

---

## 4. Flow Debug Log Screenshots

| File Name | Description | Scenario | Validates |
|---|---|---|---|
| `debug-richard-miranda-flow.png` | Flow debug log — Richard Miranda | S-01 | varTotalScore = 6, Low outcome, no escalation, DML count = 1 |
| `debug-neil-thompson-flow.png` | Flow debug log — Neil Thompson | S-02 | varTotalScore = 13, High outcome, escalation fired, Sophia Delgado OwnerId written, DML count = 1 |
| `debug-dylan-moss-flow.png` | Flow debug log — Dylan Moss | S-03 | Gatekeeper Fail outcome, Flow terminated at End, no scoring elements executed |

---

## 5. Make.com Execution Screenshots

| File Name | Description | Scenario | Validates |
|---|---|---|---|
| `make-module12-execution.png` | Make.com Module 12 execution — qualified path | S-01, S-02 | Router directed to Module 12, all Fields mapped, Record created in Salesforce |
| `make-module13-execution.png` | Make.com Module 13 execution — non-qualified path | S-03 | Router directed to Module 13, placeholder values written, Record created in Salesforce |

---

## 6. Salesforce Configuration Screenshots

| File Name | Description | Component |
|---|---|---|
| `flow-builder-overview.png` | Flow Builder canvas — full Flow layout | Flow — Lead_Scoring_and_Priority_Level_Assignment |
| `flow-gatekeeper-decision.png` | Gatekeeper Decision element configuration | Flow — Determine Business Type Score |
| `flow-priority-decision.png` | Priority Level Decision element configuration | Flow — Determine Priority Level |
| `flow-escalation-decision.png` | Escalation Decision element configuration | Flow — Escalate High Priority to Sophia |
| `flow-update-records.png` | Update Records element configuration | Flow — Update Lead Priority and Score |
| `object-manager-qualified-field.png` | Qualified__c Field configuration showing default value = True | Salesforce — Object Manager |
| `assignment-rule-overview.png` | Lead Assignment Rule entries overview | Salesforce — Assignment Rules |
| `queue-definitions-overview.png` | Queue list showing all three regional Queues | Salesforce — Queues |

---

## 7. Note on Screenshot Availability

Screenshots are captured from the live Salesforce Developer Edition org and the live Make.com scenario. All screenshots referenced in this index were captured during or immediately after the UAT session on 2026-03-21 and reflect the operational state of the system at the time of validation.

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 5 — Validation and Evidence |
| File Path | docs/06-build-assets/screenshots-index.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/07-portfolio/case-study-summary.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
