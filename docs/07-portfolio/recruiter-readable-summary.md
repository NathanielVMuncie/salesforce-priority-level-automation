# Recruiter-Readable Summary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 6 — Portfolio

---

## 1. What This Project Is

A complete, operational Salesforce automation system built as a portfolio case study to demonstrate Salesforce Administrator competency. The system was designed, built, tested, and documented by Nathaniel Muncie.

The fictional client is Céleste Vineyards — a B2B winery. The business problem is real and common: too many inbound inquiries, not enough time to manually review them, and no consistent way to tell which ones deserved immediate attention.

---

## 2. The Problem It Solves

Sales teams waste time manually reviewing inbound inquiries that vary wildly in quality. A major restaurant group ready to place an order and an unqualified individual contact asking general questions arrive in the same inbox and get treated the same way. High-value opportunities sit untouched.

This system fixes that. Every Lead is evaluated, scored, and routed the moment it arrives — before anyone on the sales team touches it.

---

## 3. How It Works (Plain English)

1. A prospect fills out a form on the company website
2. The system checks whether the prospect is a legitimate B2B contact — if not, it flags and filters them out automatically
3. For qualified prospects, it scores them on three factors: what kind of business they run, what decision-making authority they hold, and how urgently they need to buy
4. Based on that score, it assigns a Priority Level: High, Medium, or Low
5. High priority Leads go straight to the National Sales Director — no Queue, no waiting
6. Everyone else goes to the correct regional sales team based on their location
7. The entire process takes seconds and requires zero human involvement

---

## 4. What Was Built

- A Wix inquiry form with built-in front-end validation
- A Make.com automation that moves data from the form to Salesforce
- A Salesforce Record-Triggered Flow with 27 elements handling qualification, scoring, priority assignment, and escalation
- Lead Assignment Rules covering all 50 US states routing Leads to three regional teams
- Custom Fields, Formula Fields, and Queues supporting the full pipeline

---

## 5. Proof It Works

Three live Lead Records in a Salesforce Developer Edition org confirm the system works end-to-end:

- A low-value Lead was scored correctly at 6/15 and routed to the East Coast regional team
- A high-value Lead scored 13/15, was flagged as High priority, and was assigned directly to the National Sales Director
- A non-business submission was caught at the qualification gate and excluded from scoring

---

## 6. The Skills It Demonstrates

This project covers the core Salesforce Administrator competency areas that appear in job descriptions for this role:

- Salesforce Flow (Record-Triggered, After-Save)
- Custom Object and Field configuration
- Formula Fields
- Assignment Rules and Queues
- API integration via third-party middleware
- End-to-end testing and defect resolution

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 6 — Portfolio |
| File Path | docs/07-portfolio/recruiter-readable-summary.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/07-portfolio/design-insight-gatekeeper-sequencing.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
