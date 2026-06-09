# Flow Notes — Lead Scoring and Priority Level Assignment

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document records the element-level configuration of the `Lead_Scoring_and_Priority_Level_Assignment` After-Save Record-Triggered Flow. It covers every element from trigger to final write: each element's type, label, inputs, outputs, and position in the execution sequence.

Scoring dimension definitions and point values are documented in `docs/03-data-model/scoring-model.md`. The behavioral scoring sequence — accumulation, operator use, and composite scoring logic — is documented in `docs/04-automation-logic/scoring-logic.md`. Routing and escalation architecture is documented in `docs/04-automation-logic/routing-architecture.md`.

Every Lead Record that reaches the Flow is a confirmed B2B submission. Qualification is enforced at the Wix form layer before any payload reaches Make.com or Salesforce. No disqualification path exists in the Flow. Every Flow interview that fires produces a complete score, a Priority Level, and a single DML write.

---

## 2. Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| Version | V26 |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Optimize For | Actions and Related Records |
| Status | Active |

---

## 3. Flow Variables

| Variable | Data Type | Default Value | Purpose |
|---|---|---|---|
| `varTotalScore` | Number | 0 | Accumulates dimension scores across Tiers 1–3 |
| `varPriorityLevel` | Text | — | Stores the Priority Level string assigned based on `varTotalScore` |
| `varOwnerID` | Text | — | Stores the OwnerId value written at Update Records |

`varTotalScore` is initialized at 0 and incremented by Assignment elements using the Add operator. It is never reset or overwritten during scoring — only incremented. `varTotalScore` is not written to any Lead field.

---

## 4. Element Inventory

### Tier 1 — Business Type Score

#### Determine Business Type Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Business Type Score` |
| Field Evaluated | `Business_Type__c` |
| Outcome Count | 5 + Default |

| Outcome | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Premium Wine Distributor` | `Business_Type__c` Equals `Premium Wine Distributor` | `Premium Wine Distributor, Add 5 Points` | 5 |
| `Is High-End Wine Store` | `Business_Type__c` Equals `High-End Wine Store` | `High-End Wine Store, Add 4 Points` | 4 |
| `Is Upscale Restaurant` | `Business_Type__c` Equals `Upscale Restaurant` | `Upscale Restaurant, Add 3 Points` | 3 |
| `Is Specialty Gourmet Grocer` | `Business_Type__c` Equals `Specialty Gourmet Grocer` | `Specialty Gourmet Grocer, Add 2 Points` | 2 |
| `Is Catering & Event Company` | `Business_Type__c` Equals `Catering & Event Company` | `Add Catering & Event Company, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End — no Assignment executes | — |

All five scored outcomes use the **Add** operator: `varTotalScore = varTotalScore + [points]`. The Default Outcome is a defensive backstop and does not fire under normal pipeline conditions.

---

### Tier 2 — Role Score

#### Determine Role Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Role Score` |
| Field Evaluated | `Role__c` |
| Outcome Count | 5 + Default |

| Outcome | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Owner` | `Role__c` Equals `Owner` | `Owner, Add 5 Points` | 5 |
| `Is Purchasing Manager` | `Role__c` Equals `Purchasing Manager` | `Purchasing Manager, Add 4 Points` | 4 |
| `Is General Manager` | `Role__c` Equals `General Manager` | `General Manager, Add 3 Points` | 3 |
| `Is Sales Manager` | `Role__c` Equals `Sales Manager` | `Sales Manager, Add 2 Points` | 2 |
| `Is Event Coordinator` | `Role__c` Equals `Event Coordinator` | `Event Coordinator, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End — no Assignment executes | — |

At the point Tier 2 executes, `varTotalScore` holds the Tier 1 value. All five Assignment elements extend the running total using the Add operator.

---

### Tier 3 — Purchasing Timeline Score

#### Determine Purchasing Timeline Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Purchasing Timeline Score` |
| Field Evaluated | `Purchasing_Timeline__c` |
| Outcome Count | 5 + Default |

| Outcome | Condition | Assignment Element | Points Added to `varTotalScore` |
|---|---|---|---|
| `Is Immediate Need (Contracting)` | `Purchasing_Timeline__c` Equals `Immediate Need (Contracting)` | `Immediate Need (Contracting), Add 5 Points` | 5 |
| `Is Short-Term (Within 30 Days)` | `Purchasing_Timeline__c` Equals `Short-Term (Within 30 Days)` | `Short-Term (Within 30 Days), Add 4 Points` | 4 |
| `Is Evaluating Vendors (Next 90 Days)` | `Purchasing_Timeline__c` Equals `Evaluating Vendors (Next 90 Days)` | `Evaluating Vendors (Next 90 Days), Add 3 Points` | 3 |
| `Is Budget Planning (Future Quarter)` | `Purchasing_Timeline__c` Equals `Budget Planning (Future Quarter)` | `Budget Planning (Future Quarter), Add 2 Points` | 2 |
| `Is Information Gathering` | `Purchasing_Timeline__c` Equals `Information Gathering` | `Information Gathering, Add 1 Point` | 1 |
| Default Outcome | No condition matched | Routes to End — no Assignment executes | — |

At the point Tier 3 executes, `varTotalScore` holds the Tier 1 + Tier 2 sum. All five Assignment elements produce the final composite score. Range: 3–15.

---

### Priority Level Assignment

#### Determine Priority Level

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Determine Priority Level` |
| Variable Evaluated | `varTotalScore` |
| Outcome Count | 2 + Default |

| Outcome | Condition | Assignment Element | `varPriorityLevel` Set To |
|---|---|---|---|
| `Is Priority Level High` | `varTotalScore` ≥ 12 | `Priority Level High` | `High` |
| `Is Priority Level Medium` | `varTotalScore` ≥ 8 | `Priority Level Medium` | `Medium` |
| `Is Priority Level Low` | Default Outcome | `Priority Level Low` | `Low` |

Outcome evaluation order is architecturally required. `Is Priority Level High` evaluates first — scores 12–15 resolve to `High` before the `Is Priority Level Medium` condition (≥ 8) can match. All three outcome branches converge at the escalation segment.

---

### Escalation and Ownership

#### Initialize OwnerId Default

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| Element Label | `Initialize OwnerId Default` |
| Assignment | `varOwnerID` = `{!$Record.OwnerId}` |
| Purpose | Captures the regional Queue OwnerId assigned by the Lead Assignment Rule as the default baseline |

The Lead Assignment Rule fires synchronously at record creation, before the After-Save Flow executes. At the point this Assignment element runs, `{!$Record.OwnerId}` holds the Queue value set by the Assignment Rule.

---

#### Escalate High Priority to Sophia

| Attribute | Value |
|---|---|
| Element Type | Decision |
| Element Label | `Escalate High Priority to Sophia` |
| Variable Evaluated | `varPriorityLevel` |
| Outcome Count | 1 + Default |

| Outcome | Condition | Action |
|---|---|---|
| `Is High` | `varPriorityLevel` Equals `High` | Assignment: `varOwnerID` = National Sales Director User ID |
| `Is Not High` | Default Outcome | No Assignment — `varOwnerID` retains the regional Queue value |

The `Is High` outcome overrides the regional Queue value captured by `Initialize OwnerId Default`. The `Is Not High` Default Outcome executes no Assignment element. Both paths converge at the Update Records element.

---

### Single DML Write

#### Update Lead Priority and Score

| Attribute | Value |
|---|---|
| Element Type | Update Records |
| Element Label | `Update Lead Priority and Score` |
| Condition Requirements | None — always executes |
| Record | Triggering Lead Record |
| DML Count | 1 of 150 |

| Field | API Name | Value Written |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |

This is the only DML operation in the Flow. `varTotalScore` is not written to any Lead field. No other Lead fields are modified by this operation.

---

## 5. Element Count

| Element Type | Count |
|---|---|
| Decision | 5 |
| Assignment | 20 |
| Update Records | 1 |
| **Total** | **26** |

---

## 6. Governor Limit Exposure

| Resource | Used | Limit |
|---|---|---|
| DML Statements | 1 | 150 |
| DML Rows | 1 | 10,000 |

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `metadata/flow-notes/lead-scoring-and-priority-assignment.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
