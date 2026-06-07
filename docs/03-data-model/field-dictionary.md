# Field Dictionary
 
**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model
 
---
 
## 1. Document Purpose
 
This document records the custom field definitions active on the Lead Object in the Céleste Vineyards Lead Priority Level Automation system. It covers write authority, field type, picklist values, description, and help text for each field.
 
All field metadata is sourced from SFDX retrieval against org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.
 
---
 
## 2. Make.com Input Fields
 
### 2.1 `Business_Type__c` — Business Type
 
| Attribute | Value |
|---|---|
| API Name | `Business_Type__c` |
| Label | Business Type |
| Type | Picklist |
| Written By | Make.com |
| Required | No |
 
**Description:**
Primary scoring input and Gatekeeper signal. Originates from `LeadSource` `Céleste Vineyards - Business Inquiry Form`. `Personal/Individual (Non-Business)` selections trigger front-end disqualification at the Wix form layer — no payload is transmitted. Valid B2B values contribute point values to `varTotalScore` for `Priority_Level__c` calculation.
 
**Help Text:**
Identifies organizational category. Originates from `Céleste Vineyards - Business Inquiry Form`. `Personal/Individual (Non-Business)` selections are blocked at the Wix form layer per B2B model requirements. Valid entries contribute to automated `Priority_Level__c` scoring.
 
**Picklist Values:**
- `Premium Wine Distributor`
- `High-End Wine Store`
- `Upscale Restaurant`
- `Specialty Gourmet Grocer`
- `Catering & Event Company`
- `Personal/Individual (Non-Business)`
---
 
### 2.2 `Role__c` — Role
 
| Attribute | Value |
|---|---|
| API Name | `Role__c` |
| Label | Role |
| Type | Picklist |
| Written By | Make.com |
| Required | No |
 
**Description:**
Captures purchasing authority and organizational position. Originates from `LeadSource` `Céleste Vineyards - Business Inquiry Form`. Primary input for `varTotalScore` accumulation and `Priority_Level__c` calculation.
 
**Help Text:**
Indicates the Lead's purchasing authority or organizational position. Originates from `Céleste Vineyards - Business Inquiry Form`. This value contributes to the automated `Priority_Level__c` calculation.
 
**Picklist Values:**
- `Owner`
- `Purchasing Manager`
- `General Manager`
- `Sales Manager`
- `Event Coordinator`
---
 
### 2.3 `Purchasing_Timeline__c` — Purchasing Timeline
 
| Attribute | Value |
|---|---|
| API Name | `Purchasing_Timeline__c` |
| Label | Purchasing Timeline |
| Type | Picklist |
| Written By | Make.com |
| Required | No |
 
**Description:**
Captures the Lead's expected procurement window. Originates from `LeadSource` `Céleste Vineyards - Business Inquiry Form`. Primary input for `varTotalScore` accumulation and `Priority_Level__c` calculation.
 
**Help Text:**
Indicates the Lead's expected procurement window. Originates from `Céleste Vineyards - Business Inquiry Form`. This value contributes to the automated `Priority_Level__c` calculation and Lead scoring.
 
**Picklist Values:**
- `Immediate Need (Contracting)`
- `Short-Term (Within 30 Days)`
- `Evaluating Vendors (Next 90 Days)`
- `Budget Planning (Future Quarter)`
- `Information Gathering`
---
 
### 2.4 `Customer_Note__c` — Customer Note
 
| Attribute | Value |
|---|---|
| API Name | `Customer_Note__c` |
| Label | Customer Note |
| Type | Text Area (255) |
| Written By | Make.com |
| Required | No |
 
**Description:**
Captures Lead-specific questions and unique inquiries submitted at the base of the `Céleste Vineyards - Business Inquiry Form`. Provides unstructured context to supplement automated `Priority_Level__c` scoring.
 
**Help Text:**
Free-text field for unique Lead questions and specific case inquiries. Originates from the `Céleste Vineyards - Business Inquiry Form`.
 
---
 
## 3. Flow-Written Fields
 
### 3.1 `Priority_Level__c` — Priority Level
 
| Attribute | Value |
|---|---|
| API Name | `Priority_Level__c` |
| Label | Priority Level |
| Type | Picklist (Restricted) |
| Written By | Flow — `Lead_Scoring_and_Priority_Level_Assignment` |
| Required | No |
 
**Description:**
Reflects the composite `varTotalScore` derived from `LeadSource` `Céleste Vineyards - Business Inquiry Form`. Flow `Lead_Scoring_and_Priority_Level_Assignment` assigns `High` (≥ 12), `Medium` (≥ 8), or `Low` (< 8). Priority Level High Leads are escalated to the National Sales Director via Flow `OwnerId` override.
 
**Help Text:**
Calculated via `varTotalScore` from the `Céleste Vineyards - Business Inquiry Form`. Defines Priority Level: `High` (≥ 12), `Medium` (≥ 8), or `Low` (< 8). Priority Level High triggers escalation to the National Sales Director.
 
**Picklist Values:**
- `High`
- `Medium`
- `Low`
**Scoring Thresholds:**
 
| Priority Level | Threshold |
|---|---|
| `High` | `varTotalScore` ≥ 12 |
| `Medium` | `varTotalScore` ≥ 8 |
| `Low` | `varTotalScore` < 8 |
| Maximum possible score | 15 |
 
---
 
## 4. Formula Fields
 
### 4.1 `Region__c` — Region
 
| Attribute | Value |
|---|---|
| API Name | `Region__c` |
| Label | Region |
| Type | Formula (Text) |
| Written By | Formula (read-only) |
| Required | No |
 
**Description:**
Identifies Lead geographic classification — `East Coast`, `West Coast`, or `Central` — based on `State/Province` via a CASE statement. Drives territorial alignment with the Lead Assignment Rule. Self-resolving at read time — not written by the Flow, Assignment Rule, or Make.com.
 
**Help Text:**
Identifies Lead geographic classification — `East Coast`, `West Coast`, or `Central` — based on `State/Province`. Drives territorial alignment with the Lead Assignment Rule and regional Queue routing.
 
---
 
### 4.2 `Lead_Created__c` — Lead Created
 
| Attribute | Value |
|---|---|
| API Name | `Lead_Created__c` |
| Label | Lead Created |
| Type | Formula (Date) |
| Written By | Formula (read-only) |
| Required | No |
 
**Description:**
Date-only formula field derived from the standard `CreatedDate` field using `DATEVALUE()`. Displays and reports Lead Record creation as a date without the time component. Self-resolving at read time — not written by the Flow, Assignment Rule, or Make.com.
 
**Help Text:**
Displays the date this Lead Record was created. Formula field based on the standard `CreatedDate` field. Does not include time.
 
---
 
## 5. Document Status
 
| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/field-dictionary.md` |
 
---
 
*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*