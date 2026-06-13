# Middleware Responsibilities

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Integration

---

## 1. Document Purpose

This document defines the precise responsibilities of Make.com as the middleware layer in the Céleste Vineyards Lead Priority Level Automation system. It establishes what Make.com is responsible for, what it is explicitly not responsible for, and why the boundary is drawn where it is.

---

## 2. Make.com's Role in the System

Make.com is the data conduit between Wix and Salesforce. It has no awareness of Salesforce business logic, scoring rules, or routing decisions. Its sole function is to receive a B2B form submission payload, normalize the data, and create a Lead Record in Salesforce with the correct field values.

Make.com is not the automation layer. It is the ingestion layer.

Every payload Make.com receives is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any payload is transmitted. Non-business submissions never reach Make.com.

---

## 3. Responsibilities

### 3.1 Receive the Wix Payload

Make.com receives the HTTP POST transmitted by the Wix Automation `POST_To_Make_Inlet_Webhook` on form submission. The `WH_Wix_Inquiry_To_Make` module listens for incoming payloads and passes each bundle to the `SF_Make_Lead_To_Salesforce` module.

### 3.2 Normalize Field Values

Make.com applies the phone normalization formula to the `phone` key before writing it to the Salesforce `Phone` field. No other field transformations are applied — all other values are passed through from the payload without modification.

### 3.3 Map Payload Keys to Salesforce Fields

Make.com maps each payload key to its corresponding Salesforce Lead field API name in `SF_Make_Lead_To_Salesforce`. This mapping is explicit and deterministic — each key maps to exactly one field.

### 3.4 Hardcode LeadSource

`SF_Make_Lead_To_Salesforce` hardcodes `LeadSource` as `Céleste Vineyards — Business Inquiry Form`. This value is the Flow entry condition and must be consistent on every Record created through this pipeline.

### 3.5 Create the Lead Record via API

Make.com executes the Salesforce Create Record API call to create the Lead Record with all mapped field values in a single operation.

---

## 4. Non-Responsibilities

The following are explicitly outside Make.com's scope. These concerns are handled by Salesforce.

| Item | Handled By |
|---|---|
| Lead scoring | Salesforce Flow — Scoring Decision elements |
| Priority Level assignment | Salesforce Flow — `Determine Priority Level` Decision element |
| Escalation to Sophia Delgado | Salesforce Flow — `Escalate High Priority to Sophia` Decision element |
| Territorial routing | Salesforce Assignment Rule |
| Queue assignment | Salesforce Assignment Rule |
| `Region__c` field resolution | Formula field — self-resolving from `State/Province` |

---

## 5. Scenario Identity

| Attribute | Value |
|---|---|
| Scenario Name | `Wix_Inquiry_To_Salesforce_Lead` |
| Trigger | Custom Webhook — HTTP POST from Wix |
| Execution Mode | Immediately as data arrives |
| Total Modules | 2 |
| Webhook Module | `WH_Wix_Inquiry_To_Make` — receives payload |
| Salesforce Module | `SF_Make_Lead_To_Salesforce` — maps fields and creates Lead Record |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Integration |
| File Path | `docs/05-integration/middleware-responsibilities.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
