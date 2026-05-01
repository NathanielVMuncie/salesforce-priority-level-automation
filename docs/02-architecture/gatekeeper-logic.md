# Gatekeeper Logic

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Architecture

---

## 1. Document Purpose

This document defines the qualification gate enforced on the Céleste Vineyards Wix inquiry form. It records the gate's structural position in the system, the mechanism by which non-business submissions are blocked, the form state transformation that enforces the block, and the outcome paths produced by each Business Type selection.

The gatekeeper is architectural — it is the outermost wall of the system. It is not automation logic, it is not integration logic, and it has no connection to any external platform. It operates entirely within the Wix inquiry form before any submission occurs, before any Wix Automation fires, and before any data reaches Make.com or Salesforce. No downstream system has any awareness of or responsibility for this gate.

No qualification fields, qualification variables, or qualification logic exist anywhere in the Salesforce org or the Make.com scenario. Every Lead Record that exists in Salesforce is a confirmed B2B submission by definition.

---

## 2. Architectural Position

The gatekeeper is the first and outermost boundary of the pipeline. It is not a layer within the pipeline — it is the condition that determines whether a prospect enters the pipeline at all.

The Wix Automation `POST_To_Make_Inlet_Webhook` is the integration point between Wix and Make.com. It fires only on form submission. The gatekeeper prevents form submission from occurring for non-business contacts. Because the Wix Automation never fires, no integration with any external platform occurs. The gate is self-contained within Wix.

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
Message renders                       Form remains submittable
No submission possible                Prospect completes and submits
No Wix Automation fires               Wix Automation fires
No payload generated                  Payload transmitted to Make.com
Pipeline never reached                Pipeline begins
```

---

## 3. Gate Mechanism

### 3.1 Business Type Dropdown

The Business Type dropdown is the first field on the form. The prospect must select a value before any other fields are presented. The selection determines whether the form remains active or transitions to a non-submittable state.

| Dropdown Value | Gate Outcome |
|---|---|
| `Premium Wine Distributor` | B2B — form remains active |
| `High-End Wine Store` | B2B — form remains active |
| `Upscale Restaurant` | B2B — form remains active |
| `Specialty Gourmet Grocer` | B2B — form remains active |
| `Catering & Event Company` | B2B — form remains active |
| `Personal/Individual (Non-Business)` | Gate triggers — form collapses |

### 3.2 Form State Transformation

When `Personal/Individual (Non-Business)` is selected, the Wix form transitions to a non-submittable state immediately. This transformation is implemented via Wix conditional display logic applied to the form fields and the submit control.

**On `Personal/Individual (Non-Business)` selection:**

- The Business Type dropdown remains visible showing the selected value
- All remaining fields collapse — Role, Purchasing Timeline, Company, and all contact fields are hidden
- The submit control is disabled — no submission is possible regardless of any other action taken by the prospect
- A message renders in place of the collapsed fields
- No payload is generated
- The Wix Automation `POST_To_Make_Inlet_Webhook` does not fire
- Make.com receives nothing
- No Lead Record is created in Salesforce
- No Flow fires

**On any B2B business type selection:**

- All fields remain visible and active
- The form remains submittable
- The prospect completes the remaining fields and submits
- The Wix Automation `POST_To_Make_Inlet_Webhook` fires on submission
- The payload is transmitted to Make.com
- The pipeline begins

### 3.3 Gate Message

When the gate triggers, the following message renders on the form:

> Thank you for contacting Céleste Vineyards. We operate on a strictly B2B model and do not sell to private collectors or non-business entities. We appreciate your interest and invite you to leave a message in our inquiry box for further questions.

This message is display-only. It does not generate any record, log any event, or trigger any automation.

---

## 4. Downstream System State

Because the gatekeeper operates entirely within Wix, no downstream system contains any record, variable, field, or logic related to non-business contacts or qualification status.

| System | Qualification Logic Present | Notes |
|---|---|---|
| Wix | Yes — gate enforced at form layer | Self-contained — no external communication required |
| Make.com | No | Single-stream linear pipeline — no router, no qualification path |
| Salesforce — Flow | No | No qualification fields, variables, or decision elements |
| Salesforce — Lead Object | No | No qualification fields of any kind exist on the object |

Every Lead Record in Salesforce entered through the B2B path. The presence of a Lead Record in the org is itself confirmation of B2B qualification.

---

## 5. Outcome Paths

### 5.1 Non-Business Path — Personal/Individual (Non-Business)

| Attribute | Value |
|---|---|
| Trigger | `Personal/Individual (Non-Business)` selected in Business Type dropdown |
| Form state | Non-submittable — all fields except Business Type hidden, gate message rendered |
| Wix Automation fires | No |
| Payload generated | No |
| Make.com reached | No |
| Salesforce Lead Record created | No |
| Flow triggered | No |
| Pipeline outcome | Prospect exits at the Wix layer — no record of any kind is created anywhere |

### 5.2 B2B Path — Any B2B Business Type

| Attribute | Value |
|---|---|
| Trigger | Any B2B value selected in Business Type dropdown |
| Form state | Active — all fields visible, form submittable |
| Wix Automation fires | Yes — `POST_To_Make_Inlet_Webhook` fires on submission |
| Payload generated | Yes — on form submission |
| Make.com reached | Yes — payload received by Custom Webhook module |
| Salesforce Lead Record created | Yes — via Make.com Salesforce Create Record module |
| Flow triggered | Yes — After-Save Flow `Lead_Scoring_and_Priority_Level_Assignment` fires on Lead Record creation |
| Pipeline outcome | Lead enters the scoring and routing pipeline |

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Section | Architecture |
| File Path | `docs/02-architecture/gatekeeper-logic.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
