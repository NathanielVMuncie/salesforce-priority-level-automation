# Formulas

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Data Model

---

## 1. Document Purpose

This document records the formula syntax for the two Formula Fields on the Lead Object in the Céleste Vineyards Lead Priority Level Automation system: `Region__c` and `Lead_Created__c`. Both fields resolve at read time from standard fields. Neither is written by Make.com, the Flow, or the Assignment Rule under any circumstances.

Field definitions — labels, types, descriptions, and help text — are in `docs/03-data-model/field-dictionary.md`. Field inventory and write authority are in `docs/03-data-model/field-inventory.md`.

---

## 2. `Region__c` — Region

### 2.1 Field Identity

| Attribute | Value |
|---|---|
| API Name | `Region__c` |
| Label | Region |
| Type | Formula (Text) |
| Reads From | `State` (State/Province standard field) |
| Written By | Formula — self-resolving at read time |

### 2.2 Formula Syntax

```
CASE(
  State,
  "Alabama",              "East Coast",
  "Connecticut",          "East Coast",
  "Delaware",             "East Coast",
  "District of Columbia", "East Coast",
  "Florida",              "East Coast",
  "Georgia",              "East Coast",
  "Maine",                "East Coast",
  "Maryland",             "East Coast",
  "Massachusetts",        "East Coast",
  "New Hampshire",        "East Coast",
  "New Jersey",           "East Coast",
  "New York",             "East Coast",
  "North Carolina",       "East Coast",
  "Pennsylvania",         "East Coast",
  "Rhode Island",         "East Coast",
  "South Carolina",       "East Coast",
  "Tennessee",            "East Coast",
  "Vermont",              "East Coast",
  "Virginia",             "East Coast",
  "West Virginia",        "East Coast",
  "Alaska",               "West Coast",
  "Arizona",              "West Coast",
  "California",           "West Coast",
  "Colorado",             "West Coast",
  "Hawaii",               "West Coast",
  "Idaho",                "West Coast",
  "Montana",              "West Coast",
  "Nevada",               "West Coast",
  "New Mexico",           "West Coast",
  "Oregon",               "West Coast",
  "Utah",                 "West Coast",
  "Washington",           "West Coast",
  "Wyoming",              "West Coast",
  "Arkansas",             "Central",
  "Illinois",             "Central",
  "Indiana",              "Central",
  "Iowa",                 "Central",
  "Kansas",               "Central",
  "Kentucky",             "Central",
  "Louisiana",            "Central",
  "Michigan",             "Central",
  "Minnesota",            "Central",
  "Mississippi",          "Central",
  "Missouri",             "Central",
  "Nebraska",             "Central",
  "North Dakota",         "Central",
  "Ohio",                 "Central",
  "Oklahoma",             "Central",
  "South Dakota",         "Central",
  "Texas",                "Central",
  "Wisconsin",            "Central",
  ""
)
```

### 2.3 Formula Behavior

| Attribute | Value |
|---|---|
| Input | `State` field value on the Lead Record |
| East Coast return | `"East Coast"` — 20 states including District of Columbia |
| West Coast return | `"West Coast"` — 13 states |
| Central return | `"Central"` — 18 states |
| Default return | Empty string — fires when `State` is null or unrecognized |
| State coverage | All 50 US states and the District of Columbia |

The default empty-string return does not fire under normal pipeline conditions. Every Lead Record created through this pipeline carries a `State` value sourced from the Wix form payload via Make.com `SF_Make_Lead_To_Salesforce`. Null or unrecognized state values are a fault-path condition only.

The Flow escalation override does not affect `Region__c`. When `OwnerId` is overridden with Sophia Delgado's User ID for Priority Level `High` Leads, `Region__c` retains the correct territorial value for the originating state. Regional classification is preserved for reporting and pipeline visibility regardless of record ownership.

---

## 3. `Lead_Created__c` — Lead Created

### 3.1 Field Identity

| Attribute | Value |
|---|---|
| API Name | `Lead_Created__c` |
| Label | Lead Created |
| Type | Formula (Date) |
| Reads From | `CreatedDate` (standard system field) |
| Written By | Formula — self-resolving at read time |

### 3.2 Formula Syntax

```
DATEVALUE(CreatedDate)
```

### 3.3 Formula Behavior

| Attribute | Value |
|---|---|
| Input | `CreatedDate` datetime field — set by Salesforce at Record creation |
| Output | Date value — time component stripped |
| Purpose | Date-only creation timestamp for display and reporting |

`CreatedDate` is a system-managed datetime field set at the moment the Lead Record is created by Make.com via the Salesforce REST API. `DATEVALUE()` extracts the date portion in the running user's time zone.

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Data Model |
| File Path | `metadata/formulas/formulas.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
