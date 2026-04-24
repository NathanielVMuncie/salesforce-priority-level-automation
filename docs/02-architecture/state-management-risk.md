# State Management Risk

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document identifies and documents the state management risks present in the Céleste Vineyards Lead Priority Level Automation system. It covers the risks associated with the interaction between the Lead Assignment Rule and the After-Save Flow escalation override, and the Single-DML pattern.

For each risk identified, this document records the risk, the potential failure mode, and the resolution or mitigation applied in the live build.

Every Lead Record that enters the Salesforce pipeline is a confirmed B2B submission. The qualification gate is enforced at the Wix form layer before any data is transmitted. No qualification fields, qualification variables, or disqualification paths exist in this system — no state management risks arise from qualification logic.

---

## 2. Risk Overview

The automation system manages state across multiple components — Wix, Make.com, the Salesforce Lead Object, and the After-Save Flow. State management risks arise where Field values, execution paths, or component interactions could produce incorrect or inconsistent Record states. One risk was identified during the build.

| Risk ID | Risk Area | Severity | Status |
|---|---|---|---|
| R-01 | Assignment Rule fires before Flow escalation override | Low | By design — confirmed safe |

---

## 3. R-01 — Assignment Rule Fires Before Flow Escalation Override

### 3.1 Risk Description

Salesforce executes Lead Assignment Rules synchronously at Record creation, before After-Save Flow logic runs. The Assignment Rule routes the Lead to a regional Queue and writes that Queue's ID to `OwnerId` before the Flow evaluates Priority Level or applies the escalation override.

**Risk:** If the Flow escalation override fails to execute, High priority Lead Records would be owned by a regional Queue rather than Sophia Delgado.

### 3.2 Assessment

This risk is mitigated by the architecture of the escalation sequence:

- The `Initialize OwnerId (Default)` Assignment element captures `{!$Record.OwnerId}` — the regional Queue value — into `varOwnerID` as the baseline
- The `Escalate High Priority to Sophia` Decision evaluates `varPriorityLevel` and overwrites `varOwnerID` with Sophia Delgado's User ID only if the Priority Level is High
- The `Update Lead Priority and Score` Update Records element writes `varOwnerID` to `OwnerId` — committing either the regional Queue value or Sophia Delgado's User ID

The escalation override is part of the same Flow interview as scoring and priority assignment. If the Flow completes successfully, the override executes correctly.

**Status:** By design — confirmed safe. Live validation on the Neil Thompson Record confirms the escalation override executed correctly: Assignment Rule routed to `West_Coast_Region` Queue (jchen), Flow overrode `OwnerId` with Sophia Delgado's User ID.

---

## 4. State on Each Path — Summary

| Field | Qualified — High | Qualified — Medium / Low |
|---|---|---|
| `OwnerId` | Sophia Delgado (Flow override) | Regional Queue (Assignment Rule — retained by Flow) |
| `Priority_Level__c` | `High` (Flow) | `Medium` / `Low` (Flow) |
| `Region__c` | Correct territory (Formula Field — self-resolving) | Correct territory (Formula Field — self-resolving) |

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/state-management-risk.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
