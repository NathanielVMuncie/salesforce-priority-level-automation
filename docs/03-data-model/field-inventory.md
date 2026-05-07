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
| Company | `Company` | Text | `company` | None | Identity |
| Email | `Email` | Email | `email` | None | Contact |
| Phone | `Phone` | Phone | `phone` | Regex normalization to `+1 (xxx) xxx-xxxx` | Contact |
| State/Province | `State` | Text(255) | `state` | None | Routing — evaluated by Assignment Rule |
| Lead Source | `LeadSource` | Picklist | *(not from payload)* | Hardcoded: `Céleste Vineyards - Business Inquiry Form` | Flow entry condition |
| Owner ID | `OwnerId` | Lookup | *(not from payload)* | Set by Assignment Rule to Territory Sales Representative or regional Queue proxy; overridden by Flow escalation for Priority Level High | Routing — final owner |

---

## 3. Custom Fields — In Pipeline Scope

These custom fields were created on the Lead Object to support the scoring model and routing logic of this system.

| Field Label | API Name | Field Type | Written By | Pipeline Role |
|---|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | Make.com (payload) | Scoring tier 1 — Tier 1 Decision element |
| Role | `Role__c` | Picklist | Make.com (payload) | Scoring tier 2 — Tier 2 Decision element |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | Make.com (payload) | Scoring tier 3 — Tier 3 Decision element |
| Priority Level | `Priority_Level__c` | Picklist | Flow — `Update Lead Priority and Score` Update Records element | Priority output — written by Flow on all scored Leads |
| Lead Score | `Lead_Score__c` | Number | Flow — `Update Lead Priority and Score` Update Records element | Composite score output (3–15) — written by Flow |
| Customer Note | `Customer_Note__c` | Text Area | Make.com (payload — optional) | Prospect-submitted free text |
| Region | `Region__c` | Formula (Text) | Self-resolving — derives from `State` via CASE statement | Territorial classification — populated on all Records |
| Lead Created | `Lead_Created__c` | Formula (Date) | Self-resolving — derives from `CreatedDate` | Audit timestamp |

---

## 4. Field Count Summary

| Category | Count |
|---|---|
| Standard fields in pipeline scope | 8 |
| Custom fields | 8 |
| **Total fields in scope** | **16** |

---

## 5. Fields Written by Layer

| Field | Wix | Make.com | Assignment Rule | Flow |
|---|---|---|---|---|
| `FirstName` | ✅ Collected | ✅ Written | | |
| `LastName` | ✅ Collected | ✅ Written | | |
| `Company` | ✅ Collected | ✅ Written | | |
| `Email` | ✅ Collected | ✅ Written | | |
| `Phone` | ✅ Collected | ✅ Written (normalized) | | |
| `State` | ✅ Collected | ✅ Written | | |
| `LeadSource` | | ✅ Hardcoded | | |
| `OwnerId` | | | ✅ Territory Sales Representative assignment | ✅ Escalation override |
| `Business_Type__c` | ✅ Collected | ✅ Written | | |
| `Role__c` | ✅ Collected | ✅ Written | | |
| `Purchasing_Timeline__c` | ✅ Collected | ✅ Written | | |
| `Priority_Level__c` | | | | ✅ Written |
| `Lead_Score__c` | | | | ✅ Written |
| `Customer_Note__c` | ✅ Collected | ✅ Written | | |
| `Region__c` | | | | ✅ Formula — self-resolving |
| `Lead_Created__c` | | | | ✅ Formula — self-resolving |

---

## 6. Custom Field — Picklist Values

### 6.1 Business_Type__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| `Premium Wine Distributor` | Highest value | 5 |
| `High-End Wine Store` | High value | 4 |
| `Upscale Restaurant` | Mid value | 3 |
| `Specialty Gourmet Grocer` | Low value | 2 |
| `Catering & Event Company` | Lowest value | 1 |

### 6.2 Role__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| `Owner` | Highest authority | 5 |
| `Purchasing Manager` | Decision-maker | 4 |
| `General Manager` | Decision-maker | 3 |
| `Sales Manager` | Partial authority | 2 |
| `Event Coordinator` | Low authority | 1 |

### 6.3 Purchasing_Timeline__c

| Picklist Value | Scoring Role | Points |
|---|---|---|
| `Immediate Need (Contracting)` | Highest urgency | 5 |
| `Short-Term (Within 30 Days)` | High urgency | 4 |
| `Evaluating Vendors (Next 90 Days)` | Mid urgency | 3 |
| `Budget Planning (Future Quarter)` | Low urgency | 2 |
| `Information Gathering` | No urgency | 1 |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `docs/03-data-model/field-inventory.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
