# Priority Formulas

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document defines every formula field on the Salesforce Lead Object used in the Céleste Vineyards Lead Priority Level Automation system. It records the formula syntax, the fields each formula evaluates, the outputs it produces, and the role each formula plays in the pipeline.

All formulas are sourced directly from `.field-meta.xml` metadata retrieved from the live Salesforce Developer Edition org.

---

## 2. Formula Field Inventory

Three formula fields are present on the Lead Object in this system.

| Field Label | API Name | Return Type | Evaluates | Purpose |
|---|---|---|---|---|
| Qualification Status | `Qualification_Status__c` | Text | `Qualified__c` | Display — qualification state indicator |
| Region | `Region__c` | Text | `State` (standard) | Classification — geographic territory |
| Lead Created | `Lead_Created__c` | Date | `CreatedDate` (standard) | Display — date without timestamp |

---

## 3. Qualification_Status__c

### 3.1 Formula

```
IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)
```

### 3.2 Configuration

| Attribute | Value |
|---|---|
| Field Type | Formula (Text) |
| Formula Treat Blanks As | BlankAsZero |
| External ID | No |
| Unique | No |

### 3.3 Logic

The formula evaluates the boolean `Qualified__c` checkbox field. If `Qualified__c` is True, the formula returns `✅ Qualified`. If `Qualified__c` is False, the formula returns `❌ Not Qualified`.

| `Qualified__c` Value | Output |
|---|---|
| True (checked) | `✅ Qualified` |
| False (unchecked) | `❌ Not Qualified` |

### 3.4 Pipeline Role

This field provides a human-readable qualification indicator on the Lead Record for sales users. It requires no explicit write — it evaluates automatically whenever the Record is loaded. Because `Qualified__c` defaults to True at the field level, this formula displays `✅ Qualified` on every new Lead Record at creation, including disqualified records until the Flow processes them.

### 3.5 Note on Display Labels

The formula text retrieved from the org displays `❌ Not Qualified` for disqualified records. Earlier portfolio documentation references `❌ Disqualified` as the display value. The formula as retrieved from the live org is the authoritative value. The functional behavior — indicating non-qualification — is identical in both representations.

---

## 4. Region__c

### 4.1 Formula

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

### 4.2 Configuration

| Attribute | Value |
|---|---|
| Field Type | Formula (Text) |
| Formula Treat Blanks As | BlankAsZero |
| External ID | No |
| Unique | No |

### 4.3 Logic

The formula uses a CASE expression evaluating the standard `State` field against all 50 US states and the District of Columbia. It returns one of three region values — `East Coast`, `Central`, or `West Coast` — based on the state match. The else clause returns `International` for any unmatched value.

| Region | State Count | States |
|---|---|---|
| East Coast | 20 | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| Central | 18 | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |
| West Coast | 13 | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |

### 4.4 Pipeline Role

`Region__c` provides geographic classification for every Lead Record. It is used by the Assignment Rule as a secondary reference and by reporting to classify pipeline by territory. Critically, this field is never written or modified by the Flow — it self-resolves at all times, including on High priority records where the Flow escalation overrides `OwnerId` to Sophia Delgado. The territorial classification is preserved regardless of ownership state.

---

## 5. Lead_Created__c

### 5.1 Formula

```
DATEVALUE(CreatedDate)
```

### 5.2 Configuration

| Attribute | Value |
|---|---|
| Field Type | Formula (Date) |
| Formula Treat Blanks As | BlankAsZero |

### 5.3 Logic

The formula wraps the standard `CreatedDate` datetime field in the `DATEVALUE()` function, which strips the time component and returns a date-only value.

| Input | Output |
|---|---|
| `2026-03-21T19:34:22.000Z` | `2026-03-21` |

### 5.4 Pipeline Role

Utility display field. Not part of the qualification, scoring, or routing pipeline. Provides a clean date value for reporting and Lead Record display without the timestamp component of `CreatedDate`.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final — Phase 1 |
| Phase | 1 — Data Authority |
| File Path | `metadata/formulas/priority-formulas.md` |
| Date Produced | 2026-03-26 |
| Next Document | Phase 1 complete — all files produced |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
