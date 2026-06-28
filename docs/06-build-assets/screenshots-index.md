# Screenshot Index

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Validation and Evidence

---

## 1. Document Purpose

This index catalogs all screenshots captured as build and validation evidence for the Céleste Vineyards Lead Priority Level Automation system. Screenshots are organized by platform and mapped to the corpus documents they support. Each entry references its repo-relative path under `assets/screenshots/`.

---

## 2. Scope

This index covers screenshots across three platforms: Wix (form states, gatekeeper behavior, and automation configuration), Make.com (scenario and module configuration), and Salesforce (Flow, Assignment Rule, Queues, and Lead records). Coverage is limited to configuration evidence and canonical Lead record validation output for L-01 through L-05.

---

## 3. Capture Standards

| Attribute | Specification |
|---|---|
| Format | PNG — lossless; required for UI screenshots containing text, labels, and field borders |
| Browser width | 1280px — locked for all captures; set before first screenshot and held constant across the full session |
| Height | Variable — cropped to relevant content per shot; no fixed height requirement |
| Cropping | Crop tightly to the subject area; omit excess browser chrome unless the URL bar is relevant evidence |
| Dropdown shots | Crop to show the open dropdown in context; full-page height not required |
| Make.com canvas | Zoom out until both `WH_Wix_Inquiry_To_Make` and `SF_Make_Lead_To_Salesforce` are visible in a single frame rather than splitting across multiple shots |
| Naming | Match the `File Path` value in the inventory below exactly — filenames are case-sensitive |

---

## 4. Wix Screenshots

### 4.1 Business Inquiry Form

| ID | Description | File Path | Supports |
|---|---|---|---|
| SCR-WX-01 | Business Inquiry Form — top section, active state; all scoring fields visible | `assets/screenshots/wix/SCR-WX-01_form-top-active.png` | `docs/05-integration/wix-make-salesforce-ingestion.md`, `docs/02-architecture/gatekeeper-logic.md` |
| SCR-WX-02 | Business Inquiry Form — `Business_Type__c` dropdown open | `assets/screenshots/wix/SCR-WX-02_form-business-type-dropdown.png` | `docs/02-architecture/gatekeeper-logic.md` |
| SCR-WX-03 | Business Inquiry Form — `Personal/Individual (Non-Business)` selected; `Role__c` and `Purchasing_Timeline__c` fields hidden; gatekeeper triggered | `assets/screenshots/wix/SCR-WX-03_form-gatekeeper-triggered.png` | `docs/02-architecture/gatekeeper-logic.md` |
| SCR-WX-04 | Business Inquiry Form — `Role__c` dropdown open | `assets/screenshots/wix/SCR-WX-04_form-role-dropdown.png` | `docs/02-architecture/gatekeeper-logic.md` |
| SCR-WX-05 | Business Inquiry Form — `Purchasing_Timeline__c` dropdown open | `assets/screenshots/wix/SCR-WX-05_form-purchasing-timeline-dropdown.png` | `docs/02-architecture/gatekeeper-logic.md` |
| SCR-WX-06 | Business Inquiry Form — bottom section showing remaining form fields | `assets/screenshots/wix/SCR-WX-06_form-bottom.png` | `docs/05-integration/wix-make-salesforce-ingestion.md`, `docs/02-architecture/gatekeeper-logic.md` |

### 4.2 Wix Automation

| ID | Description | File Path | Supports |
|---|---|---|---|
| SCR-WX-07 | Wix Automation `WA_Inquiry_To_Make` — canvas view showing trigger (Wix Forms — Form submitted) and action `POST_WH_Wix_Inquiry_To_Make` | `assets/screenshots/wix/SCR-WX-07_wix-automation.png` | `docs/05-integration/wix-make-salesforce-ingestion.md`, `docs/02-architecture/system-architecture.md` |

---

## 5. Make.com Screenshots

| ID | Description | File Path | Supports |
|---|---|---|---|
| SCR-MK-01 | Scenario `Wix_Inquiry_To_Salesforce_Lead` — canvas view showing `WH_Wix_Inquiry_To_Make` and `SF_Make_Lead_To_Salesforce` | `assets/screenshots/make/SCR-MK-01_make-scenario-canvas.png` | `docs/05-integration/middleware-responsibilities.md` |
| SCR-MK-02 | Module `WH_Wix_Inquiry_To_Make` — webhook configuration and inbound payload structure | `assets/screenshots/make/SCR-MK-02_make-webhook-module.png` | `docs/05-integration/source-to-lead-mapping.md` |
| SCR-MK-03 | Module `SF_Make_Lead_To_Salesforce` — Salesforce Create Record field mapping configuration | `assets/screenshots/make/SCR-MK-03_make-salesforce-module.png` | `docs/05-integration/source-to-lead-mapping.md`, `docs/05-integration/middleware-responsibilities.md` |
| SCR-MK-04 | Make.com execution log — successful run output for a canonical test submission | `assets/screenshots/make/SCR-MK-04_make-execution-log.png` | `docs/05-integration/middleware-responsibilities.md` |

---

## 6. Salesforce Configuration Screenshots

| ID | Description | File Path | Supports |
|---|---|---|---|
| SCR-SF-01 | Flow `Lead_Scoring_and_Priority_Level_Assignment` — Flow Builder canvas view | `assets/screenshots/salesforce/SCR-SF-01_flow-canvas.png` | `docs/04-automation-logic/priority-assignment-logic.md` |
| SCR-SF-02 | Assignment Rule `regional_territory_assignment` — rule entries configuration | `assets/screenshots/salesforce/SCR-SF-02_assignment-rule.png` | `docs/04-automation-logic/territorial-routing-logic.md` |
| SCR-SF-03 | Queue `East Coast Region` — member configuration | `assets/screenshots/salesforce/SCR-SF-03_queue-east-coast.png` | `docs/04-automation-logic/queue-definitions.md` |
| SCR-SF-04 | Queue `West Coast Region` — member configuration | `assets/screenshots/salesforce/SCR-SF-04_queue-west-coast.png` | `docs/04-automation-logic/queue-definitions.md` |
| SCR-SF-05 | Queue `Central Region` — member configuration | `assets/screenshots/salesforce/SCR-SF-05_queue-central.png` | `docs/04-automation-logic/queue-definitions.md` |
| SCR-SF-06 | Lead list view — all five canonical Lead records showing `Priority_Level__c` and owner assignment | `assets/screenshots/salesforce/SCR-SF-06_lead-list-view.png` | `test-artifacts/uat-session-log.md` |

---

## 7. Salesforce Lead Record Screenshots

| ID | Lead | Description | File Path | Supports |
|---|---|---|---|---|
| SCR-SF-07 | L-01 — Marcus Thibodeau | Lead detail record showing `Priority_Level__c` `High`, `OwnerId` Sophia Delgado, `Region__c` `East Coast` | `assets/screenshots/salesforce/SCR-SF-07_lead-L01-thibodeau.png` | `test-artifacts/uat-session-log.md` |
| SCR-SF-08 | L-02 — Renata Voss | Lead detail record showing `Priority_Level__c` `High`, `OwnerId` Sophia Delgado, `Region__c` `West Coast` | `assets/screenshots/salesforce/SCR-SF-08_lead-L02-voss.png` | `test-artifacts/uat-session-log.md` |
| SCR-SF-09 | L-03 — Dominic Reyes | Lead detail record showing `Priority_Level__c` `Medium`, `OwnerId` Priya Desai, `Region__c` `Central` | `assets/screenshots/salesforce/SCR-SF-09_lead-L03-reyes.png` | `test-artifacts/uat-session-log.md` |
| SCR-SF-10 | L-04 — Janelle Harmon | Lead detail record showing `Priority_Level__c` `Medium`, `OwnerId` Luis Navarro, `Region__c` `East Coast` | `assets/screenshots/salesforce/SCR-SF-10_lead-L04-harmon.png` | `test-artifacts/uat-session-log.md` |
| SCR-SF-11 | L-05 — Britta Sandoval | Lead detail record showing `Priority_Level__c` `Low`, `OwnerId` Jordan Chen, `Region__c` `West Coast` | `assets/screenshots/salesforce/SCR-SF-11_lead-L05-sandoval.png` | `test-artifacts/uat-session-log.md` |

---

## 8. Evidence Map

| Corpus Document | Screenshots |
|---|---|
| `docs/02-architecture/gatekeeper-logic.md` | SCR-WX-01, SCR-WX-02, SCR-WX-03, SCR-WX-04, SCR-WX-05, SCR-WX-06 |
| `docs/02-architecture/system-architecture.md` | SCR-WX-07 |
| `docs/04-automation-logic/territorial-routing-logic.md` | SCR-SF-02 |
| `docs/04-automation-logic/queue-definitions.md` | SCR-SF-03, SCR-SF-04, SCR-SF-05 |
| `docs/04-automation-logic/priority-assignment-logic.md` | SCR-SF-01 |
| `docs/05-integration/wix-make-salesforce-ingestion.md` | SCR-WX-01, SCR-WX-06, SCR-WX-07 |
| `docs/05-integration/middleware-responsibilities.md` | SCR-MK-01, SCR-MK-03, SCR-MK-04 |
| `docs/05-integration/source-to-lead-mapping.md` | SCR-MK-02, SCR-MK-03 |
| `test-artifacts/uat-session-log.md` | SCR-SF-06, SCR-SF-07, SCR-SF-08, SCR-SF-09, SCR-SF-10, SCR-SF-11 |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Validation and Evidence |
| File Path | `docs/06-build-assets/screenshots-index.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
