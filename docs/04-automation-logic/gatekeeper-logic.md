# Gatekeeper Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Automation Logic

---

## 1. Document Purpose

This document defines the qualification gate implemented on the Céleste Vineyards Wix inquiry form. It records the gate's position in the pipeline, the mechanism by which non-business submissions are blocked, the form state transformation that enforces the block, and the outcome paths produced by each Business Type selection.

The gatekeeper operates entirely within the Wix layer. It executes before any payload is generated. No downstream system — Make.com, Salesforce, or the Flow — has any awareness of or responsibility for this gate.

---

## 2. Gate Position in Pipeline

The gatekeeper is the first decision point in the pipeline. It executes at the moment a prospect selects a value in the Business Type dropdown on the Wix inquiry form — before the form can be submitted, before any automation fires, and before any data reaches Make.com.

```
Prospect visits Wix inquiry form
        |
        v
Selects Business Type dropdown value
        |
        v
[GATEKEEPER] — Form evaluates selection
        |
   _____|______________________________
  |                                    |
Personal/Individual (Non-Business)    Any B2B business type
        |                                    |
Form collapses                        B2B fields remain visible
Not Qualified message renders         Form remains submittable
No submission possible                Prospect completes and submits
Pipeline never reached                Wix Automation fires — payload transmitted
```

---

## 3. Gate Mechanism

### 3.1 Business Type Dropdown

The Business Type dropdown is the first field on the form. The prospect must select a value before any other fields are presented. The selection determines whether the form remains active or transitions to a non-submittable state.

The dropdown contains six values:

| Dropdown Value | Gate Outcome |
|---|---|
| `Premium Wine Distributor` | Qualified — form remains active |
| `High-End Wine Store` | Qualified — form remains active |
| `Upscale Restaurant` | Qualified — form remains active |
| `Specialty Gourmet Grocer` | Qualified — form remains active |
| `Catering & Event Company` | Qualified — form remains active |
| `Personal/Individual (Non-Business)` | Not Qualified — gate triggers, form collapses |

### 3.2 Form State Transformation

When `Personal/Individual (Non-Business)` is selected, the Wix form transitions to a non-submittable state. This transformation is implemented via Wix conditional display logic applied to the form fields and the submit control.

**On `Personal/Individual (Non-Business)` selection — Not Qualified:**

- All B2B-specific fields are hidden — Role, Purchasing Timeline, Company, and all contact fields collapse from view
- The Not Qualified message renders in place of the form body
- The form enters a non-submittable state — no submission is possible regardless of any other action taken by the prospect
- No payload is generated
- No webhook fires
- Make.com receives nothing

**On any qualified B2B business type selection:**

- All B2B fields remain visible and active
- The Not Qualified message does not render
- The form remains submittable
- The prospect completes the remaining fields and submits
- The Wix Automation fires on submission and transmits the payload to Make.com

### 3.3 Not Qualified Message

When the gate triggers, the following message renders on the form in place of the collapsed fields:

> Thank you for contacting Céleste Vineyards. We operate on a strictly B2B model and do not sell to private collectors or non-business entities. We appreciate your interest and invite you to leave a message in our inquiry box for further questions.

This message is display-only. It does not generate any record, log any event, or trigger any automation.

---

## 4. Outcome Paths

### 4.1 Not Qualified Path — Personal/Individual (Non-Business)

| Attribute | Value |
|---|---|
| Trigger | `Personal/Individual (Non-Business)` selected in Business Type dropdown |
| Form state | Non-submittable — all B2B fields hidden, Not Qualified message rendered |
| Payload generated | No |
| Make.com triggered | No |
| Salesforce Lead Record created | No |
| Flow triggered | No |
| Pipeline outcome | Prospect exits at the Wix layer — no record of any kind is created |

### 4.2 Qualified Path — Any B2B Business Type

| Attribute | Value |
|---|---|
| Trigger | Any qualified B2B value selected in Business Type dropdown |
| Form state | Active — all B2B fields visible, form submittable |
| Payload generated | Yes — on form submission |
| Make.com triggered | Yes — Wix Automation fires `POST_To_Make_Inlet_Webhook` |
| Salesforce Lead Record created | Yes — via Make.com `Module 12` |
| Flow triggered | Yes — After-Save Flow fires on Lead Record creation |
| Pipeline outcome | Lead enters the scoring and routing pipeline |

---

## 5. Illustrative Scenarios

The following scenarios illustrate the gate's behavior across both outcome paths. These are representative examples — not UAT records.

### Scenario A — Not Qualified, Pipeline Not Reached

A prospect visits the Céleste Vineyards inquiry form and selects `Personal/Individual (Non-Business)` from the Business Type dropdown. The form immediately collapses. The Not Qualified message renders. No other fields are visible. The form cannot be submitted. The prospect reads the message and leaves the page. No payload is generated. No Lead Record is created in Salesforce.

### Scenario B — Qualified, High Priority Lead Enters Pipeline

A prospect representing a Premium Wine Distributor visits the form and selects `Premium Wine Distributor`. The B2B fields remain visible. The prospect selects `Owner` for Role and `Short-Term (Within 30 Days)` for Purchasing Timeline, enters contact information, and submits the form. The Wix Automation fires. The payload reaches Make.com. A Lead Record is created in Salesforce and the Flow executes — assigning a Priority Level of High and routing the Lead to Sophia Delgado.

### Scenario C — Qualified, Low Priority Lead Enters Pipeline

A prospect representing a Catering & Event Company visits the form and selects `Catering & Event Company`. The B2B fields remain visible. The prospect selects `Event Coordinator` for Role and `Information Gathering` for Purchasing Timeline, enters contact information, and submits the form. The Wix Automation fires. The payload reaches Make.com. A Lead Record is created in Salesforce and the Flow executes — assigning a Priority Level of Low and routing the Lead to the correct regional Queue.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Automation Logic |
| File Path | `docs/04-automation-logic/gatekeeper-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
