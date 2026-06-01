# Queue Definitions

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the three regional Queues active on the Lead Object in the Céleste Vineyards Lead Priority Level Automation system. It records each Queue's label, API name, territory, design-intent owner, and role within the pipeline.

Queues are not the primary routing target in this system. Named Sales Representatives are. Each Queue exists to satisfy two specific operational conditions: the DevOrg single-license constraint and the fault-path backstop requirement. In a production org, all three representatives hold provisioned licenses simultaneously and Queues are not required as proxies.

---

## 2. Queue Role in the System

Each regional Queue serves two distinct roles.

**License proxy.** The Developer Edition org supports one active Salesforce Standard User license at a time. Only one named Sales Representative can hold direct Lead ownership via the Assignment Rule at any given moment. The two representatives without the active license at that time are covered by their corresponding Queue as a proxy owner. When the license rotates, the rule entry for the newly licensed representative assigns directly to that named user; the others revert to their Queue.

**Fault-path backstop.** Each Queue serves as the fallback owner for any Lead the Assignment Rule or Flow does not explicitly route to a named user. No Lead exits the pipeline without an owner.

Queues are never the design-intent routing target. The `regional_territory_assignment` Assignment Rule assigns to the named Sales Representative for the territory when that representative holds the active license. The Queue appears in the Assignment Rule entry only when the representative does not hold the license.

---

## 3. Queue Definitions

### 3.1 East Coast Region

| Attribute | Value |
|---|---|
| Queue Label | East Coast Region |
| Queue API Name | `East_Coast_Region` |
| Territory | East Coast |
| Design-Intent Owner | Luis Navarro |
| Assignment Rule Entry | Rule 1 — `regional_territory_assignment` |

**Territory coverage:** Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### 3.2 West Coast Region

| Attribute | Value |
|---|---|
| Queue Label | West Coast Region |
| Queue API Name | `West_Coast_Region` |
| Territory | West Coast |
| Design-Intent Owner | Jordan Chen |
| Assignment Rule Entry | Rule 2 — `regional_territory_assignment` |

**Territory coverage:** Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### 3.3 Central Region

| Attribute | Value |
|---|---|
| Queue Label | Central Region |
| Queue API Name | `Central_Region` |
| Territory | Central |
| Design-Intent Owner | Priya Desai |
| Assignment Rule Entry | Rule 3 — `regional_territory_assignment` |

**Territory coverage:** Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 4. Queue Summary

| Queue Label | API Name | Territory | Design-Intent Owner |
|---|---|---|---|
| East Coast Region | `East_Coast_Region` | East Coast | Luis Navarro |
| West Coast Region | `West_Coast_Region` | West Coast | Jordan Chen |
| Central Region | `Central_Region` | Central | Priya Desai |

---

## 5. Interaction with Priority Level High Leads

The Assignment Rule fires on every Lead Record at creation, before the After-Save Flow executes. For Priority Level `High` Leads, the Flow escalation segment captures the `OwnerId` written by the Assignment Rule — whether a named Sales Representative or a regional Queue — and overwrites it with Sophia Delgado's User ID via `varOwnerID`. The Queue value is never the final owner for a Priority Level `High` Lead.

Priority Level `Medium` and `Low` Leads retain the Assignment Rule `OwnerId` unchanged. If the Assignment Rule wrote a regional Queue at creation, that Queue is the final owner.

---

## 6. DevOrg Context

The Queue labels `East Coast Region`, `West Coast Region`, and `Central Region` are confirmed from org screenshots captured 2026-05-29. The API names `East_Coast_Region`, `West_Coast_Region`, and `Central_Region` are confirmed from SFDX metadata retrieval at API v66.0.

In a production deployment, all three Sales Representatives hold provisioned licenses simultaneously. The Assignment Rule assigns directly to the named user for each territory across all three rule entries. The Queues remain configured as fault-path backstops but do not appear as proxy owners under normal conditions.

---

## 7. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/queue-definitions.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
