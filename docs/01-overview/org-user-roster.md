# Org User Roster

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document is the authoritative reference for all users, roles, titles, profiles, licenses, and Assignment Rule ownership active in the Céleste Vineyards Salesforce Developer Edition org. All documentation, Flow architecture decisions, and routing logic in this repository must reference this document for user and role details.

---

## 2. User Roster

| Full Name | Alias | Username | Title | Role | Profile |
|---|---|---|---|---|---|
| Navarro, Luis | `lnava` | `luis.navarro@celestevineyards.com` | Sales Representative | Sales Representative, East Coast Region | Sales Representative |
| Chen, Jordan | `jchen` | `jordan.chen@celestevineyards.com` | Sales Representative | Sales Representative, West Coast Region | Sales Representative |
| Desai, Priya | `pdesa` | `priya.desai@celestevineyards.com` | Sales Representative | Sales Representative, Central Region | Sales Representative |
| Delgado, Sophia | `sdelg` | `sophia.delgado@celestevineyards.com` | National Sales Director | National Sales Director | National Sales Director |
| Muncie, Nathaniel V. | `nmunc` | `nathaniel.muncie@celestevineyards.com` | System Administrator | System Administrator | System Administrator |

---

## 3. License Model

The Developer Edition org provides 4 Salesforce Standard User licenses. Nathaniel V. Muncie holds 1 permanently as System Administrator. The remaining 3 licenses are distributed among the 4 sales users — Luis Navarro, Jordan Chen, Priya Desai, and Sophia Delgado — on a rotation basis.

| User | License Type | Notes |
|---|---|---|
| Nathaniel V. Muncie | Salesforce | Permanent — System Administrator |
| Luis Navarro | Salesforce | Active when territorial Lead Records are being created or demonstrated |
| Jordan Chen | Salesforce | Active when territorial Lead Records are being created or demonstrated |
| Priya Desai | Salesforce | Active when territorial Lead Records are being created or demonstrated |
| Sophia Delgado | Salesforce | Active when escalated High Priority Lead Records are being created or demonstrated |

Because only 3 licenses are available to the 4 sales users simultaneously, the license rotates to ensure each user holds a valid Salesforce license at the point their owned Lead Records are created. Lead Records retain their assigned owner after the license rotates — the owner's name remains on the Record.

The rotation sequence follows Lead creation order. Sophia Delgado requires the license first if escalated High Priority Leads are the first records created.

---

## 4. Profiles

Two profiles support the sales user roster. Both are cloned from the standard Salesforce profiles and configured for Lead ownership.

| Profile Name | Assigned To | Basis |
|---|---|---|
| `Sales Representative` | Luis Navarro, Jordan Chen, Priya Desai | Cloned from standard Sales User profile |
| `National Sales Director` | Sophia Delgado | Cloned from standard Sales User profile — distinct title |

Profile permissions are equivalent across both sales profiles. The distinction is title and role only — not object access or field-level security.

---

## 5. Assignment Rule Ownership

The Lead Assignment Rule assigns Lead Records to named users or a Queue based on `State/Province`. The current live configuration reflects the active license state of each territorial representative.

| Rule Order | Region | Assign To | Type | Notes |
|---|---|---|---|---|
| 2 | West Coast | Jordan Chen | Named User | Direct assignment — license active |
| 3 | Central | `Central_Region` Queue | Queue | License-aware fallback — Priya Desai not yet fully provisioned for direct assignment |
| 4 | East Coast | Luis Navarro | Named User | Direct assignment — license active |

Named user assignment is the standard path. Queue assignment is the license-aware fallback for the scenario where the assigned territorial representative does not hold a valid license to own Lead Records directly. When Priya Desai's license is confirmed active, Rule 3 will be updated to assign directly to her — matching the pattern for Luis Navarro and Jordan Chen.

---

## 6. Queue

One Queue is active in the org. It serves as the ownership fallback for the Central region.

| Queue Label | Queue API Name | Territory | Purpose |
|---|---|---|---|
| Central Region | `Central_Region` | Central | License-aware ownership fallback for Central territorial Leads |

`East_Coast_Region` and `West_Coast_Region` Queues are not active. East Coast and West Coast Leads are assigned directly to named users via the Assignment Rule.

---

## 7. Escalation Target

| Role | User | Escalation Mechanism |
|---|---|---|
| National Sales Director | Sophia Delgado | Flow — `Escalate High Priority to Sophia` Assignment element |

All `Priority_Level__c` = `High` Lead Records are routed to Sophia Delgado via Flow escalation logic. `OwnerId` is overridden from the regional assignment to Sophia Delgado's User ID by the `Lead_Scoring_and_Priority_Level_Assignment` Flow. Sophia Delgado holds no Queue assignment.

---

## 8. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/org-user-roster.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
