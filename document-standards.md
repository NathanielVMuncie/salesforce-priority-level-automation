# Document Standards

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | Knowledge Bank

---

## 1. Document Purpose

This document defines the canonical format standards for every file in the Céleste Vineyards Lead Priority Level Automation repository. These rules are locked. No file is committed without satisfying all applicable rules. When a rule conflicts with a stylistic preference, the rule wins.

`README.md` is the sole exception to the header and Document Status standards. See Sections 2.3 and 4.3.

---

## 2. Header Standard

### 2.1 Required Format

Every documentation file in `docs/`, `metadata/`, `test-artifacts/`, and `portfolio/` opens with this exact three-line header:

```
# [Document Title]

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | [Category Label]
```

**Line 1** — H1 title. Document title only. No project name, no phase label, no version.

**Line 2** — Bold project name with em dash. Exact string: `**Salesforce Case Study: Lead — Priority Level Automation**`

**Line 3** — Plain text. Never bolded. Format: `Céleste Vineyards | [Category Label]`

A blank line separates Line 1 from Line 2. Lines 2 and 3 are adjacent with no blank line between them.

### 2.2 Category Labels

| Folder | Category Label |
|---|---|
| `docs/01-overview/` | Overview |
| `docs/02-architecture/` | Architecture |
| `docs/03-data-model/` | Data Model |
| `docs/04-automation-logic/` | Automation Logic |
| `docs/05-integration/` | Integration |
| `docs/06-build-assets/` | Build Assets |
| `docs/07-portfolio/` | Portfolio |
| `metadata/` | Metadata |
| `test-artifacts/` | Validation and Evidence |
| `portfolio/` | Portfolio |

Files that serve multiple folders use `Knowledge Bank`.

### 2.3 README.md Exception

`README.md` is exempt from the three-line header. It opens with:

```
# Salesforce Case Study: Lead — Priority Level Automation

[One-line subtitle]
```

All other standards — footer, backtick usage, em dash, terminology — apply to `README.md` without exception. Document Status does not apply — see Section 4.3.

---

## 3. Footer Standard

### 3.1 Required Format

Every file closes with this exact footer as the final line:

```
*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
```

**Rules:**
- Em dash (`—`) between project name and `Built by` — not a hyphen (`-`)
- Pipe (`|`) separator — not a slash (`/`)
- Middle initial `V.` required — `Nathaniel V. Muncie`
- Accent on `é` in Céleste required throughout — `Céleste Vineyards`
- Wrapped in single asterisks for italics

### 3.2 Prohibited Footer Variants

| Violation | Example |
|---|---|
| Hyphen instead of em dash | `Salesforce Case Study: Lead - Priority Level Automation` |
| Slash instead of pipe | `Built by Nathaniel V. Muncie / Céleste Vineyards` |
| Missing middle initial | `Built by Nathaniel Muncie` |
| Missing accent | `Celeste Vineyards` |
| Wrong separator order | `Céleste Vineyards — Salesforce Case Study...` |

---

## 4. Document Status Section

### 4.1 Permitted Fields

The Document Status table at the end of every file contains exactly two fields:

```
## [N]. Document Status

| Attribute | Value |
|---|---|
| Section | [Category Label] |
| File Path | `docs/[folder]/[filename].md` |
```

`Section` uses the same category label as Line 3 of the header.

`File Path` uses the repo-relative path in backticks.

### 4.2 Prohibited Fields

These fields must not appear in Document Status:
- `Date Produced`
- `Status`
- `Phase`
- `Next Document`
- `Author`

### 4.3 README.md Document Status

`README.md` does not contain a Document Status section. No Document Status table of any kind appears in `README.md`.

---

## 5. Backtick Usage

### 5.1 Required

Backticks are required for all of the following when they appear in body text, tables, or headers:
- Field API names — `Business_Type__c`, `varTotalScore`, `OwnerId`
- Picklist values — `Personal/Individual (Non-Business)`, `Not Applicable`, `High`
- Flow variable names — `varTotalScore`, `varPriorityLevel`, `varOwnerID`
- Flow element labels — `Determine_Business_Type_Score`, `Update Lead Priority and Score`
- File paths — `docs/04-automation-logic/scoring-logic.md`
- Make.com module references — `Module 12`, `Module 13`
- Salesforce object API names — `Lead`, `Opportunity`

### 5.2 Not Required

- Technology names used as nouns — Make.com, Wix, Salesforce, Flow
- Section headers
- General prose references to concepts

---

## 6. Em Dash Usage

Em dash (`—`) is required in:
- The project name: `Lead — Priority Level Automation`
- The footer separator
- Inline prose where an em dash is grammatically appropriate

Hyphen (`-`) must not substitute for em dash in the project name or footer.

---

## 7. Terminology

### 7.1 Locked Terms

| Term | Required Usage | Prohibited |
|---|---|---|
| Project name (in documents) | `Salesforce Case Study: Lead — Priority Level Automation` | Any hyphen variant |
| Project name (in chat) | Céleste Vineyards | Full document title in chat |
| Client name | Céleste Vineyards | Celeste Vineyards (no accent) |
| Flow name | `Lead_Scoring_and_Priority_Level_Assignment` | Paraphrases or shortened versions |
| Scoring variable | `varTotalScore` | "total score", "score variable" |
| Priority output variable | `varPriorityLevel` | "priority variable" |
| Owner variable | `varOwnerID` | "owner ID variable" |
| Gatekeeper element | `Determine_Business_Type_Score` | "gatekeeper element", "gate" in isolation |
| Escalation target | Sophia Delgado | "the National Sales Director" as substitute |
| DevOrg constraint | "DevOrg constraint" | "limitation", "gap", "shortfall" |

### 7.2 Field References

When referencing a Salesforce field in body text, always use the API name in backticks. The field label may appear in prose for readability, but the API name must be present for any technical claim.

Correct: The `Priority_Level__c` picklist field stores the assigned Priority Level.

Incorrect: The Priority Level field stores the assigned Priority Level.

### 7.3 Salesforce Term Capitalization

Salesforce Fields, Objects, and pipeline-specific terms must always be capitalized when referenced in prose: Lead, Queue, Owner, Agent, Priority Level, Assignment Rule, Flow.

---

## 8. Prohibited Content

These items must not appear in any committed file:
- `TBD` values anywhere
- Phase labels in headers
- Bolded Line 3 in the header
- Hyphen in place of em dash in the project name or footer
- Slash in place of pipe in the footer
- Missing middle initial `V.` in the author name
- Missing accent on `Céleste`
- Forward-looking language that is not yet true
- "segment" or "phase" used as structural labels for Flow divisions
- `Qualified__c` — purged field, must not appear in any file
- `Qualification_Status__c` — purged field, must not appear in any file
- `varQualified` — purged variable, must not appear in any file
- ✅ Qualified or ❌ Not Qualified display strings — must not appear in any file

---

## 9. Pre-Commit Checklist

**Header**
- [ ] H1 title is document title only — no project name, no phase
- [ ] Line 2 is bold project name with em dash — exact string match
- [ ] Line 3 is plain text — not bolded — correct category label
- [ ] Blank line between H1 and Line 2

**Footer**
- [ ] Em dash between project name and `Built by`
- [ ] Pipe between project name and `Built by`
- [ ] `Nathaniel V. Muncie` — middle initial present
- [ ] `Céleste Vineyards` — accent present throughout file
- [ ] Wrapped in single asterisks

**Document Status**
- [ ] Section and File Path only — no prohibited fields
- [ ] File path is repo-relative and in backticks
- [ ] README.md — no Document Status section present

**Body**
- [ ] All field API names in backticks
- [ ] All picklist values in backticks
- [ ] All Flow variable names in backticks
- [ ] All Flow element labels in backticks
- [ ] All file paths in backticks
- [ ] All Salesforce Fields, Objects, and pipeline terms capitalized
- [ ] No `Qualified__c`, `Qualification_Status__c`, or `varQualified` anywhere in the file
- [ ] No ✅ Qualified or ❌ Not Qualified display strings anywhere in the file
- [ ] No `TBD` values anywhere in the file
- [ ] No forward-looking language about content not yet written
- [ ] No "segment" or "phase" used as structural labels for Flow divisions

---

## 10. Document Status

| Attribute | Value |
|---|---|
| Section | Knowledge Bank |
| File Path | `docs/document-standards.md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
