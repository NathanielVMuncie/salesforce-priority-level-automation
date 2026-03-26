# Lead Priority & Routing Automation (Salesforce Case Study)

## Overview

This project implements a deterministic Lead intake and prioritization system for **Céleste Vineyards**, designed to simulate enterprise-grade automation within Salesforce Developer Edition constraints.

The system functions as an **authoritative Lead intake control layer**, enforcing qualification, calculating priority, and enabling controlled escalation at the point of record creation.

The architecture explicitly separates:

- **Territorial routing** (Lead Assignment Rules)
- **Priority classification and escalation** (Record-Triggered Flow)

This separation ensures deterministic behavior, clear ownership boundaries, and predictable automation execution.

---

## Core Architecture

### System Flow

Wix Form → Make (Webhook) → Salesforce Lead Creation  
↓  
Lead Assignment Rules (Territorial Routing → Queue Owner Set)  
↓  
After-Save Flow (Qualification → Scoring → Priority → Conditional Escalation)  
↓  
Final Owner State (Queue preserved OR overridden to Sophia Delgado)

---

## Design Principles

### 1. Separation of Concerns

| Layer | Responsibility |
|------|--------|
| Assignment Rules | Territorial routing (Queue ownership) |
| Flow | Qualification, scoring, priority, escalation |

- Flow **does not perform routing**
- Assignment Rules **do not perform prioritization**

---

### 2. Deterministic Priority Engine

The Flow evaluates Leads using a structured, bounded scoring model:

| Dimension | Example Values | Points |
|----------|--------------|--------|
| Business Type | Premium Wine Distributor | +5 |
| Role | Owner / Decision Maker | +5 |
| Purchasing Timeline | Immediate Need | +5 |

**Total Score → Priority Level**

| Priority | Condition |
|---------|----------|
| High | ≥ 12 |
| Medium | ≥ 8 |
| Low | < 8 |

This model ensures:

- consistent classification
- explainable outcomes
- no reliance on subjective input

---

### 3. Qualification Gate (Gatekeeper Pattern)

Qualification is enforced as a **binary control layer independent of scoring**:

- Non-business inquiries are disqualified immediately
- Flow execution short-circuits
- No scoring or escalation occurs

This prevents invalid records from entering the sales pipeline and preserves system integrity.

---

### 4. Territorial Routing (Assignment Rules)

Territorial ownership is established using Lead Assignment Rules:

- Region-based evaluation (driven by `Region__c`)
- Assignment to Queue representing territory owner

Example:

| Region | Queue |
|--------|-------|
| East Coast | Inava Queue |
| West Coast | West Queue |
| Central | Central Queue |

Assignment Rules:

- execute at record creation
- define initial `OwnerId`
- establish ownership context before Flow execution

---

### 5. Escalation Model (Flow-Controlled Override)

The Flow introduces a **conditional ownership override layer on top of Assignment Rule routing**:

- Default: preserve Assignment Rule owner (Queue)
- High Priority: override Owner → Sophia Delgado

Implementation pattern:

    varOwnerID = $Record.OwnerId

    IF Priority = High:
        varOwnerID = Sophia Delgado

    Update Lead.OwnerId = varOwnerID

This ensures:

- escalation is explicit and controlled
- territorial routing remains intact for non-critical Leads

The Flow does not determine territorial ownership. It reads the `OwnerId` assigned by Lead Assignment Rules and preserves that value unless a High-priority condition triggers an escalation override.

---

## Key Components

### Flow: Lead Scoring and Priority Assignment

Responsibilities:

- qualification gate enforcement
- score calculation (bounded 3–15)
- priority classification
- escalation decision
- single DML update

### Assignment Rules

Responsibilities:

- geographic routing
- Queue ownership assignment
- initial `OwnerId` determination

### Make (Middleware)

Responsibilities:

- ingest Wix webhook payload
- normalize field structure
- create Lead record in Salesforce

---

## Developer Edition Constraint Strategy

Salesforce DevOrg limitation:

- only one additional fully-permissioned User

Solution:

- use Queues to simulate multi-user ownership
- represent territorial reps as Queue ownership
- reserve Sophia Delgado as escalation user

This preserves realistic routing behavior without requiring additional licenses.

---

## Data Flow Examples

### High Priority Lead

    Premium Distributor (+5)
    Owner Role (+5)
    Immediate Need (+5)
    → Score = 15 → High

    Assignment Rules → West Queue
    Flow → overrides → Sophia Delgado

### Low Priority Lead

    Specialty Grocer (+2)
    Manager (+2)
    Future Planning (+2)
    → Score = 6 → Low

    Assignment Rules → East Queue
    Flow → preserves owner

---

## Architecture Characteristics

### Deterministic

- same input → same output
- no race conditions between automation layers

### Layered Responsibility

- routing ≠ prioritization
- escalation is conditional, not global

### Single Commit Pattern

- Flow performs one Update Records operation
- avoids multiple DML operations
- reduces governor limit risk

### Debuggable

- Flow decisions are traceable via debug logs
- ownership changes are explicit and explainable

---

## Known Constraints / Tradeoffs

| Constraint | Impact | Mitigation |
|----------|--------|------------|
| DevOrg user limits | Cannot assign real users per territory | Use Queues |
| Assignment Rules + Flow sequencing | Potential ownership conflicts | Flow preserves owner unless High |
| No ownership audit field | Reduced traceability | Document behavior |

---

## Future Enhancements

- Introduce `Ownership_Source__c` for ownership audit tracking
- Externalize scoring logic using Custom Metadata
- Implement async processing for high-volume ingestion
- Integrate Data Cloud for enrichment and segmentation
- Extend escalation to SLA-driven multi-tier routing

---

## Summary

This system demonstrates a scalable architectural pattern:

**Assignment Rules establish ownership context; Flow classifies priority and conditionally overrides ownership for high-value Leads.**

The result is a clean separation between:

- intake routing
- business prioritization
- escalation control

This mirrors enterprise CRM design principles while operating within Developer Edition constraints.
