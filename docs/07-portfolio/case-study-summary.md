# Case Study Summary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 6 — Portfolio

---

## 1. Overview

This case study documents the design and build of a Lead scoring and priority automation system for Céleste Vineyards, a fictional B2B winery used as a portfolio demonstration. The system eliminates manual Lead triage by automatically scoring, prioritizing, and routing every inbound Lead at the point of creation.

The system is fully operational. All automation logic, routing rules, and integration components are built and live in a Salesforce Developer Edition org. Three live validation Records confirm end-to-end pipeline execution across all paths.

---

## 2. The Problem

Céleste Vineyards received inbound inquiries through a public-facing Wix form representing a mix of qualified buyers, early-stage researchers, and non-business contacts. Prior to this system, every Lead required manual review to determine three things:

- Whether the Lead represented a viable B2B prospect
- How urgently the Lead should be contacted
- Which sales representative should receive the assignment

This manual triage created three structural failures. High-value Leads were not reliably identified at entry. Routing was inconsistent and dependent on individual judgment. No Lead entered the pipeline with a standardized priority designation.

---

## 3. The Solution

A three-layer automation pipeline that begins at the Wix form submission and terminates at Lead owner or Queue assignment in Salesforce — with zero manual intervention required at any point.

**Stack:**

| Layer | Technology |
|---|---|
| Lead Capture | Wix (web form) |
| Middleware | Make.com |
| CRM | Salesforce Sales Cloud |
| Automation | Record-Triggered After-Save Flow |
| Routing | Assignment Rules, Queues |

---

## 4. How It Works

**Step 1 — Capture:** A prospect submits the Wix inquiry form. The Wix Automation transmits the payload to Make.com via HTTP POST.

**Step 2 — Middleware:** Make.com evaluates the submission type, normalizes Field values, and creates the Lead Record in Salesforce via the REST API. Non-business submissions are routed to a separate module that writes placeholder values before Record creation.

**Step 3 — Qualification:** An After-Save, Record-Triggered Flow fires on Lead creation. The first element is a dual-purpose Decision that enforces the qualification gate and assigns the Business Type dimension score. Non-qualified Leads exit the Flow immediately with a disqualification flag set.

**Step 4 — Scoring:** Qualified Leads are scored across three dimensions — Business Type, Role, and Purchasing Timeline — with each dimension contributing up to 5 points. Point values are accumulated in `varTotalScore` using the Add operator across sequential Decision and Assignment elements.

**Step 5 — Priority Assignment:** `varTotalScore` is mapped to a Priority Level by a threshold-based Decision element. High requires a score of 12 or above. Medium requires 8 to 11. Low is the Default Outcome for scores below 8.

**Step 6 — Escalation:** High priority Leads are assigned directly to the National Sales Director — Sophia Delgado — bypassing the regional Queue assignment. Medium and Low priority Leads retain the regional Queue OwnerId set by the Assignment Rule.

**Step 7 — Single DML Write:** All Field writes — `OwnerId`, `Priority_Level__c`, `Qualified__c` — are committed to the Lead Record in a single Update Records element.

**Step 8 — Routing:** The Lead Assignment Rule evaluates `State/Province` and assigns the Lead to the correct regional Queue — East Coast, West Coast, or Central — covering all 50 US states and the District of Columbia.

---

## 5. Design Decisions Worth Noting

**Dual-purpose gatekeeper.** The first Flow Decision element serves two functions simultaneously — enforcing the qualification gate and assigning the Business Type score. This eliminates a separate pre-screening element and reduces Flow complexity without sacrificing auditability.

**Single-DML pattern.** All custom Field writes execute in one Update Records element at the end of the Flow. This prevents recursive trigger cycles and contains governor limit exposure. DML count: 1 of 150 per transaction.

**Assignment Rule fires first.** Salesforce executes Assignment Rules before After-Save Flows. The system leverages this platform behavior deliberately — the Assignment Rule sets the territorial Queue OwnerId first, and the Flow captures that value via `{!$Record.OwnerId}` before deciding whether to override it with the escalation target.

**Field default handles qualification state.** Rather than adding an explicit Assignment element for the qualified path, the `Qualified__c` Field default value is set to True in Object Manager. The disqualified path explicitly sets it to False and exits before Update Records. This maintains the Single-DML pattern with no additional elements.

---

## 6. Validation

Three live Lead Records confirm all paths are operational:

| Lead | Path | Score | Priority | Owner |
|---|---|---|---|---|
| Richard Miranda | Qualified | 6 | Low | Inava (East_Coast_Region) |
| Neil Thompson | Qualified + Escalated | 13 | High | Sophia Delgado |
| Dylan Moss | Disqualified | — | Not Applicable | pdesa (Central_Region) |

One defect was identified and resolved during UAT: `Qualified__c` was defaulting to False on qualified Leads. Resolution: Field default value set to True in Object Manager.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 6 — Portfolio |
| File Path | docs/07-portfolio/case-study-summary.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/07-portfolio/recruiter-readable-summary.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
