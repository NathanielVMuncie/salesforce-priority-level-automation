# Recruiter Summary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 6 — Portfolio

---

## 1. The Project in One Sentence

Built a fully operational Salesforce automation system that scores and prioritizes every inbound sales Lead automatically — eliminating manual triage and ensuring high-value Leads reach the right person immediately.

---

## 2. The Problem It Solves

Sales teams waste time manually reviewing inbound inquiries that vary wildly in quality. A major restaurant group ready to place an order and an unqualified individual contact arrive in the same inbox and get treated the same way. High-value opportunities sit untouched.

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

- A low-value Lead scored 6/15 and was routed to the East Coast regional team
- A high-value Lead scored 13/15, was flagged as High priority, and was assigned directly to the National Sales Director
- A non-business submission was caught at the qualification gate and excluded from scoring

---

## 6. The Skills It Demonstrates

| Competency Area | Evidence |
|---|---|
| Salesforce Flow | 27-element Record-Triggered After-Save Flow with gatekeeper, scoring, priority assignment, and escalation |
| Data Modeling | Custom Picklist, Checkbox, Text Area, and Formula Fields on the Lead Object |
| Assignment Rules and Queues | Three-region territorial routing covering all 50 states and DC |
| API Integration | Make.com middleware connecting Wix form submissions to Salesforce via REST API |
| Testing and QA | Three-scenario UAT with 30/30 assertions passed and one resolved defect |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 6 — Portfolio |
| File Path | portfolio/recruiter-summary/recruiter-summary.md |
| Date Produced | 2026-03-23 |
| Next Document | portfolio/website-copy/project-page-copy.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
