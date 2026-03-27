# Lead Assignment Rules

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Metadata — Assignment Rules

---

## 1. Document Purpose

This document provides the complete metadata reference for the Salesforce Lead Assignment Rule configured in the Céleste Vineyards Lead Priority Level Automation system. It records the rule identity, all three rule entries, their conditions, and their assigned Queue targets — in a format suitable for administrative reference, audit, and production deployment.

Logic-level documentation is in `docs/04-automation-logic/territorial-routing-logic.md`. Architecture-level documentation is in `docs/02-architecture/routing-architecture.md`. This document is the metadata record only.

---

## 2. Assignment Rule Identity

| Attribute | Value |
|---|---|
| Object | Lead |
| Rule Name | Lead Assignment Rule |
| Status | Active |
| Total Rule Entries | 3 |
| Evaluation Field | `State/Province` (`State`) |
| Covers | All 50 US states and the District of Columbia |

---

## 3. Rule Entry 1 — East Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 1 |
| Assigned Queue Label | Inava |
| Assigned Queue API Name | `East_Coast_Region` |
| Condition Field | `State/Province` |
| Condition Operator | Equals |

**States Covered (21):**

| State | Abbreviation |
|---|---|
| Alabama | AL |
| Connecticut | CT |
| Delaware | DE |
| District of Columbia | DC |
| Florida | FL |
| Georgia | GA |
| Maine | ME |
| Maryland | MD |
| Massachusetts | MA |
| New Hampshire | NH |
| New Jersey | NJ |
| New York | NY |
| North Carolina | NC |
| Pennsylvania | PA |
| Rhode Island | RI |
| South Carolina | SC |
| Tennessee | TN |
| Vermont | VT |
| Virginia | VA |
| West Virginia | WV |

---

## 4. Rule Entry 2 — West Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 2 |
| Assigned Queue Label | jchen |
| Assigned Queue API Name | `West_Coast_Region` |
| Condition Field | `State/Province` |
| Condition Operator | Equals |

**States Covered (13):**

| State | Abbreviation |
|---|---|
| Alaska | AK |
| Arizona | AZ |
| California | CA |
| Colorado | CO |
| Hawaii | HI |
| Idaho | ID |
| Montana | MT |
| Nevada | NV |
| New Mexico | NM |
| Oregon | OR |
| Utah | UT |
| Washington | WA |
| Wyoming | WY |

---

## 5. Rule Entry 3 — Central Region

| Attribute | Value |
|---|---|
| Rule Order | 3 |
| Assigned Queue Label | pdesa |
| Assigned Queue API Name | `Central_Region` |
| Condition Field | `State/Province` |
| Condition Operator | Equals |

**States Covered (18):**

| State | Abbreviation |
|---|---|
| Arkansas | AR |
| Illinois | IL |
| Indiana | IN |
| Iowa | IA |
| Kansas | KS |
| Kentucky | KY |
| Louisiana | LA |
| Michigan | MI |
| Minnesota | MN |
| Mississippi | MS |
| Missouri | MO |
| Nebraska | NE |
| North Dakota | ND |
| Ohio | OH |
| Oklahoma | OK |
| South Dakota | SD |
| Texas | TX |
| Wisconsin | WI |

---

## 6. Complete State-to-Queue Reference

| State | Region | Queue API Name |
|---|---|---|
| Alabama | East Coast | East_Coast_Region |
| Alaska | West Coast | West_Coast_Region |
| Arizona | West Coast | West_Coast_Region |
| Arkansas | Central | Central_Region |
| California | West Coast | West_Coast_Region |
| Colorado | West Coast | West_Coast_Region |
| Connecticut | East Coast | East_Coast_Region |
| Delaware | East Coast | East_Coast_Region |
| District of Columbia | East Coast | East_Coast_Region |
| Florida | East Coast | East_Coast_Region |
| Georgia | East Coast | East_Coast_Region |
| Hawaii | West Coast | West_Coast_Region |
| Idaho | West Coast | West_Coast_Region |
| Illinois | Central | Central_Region |
| Indiana | Central | Central_Region |
| Iowa | Central | Central_Region |
| Kansas | Central | Central_Region |
| Kentucky | Central | Central_Region |
| Louisiana | Central | Central_Region |
| Maine | East Coast | East_Coast_Region |
| Maryland | East Coast | East_Coast_Region |
| Massachusetts | East Coast | East_Coast_Region |
| Michigan | Central | Central_Region |
| Minnesota | Central | Central_Region |
| Mississippi | Central | Central_Region |
| Missouri | Central | Central_Region |
| Montana | West Coast | West_Coast_Region |
| Nebraska | Central | Central_Region |
| Nevada | West Coast | West_Coast_Region |
| New Hampshire | East Coast | East_Coast_Region |
| New Jersey | East Coast | East_Coast_Region |
| New Mexico | West Coast | West_Coast_Region |
| New York | East Coast | East_Coast_Region |
| North Carolina | East Coast | East_Coast_Region |
| North Dakota | Central | Central_Region |
| Ohio | Central | Central_Region |
| Oklahoma | Central | Central_Region |
| Oregon | West Coast | West_Coast_Region |
| Pennsylvania | East Coast | East_Coast_Region |
| Rhode Island | East Coast | East_Coast_Region |
| South Carolina | East Coast | East_Coast_Region |
| South Dakota | Central | Central_Region |
| Tennessee | East Coast | East_Coast_Region |
| Texas | Central | Central_Region |
| Utah | West Coast | West_Coast_Region |
| Vermont | East Coast | East_Coast_Region |
| Virginia | East Coast | East_Coast_Region |
| Washington | West Coast | West_Coast_Region |
| West Virginia | East Coast | East_Coast_Region |
| Wisconsin | Central | Central_Region |
| Wyoming | West Coast | West_Coast_Region |

---

## 7. Coverage Verification

| Region | States Assigned | Rule Entry |
|---|---|---|
| East Coast | 20 (including DC) | Rule 1 |
| West Coast | 13 | Rule 2 |
| Central | 18 | Rule 3 |
| **Total** | **51** | |

All 50 US states and the District of Columbia are assigned. No state is unassigned or duplicated across rule entries.

---

## 8. Routing Behavior Notes

The Assignment Rule fires on Lead Record creation and evaluates before the After-Save Flow executes. The regional Queue OwnerId is written to the Lead Record first. The Flow then either retains that value (Medium and Low priority) or overrides it with the National Sales Director's User ID (High priority escalation). The `Region__c` Field is populated by the Assignment Rule and is never modified by the Flow — territorial classification is preserved regardless of final ownership.

For full behavioral documentation, see:
- `docs/04-automation-logic/territorial-routing-logic.md`
- `docs/02-architecture/routing-architecture.md`

---

## 9. Developer Edition Org Context

Queue labels in this org — Inava, jchen, pdesa — are proof-of-concept placeholders. In a production deployment, each Queue would contain provisioned named users. All state-to-territory mappings and Queue API names are production-equivalent and require no structural modification for deployment.

---

## 10. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 3 — Routing, Escalation, and Ownership |
| File Path | `metadata/assignment-rules/lead-assignment-rules.md` |
| Date Produced | 2026-03-26 |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
