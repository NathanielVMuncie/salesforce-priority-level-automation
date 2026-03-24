# UAT Session Log

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 5 — Validation and Evidence

---

## 1. Document Purpose

This document records the User Acceptance Testing session conducted to validate the Céleste Vineyards Lead Priority Level Automation system. It documents the session date, environment, tester, scenarios executed, observations, defects identified, and the final sign-off status.

---

## 2. Session Details

| Attribute | Value |
|---|---|
| Session Date | 2026-03-21 |
| Environment | Salesforce Developer Edition org |
| Tester | Nathaniel Muncie |
| Scenarios Executed | S-01, S-02, S-03 |
| Total Test Records Created | 3 |
| Defects Identified | 1 (D-01 — resolved during session) |
| Final Status | ✅ Pass — all scenarios confirmed |

---

## 3. Session Execution Log

### 3.1 S-01 — Richard Miranda

| Action | Observation |
|---|---|
| Submitted Richard Miranda form on Wix — Specialty Gourmet Grocer, Sales Manager, Budget Planning (Future Quarter), Connecticut | Form submitted successfully |
| Checked Make.com execution log | Module 12 executed — standard Field mapping confirmed |
| Checked Salesforce Lead Record | Lead Record created with correct Field values |
| Checked Flow debug log | Flow fired — scoring sequence executed — varTotalScore = 6 — Low assigned |
| Inspected Lead Record Fields | Priority_Level__c = Low, OwnerId = Inava — **Qualified__c = False — DEFECT D-01 identified** |
| Re-inspected Record after Qualified__c default value set to True | Qualification_Status__c = ✅ Qualified — confirmed correct |

### 3.2 S-02 — Neil Thompson

| Action | Observation |
|---|---|
| Submitted Neil Thompson form — Premium Wine Distributor, Purchasing Manager, Short-Term (Within 30 Days), Alaska | Form submitted successfully |
| Checked Make.com execution log | Module 12 executed — standard Field mapping confirmed |
| Checked Salesforce Lead Record | Lead Record created with correct Field values |
| Checked Flow debug log | Flow fired — varTotalScore = 13 — High assigned — escalation fired — Sophia Delgado set as Owner |
| Inspected Lead Record Fields | Priority_Level__c = High, OwnerId = Sophia Delgado, Region__c = West Coast — all correct |

### 3.3 S-03 — Dylan Moss

| Action | Observation |
|---|---|
| Submitted Dylan Moss form — Personal/Individual (Non-Business), Louisiana | Conditional rule fired — role and timeline Fields hidden — disqualification message displayed |
| Checked Make.com execution log | Module 13 executed — placeholder values confirmed |
| Checked Salesforce Lead Record | Lead Record created with Not Applicable placeholder values |
| Checked Flow debug log | Flow fired — Gatekeeper Fail outcome executed — Flow terminated at End — no scoring ran |
| Inspected Lead Record Fields | Qualification_Status__c = ❌ Disqualified, Priority_Level__c = Not Applicable, OwnerId = pdesa — all correct |

---

## 4. Defect Identified

| Defect ID | Description | Severity | Status |
|---|---|---|---|
| D-01 | `Qualified__c` defaulting to False — qualified Leads showing ❌ Disqualified | High | ✅ Resolved during session |

Full defect detail documented in `test-artifacts/defect-log/defects.md`.

---

## 5. Sign-Off

All three scenarios executed and confirmed passing after D-01 resolution.

| Scenario | Status |
|---|---|
| S-01 — Richard Miranda — Qualified Low | ✅ Pass |
| S-02 — Neil Thompson — Qualified High with Escalation | ✅ Pass |
| S-03 — Dylan Moss — Non-Qualified Disqualified | ✅ Pass |

**UAT Sign-Off:** Nathaniel Muncie — 2026-03-21

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 5 — Validation and Evidence |
| File Path | test-artifacts/uat-evidence/uat-session-log.md |
| Date Produced | 2026-03-23 |
| Next Document | test-artifacts/defect-log/defects.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
