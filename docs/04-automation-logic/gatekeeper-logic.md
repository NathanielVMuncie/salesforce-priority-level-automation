# Gatekeeper Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document defines the qualification gate implemented in the Lead Scoring and Priority Level Assignment Flow. It records the gatekeeper's position in the execution sequence, the decision criteria, each outcome path, and the architectural rationale for separating qualification from scoring.

---

## 2. Gatekeeper Position in Flow Execution

The qualification gate is the first Decision element in the Flow. It executes before any scoring logic. A Lead that fails the gate exits the qualified path immediately — no score is calculated, no Priority Level is assigned, no OwnerId override occurs.

Lead Record Created
|
Assignment Rule fires — territorial Queue assigned
|
After-Save Flow fires
|
[GATEKEEPER] Determine Business Type Score
|
Qualified path ──────────────────────────────→ Scoring → Priority → Escalation → Update Records
|
Gatekeeper Fail path → Set Qualification State Disqualified → End

---

## 3. Gate Criteria

The gatekeeper evaluates a single Field: `Business_Type__c`.

`Business_Type__c` is a Picklist Field on the Lead Object. It captures the submitting contact's business category as selected on the Wix intake form. The Field is required at form submission — no Lead enters the org without a value.

**Qualified business types (5):**

| Picklist Value | Business Type Score |
|---|---|
| Premium Wine Distributor | 5 |
| High-End Wine Store | 4 |
| Upscale Restaurant | 3 |
| Specialty Gourmet Grocer | 2 |
| Catering & Event Company | 1 |

**Disqualifying condition:**

Any value that does not match the five qualified business types routes to the Gatekeeper Fail outcome. The primary disqualifying value is `Personal/Individual (Non-Business)`. The Default Outcome catches any unmapped or unexpected value.

---

## 4. Dual-Purpose Design

The `Determine_Business_Type_Score` Decision element serves two functions simultaneously:

- **Qualification gate** — routes non-business submissions out of the qualified path before scoring begins
- **Dimension score assignment** — assigns the Business Type weighted score to `varTotalScore` on each qualified outcome

This is a deliberate single-element design. A separate standalone gate Decision followed by a separate scoring Decision would produce identical results with higher element count and no architectural benefit.

---

## 5. Outcome Paths

### Qualified Path

Any of the five qualified business type outcomes routes the Lead forward into the scoring segment. The Business Type score is added to `varTotalScore` at the point of the outcome.

### Gatekeeper Fail Path

The Default Outcome routes to `Set_Qualification_State_Disqualified`, an Assignment element that sets `varQualified` to False. Execution ends after this Assignment. No scoring, priority assignment, or escalation logic executes.

---

## 6. Qualification State Fields

Two Fields record qualification state on the Lead Record:

| Field | API Name | Type | Written By |
|---|---|---|---|
| Qualified | `Qualified__c` | Checkbox | Flow — Update Records element — `varQualified` |
| Qualification Status | `Qualification_Status__c` | Formula (Text) | Formula Field — derives from `Business_Type__c` |

`Qualified__c` default is True in Object Manager. The Flow writes False on the disqualified path via `varQualified`. On the qualified path, the default True value is preserved — no explicit write is required.

`Qualification_Status__c` formula:

IF(
ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"),
"❌ Not Qualified",
"✅ Qualified"
)

The formula field provides the human-readable qualification label. It reads directly from `Business_Type__c` and does not depend on `Qualified__c`.

---

## 7. DevOrg Constraint Note

`Qualified__c` is not available in the Flow Builder field picker on all execution paths — a confirmed Flow Builder limitation with checkbox fields. The formula field approach (`Qualification_Status__c`) resolves the display requirement without requiring a direct Flow write on the disqualified path. `Qualified__c` is written by Flow only on the disqualified path via `varQualified` in the Update Records element.

---

## 8. Live Validation

| Lead | Business Type | Gatekeeper Outcome | Qualified__c | Qualification_Status__c |
|---|---|---|---|---|
| Richard Miranda | High-End Wine Store | Qualified | True | ✅ Qualified |
| Neil Thompson | Premium Wine Distributor | Qualified | True | ✅ Qualified |
| Dylan Moss | Personal/Individual (Non-Business) | Gatekeeper Fail | False | ❌ Not Qualified |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Routing, Escalation, and Ownership |
| File Path | `docs/04-automation-logic/gatekeeper-logic.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*