# System Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 0 — Root Control Plane

---

## 1. Document Purpose

This document describes the architecture of the Céleste Vineyards Lead Priority Level Automation system. It defines each layer of the system, the responsibilities of each layer, the boundaries between them, and the sequence in which they execute. It establishes the structural decisions that all Phase 1 through Phase 4 documentation is required to operate within.

This document does not define Field-level logic, scoring weights, threshold values, or Flow configuration details. Those are Phase 1 and Phase 2 concerns. This document establishes the shape of the system — the layers, the sequence, and the handoff points — not the internal logic of any individual component.

---

## 2. Architectural Overview

The system is a linear, event-driven pipeline. It has a defined entry point, a fixed execution sequence, and a defined termination point. No stage in the pipeline executes out of sequence. No stage is optional for qualified Leads.

```
┌─────────────────────────────────────────────────────────────────┐
│  EXTERNAL LAYER                                                 │
│                                                                 │
│  Wix Web Form  ──►  Make.com Middleware                         │
│  (Lead Capture)     (Normalization + API Ingestion)             │
└────────────────────────────┬────────────────────────────────────┘
                             │ Salesforce Lead created via API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SALESFORCE LAYER                                               │
│                                                                 │
│  Lead Record Created                                            │
│         │                                                       │
│         ▼                                                       │
│  After-Save Record-Triggered Flow Fires                         │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────┐                                        │
│  │  Gatekeeper Check   │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                   │
│      ┌──────┴──────┐                                            │
│      ▼             ▼                                            │
│  Qualified     Not Qualified                                    │
│      │             │                                            │
│      │         Flag Record → Flow exits                         │
│      ▼                                                          │
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
│  └──────────┬───────────┘                                       │
│             ▼                                                   │
│  ┌──────────────────────┐                                       │
│  │   Assignment Rule    │                                       │
│  │   Owner or Queue     │                                       │
│  └──────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Definitions

### 3.1 Lead Capture — Wix

Wix hosts the public-facing inquiry form through which prospects initiate contact with Céleste Vineyards. The form collects the Field values that will ultimately drive qualification, scoring, and routing decisions in Salesforce.

**Responsibilities:**
- Collect prospect-submitted Field values via the inquiry form
- Transmit the form submission to Make.com upon submission

**Boundaries:**
- Wix has no awareness of Salesforce. It does not create Records, evaluate logic, or make routing decisions.
- Wix configuration is out of scope for this case study. The form Fields and their output values are treated as fixed inputs.
- The handoff from Wix ends at the point of form submission transmission to Make.com.

### 3.2 Middleware — Make.com

Make.com receives the Wix form submission, normalizes Field values to conform to Salesforce Lead Field requirements, and creates the Lead Record in Salesforce via the Salesforce REST API.

**Responsibilities:**
- Receive the form submission payload from Wix
- Normalize and transform Field values as required (format standardization, picklist value mapping, null handling)
- Map normalized values to the corresponding Salesforce Lead Fields
- Execute the API call to create the Lead Record in Salesforce

**Boundaries:**
- Make.com does not evaluate Lead quality, apply scoring logic, or make routing decisions. It is a data conduit.
- Make.com is in scope for Field mapping and ingestion logic documentation only. Internal scenario architecture beyond these concerns is not documented in this repository.
- The handoff from Make.com ends at the point of successful Lead Record creation in Salesforce.

### 3.3 CRM and Automation — Salesforce Sales Cloud

Salesforce is the primary subject of this case study. All qualification, scoring, priority assignment, and routing logic executes within Salesforce. The system uses a single After-Save, Record-Triggered Flow as the automation mechanism, combined with native Assignment Rules for routing.

**Responsibilities:**
- Receive the Lead Record created by Make.com
- Trigger the automation Flow on Lead creation
- Execute the qualification gate, scoring logic, and priority assignment within the Flow
- Execute routing via Assignment Rules upon Flow completion

**Boundaries:**
- All custom Field writes occur within a single Flow execution (Single-DML pattern).
- The system terminates at owner or Queue assignment. No downstream processes — conversion, notification, reporting — are part of this system.

---

## 4. Execution Sequence

The following sequence defines the order in which every component of the system executes for a single inbound Lead. This sequence is fixed. No step executes before its predecessor completes.

| Step | Component | Action | Output |
|---|---|---|---|
| 1 | Wix | Prospect submits inquiry form | Form payload transmitted to Make.com |
| 2 | Make.com | Payload received, Fields normalized | Salesforce Lead Record created via API |
| 3 | Salesforce | Lead Record created | After-Save Flow triggered |
| 4 | Flow — Gatekeeper | Qualification criteria evaluated | Qualified: continue. Not qualified: flag and exit. |
| 5 | Flow — Scoring | Weighted score calculated across three Dimensions | Composite Priority Score accumulated in `varTotalScore` |
| 6 | Flow — Priority Assignment | `varTotalScore` mapped to threshold | Priority Level (High / Medium / Low) written to `varPriorityLevel` |
| 7 | Flow — Escalation | Priority Level evaluated | High: OwnerId set to Sophia Delgado. Medium / Low: Regional Queue OwnerId retained. |
| 8 | Flow — Update Records | Single DML write executes | `OwnerId`, `Priority_Level__c`, `Qualified__c` committed to Lead Record |
| 9 | Assignment Rule | `State/Province` evaluated | Lead Record routed to correct regional Queue |

---

## 5. Component Responsibilities Summary

| Component | Layer | Primary Responsibility | Documented In |
|---|---|---|---|
| Wix inquiry form | External | Lead capture | Out of scope |
| Make.com scenario | External | Field normalization and API ingestion | Integration Layer |
| Salesforce Lead Object | Salesforce | Record storage and Field container | Phase 1 |
| After-Save Flow | Salesforce | Qualification, scoring, priority assignment, and escalation | Phase 2, Phase 3 |
| Assignment Rules | Salesforce | Territory-based routing to owner or Queue | Phase 3 |
| Queues | Salesforce | Lead holding by regional territory | Phase 3 |

---

## 6. Architectural Constraints

The following constraints are enforced at the architecture level. They are not configuration preferences — they are structural requirements that every downstream design decision must respect.

### 6.1 Single-DML Pattern

All custom Field writes to the Lead Record must occur within a single Flow execution via one Update Records element. This constraint prevents recursive trigger cycles and keeps governor limit consumption within predictable bounds.

### 6.2 After-Save Trigger Only

The Flow fires After-Save, not Before-Save. After-Save Flows have access to the committed Record ID and support subflows and actions that Before-Save Flows do not. Field writes require an additional DML operation, which is managed by the Single-DML constraint above.

### 6.3 Record-Triggered on Creation Only

The Flow is configured to trigger on Record creation only — not on every save or update. Priority is assigned once, at the point of creation. Re-evaluation of existing Leads on edit is not part of this system's design.

### 6.4 Assignment Rules as the Routing Mechanism

Routing is handled by native Salesforce Assignment Rules, not by Flow-based Field assignment of OwnerId directly. This preserves the separation between automation logic (the Flow) and routing logic (the Assignment Rule), and ensures that routing behavior is configurable by an administrator without modifying the Flow.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final — Phase 0 |
| Phase | 0 — Root Control Plane |
| File Path | docs/02-architecture/system-architecture.md |
| Date Produced | 2026-03-19 |
| Next Document | docs/03-data-model/field-inventory.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
