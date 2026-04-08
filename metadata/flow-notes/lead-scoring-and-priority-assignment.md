# Flow Notes — Lead Scoring and Priority Level Assignment

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document records the element-level configuration of the After-Save Record-Triggered Flow — Lead Scoring and Priority Level Assignment. It supplements the architecture documentation in `docs/02-architecture/automation-architecture.md` with element-by-element detail: each element's type, configuration, inputs, outputs, and position in the execution sequence.

---

## 2. Flow Identity

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| Version | V9 |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

---

## 3. Flow Variables

| Variable | Data Type | Default Value | Purpose |
|---|---|---|---|
| `varTotalScore` | Number | 0 | Accumulates weighted dimension scores across Segments 1–2 |
| `varPriorityLevel` | Text | — | Stores assigned Priority Level string — High, Medium, or Low |
| `varOwnerID` | Text | — | Stores OwnerId value written at Update Records |
| `varQualified` | Boolean | True | Stores qualification state written at Update Records |

---

## 4. Flow Formula Resource

| Attribute | Value |
|---|---|
| Resource Name | `Qualification_Status_Aesthetic` |
| Type | Formula |
| Purpose | Supporting resource — referenced internally. Display logic handled by `Qualification_Status__c` Formula Field on the Lead Object. |

---

## 5. Element Inventory by Segment

### Segment 1 — Qualification Gate

---

#### Determine Business Type Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| API Name | `Determine_Business_Type_Score` |
| Purpose | Dual-purpose — enforces qualification gate and assigns Business Type dimension score |

| Outcome | Condition | Action |
|---|---|---|
| Premium Wine Distributor | `Business_Type__c` Equals `Premium Wine Distributor` | `varTotalScore` Add 5 |
| High-End Wine Store | `Business_Type__c` Equals `High-End Wine Store` | `varTotalScore` Add 4 |
| Upscale Restaurant | `Business_Type__c` Equals `Upscale Restaurant` | `varTotalScore` Add 3 |
| Specialty Gourmet Grocer | `Business_Type__c` Equals `Specialty Gourmet Grocer` | `varTotalScore` Add 2 |
| Catering & Event Company | `Business_Type__c` Equals `Catering & Event Company` | `varTotalScore` Add 1 |
| Gatekeeper Fail | Default Outcome | Routes to `Set_Qualification_State_Disqualified` → End |

---

#### Set Qualification State Disqualified

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| API Name | `Set_Qualification_State_Disqualified` |
| Executes On | Gatekeeper Fail outcome only |
| Assignment | `varQualified` = False |
| Next Element | End |

---

### Segment 2 — Weighted Scoring

---

#### Determine Role Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| API Name | `Determine_Role_Score` |

| Outcome | Condition | Action |
|---|---|---|
| Purchasing Manager | `Role__c` Equals `Purchasing Manager` | `varTotalScore` Add 5 |
| Owner / General Manager | `Role__c` Equals `Owner / General Manager` | `varTotalScore` Add 4 |
| Buyer | `Role__c` Equals `Buyer` | `varTotalScore` Add 3 |
| Sales Manager | `Role__c` Equals `Sales Manager` | `varTotalScore` Add 2 |
| Marketing Coordinator | `Role__c` Equals `Marketing Coordinator` | `varTotalScore` Add 1 |
| Default | Default Outcome | Routes to End |

---

#### Determine Purchasing Timeline Score

| Attribute | Value |
|---|---|
| Element Type | Decision |
| API Name | `Determine_Purchasing_Timeline_Score` |

| Outcome | Condition | Action |
|---|---|---|
| Short-Term (Within 30 Days) | `Purchasing_Timeline__c` Equals `Short-Term (Within 30 Days)` | `varTotalScore` Add 4 |
| Mid-Term (1–3 Months) | `Purchasing_Timeline__c` Equals `Mid-Term (1–3 Months)` | `varTotalScore` Add 3 |
| Long-Term (3–6 Months) | `Purchasing_Timeline__c` Equals `Long-Term (3–6 Months)` | `varTotalScore` Add 2 |
| Budget Planning (Future Quarter) | `Purchasing_Timeline__c` Equals `Budget Planning (Future Quarter)` | `varTotalScore` Add 2 |
| Exploratory (No Set Timeline) | `Purchasing_Timeline__c` Equals `Exploratory (No Set Timeline)` | `varTotalScore` Add 1 |
| Default | Default Outcome | Routes to End |

---

### Segment 3 — Priority Assignment

---

#### Determine Priority Level

| Attribute | Value |
|---|---|
| Element Type | Decision |
| API Name | `Determine_Priority_Level` |

| Outcome | Condition | `varPriorityLevel` Set To |
|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` |
| Medium | `varTotalScore` ≥ 8 | `Medium` |
| Low | Default Outcome | `Low` |

---

### Segment 4 — Escalation

---

#### Initialize OwnerId (Default)

| Attribute | Value |
|---|---|
| Element Type | Assignment |
| API Name | `Initialize_OwnerId_Default` |
| Assignment | `varOwnerID` = `{!$Record.OwnerId}` |
| Purpose | Captures regional Queue OwnerId set by Assignment Rule as the default baseline |

---

#### Escalate High Priority to Sophia

| Attribute | Value |
|---|---|
| Element Type | Decision |
| API Name | `Escalate_High_Priority_to_Sophia` |

| Outcome | Condition | Action |
|---|---|---|
| Is High | `varPriorityLevel` Equals `High` | `varOwnerID` = Sophia Delgado User ID |
| Is Not High | Default Outcome | `varOwnerID` retained — regional Queue value unchanged |

---

### Segment 5 — Single DML Write

---

#### Update Lead Priority and Score

| Attribute | Value |
|---|---|
| Element Type | Update Records |
| API Name | `Update_Lead_Priority_and_Score` |
| Condition Requirements | None — Always Update Record |
| Record | Triggering Lead Record |
| DML Count | 1 of 150 |

| Field Written | API Name | Source |
|---|---|---|
| Owner ID | `OwnerId` | `{!varOwnerID}` |
| Priority Level | `Priority_Level__c` | `{!varPriorityLevel}` |
| Qualified | `Qualified__c` | `{!varQualified}` |
| Lead Score | `Lead_Score__c` | `{!varTotalScore}` |

---

## 6. Element Count

| Element Type | Count |
|---|---|
| Decision | 5 |
| Assignment | 21 |
| Update Records | 1 |
| **Total** | **27** |

---

## 7. Governor Limit Exposure

| Resource | Used | Limit |
|---|---|---|
| DML Statements | 1 | 150 |
| DML Rows | 1 | 10,000 |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Routing, Escalation, and Ownership |
| File Path | `metadata/flow-notes/lead-scoring-and-priority-assignment.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*