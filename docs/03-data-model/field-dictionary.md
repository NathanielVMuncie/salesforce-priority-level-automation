# Lead Custom Field Dictionary — Phase 1

**Project:** Céleste Vineyards: Sales Cloud Pipeline
**Phase:** 1 — Lead Priority Level Automation
**Object:** Lead
**Source:** XML retrieved from `celeste-dev` org

All values below are sourced directly from field XML metadata. Nothing fabricated.

---

## Make.com Input Fields

### `Business_Type__c` — Business Type

| Attribute | Value |
|---|---|
| API Name | `Business_Type__c` |
| Label | Business Type |
| Type | Picklist |
| Written By | Make.com |
| Required | No |

**Description:**
Primary B2B gatekeeper and scoring input. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. 'Personal/Individual' selections trigger frontend disqualification. Valid business types contribute point values to varTotalScore for Priority_Level__c calculation.

**Help Text:**
Identifies organizational category. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. 'Personal/Individual' selections are disqualified per B2B model requirements. Valid entries contribute to automated Priority_Level__c.

**Picklist Values:**
- Specialty Gourmet Grocer
- Upscale Restaurant
- High-End Wine Store
- Catering & Event Company
- Premium Wine Distributor
- Personal/Individual (Non-Business)

---

### `Role__c` — Role

| Attribute | Value |
|---|---|
| API Name | `Role__c` |
| Label | Role |
| Type | Picklist |
| Written By | Make.com |
| Required | No |

**Description:**
Captures purchasing authority and organizational position. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c calculation logic and Lead scoring.

**Help Text:**
Indicate Lead's purchasing authority or position. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. This value determines the automated Priority_Level__c calculation.

**Picklist Values:**
- Owner
- Purchasing Manager
- General Manager
- Sales Manager
- Event Coordinator

---

### `Purchasing_Timeline__c` — Purchasing Timeline

| Attribute | Value |
|---|---|
| API Name | `Purchasing_Timeline__c` |
| Label | Purchasing Timeline |
| Type | Picklist |
| Written By | Make.com |
| Required | No |

**Description:**
Captures the Lead's expected procurement window. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c calculation logic and Lead scoring.

**Help Text:**
Indicate Lead's expected procurement window. Originates from LeadSource Céleste Vineyards - Business Inquiry Form. This value determines the automated Priority_Level__c calculation and Lead scoring.

**Picklist Values:**
- Immediate Need (Contracting)
- Short-Term (Within 30 Days)
- Evaluating Vendors (Next 90 Days)
- Budget Planning (Future Quarter)
- Information Gathering
- Not Applicable

---

### `Customer_Note__c` — Customer Note

| Attribute | Value |
|---|---|
| API Name | `Customer_Note__c` |
| Label | Customer Note |
| Type | Text Area (255) |
| Written By | Make.com |
| Required | No |

**Description:**
Long text field capturing Lead-specific questions and unique inquiries. Originates at the base of LeadSource Céleste Vineyards - Business Inquiry Form. Provides unstructured context to supplement automated Priority_Level__c scoring.

**Help Text:**
Long text field for unique Lead questions and specific case inquiries. Originates from the Céleste Vineyards - Business Inquiry Form.

---

## Flow-Written Fields

### `Priority_Level__c` — Priority Level

| Attribute | Value |
|---|---|
| API Name | `Priority_Level__c` |
| Label | Priority Level |
| Type | Picklist (Restricted) |
| Written By | Flow (`Lead_Scoring_and_Priority_Level_Assignment`) |
| Required | No |

**Description:**
Reflects the point sum (varTotalScore) from LeadSource Céleste Vineyards - Business Inquiry Form. Lead Scoring and Priority Automation flow assigns Levels (High ≥ 12, Medium ≥ 8, Low < 8). High Priority escalated to National Sales Director.

**Help Text:**
Calculated via varTotalScore from the Céleste Vineyards - Business Inquiry Form. Defines Priority Level: High (≥ 12), Medium (≥ 8), or Low (< 8). High Priority triggers escalation to the National Sales Director.

**Picklist Values:**
- High
- Medium
- Low
- Disqualified
- Not Applicable

**Scoring Thresholds:**

| Level | Threshold |
|---|---|
| High | varTotalScore ≥ 12 |
| Medium | varTotalScore ≥ 8 |
| Low | varTotalScore < 8 |
| Maximum possible score | 15 |

---

### `Qualified__c` — Qualified

| Attribute | Value |
|---|---|
| API Name | `Qualified__c` |
| Label | Qualified |
| Type | Checkbox (default: True) |
| Written By | Flow (`Lead_Scoring_and_Priority_Level_Assignment`) |
| Required | No |

**Description:**
Authoritative qualification flag used by automation to indicate whether the lead meets baseline B2B eligibility criteria for sales engagement.

**Help Text:**
Checked = Lead qualifies as a valid business prospect. Unchecked = Lead is disqualified from sales qualification logic.

---

### `Lead_Score__c` — Lead Score

| Attribute | Value |
|---|---|
| API Name | `Lead_Score__c` |
| Label | Lead Score |
| Type | Number |
| Written By | Flow (`Lead_Scoring_and_Priority_Level_Assignment`) |
| Required | No |

**Description:**
Lead score determining priority status.

**Help Text:**
⚠️ **Missing from XML** — `<inlineHelpText>` not present in local metadata. Do not fabricate. Add Help Text in org and re-retrieve to resolve.

---

## Formula Fields

### `Region__c` — Region

| Attribute | Value |
|---|---|
| API Name | `Region__c` |
| Label | Region |
| Type | Formula (Text) |
| Written By | Formula (read-only) |
| Required | No |

**Description:**
Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules Céleste - Regional Sales Representatives and Queue distribution for Céleste Vineyards Pipeline.

**Help Text:**
Identifies Lead geographic assignment (West Coast, East Coast, Central) based on State. Primary driver for Lead Assignment Rules Céleste - Regional Sales Representatives and Queue distribution for Céleste Vineyards Pipeline.

---

### `Qualification_Status__c` — Qualification Status

| Attribute | Value |
|---|---|
| API Name | `Qualification_Status__c` |
| Label | Qualification Status |
| Type | Formula (Text) |
| Written By | Formula (read-only) |
| Required | No |

**Description:**
Visual formula field derived from Qualified__c. Displays a qualification indicator for sales users based on the lead's current qualification state.

**Help Text:**
Visual qualification indicator. ✅ = Qualified for sales engagement. ❌ = Disqualified based on lead intake criteria.

---

### `Lead_Created__c` — Lead Created

| Attribute | Value |
|---|---|
| API Name | `Lead_Created__c` |
| Label | Lead Created |
| Type | Formula (Date) |
| Written By | Formula (read-only) |
| Required | No |

**Description:**
Date-only formula field derived from the standard Lead CreatedDate field. Used to display and report on record creation as a date without time.

**Help Text:**
Displays the date this lead was created. This is a formula field based on the standard CreatedDate field and does not include time.
