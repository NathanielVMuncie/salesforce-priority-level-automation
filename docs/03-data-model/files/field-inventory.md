# Field Inventory

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document is the authoritative inventory of every Field on the Salesforce Lead Object that the automation system reads from or writes to. It establishes the complete data surface of the system — the inputs that drive qualification and scoring logic, and the outputs written back to the Lead Record by the Flow, Assignment Rule, and Formula Fields.

This document does not define scoring weights, threshold values, or Flow logic. Those are Phase 2 concerns. This document establishes what Fields exist, what type they are, and what role they play in the automation sequence. All Phase 2 documents are derived from the Field set defined here.

Fields are organized into four categories: standard Salesforce Fields used as inputs, custom input Fields populated by Make.com, custom output Fields written by automation, and Formula Fields that self-resolve from other Field values.

---

## 2. Field Categories

| Category | Description |
|---|---|
| Standard Input Fields | Native Salesforce Lead Fields populated by Make.com at Record creation. The Flow reads these Fields but does not write to them. |
| Custom Input Fields | Custom Fields added to the Lead Object to capture scoring and qualification data from the Wix form. Populated by Make.com at Record creation. The Flow reads these Fields but does not write to them. |
| Custom Output Fields | Custom Fields written by the After-Save Flow as outputs of the automation sequence. |
| Formula Fields | Fields that self-resolve from other Field values. Not written by the Flow or Make.com. |

---

## 3. Standard Input Fields

These are native Salesforce Lead Fields used by the automation system as inputs to qualification, scoring, and routing logic. They are populated by Make.com when the Lead Record is created.

| Field Label | API Name | Field Type | Role in Automation |
|---|---|---|---|
| First Name | `FirstName` | Text | Record identification |
| Last Name | `LastName` | Text | Record identification — required for Lead creation |
| Company | `Company` | Text | Record identification |
| Email | `Email` | Email | Contact Field — passed from payload |
| Phone | `Phone` | Phone | Contact Field — normalized by Make.com before write |
| State/Province | `State` | Text | Routing input — evaluated by Assignment Rule and `Region__c` Formula Field |
| Lead Source | `LeadSource` | Picklist | Flow entry condition — must equal `Céleste Vineyards - Business Inquiry Form` |
| Owner ID | `OwnerId` | Lookup | Written by Assignment Rule at creation — captured by Flow escalation logic via `{!$Record.OwnerId}` |

---

## 4. Custom Input Fields

These Fields are added to the Lead Object to capture the qualification and scoring data points submitted through the Wix inquiry form. All custom input Fields are populated by Make.com at Record creation.

| Field Label | API Name | Field Type | Required | Role in Automation |
|---|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | Yes | Gatekeeper evaluation and Business Type scoring dimension — first element in the Flow |
| Role | `Role__c` | Picklist | Yes | Role scoring dimension |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | No | Purchasing Timeline scoring dimension |
| Customer Note | `Customer_Note__c` | Text Area | No | Supplementary context — not evaluated by scoring logic |

---

## 5. Custom Output Fields

These Fields are written exclusively by the After-Save Flow or the Assignment Rule as outputs of the automation sequence. They are not populated by Make.com on the qualified path.

| Field Label | API Name | Field Type | Default Value | Written By | Purpose |
|---|---|---|---|---|---|
| Priority Level | `Priority_Level__c` | Picklist (Restricted) | None | Flow — Update Records element | Stores the assigned Priority Level — High, Medium, Low, Not Applicable, or Disqualified |
| Qualified | `Qualified__c` | Checkbox | True | Flow — Update Records element / Field default | Stores boolean qualification state — True for qualified Leads, False for disqualified |

---

## 6. Formula Fields

These Fields self-resolve from other Field values. They are not written by the Flow or Make.com. They update automatically whenever the source Field values change.

| Field Label | API Name | Field Type | Source Fields | Purpose |
|---|---|---|---|---|
| Qualification Status | `Qualification_Status__c` | Formula (Text) | `Qualified__c` | Displays visual qualification indicator — `✅ Qualified` or `❌ Not Qualified` |
| Region | `Region__c` | Formula (Text) | `State` | Derives geographic region from `State/Province` — East Coast, West Coast, Central, or International |
| Lead Created | `Lead_Created__c` | Formula (Date) | `CreatedDate` | Displays Record creation date without time component |

---

## 7. Field Count Summary

| Category | Count |
|---|---|
| Standard Input Fields | 8 |
| Custom Input Fields | 4 |
| Custom Output Fields | 2 |
| Formula Fields | 3 |
| **Total Fields in Automation Scope** | **17** |

---

## 8. Fields Explicitly Excluded from Automation Scope

The following standard Lead Fields exist on the Salesforce Lead Object but are not read or written by the automation system. Their exclusion is deliberate.

| Field Label | Exclusion Rationale |
|---|---|
| Title | Not evaluated by the scoring model |
| Website | Not used as a scoring signal in this system |
| Lead Status | Managed by the sales representative post-assignment — not written by automation |
| Description | Free-text Field — not parseable by Flow logic |
| Converted | System-managed Field — Lead conversion is out of scope |
| Rating | Native Lead Field — not used by this system |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 1 — Data Authority |
| File Path | docs/03-data-model/field-inventory.md |
| Date Produced | 2026-04-01 |
| Next Document | docs/03-data-model/field-dictionary.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
