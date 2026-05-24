# Source to Lead Mapping

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Integration

---

## 1. Document Purpose

This document defines the complete field-level mapping between the Wix inquiry form submission payload and the Salesforce Lead Object. It establishes the exact mapping path for every field — from the Wix form key, through Make.com normalization, to the Salesforce Lead field API name and field type.

This is the authoritative field mapping reference for the integration pipeline. All mapping decisions documented here are reflected in the Make.com `Module 12` configuration.

---

## 2. Mapping Architecture

Every field that appears on the Lead Record originates from one of two sources:

| Source | Description |
|---|---|
| Wix payload | Field value submitted by the prospect and transmitted via the Wix Automation webhook |
| Make.com hardcoded | Value set explicitly in the Make.com module configuration — not derived from the payload |

Every payload Make.com receives is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any payload is transmitted. Non-business submissions never reach Make.com.

---

## 3. Complete Field Mapping — Module 12

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

---

## 4. Fields Outside Mapping Scope

These fields are populated after Record creation and are not part of the Make.com field mapping.

### 4.1 Fields Written by the Flow

These fields are written by the After-Save Flow via the `Update Lead Priority and Score` Update Records element or the escalation logic that precedes it.

| Salesforce Field Label | API Name | Written By | Path |
|---|---|---|---|
| Priority Level | `Priority_Level__c` | Flow — `Update Lead Priority and Score` | All Leads |
| Owner ID | `OwnerId` | Flow — escalation logic | All Leads |

### 4.2 Self-Resolving Formula Fields

These fields are Formula fields that resolve at read time from existing Record data. They are not written by the Flow, the Assignment Rule, or Make.com.

| Salesforce Field Label | API Name | Resolves From | Resolution Mechanism |
|---|---|---|---|
| Region | `Region__c` | `State` | Formula (Text) — CASE statement mapping state values to `East Coast`, `West Coast`, `Central`, or `International` |
| Lead Created | `Lead_Created__c` | `CreatedDate` | Formula (Date) — `DATEVALUE(CreatedDate)` strips time component |

---

## 5. Phone Normalization

The `phone` field requires normalization before it is written to the Salesforce `Phone` field. Wix transmits phone numbers in raw concatenated format. Make.com applies the following regex formula in `Module 12` before the API call executes.

**Formula:**
```
replace(trim(2. data: phone); /^\+?1?(\d{3})(\d{3})(\d{4})$/; +1 ($1) $2-$3)
```

| Raw Input | Normalized Output |
|---|---|
| `+14044474092` | `+1 (404) 447-4092` |
| `12123631071` | `+1 (212) 363-1071` |

---

## 6. LeadSource Hardcoding

The `LeadSource` field is not sourced from the Wix payload. It is hardcoded in `Module 12` as `Céleste Vineyards - Business Inquiry Form`. This value serves two purposes:

- It provides accurate source attribution on the Lead Record for reporting
- It is the entry condition evaluated by the After-Save Flow — only Records with this exact `LeadSource` value trigger the automation

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Integration |
| File Path | `docs/05-integration/source-to-lead-mapping.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
