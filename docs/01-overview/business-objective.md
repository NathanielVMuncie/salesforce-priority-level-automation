# Business Objective

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document defines the business objective that drives the Céleste Vineyards Lead Priority Level Automation system. It establishes the problem being solved, the measurable outcome the system is designed to produce, and the constraints within which the solution operates.

---

## 2. The Business Problem

Céleste Vineyards is a B2B winery operating in the premium wine distribution market. Inbound inquiries arrive through a public-facing Wix web form and represent a mix of qualified buyers, early-stage researchers, and non-business contacts.

Prior to this system, every inbound Lead required manual review to determine three things:

- Whether the Lead represented a viable B2B prospect
- How urgently the Lead should be contacted
- Which Regional Sales Manage will be Owner of Lead

This manual triage process created three structural failures:

**Failure 1 — High-value Leads were not reliably identified at entry.** A Premium Wine Distributor with a Purchasing Manager ready to contract within 30 days could sit in the pipeline alongside a Catering & Event Company gathering information for next year. No mechanism existed to surface the difference automatically.

**Failure 2 — Lead routing was inconsistent.** Assignment depended on individual judgment rather than documented criteria. Different representatives applied different standards. The same Lead profile could receive different treatment on different days.

**Failure 3 — No Lead entered the pipeline with a standardized priority designation.** Without a consistent priority structure, queue management was unreliable and pipeline forecasting was impossible.

---

## 3. The Business Objective

Eliminate manual Lead triage by automatically scoring and prioritizing every inbound Lead at the point of creation.

The system must ensure that:

- Every Lead that meets minimum B2B qualification criteria receives a numeric priority score and a designated Priority Level — High, Medium, or Low — upon creation
- High priority Leads are routed immediately to the National Sales Director without manual intervention
- Medium and Low priority Leads are routed to the designated Regional Sales Managers based on geographic territory
- Leads that do not meet minimum qualification criteria are flagged, excluded from scoring, and routed appropriately without disrupting the qualified pipeline
- The scoring and routing logic is deterministic, auditable, and reproducible under any volume of simultaneous Lead creation

---

## 4. Success Criteria

The system is considered successful when the following conditions are met for every Lead created through the Wix inquiry form:

| Criterion | Requirement |
|---|---|
| Qualification gate | Non-business Leads are identified and excluded from scoring before any priority logic executes |
| Scoring completeness | Every qualified Lead receives a numeric score across all three dimensions — Business Type, Role, and Purchasing Timeline |
| Priority assignment | Every qualified Lead receives a Priority Level of High, Medium, or Low based on fixed thresholds |
| Routing accuracy | Every Lead is assigned to the correct Owner or Queue based on Priority Level and State/Province |
| Escalation | Every High Priority Lead is assigned directly to the National Sales Director |
| No manual intervention | The complete automation — from form submission to owner assignment — requires zero manual steps |
| Determinism | Identical input values always produce identical output — Priority Level, Owner, and Qualification Status |

---

## 5. Scope Constraint

This objective applies exclusively to inbound Leads originating from the Céleste Vineyards inquiry form hosted on Wix. The system does not apply to Leads created through any other mechanism — manual entry, data import, or other integrations. This constraint is enforced at the Salesforce layer by the `LeadSource` entry condition on the Record-Triggered Flow. Only Lead Records where `LeadSource` equals `Céleste Vineyards - Business Inquiry Form` trigger the Flow.

Within this pipeline, a qualification gate operates across three layers. At the Wix form layer, selecting a non-business contact type hides scoring-relevant fields and surfaces a disqualification message. At the Make.com layer, the Router directs non-qualified submissions to a separate module that writes placeholder values before the Record is created. At the Salesforce Flow layer, the Gatekeeper Decision element is the first element the Flow encounters — all Lead Records enter the Flow, but non-qualified Records are flagged and exit immediately before any scoring logic executes.

Post-conversion activity — Opportunities, Accounts, Contacts — is outside the scope of this objective. The system terminates at Lead owner assignment.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| File Path | `docs/01-overview/business-objective.md` |
| Date Produced | TBD

---

*Salesforce Case Study: Lead - Priority Level Automation   
Built by Nathaniel V. Muncie*
