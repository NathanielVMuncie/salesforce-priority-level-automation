# Queue Definitions

## Overview

This document defines the Salesforce queues used in the priority level automation, including their API names, assignment rule entries, and the territories each queue services.

## Queues

| Queue Label | Queue API Name | Assigned By | Territories Serviced |
| :--- | :--- | :--- | :--- |
| East Coast Region | East_Coast_Region | Rule Entry 1 | Alabama, Connecticut, Delaware, District of Columbia, Florida, Georgia, Maine, Maryland, Massachusetts, New Hampshire, New Jersey, New York, North Carolina, Pennsylvania, Rhode Island, South Carolina, Tennessee, Vermont, Virginia, West Virginia |
| West Coast Region | West_Coast_Region | Rule Entry 2 | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming |
| Central Region | Central_Region | Rule Entry 3 | Arkansas, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Michigan, Minnesota, Mississippi, Missouri, Nebraska, North Dakota, Ohio, Oklahoma, South Dakota, Texas, Wisconsin |

## Notes

**Purpose 1 — Error Catch:** Each queue acts as a catch for Leads that error out in the flow. A Lead is routed to the queue that matches its state's region — for example, a Lead in a West Coast Region state that errors in the flow will be deposited into the West Coast Region queue.

**Purpose 2 — Assignment Rule Placeholder:** Queues serve as placeholders on the Lead Assignment Rules when a region owner does not hold an active Salesforce license with full permissions. Since only users with a qualifying license (e.g., Salesforce license) can be listed on the Lead Assignment Rule, a queue can temporarily replace that user until a licensed user is available.
