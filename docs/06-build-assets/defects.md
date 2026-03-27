# Defect Log

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document records all defects identified during the build and UAT phase of the Céleste Vineyards Lead Priority Level Automation system. Each defect is documented with its ID, description, root cause, resolution, and final status.

---

## 2. Defect Summary

| Defect ID | Component | Description | Severity | Status |
|---|---|---|---|---|
| D-01 | Salesforce — `Qualified__c` Field | Qualified Leads displaying ❌ Disqualified | High | ✅ Resolved |

---

## 3. D-01 — Qualified__c Default Value Incorrect

### 3.1 Description

After initial build and first test submission (Richard Miranda — S-01), the `Qualification_Status__c` Formula Field displayed `❌ Disqualified` on a confirmed qualified Lead Record. The same issue was observed on the Neil Thompson Record (S-02).

### 3.2 Symptoms

| Observation | Expected | Actual |
|---|---|---|
| `Qualification_Status__c` on Richard Miranda | ✅ Qualified | ❌ Disqualified |
| `Qualification_Status__c` on Neil Thompson | ✅ Qualified | ❌ Disqualified |
| `Qualified__c` checkbox value | True | False |

### 3.3 Root Cause

The `Qualified__c` Checkbox Field was not configured with a default value in Object Manager. Salesforce Checkbox Fields default to False when no default is explicitly set. Every Lead Record created in the org — including qualified Leads processed by the Flow — was receiving `Qualified__c` = False at creation.

The Flow Variable `varQualified` defaults to True and is correctly written to `Qualified__c` by the `Update Lead Priority and Score` Update Records element. However, the `Qualification_Status__c` Formula Field evaluates the committed Field value on the Record. The incorrect Field-level default was surfacing as the visible state.

### 3.4 Resolution

The default value of `Qualified__c` was set to **True** in Object Manager → Lead Object → Fields and Relationships → `Qualified__c` → Edit → Default Value = Checked.

This ensures:
- Every Lead Record begins with `Qualified__c` = True
- The disqualified path explicitly sets `varQualified` = False and exits before Update Records — disqualified Records correctly show False via `Qualification_Status__c`
- Qualified Records receive the True default at creation and the Flow write confirms it via Update Records

### 3.5 Verification

After the fix was applied, both Richard Miranda and Neil Thompson Records were inspected. `Qualification_Status__c` displayed `✅ Qualified` on both Records. Dylan Moss (S-03) continued to display `❌ Disqualified` correctly.

### 3.6 Impact on Single-DML Pattern

The resolution does not require any additional Assignment element in the Flow. The Field default handles the qualified path. The Single-DML pattern is preserved — `Update Lead Priority and Score` remains the sole write operation in the Flow.

| Attribute | Value |
|---|---|
| Defect ID | D-01 |
| Severity | High |
| Identified | 2026-03-21 |
| Resolved | 2026-03-21 |
| Status | ✅ Resolved |
| Resolved By | Nathaniel Muncie |

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | test-artifacts/defect-log/defects.md |
| Date Produced | 2026-03-23 |
| Next Document | docs/06-build-assets/screenshots-index.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
