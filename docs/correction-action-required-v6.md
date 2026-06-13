# Correction Action Required — v6

**Project:** Salesforce Case Study: Lead — Priority Level Automation
**Repo:** `NathanielVMuncie/salesforce-priority-level-automation`
**CAR Version:** v6 (supersedes v5)

---

## Status Key

| Symbol | Meaning |
|---|---|
| ✅ | Closed — resolved and verified |
| ❌ | Open — action still required |

---

## Items

### CAR-008 ❌ Open
**Issue:** Screenshot index scope undefined — no decision recorded on which screenshots are required, what they must capture, and where they are stored in the repo.
**Action Required:** Define screenshot index: list of required screenshots, capture criteria, and repo path.

---

### CAR-009 ❌ Open
**Issue:** Lucid retirement decision still pending.
**Session 2026-06-12 note:** SVG diagrams designated as supplement to Lucid diagrams per Nathaniel's handoff instruction — both coexist. Retirement is not confirmed.
**Action Required:** Explicit decision — retire Lucid entirely or define which diagram types remain in Lucid vs. SVG.

---

### CAR-010 ✅ Closed
**Issue:** Purchasing Timeline picklist verification — specifically whether `Immediate Need (Contracting)` is the correct value in the live org.
**Resolution:** Confirmed correct against live org by Nathaniel — 2026-06-12.

---

### CAR-011 ✅ Closed
**Issue:** Pending commits and KB uploads for all session files including SVG diagrams.
**Resolution:** Three SVGs produced this session (`diagram-system-architecture.svg`, `diagram-scoring-flow.svg`, `diagram-territorial-routing.svg`) saved locally, committed to GitHub, and uploaded to Knowledge Bank — confirmed by Nathaniel 2026-06-12. Prior session SVG deliverables assumed committed under same confirmation.

---

### CAR-012 ✅ Closed
**Issue:** SVG diagram repo path not yet designated in documentation.
**Resolution:** Confirmed from 2026-06-13 session handoff — canonical path is `assets/diagrams/`. Architecture decision locked: SVG diagrams are canonical at `assets/diagrams/`, Lucid PNGs retired from repo.

---

### CAR-013 ❌ Open
**Issue:** Scoring Matrix diagram not yet produced.
**Detail:** Must show all three scoring tiers (Business Type, Role, Purchasing Timeline) with all five picklist values per tier and their point assignments (1–5). Source of truth: `scoring-model.md`.
**Action Required:** Produce `diagram-scoring-matrix.svg`. Commit to `assets/diagrams/`. Upload to KB.

---

### CAR-014 ❌ Open
**Issue:** Priority Level Threshold Bands diagram not yet produced.
**Detail:** Must show the score range 3–15 with three clearly labeled zones: Low (3–7), Medium (8–11), High (12–15). Must reflect the outcome-ordering requirement (High evaluated first).
**Action Required:** Produce `diagram-priority-thresholds.svg`. Commit to `assets/diagrams/`. Upload to KB.

---

### CAR-015 ❌ Open
**Issue:** `handoff-protocol-enforcer` skill routing table contains stale UUID for Céleste Vineyards sessions.
**Detail:** Skill routes to `3373a36cfb2b817a8b4ac5e372f5b3f3` (archived parent). Active parent is `36d3a36cfb2b807ea97ef0ae2fd7a57f`. Skill file is read-only — update must be applied by Nathaniel or via skill update workflow.
**Action Required:** Update skill routing table to replace stale UUID with `36d3a36cfb2b807ea97ef0ae2fd7a57f`.

---

### CAR-016 ❌ Open
**Issue:** `Required` attribute documented as `No` for three mandatory scoring fields in corpus docs.
**Detail:** `Business_Type__c`, `Role__c`, and `Purchasing_Timeline__c` are mandatory on the Wix inquiry form and integral to scoring. `Customer_Note__c` correctly remains `No`. Correction established 2026-06-13.
**Files Affected:** `docs/03-data-model/field-dictionary.md`, `docs/03-data-model/field-inventory.md`
**Action Required:** Update `Required | No` → `Required | Yes — mandatory on Wix inquiry form` for `Business_Type__c`, `Role__c`, `Purchasing_Timeline__c` in both files.

---

### CAR-017 ❌ Open
**Issue:** `LeadSource` value uses hyphen instead of em dash and is framed as a form label instead of a field value in corpus docs.
**Detail:** Correct value is `Céleste Vineyards — Business Inquiry Form` (em dash). It is the `LeadSource` picklist value written by Make.com — not a form name. Current corpus references use `Céleste Vineyards - Business Inquiry Form` (hyphen).
**Files Affected:** `docs/03-data-model/field-dictionary.md`, `docs/05-integration/source-to-lead-mapping.md`
**Action Required:** Replace all instances of `Céleste Vineyards - Business Inquiry Form` with `` `Céleste Vineyards — Business Inquiry Form` `` framed as the `LeadSource` value.

---

## Version History

| Version | Session Date | Items Added | Items Closed |
|---|---|---|---|
| v1 | — | CAR-001 through CAR-007 | — |
| v2 | — | — | CAR-001 through CAR-007 |
| v3 | — | CAR-008 through CAR-010 | — |
| v4 | — | CAR-011 through CAR-012 | — |
| v5 | 2026-06-12 | CAR-013, CAR-014, CAR-015 | CAR-010, CAR-011 |
| v6 | 2026-06-13 | CAR-016, CAR-017 | CAR-012 |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
