# System Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document describes the architecture of the Céleste Vineyards Lead Priority Level Automation system. It defines each layer of the system, the responsibilities of each layer, the boundaries between them, and the sequence in which they execute. It establishes the structural decisions that all downstream documentation is required to operate within.

This document does not define Field-level logic, scoring weights, threshold values, or Flow configuration details. Those concerns are covered in the data model and core logic documentation. This document establishes the shape of the system — the layers, the sequence, and the handoff points — not the internal logic of any individual component.

---

## 2. Architectural Overview

The system is a linear, event-driven pipeline. It has a defined entry point, a fixed execution sequence, and a defined termination point. No stage in the pipeline executes out of sequence. No stage is optional for any Lead that enters Salesforce.

The qualification gate is the first and outermost layer of the system. It is enforced entirely within the Wix inquiry form before any data is transmitted. Only B2B submissions reach Make.com. Only B2B submissions reach Salesforce. No qualification logic exists inside Make.com or the Salesforce Flow — it is not needed.

```
┌─────────────────────────────────────────────────────────────────┐
│  WIX LAYER                                                      │
│                                                                 │
│  Inquiry Form                                                   │
│         │                                                       │
│  [QUALIFICATION GATE]                                           │
│  Personal/Individual (Non-Business) selected                    │
│         │                                                       │
│    Form collapses — fields hidden — submit disabled             │
│    Not Qualified message renders                                │
│    No payload generated — pipeline never reached                │
│         │                                                       │
│  B2B selection → form active → prospect submits                 │
│         │                                                       │
│  Wix Automation fires → payload transmitted to Make.com         │
└────────────────────────────┬────────────────────────────────────┘
                             │ B2B payload only
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  MIDDLEWARE LAYER                                               │
│                                                                 │
│  Make.com                                                       │
│  Normalizes payload, maps Fields, creates Lead Record via API   │
└────────────────────────────┬────────────────────────────────────┘
                             │ Salesforce Lead created via API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SALESFORCE LAYER                                               │
│                                                                 │
│  Lead Record Created                                            │
│         │                                                       │
│         ▼                                                       │
│  Lead Assignment Rule Fires                                     │
│  (Evaluates State/Province → Assigns Regional Queue)            │
│         │                                                       │
│         ▼                                                       │
│  After-Save Record-Triggered Flow Fires                         │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────┐                                       │
│  │   Weighted Scoring   │                                       │
│  │  Business Type       │                                       │
│  │  + Role              │                                       │
│  │  + Purchasing        │                                       │
│  │    Timeline          │                                       │
│  └──────────┬───────────┘                                       │
│             ▼                                                   │
│  ┌──────────────────────┐                                       │
│  │  Priority Assignment │                                       │
│  │  High / Medium / Low │                                       │
│  └──────────┬───────────┘                                       │
│             ▼                                                   │
│  ┌──────────────────────┐                                       │
│  │  Escalation Check    │                                       │
│  │  High → Sophia       │                                       │
│  │  Delgado             │                                       │
│  └──────────┬───────────┘                                       │
│             ▼                                                   │
│  ┌──────────────────────┐                                       │
│  │  Update Records      │                                       │
│  │  (Single DML)        │                                       │
│  └──────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Definitions

### 3.1 Qualification Gate — Wix

The Wix inquiry form is the qualification gate for the entire pipeline. It is the first and only layer where non-business contacts are identified and blocked. This gate executes entirely within Wix before any payload is generated.

When a prospect selects `Personal/Individual (Non-Business)` from the Business Type dropdown, the form immediately transforms: all remaining fields collapse, the submit control is disabled, and a Not Qualified message renders in place of the form body. No Wix Automation fires. No payload is transmitted. No Lead Record is created in Salesforce. The contact never enters the pipeline.

Every Lead Record that exists in Salesforce originated from a B2B form submission. The qualification gate is complete at the Wix layer.

**Responsibilities:**
- Enforce the qualification gate via conditional form logic on `Business_Type__c` selection
- Collect B2B prospect Field values for all submissions that pass the gate
- Transmit the form payload to Make.com via the Wix Automation `POST_To_Make_Inlet_Webhook` on form submission

**Boundaries:**
- The gate is self-contained within Wix. It does not communicate with Make.com, Salesforce, or any external system to enforce qualification.
- No qualification fields, qualification variables, or qualification logic exist anywhere downstream of this gate.
- The handoff from Wix ends at the point of payload transmission to Make.com.

### 3.2 Middleware — Make.com

Make.com receives the Wix form submission payload — which is always a B2B submission — normalizes Field values to conform to Salesforce Lead Field requirements, and creates the Lead Record in Salesforce via the Salesforce REST API.

**Responsibilities:**
- Receive the B2B form submission payload from Wix
- Normalize and transform Field values as required (phone format standardization, field mapping)
- Map normalized values to the corresponding Salesforce Lead Fields
- Execute the API call to create the Lead Record in Salesforce

**Boundaries:**
- Make.com does not evaluate Lead quality, apply scoring logic, or make routing decisions. It is a data conduit.
- Make.com receives only B2B payloads. No non-qualified submission ever reaches Make.com.
- The handoff from Make.com ends at the point of successful Lead Record creation in Salesforce.

### 3.3 CRM and Automation — Salesforce Sales Cloud

Salesforce is the primary subject of this case study. All scoring, priority assignment, escalation, and routing logic executes within Salesforce. Every Lead Record that enters Salesforce is a B2B submission. The system uses a single After-Save, Record-Triggered Flow as the automation mechanism, combined with native Assignment Rules for routing.

**Responsibilities:**
- Receive the Lead Record created by Make.com
- Route the Lead to the correct regional Queue via Assignment Rule at Record creation
- Trigger the automation Flow on Lead creation
- Execute scoring, priority assignment, and escalation within the Flow
- Commit all automation results via a single DML write

**Boundaries:**
- No qualification logic exists in Salesforce. Every Lead that triggers the Flow is a B2B submission that passed the Wix gate.
- All custom Field writes occur within a single Flow execution (Single-DML pattern).
- The system terminates at owner or Queue assignment. No downstream processes — conversion, notification, reporting — are part of this system.

---

## 4. Execution Sequence

The following sequence defines the order in which every component of the system executes for a single inbound B2B Lead. This sequence is fixed. No step executes before its predecessor completes.

| Step | Component | Action | Output |
|---|---|---|---|
| 1 | Wix — Qualification Gate | Prospect selects B2B business type — gate passes | Form remains active |
| 2 | Wix — Form Submission | Prospect completes and submits form | Payload transmitted to Make.com via Wix Automation |
| 3 | Make.com | Payload received, Fields normalized | Salesforce Lead Record created via API |
| 4 | Salesforce — Assignment Rule | `State/Province` evaluated | Lead Record routed to correct regional Queue |
| 5 | Salesforce — After-Save Flow | Flow fires on Lead creation | Scoring sequence begins |
| 6 | Flow — Weighted Scoring | Score calculated across three dimensions | Composite Priority Score accumulated in `varTotalScore` |
| 7 | Flow — Priority Assignment | `varTotalScore` mapped to threshold | Priority Level written to `varPriorityLevel` |
| 8 | Flow — Escalation | `varPriorityLevel` evaluated | High: `varOwnerID` set to Sophia Delgado. Medium / Low: regional Queue OwnerId retained. |
| 9 | Flow — Update Records | Single DML write executes | `OwnerId` and `Priority_Level__c` committed to Lead Record |

---

## 5. Component Responsibilities Summary

| Component | Layer | Primary Responsibility | Documented In |
|---|---|---|---|
| Wix inquiry form — Qualification Gate | Wix | B2B gate — blocks non-business submissions before any data transmits | `docs/04-automation-logic/gatekeeper-logic.md` |
| Make.com scenario | Middleware | Field normalization and API ingestion | `docs/05-integration/middleware-responsibilities.md` |
| Salesforce Lead Object | Salesforce | Record storage and Field container | `docs/03-data-model/` |
| Lead Assignment Rule | Salesforce | Territory-based routing to regional Queue | `docs/04-automation-logic/territorial-routing-logic.md` |
| After-Save Flow | Salesforce | Scoring, priority assignment, and escalation | `docs/04-automation-logic/` |
| Queues | Salesforce | Lead holding by regional territory | `docs/04-automation-logic/territorial-routing-logic.md` |

---

## 6. Architectural Constraints

The following constraints are enforced at the architecture level. They are not configuration preferences — they are structural requirements that every downstream design decision must respect.

### 6.1 Gate at the Source

The qualification gate is enforced at the Wix form — the outermost layer of the system. Non-business contacts are blocked before any payload is generated. No qualification logic is required downstream. This ensures the Salesforce pipeline contains only B2B Leads and eliminates the need for disqualification paths, qualification fields, or qualification variables inside the Flow.

### 6.2 Single-DML Pattern

All custom Field writes to the Lead Record must occur within a single Flow execution via one Update Records element. This constraint prevents recursive trigger cycles and keeps governor limit consumption within predictable bounds.

### 6.3 After-Save Trigger Only

The Flow fires After-Save, not Before-Save. After-Save Flows have access to the committed Record ID and support subflows and actions that Before-Save Flows do not. Field writes require an additional DML operation, which is managed by the Single-DML constraint above.

### 6.4 Record-Triggered on Creation Only

The Flow is configured to trigger on Record creation only — not on every save or update. Priority is assigned once, at the point of creation. Re-evaluation of existing Leads on edit is not part of this system's design.

### 6.5 Assignment Rules as the Routing Mechanism

Routing is handled by native Salesforce Assignment Rules, not by Flow-based Field assignment of `OwnerId` directly. This preserves the separation between automation logic (the Flow) and routing logic (the Assignment Rule), and ensures that routing behavior is configurable by an administrator without modifying the Flow.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/system-architecture.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
