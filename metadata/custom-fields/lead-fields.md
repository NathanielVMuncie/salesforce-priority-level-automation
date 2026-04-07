# Lead Custom Field Metadata

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Model

---

## 1. Document Purpose

This document records the metadata for every custom Field created on the Salesforce Lead Object for the Céleste Vineyards Lead Priority Level Automation system. Each entry reflects the live configuration retrieved from org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

This document is the authoritative metadata reference for the custom Field layer of the data model. It supplements `field-inventory.md` and `field-dictionary.md` with field-level metadata attributes sourced directly from SFDX retrieval.

---

## 2. Custom Field Definitions

### Business_Type__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Business_Type__c` |
| Field Label | Business Type |
| API Name | `Business_Type__c` |
| Field Type | Picklist |
| Object | Lead |
| Required | Yes |
| Track Feed History | No |
| Description | Primary B2B gatekeeper and scoring input. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Personal/Individual selections trigger frontend disqualification. Valid business types contribute point values to varTotalScore for Priority_Level__c calculation. |
| Inline Help Text | Identifies organizational category. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Personal/Individual selections are disqualified per B2B model requirements. Valid entries contribute to automated Priority_Level__c. |
| Written By | Make.com — from Wix payload key `business_type` |

**Picklist Values:**

| Value | Default |
|---|---|
| Specialty Gourmet Grocer | No |
| Upscale Restaurant | No |
| High-End Wine Store | No |
| Catering & Event Company | No |
| Premium Wine Distributor | No |
| Personal/Individual (Non-Business) | No |

---

### Customer_Note__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Customer_Note__c` |
| Field Label | Customer Note |
| API Name | `Customer_Note__c` |
| Field Type | TextArea |
| Object | Lead |
| Required | No |
| Track Feed History | No |
| Description | Long text field capturing Lead-specific questions and unique inquiries. Originates at the base of LeadSource Céleste Vineyards - Business Inquiry Form. Provides unstructured context to supplement automated Priority_Level__c scoring. |
| Inline Help Text | Long text field for unique Lead questions and specific case inquiries. Originates from the Céleste Vineyards - Business Inquiry Form. |
| Written By | Make.com — from Wix payload key `customer_note` |

---

### Lead_Created__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Lead_Created__c` |
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Object | Lead |
| Required | No |
| Formula | `DATEVALUE(CreatedDate)` |
| Formula Treat Blanks As | BlankAsZero |
| Description | Date-only formula field derived from the standard Lead CreatedDate field. Used to display and report on record creation as a date without time. |
| Inline Help Text | Displays the date this lead was created. This is a formula field based on the standard CreatedDate field and does not include time. |
| Written By | Self-resolving — Formula Field |

---

### Lead_Score__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Lead_Score__c` |
| Field Label | Lead Score |
| API Name | `Lead_Score__c` |
| Field Type | Number |
| Object | Lead |
| Precision | 18 |
| Scale | 0 |
| Required | No |
| External ID | No |
| Unique | No |
| Track Feed History | No |
| Description | Numerical output of varTotalScore. Aggregates point-attributed values from Role__c, Purchasing_Timeline__c, and Business_Type__c. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Foundation for Priority_Level__c logic. |
| Inline Help Text | Numerical sum of points (varTotalScore) from the Céleste Vineyards - Business Inquiry Form. Determines the automated Priority_Level__c based on Role__c, Purchasing_Timeline__c, and Business_Type__c. |
| Written By | Flow — Update Records element (qualified path only) |

---

### Priority_Level__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Priority_Level__c` |
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Object | Lead |
| Required | No |
| Restricted | Yes |
| Track Feed History | No |
| Description | Reflects the point sum (varTotalScore) from LeadSource Céleste Vineyards - Business Inquiry Form. Lead Scoring and Priority Automation Flow assigns Levels (High ≥ 12, Medium ≥ 8, Low < 8). High Priority escalated to National Sales Director. |
| Inline Help Text | Calculated via varTotalScore from the Céleste Vineyards - Business Inquiry Form. Defines Priority Level: High (≥ 12), Medium (≥ 8), or Low (< 8). High Priority triggers escalation to the National Sales Director. |
| Written By | Flow — Update Records element (qualified path) / Make.com Module 13 (non-qualified path) |

**Picklist Values:**

| Value | Default |
|---|---|
| Low | No |
| Medium | No |
| High | No |
| Disqualified | No |
| Not Applicable | No |

---

### Purchasing_Timeline__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Purchasing_Timeline__c` |
| Field Label | Purchasing Timeline |
| API Name | `Purchasing_Timeline__c` |
| Field Type | Picklist |
| Object | Lead |
| Required | No |
| Track Feed History | No |
| Description | Captures the Lead's expected procurement window. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c calculation logic and Lead scoring. |
| Inline Help Text | Indicate Lead's expected procurement window. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. This value determines the automated Priority_Level__c calculation and Lead scoring. |
| Written By | Make.com — from Wix payload key `purchasing_timeline` (qualified path) or hardcoded `Not Applicable` (Module 13 — non-qualified path) |

**Picklist Values:**

| Value | Default |
|---|---|
| Immediate Need (Contracting) | No |
| Short-Term (Within 30 Days) | No |
| Evaluating Vendors (Next 90 Days) | No |
| Budget Planning (Future Quarter) | No |
| Information Gathering | No |
| Not Applicable | No |

---

### Qualification_Status__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Qualification_Status__c` |
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Required | No |
| External ID | No |
| Unique | No |
| Formula Treat Blanks As | BlankAsZero |
| Formula | `IF(ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"), "❌ Not Qualified", "✅ Qualified")` |
| Description | Visual formula field derived from Business_Type__c. Displays a qualification indicator based on whether the Lead's business type meets the minimum B2B eligibility criteria defined by the Céleste Vineyards gatekeeper logic. |
| Inline Help Text | Visual qualification indicator. ✅ = Qualified for sales engagement. ❌ = Not Qualified based on lead intake criteria. |
| Written By | Self-resolving — Formula Field |

**Return Values:**

| Condition | Output |
|---|---|
| `Business_Type__c` = `Personal/Individual (Non-Business)` | ❌ Not Qualified |
| Any other `Business_Type__c` value | ✅ Qualified |

---

### Qualified__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Qualified__c` |
| Field Label | Qualified |
| API Name | `Qualified__c` |
| Field Type | Checkbox |
| Object | Lead |
| Default Value | True (Checked) |
| Track Feed History | No |
| Description | Authoritative qualification flag used by automation to indicate whether the Lead meets baseline B2B eligibility criteria for sales engagement. |
| Inline Help Text | Checked = Lead qualifies as a valid business prospect. Unchecked = Lead is disqualified from sales qualification logic. |
| Written By | Field default (True) / Flow — Update Records element (qualified path) |
| Defect History | D-01 — Field default was initially unset (False). Corrected to True in Object Manager during UAT. |

---

### Region__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Region__c` |
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Required | No |
| External ID | No |
| Unique | No |
| Formula Treat Blanks As | BlankAsZero |
| Formula | CASE statement — full formula documented in `metadata/formulas/priority-formulas.md` |
| Description | Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules Céleste - Regional Sales Representatives and Queue distribution for Céleste Vineyards Pipeline. |
| Inline Help Text | Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules and Queue distribution for Céleste Vineyards Pipeline. |
| Written By | Self-resolving — Formula Field |

**Return Values:**

| Condition | Output |
|---|---|
| State maps to East Coast territory | `East Coast` |
| State maps to West Coast territory | `West Coast` |
| State maps to Central territory | `Central` |
| State is null or unrecognized | `International` |

---

### Role__c

| Attribute | Value |
|---|---|
| Full Name | `Lead.Role__c` |
| Field Label | Role |
| API Name | `Role__c` |
| Field Type | Picklist |
| Object | Lead |
| Required | Yes |
| Track Feed History | No |
| Description | Captures purchasing authority and organizational position. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c calculation logic and Lead scoring. |
| Inline Help Text | Indicate Lead's purchasing authority or position. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. This value determines the automated Priority_Level__c calculation. |
| Written By | Make.com — from Wix payload key `role` (qualified path) or hardcoded `Not Applicable` (Module 13 — non-qualified path) |

**Picklist Values:**

| API Value | Label | Default |
|---|---|---|
| Owner | Owner | No |
| Purchasing_Manager | Purchasing Manager | No |
| General_Manager | General Manager | No |
| Sales_Manager | Sales Manager | No |
| Event_Coordinator | Event Coordinator | No |

---

## 3. Custom Field Count Summary

| Field Type | Count |
|---|---|
| Picklist | 3 |
| Number | 1 |
| Checkbox | 1 |
| Formula (Text) | 2 |
| Formula (Date) | 1 |
| TextArea | 1 |
| **Total Custom Fields** | **9** |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| File Path | `metadata/custom-fields/lead-fields.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*