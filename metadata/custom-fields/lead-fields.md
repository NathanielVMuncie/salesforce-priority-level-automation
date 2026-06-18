# Lead Custom Field Metadata

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document records the metadata for every custom Field on the Salesforce Lead Object for the Céleste Vineyards Lead Priority Level Automation system. Each entry reflects the live configuration retrieved from org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

Seven custom fields are active on the Lead Object. No additional custom fields exist on this object in the DevOrg. The authoritative field inventory is in `docs/03-data-model/field-inventory.md`.

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
| Description | Primary B2B gatekeeper signal and scoring input. Originates from `LeadSource` `Céleste Vineyards — Business Inquiry Form`. `Personal/Individual (Non-Business)` selection triggers the Wix form gate — the form collapses and no payload is transmitted. Valid B2B business types contribute point values to `varTotalScore` for `Priority_Level__c` calculation. |
| Inline Help Text | Identifies organizational category. Originates from `LeadSource` `Céleste Vineyards — Business Inquiry Form`. Valid entries contribute to automated `Priority_Level__c`. |
| Written By | Make.com — `SF_Make_Lead_To_Salesforce` — from Wix payload key `business_type` |

**Picklist Values:**

| Value | Default |
|---|---|
| Premium Wine Distributor | No |
| High-End Wine Store | No |
| Upscale Restaurant | No |
| Specialty Gourmet Grocer | No |
| Catering & Event Company | No |
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
| Description | Long text field capturing Lead-specific questions and unique inquiries. Originates from the Wix inquiry form. Provides unstructured context to supplement automated `Priority_Level__c` scoring. |
| Inline Help Text | Long text field for unique Lead questions and specific case inquiries. Originates from the Céleste Vineyards Business Inquiry Form. |
| Written By | Make.com — `SF_Make_Lead_To_Salesforce` — from Wix payload key `customer_note` |

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
| Description | Date-only formula field derived from the standard Lead `CreatedDate` field. Used to display and report on record creation as a date without time. |
| Inline Help Text | Displays the date this Lead was created. Formula field based on `CreatedDate` — does not include time. |
| Written By | Self-resolving — Formula Field |

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
| Description | Assigned by the `Lead_Scoring_and_Priority_Level_Assignment` Flow based on `varTotalScore`. `High` = score ≥ 12; `Medium` = score ≥ 8; `Low` = score < 8. `High` triggers escalation to the National Sales Director. |
| Inline Help Text | Automated priority output. `High` (≥ 12), `Medium` (≥ 8), or `Low` (< 8). `High` triggers escalation to the National Sales Director. |
| Written By | Flow — `Update Lead Priority and Score` Update Records element |

**Picklist Values:**

| Value | Default |
|---|---|
| High | No |
| Medium | No |
| Low | No |

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
| Description | Captures the Lead's expected procurement window. Originates from the Wix inquiry form. Scoring input for `Priority_Level__c` — Tier 3. |
| Inline Help Text | Lead's expected procurement window. Originates from the Céleste Vineyards Business Inquiry Form. Contributes to automated `Priority_Level__c` calculation. |
| Written By | Make.com — `SF_Make_Lead_To_Salesforce` — from Wix payload key `purchasing_timeline` |

**Picklist Values:**

| Value | Default |
|---|---|
| Immediate Need (Contracting) | No |
| Short-Term (Within 30 Days) | No |
| Evaluating Vendors (Next 90 Days) | No |
| Budget Planning (Future Quarter) | No |
| Information Gathering | No |

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
| Formula Treat Blanks As | BlankAsZero |
| Formula | CASE statement on `State` — full syntax in `metadata/formulas/formulas.md` |
| Description | Derives territorial classification (`East Coast`, `West Coast`, `Central`) from `State/Province`. Self-resolving — not written by Make.com, the Flow, or the Assignment Rule. Retains correct territorial value even when `OwnerId` is overridden to Sophia Delgado by Flow escalation. |
| Inline Help Text | Territorial classification based on State. East Coast, West Coast, or Central. |
| Written By | Self-resolving — Formula Field |

**Return Values:**

| Condition | Output |
|---|---|
| State maps to East Coast territory | `East Coast` |
| State maps to West Coast territory | `West Coast` |
| State maps to Central territory | `Central` |
| State is null or unrecognized | Empty string |

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
| Description | Captures purchasing authority and organizational position. Originates from the Wix inquiry form. Scoring input for `Priority_Level__c` — Tier 2. |
| Inline Help Text | Lead's purchasing authority or organizational position. Originates from the Céleste Vineyards Business Inquiry Form. Contributes to automated `Priority_Level__c` calculation. |
| Written By | Make.com — `SF_Make_Lead_To_Salesforce` — from Wix payload key `role` |

**Picklist Values:**

| Value | Default |
|---|---|
| Owner | No |
| Purchasing Manager | No |
| General Manager | No |
| Sales Manager | No |
| Event Coordinator | No |

---

## 3. Custom Field Count Summary

| Field Type | Count |
|---|---|
| Picklist | 3 |
| Picklist (Restricted) | 1 |
| Formula (Text) | 1 |
| Formula (Date) | 1 |
| TextArea | 1 |
| **Total Custom Fields** | **7** |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `metadata/custom-fields/lead-fields.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
