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

The Developer Edition org supports one active Salesforce Standard User license. All automation logic, Flow execution, escalation routing, and Queue assignment operate identically to a production org. The single license constraint affects only who can hold named user ownership — not how the system routes or processes Leads.

### 2.2 No Production Sandbox

The Developer Edition org is the sole build and validation environment. All test Records, debug logs, and UAT evidence are produced in this environment. Sandbox migration procedures are not demonstrated. This does not affect the correctness or completeness of the automation logic documented in this repository.

---

## 3. Ownership Model

### 3.1 Standard Configuration

By default, the single Standard User license is assigned to **Sophia Delgado — National Sales Director**. This assignment reflects her role as the escalation target for all Priority Level High Leads. The Flow escalation logic routes Priority Level High Lead Records directly to her User ID.

Regional Queue members — `East_Coast_Region` (lnava), `West_Coast_Region` (jchen), `Central_Region` (pdesa) — are proof-of-concept placeholders. In a production deployment, each Queue would contain provisioned named users.

### 3.2 Alternate Configuration

Occasionally the Standard User license is reassigned to a non-Queue named sales representative to demonstrate what named user ownership looks like on a Lead Record in practice. In this configuration, that representative holds the license and appears as a Lead owner in place of Sophia Delgado.

This alternate configuration does not change the automation logic, routing rules, or scoring behavior. It is a demonstration-only state used to illustrate production-equivalent ownership appearance.

### 3.3 Ownership Outcomes by Path

Regardless of which user holds the active license at any given time, the routing outcomes produced by the system are as follows:

| Path | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|
| Qualified — Priority Level High | Regional Queue | Yes — Sophia Delgado | Sophia Delgado (or active license holder) |
| Qualified — Priority Level Medium | Regional Queue | No | Regional Queue |
| Qualified — Priority Level Low | Regional Queue | No | Regional Queue |
| Not Qualified | Regional Queue | No | Regional Queue |

---

## 4. Production Equivalence

These constraints do not reduce the demonstrative value of this case study. The following components operate identically to a production org:

- Flow logic, scoring, and priority assignment
- Assignment Rule evaluation and Queue routing
- Escalation override via Flow Update Records element
- Make.com API ingestion and Field mapping
- Formula Field resolution for `Qualification_Status__c` and `Region__c`

In a production deployment, the single license constraint is removed, each Queue is populated with provisioned named users, and the escalation target is confirmed against the active org user list.

---

*Salesforce Case Study: Lead - Priority Level Automation | Built by Nathaniel V. Muncie*