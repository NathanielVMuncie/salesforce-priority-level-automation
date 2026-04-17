# Project Overview

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document establishes the authoritative project overview for the Céleste Vineyards Lead Priority Level Automation case study. It defines the business problem, the system built to address it, the technology stack in use, and the core design principles that govern every downstream decision. All subsequent documentation in this repository is derived from or constrained by the decisions recorded here.

This document is the entry point for any reader — recruiter, hiring manager, or technical reviewer — seeking to understand what was built, why it was built, and how the system is structured at a high level.

---

## 2. Project Identity

| Attribute | Value |
|---|---|
| Full Project Title | Salesforce Case Study: Lead — Priority Level Automation |
| Case Study Client | Céleste Vineyards (fictional entity used for portfolio demonstration) |
| Industry | B2B Wine Distribution |
| Platform | Salesforce Sales Cloud |
| Repository | github.com/NathanielVMuncie/salesforce-priority-level-automation |
| Repository Visibility | Private |
| Default Branch | main |
| Author | Nathaniel V. Muncie — Salesforce Administrator |

---

## 3. Business Context

### 3.1 Client Profile

Céleste Vineyards is a fictional B2B winery operating in the premium wine distribution market. The business sells directly to restaurants, hospitality groups, wine retail chains, and event venues. Inbound inquiries arrive through a public-facing Wix web form and represent a mix of qualified buyers, early-stage researchers, and unqualified contacts.

### 3.2 Problem Statement

Prior to this system, all inbound Leads required manual review to determine whether they warranted follow-up, how urgently they should be contacted, and which sales representative should receive the assignment. This created three structural problems:

- Priority Level High Leads were not reliably identified at the point of entry and could sit in the pipeline untouched alongside low-value contacts
- Lead routing was inconsistent and dependent on individual judgment rather than documented criteria
- No Lead entered the pipeline with a standardized priority designation, making Queue management and forecasting unreliable

### 3.3 Business Objective

Eliminate manual Lead triage by automatically scoring and prioritizing every inbound Lead at the point of creation. The system must ensure that:

- Every Lead that meets minimum qualification criteria receives a numeric priority score and a designated Priority Level upon creation
- Priority Level High Leads are routed immediately to the correct owner without manual intervention
- Leads that do not meet minimum qualification criteria are flagged and excluded from scoring to prevent noise in the priority pipeline
- The scoring and routing logic is deterministic, auditable, and reproducible under any volume of simultaneous Lead creation

---

## 4. System Summary

The automation system operates as a linear pipeline that begins at Lead capture and terminates at Queue or owner assignment. The pipeline is fully automated and requires no manual intervention for qualified Leads.

### 4.1 Pipeline Stages

1. **Lead capture.** A Lead submits the Céleste Vineyards inquiry form on the Wix platform.
2. **Middleware processing.** Make.com receives the form submission, normalizes Field values, and creates the Lead Record in Salesforce via API.
3. **Flow execution.** An After-Save, Record-Triggered Flow fires on Lead creation and evaluates the Record against the full automation sequence.
4. **Qualification gate.** The Flow first evaluates whether the Lead meets minimum qualification criteria. Leads that do not qualify exit the Flow at this point and are flagged accordingly.
5. **Weighted scoring.** Qualified Leads are scored across three dimensions. Each dimension contributes a weighted numeric value to a composite Priority Score.
6. **Priority assignment.** The composite Priority Score is mapped to one of three Priority Levels — High, Medium, or Low — based on fixed numeric thresholds.
7. **Routing.** The assigned Priority Level, combined with territory data, determines whether the Lead routes to a regional Queue or escalates to the National Sales Director.

### 4.2 Architecture Diagram

```
Wix Form → Make.com → Salesforce Lead (Created)
                              |
                     After-Save Flow Fires
                              |
                    Gatekeeper Check (Qualification)
                         |           |
                     Qualified    Not Qualified → Flag and exit
                         |
                   Weighted Scoring
                   (Business Type + Role + Purchasing Timeline)
                         |
                  Priority Assignment
                  High / Medium / Low
                         |
                  Escalation Check
                  (Priority Level High → Sophia Delgado)
                         |
                 Assignment Rule → Owner or Queue
                 East Coast | West Coast | Central
```

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Lead Capture | Wix (web form) |
| Middleware | Make.com |
| CRM | Salesforce Sales Cloud |
| Automation | Salesforce Flow — After-Save, Record-Triggered |
| Routing | Assignment Rules, Queues |

---

## 6. Scoring Model Overview

Lead scoring is calculated across three independent dimensions. Each dimension is weighted equally to reflect Céleste Vineyards' definition of a qualified, high-value Lead. Dimension scores are summed to produce the composite Priority Score, which is then evaluated against the Priority Level thresholds.

| Scoring Dimension | Field | Max Points | Purpose |
|---|---|---|---|
| Business Type | `Business_Type__c` | 5 | Evaluates structural alignment between the Lead's organization type and Céleste Vineyards' target account profile |
| Role | `Role__c` | 5 | Evaluates decision-making authority of the individual submitting the inquiry |
| Purchasing Timeline | `Purchasing_Timeline__c` | 5 | Assesses expressed urgency and readiness to transact |
| **Total** | | **15** | |

### 6.1 Priority Level Thresholds

| Priority Level | Condition | Score Range |
|---|---|---|
| High | `varTotalScore` ≥ 12 | 12 — 15 |
| Medium | `varTotalScore` ≥ 8 | 8 — 11 |
| Low | Default outcome | 3 — 7 |

---

## 7. Core Design Principles

| Principle | Description |
|---|---|
| Qualification Gate | A Lead must satisfy minimum criteria before scoring logic executes. This is enforced at the Flow level via a gatekeeper condition that runs prior to any score calculation. |
| Single-DML Pattern | All custom Field writes occur within a single Flow Update Records element to avoid recursive trigger cycles and to contain governor limit exposure within predictable bounds. |
| Bulk-Safe Design | Flow logic is structured to handle batch Lead creation without violating Salesforce governor limits. No patterns are used that degrade or fail under bulk load. |
| Deterministic Output | Priority Levels are assigned by fixed numeric thresholds. Given identical input values, the system will always produce identical output. Subjective assessment is not part of the scoring model. |
| Two-Path Architecture | Non-business submissions are handled through a separate Make.com module and a dedicated Flow termination path, ensuring pipeline integrity without blocking form submission. |

---

## 8. Repository Scope and Exclusions

### 8.1 In Scope

- Custom Field design on the Lead Object
- Weighted scoring model and dimension logic
- After-Save Record-Triggered Flow configuration
- Assignment Rules and Queue definitions
- Make.com scenario design for Field mapping and API ingestion
- Test scenarios, UAT evidence, and defect documentation
- Portfolio-facing documentation and recruiter materials

### 8.2 Out of Scope

- Wix form design and front-end configuration
- Salesforce user provisioning, profiles, or role hierarchy
- Email alert or notification configuration
- Reporting and dashboard design
- Production deployment or sandbox migration procedures
- Post-conversion Opportunity, Account, or Contact management

---

## 9. System Status

This system is fully operational. All automation logic, routing rules, and integration components are built and live in a Salesforce Developer Edition org. Six canonical Lead Records confirm end-to-end pipeline execution across all paths — Not Qualified Gatekeeper Fail, Qualified Priority Level Low, Qualified Priority Level Medium, and Qualified Priority Level High with escalation.

---

*Salesforce Case Study: Lead - Priority Level Automation | Built by Nathaniel V. Muncie*
