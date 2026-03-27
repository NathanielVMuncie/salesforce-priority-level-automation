# Resume Bullets

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document provides resume-ready bullet points derived from the Céleste Vineyards Lead Priority Level Automation case study. Bullets are written for a Salesforce Administrator role and are organized by competency area.

---

## 2. Primary Bullet — Full System

> Built an end-to-end Lead scoring and priority automation system in Salesforce Sales Cloud — integrating Wix form capture, Make.com middleware, a Record-Triggered After-Save Flow, and Assignment Rules to automatically qualify, score, prioritize, and route 100% of inbound Leads at the point of creation with zero manual intervention.

---

## 3. Bullets by Competency Area

### Salesforce Flow

- Designed and built a Record-Triggered After-Save Flow with 27 elements — including 5 Decision elements, 21 Assignment elements, and a single Update Records element — implementing a weighted three-dimension Lead scoring model with gatekeeper logic, priority assignment, and escalation routing
- Implemented Single-DML pattern across all Flow Field writes, consolidating `OwnerId`, `Priority_Level__c`, and `Qualified__c` into one Update Records element to prevent recursive trigger cycles and contain governor limit exposure to 1 DML statement per transaction
- Designed dual-purpose gatekeeper Decision element that simultaneously enforces Lead qualification criteria and assigns the Business Type dimension score — eliminating a redundant pre-screening element and reducing Flow complexity without sacrificing auditability

### Data Modeling

- Configured custom Picklist, Checkbox, Text Area, and Formula Fields on the Salesforce Lead Object to support a weighted scoring model, qualification state tracking, and automated priority designation
- Designed `Qualification_Status__c` Formula Field using `IF(Qualified__c, '✅ Qualified', '❌ Disqualified')` to surface boolean qualification state as a formatted display value on the Lead Record
- Resolved Field default value defect in which `Qualified__c` was defaulting to False on qualified Leads — identifying root cause, applying Object Manager default value fix, and confirming resolution without modifying the Single-DML Flow pattern

### Assignment Rules and Routing

- Configured a Lead Assignment Rule with three territorial rule entries covering all 50 US states and the District of Columbia — routing qualified and disqualified Leads to East Coast, West Coast, and Central regional Queues based on `State/Province` Field value
- Architected escalation override logic within the Flow that captures the Assignment Rule Queue OwnerId as a baseline, evaluates Priority Level, and overwrites OwnerId with the National Sales Director's User ID for High priority Leads — while preserving the `Region__c` territorial classification for pipeline reporting

### Integration

- Configured Make.com scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1` to receive Wix webhook payloads, apply a two-path Router architecture for qualified and non-qualified submissions, normalize phone numbers via regex formula, hardcode `LeadSource` for Flow entry condition enforcement, and create Lead Records in Salesforce via the REST API
- Implemented key/value mapping on the Wix inquiry form to normalize payload keys to clean API name strings — establishing a stable, deterministic contract between the form layer and the Make.com Field mapping configuration

### Testing and Quality

- Executed three-scenario UAT covering all system paths — qualified Low priority, qualified High priority with escalation, and non-qualified disqualification — achieving 30/30 Field-level assertion passes across live Salesforce Lead Records
- Identified, documented, and resolved one High severity defect (D-01) during UAT — `Qualified__c` default value misconfiguration — without introducing additional Flow elements or violating the Single-DML pattern

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | portfolio/resume-bullets/resume-bullets.md |
| Date Produced | 2026-03-23 |
| Next Document | portfolio/recruiter-summary/recruiter-summary.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
