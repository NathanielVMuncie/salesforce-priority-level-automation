## Repository Structure

```
salesforce-priority-level-automation/
├── README.md
├── docs/
│   ├── 01-overview/
│   ├── 02-architecture/
│   ├── 03-data-model/
│   ├── 04-automation-logic/
│   ├── 05-integration/
│   ├── 06-build-assets/
│   └── 07-portfolio/
├── metadata/
│   ├── custom-fields/
│   ├── formulas/
│   ├── queues/
│   ├── assignment-rules/
│   └── flow-notes/
├── test-artifacts/
│   ├── scenario-inputs/
│   ├── expected-results/
│   ├── uat-evidence/
│   └── defect-log/
├── assets/
│   ├── screenshots/
│   └── exports/
├── portfolio/
│   ├── case-study-snippets/
│   ├── resume-bullets/
│   ├── recruiter-summary/
│   └── website-copy/
└── notes/
```

---

## Documentation Index

### Overview
- `docs/01-overview/project-overview.md`
- `docs/01-overview/scope-boundaries.md`
- `docs/01-overview/business-objective.md`
- `docs/01-overview/devorg-constraints-and-ownership-model.md`
- `docs/02-architecture/system-architecture.md`

### Integration
- `docs/05-integration/wix-form-and-submission-automation.md`
- `docs/05-integration/key-value-mapping.md`
- `docs/05-integration/make-com-integration.md`
- `docs/05-integration/salesforce-integration.md`

### Data Model
- `docs/03-data-model/field-inventory.md`
- `docs/03-data-model/field-dictionary.md`
- `metadata/custom-fields/lead-fields.md`
- `metadata/formulas/priority-formulas.md`

### Core Logic
- `docs/03-data-model/scoring-model.md`
- `docs/03-data-model/priority-thresholds.md`
- `docs/04-automation-logic/gatekeeper-logic.md`
- `docs/04-automation-logic/scoring-logic.md`
- `docs/04-automation-logic/priority-assignment-logic.md`

### Routing, Escalation, and Ownership
- `docs/04-automation-logic/escalation-logic.md`
- `docs/04-automation-logic/territorial-routing-logic.md`
- `docs/02-architecture/routing-architecture.md`
- `docs/02-architecture/automation-architecture.md`
- `docs/02-architecture/state-management-risk.md`
- `metadata/queues/queue-definitions.md`
- `metadata/assignment-rules/lead-assignment-rules.md`
- `metadata/flow-notes/lead-scoring-and-priority-assignment.md`

### Integration Boundary
- `docs/05-integration/wix-make-salesforce-ingestion.md`
- `docs/05-integration/source-to-lead-mapping.md`
- `docs/05-integration/middleware-responsibilities.md`

### Validation and Evidence
- `docs/06-build-assets/configuration-checklist.md`
- `docs/06-build-assets/test-scenarios.md`
- `docs/06-build-assets/uat-matrix.md`
- `docs/06-build-assets/screenshots-index.md`
- `test-artifacts/scenario-inputs/lead-test-records.md`
- `test-artifacts/expected-results/priority-routing-results.md`
- `test-artifacts/uat-evidence/uat-session-log.md`
- `test-artifacts/defect-log/defects.md`

### Portfolio
- `docs/07-portfolio/case-study-summary.md`
- `docs/07-portfolio/recruiter-readable-summary.md`
- `docs/07-portfolio/design-insight-gatekeeper-sequencing.md`
- `portfolio/resume-bullets/resume-bullets.md`
- `portfolio/recruiter-summary/recruiter-summary.md`
- `portfolio/website-copy/project-page-copy.md`