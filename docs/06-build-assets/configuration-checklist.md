# Configuration Checklist

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 5 — Validation and Evidence

---

## 1. Document Purpose

This document provides a complete configuration checklist for the Céleste Vineyards Lead Priority Level Automation system. It enumerates every component that must be correctly configured for the system to function as designed — across Wix, Make.com, and Salesforce. Each item is marked as confirmed based on the live build in the Salesforce Developer Edition org.

---

## 2. Wix Configuration

| # | Item | Required State | Confirmed |
|---|---|---|---|
| W-01 | Inquiry form published and accessible | Active | ✅ |
| W-02 | Key/value mapping applied to all form Fields | All keys match expected API names | ✅ |
| W-03 | `business_type` dropdown includes `Personal/Individual (Non-Business)` | Present as last option | ✅ |
| W-04 | Conditional rule hides `role`, `purchasing_timeline`, `company` on non-business selection | Fields hidden when triggered | ✅ |
| W-05 | Disqualification message renders on non-business selection | Message displayed | ✅ |
| W-06 | Wix Automation `POST_To_Make_Inlet_Webhook` configured and active | Fires on form submission | ✅ |
| W-07 | Webhook URL in Wix Automation matches Make.com Custom Webhook URL | URLs match | ✅ |

---

## 3. Make.com Configuration

| # | Item | Required State | Confirmed |
|---|---|---|---|
| M-01 | Scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1` is active | Active | ✅ |
| M-02 | Custom Webhook module listening on correct URL | `https://hook.us2.make.com/xz6hpf62bsspcqt6v2dkyg` | ✅ |
| M-03 | Router — Route 1 condition excludes `Personal/Individual (Non-Business)` | Correct filter applied | ✅ |
| M-04 | Router — Route 2 condition matches `Personal/Individual (Non-Business)` exactly | Exact string match | ✅ |
| M-05 | Module 12 — all standard Fields mapped from payload keys | `FirstName`, `LastName`, `Company`, `Email`, `Phone`, `State`, `LeadSource` | ✅ |
| M-06 | Module 12 — all custom Fields mapped from payload keys | `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Customer_Note__c` | ✅ |
| M-07 | Module 12 — phone normalization formula applied | Outputs `+1 (xxx) xxx-xxxx` format | ✅ |
| M-08 | Module 12 — `LeadSource` hardcoded as `Céleste Vineyards - Business Inquiry Form` | Exact string match | ✅ |
| M-09 | Module 13 — `Role__c` set to `Not Applicable` | Placeholder written | ✅ |
| M-10 | Module 13 — `Purchasing_Timeline__c` set to `Not Applicable` | Placeholder written | ✅ |
| M-11 | Module 13 — `Priority_Level__c` set to `Not Applicable` | Placeholder written | ✅ |
| M-12 | Module 13 — `LeadSource` hardcoded as `Céleste Vineyards - Business Inquiry Form` | Exact string match | ✅ |

---

## 4. Salesforce — Custom Fields

| # | Item | Required State | Confirmed |
|---|---|---|---|
| SF-01 | `Business_Type__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-02 | `Business_Type__c` — includes `Personal/Individual (Non-Business)` as a valid value | Present | ✅ |
| SF-03 | `Role__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-04 | `Role__c` — includes `Not Applicable` as a valid value | Present | ✅ |
| SF-05 | `Purchasing_Timeline__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-06 | `Purchasing_Timeline__c` — includes `Not Applicable` as a valid value | Present | ✅ |
| SF-07 | `Priority_Level__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-08 | `Priority_Level__c` — includes `High`, `Medium`, `Low`, `Not Applicable` as valid values | All four values present | ✅ |
| SF-09 | `Customer_Note__c` — Text Area Field exists on Lead Object | Active | ✅ |
| SF-10 | `Qualified__c` — Checkbox Field exists on Lead Object | Active | ✅ |
| SF-11 | `Qualified__c` — default value set to True in Object Manager | Default = True | ✅ |
| SF-12 | `Qualification_Status__c` — Formula (Text) Field exists on Lead Object | Active | ✅ |
| SF-13 | `Qualification_Status__c` — formula evaluates `Qualified__c` correctly | `✅ Qualified` / `❌ Disqualified` | ✅ |
| SF-14 | `Region__c` — Text Field exists on Lead Object | Active | ✅ |

---

## 5. Salesforce — Flow

| # | Item | Required State | Confirmed |
|---|---|---|---|
| FL-01 | Flow `Lead_Scoring_and_Priority_Level_Assignment` is Active | Status = Active | ✅ |
| FL-02 | Flow type is Record-Triggered — After-Save | After Save | ✅ |
| FL-03 | Trigger event is Record Created only | Created | ✅ |
| FL-04 | Entry condition: `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` | Exact string match | ✅ |
| FL-05 | `varTotalScore` Variable — Number, default 0 | Configured | ✅ |
| FL-06 | `varPriorityLevel` Variable — Text, no default | Configured | ✅ |
| FL-07 | `varOwnerID` Variable — Text, no default | Configured | ✅ |
| FL-08 | `varQualified` Variable — Boolean, default True | Configured | ✅ |
| FL-09 | Gatekeeper Fail outcome routes to End after setting `varQualified` = False | Confirmed in debug log | ✅ |
| FL-10 | All scoring Assignment elements use Add operator | Add — not Equals | ✅ |
| FL-11 | Priority Level thresholds: High ≥ 12, Medium ≥ 8, Low = Default | Configured | ✅ |
| FL-12 | `Initialize OwnerId (Default)` captures `{!$Record.OwnerId}` | Confirmed | ✅ |
| FL-13 | `Escalate High Priority to Sophia` Decision evaluates `varPriorityLevel` | Confirmed | ✅ |
| FL-14 | `Set OwnerId to Sophia` Assignment writes Sophia Delgado User ID to `varOwnerID` | Confirmed | ✅ |
| FL-15 | `Update Lead Priority and Score` — Condition Requirements = None (Always Update) | Confirmed | ✅ |
| FL-16 | `Update Lead Priority and Score` writes `OwnerId`, `Priority_Level__c`, `Qualified__c` | All three Fields written | ✅ |
| FL-17 | DML count = 1 per Flow interview | Confirmed in debug log | ✅ |

---

## 6. Salesforce — Assignment Rules and Queues

| # | Item | Required State | Confirmed |
|---|---|---|---|
| AR-01 | Lead Assignment Rule is active | Active | ✅ |
| AR-02 | Rule 1 — East Coast states assigned to `East_Coast_Region` Queue | 20 states + DC | ✅ |
| AR-03 | Rule 2 — West Coast states assigned to `West_Coast_Region` Queue | 13 states | ✅ |
| AR-04 | Rule 3 — Central states assigned to `Central_Region` Queue | 18 states | ✅ |
| AR-05 | All 50 states and DC covered across three rules | No state unassigned | ✅ |
| AR-06 | `East_Coast_Region` Queue exists and supports Lead Object | Confirmed | ✅ |
| AR-07 | `West_Coast_Region` Queue exists and supports Lead Object | Confirmed | ✅ |
| AR-08 | `Central_Region` Queue exists and supports Lead Object | Confirmed | ✅ |
| AR-09 | Sophia Delgado user record is active and can own Lead Records | Active Standard User | ✅ |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 5 — Validation and Evidence |
| File Path | docs/06-build-assets/configuration-checklist.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/06-build-assets/test-scenarios.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
