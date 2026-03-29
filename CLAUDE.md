# CLAUDE.md — Salesforce Lead Priority Level Automation

**Repository:** `github.com/NathanielVMuncie/salesforce-priority-level-automation`
**Author:** Nathaniel Muncie — Salesforce Administrator candidate
**Standing instructions for AI assistants working in this repository**

---

## Project Identity

This is a Salesforce lead scoring and priority automation system built as a portfolio case study for a fictional winery, **Céleste Vineyards**. The full project title is:

> **Salesforce Case Study: Lead — Priority Level Automation**

The system is **fully operational and live** in a Salesforce Developer Edition org. All documentation is produced in reverse documentation mode from the operational system.

All work must remain scoped exclusively to this project. Do not introduce context, recommendations, or content from outside the project.

---

## What This System Does

Inbound B2B leads arrive via a Wix inquiry form, pass through Make.com middleware, and enter Salesforce where a Record-Triggered After-Save Flow:

1. Evaluates qualification (gatekeeper check on `Business_Type__c`)
2. Calculates a weighted priority score across three dimensions: Business Type, Role, and Purchasing Timeline
3. Assigns a Priority Level (High / Medium / Low / Disqualified)
4. Routes the Lead to the correct owner based on territory (Assignment Rules) and escalation (High priority → Sophia Delgado)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Lead Capture | Wix (web form) |
| Middleware | Make.com |
| CRM | Salesforce Sales Cloud — Developer Edition org |
| Automation | Salesforce Flow — Record-Triggered, After-Save (V7, 27 elements) |
| Routing | Assignment Rules, Queues |
| Custom Fields | 9 custom fields + 3 formula fields on the Lead object |

No external languages or frameworks. System is 100% Salesforce native configuration.

---

## Repository Structure

```
salesforce-priority-level-automation/
├── README.md                          # Project entry point — read this first
├── CLAUDE.md                          # This file
├── notes/
│   └── claude-project-instructions.md  # Standing session instructions (legacy AI context file)
├── docs/
│   ├── 01-overview/                   # Business context, scope, objectives
│   ├── 02-architecture/               # System, automation, routing, state management
│   ├── 03-data-model/                 # Field inventory, dictionary, scoring model (Phase 1 blocker)
│   ├── 04-automation-logic/           # Gatekeeper, scoring, priority, escalation, routing logic
│   ├── 05-integration/                # Wix, Make.com, Salesforce field mapping
│   ├── 06-build-assets/               # UAT matrix, test scenarios, defects, screenshots
│   └── 07-portfolio/                  # Case study, recruiter summaries, design insights
├── metadata/
│   ├── custom-fields/lead-fields.md   # Raw XML metadata for 9 custom Lead fields
│   ├── formulas/priority-formulas.md  # 3 formula field definitions
│   └── assignment-rules/lead-assignment-rules.md  # 3 rule entries, all 51 territories
├── test-artifacts/
│   ├── scenario-inputs/               # Exact Lead input values for each test scenario
│   ├── uat-evidence/                  # Session logs, sign-off records
│   └── defect-log/                    # Defect register (D-01 resolved)
├── portfolio/
│   ├── resume-bullets/
│   ├── recruiter-summary/
│   ├── case-study-snippets/
│   └── website-copy/
└── assets/
    ├── screenshots/
    └── exports/
```

---

## System Architecture

```
Prospect Form Submission (Wix)
    ↓
Wix Automation → HTTP POST
    ↓
Make.com Webhook (Module 1)
    ↓
Router evaluates business_type (Module 2)
    ├─→ Qualified path (Module 12) → Standard field mapping
    └─→ Non-Qualified path (Module 13) → Placeholder field mapping
    ↓
Salesforce Lead Record Created
    ↓
Assignment Rule fires → State/Province → Regional Queue
    ↓
After-Save Flow triggers (Lead_Scoring_and_Priority_Level_Assignment)
    ↓
    Segment 1: Gatekeeper + Business Type Scoring
    Segment 2: Role Scoring → Purchasing Timeline Scoring
    Segment 3: Priority Level Assignment (High ≥12 / Medium ≥8 / Low default)
    Segment 4: Escalation (High → Sophia Delgado OwnerId override)
    Segment 5: Single DML Write (OwnerId, Priority_Level__c, Qualified__c)
    ↓
Final Lead owned by:
    ├─→ High Priority: Sophia Delgado (National Sales Director)
    ├─→ Medium Priority: Regional Queue (by state)
    └─→ Low Priority: Regional Queue (by state)
```

---

## Data Model

### Custom Fields (9 total on Lead object)

| Field API Name | Type | Purpose |
|---|---|---|
| `Business_Type__c` | Picklist | Scoring input — gatekeeper trigger |
| `Role__c` | Picklist | Scoring input — contact seniority |
| `Purchasing_Timeline__c` | Picklist | Scoring input — urgency signal |
| `Priority_Level__c` | Picklist | Output — assigned by Flow |
| `Qualified__c` | Checkbox | Gatekeeper flag (default: True) |
| `Customer_Note__c` | Long Text Area | Inquiry note from form |
| `Region__c` | Formula (Text) | Derived from State → East/West/Central/International |
| `Qualification_Status__c` | Formula (Text) | Display field — "✅ Qualified" or "❌ Not Qualified" |
| `Lead_Created__c` | Formula (Date) | DATEVALUE(CreatedDate) |

### Scoring Model

| Dimension | Field | Max Points |
|---|---|---|
| Business Type | `Business_Type__c` | 5 |
| Role | `Role__c` | 5 |
| Purchasing Timeline | `Purchasing_Timeline__c` | 5 |
| **Total Range** | | **3–15** |

### Priority Thresholds

| Priority Level | Condition |
|---|---|
| High | `varTotalScore` ≥ 12 |
| Medium | `varTotalScore` ≥ 8 |
| Low | Default (below 8) |
| Disqualified | Business_Type__c = "Personal/Individual (Non-Business)" |

### Business Type Scoring Values

| Value | Points |
|---|---|
| Premium Wine Distributor | 5 |
| Upscale Restaurant | 4 |
| High-End Wine Store | 3 |
| Catering & Event Company | 2 |
| Specialty Gourmet Grocer | 2 |
| Personal/Individual (Non-Business) | DISQUALIFIER — exits Flow immediately |

---

## Salesforce Flow Details

**Flow Name:** Lead Scoring and Priority Level Assignment V7
**Type:** Record-Triggered, After-Save
**Trigger:** Lead created where `LeadSource` = "Céleste Vineyards - Business Inquiry Form"
**Status:** Active
**Total Elements:** 27

### Flow Variables

| Variable | Type | Initial Value | Written By |
|---|---|---|---|
| `varTotalScore` | Number | 0 | Segments 1 and 2 |
| `varPriorityLevel` | Text | — | Segment 3 |
| `varOwnerID` | Text | — | Segment 4 |
| `varQualified` | Boolean | True | Segment 1 (disqualified path only) |

### Governor Limit Profile

- DML statements used: **1** (Update Records, Segment 5)
- DML limit: 150 per transaction
- Pattern is bulk-safe and handles batch Lead creation without limit risk

---

## Assignment Rules

**Rule Name:** Lead Assignment Rule
**Object:** Lead
**Evaluation Field:** State/Province

| Region | Queue | States Covered |
|---|---|---|
| East Coast | East_Coast_Region | AL, CT, DE, DC, FL, GA, ME, MD, MA, NH, NJ, NY, NC, PA, RI, SC, TN, VT, VA, WV (20 + DC) |
| West Coast | West_Coast_Region | AK, AZ, CA, CO, HI, ID, MT, NV, NM, OR, UT, WA, WY (13) |
| Central | Central_Region | AR, IL, IN, IA, KS, KY, LA, MI, MN, MS, MO, NE, ND, OH, OK, SD, TX, WI (18) |

All 50 states + District of Columbia are covered.

---

## Integration: Make.com Scenario

**Scenario Name:** `Wix_To_CelesteProd_B2B_Lead_Engine_v1`

| Module | Role |
|---|---|
| Module 1 | Custom Webhook — receives HTTP POST from Wix |
| Module 2 | Router — evaluates `business_type` key |
| Module 12 | Salesforce Create Record — qualified path, full field mapping |
| Module 13 | Salesforce Create Record — non-qualified path, placeholder values |

**Phone normalization (Module 12):**
```
replace(trim(2. data: phone); /^\+?1?(\d{3})(\d{3})(\d{4})$/; +1 ($1) $2-$3)
```

**Hardcoded on both paths:**
- `LeadSource` = "Céleste Vineyards - Business Inquiry Form"

---

## Testing Summary

Three scenarios validated end-to-end in the live org. All 61 UAT acceptance criteria passed.

| Scenario | Input Profile | Score | Priority | Owner | Result |
|---|---|---|---|---|---|
| S-01: Richard Miranda | Specialty Gourmet Grocer / Sales Manager / Budget Planning | 6 | Low | East_Coast_Region | ✅ PASS |
| S-02: Neil Thompson | Premium Wine Distributor / Purchasing Manager / Short-Term | 13 | High (Escalated) | Sophia Delgado | ✅ PASS |
| S-03: Dylan Moss | Personal/Individual (Non-Business) | N/A | Disqualified | Central_Region | ✅ PASS |

**Resolved Defect (D-01):** `Qualified__c` checkbox field default was not set, causing qualified Leads to display as disqualified. Fixed by setting field default = True in Object Manager.

---

## Core Design Principles

These principles are enforced across the entire system and must be preserved in any documentation or analysis:

1. **Qualification is separate from scoring.** The gatekeeper Decision runs first. Disqualified Leads exit the Flow immediately before any scoring logic runs.

2. **Single-DML pattern.** All field writes occur in one Update Records element at Flow conclusion. This prevents recursive trigger cycles and makes governor limit exposure predictable and auditable.

3. **Bulk-safe design.** Flow logic handles batch Lead creation without violating Salesforce governor limits.

4. **Deterministic output.** Identical inputs always produce identical outputs. Fixed numeric thresholds. No subjective assessment.

5. **Two-path architecture.** Non-qualified contacts are filtered at both Make.com (Layer 1) and Salesforce Flow (Layer 2) independently. Either layer can enforce qualification without relying on the other.

6. **Assignment Rule before Flow escalation.** Territorial Queue ownership is established by Assignment Rule first. Flow overrides OwnerId only for High priority escalation. `Region__c` is always preserved accurately, including for escalated Leads.

---

## Build Sequence

This project follows a six-phase documentation build sequence. Do not produce content out of phase order.

| Phase | Name | Status |
|---|---|---|
| Phase 0 | Root Control Plane | ✅ Complete |
| Phase 1 | Data Authority | 🔒 Blocked — requires SFDX `.field-meta.xml` uploads |
| Phase 2 | Core Deterministic Logic | ✅ Complete |
| Phase 3 | Routing, Escalation, and Ownership | ✅ Complete |
| Phase 4 | Integration Boundary | ✅ Complete |
| Phase 5 | Validation and Evidence | ✅ Complete |
| Phase 6 | Portfolio Translation | ✅ Complete |

**Phase 1 Blocker:** Four files require `.field-meta.xml` exports from the SFDX project at `force-app/main/default/objects/Lead/fields/`:
- `docs/03-data-model/field-inventory.md`
- `docs/03-data-model/field-dictionary.md`
- `metadata/custom-fields/lead-fields.md` (partially complete)
- `metadata/formulas/priority-formulas.md` (partially complete)

Upload those XML files to unblock Phase 1.

---

## File and Documentation Conventions

- All documentation files use **Markdown (`.md`)**
- Professional deliverables: Word (`.docx`)
- Final or shareable deliverables: PDF (`.pdf`)
- **No YAML frontmatter** in any Markdown file
- `README.md` retains its name as-is (exception to any naming convention)
- Commit messages follow semantic format: `docs: <description>` for documentation updates
- All file paths in documentation should reflect the actual repo structure

---

## Tone and Communication Style

- Maintain a **formal and technical tone**
- Responses should be precise and architectural in framing
- When presenting options or decisions, lead with the recommendation and rationale
- Avoid casual language and unnecessary hedging

---

## Key Reference Files

| Purpose | File |
|---|---|
| Project entry point | `README.md` |
| Standing session instructions | `notes/claude-project-instructions.md` |
| Business context | `docs/01-overview/project-overview.md` |
| System architecture | `docs/02-architecture/system-architecture.md` |
| Flow configuration | `docs/02-architecture/automation-architecture.md` |
| Routing and escalation | `docs/02-architecture/routing-architecture.md` |
| Field mapping | `docs/05-integration/source-to-lead-mapping.md` |
| UAT results | `docs/06-build-assets/uat-matrix.md` |
| Defect register | `test-artifacts/defect-log/defects.md` |
| Field XML metadata | `metadata/custom-fields/lead-fields.md` |
| Assignment rules | `metadata/assignment-rules/lead-assignment-rules.md` |
| Recruiter summary | `docs/07-portfolio/recruiter-readable-summary.md` |

---

*Céleste Vineyards Case Study — Built by Nathaniel Muncie | CLAUDE.md*
