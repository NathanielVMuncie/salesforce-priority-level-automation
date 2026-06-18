# Lead Assignment Rule Metadata

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Routing

---

## 1. Document Purpose

This document records the configuration of the Lead Assignment Rule used in the Céleste Vineyards Lead Priority Level Automation system. It defines the rule identity, the three rule entries, and the state-to-territory mappings that drive regional Queue assignment at Lead Record creation.

Full architectural context for the Assignment Rule is in `docs/04-automation-logic/territorial-routing-logic.md`.

---

## 2. Rule Identity

| Attribute | Value |
|---|---|
| Rule Name | Regional Territory Assignment |
| API Name | `regional_territory_assignment` |
| Object | Lead |
| Active Default Rule | Yes |
| Execution Timing | Fires synchronously at Lead Record creation — before the After-Save Flow executes |

---

## 3. Rule Entries

### Rule Entry 1 — East Coast Region

| Attribute | Value |
|---|---|
| Entry Order | 1 |
| Criteria | `State/Province` matches any East Coast state |
| Assigned To | `East_Coast_Region` Queue |

**State Coverage (20):**

Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

---

### Rule Entry 2 — West Coast Region

| Attribute | Value |
|---|---|
| Entry Order | 2 |
| Criteria | `State/Province` matches any West Coast state |
| Assigned To | `West_Coast_Region` Queue |

**State Coverage (13):**

Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

---

### Rule Entry 3 — Central Region

| Attribute | Value |
|---|---|
| Entry Order | 3 |
| Criteria | `State/Province` matches any Central state |
| Assigned To | `Central_Region` Queue |

**State Coverage (18):**

Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

---

## 4. Coverage Summary

| Territory | Queue | States Covered |
|---|---|---|
| East Coast | `East_Coast_Region` | 20 (including District of Columbia) |
| West Coast | `West_Coast_Region` | 13 |
| Central | `Central_Region` | 18 |
| **Total** | | **51** |

All 50 US states and the District of Columbia are covered. No US-based Lead Record can fall through to a default unassigned state.

---

## 5. Interaction with Flow Escalation

The Assignment Rule fires at Record creation and sets `OwnerId` to the regional Queue. The After-Save Flow then fires and reads this value into `varOwnerID` via `{!$Record.OwnerId}`. For Priority Level `High` Leads, the Flow overrides `varOwnerID` with Sophia Delgado's User ID. The final `OwnerId` written by the Flow's `Update Lead Priority and Score` element reflects the escalation outcome — not the Assignment Rule value.

For Priority Level `Medium` and `Low` Leads, the Assignment Rule Queue value is retained as the final `OwnerId` without modification.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Routing |
| File Path | `metadata/assignment-rules/lead-assignment-rules.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
