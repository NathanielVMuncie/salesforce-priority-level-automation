# Queue Definitions

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document defines the three regional Queues used in the Céleste Vineyards Lead Priority Level Automation system. It records each Queue's identity, supported object, membership, territorial scope, and role in the routing pipeline.

---

## 2. Queue Architecture Overview

Three Queues represent the regional sales territories for Céleste Vineyards. The Lead Assignment Rule assigns incoming Lead Records to the correct Queue based on the `State/Province` Field. The After-Save Flow retains the Queue OwnerId for Medium and Low priority Leads and overrides it with Sophia Delgado's User ID for High priority Leads.

Queues do not evaluate Priority Level. Queue assignment is purely territorial.

---

## 3. Queue Definitions

### East_Coast_Region

| Attribute | Value |
|---|---|
| Queue Label | Inava |
| Queue API Name | `East_Coast_Region` |
| Supported Object | Lead |
| Territorial Scope | East Coast — 21 states including DC |
| Assigned By | Lead Assignment Rule — Rule Entry 1 |
| Flow Override | No — retained for Medium and Low priority Leads |

**Territory:**
Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### West_Coast_Region

| Attribute | Value |
|---|---|
| Queue Label | jchen |
| Queue API Name | `West_Coast_Region` |
| Supported Object | Lead |
| Territorial Scope | West Coast — 13 states |
| Assigned By | Lead Assignment Rule — Rule Entry 2 |
| Flow Override | No — retained for Medium and Low priority Leads. Overridden for High priority — Sophia Delgado assigned as owner. |

**Territory:**
Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### Central_Region

| Attribute | Value |
|---|---|
| Queue Label | pdesa |
| Queue API Name | `Central_Region` |
| Supported Object | Lead |
| Territorial Scope | Central — 18 states |
| Assigned By | Lead Assignment Rule — Rule Entry 3 |
| Flow Override | No — retained for Medium and Low priority Leads |

**Territory:**
Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 4. Queue Summary

| Queue Label | Queue API Name | States | Rule Entry |
|---|---|---|---|
| Inava | `East_Coast_Region` | 21 (including DC) | 1 |
| jchen | `West_Coast_Region` | 13 | 2 |
| pdesa | `Central_Region` | 18 | 3 |
| **Total** | | **52** | |

---

## 5. Ownership Outcomes by Queue

| Queue | Priority Level | Flow Override | Final Owner |
|---|---|---|---|
| `East_Coast_Region` | High | Yes | Sophia Delgado |
| `East_Coast_Region` | Medium / Low / Disqualified | No | Inava |
| `West_Coast_Region` | High | Yes | Sophia Delgado |
| `West_Coast_Region` | Medium / Low / Disqualified | No | jchen |
| `Central_Region` | High | Yes | Sophia Delgado |
| `Central_Region` | Medium / Low / Disqualified | No | pdesa |

---

## 6. DevOrg Constraint

Queue labels in this org — Inava, jchen, pdesa — are proof-of-concept placeholders representing regional sales representatives. The single Standard User license is assigned to Sophia Delgado. In a production deployment each Queue would contain provisioned named users and the escalation target would be confirmed against the active org user list. Queue API names and territorial scope require no modification for production deployment.

---

## 7. Live Validation

| Lead | Queue Assigned | Priority Level | Final Owner |
|---|---|---|---|
| Richard Miranda | `East_Coast_Region` (Inava) | Low | Inava |
| Dylan Moss | `Central_Region` (pdesa) | Not Applicable | pdesa |
| Neil Thompson | `West_Coast_Region` (jchen) | High | Sophia Delgado |

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Routing, Escalation, and Ownership |
| File Path | `metadata/queues/queue-definitions.md` |
| Date Produced | TBD |

---

*Salesforce Case Study: Lead - Priority Level Automation / Built by Nathaniel V. Muncie*