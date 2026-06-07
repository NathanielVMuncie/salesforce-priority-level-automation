# Queue Definitions

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the three regional Queues used in the Céleste Vineyards Lead Priority Level Automation system. It records the confirmed Queue Label, API Name, territory, and design-intent owner for each Queue, and establishes the Queue's role within the broader routing architecture.

Queue Labels confirmed from live org screenshot captured 2026-05-29.

---

## 2. Queue Summary

| Queue Label | API Name | Territory | Design-Intent Owner |
|---|---|---|---|
| `East Coast Region` | `East_Coast_Region` | East Coast | Luis Navarro |
| `West Coast Region` | `West_Coast_Region` | West Coast | Jordan Chen |
| `Central Region` | `Central_Region` | Central | Priya Desai |

---

## 3. Queue Definitions

### 3.1 East Coast Region

| Attribute | Value |
|---|---|
| Queue Label | `East Coast Region` |
| Queue API Name | `East_Coast_Region` |
| Territory | East Coast |
| Design-Intent Owner | Luis Navarro |

**States Covered:**

Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### 3.2 West Coast Region

| Attribute | Value |
|---|---|
| Queue Label | `West Coast Region` |
| Queue API Name | `West_Coast_Region` |
| Territory | West Coast |
| Design-Intent Owner | Jordan Chen |

**States Covered:**

Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### 3.3 Central Region

| Attribute | Value |
|---|---|
| Queue Label | `Central Region` |
| Queue API Name | `Central_Region` |
| Territory | Central |
| Design-Intent Owner | Priya Desai |

**States Covered:**

Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 4. Queue Role in the System

Each regional Queue serves two distinct roles within the DevOrg environment.

**License-gap proxy.** The Developer Edition org supports one active Standard User license at a time. When a territory's design-intent owner does not hold the active license, the Assignment Rule assigns the Lead Record to that territory's Queue as a proxy. The Queue holds ownership until the license rotates to the correct representative.

**Fault-path catch-all.** If no Assignment Rule entry matches a Lead's `State/Province` value — for example, a null or unrecognized state — the Lead is assigned to the default Queue. This ensures no Lead Record is left without an owner.

Queues are not the design-intent routing target for any Lead. Named Sales Representatives are the intended owners for Priority Level Medium and Low Leads. In a production org, all three representatives hold provisioned licenses simultaneously and the Queues are not required as proxies.

| Queue | Primary Role in DevOrg | Primary Role in Production |
|---|---|---|
| `East Coast Region` | License proxy for Luis Navarro | Fault-path catch-all only |
| `West Coast Region` | License proxy for Jordan Chen | Fault-path catch-all only |
| `Central Region` | License proxy for Priya Desai | Fault-path catch-all only |

---

## 5. Escalation and Queue Interaction

Priority Level High Leads are not routed to a Queue under any license configuration. The Flow escalation segment overrides `OwnerId` with Sophia Delgado's User ID regardless of which Queue the Assignment Rule assigned at Record creation. Sophia Delgado's escalation path is independent of the license-cycling constraint.

| Priority Level | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|
| `High` | Regional Queue or named representative | Yes — Sophia Delgado | Sophia Delgado |
| `Medium` | Named representative (if licensed) | No | Named representative |
| `Medium` | Regional Queue (if not licensed) | No | Regional Queue |
| `Low` | Named representative (if licensed) | No | Named representative |
| `Low` | Regional Queue (if not licensed) | No | Regional Queue |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/queue-definitions.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
