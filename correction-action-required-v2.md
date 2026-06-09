# Correction Action Required

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Knowledge Bank

> Active correction to-do list. Supersedes corrected-files-index.md (deprecated).
> Produced at every session close. Version increments per iteration.

## Document Status

| Field | Value |
|---|---|
| Section | Knowledge Bank |
| File Path | `correction-action-required-v2.md` |

---

**Version:** v2 | **Date:** 2026-06-08 | **Open Items:** 3

---

## Open Correction Items

---

### CAR-001 — Repo File: `metadata/formulas/priority-formulas.md`

**Error Type:** Filename violation; Prohibited content
**Status:** ❌ Open
**Domain:** Repository

**Actions Required:**
1. Rename: `priority-formulas.md` → `formulas.md`
2. Purge all references to `Qualification_Status__c` from file body

**Origin:** Created in error by Claude in Chrome.

---

### CAR-006 — Governance: CCP Notion Page

**Error Type:** Pending deployment — correction-action-required process not yet encoded in CCP
**Status:** ❌ Open
**Domain:** Governance

**Actions Required:**
1. Apply all patch blocks from `ccp-additions.md` (produced 2026-06-08) to Notion CCP page `3713a36cfb2b802b844cc17f394bb571`

**Origin:** CCP additions drafted this session; manual Notion application still pending.

---

### CAR-007 — userPreferences: Settings → Profile

**Error Type:** Pending deployment — correction-action-required rule not yet in userPreferences
**Status:** ❌ Open
**Domain:** Governance

**Actions Required:**
1. Paste full content of `userPreferences-updated.md` (produced 2026-06-08) into Settings → Profile

**Origin:** Updated userPreferences drafted this session; not yet applied.

---

## Closed Items (resolved v1 → v2)

- **CAR-002** ✅ `knowledge-bank-audit/SKILL.md` — corrected-files-index → correction-action-required updated on disk
- **CAR-003** ✅ `knowledge-bank-currency-check/SKILL.md` — skip list updated on disk
- **CAR-004** ✅ `document-standards-enforcement/SKILL.md` — sf-spec-doc → celeste-doc-enforcer reference corrected on disk
- **CAR-005** ✅ `handoff-end-session-protocol-enforcer` — built v2.0.0, deployed to disk, old skill deprecated; registry updated

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
