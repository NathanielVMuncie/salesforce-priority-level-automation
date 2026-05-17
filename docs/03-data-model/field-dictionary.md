# Field Dictionary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document provides field-level definitions for every field active at the Lead phase of the Céleste Vineyards pipeline. Each entry records the field label, API name, data type, who writes it, and its precise role in the pipeline.

The authoritative source for all custom field metadata is the live SFDX retrieval from org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

---

## 2. Standard Fields

### FirstName

| Attribute | Value |
|---|---|
| Field Label | First Name |
| API Name | `FirstName` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `first_name` |
| Pipeline Role | Identity — prospect's given name |

---

### LastName

| Attribute | Value |
|---|---|
| Field Label | Last Name |
| API Name | `LastName` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `last_name` |
| Pipeline Role | Identity — prospect's surname. Required field on Lead Object |

---

### Company

| Attribute | Value |
|---|---|
| Field Label | Company |
| API Name | `Company` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `company` |
| Pipeline Role | Identity — prospect's organization name |

---

### Email

| Attribute | Value |
|---|---|
| Field Label | Email |
| API Name | `Email` |
| Field Type | Email |
| Written By | Make.com — passed from Wix payload key `email` |
| Pipeline Role | Contact — primary prospect email address |

---

### Phone

| Attribute | Value |
|---|---|
| Field Label | Phone |
| API Name | `Phone` |
| Field Type | Phone |
| Written By | Make.com — normalized from Wix payload key `phone` |
| Transformation | Regex formula applied in Make.com: `replace(trim(2. data: phone); /^\+?1?(\d{3})(\d{3})(\d{4})$/; +1 ($1) $2-$3)` |
| Output Format | `+1 (xxx) xxx-xxxx` |
| Pipeline Role | Contact — prospect phone number, standardized format |

---

### State

| Attribute | Value |
|---|---|
| Field Label | State/Province |
| API Name | `State` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `state` |
| Pipeline Role | Routing — evaluated by the Lead Assignment Rule to determine Sales Representative assignment. Also input to the `Region__c` formula field |

---

### LeadSource

| Attribute | Value |
|---|---|
| Field Label | Lead Source |
| API Name | `LeadSource` |
| Field Type | Picklist |
| Written By | Make.com — hardcoded value set in the Create Lead module |
| Hardcoded Value | `Céleste Vineyards - Business Inquiry Form` |
| Pipeline Role | Flow entry condition. The After-Save Flow fires only on Lead Records where `LeadSource` equals this exact value. Records created through any other mechanism do not trigger the automation |

---

### OwnerId

| Attribute | Value |
|---|---|
| Field Label | Owner ID |
| API Name | `OwnerId` |
| Field Type | Lookup (User or Queue) |
| Written By | Assignment Rule (Sales Representative assignment at Record creation) — then Flow `Update Lead Priority and Score` Update Records element (escalation override for Priority Level High) |
| Pipeline Role | Routing — final owner of the Lead Record. The Assignment Rule assigns to the Sales Representative designated to that region. If the representative does not hold the active license, their regional Queue serves as proxy owner. For Priority Level High Leads, the Flow overrides `OwnerId` to Sophia Delgado's User ID regardless of the Assignment Rule output. If the Flow misfires, the Queue absorbs the Lead as a fault-path catch-all, as the regional Queue owner ID is written at Record creation before the Flow executes |

---

## 3. Custom Fields

### Business_Type__c

| Attribute | Value |
|---|---|
| Field Label | Business Type |
| API Name | `Business_Type__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `business_type` |
| Pipeline Role | Scoring dimension 1 — evaluated by the `Determine Business Type Score` Decision element. Contributes 1–5 points to `varTotalScore` |
| Picklist Values | `Premium Wine Distributor` (5 pts), `High-End Wine Store` (4 pts), `Upscale Restaurant` (3 pts), `Specialty Gourmet Grocer` (2 pts), `Catering & Event Company` (1 pt) |

---

### Role__c

| Attribute | Value |
|---|---|
| Field Label | Role |
| API Name | `Role__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `role` |
| Pipeline Role | Scoring dimension 2 — evaluated by the `Determine Role Score` Decision element. Contributes 1–5 points to `varTotalScore` |
| Picklist Values | `Owner` (5 pts), `Purchasing Manager` (4 pts), `General Manager` (3 pts), `Sales Manager` (2 pts), `Event Coordinator` (1 pt) |

---

### Purchasing_Timeline__c

| Attribute | Value |
|---|---|
| Field Label | Purchasing Timeline |
| API Name | `Purchasing_Timeline__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `purchasing_timeline` |
| Pipeline Role | Scoring dimension 3 — evaluated by the `Determine Purchasing Timeline Score` Decision element. Contributes 1–5 points to `varTotalScore` |
| Picklist Values | `Immediate Need (Contracting)` (5 pts), `Short-Term (Within 30 Days)` (4 pts), `Evaluating Vendors (Next 90 Days)` (3 pts), `Budget Planning (Future Quarter)` (2 pts), `Information Gathering` (1 pt) |

---

### Priority_Level__c

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Written By | Flow — `Update Lead Priority and Score` Update Records element |
| Pipeline Role | Priority output — the final assigned Priority Level for the Lead Record. Written from `varPriorityLevel` by the single Update Records element |
| Picklist Values | `High` (`varTotalScore` ≥ 12), `Medium` (`varTotalScore` ≥ 8 and < 12), `Low` (Default Outcome) |

---

### Lead_Score__c

| Attribute | Value |
|---|---|
| Field Label | Lead Score |
| API Name | `Lead_Score__c` |
| Field Type | Number |
| Written By | Flow — `Update Lead Priority and Score` Update Records element |
| Pipeline Role | Composite score output — the numeric sum of all three scoring dimensions. Written from `varTotalScore` by the single Update Records element. Range: 3–15 |

---

### Customer_Note__c

| Attribute | Value |
|---|---|
| Field Label | Customer Note |
| API Name | `Customer_Note__c` |
| Field Type | Text Area |
| Written By | Make.com — passed from Wix payload key `customer_note` |
| Pipeline Role | Prospect-submitted free text. Optional field — may be null. Not evaluated by any scoring or routing logic |

---

### Region__c

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Written By | Self-resolving — evaluates at read time from `State` via CASE statement |
| Pipeline Role | Territorial classification — derives the Lead's geographic region from `State/Province`. Populated on all Records regardless of Priority Level. Preserved on Priority Level High Records even after Flow escalation overrides `OwnerId` to Sophia Delgado. Used for regional pipeline reporting |
| Possible Values | `East Coast`, `West Coast`, `Central`, `International` |

---

### Lead_Created__c

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Written By | Self-resolving — evaluates at read time from `CreatedDate` |
| Pipeline Role | Audit timestamp — records the date the Lead Record was created in Salesforce |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/field-dictionary.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*