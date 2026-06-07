# Territorial Routing Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the territorial routing logic applied in the Céleste Vineyards Lead Priority Level Automation system. It covers how the Lead Assignment Rule evaluates each incoming Lead Record, how the three regional Queues are structured, and how territorial routing interacts with the Flow escalation logic for Priority Level `High` Leads.

The Assignment Rule fires at Record creation, before the Flow executes. It evaluates `State/Province` and writes the initial regional `OwnerId` to the Lead Record. The Flow then either retains or overrides that value depending on Priority Level.

Every Lead Record that enters Salesforce is a confirmed B2B submission. The Gatekeeper is enforced at the Wix form layer before any data is transmitted.

---

## 2. Routing Architecture

Territorial routing is implemented using a single Salesforce Lead Assignment Rule containing three rule entries. Each entry evaluates the `State/Province` Field and assigns the Lead to the corresponding named Sales Representative or regional Queue.

The Assignment Rule fires on Lead creation, before the Flow executes. The regional `OwnerId` is written to the Record first. The Flow then either retains or overrides that value depending on the Priority Level.

```
Lead Record Created
        |
Assignment Rule Evaluates State/Province
        |
   _____|_______________________________
  |             |                       |
Rule 1        Rule 2                  Rule 3
East Coast    West Coast              Central
Luis Navarro  Jordan Chen             Priya Desai
or East Coast or West Coast           or Central
Region        Region                  Region
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
   Assignment Rule OwnerId retained as-is
```

---

## 3. Assignment Rule Configuration

| Attribute | Value |
|---|---|
| Rule Name | `Regional Territory Assignment` |
| Rule API Name | `regional_territory_assignment` |
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
| Queue Label | `East Coast Region` |
| Queue API Name | `East_Coast_Region` |
| Design-Intent Owner | Luis Navarro |
| Condition | `State/Province` equals one of the East Coast state values |

**States Covered:**

Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### 4.2 Rule 2 — West Coast Region

| Attribute | Value |
|---|---|
| Rule Order | 2 |
| Queue Label | `West Coast Region` |
| Queue API Name | `West_Coast_Region` |
| Design-Intent Owner | Jordan Chen |
| Condition | `State/Province` equals one of the West Coast state values |

**States Covered:**

Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### 4.3 Rule 3 — Central Region

| Attribute | Value |
|---|---|
| Rule Order | 3 |
| Queue Label | `Central Region` |
| Queue API Name | `Central_Region` |
| Design-Intent Owner | Priya Desai |
| Condition | `State/Province` equals one of the Central state values |

**States Covered:**

Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 5. State Coverage

All 50 US states and the District of Columbia are covered across the three rule entries. No state is unassigned.

| State | Region | Queue |
|---|---|---|
| Alabama | East Coast | `East_Coast_Region` |
| Alaska | West Coast | `West_Coast_Region` |
| Arizona | West Coast | `West_Coast_Region` |
| Arkansas | Central | `Central_Region` |
| California | West Coast | `West_Coast_Region` |
| Colorado | West Coast | `West_Coast_Region` |
| Connecticut | East Coast | `East_Coast_Region` |
| Delaware | East Coast | `East_Coast_Region` |
| District of Columbia | East Coast | `East_Coast_Region` |
| Florida | East Coast | `East_Coast_Region` |
| Georgia | East Coast | `East_Coast_Region` |
| Hawaii | West Coast | `West_Coast_Region` |
| Idaho | West Coast | `West_Coast_Region` |
| Illinois | Central | `Central_Region` |
| Indiana | Central | `Central_Region` |
| Iowa | Central | `Central_Region` |
| Kansas | Central | `Central_Region` |
| Kentucky | Central | `Central_Region` |
| Louisiana | Central | `Central_Region` |
| Maine | East Coast | `East_Coast_Region` |
| Maryland | East Coast | `East_Coast_Region` |
| Massachusetts | East Coast | `East_Coast_Region` |
| Michigan | Central | `Central_Region` |
| Minnesota | Central | `Central_Region` |
| Mississippi | Central | `Central_Region` |
| Missouri | Central | `Central_Region` |
| Montana | West Coast | `West_Coast_Region` |
| Nebraska | Central | `Central_Region` |
| Nevada | West Coast | `West_Coast_Region` |
| New Hampshire | East Coast | `East_Coast_Region` |
| New Jersey | East Coast | `East_Coast_Region` |
| New Mexico | West Coast | `West_Coast_Region` |
| New York | East Coast | `East_Coast_Region` |
| North Carolina | East Coast | `East_Coast_Region` |
| North Dakota | Central | `Central_Region` |
| Ohio | Central | `Central_Region` |
| Oklahoma | Central | `Central_Region` |
| Oregon | West Coast | `West_Coast_Region` |
| Pennsylvania | East Coast | `East_Coast_Region` |
| Rhode Island | East Coast | `East_Coast_Region` |
| South Carolina | East Coast | `East_Coast_Region` |
| South Dakota | Central | `Central_Region` |
| Tennessee | East Coast | `East_Coast_Region` |
| Texas | Central | `Central_Region` |
| Utah | West Coast | `West_Coast_Region` |
| Vermont | East Coast | `East_Coast_Region` |
| Virginia | East Coast | `East_Coast_Region` |
| Washington | West Coast | `West_Coast_Region` |
| West Virginia | East Coast | `East_Coast_Region` |
| Wisconsin | Central | `Central_Region` |
| Wyoming | West Coast | `West_Coast_Region` |

---

## 6. Routing Behavior by Priority Level

The Assignment Rule fires on every Lead Record. The interaction between Assignment Rule output and Priority Level is managed by the Flow, not the Assignment Rule.

| Priority Level | Assignment Rule Fires | Assignment Rule Output | Flow Override | Final Owner |
|---|---|---|---|---|
| `High` | Yes | Named Sales Representative or regional Queue (by state) | Yes — Sophia Delgado | Sophia Delgado |
| `Medium` | Yes | Named Sales Representative or regional Queue (by state) | No | Named Sales Representative or regional Queue |
| `Low` | Yes | Named Sales Representative or regional Queue (by state) | No | Named Sales Representative or regional Queue |

Assignment Rule output for Priority Level `Medium` and `Low` Leads reflects the license state at the time of Record creation. Priority Level `High` final owner is Sophia Delgado in all license configurations.

---

## 7. Region__c Field

The `Region__c` Field stores the regional classification of each Lead Record. It is a Formula (Text) Field that resolves at read time from the `State/Province` Field via a CASE statement. It is not written by the Assignment Rule, the Flow, or Make.com under any circumstances.

When the Flow escalation logic overrides `OwnerId` to Sophia Delgado's User ID for Priority Level `High` Leads, `Region__c` is unaffected. A Priority Level `High` Lead owned by Sophia Delgado retains the correct territorial `Region__c` value for the state it originated from. Regional classification is preserved for pipeline reporting and visibility regardless of Record ownership.

---

## 8. Developer Edition Org Context

This system is built in a Salesforce Developer Edition org. The Developer Edition org supports one active Standard User license at a time. The Assignment Rule accommodates this constraint by assigning Leads to the named Sales Representative for that territory when they hold the active license, and to their regional Queue as a proxy when they do not.

Queue Labels confirmed from live org screenshot captured 2026-05-29: `East Coast Region`, `West Coast Region`, `Central Region`. Queue API names, state-to-territory mappings, and Assignment Rule logic are production-equivalent and require no modification for deployment to a production org. In a production org, all three Sales Representatives hold provisioned licenses simultaneously and the Queues serve as fault-path catch-alls only.

---

## 9. Live Validation

Five canonical Lead Records confirm territorial routing executed correctly across all three regions and both routing outcomes.

| Lead | State | Region | Assignment Rule Output | Priority Level | Final Owner |
|---|---|---|---|---|---|
| L-01 — Marcus Thibodeau | Georgia | East Coast | Luis Navarro or `East_Coast_Region` | `High` | Sophia Delgado |
| L-02 — Renata Voss | Oregon | West Coast | Jordan Chen or `West_Coast_Region` | `High` | Sophia Delgado |
| L-03 — Dominic Reyes | Illinois | Central | Priya Desai or `Central_Region` | `Medium` | Priya Desai or `Central_Region` |
| L-04 — Janelle Harmon | Virginia | East Coast | Luis Navarro or `East_Coast_Region` | `Medium` | Luis Navarro or `East_Coast_Region` |
| L-05 — Britta Sandoval | Washington | West Coast | Jordan Chen or `West_Coast_Region` | `Low` | Jordan Chen or `West_Coast_Region` |

Assignment Rule output and final owner for Priority Level `Medium` and `Low` Leads reflects the license state at the time of Record creation. Priority Level `High` final owner is Sophia Delgado in all license configurations.

---

## 10. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/territorial-routing-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
