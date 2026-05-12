# System Architecture — Portfolio

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Portfolio

---

## 1. Document Purpose

This document presents the system architecture of the Céleste Vineyards Lead Priority Level Automation for employer and portfolio review. It describes what the system does, why it was designed that way, and what each technology contributes — without the implementation-level detail maintained in the internal architecture document. The goal is to communicate design thinking, architectural judgment, and the skills demonstrated by this build.

---

## 2. The Business Problem

Céleste Vineyards is a fictional premium wine producer used as the client for this case study. The business problem is real and common: B2B sales teams receive inbound leads from a web form, but without a system to evaluate and prioritize those leads, every prospect gets treated the same — regardless of how likely they are to buy or how much they might spend. High-value prospects wait. Low-value prospects consume time. No one is routed to the right person automatically.

This project solves that problem with a fully automated, no-code pipeline that scores every inbound B2B lead, assigns a priority level, and routes ownership to the right salesperson — before a human ever opens the record.

---

## 3. System Overview

The automation spans three layers: a Wix web form, Make.com middleware, and Salesforce. A prospect submits a form on the Céleste Vineyards website. Make.com receives the submission and creates a Lead record in Salesforce. A Salesforce Record-Triggered Flow immediately evaluates the Lead against a weighted scoring model, assigns a priority level of High, Medium, or Low, and routes the record to the appropriate owner — escalating the highest-value leads directly to the National Sales Director.

The entire process — from form submission to scored, routed Lead record — is automated with zero human steps.

---

## 4. Architecture Layers

### 4.1 — Wix (Intake and Qualification Gate)

The Wix form is the entry point for all B2B prospects. It collects the information that drives scoring downstream: the prospect's business type, their role within the organization, and their purchasing timeline.

The form also enforces the first and only qualification gate in the pipeline. If a visitor indicates they are an individual consumer rather than a business, the form collapses and cannot be submitted. No data reaches any downstream system. This design decision keeps the qualification logic at the user experience layer — where it belongs — and ensures Salesforce only ever receives records for legitimate B2B prospects.

### 4.2 — Make.com (Middleware)

Make.com connects Wix to Salesforce. When a qualified prospect submits the form, Make.com receives the payload via webhook and creates the Lead record in Salesforce. It also normalizes the phone number format before record creation, ensuring consistent data regardless of how the prospect entered their number.

Make.com's role is intentionally narrow: receive, normalize, and create. No scoring logic, no routing logic, and no conditional branching live here. This is a deliberate separation of concerns — middleware handles transport, Salesforce handles business logic.

### 4.3 — Salesforce (Scoring, Priority Assignment, and Routing)

Salesforce is where the business logic lives. Two automated systems fire in sequence when a Lead record is created.

First, the Lead Assignment Rule evaluates the Lead's state and routes it to the appropriate regional sales representative or queue — East Coast, West Coast, or Central.

Second, a Record-Triggered Flow executes a three-tier scoring model:

- **Tier 1 — Business Type:** What kind of business is the prospect? A premium wine distributor scores higher than a catering company. (1–5 points)
- **Tier 2 — Role:** What is the prospect's decision-making authority? An owner scores higher than a coordinator. (1–5 points)
- **Tier 3 — Purchasing Timeline:** How soon are they buying? Within 30 days scores higher than information gathering. (1–5 points)

The three tiers combine into a total score between 3 and 15. The Flow evaluates that score against defined thresholds and assigns a priority level:

| Priority Level | Score Threshold |
|---|---|
| High | 12 or above |
| Medium | 8 to 11 |
| Low | Below 8 |

For High priority leads, the Flow overrides the Assignment Rule's routing and transfers ownership directly to Sophia Delgado, the National Sales Director. Medium and Low priority leads remain with their regionally assigned owner. All field writes happen in a single operation at the end of the Flow — a pattern that prevents recursive automation and reflects Salesforce best practice for record-triggered automation.

---

## 5. End-to-End Flow

| Step | What Happens |
|---|---|
| 1 | Prospect visits the Céleste Vineyards website and completes the B2B intake form |
| 2 | If the prospect is an individual consumer, the form collapses — pipeline ends here |
| 3 | Make.com receives the form payload and normalizes the phone number |
| 4 | Make.com creates a Lead record in Salesforce |
| 5 | Salesforce Assignment Rule routes the Lead to the appropriate regional owner |
| 6 | Salesforce Flow evaluates the Lead's Business Type, Role, and Purchasing Timeline |
| 7 | Flow calculates a total score and assigns a priority level |
| 8 | High priority Leads are escalated to the National Sales Director |
| 9 | Medium and Low priority Leads remain with their regional owner |
| 10 | Priority level and final ownership are written to the Lead record in a single update |

---

## 6. Architecture Diagram

A visual architecture diagram covering all three layers of the pipeline is forthcoming. When produced, it will be available at `docs/02-architecture/` and referenced here by filename.

---

## 7. What This Demonstrates

**Declarative Salesforce automation.** The scoring engine, priority assignment, and ownership escalation are built entirely in Salesforce Flow — no Apex, no code. This reflects the modern Salesforce development philosophy: solve business problems declaratively first.

**Multi-system integration design.** The pipeline connects three separate platforms (Wix, Make.com, Salesforce) with clear boundaries between them. Each system does what it does best. No system is asked to do another system's job.

**Separation of concerns.** Qualification lives at Wix. Transport lives at Make.com. Business logic lives in Salesforce. This design makes each layer independently testable, maintainable, and replaceable.

**Scoring model design.** The three-tier weighted scoring model is purpose-built for B2B wine industry sales. Business Type, Role, and Purchasing Timeline were selected because they represent the three dimensions a sales team actually uses to prioritize a prospect. The point values and thresholds reflect deliberate calibration, not arbitrary numbers.

**Territory routing and escalation logic.** The pipeline routes leads to regional owners by state and escalates the highest-value leads to senior leadership automatically. This mirrors how real enterprise sales operations are structured.

**Salesforce best practices.** The single-DML pattern, After Save trigger context, and Assignment Rule / Flow execution order reflect a working understanding of how Salesforce automation behaves under the hood — not just how to configure it.

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Portfolio |
| File Path | `docs/07-portfolio/system-architecture-portfolio.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*