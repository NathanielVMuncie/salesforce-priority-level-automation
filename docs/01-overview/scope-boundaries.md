# Scope Boundaries

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Overview

---

## 1. Document Purpose

This document defines the explicit scope boundaries of the Céleste Vineyards Lead Priority Level Automation system. All documentation, testing, and portfolio materials in this repository are constrained to the scope defined here.

---

## 2. In Scope

The following components are in scope for this case study and are fully documented in this repository.

### 2.1 Wix

- Public-facing B2B inquiry form structure and field configuration
- Key/value mapping applied to form fields
- Conditional display logic enforcing the front-end qualification gate
- Wix Automation transmitting form submissions to Make.com via HTTP POST

### 2.2 Make.com

- Scenario `Wix_To_CelesteProd_B2B_Lead_Engine_v1` — full configuration
- Custom Webhook module receiving Wix form payloads
- Router module enforcing the two-path qualified and non-qualified architecture
- Salesforce Create Record module — qualified path (Module 12) including field mapping and phone normalization formula
- Salesforce Create Record module — non-qualified path (Module 13) including placeholder field mapping

### 2.3 Salesforce — Data Model

- Custom field design on the Lead object
- Picklist value sets for `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c`, `Priority_Level__c`
- Formula field `Qualification_Status__c`
- Checkbox field `Qualified__c` including default value configuration
- Custom fields `Customer_Note__c`, `Region__c`, `Lead_Created__c`

### 2.4 Salesforce — Automation

- Record-Triggered After-Save Flow — `Lead_Scoring_and_Priority_Level_Assignment`
- Flow variables — `varTotalScore`, `varPriorityLevel`, `varOwnerID`, `varQualified`
- Flow formula resource — `Qualification_Status_Aesthetic`
- Gatekeeper Decision element — dual-purpose qualification gate and Business Type scoring
- Role scoring Decision element
- Purchasing Timeline scoring Decision element
- Priority Level assignment Decision element
- OwnerId initialization Assignment element
- Escalation Decision element — `Escalate High Priority to Sophia`
- Update Records element — single DML write

### 2.5 Salesforce — Routing

- Lead Assignment Rule — three rule entries covering all 50 US states and the District of Columbia
- Queue definitions — `East_Coast_Region`, `West_Coast_Region`, `Central_Region`
- Escalation target — Sophia Delgado user record

### 2.6 Documentation and Portfolio

- All category documentation as defined in the repository Documentation Index
- Test scenarios, UAT evidence, and defect log
- Portfolio-facing case study summary, recruiter summary, resume bullets, and website copy

---

## 3. Out of Scope

The following components are explicitly excluded from this case study.

| Item | Reason for Exclusion |
|---|---|
| Wix site design, hosting, and front-end configuration beyond the inquiry form | Not a Salesforce Administrator deliverable |
| Salesforce user provisioning, profiles, and role hierarchy | DevOrg constraint — single license environment |
| Email alert and notification configuration | Not required to demonstrate core automation competency |
| Reporting and dashboard design | Separate discipline — post-pipeline visibility not required for case study |
| Opportunity, Account, and Contact objects | Post-conversion activity is outside the Lead pipeline scope |
| Production deployment and sandbox migration | DevOrg is the build environment — migration procedures are not demonstrated |
| Salesforce CPQ, Marketing Cloud, or other add-on products | Not applicable to this use case |
| Multi-org or multi-instance architecture | Single Developer Edition org — one environment |

---

## 4. Platform Constraint — Developer Edition Org

This system is built in a Salesforce Developer Edition org. Two constraints specific to this environment are documented as scope acknowledgments, not scope failures.

**Single active user license.** The Developer Edition org supports one active Salesforce Standard User license. This license is assigned to Sophia Delgado — National Sales Director. Regional Queue representatives operate as Queue placeholders. In a production deployment, each Queue would contain provisioned named users.

**No production sandbox.** The Developer Edition org is the sole build and validation environment. All test records, debug logs, and UAT evidence are produced in this environment. Sandbox migration procedures are not demonstrated.

These constraints do not affect the functional fidelity of the automation logic, scoring model, routing architecture, or integration pipeline. All components operate as they would in a production org.

---

## 5. Integration Boundary

The system boundary begins at the Wix form submission and ends at Lead owner or Queue assignment in Salesforce. Everything between those two points is in scope. Everything outside those two points is out of scope.

```
[OUT OF SCOPE]     [IN SCOPE]                              [OUT OF SCOPE]
Prospect           Wix Form → Make.com → Salesforce        Post-Conversion
browsing           Submission   Middleware   Lead Pipeline  Opportunity
the website                                                 Management
```

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Overview |
| File Path | `docs/01-overview/scope-boundaries.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
