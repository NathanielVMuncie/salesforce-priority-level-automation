# Priority Formulas

Salesforce Case Study: Lead — Priority Level Automation
Céleste Vineyards | Metadata

---

## 1. Document Purpose

This document records every formula field used in the Céleste Vineyards Lead Priority Level Automation system. It reflects the full, production-accurate formula syntax for all formula fields on the Lead Object, alongside field metadata, return values, and cross-references to related documentation.

This is the authoritative formula reference for the project. Source documentation for the scoring model logic that drives `Priority_Level__c` is in `docs/03-data-model/scoring-model.md`. Field metadata for all custom fields is in `metadata/custom-fields/lead-fields.md`.

---

## 2. Formula Field Index

| Field API Name | Field Label | Formula Type | Purpose |
|---|---|---|---|
| `Lead_Created__c` | Lead Created | Date | Date-only derivation of CreatedDate |
| `Qualification_Status__c` | Qualification Status | Text | Visual qualification indicator based on Business_Type__c |
| `Region__c` | Region | Text | Geographic territory assignment based on State |

---

## 3. Formula Definitions

### 3.1 Lead_Created__c

| Attribute | Value |
|---|---|
| Full Name | Lead.Lead_Created__c |
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Object | Lead |
| Formula Treat Blanks As | BlankAsZero |

**Formula:**

```
DATEVALUE(CreatedDate)
```

**Description:** Date-only formula field derived from the standard Lead `CreatedDate` field. Used to display and report on record creation as a date without time component.

**Return Values:**

| Condition | Output |
|---|---|
| Always | Date value of CreatedDate (no time) |

---

### 3.2 Qualification_Status__c

| Attribute | Value |
|---|---|
| Full Name | Lead.Qualification_Status__c |
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Formula Treat Blanks As | BlankAsZero |

**Formula:**

```
IF(ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"), "Not Qualified", "Qualified")
```

**Description:** Visual formula field derived from `Business_Type__c`. Displays a qualification indicator based on whether the Lead's business type meets the minimum B2B eligibility criteria defined by the Céleste Vineyards gatekeeper logic.

**Return Values:**

| Condition | Output |
|---|---|
| Business_Type__c = Personal/Individual (Non-Business) | Not Qualified |
| Any other Business_Type__c value | Qualified |

**Cross-Reference:** Gatekeeper logic is documented in `docs/04-automation-logic/gatekeeper-logic.md`.

---

### 3.3 Region__c

| Attribute | Value |
|---|---|
| Full Name | Lead.Region__c |
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Formula Treat Blanks As | BlankAsZero |

**Formula:**

```
CASE(State,
  "CA", "West Coast",
  "OR", "West Coast",
  "WA", "West Coast",
  "NV", "West Coast",
  "AZ", "West Coast",
  "NY", "East Coast",
  "NJ", "East Coast",
  "CT", "East Coast",
  "MA", "East Coast",
  "FL", "East Coast",
  "PA", "East Coast",
  "TX", "Central",
  "IL", "Central",
  "OH", "Central",
  "CO", "Central",
  "MN", "Central",
  "MO", "Central",
  "International"
)
```

**Description:** Identifies Lead geographic assignment based on the `State` field. Primary driver for Lead Assignment Rules (Céleste - Regional Sales Representatives) and Queue distribution for the Céleste Vineyards pipeline.

**Return Values:**

| Condition | Output |
|---|---|
| State maps to West Coast territory | West Coast |
| State maps to East Coast territory | East Coast |
| State maps to Central territory | Central |
| State is null or unrecognized | International |

**Territory Mapping:**

| Region | States |
|---|---|
| West Coast | CA, OR, WA, NV, AZ |
| East Coast | NY, NJ, CT, MA, FL, PA |
| Central | TX, IL, OH, CO, MN, MO |
| International | All other / null |

**Cross-Reference:** Assignment Rules and Queue distribution are documented in `metadata/assignment-rules/` and `metadata/queues/`.

---

## 4. Formula Field Summary

| Field API Name | Formula Type | Returns | Written By |
|---|---|---|---|
| `Lead_Created__c` | Date | Date of record creation (no time) | Self-resolving — Formula Field |
| `Qualification_Status__c` | Text | Qualified / Not Qualified | Self-resolving — Formula Field |
| `Region__c` | Text | West Coast / East Coast / Central / International | Self-resolving — Formula Field |

All three formula fields are self-resolving. They are not written by Make.com or the Flow.

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Section | Metadata |
| File Path | metadata/formulas/priority-formulas.md |

Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie
