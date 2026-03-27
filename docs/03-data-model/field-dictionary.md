# Field Dictionary

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document provides the complete field-level definition for every custom field on the Salesforce Lead Object used in the Céleste Vineyards Lead Priority Level Automation system. Each entry documents the full field configuration as retrieved from the live org — including type, description, inline help text, picklist values, formula logic, and default values.

All definitions are sourced directly from retrieved `.field-meta.xml` metadata files.

---

## 2. Business_Type__c

| Attribute | Value |
|---|---|
| Field Label | Business Type |
| API Name | `Business_Type__c` |
| Field Type | Picklist |
| Required | Yes |
| Track Feed History | No |

**Description:**
Primary B2B gatekeeper and scoring input. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. `Personal/Individual` selections trigger frontend disqualification. Valid business types contribute point values to `varTotalScore` for `Priority_Level__c` calculation.

**Inline Help Text:**
Identifies organizational category. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. `Personal/Individual` selections are disqualified per B2B model requirements. Valid entries contribute to automated `Priority_Level__c`.

**Picklist Values:**

| Value | Default | Qualification Status | Score Points |
|---|---|---|---|
| Premium Wine Distributor | No | Qualified | 5 |
| High-End Wine Store | No | Qualified | 4 |
| Upscale Restaurant | No | Qualified | 3 |
| Specialty Gourmet Grocer | No | Qualified | 2 |
| Catering & Event Company | No | Qualified | 1 |
| Personal/Individual (Non-Business) | No | Disqualified | 0 |

**Pipeline Role:**
This field serves a dual purpose at the Flow level. The `Determine Business Type Score` Decision element evaluates this field first — enforcing the qualification gate and assigning the Business Type dimension score in a single element.

---

## 3. Role__c

| Attribute | Value |
|---|---|
| Field Label | Role |
| API Name | `Role__c` |
| Field Type | Picklist |
| Required | Yes |
| Track Feed History | No |

**Description:**
Captures purchasing authority and organizational position. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. Primary input for `Priority_Level__c` calculation logic and Lead scoring.

**Inline Help Text:**
Indicate Lead's purchasing authority or position. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. This value determines the automated `Priority_Level__c` calculation.

**Picklist Values:**

| Full Name | Label | Default | Score Points |
|---|---|---|---|
| Owner | Owner | No | 5 |
| Purchasing_Manager | Purchasing Manager | No | 4 |
| General_Manager | General Manager | No | 3 |
| Sales_Manager | Sales Manager | No | 2 |
| Event_Coordinator | Event Coordinator | No | 1 |

**Note on Full Names:** The `fullName` values in the metadata use underscores (`Purchasing_Manager`) while the display labels use spaces (`Purchasing Manager`). The Flow evaluates against the `fullName` API values.

**Pipeline Role:**
Evaluated by the `Determine Role Score` Decision element in Segment 2 of the Flow. Point value is added to `varTotalScore` using the Add operator.

---

## 4. Purchasing_Timeline__c

| Attribute | Value |
|---|---|
| Field Label | Purchasing Timeline |
| API Name | `Purchasing_Timeline__c` |
| Field Type | Picklist |
| Required | No |
| Track Feed History | No |

**Description:**
Captures the Lead's expected procurement window. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. Primary input for `Priority_Level__c` calculation logic and Lead scoring.

**Inline Help Text:**
Indicate Lead's expected procurement window. Originates from LeadSource `Céleste Vineyards - Business Inquiry Form`. This value determines the automated `Priority_Level__c` calculation and Lead scoring.

**Picklist Values:**

| Value | Default | Score Points |
|---|---|---|
| Immediate Need (Contracting) | No | 5 |
| Short-Term (Within 30 Days) | No | 4 |
| Evaluating Vendors (Next 90 Days) | No | 3 |
| Budget Planning (Future Quarter) | No | 2 |
| Information Gathering | No | 1 |
| Not Applicable | No | — |

**Pipeline Role:**
Evaluated by the `Determine Purchasing Timeline Score` Decision element in Segment 2 of the Flow. Point value is added to `varTotalScore` using the Add operator. `Not Applicable` is written by Make.com Module 13 on the non-qualified path and routes to the Default Outcome in the Flow, terminating execution before any score is written.

---

## 5. Priority_Level__c

| Attribute | Value |
|---|---|
| Field Label | Priority Level |
| API Name | `Priority_Level__c` |
| Field Type | Picklist |
| Required | No |
| Restricted Picklist | Yes |
| Track Feed History | No |

**Description:**
Reflects the point sum (`varTotalScore`) from LeadSource `Céleste Vineyards - Business Inquiry Form`. Lead Scoring and Priority Automation Flow assigns Levels (High ≥ 12, Medium ≥ 8, Low < 8). High Priority escalated to National Sales Director.

**Inline Help Text:**
Calculated via `varTotalScore` from the `Céleste Vineyards - Business Inquiry Form`. Defines Priority Level: High (≥ 12), Medium (≥ 8), or Low (< 8). High Priority triggers escalation to the National Sales Director.

**Picklist Values:**

| Value | Default | Assigned By |
|---|---|---|
| High | No | Flow — `varTotalScore` ≥ 12 |
| Medium | No | Flow — `varTotalScore` ≥ 8 |
| Low | No | Flow — Default Outcome (score < 8) |
| Not Applicable | No | Make.com Module 13 — non-qualified path |
| Disqualified | No | Reserved — not used in current pipeline |

**Restricted Picklist:** This field uses a restricted picklist. Only the five defined values can be written to this field. The Flow and Make.com are both constrained to these values.

**Pipeline Role:**
Written by the Flow `Update Lead Priority and Score` Update Records element on the qualified path. Written by Make.com Module 13 with value `Not Applicable` on the non-qualified path before the Record is created.

---

## 6. Qualified__c

| Attribute | Value |
|---|---|
| Field Label | Qualified |
| API Name | `Qualified__c` |
| Field Type | Checkbox |
| Required | No |
| Default Value | True (Checked) |
| Track Feed History | No |

**Description:**
Authoritative qualification flag used by automation to indicate whether the Lead meets baseline B2B eligibility criteria for sales engagement.

**Inline Help Text:**
Checked = Lead qualifies as a valid business prospect. Unchecked = Lead is disqualified from sales qualification logic.

**Default Value Behavior:**
The field default value is set to True at the Object Manager level. Every Lead Record is created with `Qualified__c` = True regardless of path. The disqualified path in the Flow sets `varQualified` to False but exits before the Update Records element — the field retains its True default on disqualified records. The `Qualification_Status__c` formula evaluates `Qualified__c` and displays `❌ Not Qualified` correctly because the Flow sets the gatekeeper flag separately.

**Note:** The `Qualification_Status__c` formula displays `❌ Not Qualified` while the UAT documentation references `❌ Disqualified`. The formula text as retrieved from the org is the authoritative value.

**Pipeline Role:**
Written by the Flow `Update Lead Priority and Score` Update Records element on the qualified path — confirms True. Field default handles all other cases. Evaluated by `Qualification_Status__c` formula to produce the display value.

---

## 7. Qualification_Status__c

| Attribute | Value |
|---|---|
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Required | No |
| External ID | No |
| Unique | No |
| Formula Treat Blanks As | BlankAsZero |

**Description:**
Visual formula field derived from `Qualified__c`. Displays a qualification indicator for sales users based on the Lead's current qualification state.

**Inline Help Text:**
Visual qualification indicator. ✅ = Qualified for sales engagement. ❌ = Disqualified based on Lead intake criteria.

**Formula:**
```
IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)
```

**Pipeline Role:**
Self-resolving formula field. Produces a formatted display value based on the boolean state of `Qualified__c`. No explicit write required — evaluates automatically on every Record.

---

## 8. Customer_Note__c

| Attribute | Value |
|---|---|
| Field Label | Customer Note |
| API Name | `Customer_Note__c` |
| Field Type | Text Area |
| Required | No |
| Track Feed History | No |

**Description:**
Long text field capturing Lead-specific questions and unique inquiries. Originates at the base of LeadSource `Céleste Vineyards - Business Inquiry Form`. Provides unstructured context to supplement automated `Priority_Level__c` scoring.

**Inline Help Text:**
Long text field for unique Lead questions and specific case inquiries. Originates from the `Céleste Vineyards - Business Inquiry Form`.

**Pipeline Role:**
Pass-through field only. Not evaluated by any automation logic. Value originates from the Wix form `customer_note` key and is mapped directly to this field by Make.com Module 12 and Module 13 with no transformation.

---

## 9. Region__c

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Required | No |
| External ID | No |
| Unique | No |
| Formula Treat Blanks As | BlankAsZero |

**Description:**
Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules and Queue distribution for Céleste Vineyards Pipeline.

**Inline Help Text:**
Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules and Queue distribution for Céleste Vineyards Pipeline.

**Formula:**
CASE formula evaluating the standard `State` field against all 50 US states and the District of Columbia. Returns one of three values: `East Coast`, `Central`, or `West Coast`. Returns `International` as the else value for unmatched states.

**State-to-Region Mapping:**

| Region | States |
|---|---|
| East Coast | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| Central | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |
| West Coast | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |
| International | All other values (else clause) |

**Pipeline Role:**
Self-resolving formula field. Evaluated automatically based on the `State` field value. Not written or modified by the Flow under any circumstances — including High priority escalation. Preserves territorial classification on all Records regardless of ownership state.

---

## 10. Lead_Created__c

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Required | No |
| Formula Treat Blanks As | BlankAsZero |

**Description:**
Date-only formula field derived from the standard Lead `CreatedDate` field. Used to display and report on Record creation as a date without time.

**Inline Help Text:**
Displays the date this Lead was created. This is a formula field based on the standard `CreatedDate` field and does not include time.

**Formula:**
```
DATEVALUE(CreatedDate)
```

**Pipeline Role:**
Reporting and display utility field. Not part of the scoring, qualification, or routing pipeline. Provides a clean date value for reporting without the timestamp component of `CreatedDate`.

---

## 11. Document Status

| Attribute | Value |
|---|---|
| Status | Final — Phase 1 |
| Phase | 1 — Data Authority |
| File Path | `docs/03-data-model/field-dictionary.md` |
| Date Produced | 2026-03-26 |
| Next Document | `metadata/custom-fields/lead-fields.md` |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
