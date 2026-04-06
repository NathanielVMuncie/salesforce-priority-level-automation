# Priority-Related Formula Fields — Phase 1

**Project:** Céleste Vineyards: Sales Cloud Pipeline
**Phase:** 1 — Lead Priority Level Automation
**Object:** Lead
**Org Alias:** `celeste-dev`

All formulas sourced directly from XML metadata retrieved from `celeste-dev`.

---

## Formula Fields (3)

### `Region__c` — Region

| Attribute | Value |
|---|---|
| API Name | `Region__c` |
| Label | Region |
| Return Type | Text |
| Blanks | BlankAsZero |
| Written By | Formula (read-only) |

**Purpose:**
Derives geographic territory from the Lead's `State` field. Output drives Lead Assignment Rules and queue routing to regional sales reps.

**Valid Outputs:** East Coast · West Coast · Central · International

**Formula:**
```
CASE(State,
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
  "International"
)
```

**Queue Routing (driven by Region__c output):**

| Region | Queue Alias | Rep |
|---|---|---|
| East Coast | Inava | East Coast rep |
| West Coast | jchen | Jordan Chen |
| Central | pdesa | Central rep |
| High Priority (any region) | sdelg | Sophia Delgado — National Sales Director |

---

### `Qualification_Status__c` — Qualification Status

| Attribute | Value |
|---|---|
| API Name | `Qualification_Status__c` |
| Label | Qualification Status |
| Return Type | Text |
| Blanks | BlankAsZero |
| Written By | Formula (read-only) |

**Purpose:**
Provides a visual qualification indicator on the Lead record based on the `Qualified__c` checkbox. Readable by sales users without needing to interpret the boolean.

**Formula:**
```
IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)
```

**Output Reference:**

| Qualified__c | Qualification_Status__c |
|---|---|
| True (checked) | ✅ Qualified |
| False (unchecked) | ❌ Not Qualified |

---

### `Lead_Created__c` — Lead Created

| Attribute | Value |
|---|---|
| API Name | `Lead_Created__c` |
| Label | Lead Created |
| Return Type | Date |
| Blanks | BlankAsZero |
| Written By | Formula (read-only) |

**Purpose:**
Strips the time component from the standard `CreatedDate` DateTime field. Used for date-based reporting and display without timestamp noise.

**Formula:**
```
DATEVALUE(CreatedDate)
```

**Notes:**
- Source field: standard `CreatedDate` (DateTime)
- Output: Date only — no time component
- Read-only — cannot be edited directly

---

## Terminology — Non-Negotiable

| Term | Exact Value |
|---|---|
| Regions | East Coast, West Coast, Central |
| Priority Levels | High, Medium, Low, Not Applicable |
| Escalation trigger | High Priority → sdelg (Sophia Delgado) |
