# Lead Custom Fields — Metadata Reference

**Project:** Céleste Vineyards: Sales Cloud Pipeline
**Phase:** 1 — Lead Priority Level Automation
**Object:** Lead
**Org Alias:** `celeste-dev`
**API Version:** 66.0
**Source Path:** `force-app/main/default/objects/Lead/fields/`

All field metadata confirmed by retrieve from `celeste-dev`. Values are as-retrieved from XML.

---

## Field Summary (10 Custom Fields)

| API Name | Label | Type | XML File |
|---|---|---|---|
| `Business_Type__c` | Business Type | Picklist | `Business_Type__c.field-meta.xml` |
| `Role__c` | Role | Picklist | `Role__c.field-meta.xml` |
| `Purchasing_Timeline__c` | Purchasing Timeline | Picklist | `Purchasing_Timeline__c.field-meta.xml` |
| `Customer_Note__c` | Customer Note | Text Area (255) | `Customer_Note__c.field-meta.xml` |
| `Priority_Level__c` | Priority Level | Picklist (Restricted) | `Priority_Level__c.field-meta.xml` |
| `Qualified__c` | Qualified | Checkbox | `Qualified__c.field-meta.xml` |
| `Lead_Score__c` | Lead Score | Number | `Lead_Score__c.field-meta.xml` |
| `Region__c` | Region | Formula (Text) | `Region__c.field-meta.xml` |
| `Qualification_Status__c` | Qualification Status | Formula (Text) | `Qualification_Status__c.field-meta.xml` |
| `Lead_Created__c` | Lead Created | Formula (Date) | `Lead_Created__c.field-meta.xml` |

---

## Picklist Field Values

### `Business_Type__c`
- Specialty Gourmet Grocer
- Upscale Restaurant
- High-End Wine Store
- Catering & Event Company
- Premium Wine Distributor
- Personal/Individual (Non-Business)

### `Role__c`
- Owner
- Purchasing Manager
- General Manager
- Sales Manager
- Event Coordinator

### `Purchasing_Timeline__c`
- Immediate Need (Contracting)
- Short-Term (Within 30 Days)
- Evaluating Vendors (Next 90 Days)
- Budget Planning (Future Quarter)
- Information Gathering
- Not Applicable

### `Priority_Level__c` (Restricted Picklist)
- High
- Medium
- Low
- Disqualified
- Not Applicable

---

## Single-DML Write Pattern

The Flow `Lead_Scoring_and_Priority_Level_Assignment` writes exactly **4 fields** in a single Update Records element. No other flow elements perform DML on Lead.

| Field | Written Value |
|---|---|
| `OwnerId` | Assigned queue (regional or escalation) |
| `Priority_Level__c` | High / Medium / Low |
| `Qualified__c` | True (default) or False (disqualified) |
| `Lead_Score__c` | Calculated numeric score (varTotalScore) |

---

## Metadata Health Check

| API Name | `<description>` | `<inlineHelpText>` | Status |
|---|---|---|---|
| `Business_Type__c` | ✅ | ✅ | Complete |
| `Role__c` | ✅ | ✅ | Complete |
| `Purchasing_Timeline__c` | ✅ | ✅ | Complete |
| `Customer_Note__c` | ✅ | ✅ | Complete |
| `Priority_Level__c` | ✅ | ✅ | Complete |
| `Qualified__c` | ✅ | ✅ | Complete |
| `Lead_Score__c` | ✅ | ✅ | Complete |
| `Region__c` | ✅ | ✅ | Complete |
| `Qualification_Status__c` | ✅ | ✅ | Complete |
| `Lead_Created__c` | ✅ | ✅ | Complete |

---

## Artifact Note

A field named `Lead_Created_c__c` exists in local source (`Lead_Created_c__c.field-meta.xml`) with only a label and no description or help text. This is **not** one of the 10 confirmed Phase 1 custom fields. Confirm and delete if stale.
