---
name: skill-creator
description: >
  Create a new Claude Code skill (reusable slash command) for this project or globally.
  Use when the user wants to define a repeatable workflow, automate a recurring task,
  or package project-specific instructions into an invocable command.
  Examples: "create a skill for committing", "make a skill to run my linter",
  "I want a /deploy skill", "add a custom slash command".
---

# Skill Creator

Guide the user through designing and creating a new Claude Code skill file.

## What is a Skill?

A Claude Code skill is a Markdown file that defines a reusable prompt or workflow.
When invoked via `/skill-name`, Claude replaces the command with the skill's content
and executes the workflow. Skills live in:

- **Project-scoped:** `.claude/skills/<skill-name>/SKILL.md` (applies only to this repo)
- **Global:** `~/.claude/skills/<skill-name>/SKILL.md` (available in all projects)

## Workflow

Make a todo list for all tasks in this workflow and work through them one at a time.

### 1. Gather Requirements

Ask the user (or infer from context) the following:

- **Skill name:** A short kebab-case identifier (e.g., `deploy`, `phase-check`, `commit-docs`)
- **Trigger description:** When should this skill be invoked? What does the user say to trigger it?
- **Scope:** Project-scoped (`.claude/skills/`) or global (`~/.claude/skills/`)?
- **Workflow:** What steps should Claude execute when this skill runs?
  - Are there sub-tasks that need a todo list?
  - Are there commands to run?
  - Are there files to read, edit, or create?
  - Is there a wrap-up summary to produce?

If the user has not provided enough detail, ask targeted clarifying questions before proceeding.

### 2. Draft the Skill File

Create the skill file using this structure:

```markdown
---
name: <skill-name>
description: >
  One or two sentences describing the skill.
  Include example trigger phrases so the skill activates correctly.
---

# <Skill Title>

Brief explanation of what this skill does.

## Workflow

Make a todo list and work through each step.

### 1. <First Step>
...

### 2. <Second Step>
...

## Wrap Up

Summarize what was done and any next steps for the user.
```

**Key principles for good skills:**
- Write the workflow as imperative instructions Claude will follow
- Be explicit about file paths, command patterns, and output formats
- Include validation steps where appropriate
- End with a clear wrap-up section

### 3. Create the Skill File

Determine the correct path based on scope:

```bash
# Project-scoped
mkdir -p .claude/skills/<skill-name>
# Then write the file to .claude/skills/<skill-name>/SKILL.md

# Global
mkdir -p ~/.claude/skills/<skill-name>
# Then write the file to ~/.claude/skills/<skill-name>/SKILL.md
```

Create the file using the drafted content from Step 2.

### 4. Validate the Skill

Confirm the following:

- File exists at the correct path
- YAML frontmatter is valid (name, description fields present)
- Workflow steps are complete and unambiguous
- The skill can be invoked with `/<skill-name>`

Read the created file back and verify its contents are correct.

### 5. Commit (if project-scoped)

If the skill is project-scoped, stage and commit it:

```bash
git add .claude/skills/<skill-name>/SKILL.md
git commit -m "feat: add /<skill-name> skill"
```

Push to the current branch.

## Wrap Up

Provide the user with:

- The skill name and invocation command (e.g., `/<skill-name>`)
- The file path where the skill was created
- A one-sentence description of what it does
- Any caveats (e.g., "restart your Claude Code session for global skills to take effect")
