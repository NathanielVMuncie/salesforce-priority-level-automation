# Lead Assignment Rules

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document defines the Lead Assignment Rule configuration in the Céleste Vineyards Lead Priority Level Automation system. It records the rule structure, each rule entry's criteria and Queue target, the complete state-to-territory mapping, and the interaction between the Assignment Rule and the After-Save Flow.

---

## 2. Assignment Rule Identity

| Attribute | Value |
|---|---|
| Rule Name | Lead Assignment Rule |
| Object | Lead |
| Active | Yes |
| Evaluation Field | `State/Province` |
| Rule Entries | 3 |
| Fires On | Lead Record creation |

---

## 3. Execution Context

The Assignment Rule fires at Lead Record creation, before the After-Save Flow executes. At the point the Flow begins, the Lead Record is already owned by the correct regional Queue. The Flow then either retains or overrides that Queue OwnerId depending on Priority Level.

Lead Record Created (Make.com API)
|
Assignment Rule fires — evaluates State/Province
|
Regional Queue OwnerId written to Record
|
After-Save Flow fires
|
Flow retains Queue OwnerId (Medium / Low / Disqualified)
OR
Flow overrides OwnerId → Sophia Delgado (High)

The Assignment Rule has no awareness of Priority Level. Territory evaluation and priority evaluation are fully independent.

---

## 4. Rule Entry Definitions

### Rule Entry 1 — East Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 1 |
| Queue Label | Inava |
| Queue API Name | `East_Coast_Region` |
| Evaluation Field | `State/Province` |

**States Covered (21):**
Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### Rule Entry 2 — West Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 2 |
| Queue Label | jchen |
| Queue API Name | `West_Coast_Region` |
| Evaluation Field | `State/Province` |

**States Covered (13):**
Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### Rule Entry 3 — Central Region

| Attribute | Value |
|---|---|
| Rule Order | 3 |
| Queue Label | pdesa |
| Queue API Name | `Central_Region` |
| Evaluation Field | `State/Province` |

**States Covered (18):**
Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 5. Complete State-to-Territory Mapping

All 50 US states and the District of Columbia are assigned. No state is unassigned.

| State | Region | Queue API Name |
|---|---|---|
| Alabama | East Coast | `East_Coast_Region` |
| Alaska | West Coast | `West_Coast_Region` |
| Arizona | West Coast | `West_Coast_Region` |
| Arkansas | Central | `Central_Region` |
| California | West Coast | `West_Coast_Region` |
| Colorado | West Coast | `West_Coast_Region` |
| Connecticut | East Coast | `East_Coast_Region` |
| Delaware | East Coast | `East_Coast_Region` |
| District of Columbia | East Coast | `East_Coast_Region` |
| Florida | East Coast | `East_Coast_Region` |
| Georgia | East Coast | `East_Coast_Region` |
| Hawaii | West Coast | `West_Coast_Region` |
| Idaho | West Coast | `West_Coast_Region` |
| Illinois | Central | `Central_Region` |
| Indiana | Central | `Central_Region` |
| Iowa | Central | `Central_Region` |
| Kansas | Central | `Central_Region` |
| Kentucky | Central | `Central_Region` |
| Louisiana | Central | `Central_Region` |
| Maine | East Coast | `East_Coast_Region` |
| Maryland | East Coast | `East_Coast_Region` |
| Massachusetts | East Coast | `East_Coast_Region` |
| Michigan | Central | `Central_Region` |
| Minnesota | Central | `Central_Region` |
| Mississippi | Central | `Central_Region` |
| Missouri | Central | `Central_Region` |
| Montana | West Coast | `West_Coast_Region` |
| Nebraska | Central | `Central_Region` |
| Nevada | West Coast | `West_Coast_Region` |
| New Hampshire | East Coast | `East_Coast_Region` |
| New Jersey | East Coast | `East_Coast_Region` |
| New Mexico | West Coast | `West_Coast_Region` |
| New York | East Coast | `East_Coast_Region` |
| North Carolina | East Coast | `East_Coast_Region` |
| North Dakota | Central | `Central_Region` |
| Ohio | Central | `Central_Region` |
| Oklahoma | Central | `Central_Region` |
| Oregon | West Coast | `West_Coast_Region` |
| Pennsylvania | East Coast | `East_Coast_Region` |
| Rhode Island | East Coast | `East_Coast_Region` |
| South Carolina | East Coast | `East_Coast_Region` |
| South Dakota | Central | `Central_Region` |
| Tennessee | East Coast | `East_Coast_Region` |
| Texas | Central | `Central_Region` |
| Utah | West Coast | `West_Coast_Region` |
| Vermont | East Coast | `East_Coast_Region` |
| Virginia | East Coast | `East_Coast_Region` |
| Washington | West Coast | `West_Coast_Region` |
| West Virginia | East Coast | `East_Coast_Region` |
| Wisconsin | Central | `Central_Region` |
| Wyoming | West Coast | `West_Coast_Region` |

---

## 6. Routing Behavior by Priority Level

The Assignment Rule fires on every Lead Record regardless of qualification status or Priority Level. The interaction between territorial routing and Priority Level is managed entirely by the Flow.

| Priority Level | Assignment Rule Fires | Queue Assigned | Flow Override | Final Owner |
|---|---|---|---|---|
| High | Yes | Regional Queue (by state) | Yes — Sophia Delgado | Sophia Delgado |
| Medium | Yes | Regional Queue (by state) | No | Regional Queue |
| Low | Yes | Regional Queue (by state) | No | Regional Queue |
| Disqualified | Yes | Regional Queue (by state) | No | Regional Queue |

---

## 7. DevOrg Constraint

Queue labels in this org — Inava, jchen, pdesa — are proof-of-concept placeholders representing regional sales representatives. In a production deployment each Queue would contain provisioned named users. The Assignment Rule logic, state-to-territory mappings, and Queue API names require no modification for production deployment.

---

## 8. Live Validation

| Lead | State | Queue Assigned | Priority Level | Final Owner |
|---|---|---|---|---|
| Richard Miranda | Connecticut | `East_Coast_Region` (Inava) | Low | Inava |
| Dylan Moss | Louisiana | `Central_Region` (pdesa) | Not Applicable | pdesa |
| Neil Thompson | Alaska | `West_Coast_Region` (jchen) | High | Sophia Delgado (escalation override) |

---

## 9. Document Status

| Attribute | Value |
|---|---|
| Section | Routing, Escalation, and Ownership |
| File Path | `metadata/assignment-rules/lead-assignment-rules.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*