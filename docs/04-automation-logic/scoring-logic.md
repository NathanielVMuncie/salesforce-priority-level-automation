# Scoring Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the weighted scoring logic executed in Segment 2 of the After-Save Record-Triggered Flow `Lead_Scoring_and_Priority_Level_Assignment`. It specifies how each scoring dimension is evaluated, what point values are assigned per outcome, how `varTotalScore` is accumulated, and how execution terminates when a scored dimension produces no matching outcome.

This document covers scoring only. Qualification gating is documented in `docs/04-automation-logic/gatekeeper-logic.md`. Priority Level assignment is documented in `docs/04-automation-logic/priority-assignment-logic.md`.

---

## 2. Executive Summary

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| Flow Version | V10 |
| Flow API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Segment | Segment 2 — Weighted Scoring |
| Segment Elements | `Determine_Role_Score` (Decision), `Determine_Purchasing_Timeline_Score` (Decision) |
| Accumulator Variable | `varTotalScore` (Number, default: 0) |

**Purpose:** Segment 2 evaluates two scoring dimensions — Role and Purchasing Timeline — and adds weighted point values to `varTotalScore`. Combined with the Business Type score assigned in Segment 1, `varTotalScore` drives Priority Level assignment in Segment 3.

**Execution precondition:** Segment 2 executes only when the Lead has passed the Segment 1 qualification gate. Non-qualified Leads exit the Flow before Segment 2 begins.

---

## 3. Scoring Architecture

The scoring model operates across three dimensions. Business Type scoring occurs within the Segment 1 gatekeeper Decision (`Determine_Business_Type_Score`). Role and Purchasing Timeline scoring occur in Segment 2 via two sequential Decision elements.

| Dimension | Segment | Decision Element | Max Points |
|---|---|---|---|
| Business Type | 1 | `Determine_Business_Type_Score` | 5 |
| Role | 2 | `Determine_Role_Score` | 5 |
| Purchasing Timeline | 2 | `Determine_Purchasing_Timeline_Score` | 5 |
| **Total Maximum** | | | **15** |

`varTotalScore` accumulates all three dimensions. Each dimension's Assignment element adds to the running total using an Add operator — no dimension overwrites the accumulated value.

---

## 4. Spec

### 4.1 Role Dimension

**Decision Element:** `Determine_Role_Score`
**Field Evaluated:** `Role__c` (Picklist)

```
IF Role__c = "Owner"                THEN varTotalScore += 5
IF Role__c = "Purchasing Manager"   THEN varTotalScore += 4
IF Role__c = "General Manager"      THEN varTotalScore += 3
IF Role__c = "Sales Manager"        THEN varTotalScore += 2
IF Role__c = "Event Coordinator"    THEN varTotalScore += 1
IF Role__c = [no matching outcome]  THEN Flow routes to End (no score added)
```

The Default Outcome routes to End without executing any Assignment element. `varTotalScore` retains its Segment 1 value. `Priority_Level__c`, `OwnerId`, and `Qualified__c` are not written.

---

### 4.2 Purchasing Timeline Dimension

**Decision Element:** `Determine_Purchasing_Timeline_Score`
**Field Evaluated:** `Purchasing_Timeline__c` (Picklist)

```
IF Purchasing_Timeline__c = "Immediate Need (Contracting)"       THEN varTotalScore += 5
IF Purchasing_Timeline__c = "Short-Term (Within 30 Days)"        THEN varTotalScore += 4
IF Purchasing_Timeline__c = "Evaluating Vendors (Next 90 Days)"  THEN varTotalScore += 3
IF Purchasing_Timeline__c = "Budget Planning (Future Quarter)"   THEN varTotalScore += 2
IF Purchasing_Timeline__c = "Information Gathering"              THEN varTotalScore += 1
IF Purchasing_Timeline__c = [no matching outcome]                THEN Flow routes to End (no score added)
```

The Default Outcome routes to End without executing any Assignment element. `varTotalScore` retains its accumulated value from Segments 1 and 2 (Role). `Priority_Level__c`, `OwnerId`, and `Qualified__c` are not written.

---

### 4.3 Score Accumulation Pattern

Each matching outcome in Segments 1 and 2 executes an Assignment element that increments `varTotalScore` using the Add operator:

```
varTotalScore = varTotalScore + [dimension point value]
```

No dimension resets or overwrites `varTotalScore`. If a Default Outcome fires, that dimension contributes 0 points and execution ends without a DML write.

---

### 4.4 Fields Not Written by Scoring

Segment 2 does not write to any Lead Record fields. All field writes occur in Segment 5 (`Update_Lead_Priority_and_Score`). At the end of Segment 2, `varTotalScore` holds the accumulated composite score and is passed forward to Segment 3.

---

## 5. Artifact

### 5.1 Determine Role Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | Determine Role Score |
| API Name | `Determine_Role_Score` |
| Flow | `Lead_Scoring_and_Priority_Level_Assignment` V10 |
| Segment | 2 — Weighted Scoring |
| Executes After | `Determine_Business_Type_Score` — qualified outcomes only |
| Field Read | `Role__c` |

| Outcome Label | Condition | Assignment Element Fired | Points Added |
|---|---|---|---|
| Owner | `Role__c` Equals `Owner` | Assignment: Add 5 to `varTotalScore` | 5 |
| Purchasing Manager | `Role__c` Equals `Purchasing Manager` | Assignment: Add 4 to `varTotalScore` | 4 |
| General Manager | `Role__c` Equals `General Manager` | Assignment: Add 3 to `varTotalScore` | 3 |
| Sales Manager | `Role__c` Equals `Sales Manager` | Assignment: Add 2 to `varTotalScore` | 2 |
| Event Coordinator | `Role__c` Equals `Event Coordinator` | Assignment: Add 1 to `varTotalScore` | 1 |
| Default | No match | Routes to End — no Assignment fires | 0 |

---

### 5.2 Determine Purchasing Timeline Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | Determine Purchasing Timeline Score |
| API Name | `Determine_Purchasing_Timeline_Score` |
| Flow | `Lead_Scoring_and_Priority_Level_Assignment` V10 |
| Segment | 2 — Weighted Scoring |
| Executes After | `Determine_Role_Score` — matching outcomes only |
| Field Read | `Purchasing_Timeline__c` |

| Outcome Label | Condition | Assignment Element Fired | Points Added |
|---|---|---|---|
| Immediate Need (Contracting) | `Purchasing_Timeline__c` Equals `Immediate Need (Contracting)` | Assignment: Add 5 to `varTotalScore` | 5 |
| Short-Term (Within 30 Days) | `Purchasing_Timeline__c` Equals `Short-Term (Within 30 Days)` | Assignment: Add 4 to `varTotalScore` | 4 |
| Evaluating Vendors (Next 90 Days) | `Purchasing_Timeline__c` Equals `Evaluating Vendors (Next 90 Days)` | Assignment: Add 3 to `varTotalScore` | 3 |
| Budget Planning (Future Quarter) | `Purchasing_Timeline__c` Equals `Budget Planning (Future Quarter)` | Assignment: Add 2 to `varTotalScore` | 2 |
| Information Gathering | `Purchasing_Timeline__c` Equals `Information Gathering` | Assignment: Add 1 to `varTotalScore` | 1 |
| Default | No match | Routes to End — no Assignment fires | 0 |

---

### 5.3 Variable State After Segment 2

| Variable | State After Segment 2 |
|---|---|
| `varTotalScore` | Composite accumulated value from Segments 1 and 2 (range: 3–15 for fully matched submissions) |
| `varPriorityLevel` | Not yet assigned — set in Segment 3 |
| `varOwnerID` | Not yet assigned — set in Segment 4 |
| `varQualified` | `True` (default) — set to `False` only on Gatekeeper Fail path in Segment 1 |

---

## 6. Proof

### 6.1 Role Dimension — Maximum Score

- **Test Record:** Vivienne Okafor (existing UAT validation record)
- **Input:** `Role__c` = `Owner`
- **Expected:** `varTotalScore` incremented by 5 following Segment 1 Business Type score
- **SOQL:** `SELECT Lead_Score__c FROM Lead WHERE LastName = 'Okafor' AND FirstName = 'Vivienne'`
- **UI:** Lead Record → Details → Lead Score — confirm final score reflects Role contribution

### 6.2 Purchasing Timeline — Immediate Need Path

- **Test Record:** Vivienne Okafor
- **Input:** `Purchasing_Timeline__c` = `Short-Term (Within 30 Days)`
- **Expected:** `varTotalScore` incremented by 4 after Role dimension
- **SOQL:** `SELECT Lead_Score__c FROM Lead WHERE LastName = 'Okafor' AND FirstName = 'Vivienne'`
- **Expected Final Score:** 14 (Business Type: 5 + Role: 5 + Purchasing Timeline: 4)

### 6.3 Default Outcome — No Write

- **Input:** `Role__c` or `Purchasing_Timeline__c` holds a value not matching any named outcome
- **Expected:** Flow routes to End; `Priority_Level__c`, `OwnerId`, and `Qualified__c` not written to Lead Record
- **SOQL:** `SELECT Priority_Level__c, Lead_Score__c FROM Lead WHERE Id = '[test record Id]'`
- **Expected Result:** `Priority_Level__c` = null, `Lead_Score__c` = null or 0

### 6.4 Mid-Score Path Confirmation

- **Input:** `Business_Type__c` = `Upscale Restaurant` (3 pts), `Role__c` = `General Manager` (3 pts), `Purchasing_Timeline__c` = `Evaluating Vendors (Next 90 Days)` (3 pts)
- **Expected:** `varTotalScore` = 9 → Priority Level = `Medium`
- **SOQL:** `SELECT Lead_Score__c, Priority_Level__c FROM Lead WHERE Id = '[test record Id]'`

---

## 7. Failure Modes

| Failure | Cause | Observed Behavior |
|---|---|---|
| Role Default Outcome fires | `Role__c` is null or holds an unmapped value | Flow routes to End; no DML write; `Priority_Level__c` and `OwnerId` remain unset |
| Purchasing Timeline Default Outcome fires | `Purchasing_Timeline__c` is null or holds an unmapped value | Flow routes to End; no DML write; `Priority_Level__c` and `OwnerId` remain unset |
| Score partial — only Role fires | `Purchasing_Timeline__c` Default fires after Role adds points | `varTotalScore` holds partial value; no write occurs; Lead is unscored |
| Make.com sends unmatched picklist value | Middleware transmits a value not present in Salesforce picklist definition | Decision outcome is Default; Flow exits without scoring |
| `varTotalScore` not initialized | Salesforce variable default is 0 — no configuration risk | Not a failure mode under current design; variable always starts at 0 |

**Design implication:** Default Outcome termination on either scoring Decision means the Lead receives no automation output — no Priority Level, no Queue assignment, and no `Qualified__c` write (which remains at its `True` default). This creates a false-positive qualification state on records with incomplete scoring input. Mitigation and risk classification are documented in `docs/02-architecture/state-management-risk.md`.

---

## 8. Dependencies

| Dependency | Required State |
|---|---|
| `Lead_Scoring_and_Priority_Level_Assignment` V10 | Active — must be the sole active version |
| Segment 1 (`Determine_Business_Type_Score`) | Must execute and resolve to a non-Default outcome before Segment 2 begins |
| `Role__c` field (`Role__c`) | Must be populated by Make.com at Lead creation; picklist values must match Flow outcome conditions exactly |
| `Purchasing_Timeline__c` field (`Purchasing_Timeline__c`) | Must be populated by Make.com at Lead creation; picklist values must match Flow outcome conditions exactly |
| `varTotalScore` variable | Must be initialized to 0 (Salesforce default for Number variables — no separate initialization element required) |
| Picklist value sets for `Role__c` and `Purchasing_Timeline__c` | Must contain all values referenced in Decision outcome conditions; any mismatch routes to Default |
| Make.com scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1` | Must transmit field values on qualified path (Module 12) with correct key/value mapping |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | `docs/04-automation-logic/scoring-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
