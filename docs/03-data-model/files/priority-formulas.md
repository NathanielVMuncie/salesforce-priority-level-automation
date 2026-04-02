# Priority Formulas

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 1 — Data Authority

---

## 1. Document Purpose

This document defines all Formula Fields and Flow formula resources used in the Céleste Vineyards Lead Priority Level Automation system. It records the formula expressions, their source Fields, their return types, and their role in the automation pipeline.

All Formula Field definitions are sourced directly from SFDX metadata retrieved at API version 66.0. The Flow formula resource is sourced from the live Flow configuration.

---

## 2. Formula Overview

The system uses three Formula Fields on the Lead Object and one Flow formula resource. None of these are written by the Flow or Make.com — they self-resolve from other Field values.

| Name | Type | Location | Source Field(s) | Returns |
|---|---|---|---|---|
| `Qualification_Status__c` | Formula Field (Text) | Lead Object | `Qualified__c` | Qualification display string |
| `Region__c` | Formula Field (Text) | Lead Object | `State` | Geographic region string |
| `Lead_Created__c` | Formula Field (Date) | Lead Object | `CreatedDate` | Date without time |
| `Qualification_Status_Aesthetic` | Flow Formula Resource (Text) | Flow — `Lead_Scoring_and_Priority_Level_Assignment` | `{!$Record.Qualified__c}` | Qualification display string |

---

## 3. Qualification_Status__c — Formula Field

### 3.1 Field Configuration

| Attribute | Value |
|---|---|
| Field Label | Qualification Status |
| API Name | `Qualification_Status__c` |
| Field Type | Formula (Text) |
| Source Field | `Qualified__c` |
| Treat Blanks As | Blank as Zero |
| External ID | No |
| Unique | No |

### 3.2 Formula Expression

```
IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)
```

### 3.3 Behavior

| `Qualified__c` Value | `Qualification_Status__c` Output |
|---|---|
| True | ✅ Qualified |
| False | ❌ Not Qualified |

### 3.4 Automation Role

This Formula Field is the visible qualification indicator on the Lead Record. It is evaluated directly from `Qualified__c` without any Flow intervention. When the `Qualified__c` Field default was incorrectly set to False (Defect D-01), this Formula Field surfaced the incorrect state by displaying `❌ Not Qualified` on qualified Leads. After the default was corrected to True, this Field resolved correctly for all Leads.

**Note:** The live org returns `❌ Not Qualified` as the disqualified display value. Earlier documentation referenced `❌ Disqualified` — the Formula Field metadata is authoritative.

---

## 4. Region__c — Formula Field

### 4.1 Field Configuration

| Attribute | Value |
|---|---|
| Field Label | Region |
| API Name | `Region__c` |
| Field Type | Formula (Text) |
| Source Field | `State` |
| Treat Blanks As | Blank as Zero |
| External ID | No |
| Unique | No |

### 4.2 Formula Expression

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

### 4.3 Behavior

| `State` Value | `Region__c` Output |
|---|---|
| Any East Coast state | East Coast |
| Any Central state | Central |
| Any West Coast state | West Coast |
| Any unmatched value | International |

### 4.4 Automation Role

`Region__c` provides the territorial classification for every Lead Record. It self-resolves from `State` and is not written by the Flow or Assignment Rule. This means the regional classification is always accurate regardless of OwnerId — including on High priority Leads where the Flow escalation override has replaced the Queue OwnerId with Sophia Delgado's User ID. The region is preserved for pipeline reporting and visibility across all paths.

---

## 5. Lead_Created__c — Formula Field

### 5.1 Field Configuration

| Attribute | Value |
|---|---|
| Field Label | Lead Created |
| API Name | `Lead_Created__c` |
| Field Type | Formula (Date) |
| Source Field | `CreatedDate` |
| Treat Blanks As | Blank as Zero |

### 5.2 Formula Expression

```
DATEVALUE(CreatedDate)
```

### 5.3 Behavior

Returns the date portion of `CreatedDate` without the time component.

### 5.4 Automation Role

Reporting and display convenience Field. Not evaluated by any Flow logic or scoring calculation. Provides a clean date-only Field for pipeline reporting without requiring users to parse the full DateTime value of `CreatedDate`.

---

## 6. Qualification_Status_Aesthetic — Flow Formula Resource

### 6.1 Resource Configuration

| Attribute | Value |
|---|---|
| Resource Name | Qualification Status Aesthetic |
| API Name | `Qualification_Status_Aesthetic` |
| Resource Type | Formula |
| Data Type | Text |
| Location | Flow — `Lead_Scoring_and_Priority_Level_Assignment` |

### 6.2 Formula Expression

```
IF({!$Record.Qualified__c}, '✅ Qualified', '❌ Not Qualified')
```

### 6.3 Automation Role

This Flow formula resource mirrors the logic of `Qualification_Status__c` within the Flow context. It is available as a reference within the Flow interview but is not written to any Field. The `Qualification_Status__c` Formula Field on the Lead Object is the authoritative display value — this resource exists as a Flow-level reference for any future Flow logic that may need to evaluate or display the qualification state string.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 1 — Data Authority |
| File Path | metadata/formulas/priority-formulas.md |
| Date Produced | 2026-04-01 |
| Next Document | docs/03-data-model/scoring-model.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
