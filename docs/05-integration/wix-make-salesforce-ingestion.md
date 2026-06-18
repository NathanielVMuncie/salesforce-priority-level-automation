# Wix-to-Salesforce Ingestion Sequence

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Integration

---

## 1. Document Purpose

This document defines the end-to-end ingestion sequence for the Céleste Vineyards Lead Priority Level Automation pipeline. It covers the complete cross-platform path from Wix form submission through Make.com middleware to Salesforce Lead Record creation. It establishes the handoff points between each layer, the data state at each boundary, and the integrity guarantees that hold across the pipeline.

This document describes the ingestion sequence only — the path from form submission to Lead Record creation. Scoring, priority assignment, escalation, and routing logic are downstream of ingestion and are covered in `docs/04-automation-logic/`.

---

## 2. Ingestion Sequence Overview

The ingestion pipeline executes in a fixed, linear sequence. No step executes before its predecessor completes. The sequence spans three layers: Wix, Make.com, and Salesforce.

| Step | Layer | Action | Output |
|---|---|---|---|
| 1 | Wix | Prospect selects B2B Business Type — qualification gate passes | Form remains active |
| 2 | Wix | Prospect completes and submits form | Wix Automation `WA_Inquiry_To_Make` fires |
| 3 | Wix | `POST_WH_Wix_Inquiry_To_Make` action transmits HTTP POST to Make.com | Payload delivered to `WH_Wix_Inquiry_To_Make` |
| 4 | Make.com | `WH_Wix_Inquiry_To_Make` receives payload | Bundle passed to `SF_Make_Lead_To_Salesforce` |
| 5 | Make.com | `SF_Make_Lead_To_Salesforce` normalizes phone, maps fields, hardcodes `LeadSource` | Salesforce Create Record API call prepared |
| 6 | Make.com | Salesforce Create Record API call executes | Lead Record created in Salesforce |
| 7 | Salesforce | Assignment Rule fires on Record creation | Lead Owner assigned to regional Queue |
| 8 | Salesforce | After-Save Flow fires | Scoring, priority assignment, and escalation sequence begins |

Steps 7 and 8 are downstream of ingestion. They are included here to establish the complete sequence — their internal logic is documented in `docs/04-automation-logic/`.

---

## 3. Wix Layer — Form Submission

### 3.1 Qualification Gate

The Wix inquiry form enforces the qualification gate before any payload is generated. When a prospect selects `Personal/Individual (Non-Business)` from the Business Type dropdown, the form collapses, the submit control is disabled, and no Wix Automation fires. No payload reaches Make.com. No Lead Record is created.

Every payload transmitted to Make.com originates from a B2B form submission. The gate is enforced entirely within Wix and requires no downstream logic to maintain.

### 3.2 Form Submission and Payload Generation

When a B2B prospect submits the form, the `WA_Inquiry_To_Make` automation fires, executing the `POST_WH_Wix_Inquiry_To_Make` action, which transmits an HTTP POST to the `WH_Wix_Inquiry_To_Make` webhook endpoint. The payload contains all field values collected by the form.

| Payload Key | Source Field |
|---|---|
| `first_name` | First Name |
| `last_name` | Last Name |
| `email` | Email |
| `phone` | Phone |
| `company` | Company |
| `state` | State/Province |
| `business_type` | Business Type |
| `role` | Role |
| `purchasing_timeline` | Purchasing Timeline |
| `customer_note` | Customer Note |

The Wix layer does not transform, filter, or validate payload values beyond the qualification gate. All field values are transmitted as submitted.

---

## 4. Make.com Layer — Payload Processing

### 4.1 Scenario Identity

| Attribute | Value |
|---|---|
| Scenario Name | `Wix_Inquiry_To_Salesforce_Lead` |
| Trigger | Custom Webhook — HTTP POST from `WA_Inquiry_To_Make` via `POST_WH_Wix_Inquiry_To_Make` action |
| Execution Mode | Immediately as data arrives |
| Total Modules | 2 |

### 4.2 WH_Wix_Inquiry_To_Make — Payload Receipt

`WH_Wix_Inquiry_To_Make` is a Custom Webhook module. It receives the HTTP POST from the Wix Automation, parses the incoming payload, and passes each key-value pair as a bundle to `SF_Make_Lead_To_Salesforce`. No transformation, filtering, or routing is applied at this module.

### 4.3 SF_Make_Lead_To_Salesforce — Field Mapping and Record Creation

`SF_Make_Lead_To_Salesforce` is a Salesforce Create Record module. It applies the phone normalization formula to the `phone` key, maps all remaining payload keys to their corresponding Salesforce Lead field API names, hardcodes `LeadSource` as `Céleste Vineyards — Business Inquiry Form`, and executes the Salesforce Create Record API call.

The phone normalization formula is the only transformation applied in the scenario. All other payload values are written to Salesforce without modification.

`LeadSource` is hardcoded — not sourced from the Wix payload — to guarantee the exact string required by the `Lead_Scoring_and_Priority_Level_Assignment` Flow entry condition is present on every Record created through this pipeline.

---

## 5. Salesforce Layer — Lead Record Creation

When the Salesforce Create Record API call completes, a Lead Record exists in Salesforce with all fields written by `SF_Make_Lead_To_Salesforce`. The Lead Record at creation point contains:

- Standard fields: `FirstName`, `LastName`, `Email`, `Phone`, `Company`, `State`
- Custom fields: `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Customer_Note__c`
- Hardcoded field: `LeadSource` = `Céleste Vineyards — Business Inquiry Form`
- Formula fields: `Region__c` and `Lead_Created__c` resolve at read time from `State` and `CreatedDate`

The ingestion sequence is complete at this point. The Assignment Rule and After-Save Flow fire on creation — their execution is documented in `docs/04-automation-logic/`.

---

## 6. Handoff Points

Three handoff points define the layer boundaries. Each handoff is unidirectional and deterministic.

| Handoff | From | To | Mechanism | Data State |
|---|---|---|---|---|
| Wix → Make.com | `WA_Inquiry_To_Make` — `POST_WH_Wix_Inquiry_To_Make` | `WH_Wix_Inquiry_To_Make` | HTTP POST | Raw form payload — B2B confirmed |
| Make.com → Salesforce | `SF_Make_Lead_To_Salesforce` | Salesforce Lead Object | REST API Create Record call | Normalized, mapped payload with hardcoded `LeadSource` |
| Ingestion → Automation | Salesforce Lead Record created | Assignment Rule + After-Save Flow | Record creation event | Fully populated Lead Record |

---

## 7. Ingestion Integrity Guarantees

The following guarantees hold for every Lead Record created through this pipeline.

| Guarantee | Mechanism |
|---|---|
| Every Lead is a confirmed B2B submission | Wix qualification gate — enforced before payload generation |
| `LeadSource` is always exact | Hardcoded in `SF_Make_Lead_To_Salesforce` — not sourced from form |
| `Phone` is normalized | Phone normalization formula applied in `SF_Make_Lead_To_Salesforce` |
| All scoring fields are populated | `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c` are required on the Wix form |
| `Region__c` is always populated | Formula Field — self-resolving from `State` at read time |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Integration |
| File Path | `docs/05-integration/wix-make-salesforce-ingestion.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
