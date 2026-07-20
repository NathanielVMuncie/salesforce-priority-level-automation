# Configuration Checklist

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Build Assets

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
| W-04 | Conditional rule collapses the form on `Personal/Individual (Non-Business)` selection | Form collapses — submit control disabled | ✅ |
| W-05 | Not Qualified message renders on non-business selection | Message displayed — no payload generated | ✅ |
| W-06 | Wix Automation `POST_To_Make_Inlet_Webhook` configured and active | Fires on qualified form submission only | ✅ |
| W-07 | Webhook URL in Wix Automation matches Make.com Custom Webhook URL | URLs match | ✅ |

---

## 3. Make.com Configuration

| # | Item | Required State | Confirmed |
|---|---|---|---|
| M-01 | Scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1` is active | Active | ✅ |
| M-02 | `WA_Inquiry_To_Make` Custom Webhook module listening on correct URL | Receives B2B payload from Wix | ✅ |
| M-03 | Single-stream pipeline — no Router, no secondary paths | Two modules only | ✅ |
| M-04 | `POST_WH_Wix_Inquiry_To_Make` — all standard Fields mapped from payload keys | `FirstName`, `LastName`, `Company`, `Email`, `Phone`, `State`, `LeadSource` | ✅ |
| M-05 | `POST_WH_Wix_Inquiry_To_Make` — all custom Fields mapped from payload keys | `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Customer_Note__c` | ✅ |
| M-06 | `POST_WH_Wix_Inquiry_To_Make` — phone normalization formula applied | Outputs `+1 (xxx) xxx-xxxx` format | ✅ |
| M-07 | `POST_WH_Wix_Inquiry_To_Make` — `LeadSource` hardcoded as `Céleste Vineyards — Business Inquiry Form` | Exact string match with Flow entry condition | ✅ |

---

## 4. Salesforce — Custom Fields

| # | Item | Required State | Confirmed |
|---|---|---|---|
| SF-01 | `Business_Type__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-02 | `Role__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-03 | `Purchasing_Timeline__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-04 | `Priority_Level__c` — Picklist Field exists on Lead Object | Active | ✅ |
| SF-05 | `Priority_Level__c` — includes `High`, `Medium`, `Low` as valid values | All three values present | ✅ |
| SF-06 | `Customer_Note__c` — Text Area Field exists on Lead Object | Active | ✅ |
| SF-07 | `Region__c` — Formula (Text) Field resolves region from `State` via CASE | Returns `East Coast`, `West Coast`, `Central`, or `International` | ✅ |
| SF-08 | `Lead_Created__c` — Formula (Date) Field resolves from `CreatedDate` | Returns date-only value via `DATEVALUE()` | ✅ |

---

## 5. Salesforce — Flow

| # | Item | Required State | Confirmed |
|---|---|---|---|
| FL-01 | Flow `Lead_Scoring_and_Priority_Level_Assignment` is Active | Status = Active — V26 | ✅ |
| FL-02 | Flow type is Record-Triggered — After-Save | After Save | ✅ |
| FL-03 | Trigger event is Record Created only | Created | ✅ |
| FL-04 | Entry condition: `LeadSource` Equals `Céleste Vineyards — Business Inquiry Form` | Exact string match | ✅ |
| FL-05 | `varTotalScore` Variable — Number, default 0 | Configured | ✅ |
| FL-06 | `varPriorityLevel` Variable — Text, no default | Configured | ✅ |
| FL-07 | `varOwnerID` Variable — Text, no default | Configured | ✅ |
| FL-08 | All scoring Assignment elements use Add operator | Add — not Equals | ✅ |
| FL-09 | Priority Level thresholds: High ≥ 12, Medium ≥ 8, Low = Default | Configured | ✅ |
| FL-10 | `Initialize OwnerId (Default)` captures `{!$Record.OwnerId}` | Confirmed | ✅ |
| FL-11 | `Escalate High Priority to Sophia` Decision evaluates `varPriorityLevel` | Confirmed | ✅ |
| FL-12 | `Escalate OwnerId to Sophia` Assignment writes Sophia Delgado User ID to `varOwnerID` | Confirmed | ✅ |
| FL-13 | `Update Lead Priority and Score` — Condition Requirements = None (Always Update) | Confirmed | ✅ |
| FL-14 | `Update Lead Priority and Score` writes `OwnerId` and `Priority_Level__c` | Single DML write | ✅ |
| FL-15 | DML count = 1 per Flow interview | Confirmed in debug log | ✅ |

---

## 6. Salesforce — Assignment Rules and Queues

| # | Item | Required State | Confirmed |
|---|---|---|---|
| AR-01 | Lead Assignment Rule `Regional Territory Assignment` is active | Active | ✅ |
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
| Section | Build Assets |
| File Path | `docs/06-build-assets/configuration-checklist.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
