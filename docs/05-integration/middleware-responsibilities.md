# Middleware Responsibilities

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Integration

---

## 1. Document Purpose

This document defines the precise responsibilities of Make.com as the middleware layer in the Céleste Vineyards Lead Priority Level Automation system. It establishes what Make.com is responsible for, what it is explicitly not responsible for, and why the boundary is drawn where it is.

---

## 2. Make.com's Role in the System

Make.com is the data conduit between Wix and Salesforce. It has no awareness of Salesforce business logic, scoring rules, or routing decisions. Its sole function is to receive a form submission payload, evaluate the submission type, normalize the data, and create a Lead Record in Salesforce with the correct Field values.

Make.com is not the automation layer. It is the ingestion layer.

---

## 3. Responsibilities

### 3.1 Receive the Wix Payload

Make.com receives the HTTP POST transmitted by the Wix Automation `POST_To_Make_Inlet_Webhook` on form submission. The Custom Webhook module listens for incoming payloads and passes each bundle to the Router module for evaluation.

### 3.2 Evaluate Submission Type

The Router module evaluates the `business_type` key in the payload and directs the submission to one of two Salesforce modules:

- Route 1 — Qualified: `business_type` is not `Personal/Individual (Non-Business)`
- Route 2 — Non-Qualified: `business_type` equals `Personal/Individual (Non-Business)`

This is the only decision Make.com makes. It does not evaluate Lead quality, assign scores, or determine routing.

### 3.3 Normalize Field Values

Make.com applies the phone normalization formula to the `phone` key before writing it to the Salesforce `Phone` Field. No other Field transformations are applied — all other values are passed through from the payload without modification.

### 3.4 Map Payload Keys to Salesforce Fields

Make.com maps each payload key to its corresponding Salesforce Lead Field API name in the module configuration. This mapping is explicit and deterministic — each key maps to exactly one Field.

### 3.5 Write Placeholder Values on the Non-Qualified Path

Module 13 writes `Not Applicable` to `Role__c`, `Purchasing_Timeline__c`, and `Priority_Level__c` for non-qualified submissions. This ensures the Lead Record arrives in Salesforce in a clean, documented state that accurately reflects its non-qualified nature before the Flow evaluates it.

### 3.6 Hardcode LeadSource

Both Module 12 and Module 13 hardcode `LeadSource` as `Céleste Vineyards - Business Inquiry Form`. This value is the Flow entry condition and must be consistent on every Record created through this pipeline.

### 3.7 Create the Lead Record via API

Make.com executes the Salesforce Create Record API call to create the Lead Record with all mapped Field values in a single operation.

---

## 4. Non-Responsibilities

The following are explicitly outside Make.com's scope. These concerns are handled by Salesforce.

| Item | Handled By |
|---|---|
| Qualification logic | Salesforce Flow — Gatekeeper Decision element |
| Lead scoring | Salesforce Flow — Scoring Decision elements |
| Priority Level assignment | Salesforce Flow — Priority Assignment Decision element |
| Escalation to Sophia Delgado | Salesforce Flow — Escalation Decision element |
| Territorial routing | Salesforce Assignment Rule |
| Queue assignment | Salesforce Assignment Rule |
| `Qualified__c` Field write | Salesforce Flow / Field default |
| `Region__c` Field resolution | Formula Field — self-resolving from `State/Province` |

---

## 5. Two-Path Architecture — Make.com's Role

Make.com enforces the first layer of the two-path architecture. The Salesforce Flow enforces the second layer. The two layers work independently and do not conflict.

| Layer | Component | Enforcement Mechanism |
|---|---|---|
| Layer 1 | Make.com Router | Evaluates `business_type` — routes to Module 12 or Module 13 |
| Layer 2 | Salesforce Flow | Evaluates `Business_Type__c` — qualified path continues, non-qualified path exits |

The Make.com layer ensures the correct placeholder values are written before the Record reaches Salesforce. The Salesforce layer ensures the correct automation logic executes regardless of how the Record was created.

---

## 6. Scenario Identity

| Attribute | Value |
|---|---|
| Scenario Name | `Wix_To_CelesteProd_B2B_Lead_Engine_v1` |
| Trigger | Custom Webhook — HTTP POST from Wix |
| Execution Mode | Immediately as data arrives |
| Total Modules | 4 |
| Module 1 | Custom Webhook — receives payload |
| Module 2 | Router — evaluates `business_type` |
| Module 12 | Salesforce Create Record — qualified path |
| Module 13 | Salesforce Create Record — non-qualified path |

---

*Salesforce Case Study: Lead - Priority Level Automation | Built by Nathaniel V. Muncie*
