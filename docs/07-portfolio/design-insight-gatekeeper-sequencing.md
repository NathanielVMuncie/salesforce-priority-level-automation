# Design Insight — Gatekeeper Sequencing

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. The Decision

The first element in the Salesforce Flow is a single Decision element — `Determine Business Type Score` — that simultaneously enforces the qualification gate and assigns the Business Type dimension score. It is the gatekeeper and the first scoring step in one.

A simpler approach would have been to use two separate elements: a dedicated pre-screening Decision to evaluate whether the Lead qualifies, followed by a separate Business Type scoring Decision if it does. That approach is more readable at first glance. It was not chosen.

This document explains why.

---

## 2. The Alternative

The two-element approach would look like this in the Flow:

```
Qualification Check (Decision)
        |
   _____|___________
  |                 |
Qualified       Not Qualified
  |                 |
  ▼             Set varQualified = False → End
Business Type Score (Decision)
        |
   [5 scored outcomes]
```

This is clean and explicit. Each element has one responsibility. It is easy to understand.

---

## 3. Why the Dual-Purpose Design Was Chosen

**The Business Type Field is the qualification criterion.**

The system disqualifies a Lead if and only if `Business_Type__c` equals `Personal/Individual (Non-Business)`. There is no other qualification criterion. The qualification gate and the Business Type evaluation are not two separate concerns — they evaluate the same Field at the same moment for overlapping purposes.

Splitting them into two Decision elements would require evaluating `Business_Type__c` twice in sequence. The first evaluation would check for disqualification. The second would assign the score. The Field value does not change between the two evaluations. The two-element design adds an element without adding any logic.

**A single Decision element can have multiple outcome types.**

Salesforce Flow Decision elements support any number of named outcomes plus a Default Outcome. There is no architectural constraint that prevents a Decision from serving two purposes in its outcome set — qualified outcomes that route to scoring assignments, and one disqualification outcome that routes to an Assignment element and then to End.

The six outcomes of `Determine Business Type Score` are:

- Is Premium Wine Distributor → Add 5 to `varTotalScore`
- Is High-End Wine Store → Add 4 to `varTotalScore`
- Is Upscale Restaurant → Add 3 to `varTotalScore`
- Is Specialty Gourmet Grocer → Add 2 to `varTotalScore`
- Is Catering & Event Company → Add 1 to `varTotalScore`
- Gatekeeper Fail → Set `varQualified` = False → End

All six outcomes are legible, labeled, and auditable in Flow Builder and in the debug log. Nothing is hidden.

**Reducing element count reduces governor limit surface area.**

Every element in a Flow interview consumes resources. Keeping element count to the minimum necessary to implement the required logic is consistent with Salesforce best practice for Flow design. A two-element approach uses more elements than necessary to achieve the same outcome.

---

## 4. The Trade-Off Acknowledged

The dual-purpose design is less immediately obvious to a reader who encounters the Flow for the first time. The element is named `Determine Business Type Score`, which does not surface its gatekeeper function in the name alone.

This is mitigated by the Flow description Field on the element, which documents both purposes explicitly, and by this case study documentation. A technical reviewer reading the full documentation set will understand the design decision without ambiguity.

---

## 5. What This Demonstrates

Choosing the dual-purpose design over the two-element alternative reflects a deliberate trade-off between readability and efficiency — made with awareness of both options and a documented rationale for the choice taken. That is the kind of decision-making a Salesforce Administrator is expected to make and explain.

The ability to identify when two concerns can be collapsed into one without sacrificing auditability — and to document why that choice was made — is a meaningful signal of platform maturity.

---

## 6. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | docs/07-portfolio/design-insight-gatekeeper-sequencing.md |
| Date Produced | 2026-03-23 |
| Next Document | portfolio/resume-bullets/resume-bullets.md |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
