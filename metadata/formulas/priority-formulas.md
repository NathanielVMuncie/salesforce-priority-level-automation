# Priority and Qualification Formulas

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Model

---

## 1. Document Purpose

This document records the Salesforce Formula Field definitions active on the Lead Object in the Céleste Vineyards Lead Priority Level Automation system. It covers the formula syntax, input fields, return values, design rationale, and pipeline role for each Formula Field.

The authoritative source for all formula metadata is the live SFDX retrieval from org `celeste-vineyards-dev-ed.develop.my.salesforce.com` at API v66.0.

Three Formula Fields are documented here:

- `Lead_Created__c` — Date-only creation timestamp
- `Qualification_Status__c` — Qualification state display
- `Region__c` — Territorial classification

---

## 2. Lead_Created__c

### 2.1 Field Identity

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Object | Lead |
| Return Type | Date |
| Formula Treat Blanks As | BlankAsZero |
| Reads From | `CreatedDate` (standard system field) |

### 2.2 Formula

```
DATEVALUE(CreatedDate)
```

### 2.3 Logic

The formula wraps the standard `CreatedDate` DateTime field in `DATEVALUE()` to return only the date portion — stripping the time component. This produces a clean, reportable date value without requiring a separate stamp from Make.com or the Flow.

### 2.4 Design Notes

**Date, not Date/Time.** The field type is Formula (Date), not Date/Time. `DATEVALUE()` deliberately drops the time component. Lead creation date without time is sufficient for this pipeline's reporting and display purposes.

**Self-resolving.** This field requires no write operation from Make.com, the Flow, or the Assignment Rule. It resolves at read time from the system-managed `CreatedDate` field.

---

## 3. Qualification_Status__c

### 3.1 Field Identity

| Attribute | Value |
|---|---|
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Return Type | Text |
| Formula Treat Blanks As | BlankAsZero |
| Reads From | `Business_Type__c` |

### 3.2 Formula

```
IF(
  ISPICKVAL(Business_Type__c, "Personal/Individual (Non-Business)"),
  "❌ Not Qualified",
  "✅ Qualified"
)
```

### 3.3 Logic

The formula evaluates a single condition: whether `Business_Type__c` equals the disqualifying picklist value `Personal/Individual (Non-Business)`. If true, the Field returns `❌ Not Qualified`. For all other `Business_Type__c` values the Field returns `✅ Qualified`.

The formula uses `ISPICKVAL` rather than a direct text comparison because `Business_Type__c` is a Picklist Field. Salesforce requires `ISPICKVAL` for picklist comparisons in Formula Fields.

### 3.4 Return Values

| `Business_Type__c` Value | Formula Output |
|---|---|
| `Personal/Individual (Non-Business)` | ❌ Not Qualified |
| `Premium Wine Distributor` | ✅ Qualified |
| `High-End Wine Store` | ✅ Qualified |
| `Upscale Restaurant` | ✅ Qualified |
| `Specialty Gourmet Grocer` | ✅ Qualified |
| `Catering & Event Company` | ✅ Qualified |

### 3.5 Design Notes

**Does not read from `Qualified__c`.** The formula reads from `Business_Type__c` directly. The disqualified path in the Flow exits before the Update Records element executes — meaning `Qualified__c` is never written to False by the Flow on the disqualified path. The Field default of True means `Qualified__c` is True on all Records at the time the formula resolves. Reading from `Qualified__c` would cause `Qualification_Status__c` to display `✅ Qualified` on disqualified Records.

Reading from `Business_Type__c` directly eliminates this dependency. `Business_Type__c` is written by Make.com before the Flow fires and is the reliable single source for qualification state at display time.

**Resolves on all Records.** Because `Business_Type__c` is always populated by Make.com before Record creation, `Qualification_Status__c` resolves correctly on every Lead Record regardless of Flow execution path, qualification state, or Priority Level.

---

## 4. Region__c

### 4.1 Field Identity

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Object | Lead |
| Return Type | Text |
| Formula Treat Blanks As | BlankAsZero |
| Reads From | `State` (State/Province standard Field) |

### 4.2 Formula

```
CASE(State,
"Alabama", "East Coast",
"Connecticut", "East Coast",
"Delaware", "East Coast",
"District of Columbia", "East Coast",
"Florida", "East Coast",
"Georgia", "East Coast",
"Maine", "East Coast",
"Maryland", "East Coast",
"Massachusetts", "East Coast",
"New Hampshire", "East Coast",
"New Jersey", "East Coast",
"New York", "East Coast",
"North Carolina", "East Coast",
"Pennsylvania", "East Coast",
"Rhode Island", "East Coast",
"South Carolina", "East Coast",
"Tennessee", "East Coast",
"Vermont", "East Coast",
"Virginia", "East Coast",
"West Virginia", "East Coast",
"Arkansas", "Central",
"Illinois", "Central",
"Indiana", "Central",
"Iowa", "Central",
"Kansas", "Central",
"Kentucky", "Central",
"Louisiana", "Central",
"Michigan", "Central",
"Minnesota", "Central",
"Mississippi", "Central",
"Missouri", "Central",
"Nebraska", "Central",
"North Dakota", "Central",
"Ohio", "Central",
"Oklahoma", "Central",
"South Dakota", "Central",
"Texas", "Central",
"Wisconsin", "Central",
"Alaska", "West Coast",
"Arizona", "West Coast",
"California", "West Coast",
"Colorado", "West Coast",
"Hawaii", "West Coast",
"Idaho", "West Coast",
"Montana", "West Coast",
"Nevada", "West Coast",
"New Mexico", "West Coast",
"Oregon", "West Coast",
"Utah", "West Coast",
"Washington", "West Coast",
"Wyoming", "West Coast",
"International")
```

### 4.3 Logic

The formula maps US states and the District of Columbia to one of three territorial region strings — `East Coast`, `West Coast`, or `Central` — using a CASE statement that evaluates the `State` Field value. The default (else) case returns `"International"`, which handles any Record where `State` is null or contains an unrecognized value.

### 4.4 Return Values

| Region | States Covered |
|---|---|
| `East Coast` | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| `West Coast` | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |
| `Central` | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |
| `International` | Any State value not matching a defined US state or DC |

### 4.5 Design Notes

**Formula Field — not written by the Assignment Rule.** `Region__c` resolves at read time from `State`. It is not written by the Assignment Rule, the Flow, or Make.com. The Assignment Rule determines Queue ownership; it does not write to `Region__c`.

**Default returns `International`, not blank.** The CASE else value is `"International"` — not an empty string. Any Lead Record where `State` is null or contains an unrecognized value will display `International` in `Region__c`. This is the live org configuration as retrieved at API v66.0.

**Preserved through escalation.** When the Flow escalation logic overrides `OwnerId` to Sophia Delgado's User ID for High priority Leads, `Region__c` is unaffected. A High priority Lead owned by Sophia Delgado retains the correct territorial `Region__c` value for the state it originated from.

**Regional territory alignment.** The state-to-region mapping in this formula is the authoritative territorial definition for this system and matches the mapping used by the Lead Assignment Rule — East Coast, West Coast, and Central — ensuring `Region__c` and Queue assignment always reflect the same geographic classification.

---

## 5. Formula Field Summary

| Attribute | `Lead_Created__c` | `Qualification_Status__c` | `Region__c` |
|---|---|---|---|
| Return Type | Date | Text | Text |
| Input Field | `CreatedDate` (DateTime) | `Business_Type__c` (Picklist) | `State` (Text) |
| Function Used | `DATEVALUE` | `IF` + `ISPICKVAL` | `CASE` |
| Possible Return Values | Date value | 2 (`✅ Qualified`, `❌ Not Qualified`) | 4 (`East Coast`, `West Coast`, `Central`, `International`) |
| Written by Flow | No | No | No |
| Written by Assignment Rule | No | No | No |
| Resolves on all Records | Yes | Yes | Yes (returns `International` if State is null) |
| Pipeline Role | Audit timestamp | Qualification display | Territorial classification |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| File Path | `metadata/formulas/priority-formulas.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*