# Queue Definitions

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing

---

## 1. Document Purpose

This document defines the three regional Queues used in the Céleste Vineyards Lead Priority Level Automation system. Queues are the routing targets for the Lead Assignment Rule. Each Queue covers a defined set of US states and the District of Columbia.

---

## 2. Queue Inventory

| Queue Label | Queue API Name | Assigned By | Territories Serviced |
|---|---|---|---|
| East Coast Region | `East_Coast_Region` | Assignment Rule — Rule Entry 1 | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| West Coast Region | `West_Coast_Region` | Assignment Rule — Rule Entry 2 | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |
| Central Region | `Central_Region` | Assignment Rule — Rule Entry 3 | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |

---

## 3. Role in the Pipeline

Queues serve as the `OwnerId` value written by the Lead Assignment Rule at Record creation. The Assignment Rule fires synchronously when the Lead Record is created by Make.com. It evaluates `State/Province` and assigns ownership to the corresponding regional Queue before the After-Save Flow executes.

The Flow's escalation segment reads the Queue `OwnerId` into `varOwnerID` via `{!$Record.OwnerId}`. For Priority Level `High` Leads, `varOwnerID` is overridden with Sophia Delgado's User ID. For Priority Level `Medium` and `Low` Leads, the Queue value is retained as the final `OwnerId`.

In the DevOrg environment, a single Standard User license constraint means only one named Sales Representative holds an active license at a time. The regional Queue serves as the ownership proxy for territories where the representative does not currently hold the active license. In a production org, each named Sales Representative would hold a provisioned license and be listed directly on the Assignment Rule entry.

---

## 4. Document Status

| Attribute | Value |
|---|---|
| Section | Routing |
| File Path | `metadata/queues/queue-definitions.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
