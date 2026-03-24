# Territorial Routing Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Phase 3 — Routing, Escalation, and Ownership

---

## 1. Document Purpose

This document defines the territorial routing logic applied in the Céleste Vineyards Lead Priority Level Automation system. It covers how the Lead Assignment Rule evaluates each incoming Lead Record, how the three regional Queues are structured, and how territorial routing interacts with the Flow escalation logic for High priority Leads.

Territorial routing is the final stage of the automation pipeline. It executes after the Flow completes and determines which regional Queue owns the Lead Record based on the `State/Province` Field value.

---

## 2. Routing Architecture

Territorial routing is implemented using a single Salesforce Lead Assignment Rule containing three rule entries. Each entry evaluates the `State/Province` Field and assigns the Lead to the corresponding regional Queue.

The Assignment Rule fires on Lead creation. It evaluates before the Flow executes — the regional Queue OwnerId is written to the Record first, and the Flow then either retains or overrides that value depending on the Priority Level.

```
Lead Record Created
        |
Assignment Rule Evaluates State/Province
        |
   _____|_______________________________
  |             |                       |
Rule 1        Rule 2                  Rule 3
East Coast    West Coast              Central
Inava         jchen                   pdesa
(East_Coast_  (West_Coast_            (Central_
Region)       Region)                 Region)
        |
After-Save Flow Fires
        |
   [If Priority Level = High]
        |
   Flow overrides OwnerId → Sophia Delgado
   Region__c retains correct territorial value
        |
   [If Priority Level = Medium or Low]
        |
   Regional Queue OwnerId retained as-is
```

---

## 3. Assignment Rule Configuration

| Attribute | Value |
|---|---|
| Rule Name | Lead Assignment Rule |
| Object | Lead |
| Active | Yes |
| Rule Entries | 3 |
| Evaluation Field | `State/Province` |

---

## 4. Rule Entry Definitions

### 4.1 Rule 1 — East Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 1 |
| Queue Label | Inava |
| Queue API Name | `East_Coast_Region` |
| Condition | `State/Province` equals one of the East Coast state values |

**States Covered:**

Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### 4.2 Rule 2 — West Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 2 |
| Queue Label | jchen |
| Queue API Name | `West_Coast_Region` |
| Condition | `State/Province` equals one of the West Coast state values |

**States Covered:**

Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### 4.3 Rule 3 — Central Region

| Attribute | Value |
|---|---|
| Rule Order | 3 |
| Queue Label | pdesa |
| Queue API Name | `Central_Region` |
| Condition | `State/Province` equals one of the Central state values |

**States Covered:**

Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 5. State Coverage

All 50 US states and the District of Columbia are covered across the three rule entries. No state is unassigned.

| State | Region | Queue |
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

## 6. Routing Behavior by Priority Level

Territorial routing fires on every Lead Record regardless of Priority Level or qualification status. The Assignment Rule evaluates `State/Province` only. The interaction between routing and Priority Level is managed by the Flow, not the Assignment Rule.

| Priority Level | Assignment Rule Fires | Queue Assigned | Flow Override | Final Owner |
|---|---|---|---|---|
| High | Yes | Regional Queue (by state) | Yes — Sophia Delgado | Sophia Delgado |
| Medium | Yes | Regional Queue (by state) | No | Regional Queue |
| Low | Yes | Regional Queue (by state) | No | Regional Queue |
| Not Applicable (Disqualified) | Yes | Regional Queue (by state) | No | Regional Queue |

Disqualified Leads are routed to the correct regional Queue by the Assignment Rule even though no scoring or priority assignment occurred. The `Region__c` Field is populated correctly on all Records regardless of qualification status.

---

## 7. Region__c Field

The `Region__c` Field stores the regional classification of each Lead Record. It is written by the Assignment Rule and is not modified by the Flow under any circumstances — including High priority escalation.

Sophia Delgado owns a High priority Lead Record, but `Region__c` correctly reflects the Lead's territory. Regional classification is preserved for pipeline reporting and visibility regardless of Record ownership.

---

## 8. Developer Edition Org Context

The Queue labels in this org — Inava, jchen, pdesa — are proof-of-concept placeholders representing regional sales representatives. In a production deployment each Queue would contain provisioned named users. The Assignment Rule logic, state-to-territory mappings, and Queue API names are production-equivalent and require no modification for deployment to a production org.

---

## 9. Live Validation

Three live Lead Records confirm territorial routing executed correctly across all three regions and all routing paths.

| Lead | State | Region | Queue Assigned | Priority Level | Final Owner |
|---|---|---|---|---|---|
| Richard Miranda | Connecticut | East Coast | East_Coast_Region (Inava) | Low | Inava |
| Dylan Moss | Louisiana | Central | Central_Region (pdesa) | Not Applicable | pdesa |
| Neil Thompson | Alaska | West Coast | West_Coast_Region (jchen) | High | Sophia Delgado (escalation override) |

---

## 10. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| Phase | 3 — Routing, Escalation, and Ownership |
| File Path | docs/04-automation-logic/territorial-routing-logic.md |
| Date Produced | 2026-03-22 |
| Next Document | docs/02-architecture/routing-architecture.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
