# Field Inventory

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document provides a complete inventory of every custom field on the Salesforce Lead Object used in the Céleste Vineyards Lead Priority Level Automation system. It establishes the field name, API name, type, source, and role in the pipeline for each custom field. All entries are derived from retrieved `.field-meta.xml` metadata from the live Salesforce Developer Edition org.

This document is the authoritative field reference for Phase 1. Detailed definitions, picklist values, and formula logic are documented in `field-dictionary.md`.

---

## 2. Inventory Summary

Nine custom fields are present on the Lead Object in support of this system. Fields are grouped by functional role.

| # | Field Label | API Name | Type | Required | Functional Role |
|---|---|---|---|---|---|
| 1 | Business Type | `Business_Type__c` | Picklist | Yes | Gatekeeper + scoring dimension |
| 2 | Role | `Role__c` | Picklist | Yes | Scoring dimension |
| 3 | Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | No | Scoring dimension |
| 4 | Priority Level | `Priority_Level__c` | Picklist | No | Flow output — assigned priority |
| 5 | Qualified | `Qualified__c` | Checkbox | No | Qualification state flag |
| 6 | Qualification Status | `Qualification_Status__c` | Formula (Text) | No | Display formula — derived from `Qualified__c` |
| 7 | Customer Note | `Customer_Note__c` | Text Area | No | Pass-through from form |
| 8 | Region | `Region__c` | Formula (Text) | No | Geographic classification — derived from `State` |
| 9 | Lead Created | `Lead_Created__c` | Formula (Date) | No | Date display — derived from `CreatedDate` |

---

## 3. Field Groups

### 3.1 Scoring Input Fields

These three fields drive the qualification gate and weighted scoring model. Their values originate from the Wix inquiry form and are transmitted to Salesforce by Make.com.

| Field Label | API Name | Type | Max Score Points |
|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | 5 |
| Role | `Role__c` | Picklist | 5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | 5 |

`Business_Type__c` is the gatekeeper field. It serves a dual purpose — enforcing the qualification gate at the first Flow Decision element and contributing the Business Type dimension score to `varTotalScore`.

### 3.2 Automation Output Fields

These fields are written by the Flow and Assignment Rule at the conclusion of the automation pipeline. They are not populated from the form directly.

| Field Label | API Name | Type | Written By |
|---|---|---|---|
| Priority Level | `Priority_Level__c` | Picklist | Flow — Update Records element |
| Qualified | `Qualified__c` | Checkbox | Field default (True) + Flow Update Records element |

### 3.3 Formula Fields

These fields are self-resolving formula fields. They do not require explicit writes — they evaluate automatically based on other field values.

| Field Label | API Name | Type | Derives From |
|---|---|---|---|
| Qualification Status | `Qualification_Status__c` | Formula (Text) | `Qualified__c` |
| Region | `Region__c` | Formula (Text) | `State` (standard field) |
| Lead Created | `Lead_Created__c` | Formula (Date) | `CreatedDate` (standard field) |

### 3.4 Pass-Through Fields

This field carries prospect-submitted free text from the Wix form to the Lead Record. It is not evaluated by any automation logic.

| Field Label | API Name | Type | Source |
|---|---|---|---|
| Customer Note | `Customer_Note__c` | Text Area | Wix form → Make.com → Salesforce |

---

## 4. Field Source Map

Every field on the Lead Record originates from one of three sources. The table below maps each custom field to its origin.

| Field Label | API Name | Source |
|---|---|---|
| Business Type | `Business_Type__c` | Wix form → Make.com → Salesforce |
| Role | `Role__c` | Wix form → Make.com → Salesforce |
| Purchasing Timeline | `Purchasing_Timeline__c` | Wix form → Make.com → Salesforce |
| Customer Note | `Customer_Note__c` | Wix form → Make.com → Salesforce |
| Priority Level | `Priority_Level__c` | Flow automation (qualified path) / Make.com placeholder (non-qualified path) |
| Qualified | `Qualified__c` | Field default (True at creation) — Flow confirms on qualified path |
| Qualification Status | `Qualification_Status__c` | Formula — self-resolving from `Qualified__c` |
| Region | `Region__c` | Formula — self-resolving from `State` |
| Lead Created | `Lead_Created__c` | Formula — self-resolving from `CreatedDate` |

---

## 5. Metadata Retrieval Details

| Attribute | Value |
|---|---|
| Retrieval Command | `sf project retrieve start --metadata "CustomField:Lead.[API Name]"` |
| Org | celeste-vineyards-dev-ed.develop.my.salesforce.com |
| API Version | v66.0 |
| Retrieval Status | Succeeded |
| Files Retrieved | 9 `.field-meta.xml` files |
| Retrieval Path | `force-app/main/default/objects/Lead/fields/` |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final — Phase 1 |
| Phase | 1 — Data Authority |
| File Path | `docs/03-data-model/field-inventory.md` |
| Date Produced | 2026-03-26 |
| Next Document | `docs/03-data-model/field-dictionary.md` |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
