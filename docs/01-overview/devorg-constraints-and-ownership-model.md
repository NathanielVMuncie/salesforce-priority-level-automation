# DevOrg Constraints and Ownership Model

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document defines the platform constraints of the Salesforce Developer Edition org used to build and validate the Céleste Vineyards Lead Priority Level Automation system, and explains how the ownership model is structured within those constraints.

---

## 2. Developer Edition Org Constraints

This system is built in a Salesforce Developer Edition org. Two constraints specific to this environment are documented as scope acknowledgments, not scope failures. Neither constraint affects the functional fidelity of the automation logic, scoring model, routing architecture, or integration pipeline.

### 2.1 Single Active User License

The Developer Edition org supports one active Salesforce Standard User license. All automation logic, Flow execution, escalation routing, and Queue assignment operate identically to a production org. The single license constraint affects only which named regional representative can hold direct Lead ownership at any given time — not how the system routes or processes Leads.

### 2.2 No Production Sandbox

The Developer Edition org is the sole build and validation environment. All test Records, debug logs, and UAT evidence are produced in this environment. Sandbox migration procedures are not demonstrated. This does not affect the correctness or completeness of the automation logic documented in this repository.

---

## 2. Personnel

### 2.1 Escalation Target

| Name | Title | Alias | Role in System |
|---|---|---|---|
| Sophia Delgado | National Sales Director | `sdelg` | Escalation target for all Priority Level High Leads — receives OwnerId override via Flow |

Sophia Delgado is not region-designated. Her assignment is triggered exclusively by Priority Level, not territory.

### 2.2 Regional Sales Representatives

| Name | Alias | Region | Queue |
|---|---|---|---|
| Jordan Chen | `jchen` | West Coast Region | `West_Coast_Region` |
| Priya Desai | `pdesa` | Central Region | `Central_Region` |
| Luis Navarro | `lnava` | East Coast Region | `East_Coast_Region` |

Each representative is designated to a single region. Their corresponding Queue serves two purposes: a proxy owner when the representative does not hold the active license, and a fault-path catch-all for any Lead the Flow does not explicitly route to a named user.

---

## 3. Ownership Model

### 3.1 License Cycling

The single Standard User license is assigned to one named representative at a time. Whoever holds the license is the only individual who can appear as a named user on Lead Assignment Rule entries. The two representatives who do not hold the license at that time cannot receive direct Lead ownership — their regions are covered by their respective Queue as a proxy.

This is an operational characteristic of the Developer Edition environment, not a design limitation of the automation system. In a production org, all three representatives and Sophia Delgado would hold provisioned licenses simultaneously.

### 3.2 Sophia Delgado — License Exception

Sophia Delgado is exempt from the license-cycling constraint. Her escalation assignment is executed by the Flow `Lead_Scoring_and_Priority_Level_Assignment` via an OwnerId override — not by the Assignment Rule. This means she receives Priority Level High Leads correctly regardless of which representative currently holds the active license.

### 3.3 Ownership Outcomes by Configuration

The representative currently holding the license appears as a named user on Lead Records for their region. The two representatives without the license appear as their regional Queue. If Sophia Delgado holds the license, all three regional representatives are represented by their Queues.

**Example — Jordan Chen holds the license:**

| Lead | Priority Level | Region | Final Owner |
|---|---|---|---|
| Priority Level High — any region | High | Any | Sophia Delgado (`sdelg`) |
| Priority Level Medium or Low — West Coast Region | Medium / Low | West Coast Region | Jordan Chen (`jchen`) |
| Priority Level Medium or Low — Central Region | Medium / Low | Central Region | `Central_Region` Queue |
| Priority Level Medium or Low — East Coast Region | Medium / Low | East Coast Region | `East_Coast_Region` Queue |

**Example — Sophia Delgado holds the license:**

| Lead | Priority Level | Region | Final Owner |
|---|---|---|---|
| Priority Level High — any region | High | Any | Sophia Delgado (`sdelg`) |
| Priority Level Medium or Low — West Coast Region | Medium / Low | West Coast Region | `West_Coast_Region` Queue |
| Priority Level Medium or Low — Central Region | Medium / Low | Central Region | `Central_Region` Queue |
| Priority Level Medium or Low — East Coast Region | Medium / Low | East Coast Region | `East_Coast_Region` Queue |

### 3.4 Queue Dual Purpose

Each regional Queue serves two distinct roles:

- **License proxy** — owns Lead Records for a region when that region's representative does not hold the active license
- **Fault-path catch-all** — receives any Lead the Flow does not explicitly route to a named user, ensuring no Lead is left unowned

---

## 4. Production Equivalence

These constraints do not reduce the demonstrative value of this case study. The following components operate identically to a production org:

- Flow logic, scoring, and priority assignment
- Assignment Rule evaluation and Queue routing
- Escalation override via Flow Update Records element
- Make.com API ingestion and field mapping
- Formula field resolution for `Region__c`

In a production deployment, the single license constraint is removed, all four personnel hold provisioned licenses simultaneously, and Lead ownership reflects named users across all regions at all times.

---

## 5. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/devorg-constraints-and-ownership-model.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
