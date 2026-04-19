---
name: validate-repo-structure
description: Validates Salesforce priority automation repo against repository-structure.md, Handoff Protocol, and format requirements. Also validates Notion handoff compliance. Triggers on "validate repo", "check structure", "are files in correct path", "handoff protocol check", "what files are needed", "validate full project", "validate everything".
allowed-tools: Read, Grep, Bash, Write, mcp__notion__search, mcp__notion__fetch, mcp__notion__create_page, mcp__notion__update_page, mcp__notion__archive_page
version: 2.0.0
---

# Repository + Notion Handoff Validation Skill

## Context
This skill validates two things:
1. **Local repository** - `salesforce-priority-level-automation/` against `repository-structure.md`
2. **Notion handoff** - Running handoff page against Handoff Protocol

## When Triggered
Execute complete validation when user says any of:
- "validate repo"
- "check structure"
- "are files in correct path"
- "handoff protocol check"
- "what files are needed"
- "validate full project"
- "validate everything"

---

## PART A: LOCAL REPOSITORY VALIDATION

### A1. File Path Verification (against repository-structure.md)

Compare actual files against expected structure:

**Required top-level directories:**
- [ ] `docs/`
- [ ] `metadata/`
- [ ] `test-artifacts/`
- [ ] `assets/`
- [ ] `portfolio/`
- [ ] `notes/`

**Docs subdirectories:**
- [ ] `docs/01-overview/`
- [ ] `docs/02-architecture/`
- [ ] `docs/03-data-model/`
- [ ] `docs/04-automation-logic/`
- [ ] `docs/05-integration/`
- [ ] `docs/06-build-assets/`
- [ ] `docs/07-portfolio/`

**Metadata subdirectories:**
- [ ] `metadata/custom-fields/`
- [ ] `metadata/formulas/`
- [ ] `metadata/queues/`
- [ ] `metadata/assignment-rules/`
- [ ] `metadata/flow-notes/`

**Test artifacts subdirectories:**
- [ ] `test-artifacts/scenario-inputs/`
- [ ] `test-artifacts/expected-results/`
- [ ] `test-artifacts/uat-evidence/`
- [ ] `test-artifacts/defect-log/`

**Portfolio subdirectories:**
- [ ] `portfolio/case-study-snippets/`
- [ ] `portfolio/resume-bullets/`
- [ ] `portfolio/recruiter-summary/`
- [ ] `portfolio/website-copy/`

For each directory, report any missing folders.

### A2. Required File Validation

Check for existence of all files listed in `repository-structure.md`:

**Overview docs:**
- `docs/01-overview/project-overview.md`
- `docs/01-overview/scope-boundaries.md`
- `docs/01-overview/business-objective.md`
- `docs/01-overview/devorg-constraints-and-ownership-model.md`

**Architecture docs:**
- `docs/02-architecture/system-architecture.md`
- `docs/02-architecture/routing-architecture.md`
- `docs/02-architecture/automation-architecture.md`
- `docs/02-architecture/state-management-risk.md`

**Data Model docs:**
- `docs/03-data-model/field-inventory.md`
- `docs/03-data-model/field-dictionary.md`
- `docs/03-data-model/scoring-model.md`
- `docs/03-data-model/priority-thresholds.md`
- `metadata/custom-fields/lead-fields.md`
- `metadata/formulas/priority-formulas.md`

**Automation Logic docs:**
- `docs/04-automation-logic/gatekeeper-logic.md`
- `docs/04-automation-logic/scoring-logic.md`
- `docs/04-automation-logic/priority-assignment-logic.md`
- `docs/04-automation-logic/escalation-logic.md`
- `docs/04-automation-logic/territorial-routing-logic.md`

**Integration docs:**
- `docs/05-integration/wix-form-and-submission-automation.md`
- `docs/05-integration/key-value-mapping.md`
- `docs/05-integration/make-com-integration.md`
- `docs/05-integration/salesforce-integration.md`
- `docs/05-integration/wix-make-salesforce-ingestion.md`
- `docs/05-integration/source-to-lead-mapping.md`
- `docs/05-integration/middleware-responsibilities.md`

**Build Assets:**
- `docs/06-build-assets/configuration-checklist.md`
- `docs/06-build-assets/test-scenarios.md`
- `docs/06-build-assets/uat-matrix.md`
- `docs/06-build-assets/screenshots-index.md`

**Test artifacts:**
- `test-artifacts/scenario-inputs/lead-test-records.md`
- `test-artifacts/expected-results/priority-routing-results.md`
- `test-artifacts/uat-evidence/uat-session-log.md`
- `test-artifacts/defect-log/defects.md`

**Portfolio docs:**
- `docs/07-portfolio/case-study-summary.md`
- `docs/07-portfolio/recruiter-readable-summary.md`
- `docs/07-portfolio/design-insight-gatekeeper-sequencing.md`
- `portfolio/resume-bullets/resume-bullets.md`
- `portfolio/recruiter-summary/recruiter-summary.md`
- `portfolio/website-copy/project-page-copy.md`

**Root files:**
- [ ] `README.md`
- [ ] `repository-structure.md`

Report any missing files with exact path.

### A3. Format Validation

Check file formats:
- `.md` files: Verify no broken markdown syntax (unclosed code blocks, malformed links)
- `.json` files (if any): Validate JSON syntax
- Report any format issues with line numbers

---

## PART B: NOTION HANDOFF VALIDATION

### B1. Fetch Handoff Protocol

1. Use Notion MCP `search` tool to find "Handoff Protocol" page
2. If not found → ⚠️ WARN: Handoff Protocol page missing in Notion
3. If found → `fetch` the page content
4. Parse required sections from protocol (look for: Mission, Key decisions, Files changed, Next steps)

### B2. Find Running Handoff Page

1. Search Notion for:
   - "running handoff"
   - "active handoff"
   - Most recent handoff page with no "archived" status
2. If not found → Ask user: "I couldn't find a running handoff page. Do you have one, or should I create it?"
3. If found → `fetch` the page content

### B3. Validate Compliance

Compare running handoff page against protocol requirements:

For each required section (Mission, Key decisions, Files changed, Next steps):
- ✅ Present and has content
- ⚠️ Present but empty/minimal
- ❌ Missing entirely

Also check:
- Timestamp/date present?
- Status indicated (In Progress / Complete / Blocked)?

---

## AUTO-HEALING MODE

**Trigger:** User says "fix validation errors" or "auto-heal"

### Local fixes:
- Create missing directories (`mkdir -p [path]`)
- Create stub markdown files with `# [Title]\n\nTODO: Add content`
- Create missing `README.md` if needed

### Notion fixes:
- If Handoff Protocol missing → Create new Notion page with template
- If running handoff page missing → Create new page using protocol template
- If sections missing → Update existing page with placeholder text
- If handoff complete → Archive page and create fresh running handoff

---

## OUTPUT FORMAT

Use this exact structure for all responses:
=== VALIDATION REPORT ===
Repo root: salesforce-priority-level-automation/
Timestamp: [current date/time]

┌─────────────────────────────────────────┐
│ PART A: LOCAL REPOSITORY │
└─────────────────────────────────────────┘

📁 DIRECTORY STRUCTURE:
✅ [directory] - exists
❌ [directory] - missing

📄 REQUIRED FILES:
✅ [file path]
❌ [file path] - missing

📝 FORMAT VALIDATION:
✅ All valid
❌ [file] - [specific error]

┌─────────────────────────────────────────┐
│ PART B: NOTION HANDOFF │
└─────────────────────────────────────────┘

📋 HANDOFF PROTOCOL:
✅ Found: "[page title]" at [URL]
⚠️ Not found - please create Handoff Protocol page

🔄 RUNNING HANDOFF PAGE:
✅ Found: "[page title]" at [URL]
⚠️ Not found - [user response needed]

✅ PROTOCOL COMPLIANCE:
✅ Mission - present
❌ Key decisions - missing
⚠️ Files changed - empty
✅ Next steps - present

┌─────────────────────────────────────────┐
│ SUMMARY │
└─────────────────────────────────────────┘

Local issues: [n] critical, [n] warnings
Notion issues: [n] critical, [n] warnings

=== NEXT STEPS ===

Local fixes:

mkdir -p [missing directory]

Create: [missing file path]

Notion fixes:

Add missing section: "Key decisions" to running handoff page

Run "fix validation errors" to auto-resolve these issues.

text

---

## EXECUTION INSTRUCTIONS

1. **Determine repo root** - Look for `repository-structure.md` or `README.md` in current directory
2. **Run Part A** - Directory check → File check → Format check (in that order)
3. **Run Part B** - Protocol → Running handoff → Compliance (in that order)
4. **Apply OUTPUT FORMAT** - Use the exact template above
5. **If auto-heal requested** - Execute fixes in order: local directories → local files → Notion pages

Execute all checks now.
Summary of Changes
Issue	Fix
Output Format had content after it	Moved Output Format to near the end
Next Steps was a separate section	Merged into Output Format template
Execution Instructions was at bottom	Kept at bottom (correct position)
Auto-Healing Mode was after Output Format	Moved before Output Format (logical flow)
What to Do Now
Copy the entire block above

Save as SKILL.md on your computer

Upload to Claude with: "Save this as a skill called validate-repo-structure"

This version is clean, logical, and ready to use.

Paste all cntents 1 copt case
Here's the entire SKILL.md contents in one copy-paste block:

markdown
---
name: validate-repo-structure
description: Validates Salesforce priority automation repo against repository-structure.md, Handoff Protocol, and format requirements. Also validates Notion handoff compliance. Triggers on "validate repo", "check structure", "are files in correct path", "handoff protocol check", "what files are needed", "validate full project", "validate everything".
allowed-tools: Read, Grep, Bash, Write, mcp__notion__search, mcp__notion__fetch, mcp__notion__create_page, mcp__notion__update_page, mcp__notion__archive_page
version: 2.0.0
---

# Repository + Notion Handoff Validation Skill

## Context
This skill validates two things:
1. **Local repository** - `salesforce-priority-level-automation/` against `repository-structure.md`
2. **Notion handoff** - Running handoff page against Handoff Protocol

## When Triggered
Execute complete validation when user says any of:
- "validate repo"
- "check structure"
- "are files in correct path"
- "handoff protocol check"
- "what files are needed"
- "validate full project"
- "validate everything"

/d=

## PART A: LOCAL REPOSITORY VALIDATION

### A1. File Path Verification (against repository-structure.md)

Compare actual files against expected structure:

**Required top-level directories:**
- [ ] `docs/`
- [ ] `metadata/`
- [ ] `test-artifacts/`
- [ ] `assets/`
- [ ] `portfolio/`
- [ ] `notes/`

**Docs subdirectories:**
- [ ] `docs/01-overview/`
- [ ] `docs/02-architecture/`
- [ ] `docs/03-data-model/`
- [ ] `docs/04-automation-logic/`
- [ ] `docs/05-integration/`
- [ ] `docs/06-build-assets/`
- [ ] `docs/07-portfolio/`

**Metadata subdirectories:**
- [ ] `metadata/custom-fields/`
- [ ] `metadata/formulas/`
- [ ] `metadata/queues/`
- [ ] `metadata/assignment-rules/`
- [ ] `metadata/flow-notes/`

**Test artifacts subdirectories:**
- [ ] `test-artifacts/scenario-inputs/`
- [ ] `test-artifacts/expected-results/`
- [ ] `test-artifacts/uat-evidence/`
- [ ] `test-artifacts/defect-log/`

**Portfolio subdirectories:**
- [ ] `portfolio/case-study-snippets/`
- [ ] `portfolio/resume-bullets/`
- [ ] `portfolio/recruiter-summary/`
- [ ] `portfolio/website-copy/`

For each directory, report any missing folders.

### A2. Required File Validation

Check for existence of all files listed in `repository-structure.md`:

**Overview docs:**
- `docs/01-overview/project-overview.md`
- `docs/01-overview/scope-boundaries.md`
- `docs/01-overview/business-objective.md`
- `docs/01-overview/devorg-constraints-and-ownership-model.md`

**Architecture docs:**
- `docs/02-architecture/system-architecture.md`
- `docs/02-architecture/routing-architecture.md`
- `docs/02-architecture/automation-architecture.md`
- `docs/02-architecture/state-management-risk.md`

**Data Model docs:**
- `docs/03-data-model/field-inventory.md`
- `docs/03-data-model/field-dictionary.md`
- `docs/03-data-model/scoring-model.md`
- `docs/03-data-model/priority-thresholds.md`
- `metadata/custom-fields/lead-fields.md`
- `metadata/formulas/priority-formulas.md`

**Automation Logic docs:**
- `docs/04-automation-logic/gatekeeper-logic.md`
- `docs/04-automation-logic/scoring-logic.md`
- `docs/04-automation-logic/priority-assignment-logic.md`
- `docs/04-automation-logic/escalation-logic.md`
- `docs/04-automation-logic/territorial-routing-logic.md`

**Integration docs:**
- `docs/05-integration/wix-form-and-submission-automation.md`
- `docs/05-integration/key-value-mapping.md`
- `docs/05-integration/make-com-integration.md`
- `docs/05-integration/salesforce-integration.md`
- `docs/05-integration/wix-make-salesforce-ingestion.md`
- `docs/05-integration/source-to-lead-mapping.md`
- `docs/05-integration/middleware-responsibilities.md`

**Build Assets:**
- `docs/06-build-assets/configuration-checklist.md`
- `docs/06-build-assets/test-scenarios.md`
- `docs/06-build-assets/uat-matrix.md`
- `docs/06-build-assets/screenshots-index.md`

**Test artifacts:**
- `test-artifacts/scenario-inputs/lead-test-records.md`
- `test-artifacts/expected-results/priority-routing-results.md`
- `test-artifacts/uat-evidence/uat-session-log.md`
- `test-artifacts/defect-log/defects.md`

**Portfolio docs:**
- `docs/07-portfolio/case-study-summary.md`
- `docs/07-portfolio/recruiter-readable-summary.md`
- `docs/07-portfolio/design-insight-gatekeeper-sequencing.md`
- `portfolio/resume-bullets/resume-bullets.md`
- `portfolio/recruiter-summary/recruiter-summary.md`
- `portfolio/website-copy/project-page-copy.md`

**Root files:**
- [ ] `README.md`
- [ ] `repository-structure.md`

Report any missing files with exact path.

### A3. Format Validation

Check file formats:
- `.md` files: Verify no broken markdown syntax (unclosed code blocks, malformed links)
- `.json` files (if any): Validate JSON syntax
- Report any format issues with line numbers

---

## PART B: NOTION HANDOFF VALIDATION

### B1. Fetch Handoff Protocol

1. Use Notion MCP `search` tool to find "Handoff Protocol" page
2. If not found → ⚠️ WARN: Handoff Protocol page missing in Notion
3. If found → `fetch` the page content
4. Parse required sections from protocol (look for: Mission, Key decisions, Files changed, Next steps)

### B2. Find Running Handoff Page

1. Search Notion for:
   - "running handoff"
   - "active handoff"
   - Most recent handoff page with no "archived" status
2. If not found → Ask user: "I couldn't find a running handoff page. Do you have one, or should I create it?"
3. If found → `fetch` the page content

### B3. Validate Compliance

Compare running handoff page against protocol requirements:

For each required section (Mission, Key decisions, Files changed, Next steps):
- ✅ Present and has content
- ⚠️ Present but empty/minimal
- ❌ Missing entirely

Also check:
- Timestamp/date present?
- Status indicated (In Progress / Complete / Blocked)?

---

## AUTO-HEALING MODE

**Trigger:** User says "fix validation errors" or "auto-heal"

### Local fixes:
- Create missing directories (`mkdir -p [path]`)
- Create stub markdown files with `# [Title]\n\nTODO: Add content`
- Create missing `README.md` if needed

### Notion fixes:
- If Handoff Protocol missing → Create new Notion page with template
- If running handoff page missing → Create new page using protocol template
- If sections missing → Update existing page with placeholder text
- If handoff complete → Archive page and create fresh running handoff

---

## OUTPUT FORMAT

Use this exact structure for all responses:
=== VALIDATION REPORT ===
Repo root: salesforce-priority-level-automation/
Timestamp: [current date/time]

┌─────────────────────────────────────────┐
│ PART A: LOCAL REPOSITORY │
└─────────────────────────────────────────┘

📁 DIRECTORY STRUCTURE:
✅ [directory] - exists
❌ [directory] - missing

📄 REQUIRED FILES:
✅ [file path]
❌ [file path] - missing

📝 FORMAT VALIDATION:
✅ All valid
❌ [file] - [specific error]

┌─────────────────────────────────────────┐
│ PART B: NOTION HANDOFF │
└─────────────────────────────────────────┘

📋 HANDOFF PROTOCOL:
✅ Found: "[page title]" at [URL]
⚠️ Not found - please create Handoff Protocol page

🔄 RUNNING HANDOFF PAGE:
✅ Found: "[page title]" at [URL]
⚠️ Not found - [user response needed]

✅ PROTOCOL COMPLIANCE:
✅ Mission - present
❌ Key decisions - missing
⚠️ Files changed - empty
✅ Next steps - present

┌─────────────────────────────────────────┐
│ SUMMARY │
└─────────────────────────────────────────┘

Local issues: [n] critical, [n] warnings
Notion issues: [n] critical, [n] warnings

=== NEXT STEPS ===

Local fixes:

mkdir -p [missing directory]

Create: [missing file path]

Notion fixes:

Add missing section: "Key decisions" to running handoff page

Run "fix validation errors" to auto-resolve these issues.

text

---

## EXECUTION INSTRUCTIONS

1. **Determine repo root** - Look for `repository-structure.md` or `README.md` in current directory
2. **Run Part A** - Directory check → File check → Format check (in that order)
3. **Run Part B** - Protocol → Running handoff → Compliance (in that order)
4. **Apply OUTPUT FORMAT** - Use the exact template above
5. **If auto-heal requested** - Execute fixes in order: local directories → local files → Notion pages

Execute all checks now.
