Queue Definitions

Salesforce Case Study: Lead — Priority Level Automation Céleste Vineyards | Automation Logic

1. Document Purpose

This document defines the three regional Queues used in the Céleste Vineyards Lead Priority Level Automation system. It records the confirmed Queue Label, API Name, territory, and design-intent owner for each Queue, and documents the two operational roles Queues serve within the routing architecture.

Queue Labels confirmed from live org screenshot captured 2026-05-29.

2. Queue Summary

| Queue Label | Queue API Name | Assigned By | Design-Intent Owner |
| :--- | :--- | :--- | :--- |
| East Coast Region | East_Coast_Region | Rule Entry 1 | Luis Navarro |
| West Coast Region | West_Coast_Region | Rule Entry 2 | Jordan Chen |
| Central Region | Central_Region | Rule Entry 3 | Priya Desai |

3. Queue Definitions

3.1 East Coast Region
| Attribute | Value |
| :--- | :--- |
| Queue Label | East Coast Region |
| Queue API Name | East_Coast_Region |
| Assigned By | Rule Entry 1 |
| Design-Intent Owner | Luis Navarro |

States Covered:

Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia

3.2 West Coast Region
| Attribute | Value |
| :--- | :--- |
| Queue Label | West Coast Region |
| Queue API Name | West_Coast_Region |
| Assigned By | Rule Entry 2 |
| Design-Intent Owner | Jordan Chen |

States Covered:

Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming

3.3 Central Region
| Attribute | Value |
| :--- | :--- |
| Queue Label | Central Region |
| Queue API Name | Central_Region |
| Assigned By | Rule Entry 3 |
| Design-Intent Owner | Priya Desai |

States Covered:

Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin

4. Queue Operational Roles

Queues serve two operational roles within the routing architecture.

4.1 Error Catch

Each Queue acts as a catch for Lead Records that error out during the Assignment Rule evaluation. A Lead is routed to the Queue that corresponds to its state's region. For example, a Lead originating from a West Coast Region state that errors in the flow is deposited into the West Coast Region Queue.

4.2 Assignment Rule Placeholder

Queues serve as proxy owners on the Lead Assignment Rule when a region's design-intent Sales Representative does not hold an active Salesforce license with full permissions. Because only users with a qualifying license can be listed as an active Assignment Rule target, the regional Queue substitutes for that user until a provisioned license is available.

This is a Developer Edition org constraint. In a production org, all three Sales Representatives hold active licenses simultaneously and the Queues serve as fault-path catches only.

5. Developer Edition Org Context

This system is built in a Salesforce Developer Edition org. The Developer Edition org supports one active Standard User license at a time. At any given time, one Sales Representative holds the active license and receives direct Lead ownership via the Assignment Rule. The remaining two regions are covered by their regional Queue as a proxy owner.

This is a DevOrg constraint, not a design limitation. Queue API names, territory mappings, and Assignment Rule logic are production-equivalent and require no modification for deployment to a production org.

6. Document Status
| Attribute | Value |
| :--- | :--- |
| Section | Automation Logic |
| File Path | docs/04-automation-logic/queue-definitions.md |

Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie
