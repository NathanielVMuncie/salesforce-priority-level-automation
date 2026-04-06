# Lead Custom Field Inventory — Phase 1

**Project:** Céleste Vineyards: Sales Cloud Pipeline
**Phase:** 1 — Lead Priority Level Automation
**Object:** Lead
**Total Custom Fields:** 10

---

## Field Inventory

| API Name | Label | Type | Written By | Description / Help Text |
|---|---|---|---|---|
| `Business_Type__c` | Business Type | Picklist | Make.com | ✅ Both |
| `Role__c` | Role | Picklist | Make.com | ✅ Both |
| `Purchasing_Timeline__c` | Purchasing Timeline | Picklist | Make.com | ✅ Both |
| `Customer_Note__c` | Customer Note | Text Area (255) | Make.com | ✅ Both |
| `Priority_Level__c` | Priority Level | Picklist (Restricted) | Flow | ✅ Both |
| `Qualified__c` | Qualified | Checkbox (default: True) | Flow | ✅ Both |
| `Lead_Score__c` | Lead Score | Number | Flow | ⚠️ Description only — Help Text missing |
| `Region__c` | Region | Formula (Text) | Formula | ✅ Both |
| `Qualification_Status__c` | Qualification Status | Formula (Text) | Formula | ✅ Both |
| `Lead_Created__c` | Lead Created | Formula (Date) | Formula | ✅ Both |

---

## Coverage Summary

| Category | Count |
|---|---|
| Fields with Description + Help Text | 9 of 10 |
| Fields missing Help Text | 1 (`Lead_Score__c`) |
| Fields missing Description | 0 |

---

## Write Authority

| Written By | Fields |
|---|---|
| Make.com | `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Customer_Note__c` |
| Flow | `Priority_Level__c`, `Qualified__c`, `Lead_Score__c` |
| Formula | `Region__c`, `Qualification_Status__c`, `Lead_Created__c` |

---

## Notes

- `Lead_Score__c` — Help Text (`<inlineHelpText>`) is absent from local XML. Description is present. Do not fabricate — update in org and re-retrieve to resolve.
- `Lead_Created_c__c` — A duplicate-named artifact exists in local source with no description or help text. This is not one of the 10 confirmed fields. Review and delete if confirmed stale.
