# Business Objective

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document defines the business objective that drives the Céleste Vineyards Lead Priority Level Automation system. It establishes the operational problem being solved, the measurable outcomes the system is designed to produce, and the constraints within which the solution operates.

---

## 2. The Business Problem

Céleste Vineyards is a B2B winery operating in the premium wine distribution market. The business does not sell to individuals — its revenue depends entirely on relationships with distributors, restaurants, retailers, and event companies purchasing in volume. Every inbound B2B Lead represents a meaningful revenue opportunity. A single contact at the right business could represent a long-term account worth tens of thousands of dollars annually.

Before this system existed, Céleste Vineyards had no standardized intake process. Inbound Leads arrived through multiple uncontrolled channels — phone calls, walk-ins leaving business cards, email inquiries, and Sales Representatives manually logging cold call responses. There was no single point of entry, no structured handoff, and no mechanism for determining which contacts represented the most commercial value or who should pursue them.

The result was a Sales department operating reactively. Representatives fielded inquiries as they arrived, routed Leads based on individual judgment, and had no consistent way to distinguish a Premium Wine Distributor ready to contract from a Catering company gathering information for a future event. Contacts with significant revenue potential moved through the same informal process as low-value inquiries — and some did not move through it at all.

This operational failure produced three specific, compounding problems:

**Failure 1 — High-value Leads were not identified at entry.** No scoring model existed to distinguish Lead value at the point of contact. A Premium Wine Distributor with a Purchasing Manager ready to contract within 30 days entered the same informal queue as a Catering company in early research. The most commercially significant Leads were not surfaced, not prioritized, and not escalated. They were treated identically to the least valuable ones.

**Failure 2 — Lead routing was inconsistent and undocumented.** Assignment depended entirely on individual judgment with no territorial structure or documented criteria. The same Lead profile could be handled by different representatives on different days. There was no regional ownership model and no mechanism to ensure the right representative received the right Lead.

**Failure 3 — Lead leakage was structurally inevitable.** With no single intake channel, no priority designation, and no routing logic, the pipeline had no integrity. Leads arriving by phone, walk-in, or email depended on a Sales Representative being available, attentive, and correctly informed to act. When that chain failed — and it did — the Lead was lost with no system to catch it.

---

## 3. The Business Objective

Establish a structured, fully automated Lead intake pipeline that eliminates manual triage, enforces regional routing, and ensures the highest-value Leads reach the appropriate owner without delay or human judgment.

The system must ensure that:

- Every inbound B2B Lead is captured through a single controlled intake point and enters the pipeline with complete, structured data
- Non-business contacts are excluded at the intake layer before any data reaches Salesforce, keeping the pipeline clean without requiring Sales Representative involvement
- Every Lead receives a composite Priority Score across three dimensions — Business Type, Role, and Purchasing Timeline — reflecting the commercial value that Lead represents relative to other inbound inquiries
- Every Lead is assigned a Priority Level — `High`, `Medium`, or `Low` — at the moment of creation, based on fixed thresholds applied to that composite score
- Priority Level High Leads are routed immediately to the National Sales Director without manual intervention, because the commercial value they represent warrants direct senior attention
- Priority Level Medium and Low Leads are routed directly to the correct regional Sales Representative based on geographic territory, ensuring organized regional ownership across the pipeline
- The complete pipeline — from form submission to owner assignment — requires zero manual steps under normal operating conditions

---

## 4. Success Criteria

The system is considered successful when the following conditions are met for every Lead entering through the Céleste Vineyards Wix inquiry form:

| Criterion | Requirement |
|---|---|
| Single intake point | All inbound B2B Leads enter through one controlled channel — the Wix inquiry form |
| Intake boundary | Non-business contacts are blocked at the form layer before any data reaches Salesforce |
| Scoring completeness | Every Lead receives a numeric Priority Score across all three dimensions — Business Type, Role, and Purchasing Timeline |
| Priority assignment | Every Lead is assigned a Priority Level of `High`, `Medium`, or `Low` based on fixed score thresholds |
| Routing accuracy | Every Lead is assigned to the correct regional Sales Representative based on Priority Level and `State/Province` |
| Escalation | Every Priority Level High Lead is assigned directly to the National Sales Director at the point of creation |
| No manual intervention | The complete pipeline requires zero manual steps from form submission through owner assignment |
| Zero Lead leakage | No inbound B2B Lead exits the pipeline without an owner assignment and a Priority Level |
| Determinism | Identical input values always produce identical output — Priority Level and owner |

---

## 5. Scope Constraint

This objective applies exclusively to inbound Leads originating from the Céleste Vineyards Wix inquiry form. The `LeadSource` entry condition on the Record-Triggered Flow enforces this constraint at the Salesforce layer — Lead Records created through any other mechanism do not trigger the automation.

Post-conversion activity — Opportunities, Accounts, Contacts — is outside the scope of this objective. The system terminates at Lead owner assignment.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/business-objective.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
