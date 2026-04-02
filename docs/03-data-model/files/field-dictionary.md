# Field Dictionary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document provides the full Field specification for every custom Field in the automation system's scope. It is the authoritative build reference for each Field as configured in the live Salesforce Developer Edition org. All Field definitions are sourced directly from SFDX metadata retrieved via `sf project retrieve start` at API version 66.0.

Standard Salesforce Lead Fields are native to the platform and do not require configuration documentation here. Only custom Fields are specified in this document.

Fields are organized by category: custom input Fields first, custom output Fields second, Formula Fields third.

---

## 2. Custom Input Fields

### 2.1 Business Type

| Attribute | Value |
|---|---|
| Field Label | Business Type |
| API Name | `Business_Type__c` |
| Field Type | Picklist |
| Required | Yes |
| Default Value | None |
| Restricted Picklist | No |
| Track Feed History | No |

**Description:** Primary B2B gatekeeper and scoring input. Originates from `LeadSource` = `Céleste Vineyards - Business Inquiry Form`. `Personal/Individual` selections trigger frontend disqualification. Valid business types contribute point values to `varTotalScore` for `Priority_Level__c` calculation.

**Picklist Values:**

| Value | API Name | Scoring Role |
|---|---|---|
| Premium Wine Distributor | `Premium Wine Distributor` | Qualified — 5 points |
| High-End Wine Store | `High-End Wine Store` | Qualified — 4 points |
| Upscale Restaurant | `Upscale Restaurant` | Qualified — 3 points |
| Specialty Gourmet Grocer | `Specialty Gourmet Grocer` | Qualified — 2 points |
| Catering & Event Company | `Catering & Event Company` | Qualified — 1 point |
| Personal/Individual (Non-Business) | `Personal/Individual (Non-Business)` | Gatekeeper Fail — Flow exits |

**Automation Notes:**
- Evaluated by the first Decision element in the Flow — `Determine Business Type Score`
- `Personal/Individual (Non-Business)` triggers the Gatekeeper Fail outcome — `varQualified` set to False — Flow exits at End
- All other values proceed to scoring — each contributes a weighted point value to `varTotalScore`

---

### 2.2 Role

| Attribute | Value |
|---|---|
| Field Label | Role |
| API Name | `Role__c` |
| Field Type | Picklist |
| Required | Yes |
| Default Value | None |
| Restricted Picklist | No |
| Track Feed History | No |

**Description:** Captures purchasing authority and organizational position. Originates from `LeadSource` = `Céleste Vineyards - Business Inquiry Form`. Primary input for `Priority_Level__c` calculation logic and Lead scoring.

**Picklist Values:**

| Value | API Name | Scoring Role |
|---|---|---|
| Owner | `Owner` | 5 points |
| Purchasing Manager | `Purchasing_Manager` | 4 points |
| General Manager | `General_Manager` | 3 points |
| Sales Manager | `Sales_Manager` | 2 points |
| Event Coordinator | `Event_Coordinator` | 1 point |

**Automation Notes:**
- Evaluated by the `Determine Role Score` Decision element
- Non-matching values route to the Default Outcome — Flow terminates at End
- Make.com Module 13 writes `Not Applicable` for disqualified submissions — this value is not in the Picklist but is accepted as the non-qualified placeholder

---

### 2.3 Purchasing Timeline

| Attribute | Value |
|---|---|
| Field Label | Purchasing Timeline |
| API Name | `Purchasing_Timeline__c` |
| Field Type | Picklist |
| Required | No |
| Default Value | None |
| Restricted Picklist | No |
| Track Feed History | No |

**Description:** Captures the Lead's expected procurement window. Originates from `LeadSource` = `Céleste Vineyards - Business Inquiry Form`. Primary input for `Priority_Level__c` calculation logic and Lead scoring.

**Picklist Values:**

| Value | API Name | Scoring Role |
|---|---|---|
| Immediate Need (Contracting) | `Immediate Need (Contracting)` | 5 points |
| Short-Term (Within 30 Days) | `Short-Term (Within 30 Days)` | 4 points |
| Evaluating Vendors (Next 90 Days) | `Evaluating Vendors (Next 90 Days)` | 3 points |
| Budget Planning (Future Quarter) | `Budget Planning (Future Quarter)` | 2 points |
| Information Gathering | `Information Gathering` | 1 point |
| Not Applicable | `Not Applicable` | Placeholder — written by Make.com Module 13 |

**Automation Notes:**
- Evaluated by the `Determine Purchasing Timeline Score` Decision element
- `Not Applicable` is written by Make.com Module 13 for disqualified submissions and is not evaluated by the Flow scoring logic
- Non-matching values route to the Default Outcome — Flow terminates at End

---

### 2.4 Customer Note

| Attribute | Value |
|---|---|
| Field Label | Customer Note |
| API Name | `Customer_Note__c` |
| Field Type | Text Area |
| Required | No |
| Default Value | None |
| Track Feed History | No |

**Description:** Long text Field capturing Lead-specific questions and unique inquiries. Originates at the base of `LeadSource` = `Céleste Vineyards - Business Inquiry Form`. Provides unstructured context to supplement automated `Priority_Level__c` scoring.

**Automation Notes:**
- Not evaluated by any Flow logic
- Passed from the Wix payload by both Module 12 and Module 13
- Provides sales context for the assigned representative after routing is complete

---

## 3. Custom Output Fields

### 3.1 Priority Level

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Required | No |
| Default Value | None |
| Restricted Picklist | Yes |
| Track Feed History | No |

**Description:** Reflects the point sum (`varTotalScore`) from `LeadSource` = `Céleste Vineyards - Business Inquiry Form`. The `Lead Scoring and Priority Level Assignment` Flow assigns Levels — High ≥ 12, Medium ≥ 8, Low < 8. High Priority is escalated to the National Sales Director.

**Picklist Values:**

| Value | Written By | Condition |
|---|---|---|
| High | Flow — Update Records | `varTotalScore` ≥ 12 |
| Medium | Flow — Update Records | `varTotalScore` ≥ 8 |
| Low | Flow — Update Records | Default outcome — `varTotalScore` < 8 |
| Not Applicable | Make.com Module 13 | Disqualified submission — written before Record creation |
| Disqualified | Reserved | Not written by current automation — present for future use |

**Automation Notes:**
- Written exclusively by the `Update Lead Priority and Score` Update Records element on the qualified path
- `Not Applicable` is written by Make.com Module 13 before Record creation — the Flow does not overwrite it on the disqualified path
- Restricted Picklist enforced — no values outside this set are accepted

---

### 3.2 Qualified

| Attribute | Value |
|---|---|
| Field Label | Qualified |
| API Name | `Qualified__c` |
| Field Type | Checkbox |
| Default Value | True |
| Track Feed History | No |

**Description:** Authoritative qualification Flag used by automation to indicate whether the Lead meets baseline B2B eligibility criteria for sales engagement.

**Automation Notes:**
- Default value of True ensures every Lead Record begins in a qualified state
- The disqualified path sets `varQualified` to False via the `Set Qualification State Disqualified` Assignment element — this value is not written to the Field on the disqualified path because the Flow exits before the Update Records element
- The qualified path writes True via the `Update Lead Priority and Score` Update Records element — redundantly confirming the Field default
- Resolution of Defect D-01: default value was set to True in Object Manager to correct qualified Leads displaying `❌ Not Qualified`

---

## 4. Formula Fields

### 4.1 Qualification Status

| Attribute | Value |
|---|---|
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Source Field | `Qualified__c` |
| Treat Blanks As | Blank as Zero |

**Formula:**
```
IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)
```

**Description:** Visual Formula Field derived from `Qualified__c`. Displays a qualification indicator for sales users based on the Lead's current qualification state.

**Automation Notes:**
- Self-resolving — updates automatically when `Qualified__c` changes
- Not written by the Flow or Make.com
- Live org returns `❌ Not Qualified` for the disqualified state — this is the authoritative display value

---

### 4.2 Region

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Source Field | `State` |
| Treat Blanks As | Blank as Zero |

**Formula:** CASE formula evaluating `State` Field against all 50 US states and the District of Columbia — returning `East Coast`, `Central`, `West Coast`, or `International` for unmatched values.

**Description:** Identifies Lead geographic assignment based on `State/Province`. Primary driver for Lead Assignment Rules and Queue distribution for the Céleste Vineyards pipeline.

**Automation Notes:**
- Self-resolving — updates automatically when `State` changes
- Not written by the Flow or Assignment Rule
- Provides territorial classification for reporting and pipeline visibility regardless of OwnerId — including on High priority Leads escalated to Sophia Delgado

---

### 4.3 Lead Created

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Source Field | `CreatedDate` |
| Treat Blanks As | Blank as Zero |

**Formula:**
```
DATEVALUE(CreatedDate)
```

**Description:** Date-only Formula Field derived from the standard Lead `CreatedDate` Field. Used to display and report on Record creation as a date without the time component.

**Automation Notes:**
- Self-resolving — no write required
- Not evaluated by any Flow logic
- Provides a clean date Field for reporting and timeline analysis

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 1 — Data Authority |
| File Path | docs/03-data-model/field-dictionary.md |
| Date Produced | 2026-04-01 |
| Next Document | metadata/custom-fields/lead-fields.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
