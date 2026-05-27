# Routing Architecture

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the routing architecture of the Céleste Vineyards Lead Priority Level Automation system. It establishes how the Lead Assignment Rule and the After-Save Flow escalation interact to produce final Lead ownership, how the DevOrg license-cycling constraint is managed within that architecture, and what the Queue layer is responsible for.

Routing occurs twice for every Lead Record that enters this pipeline.

**First routing — Assignment Rule.** Fires at the moment of Record creation, before the Flow executes. Evaluates `State/Province` and writes an initial `OwnerId` — either the named Sales Representative for that territory or their regional Queue. This routing applies to every Lead without exception.

**Second routing — Flow escalation.** Fires after the Assignment Rule completes, as part of the After-Save Flow. Evaluates `varPriorityLevel` and conditionally overrides the `OwnerId` written by the Assignment Rule. This routing applies only to Priority Level `High` Leads. Priority Level `Medium` and `Low` Leads retain the `OwnerId` written by the Assignment Rule unchanged.

Every Lead Record that enters Salesforce is a confirmed B2B submission — the Gatekeeper is enforced at the Wix form layer before any data is transmitted.

This document covers routing architecture. State-level territory coverage detail is in `docs/04-automation-logic/territorial-routing-logic.md`. Flow segment configuration is in `docs/02-architecture/automation-architecture.md`.

---

## 2. Routing Architecture Overview

Routing is implemented in two sequential events. The first routing event fires on every Lead. The second routing event fires conditionally — only when Priority Level is `High`.

**Routing Event 1 — Regional Territory Assignment Rule (`regional_territory_assignment`).** Fires at Record creation, before the Flow executes. Evaluates `State/Province` and writes an initial `OwnerId` — either the named Sales Representative for that territory or their regional Queue — depending on which representative holds the active license at that moment. This event establishes the baseline ownership for all Leads.

**Routing Event 2 — After-Save Flow escalation.** Fires after the Assignment Rule completes. Captures the `OwnerId` established by Routing Event 1 into `varOwnerID`, evaluates `varPriorityLevel`, and overrides `varOwnerID` with Sophia Delgado's User ID if Priority Level is `High`. If Priority Level is `Medium` or `Low`, the baseline `OwnerId` from Routing Event 1 is retained and committed unchanged.

```
Lead Record Created via Make.com
        |
        ▼
Regional Territory Assignment Rule Fires
Evaluates State/Province
        |
   _____|________________________________
  |              |                       |
Rule 1         Rule 2                  Rule 3
East Coast     West Coast              Central
Luis Navarro   Jordan Chen             Priya Desai
or             or                      or
East_Coast_    West_Coast_             Central_
Region Queue   Region Queue            Region Queue
        |
        ▼
OwnerId written to Lead Record
(named Sales Representative or regional Queue)
        |
        ▼
After-Save Flow Fires
Lead_Scoring_and_Priority_Level_Assignment
        |
        ▼
Scoring and Priority Assignment execute (Segments 1–2)
        |
        ▼
Escalation Segment executes (Segment 3)
        |
   _____|_______________________
  |                             |
Priority Level High         Priority Level Medium / Low
        |                             |
varOwnerID overridden           varOwnerID retained
Sophia Delgado User ID          Regional Sales Representative
                                or Queue OwnerId
        |
        ▼
Single DML Write — OwnerId committed
```

---

## 3. Assignment Rule Configuration

| Attribute | Value |
|---|---|
| Rule Label | Regional Territory Assignment |
| Rule API Name | `regional_territory_assignment` |
| Object | Lead |
| Active | Yes |
| Evaluation Field | `State/Province` |
| Rule Entries | 3 |

The Assignment Rule is named to reflect its design intent: regional territory determines ownership. Priority Level is not evaluated by the Assignment Rule — that concern belongs to the Flow.

---

## 4. Rule Entry Definitions

Each rule entry covers a fixed set of states. The state-to-territory mapping never changes regardless of which Sales Representative holds the active license. What changes is the "Assign To" target — either the named Sales Representative or their regional Queue.

| Order | Territory | Named Sales Representative | Queue | States Covered |
|---|---|---|---|---|
| 1 | East Coast | Luis Navarro | `East_Coast_Region` | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| 2 | West Coast | Jordan Chen | `West_Coast_Region` | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |
| 3 | Central | Priya Desai | `Central_Region` | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |

Full state-level coverage detail is in `docs/04-automation-logic/territorial-routing-logic.md`.

---

## 5. License-Cycling Mechanics

The Developer Edition org supports one active Salesforce Standard User license. Only one Sales Representative can hold direct Lead ownership via the Assignment Rule at any given time. This is a DevOrg constraint, not a design gap.

The Assignment Rule accommodates this constraint through a cycling pattern:

- The rule entry for the currently licensed Sales Representative assigns directly to that named user
- The rule entries for the two non-licensed Sales Representatives assign to their regional Queues as placeholders
- When the license moves to a different Sales Representative, the corresponding rule entry is updated to assign to that named user; the previously licensed representative's entry reverts to their Queue

**Example — Priya Desai holds the license:**

| Rule Entry | Territory | Assign To |
|---|---|---|
| Rule 1 | East Coast | `East_Coast_Region` Queue |
| Rule 2 | West Coast | `West_Coast_Region` Queue |
| Rule 3 | Central | Priya Desai |

**Example — Jordan Chen holds the license:**

| Rule Entry | Territory | Assign To |
|---|---|---|
| Rule 1 | East Coast | `East_Coast_Region` Queue |
| Rule 2 | West Coast | Jordan Chen |
| Rule 3 | Central | `Central_Region` Queue |

**Example — Luis Navarro holds the license:**

| Rule Entry | Territory | Assign To |
|---|---|---|
| Rule 1 | East Coast | Luis Navarro |
| Rule 2 | West Coast | `West_Coast_Region` Queue |
| Rule 3 | Central | `Central_Region` Queue |

In all configurations, only one rule entry assigns to a named user. State coverage does not change — Priya Desai always covers Central Region states, Jordan Chen always covers West Coast states, and Luis Navarro always covers East Coast states. Only the form of ownership (named user vs. Queue proxy) changes with the license.

---

## 6. Queue Role

Each regional Queue serves as a proxy owner for its territory when that territory's Sales Representative does not hold the active license. Queues are not the design-intent routing target — named Sales Representatives are. The Queue exists to satisfy the Assignment Rule's requirement for a valid "Assign To" target under the DevOrg license constraint.

| Queue | API Name | Territory | Design-Intent Owner |
|---|---|---|---|
| East Coast Region | `East_Coast_Region` | East Coast | Luis Navarro |
| West Coast Region | `West_Coast_Region` | West Coast | Jordan Chen |
| Central Region | `Central_Region` | Central | Priya Desai |

In a production org, all three Sales Representatives hold provisioned licenses simultaneously and the Queues are not required as proxies. The Assignment Rule logic and state-to-territory mappings require no modification for production deployment.

---

## 7. Flow Escalation Interaction

The Assignment Rule fires before the After-Save Flow executes. The `OwnerId` written by the Assignment Rule — either a named Sales Representative or a regional Queue — is the value present on the Record when the Flow begins.

The Flow's escalation segment (Segment 3) captures this `OwnerId` into `varOwnerID` via the `Initialize OwnerId (Default)` Assignment element. The `Escalate High Priority to Sophia` Decision then evaluates `varPriorityLevel`.

- If Priority Level is `High`: `varOwnerID` is overwritten with Sophia Delgado's User ID
- If Priority Level is `Medium` or `Low`: `varOwnerID` retains the value written by the Assignment Rule

The `Update Lead Priority and Score` Update Records element writes `varOwnerID` to `OwnerId` as the sole DML operation. This commit is what produces the final ownership state visible on the Lead Record.

Sophia Delgado's escalation assignment is not subject to the license-cycling constraint. Her User ID is written directly by the Flow, not by the Assignment Rule. She receives Priority Level `High` Leads correctly regardless of which Sales Representative currently holds the active license.

---

## 8. Final Ownership by Priority Level and License State

| Priority Level | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|
| `High` | Named Sales Representative or regional Queue | Yes — Sophia Delgado | Sophia Delgado |
| `Medium` | Named Sales Representative (if licensed) | No | Named Sales Representative |
| `Medium` | Regional Queue (if not licensed) | No | Regional Queue |
| `Low` | Named Sales Representative (if licensed) | No | Named Sales Representative |
| `Low` | Regional Queue (if not licensed) | No | Regional Queue |

Priority Level `High` ownership is license-state-independent. Sophia Delgado receives all Priority Level `High` Leads in all license configurations.

---

## 9. Live Validation

| Lead | State | Territory | Assignment Rule Output | Priority Level | Final Owner |
|---|---|---|---|---|---|
| L-01 — Marcus Thibodeau | Georgia | East Coast | Luis Navarro or `East_Coast_Region` | `High` | Sophia Delgado |
| L-02 — Renata Voss | Oregon | West Coast | Jordan Chen or `West_Coast_Region` | `High` | Sophia Delgado |
| L-03 — Dominic Reyes | Illinois | Central | Priya Desai or `Central_Region` | `Medium` | Priya Desai or `Central_Region` |
| L-04 — Janelle Harmon | Virginia | East Coast | Luis Navarro or `East_Coast_Region` | `Medium` | Luis Navarro or `East_Coast_Region` |
| L-05 — Britta Sandoval | Washington | West Coast | Jordan Chen or `West_Coast_Region` | `Low` | Jordan Chen or `West_Coast_Region` |

Assignment Rule output and final owner for Medium and Low Leads reflects the license state at the time of Record creation. Priority Level `High` final owner is Sophia Delgado in all license configurations.

---

## 10. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/routing-architecture.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
