# Grounding Document

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Knowledge Bank

---

## 1. Document Purpose

This document is the authoritative reference for the Céleste Vineyards Lead Priority Level Automation system. It is read at the start of every session before any documentation, analysis, or build work begins. It establishes locked architecture, locked personnel, locked canonical data, locked document standards, and locked terminology. No component of this document may be overridden by conversational context, partial memory, or prior session artifacts unless explicitly superseded by a confirmed architectural decision recorded here.

---

## 2. Project Identity

| Attribute | Value |
|---|---|
| Project Name | Salesforce Case Study: Lead — Priority Level Automation |
| Client | Céleste Vineyards |
| Owner | Nathaniel V. Muncie |
| Repository | `NathanielVMuncie/salesforce-priority-level-automation` |
| Branch | `main` |
| Visibility | Private |
| Salesforce Org | `celeste-vineyards-dev-ed.develop.my.salesforce.com` |
| Org Alias | `celeste-dev` |
| API Version | v66.0 |
| Make.com Scenario | `Wix_To_CelesteProd_B2B_Lead_Engine_v1` |
| Notion Document Standards Page | `3523a36cfb2b812dba29d3826d7403d5` |
| Notion Session Handoffs Index | `3373a36cfb2b817a8b4ac5e372f5b3f3` |

---

## 3. System Summary

The Céleste Vineyards Lead Priority Level Automation system is a linear, event-driven B2B Lead intake pipeline. It connects three platforms in a fixed sequence:

```
Wix (qualification gate + form capture)
    ↓ B2B payload only
Make.com (field normalization + API ingestion)
    ↓ Salesforce Lead created via API
Salesforce Sales Cloud (scoring + priority assignment + escalation + territorial routing)
```

The system begins at the Wix form submission and terminates at Lead owner assignment. No post-conversion activity is in scope.

---

## 4. Locked Architecture — Non-Negotiable

These architectural decisions are finalized. They cannot be changed, re-litigated, or modified by any session instruction or documentation request.

### 4.1 Qualification Gate — Wix Layer Only

The qualification gate is enforced exclusively at the Wix form layer. When a prospect selects `Personal/Individual (Non-Business)`, the form collapses, the submit control is disabled, a Not Qualified message renders, and no payload is generated. The Wix Automation does not fire. Make.com receives nothing. No Lead Record is created.

**Downstream consequences:**
- No qualification fields exist anywhere in the system — `Qualified__c` and `Qualification_Status__c` are non-existent; write all documentation as if they were never built
- No qualification variables exist in the Flow — `varQualified` does not exist
- No qualification logic exists in Make.com — no Router, no Module 13, no non-qualified path
- No disqualification paths exist in the Salesforce Flow
- Every Lead Record that exists in Salesforce is a confirmed B2B submission by definition

### 4.2 Make.com — Single-Path Linear Pipeline

Make.com is a two-module scenario:

| Module | Type | Function |
|---|---|---|
| Module 2 | Custom Webhook | Receives B2B payload from Wix |
| `Module 12` | Salesforce Create Record | Creates Lead Record in Salesforce with normalized field values |

No Router exists. No `Module 13` exists. No secondary paths exist. Make.com is a data conduit — it does not evaluate Lead quality, apply scoring, or make routing decisions.

### 4.3 Salesforce Flow — Scoring Only

The After-Save Record-Triggered Flow `Lead_Scoring_and_Priority_Level_Assignment` handles scoring, priority assignment, escalation, and owner write only.

**Flow identity:**

| Attribute | Value |
|---|---|
| Flow Name | Lead Scoring and Priority Level Assignment |
| API Name | `Lead_Scoring_and_Priority_Level_Assignment` |
| Version | V25 |
| Flow Type | Record-Triggered — After-Save |
| Object | Lead |
| Trigger Event | A Record is Created |
| Execution Timing | Run Immediately |
| Entry Condition | `LeadSource` Equals `Céleste Vineyards - Business Inquiry Form` |
| Status | Active |

**Flow variables — exactly three:**

| Variable | Data Type | Default | Purpose |
|---|---|---|---|
| `varTotalScore` | Number | 0 | Accumulates composite score across all three scoring tiers |
| `varPriorityLevel` | Text | — | Stores Priority Level string assigned from `varTotalScore` |
| `varOwnerID` | Text | — | Stores `OwnerId` value to be written at DML |

**Flow element count: 25**

| Category | Type | Count |
|---|---|---|
| Decision elements | Decision | 4 |
| Scoring Assignment elements | Assignment | 15 |
| Priority Level Assignment elements | Assignment | 3 |
| `OwnerId` Assignment elements | Assignment | 2 |
| Update Records element | Update Records | 1 |
| **Total** | | **25** |

**Flow architecture — four tiers:**

- **Tier 1** — Business Type Score (`Determine Business Type Score` Decision + 5 Assignment elements)
- **Tier 2** — Role Score (`Determine Role Score` Decision + 5 Assignment elements)
- **Tier 3** — Purchasing Timeline Score (`Determine Purchasing Timeline Score` Decision + 5 Assignment elements)
- **Tier 4** — Priority Level and Escalation (`Determine Priority Level` Decision + 3 Priority Assignment elements + `Initialize OwnerId (Default)` Assignment + `Escalate High Priority to Sophia` Decision + `Escalate OwnerId to Sophia` Assignment + `Update Lead Priority and Score` Update Records)

**Single-DML pattern:** `Update Lead Priority and Score` is the sole Update Records element. It writes `OwnerId` and `Priority_Level__c` in one DML operation.

### 4.4 Scoring Dimensions

Three dimensions. Each scores 1–5. Composite range: 3–15.

**Business Type (`Business_Type__c`):**

| Picklist Value | Points |
|---|---|
| `Premium Wine Distributor` | 5 |
| `High-End Wine Store` | 4 |
| `Upscale Restaurant` | 3 |
| `Specialty Gourmet Grocer` | 2 |
| `Catering & Event Company` | 1 |

**Role (`Role__c`):**

| Picklist Value | Points |
|---|---|
| `Owner` | 5 |
| `Purchasing Manager` | 4 |
| `General Manager` | 3 |
| `Sales Manager` | 2 |
| `Event Coordinator` | 1 |

**Purchasing Timeline (`Purchasing_Timeline__c`):**

| Picklist Value | Points |
|---|---|
| `Immediate Need (Contracting)` | 5 |
| `Short-Term (Within 30 Days)` | 4 |
| `Evaluating Vendors (Next 90 Days)` | 3 |
| `Budget Planning (Future Quarter)` | 2 |
| `Information Gathering` | 1 |

### 4.5 Priority Level Thresholds

| Priority Level | Condition | `varPriorityLevel` |
|---|---|---|
| High | `varTotalScore` ≥ 12 | `High` |
| Medium | `varTotalScore` ≥ 8 | `Medium` |
| Low | Default (all remaining) | `Low` |

**Outcome evaluation order:** High evaluated first. A score of 12 resolves to `High` before the Medium condition is checked.

Priority Level reflects composite Lead value — not urgency. "How urgently the Lead should be contacted" is incorrect framing. Urgency is a characteristic of the Purchasing Timeline dimension only.

### 4.6 Escalation Logic

The Assignment Rule fires at Record creation and routes the Lead to a regional Queue. The Flow then evaluates Priority Level:

- Priority Level `High` → `varOwnerID` overwritten with Sophia Delgado's User ID → committed by `Update Lead Priority and Score`
- Priority Level `Medium` or `Low` → `varOwnerID` retains the regional Queue value (or named representative if license is held) → committed as-is

`Region__c` is never altered by escalation. A Priority Level High Lead owned by Sophia Delgado retains the correct territorial `Region__c` value.

---

## 5. Personnel

### 5.1 Escalation Target

| Name | Title | Alias | Org Role |
|---|---|---|---|
| Sophia Delgado | National Sales Director | `sdelg` | Receives all Priority Level `High` Leads via Flow escalation override |

Sophia Delgado is not region-designated. Assignment is triggered exclusively by Priority Level. She holds the active license in the DevOrg by default, enabling her escalation assignment to execute regardless of which representative holds the license at any given time.

### 5.2 Regional Sales Representatives

| Name | Alias | Region | Queue API Name |
|---|---|---|---|
| Luis Navarro | `lnava` | East Coast Region | `East_Coast_Region` |
| Jordan Chen | `jchen` | West Coast Region | `West_Coast_Region` |
| Priya Desai | `pdesa` | Central Region | `Central_Region` |

### 5.3 Queue Function

Each regional Queue serves two roles:

- **License proxy** — owns Lead Records for a region when the representative does not hold the active license
- **Fault-path backstop** — receives any Lead the Flow does not route to a named user

Queues are DevOrg license-constraint workarounds. They are not the intended design owner for any Lead. In a production org, all three representatives and Sophia Delgado hold provisioned licenses simultaneously and named representatives receive direct ownership.

In prose: use position titles (National Sales Director, Sales Representative). Named individuals appear only in canonical Lead Record validation tables and personnel definitions.

---

## 6. Territorial Routing

Routing is implemented via a single Lead Assignment Rule with three rule entries. The Assignment Rule evaluates `State/Province` and assigns the Lead to the corresponding regional Queue.

| Rule Entry | Queue Label | Queue API Name | Region |
|---|---|---|---|
| Rule 1 | `lnava` | `East_Coast_Region` | East Coast |
| Rule 2 | `jchen` | `West_Coast_Region` | West Coast |
| Rule 3 | `pdesa` | `Central_Region` | Central |

All 50 US states and the District of Columbia are covered. No state is unassigned.

The Assignment Rule fires on every Lead Record regardless of Priority Level. Interaction between routing and Priority Level is managed by the Flow escalation segment, not the Assignment Rule.

---

## 7. Canonical Lead Set — L-01 through L-05

These five records are the complete canonical validation set. They cover all scoring outcomes, both escalation paths, and all three regional territories. No fault path is demonstrated by a canonical record.

| ID | Name | State | Region | Score | Priority Level | Final Owner |
|---|---|---|---|---|---|---|
| L-01 | Marcus Thibodeau | Georgia | East Coast | 14 | `High` | Sophia Delgado |
| L-02 | Renata Voss | Oregon | West Coast | 13 | `High` | Sophia Delgado |
| L-03 | Dominic Reyes | Illinois | Central | 9 | `Medium` | Priya Desai |
| L-04 | Janelle Harmon | Virginia | East Coast | 8 | `Medium` | Luis Navarro |
| L-05 | Britta Sandoval | Washington | West Coast | 3 | `Low` | Jordan Chen |

**Score compositions:**

| Lead | `Business_Type__c` | `Role__c` | `Purchasing_Timeline__c` | Score |
|---|---|---|---|---|
| L-01 | `Premium Wine Distributor` (5) | `Owner` (5) | `Short-Term (Within 30 Days)` (4) | 14 |
| L-02 | `Premium Wine Distributor` (5) | `Purchasing Manager` (4) | `Short-Term (Within 30 Days)` (4) | 13 |
| L-03 | `Upscale Restaurant` (3) | `General Manager` (3) | `Evaluating Vendors (Next 90 Days)` (3) | 9 |
| L-04 | `High-End Wine Store` (4) | `Sales Manager` (2) | `Budget Planning (Future Quarter)` (2) | 8 |
| L-05 | `Catering & Event Company` (1) | `Event Coordinator` (1) | `Information Gathering` (1) | 3 |

**License rotation sequence for record creation:**

| Step | Licensed User | Records Created |
|---|---|---|
| 1 | Luis Navarro | L-01, L-04 |
| 2 | Jordan Chen | L-02, L-05 |
| 3 | Priya Desai | L-03 |

---

## 8. Field Inventory

### 8.1 Standard Fields — In Pipeline Scope

| Field Label | API Name | Written By | Pipeline Role |
|---|---|---|---|
| First Name | `FirstName` | Make.com | Identity |
| Last Name | `LastName` | Make.com | Identity |
| Company | `Company` | Make.com | Identity |
| Email | `Email` | Make.com | Contact |
| Phone | `Phone` | Make.com (normalized) | Contact |
| State/Province | `State` | Make.com | Routing — Assignment Rule evaluation |
| Lead Source | `LeadSource` | Make.com (hardcoded) | Flow entry condition |
| Owner ID | `OwnerId` | Assignment Rule → Flow escalation override | Final owner |

### 8.2 Custom Fields — In Pipeline Scope

| Field Label | API Name | Type | Written By | Pipeline Role |
|---|---|---|---|---|
| Business Type | `Business_Type__c` | Picklist | Make.com | Scoring Tier 1 |
| Role | `Role__c` | Picklist | Make.com | Scoring Tier 2 |
| Purchasing Timeline | `Purchasing_Timeline__c` | Picklist | Make.com | Scoring Tier 3 |
| Priority Level | `Priority_Level__c` | Picklist | Flow — `Update Lead Priority and Score` | Priority output |
| Lead Score | `Lead_Score__c` | Number | Flow — `Update Lead Priority and Score` | Composite score output (3–15) |
| Customer Note | `Customer_Note__c` | Text Area | Make.com (optional) | Prospect-submitted free text |
| Region | `Region__c` | Formula (Text) | Self-resolving from `State` via CASE | Territorial classification |
| Lead Created | `Lead_Created__c` | Formula (Date) | Self-resolving from `CreatedDate` | Audit timestamp |

### 8.3 Prohibited Fields — Non-Existent

The following fields were removed from this system during architecture revision. They do not exist on the Lead Object. Do not reference them anywhere in any documentation, table, or prose:

- `Qualified__c`
- `Qualification_Status__c`

---

## 9. Wix Field Mapping — Module 12

| Wix Form Key | Salesforce API Name | Transformation |
|---|---|---|
| `first_name` | `FirstName` | None |
| `last_name` | `LastName` | None |
| `company` | `Company` | None |
| `email` | `Email` | None |
| `phone` | `Phone` | Regex normalization to `+1 (xxx) xxx-xxxx` |
| `state` | `State` | None |
| `business_type` | `Business_Type__c` | None |
| `role` | `Role__c` | None |
| `purchasing_timeline` | `Purchasing_Timeline__c` | None |
| `customer_note` | `Customer_Note__c` | None |
| *(hardcoded)* | `LeadSource` | `Céleste Vineyards - Business Inquiry Form` |

---

## 10. Formula Fields

### 10.1 `Region__c`

Maps `State` to territorial region via CASE statement. Returns `East Coast`, `West Coast`, `Central`, or `International` (null/unrecognized default). Not written by Flow, Assignment Rule, or Make.com. Resolves at read time.

### 10.2 `Lead_Created__c`

Returns date-only value from `CreatedDate` via `DATEVALUE()`. Not written by any automation layer.

### 10.3 `Qualification_Status__c`

**Does not exist.** Previously implemented but removed. Do not reference.

---

## 11. DevOrg Constraints

### 11.1 Single Active User License

The Developer Edition org supports one active Salesforce Standard User license. One representative holds the license at a time. The other two are represented by their regional Queue as a proxy. Sophia Delgado's escalation assignment executes via Flow override and is unaffected by the license constraint.

### 11.2 No Production Sandbox

The Developer Edition org is the sole build and validation environment. Sandbox migration procedures are not demonstrated and are out of scope.

Neither constraint affects the functional fidelity of the automation logic, scoring model, routing architecture, or integration pipeline.

---

## 12. Document Standards — Summary

All documentation must conform to `docs/document-standards.md`. The complete rules are authoritative. This is a summary of the most frequently violated items.

### 12.1 Header Format

```
# [Document Title]

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | [Category Label]
```

- Line 1: H1 title only — no project name, no phase, no version
- Line 2: Bold, exact em dash (`—`) — not hyphen
- Line 3: Plain text, never bolded
- Blank line between Line 1 and Line 2; Lines 2 and 3 are adjacent

**Category Labels:**

| Folder | Label |
|---|---|
| `docs/01-overview/` | Overview |
| `docs/02-architecture/` | Architecture |
| `docs/03-data-model/` | Data Model |
| `docs/04-automation-logic/` | Automation Logic |
| `docs/05-integration/` | Integration |
| `docs/06-build-assets/` | Build Assets |
| `docs/07-portfolio/` | Portfolio |
| `metadata/` | Metadata |
| `test-artifacts/` | Validation and Evidence |
| `portfolio/` | Portfolio |
| Multi-folder files | Knowledge Bank |

### 12.2 Footer Format

```
*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
```

Em dash required. Pipe required. `Nathaniel V. Muncie` — middle initial `V.` required. `Céleste` — accent on `é` required throughout file.

### 12.3 Document Status

Final section before footer. Exactly two fields — `Section` and `File Path`. Prohibited fields: `Date Produced`, `Status`, `Phase`, `Next Document`, `Author`.

`README.md` is exempt from the three-line header and Document Status section.

### 12.4 Backtick Requirements

| Always in backticks | Never in backticks |
|---|---|
| Field API names (`Business_Type__c`, `OwnerId`) | Technology names as nouns (Make.com, Wix, Salesforce, Flow) |
| Picklist values (`High`, `Medium`, `Low`) | Section headers |
| Flow variable names (`varTotalScore`, `varPriorityLevel`, `varOwnerID`) | General prose concepts |
| Flow element labels (`Update Lead Priority and Score`) | |
| File paths (`docs/04-automation-logic/scoring-logic.md`) | |
| Make.com module references (`Module 12`) | |

### 12.5 Prohibited Content

- `Qualified__c` or `Qualification_Status__c` anywhere
- `varQualified` anywhere
- `TBD` values
- Phase labels in headers
- Bolded Line 3 in header
- Hyphen instead of em dash in project name or footer
- `Celeste` without accent
- Missing `V.` in author name
- Forward-looking language not yet true

---

## 13. Terminology — Locked

| Term | Required Form | Prohibited Form |
|---|---|---|
| Project name (docs) | `Salesforce Case Study: Lead — Priority Level Automation` | Any hyphen variant |
| Project name (chat) | Céleste Vineyards | Full document title in chat |
| Client name | Céleste Vineyards | Celeste Vineyards (no accent) |
| Flow name | `Lead_Scoring_and_Priority_Level_Assignment` | Paraphrases, shortened versions |
| Priority Level in prose | Priority Level High / Medium / Low | Priority Level `High` in prose sentences |
| Priority Level in field/table | `High`, `Medium`, `Low` | Un-backticked in field or table contexts |
| Priority Level meaning | Composite Lead value | Urgency of contact |
| Qualification gate | Wix form layer | Salesforce gatekeeper, Flow gate |
| Queue role | DevOrg license-constraint workaround / fault-path backstop | Intended design owner, primary routing target |
| DevOrg constraint | DevOrg constraint | limitation, gap, shortfall |
| Sophia Delgado reference in prose | National Sales Director | Named individual (except in validation tables and personnel definitions) |
| Regional rep reference in prose | Sales Representative | Named individual (except in validation tables and personnel definitions) |

---

## 14. Scope Boundaries

**In scope:** Wix form → Make.com → Salesforce Lead creation → Assignment Rule → Flow scoring, priority assignment, escalation → owner assignment.

**Out of scope:** Post-conversion activity (Opportunities, Accounts, Contacts), reporting and dashboards, email alerts, user provisioning, sandbox migration, production deployment.

---

## 15. Stale Files — Requiring Cleanup

The following project files contain pre-architecture-shift content and have not yet been corrected. Do not use them as source of truth for any documentation or analysis.

| File | Known Stale Content |
|---|---|
| `defects.md` | References `Qualified__c`, `Qualification_Status__c`, old Lead names (Vivienne Okafor, Kenji Watanabe, Danielle Pruett, Marcus Bellard) |
| `screenshots-index.md` | References old Lead names and `Qualification_Status__c` |
| `uat-session-log.md` | Old Lead set, old architecture references |

The following files are confirmed clean and committed:
`scoring-logic.md`, `automation-architecture.md`, `territorial-routing-logic.md`, `coverage-validation-matrix.md`, `priority-thresholds.md`, `system-architecture.md`, `gatekeeper-logic.md`, `business-objective.md`, `field-inventory.md`, `middleware-responsibilities.md`, `source-to-lead-mapping.md`, `devorg-constraints-and-ownership-model.md`, `scope-boundaries.md`, `lead-test-records.md`, `priority-formulas.md`, `state-management-risk.md`, `document-standards.md`, `README.md`

---

## 16. Document Status

| Attribute | Value |
|---|---|
| Section | Knowledge Bank |
| File Path | `docs/knowledge-bank/grounding-document.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
