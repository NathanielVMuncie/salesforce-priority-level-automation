# Project Page Copy

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 6 — Portfolio

---

## 1. Document Purpose

This document provides website copy for the portfolio project page describing the Céleste Vineyards Lead Priority Level Automation case study. Copy is written for a general professional audience — visitors to a personal portfolio site who may or may not have a Salesforce background.

---

## 2. Page Headline

**Lead Priority Level Automation — Céleste Vineyards**

---

## 3. Project Subtitle

Salesforce Sales Cloud · Make.com · Wix · Record-Triggered Flow · Assignment Rules

---

## 4. Project Summary (Short — 2 sentences)

Built a fully operational Lead scoring and routing automation system in Salesforce Sales Cloud for a fictional B2B winery. The system automatically qualifies, scores, prioritizes, and routes 100% of inbound Leads at the point of creation — with zero manual intervention required.

---

## 5. Project Description (Full)

Céleste Vineyards receives inbound inquiries through a public-facing web form representing a mix of qualified buyers, early-stage researchers, and non-business contacts. Before this system, every inquiry required manual review to determine whether it warranted follow-up, how urgently it should be acted on, and which sales representative should receive it.

This project eliminates that process entirely.

A prospect submits the Wix inquiry form. The submission travels through a Make.com middleware layer where it is validated, normalized, and delivered to Salesforce as a Lead Record. The moment the Record is created, a Record-Triggered After-Save Flow executes — evaluating the Lead against a qualification gate, calculating a weighted priority score across three dimensions, assigning a Priority Level, and routing the Lead to the correct owner or regional Queue.

High priority Leads are assigned directly to the National Sales Director, bypassing the Queue entirely. Medium and Low priority Leads are routed to the correct regional team based on geographic territory, with Assignment Rules covering all 50 US states and the District of Columbia.

The full pipeline — from form submission to Lead owner assignment — executes in seconds with no human involvement.

---

## 6. Technical Highlights

**Weighted scoring model.** Each Lead is scored across three dimensions — Business Type, Role, and Purchasing Timeline — contributing up to 5 points each for a maximum of 15. Fixed numeric thresholds map the composite score to a Priority Level: High (12–15), Medium (8–11), or Low (3–7).

**Dual-purpose gatekeeper.** The first Flow element simultaneously enforces the qualification gate and assigns the Business Type score — collapsing two logical concerns into one auditable Decision element and reducing Flow complexity.

**Single-DML pattern.** All Field writes — `OwnerId`, `Priority_Level__c`, `Qualified__c` — execute in a single Update Records element. This prevents recursive trigger cycles and contains governor limit exposure to 1 DML statement per transaction.

**Three-layer qualification gate.** Non-business submissions are caught at the Wix form level (conditional Field hiding), the Make.com level (Router directing to a placeholder module), and the Salesforce Flow level (Gatekeeper Fail Decision outcome) — ensuring pipeline integrity at every layer.

---

## 7. Validation

The system is live in a Salesforce Developer Edition org. Three test Records confirmed end-to-end execution across all paths:

| Lead | Scenario | Score | Priority | Owner |
|---|---|---|---|---|
| Richard Miranda | Qualified | 6/15 | Low | East Coast Queue |
| Neil Thompson | Qualified + Escalated | 13/15 | High | National Sales Director |
| Dylan Moss | Disqualified | — | Not Applicable | Central Queue |

---

## 8. Technologies Used

| Technology | Role |
|---|---|
| Salesforce Sales Cloud | CRM — Lead Object, Flow, Assignment Rules, Queues |
| Salesforce Flow | Record-Triggered After-Save automation |
| Make.com | Middleware — webhook ingestion, Field mapping, two-path routing |
| Wix | Lead capture form with conditional display logic |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 6 — Portfolio |
| File Path | portfolio/website-copy/project-page-copy.md |
| Date Produced | 2026-03-24 |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
