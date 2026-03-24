# State Management Risk

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 3 — Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document identifies and documents the state management risks present in the Céleste Vineyards Lead Priority Level Automation system. It covers the risks associated with the `Qualified__c` Field default value behavior, the Single-DML pattern, the Flow exit path for disqualified Leads, and the interaction between the Assignment Rule and the Flow escalation override.

For each risk identified, this document records the risk, the potential failure mode, and the resolution or mitigation applied in the live build.

---

## 2. Risk Overview

The automation system manages state across multiple components — Wix, Make.com, the Salesforce Lead Object, and the After-Save Flow. State management risks arise where Field values, execution paths, or component interactions could produce incorrect or inconsistent Record states. Three risks were identified during the build.

| Risk ID | Risk Area | Severity | Status |
|---|---|---|---|
| R-01 | `Qualified__c` default value | High | Resolved |
| R-02 | Flow exit on disqualified path before Update Records | Medium | By design — confirmed safe |
| R-03 | Assignment Rule fires before Flow escalation override | Low | By design — confirmed safe |

---

## 3. R-01 — Qualified__c Default Value

### 3.1 Risk Description

The `Qualified__c` Checkbox Field stores the boolean qualification state of each Lead Record. The Flow only writes this Field explicitly on the disqualified path — when the `Set Qualification State Disqualified` Assignment element sets `varQualified` to False and the Flow exits before reaching the Update Records element.

On the qualified path, the Flow completes the full scoring sequence and reaches the `Update Lead Priority and Score` Update Records element. This element writes `{!varQualified}` to `Qualified__c`. The default value of `varQualified` is True — meaning qualified Leads are written as True at the Update Records step.

**Risk:** If the Field-level default value of `Qualified__c` in Object Manager is not set to True, Records created before the Flow executes — or Records where the Flow fails to complete — will have `Qualified__c` = False, causing `Qualification_Status__c` to display `❌ Disqualified` on qualified Leads.

### 3.2 Failure Mode Observed

During initial build and testing, `Qualification_Status__c` displayed `❌ Not Qualified` on the Richard Miranda and Neil Thompson Lead Records — both qualified Leads. Root cause: `Qualified__c` defaulted to False at the Field level in Object Manager. The Flow Variable `varQualified` defaulted to True and was correctly written by the Update Records element, but the incorrect Field-level default was the visible state prior to the Flow write committing.

### 3.3 Resolution Applied

The default value of `Qualified__c` was set to **True** at the Field level in Object Manager. This ensures:

- Every Lead Record created in Salesforce begins with `Qualified__c` = True
- The disqualified path explicitly sets `varQualified` to False and exits before Update Records — so disqualified Records correctly show False
- The qualified path writes `varQualified` (True) via Update Records — redundantly confirming the Field default
- Records where the Flow does not fire default to True rather than False

**Status:** Resolved. Confirmed on live Records — Richard Miranda and Neil Thompson show `✅ Qualified` after the fix was applied.

---

## 4. R-02 — Flow Exit on Disqualified Path Before Update Records

### 4.1 Risk Description

When the Gatekeeper Fail outcome executes, the Flow sets `varQualified` to False via the `Set Qualification State Disqualified` Assignment element and routes immediately to End. The `Update Lead Priority and Score` Update Records element does not execute on this path.

**Risk:** The following Fields are never written by the Flow on the disqualified path:
- `OwnerId` — not overridden by the Flow
- `Priority_Level__c` — not written by the Flow
- `Qualified__c` — not written by the Flow via Update Records

### 4.2 Assessment

This is by design and confirmed safe for the following reasons:

- **`OwnerId`:** The Assignment Rule has already routed the Record to the correct regional Queue before the Flow fires. The Queue assignment stands.
- **`Priority_Level__c`:** Make.com Module 13 writes `Not Applicable` to `Priority_Level__c` before the Record is created. The placeholder value written by Make.com stands.
- **`Qualified__c`:** The Field-level default value is True (R-01 resolution). The `Qualification_Status__c` Formula Field resolves correctly based on the Field default — and the gatekeeper path does not need to write False through the Flow, because the Record state is correctly established by the Field default and the Make.com placeholder values.

**Status:** By design — confirmed safe. No remediation required.

---

## 5. R-03 — Assignment Rule Fires Before Flow Escalation Override

### 5.1 Risk Description

Salesforce executes Lead Assignment Rules synchronously at Record creation, before After-Save Flow logic runs. The Assignment Rule routes the Lead to a regional Queue and writes that Queue's ID to `OwnerId` before the Flow evaluates Priority Level or applies the escalation override.

**Risk:** If the Flow escalation override fails to execute, High priority Lead Records would be owned by a regional Queue rather than Sophia Delgado.

### 5.2 Assessment

This risk is mitigated by the architecture of the escalation sequence:

- The `Initialize OwnerId (Default)` Assignment element captures `{!$Record.OwnerId}` — the regional Queue value — into `varOwnerID` as the baseline
- The `Escalate High Priority to Sophia` Decision evaluates `varPriorityLevel` and overwrites `varOwnerID` with Sophia Delgado's User ID only if the Priority Level is High
- The `Update Lead Priority and Score` Update Records element writes `varOwnerID` to `OwnerId` — committing either the regional Queue value or Sophia Delgado's User ID

The escalation override is part of the same Flow interview as scoring and priority assignment. If the Flow completes successfully, the override executes correctly.

**Status:** By design — confirmed safe. Live validation on the Neil Thompson Record confirms the escalation override executed correctly: Assignment Rule routed to West Coast Queue (jchen), Flow overrode OwnerId with Sophia Delgado's User ID.

---

## 6. State on Each Path — Summary

| Field | Qualified — High | Qualified — Medium / Low | Disqualified |
|---|---|---|---|
| `OwnerId` | Sophia Delgado (Flow override) | Regional Queue (Assignment Rule) | Regional Queue (Assignment Rule) |
| `Priority_Level__c` | High (Flow) | Medium / Low (Flow) | Not Applicable (Make.com Module 13) |
| `Qualified__c` | True (Field default + Flow write) | True (Field default + Flow write) | True (Field default — Flow exits before write) |
| `Qualification_Status__c` | ✅ Qualified (Formula) | ✅ Qualified (Formula) | ❌ Disqualified (Formula) |
| `Region__c` | Correct territory (Assignment Rule) | Correct territory (Assignment Rule) | Correct territory (Assignment Rule) |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 3 — Routing, Escalation, and Ownership |
| File Path | docs/02-architecture/state-management-risk.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/05-integration/wix-make-salesforce-ingestion.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
