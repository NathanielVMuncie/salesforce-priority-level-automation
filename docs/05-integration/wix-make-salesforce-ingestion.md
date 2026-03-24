# Wix to Salesforce Ingestion

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 4 — Integration Boundary

---

## 1. Document Purpose

This document describes the end-to-end data ingestion path from the Wix inquiry form submission to the creation of a Lead Record in Salesforce. It establishes how data moves across the three-layer pipeline — Wix, Make.com, and Salesforce — what transformations occur at each layer, and what the Lead Record looks like upon arrival in Salesforce before the Flow fires.

This document covers the ingestion path only. Flow execution, scoring logic, and routing behavior are documented in Phase 2 and Phase 3. This document terminates at Lead Record creation.

---

## 2. Ingestion Path Overview

The ingestion path begins when a prospect submits the Céleste Vineyards inquiry form and ends when a Lead Record exists in Salesforce with all Fields populated and the After-Save Flow ready to fire.

```
Prospect Submits Wix Form
        |
        ▼
Wix Automation Fires
(POST_To_Make_Inlet_Webhook)
        |
        ▼
Make.com Custom Webhook Receives Payload
(Module 1)
        |
        ▼
Router Evaluates business_type
(Module 2)
        |
   _____|_____________________
  |                           |
Qualified                Non-Qualified
(business_type ≠           (business_type =
Personal/Individual)       Personal/Individual)
  |                           |
Module 12                  Module 13
Standard Field Mapping     Placeholder Field Mapping
  |                           |
  |___________________________|
        |
        ▼
Salesforce Lead Record Created via API
        |
        ▼
After-Save Flow Fires
```

---

## 3. Layer 1 — Wix Form Submission

The prospect completes the Céleste Vineyards inquiry form and submits. Upon submission, the Wix Automation `POST_To_Make_Inlet_Webhook` fires and transmits the form payload to Make.com via HTTP POST.

**Payload format:** JSON

**Key/value mapping applied:** All Field keys in the payload are clean API name strings — `business_type`, `role`, `purchasing_timeline`, `company`, `first_name`, `last_name`, `state`, `phone`, `email`, `customer_note`. This is the direct result of the key/value configuration applied to the Wix form Fields. Without this configuration, raw label strings would arrive in the payload and the Make.com Field mapping would fail.

**Representative qualified payload:**

```json
{
  "business_type": "Specialty Gourmet Grocer",
  "role": "Sales Manager",
  "purchasing_timeline": "Budget Planning (Future Quarter)",
  "company": "Fitzpatrick and Quinn Associates",
  "first_name": "Richard",
  "last_name": "Miranda",
  "state": "Connecticut",
  "phone": "+14044474092",
  "email": "sezyz@mailinator.com",
  "customer_note": "Hello"
}
```

**Non-qualified payload behavior:** When `Personal/Individual (Non-Business)` is selected, the Wix conditional rule hides the `role`, `purchasing_timeline`, and `company` Fields. These keys arrive in the payload as empty or absent values.

---

## 4. Layer 2 — Make.com Middleware

Make.com receives the payload via the Custom Webhook module and processes it through a four-module scenario.

### 4.1 Module 1 — Custom Webhook

Receives the HTTP POST from Wix. Passes the payload bundle to the Router.

| Attribute | Value |
|---|---|
| Webhook URL | `https://hook.us2.make.com/xz6hpf62bsspcqt6v2dkyg` |
| Method | POST |
| Payload Format | JSON |

### 4.2 Module 2 — Router

Evaluates `business_type` in the payload and directs the submission to the correct Salesforce module.

| Condition | Route | Destination |
|---|---|---|
| `business_type` is not `Personal/Individual (Non-Business)` | Route 1 — Qualified | Module 12 |
| `business_type` equals `Personal/Individual (Non-Business)` | Route 2 — Non-Qualified | Module 13 |

### 4.3 Module 12 — Salesforce Create Record (Qualified Path)

Maps all payload keys to their corresponding Salesforce Lead Field API names and applies the phone normalization formula before creating the Record.

**Phone normalization formula:**
```
replace(trim(2. data: phone); /^\+?1?(\d{3})(\d{3})(\d{4})$/; +1 ($1) $2-$3)
```

| Raw Input | Normalized Output |
|---|---|
| `+14044474092` | `+1 (404) 447-4092` |

**LeadSource hardcoded value:** `Céleste Vineyards - Business Inquiry Form`

### 4.4 Module 13 — Salesforce Create Record (Non-Qualified Path)

Uses the same standard Field mapping as Module 12 for identity and contact Fields. Writes placeholder values for all scoring-relevant Fields.

| Field | Value Written |
|---|---|
| `Business_Type__c` | `Personal/Individual (Non-Business)` |
| `Role__c` | `Not Applicable` |
| `Purchasing_Timeline__c` | `Not Applicable` |
| `Priority_Level__c` | `Not Applicable` |
| `Customer_Note__c` | Passed from payload |

---

## 5. Layer 3 — Salesforce Lead Record Created

Make.com creates the Lead Record via the Salesforce REST API. All Fields are written in a single API call. The Record arrives in Salesforce fully populated before the Flow fires.

**Entry condition enforced by the Flow:** `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form`

Only Records created through this pipeline carry the correct `LeadSource` value and trigger the Flow. Records created by any other mechanism do not trigger the automation.

### 5.1 Lead Record State — Qualified Path (Pre-Flow)

| Field | Source | Value Example |
|---|---|---|
| `FirstName` | Make.com | Richard |
| `LastName` | Make.com | Miranda |
| `Company` | Make.com | Fitzpatrick and Quinn Associates |
| `Email` | Make.com | sezyz@mailinator.com |
| `Phone` | Make.com (normalized) | +1 (404) 447-4092 |
| `State` | Make.com | Connecticut |
| `LeadSource` | Make.com (hardcoded) | Céleste Vineyards - Business Inquiry Form |
| `Business_Type__c` | Make.com | Specialty Gourmet Grocer |
| `Role__c` | Make.com | Sales Manager |
| `Purchasing_Timeline__c` | Make.com | Budget Planning (Future Quarter) |
| `Customer_Note__c` | Make.com | Hello |
| `Qualified__c` | Field default | True |
| `Priority_Level__c` | Flow (pending) | — |

### 5.2 Lead Record State — Non-Qualified Path (Pre-Flow)

| Field | Source | Value |
|---|---|---|
| `Business_Type__c` | Make.com | Personal/Individual (Non-Business) |
| `Role__c` | Make.com | Not Applicable |
| `Purchasing_Timeline__c` | Make.com | Not Applicable |
| `Priority_Level__c` | Make.com | Not Applicable |
| `Qualified__c` | Field default | True |

---

## 6. Ingestion Boundary

The ingestion path is complete when the Lead Record exists in Salesforce with all Fields populated. Everything that follows — Flow execution, scoring, priority assignment, escalation, and routing — is outside the scope of this document.

| Boundary Point | Component | Status |
|---|---|---|
| Form submission | Wix | Start of ingestion path |
| Payload transmitted | Wix Automation | Wix responsibility ends |
| Payload received and routed | Make.com | Middleware processing |
| Lead Record created in Salesforce | Make.com API call | End of ingestion path |
| Flow fires | Salesforce | Outside ingestion scope |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 4 — Integration Boundary |
| File Path | docs/05-integration/wix-make-salesforce-ingestion.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/05-integration/source-to-lead-mapping.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
