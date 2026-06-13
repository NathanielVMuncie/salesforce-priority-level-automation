# Source-to-Lead Field Mapping

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Integration

---

## 1. Document Purpose

This document defines the canonical field-by-field mapping executed by `SF_Make_Lead_To_Salesforce` of the Make.com scenario `Wix_Inquiry_To_Salesforce_Lead`. It records every Wix form payload key received by the `WH_Wix_Inquiry_To_Make` module, the transformation applied (if any), and the Salesforce Lead field API name the value is written to at Record creation.

This mapping is the complete data contract between the Wix form submission and the Salesforce Lead Record. Every field present on the Lead Record at the time the Assignment Rule and Flow fire originates from this mapping — either written directly by `SF_Make_Lead_To_Salesforce` or resolved at read time by a Formula Field.

Every payload received by `SF_Make_Lead_To_Salesforce` is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any payload is transmitted. No non-business submission ever reaches Make.com.

---

## 2. Scenario Identity

| Attribute | Value |
|---|---|
| Scenario Name | `Wix_Inquiry_To_Salesforce_Lead` |
| Trigger | Custom Webhook — HTTP POST from Wix Automation `POST_To_Make_Inlet_Webhook` |
| Execution Mode | Immediately as data arrives |
| Total Modules | 2 |
| Receiving Module | `WH_Wix_Inquiry_To_Make` — Custom Webhook |
| Writing Module | `SF_Make_Lead_To_Salesforce` — Salesforce Create Record |

---

## 3. Payload Reception — WH_Wix_Inquiry_To_Make

`WH_Wix_Inquiry_To_Make` is a Custom Webhook module that listens for the HTTP POST transmitted by the Wix Automation `POST_To_Make_Inlet_Webhook` on form submission. It parses the incoming payload and passes each key-value pair as a bundle to `SF_Make_Lead_To_Salesforce`.

`WH_Wix_Inquiry_To_Make` performs no transformation, filtering, or routing. Every key in the Wix payload is passed to `SF_Make_Lead_To_Salesforce` unchanged. The sole transformation in the scenario is the phone normalization formula applied in `SF_Make_Lead_To_Salesforce` before the Salesforce Create Record API call executes.

---

## 4. Field Mapping — SF_Make_Lead_To_Salesforce

`SF_Make_Lead_To_Salesforce` maps each Wix payload key to its corresponding Salesforce Lead field API name. The mapping is explicit and deterministic — each key maps to exactly one field. No field is conditionally included or excluded.

### 4.1 Standard Lead Fields

| Wix Payload Key | Salesforce Field Label | Salesforce API Name | Transformation |
|---|---|---|---|
| `first_name` | First Name | `FirstName` | None |
| `last_name` | Last Name | `LastName` | None |
| `email` | Email | `Email` | None |
| `phone` | Phone | `Phone` | Phone normalization formula applied — see Section 5 |
| `company` | Company | `Company` | None |
| `state` | State/Province | `State` | None |

### 4.2 Custom Lead Fields

| Wix Payload Key | Salesforce Field Label | Salesforce API Name | Transformation |
|---|---|---|---|
| `business_type` | Business Type | `Business_Type__c` | None |
| `role` | Role | `Role__c` | None |
| `purchasing_timeline` | Purchasing Timeline | `Purchasing_Timeline__c` | None |
| `customer_note` | Customer Note | `Customer_Note__c` | None |

### 4.3 Hardcoded Fields

`SF_Make_Lead_To_Salesforce` hardcodes one field value that is not sourced from the Wix payload. This value is constant on every Lead Record created through this pipeline.

| Field Label | Salesforce API Name | Hardcoded Value | Purpose |
|---|---|---|---|
| Lead Source | `LeadSource` | `Céleste Vineyards — Business Inquiry Form` | Flow entry condition — must be exact match |

`LeadSource` is the entry condition for the `Lead_Scoring_and_Priority_Level_Assignment` Flow. If this value does not match exactly, the Flow does not fire. It is hardcoded in `SF_Make_Lead_To_Salesforce` — never sourced from the Wix payload — to guarantee consistency on every Record created through this pipeline.

---

## 5. Phone Normalization

Make.com applies a phone normalization formula to the `phone` payload key before writing it to the Salesforce `Phone` field. The formula standardizes the raw phone string submitted by the prospect into E.164-compatible formatting.

| Attribute | Value |
|---|---|
| Input | Raw phone string from Wix payload key `phone` |
| Output | Normalized phone string written to Salesforce `Phone` |
| Applied In | `SF_Make_Lead_To_Salesforce` — Salesforce Create Record |
| Target Field | `Phone` |

No other field transformation is applied anywhere in the scenario. All other values are passed from the Wix payload to Salesforce without modification.

---

## 6. Fields Not Written by Make.com

The following fields on the Lead Record are populated by mechanisms other than `SF_Make_Lead_To_Salesforce`. They are included here to establish the complete field origin picture at the point of Record creation.

| Field | API Name | Populated By | Timing |
|---|---|---|---|
| Priority Level | `Priority_Level__c` | Flow — `Lead_Scoring_and_Priority_Level_Assignment` | After-Save, post-creation |
| Owner ID | `OwnerId` | Assignment Rule → Flow escalation override | At creation / After-Save |
| Region | `Region__c` | Formula Field — reads from `State` | Read-time resolution |
| Lead Created | `Lead_Created__c` | Formula Field — reads from `CreatedDate` | Read-time resolution |

---

## 7. Complete Mapping Summary

| Source | Wix Payload Key | Salesforce API Name | Written By | Transformation |
|---|---|---|---|---|
| Wix form | `first_name` | `FirstName` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `last_name` | `LastName` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `email` | `Email` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `phone` | `Phone` | `SF_Make_Lead_To_Salesforce` | Phone normalization |
| Wix form | `company` | `Company` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `state` | `State` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `business_type` | `Business_Type__c` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `role` | `Role__c` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `purchasing_timeline` | `Purchasing_Timeline__c` | `SF_Make_Lead_To_Salesforce` | None |
| Wix form | `customer_note` | `Customer_Note__c` | `SF_Make_Lead_To_Salesforce` | None |
| Hardcoded | — | `LeadSource` | `SF_Make_Lead_To_Salesforce` | Constant value |
| Flow | — | `Priority_Level__c` | Flow | Scoring and threshold logic |
| Flow | — | `OwnerId` | Assignment Rule + Flow | Territory routing + escalation |
| Formula | — | `Region__c` | Formula Field | CASE on `State` |
| Formula | — | `Lead_Created__c` | Formula Field | `DATEVALUE(CreatedDate)` |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Integration |
| File Path | `docs/05-integration/source-to-lead-mapping.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
