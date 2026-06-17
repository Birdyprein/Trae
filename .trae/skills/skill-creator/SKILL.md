---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it
- Write a draft of the skill
- Create a few test prompts and run them on the skill
- Help the user evaluate the results both qualitatively and quantitatively
- Rewrite the skill based on feedback from the user's evaluation of the results
- Repeat until you're satisfied
- Expand the test set and try again at larger scale

Your job when using this skill is to figure out where the user is in this process and then jump in and help them progress through these stages.

## Core Principles

1. **Concise is Key** — The context window is a public good. Skills share the context window with everything else. Every word must earn its place. Prefer concise examples over verbose explanations.

2. **Progressive Disclosure** — Three levels:
   - L1: Metadata (name + description) — always in context
   - L2: SKILL.md body — loaded on trigger (keep under 500 lines)
   - L3: Bundled resources (scripts/, references/, assets/) — loaded on demand

3. **Freedom Level Matching** — Match the constraint level to task fragility:
   - High constraint for fragile tasks (scripts, exact formats)
   - Low constraint for flexible tasks (free text, open-ended)

4. **Imperative Form** — Use direct instructions: "Run the script" not "You should run the script"

5. **No Redundant Documentation** — No README, INSTALL, or CHANGELOG files. Only what the AI needs to execute.

6. **Description is the Trigger** — The description field must describe both what the skill does AND when to use it. This is the only field used for skill matching.

## Creating a Skill

### Step 1: Understand the Use Case
- Gather concrete examples of how the skill will be used
- Identify the specific scenarios that should trigger the skill

### Step 2: Plan the Skill Structure
- What goes in SKILL.md (the core instructions)
- What goes in scripts/ (executable helpers)
- What goes in references/ (detailed docs loaded on demand)
- What goes in assets/ (templates, images, etc.)

### Step 3: Write the SKILL.md
- Start with YAML frontmatter (name + description)
- Use imperative form throughout
- Keep it under 500 lines
- Include clear workflows and decision trees

### Step 4: Test and Iterate
- Create test prompts
- Run the skill against them
- Evaluate results qualitatively and quantitatively
- Rewrite and repeat