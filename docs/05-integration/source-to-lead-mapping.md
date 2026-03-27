# Source to Lead Mapping

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document defines the complete Field-level mapping between the Wix inquiry form submission payload and the Salesforce Lead Object. It establishes the exact mapping path for every Field — from the Wix form key, through Make.com normalization, to the Salesforce Lead Field API name and Field type.

This is the authoritative Field mapping reference for the integration pipeline. All mapping decisions documented here are reflected in the Make.com Module 12 and Module 13 configurations.

---

## 2. Mapping Architecture

Every Field that appears on the Lead Record originates from one of three sources:

| Source | Description |
|---|---|
| Wix payload | Field value submitted by the prospect and transmitted via the Wix Automation webhook |
| Make.com hardcoded | Value set explicitly in the Make.com module configuration — not derived from the payload |
| Salesforce Field default | Value set at the Field level in Object Manager — applied automatically at Record creation |

---

## 3. Complete Field Mapping — Qualified Path (Module 12)

| Wix Form Key | Make.com Transformation | Salesforce Field Label | Salesforce API Name | Field Type |
|---|---|---|---|---|
| `first_name` | None | First Name | `FirstName` | Text |
| `last_name` | None | Last Name | `LastName` | Text |
| `company` | None | Company | `Company` | Text |
| `email` | None | Email | `Email` | Email |
| `phone` | Regex normalization to `+1 (xxx) xxx-xxxx` | Phone | `Phone` | Phone |
| `state` | None | State/Province | `State` | Text |
| `business_type` | None | Business Type | `Business_Type__c` | Picklist |
| `role` | None | Role | `Role__c` | Picklist |
| `purchasing_timeline` | None | Purchasing Timeline | `Purchasing_Timeline__c` | Picklist |
| `customer_note` | None | Customer Note | `Customer_Note__c` | Text Area |
| *(not from payload)* | Hardcoded: `Céleste Vineyards - Business Inquiry Form` | Lead Source | `LeadSource` | Picklist |
| *(not from payload)* | Field default: `True` | Qualified | `Qualified__c` | Checkbox |

---

## 4. Complete Field Mapping — Non-Qualified Path (Module 13)

Identity and contact Fields are mapped identically to Module 12. Scoring-relevant Fields are replaced with placeholder values.

| Wix Form Key | Make.com Value Written | Salesforce Field Label | Salesforce API Name | Field Type |
|---|---|---|---|---|
| `first_name` | Passed from payload | First Name | `FirstName` | Text |
| `last_name` | Passed from payload | Last Name | `LastName` | Text |
| `company` | Passed from payload (may be empty) | Company | `Company` | Text |
| `email` | Passed from payload | Email | `Email` | Email |
| `phone` | Regex normalization applied | Phone | `Phone` | Phone |
| `state` | Passed from payload | State/Province | `State` | Text |
| `business_type` | `Personal/Individual (Non-Business)` | Business Type | `Business_Type__c` | Picklist |
| *(not from payload)* | `Not Applicable` | Role | `Role__c` | Picklist |
| *(not from payload)* | `Not Applicable` | Purchasing Timeline | `Purchasing_Timeline__c` | Picklist |
| `customer_note` | Passed from payload | Customer Note | `Customer_Note__c` | Text Area |
| *(not from payload)* | `Not Applicable` | Priority Level | `Priority_Level__c` | Picklist |
| *(not from payload)* | Hardcoded: `Céleste Vineyards - Business Inquiry Form` | Lead Source | `LeadSource` | Picklist |
| *(not from payload)* | Field default: `True` | Qualified | `Qualified__c` | Checkbox |

---

## 5. Fields Written by the Flow — Not in Mapping Scope

The following Fields are written exclusively by the After-Save Flow after Record creation. They are not part of the Make.com Field mapping and are included here only for completeness.

| Salesforce Field Label | API Name | Written By | Path |
|---|---|---|---|
| Priority Level | `Priority_Level__c` | Flow (qualified path only) | Qualified Leads — overwrites null |
| Qualified | `Qualified__c` | Flow Update Records element | Qualified Leads — confirms True |
| Owner ID | `OwnerId` | Flow escalation logic | All qualified Leads |
| Qualification Status | `Qualification_Status__c` | Formula Field — self-resolving | All Records |
| Region | `Region__c` | Assignment Rule | All Records |

---

## 6. Phone Normalization

The `phone` Field requires normalization before it is written to the Salesforce `Phone` Field. Wix transmits phone numbers in raw concatenated format. Make.com applies the following regex formula in Module 12 and Module 13 before the API call executes.

**Formula:**
```
replace(trim(2. data: phone); /^\+?1?(\d{3})(\d{3})(\d{4})$/; +1 ($1) $2-$3)
```

| Raw Input | Normalized Output |
|---|---|
| `+14044474092` | `+1 (404) 447-4092` |
| `12123631071` | `+1 (212) 363-1071` |

---

## 7. LeadSource Hardcoding

The `LeadSource` Field is not sourced from the Wix payload. It is hardcoded in both Module 12 and Module 13 as `Céleste Vineyards - Business Inquiry Form`. This value serves two purposes:

- It provides accurate source attribution on the Lead Record for reporting
- It is the entry condition evaluated by the After-Save Flow — only Records with this exact `LeadSource` value trigger the automation

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | docs/05-integration/source-to-lead-mapping.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/05-integration/middleware-responsibilities.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
