# Field Dictionary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document provides field-level definitions for every field active in the Céleste Vineyards Lead Priority Level Automation pipeline. Each entry records the field label, API name, data type, who writes it, its default value if applicable, and its precise role in the pipeline.

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
| Default | None |
| Pipeline Role | Identity — prospect's given name |

---

### LastName

| Attribute | Value |
|---|---|
| Field Label | Last Name |
| API Name | `LastName` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `last_name` |
| Default | None |
| Pipeline Role | Identity — prospect's surname. Required field on Lead Object |

---

### Company

| Attribute | Value |
|---|---|
| Field Label | Company |
| API Name | `Company` |
| Field Type | Text |
| Written By | Make.com — passed from Wix payload key `company` |
| Default | None |
| Pipeline Role | Identity — prospect's organization name. May be null on the non-qualified path; the Wix conditional rule hides this field when `Personal/Individual (Non-Business)` is selected |

---

### Email

| Attribute | Value |
|---|---|
| Field Label | Email |
| API Name | `Email` |
| Field Type | Email |
| Written By | Make.com — passed from Wix payload key `email` |
| Default | None |
| Pipeline Role | Contact — primary prospect email address |

---

### Phone

| Attribute | Value |
|---|---|
| Field Label | Phone |
| API Name | `Phone` |
| Field Type | Phone |
| Written By | Make.com — normalized from Wix payload key `phone` |
| Default | None |
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
| Default | None |
| Pipeline Role | Routing — evaluated by the Lead Assignment Rule to determine regional Queue assignment. Also input to the `Region__c` formula field |

---

### LeadSource

| Attribute | Value |
|---|---|
| Field Label | Lead Source |
| API Name | `LeadSource` |
| Field Type | Picklist |
| Written By | Make.com — hardcoded in both Module 12 and Module 13 |
| Hardcoded Value | `Céleste Vineyards - Business Inquiry Form` |
| Default | None |
| Pipeline Role | Flow entry condition. The After-Save Flow fires only on Lead Records where `LeadSource` equals this exact value. Records created through any other mechanism do not trigger the automation |

---

### OwnerId

| Attribute | Value |
|---|---|
| Field Label | Owner ID |
| API Name | `OwnerId` |
| Field Type | Lookup (User or Queue) |
| Written By | Assignment Rule (Queue assignment at Record creation) — then Flow Update Records element (escalation override for Priority Level High) |
| Default | None |
| Pipeline Role | Routing — final owner of the Lead Record. For Priority Level High Leads, overridden to Sophia Delgado's User ID by the Flow escalation logic. For Priority Level Medium and Low Leads, retains the regional Queue ID set by the Assignment Rule. For Not Qualified Leads, retains the regional Queue ID — the Flow exits before Update Records |

---

## 3. Custom Fields

### Business_Type__c

| Attribute | Value |
|---|---|
| Field Label | Business Type |
| API Name | `Business_Type__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `business_type` |
| Default | None |
| Pipeline Role | Dual purpose. First: gatekeeper input — if value is `Personal/Individual (Non-Business)`, the Gatekeeper Fail outcome fires and the Flow exits. Second: scoring dimension 1 — all other qualified values contribute 1–5 points to `varTotalScore`. Also the input field for `Qualification_Status__c` formula resolution |
| Picklist Values | Premium Wine Distributor (5 pts), High-End Wine Store (4 pts), Upscale Restaurant (3 pts), Specialty Gourmet Grocer (2 pts), Catering & Event Company (1 pt), Personal/Individual (Non-Business) (disqualifies), Not Applicable (Module 13 placeholder) |

---

### Role__c

| Attribute | Value |
|---|---|
| Field Label | Role |
| API Name | `Role__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `role` (qualified path) or hardcoded as `Not Applicable` (Module 13 — non-qualified path) |
| Default | None |
| Pipeline Role | Scoring dimension 2 — contributes 1–5 points to `varTotalScore` via the `Determine Role Score` Decision element. Not evaluated on the non-qualified path |
| Picklist Values | Owner (5 pts), Purchasing Manager (4 pts), General Manager (3 pts), Sales Manager (2 pts), Event Coordinator (1 pt), Not Applicable (placeholder) |

---

### Purchasing_Timeline__c

| Attribute | Value |
|---|---|
| Field Label | Purchasing Timeline |
| API Name | `Purchasing_Timeline__c` |
| Field Type | Picklist |
| Written By | Make.com — passed from Wix payload key `purchasing_timeline` (qualified path) or hardcoded as `Not Applicable` (Module 13 — non-qualified path) |
| Default | None |
| Pipeline Role | Scoring dimension 3 — contributes 1–5 points to `varTotalScore` via the `Determine Purchasing Timeline Score` Decision element. Not evaluated on the non-qualified path |
| Picklist Values | Immediate Need (Contracting) (5 pts), Short-Term / Within 30 Days (4 pts), Evaluating Vendors (Next 90 Days) (3 pts), Budget Planning (Future Quarter) (2 pts), Information Gathering (1 pt), Not Applicable (placeholder) |

---

### Priority_Level__c

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Written By | Flow Update Records element — qualified path only. Make.com Module 13 writes `Not Applicable` on the non-qualified path before Record creation |
| Default | None |
| Pipeline Role | Priority output — the final assigned Priority Level for the Lead Record. Written from `varPriorityLevel` by the single Update Records element |
| Picklist Values | High (`varTotalScore` ≥ 12), Medium (`varTotalScore` ≥ 8), Low (default outcome), Not Applicable (Module 13 placeholder) |

---

### Lead_Score__c

| Attribute | Value |
|---|---|
| Field Label | Lead Score |
| API Name | `Lead_Score__c` |
| Field Type | Number |
| Written By | Flow Update Records element — qualified path only |
| Default | None |
| Pipeline Role | Composite score output — the numeric sum of all three dimension scores. Written from `varTotalScore` by the single Update Records element. Range: 3–15 for qualified Leads. Not written on the Not Qualified path |

---

### Qualified__c

| Attribute | Value |
|---|---|
| Field Label | Qualified |
| API Name | `Qualified__c` |
| Field Type | Checkbox |
| Written By | Flow Update Records element — qualified path only |
| Field Default | True (Checked) — set in Object Manager |
| Pipeline Role | Qualification state storage. Field default of True ensures all Records begin as qualified. The Flow writes this field explicitly on the qualified path via Update Records. On the Not Qualified path, the Flow exits before Update Records — the field retains the True default. `Qualification_Status__c` does not read from this field — it reads from `Business_Type__c` directly |
| Defect History | D-01 — field default was initially unset (False). Corrected to True in Object Manager during UAT |

---

### Qualification_Status__c

| Attribute | Value |
|---|---|
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Written By | Self-resolving — evaluates at read time |
| Formula | `IF(ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"), "❌ Not Qualified", "✅ Qualified")` |
| Reads From | `Business_Type__c` via `ISPICKVAL` |
| Default | None — formula field |
| Pipeline Role | Display field — renders the Lead's qualification state as a human-readable indicator on the Record. Resolves correctly on all Records regardless of Flow execution path |
| Display Values | `✅ Qualified` (all qualified Business Type values) / `❌ Not Qualified` (`Personal/Individual (Non-Business)`) |
| Design Note | Formula reads from `Business_Type__c`, not from `Qualified__c`. This ensures the display is accurate on Not Qualified Records even though the Flow exits before writing `Qualified__c` to False on that path |

---

### Customer_Note__c

| Attribute | Value |
|---|---|
| Field Label | Customer Note |
| API Name | `Customer_Note__c` |
| Field Type | Text Area |
| Written By | Make.com — passed from Wix payload key `customer_note` |
| Default | None |
| Pipeline Role | Prospect-submitted free text. Optional field — may be null. Not evaluated by any scoring or routing logic |

---

### Region__c

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Written By | Self-resolving — evaluates at read time from `State` via CASE statement |
| Default | None — formula field |
| Pipeline Role | Territorial classification — derives the Lead's geographic region from `State/Province`. Populated on all Records regardless of qualification status or Priority Level. Preserved on Priority Level High Records even after Flow escalation overrides `OwnerId` to Sophia Delgado. Used for regional pipeline reporting |
| Possible Values | `East Coast`, `West Coast`, `Central` |

---

### Lead_Created__c

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Written By | Self-resolving — evaluates at read time from `CreatedDate` |
| Default | None — formula field |
| Pipeline Role | Audit timestamp — records the date the Lead Record was created in Salesforce |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/field-dictionary.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
