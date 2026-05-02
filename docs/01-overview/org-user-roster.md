# Org User Roster

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document is the authoritative reference for all users, roles, titles, profiles, licenses, and Queue assignments active in the Céleste Vineyards Salesforce Developer Edition org. All documentation, Flow architecture decisions, and routing logic in this repository must reference this document for user and role details.

---

## 2. User Roster

| Full Name | Alias | Username | Title | Role | Profile | Assigned Queue |
|---|---|---|---|---|---|---|
| Navarro, Luis | `lnava` | luis.navarro@celestevineyards.com | Sales Representative | Sales Representative, East Coast Region | Sales Representative | `East_Coast_Region` |
| Chen, Jordan | `jchen` | jordan.chen@celestevineyards.com | Sales Representative | Sales Representative, West Coast Region | Sales Representative | `West_Coast_Region` |
| Desai, Priya | `pdesa` | priya.desai@celestevineyards.com | Sales Representative | Sales Representative, Central Region | Sales Representative | `Central_Region` |
| Delgado, Sophia | `sdelg` | sophia.delgado@celestevineyards.com | National Sales Director | National Sales Director | National Sales Director | — |
| Muncie, Nathaniel V. | `nmunc` | nathaniel.muncie@celestevineyards.com | System Administrator | System Administrator | System Administrator | — |

---

## 3. License Model

| License Type | Assigned To |
|---|---|
| Salesforce (Standard) | Rotates among Luis Navarro, Jordan Chen, Priya Desai, Sophia Delgado |
| Salesforce Platform User | Rotates among Luis Navarro, Jordan Chen, Priya Desai, Sophia Delgado |
| System Administrator | Nathaniel V. Muncie — permanent |

The Developer Edition org supports one active Standard User license. The Salesforce and Salesforce Platform User licenses cycle among the four sales users for demonstration and validation purposes. This is a DevOrg constraint — not a production configuration.

---

## 4. Queue Assignments

| Queue Label | Queue API Name | Assigned User | Territory |
|---|---|---|---|
| East Coast Region | `East_Coast_Region` | Luis Navarro (`lnava`) | East Coast |
| West Coast Region | `West_Coast_Region` | Jordan Chen (`jchen`) | West Coast |
| Central Region | `Central_Region` | Priya Desai (`pdesa`) | Central |

Sophia Delgado holds no Queue assignment. She receives Priority Level High Lead Records via Flow escalation override — `OwnerId` is written directly to her User ID by the `Escalate OwnerId to Sophia` Assignment element in the `Lead_Scoring_and_Priority_Level_Assignment` Flow.

---

## 5. Queue Routing Behavior

Each Sales Representative tends to their assigned regional Queue. When a Lead hits a Queue Routing path due to a data mismatch or unmatched value in the Flow, it lands in the correct territorial Queue with no Priority Level assigned. The Sales Representative responsible for that region tends to their Queue, manually identifies the issue, corrects it, and manually services the Lead.

| Queue Routing Path | Destination Queue |
|---|---|
| `Queue Routing` — Tier 1 Default | Territorial Queue (`East_Coast_Region`, `West_Coast_Region`, or `Central_Region`) |
| `Queue Routing 1` — Tier 2 Default | Territorial Queue (`East_Coast_Region`, `West_Coast_Region`, or `Central_Region`) |
| `Queue Routing 2` — Tier 3 Default | Territorial Queue (`East_Coast_Region`, `West_Coast_Region`, or `Central_Region`) |

---

## 6. Escalation Target

| Role | User | Escalation Mechanism |
|---|---|---|
| National Sales Director | Sophia Delgado (`sdelg`) | Flow — `Escalate OwnerId to Sophia` Assignment element |

All `Priority_Level__c` = `High` Lead Records are routed to Sophia Delgado via Flow escalation logic. `OwnerId` is overridden from the regional Queue to Sophia Delgado's User ID by the `Lead_Scoring_and_Priority_Level_Assignment` Flow.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/org-user-roster.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
