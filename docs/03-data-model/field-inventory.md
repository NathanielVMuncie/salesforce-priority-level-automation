# Field Inventory

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document provides the complete field inventory for the Salesforce Lead Object as configured in the Céleste Vineyards Lead Priority Level Automation system. It enumerates every field active in this pipeline — standard and custom — with field type, origin, and pipeline role.

The authoritative source for all custom field metadata is the live SFDX retrieval from org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

---

## 2. Standard Fields — In Pipeline Scope

These standard Salesforce Lead fields are populated by Make.com from the Wix form payload and are referenced by the automation pipeline.

| Field Label | API Name | Field Type | Wix Payload Key | Make.com Transformation | Pipeline Role |
|---|---|---|---|---|---|
| First Name | `FirstName` | Text | `first_name` | None | Identity |
| Last Name | `LastName` | Text | `last_name` | None | Identity |
| Company | `Company` | Text | `company` | None | Identity — may be null on non-qualified path |
| Email | `Email` | Email | `email` | None | Contact |
| Phone | `Phone` | Phone | `phone` | Regex normalization to `+1 (xxx) xxx-xxxx` | Contact |
| State/Province | `State` | Text | `state` | None | Routing — evaluated by Assignment Rule |
| Lead Source | `LeadSource` | Picklist | *(not from payload)* | Hardcoded: `Céleste Vineyards - Business Inquiry Form` | Flow entry condition |
| Owner ID | `OwnerId` | Lookup | *(not from payload)* | Set by Assignment Rule; overridden by Flow escalation | Routing — final owner |

---

## 3. Custom Fields — In Pipeline Scope

These custom fields were created on the Lead Object to support the scoring model, qualification tracking, and routing logic of this system.

| Field Label | API Name | Field Type | Written By | Pipeline Role |
|---|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | Make.com (payload) | Gatekeeper input + scoring dimension 1 |
| Role | `Role__c` | Picklist | Make.com (payload or placeholder) | Scoring dimension 2 |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | Make.com (payload or placeholder) | Scoring dimension 3 |
| Priority Level | `Priority_Level__c` | Picklist | Flow (qualified path) / Make.com Module 13 (non-qualified) | Priority output — written by Flow |
| Lead Score | `Lead_Score__c` | Number | Flow Update Records element (qualified path) | Composite score output — written by Flow |
| Qualified | `Qualified__c` | Checkbox | Field default (True) / Flow Update Records element | Qualification state — written by Flow on qualified path |
| Qualification Status | `Qualification_Status__c` | Formula (Text) | Self-resolving — reads `Business_Type__c` via ISPICKVAL | Display field — renders qualification state |
| Customer Note | `Customer_Note__c` | Text Area | Make.com (payload — optional) | Prospect-submitted free text |
| Region | `Region__c` | Formula (Text) | Self-resolving — derives from `State` via CASE statement | Territorial classification — populated for all Records |
| Lead Created | `Lead_Created__c` | Formula (Date) | Self-resolving — derives from `CreatedDate` | Audit timestamp |

---

## 4. Field Count Summary

| Category | Count |
|---|---|
| Standard fields in pipeline scope | 8 |
| Custom fields | 10 |
| **Total fields in scope** | **18** |

---

## 5. Fields Written by Layer

| Field | Wix | Make.com | Assignment Rule | Flow | Field Default |
|---|---|---|---|---|---|
| `FirstName` | ✅ Collected | ✅ Written | | | |
| `LastName` | ✅ Collected | ✅ Written | | | |
| `Company` | ✅ Collected | ✅ Written | | | |
| `Email` | ✅ Collected | ✅ Written | | | |
| `Phone` | ✅ Collected | ✅ Written (normalized) | | | |
| `State` | ✅ Collected | ✅ Written | | | |
| `LeadSource` | | ✅ Hardcoded | | | |
| `OwnerId` | | | ✅ Queue assignment | ✅ Escalation override | |
| `Business_Type__c` | ✅ Collected | ✅ Written | | | |
| `Role__c` | ✅ Collected | ✅ Written (or `Not Applicable`) | | | |
| `Purchasing_Timeline__c` | ✅ Collected | ✅ Written (or `Not Applicable`) | | | |
| `Priority_Level__c` | | ✅ Placeholder (Module 13) | | ✅ Written (qualified path) | |
| `Lead_Score__c` | | | | ✅ Written (qualified path) | |
| `Qualified__c` | | | | ✅ Written (Update Records) | ✅ Default = True |
| `Qualification_Status__c` | | | | | ✅ Formula — self-resolving |
| `Customer_Note__c` | ✅ Collected | ✅ Written | | | |
| `Region__c` | | | | | ✅ Formula — self-resolving |
| `Lead_Created__c` | | | | | ✅ Formula — self-resolving |

---

## 6. Qualification_Status__c Formula

`Qualification_Status__c` is a Formula (Text) field that resolves at read time from `Business_Type__c`. It does not depend on `Qualified__c`.

```
IF(
  ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"),
  "❌ Not Qualified",
  "✅ Qualified"
)
```

| `Business_Type__c` Value | Display Output |
|---|---|
| `Personal/Individual (Non-Business)` | ❌ Not Qualified |
| Any other value (qualified picklist values) | ✅ Qualified |

---

## 7. Custom Field — Picklist Values

### 7.1 Business_Type__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| Premium Wine Distributor | Qualified — highest value | 5 |
| High-End Wine Store | Qualified | 4 |
| Upscale Restaurant | Qualified | 3 |
| Specialty Gourmet Grocer | Qualified | 2 |
| Catering & Event Company | Qualified — lowest value | 1 |
| Personal/Individual (Non-Business) | Gatekeeper Fail — disqualifies | 0 |
| Not Applicable | Placeholder — non-qualified path | — |

### 7.2 Role__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| Owner | Highest authority | 5 |
| Purchasing Manager | Decision-maker | 4 |
| General Manager | Decision-maker | 3 |
| Sales Manager | Partial authority | 2 |
| Event Coordinator | Low authority | 1 |
| Not Applicable | Placeholder — non-qualified path | — |

### 7.3 Purchasing_Timeline__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| Immediate Need (Contracting) | Highest urgency | 5 |
| Short-Term / Within 30 Days | High urgency | 4 |
| Evaluating Vendors (Next 90 Days) | Mid urgency | 3 |
| Budget Planning (Future Quarter) | Low urgency | 2 |
| Information Gathering | No urgency | 1 |
| Not Applicable | Placeholder — non-qualified path | — |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
