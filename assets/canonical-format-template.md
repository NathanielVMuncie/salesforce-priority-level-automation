Here is the canonical format template for all project files (README.md excluded):

---

```markdown
# [Document Title]

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards | [Category Label]

---

## 1. [Section content...]

---

## [N]. Document Status

| Attribute | Value |
|---|---|
| Section | [Category Label] |
| File Path | `docs/[folder]/[filename].md` |

---

*Salesforce Case Study: Lead — Priority Level Automation | Built by Nathaniel V. Muncie*
```

---

**Category Labels by folder:**

| Folder | Label |
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
| Cross-folder files | Knowledge Bank |

**Critical rules:**

- Line 1: H1 — document title only. No project name, no phase, no version.
- Line 2: Bold project name — em dash required, not hyphen.
- Line 3: Plain text — never bolded. Pipe separator, not slash.
- Blank line between Line 1 and Line 2. No blank line between Lines 2 and 3.
- Document Status: `Section` and `File Path` only — no `Date Produced`, `Status`, `Phase`, `Next Document`, or `Author`.
- File Path value always in backticks, repo-relative.
- Footer: em dash, pipe, `Nathaniel V. Muncie` (middle initial required), `Céleste` (accent required), wrapped in single asterisks.
- Footer is the absolute final line — no trailing blank lines.