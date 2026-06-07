# Field Inventory

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document provides a complete inventory of the custom fields active on the Lead Object in the Céleste Vineyards Lead Priority Level Automation system. It records field type, write authority, and pipeline role for each field.

Detailed field definitions — picklist values, descriptions, help text, and formula syntax — are in `docs/03-data-model/field-dictionary.md`. Formula field formula syntax is in `docs/03-data-model/priority-formulas.md`.

All field metadata is sourced from SFDX retrieval against org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

---

## 2. Custom Field Inventory

Seven custom fields are active on the Lead Object. No additional custom fields exist on this object in the DevOrg.

| API Name | Label | Type | Written By | Pipeline Role |
|---|---|---|---|---|
| `Business_Type__c` | Business Type | Picklist | Make.com | Scoring input — Tier 1; Gatekeeper signal at Wix form layer |
| `Role__c` | Role | Picklist | Make.com | Scoring input — Tier 2 |
| `Purchasing_Timeline__c` | Purchasing Timeline | Picklist | Make.com | Scoring input — Tier 3 |
| `Customer_Note__c` | Customer Note | Text Area (255) | Make.com | Unstructured prospect context |
| `Priority_Level__c` | Priority Level | Picklist (Restricted) | Flow | Scored priority output — `High`, `Medium`, or `Low` |
| `Region__c` | Region | Formula (Text) | Self-resolving | Territorial classification — `East Coast`, `West Coast`, or `Central` |
| `Lead_Created__c` | Lead Created | Formula (Date) | Self-resolving | Date-only creation timestamp |

---

## 3. Write Authority by Component

Write authority is exclusive and non-overlapping. No field is written by more than one component.

### 3.1 Make.com — `Module 12` (Salesforce Create Record)

Writes four fields at Lead Record creation via the Salesforce REST API. All values originate from the Wix form payload.

| API Name | Label | Type |
|---|---|---|
| `Business_Type__c` | Business Type | Picklist |
| `Role__c` | Role | Picklist |
| `Purchasing_Timeline__c` | Purchasing Timeline | Picklist |
| `Customer_Note__c` | Customer Note | Text Area (255) |

### 3.2 Flow — `Lead_Scoring_and_Priority_Level_Assignment`

Writes one custom field and one standard field via the `Update Lead Priority and Score` Update Records element — the sole DML write in the Flow.

| API Name | Label | Type | Notes |
|---|---|---|---|
| `Priority_Level__c` | Priority Level | Picklist (Restricted) | Custom field — assigned from `varPriorityLevel` |
| `OwnerId` | Owner ID | Standard (Lookup) | Standard field — assigned from `varOwnerID`; value is Sophia Delgado's User ID (Priority Level `High`) or the regional Queue or Sales Representative ID (Priority Level `Medium` / `Low`) |

### 3.3 Formula Fields — Self-Resolving

Two Formula Fields resolve at read time from standard fields. They are not written by Make.com, the Flow, or the Assignment Rule under any circumstances.

| API Name | Label | Type | Reads From |
|---|---|---|---|
| `Region__c` | Region | Formula (Text) | `State` (State/Province standard field) |
| `Lead_Created__c` | Lead Created | Formula (Date) | `CreatedDate` (standard system field) |

### 3.4 Assignment Rule — `regional_territory_assignment`

The Assignment Rule writes the standard `OwnerId` field at Record creation — before the Flow executes. It does not write any custom field.

| Field | Notes |
|---|---|
| `OwnerId` | Written to regional Queue or named Sales Representative based on `State/Province`; subsequently read and conditionally overridden by the Flow escalation segment |

---

## 4. Field Coverage Summary

| Component | Custom Fields Written | Standard Fields Written |
|---|---|---|
| Make.com | 4 (`Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Customer_Note__c`) | 7 (`FirstName`, `LastName`, `Email`, `Phone`, `Company`, `State`, `LeadSource`) |
| Flow | 1 (`Priority_Level__c`) | 1 (`OwnerId`) |
| Assignment Rule | 0 | 1 (`OwnerId` — pre-Flow baseline) |
| Formula Fields | 0 — self-resolving | 0 |

**Total custom fields on Lead Object:** 7

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/field-inventory.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
