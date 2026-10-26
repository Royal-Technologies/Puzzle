# AGENTS.md — Puzzle
## 1. Project Overview

Build and maintain **Royal Puzzle Generator**, a browser-based puzzle creation system branded as **Mathematics Marvels**.

The system must generate original puzzles, validate their answers, render attractive social media graphics, export PNG images, and support future automation through Make.com and Facebook Pages.

Primary output: **1080 × 1080 PNG** for Facebook posts.

Target platform: GitHub Pages for the frontend, with GitHub Actions or another secure backend workflow for automated generation and rendering.

## 2. Supported Puzzle Categories

Support these ten categories:

1. Geometry Puzzles
2. Sudoku
3. Number Sequence
4. Matchstick Puzzles
5. Logic Puzzles
6. Clock, Calendar & Time Puzzles
7. Word & Rebus Puzzles
8. Visual IQ Puzzles
9. Missing Number / Math Riddles
10. Visual Pattern Puzzles

Each category must have a separate generator and an appropriate validation strategy.

Keep generators modular so that new categories can be added without rewriting the core application.

## 3. Mandatory Puzzle Generation Rules

For every puzzle:

- Generate a valid puzzle with a clearly defined question.
- Store the expected answer and a step-by-step explanation.
- Validate the answer using deterministic logic, a mathematical formula, a solver, or a category-specific rule.
- Prefer exactly one valid answer.
- Reject ambiguous, contradictory, unsolvable, or incorrectly rendered puzzles.
- Regenerate failed puzzles with a bounded retry count.
- Never publish a puzzle if validation fails.
- Do not invent an answer simply to complete a puzzle.
- Keep the puzzle data, answer, explanation, and rendered image synchronized.
- Use a unique puzzle ID and record its category and generation timestamp.
- Prevent previously published puzzles from being reused unintentionally.

AI-generated content may assist with puzzle ideas and captions, but AI output alone is not sufficient proof that a puzzle has a correct answer.

## 4. Category-Specific Validation

### Geometry
- Define the geometric assumptions and all relevant angles, lines, and shapes.
- Use mathematical calculations to derive the answer.
- Ensure the diagram represents the stated mathematical relationships.
- Do not rely on visual proportions alone unless the puzzle explicitly requires measurement.
- Avoid underdetermined geometry problems with insufficient information.

### Sudoku
- Generate a complete valid Sudoku grid.
- Remove clues according to the selected difficulty.
- Verify that the resulting puzzle has exactly one solution.
- Check all rows, columns, and 3 × 3 boxes.

### Number Sequence
- Define the intended sequence rule internally.
- Calculate the expected answer programmatically.
- Avoid sequences where multiple reasonable rules produce different answers, unless the wording explicitly resolves the ambiguity.

### Matchstick Puzzles
- Represent matchstick positions and permitted moves explicitly.
- Verify that the final equation or shape satisfies the stated rules.
- Ensure the rendered diagram matches the validated state.

### Logic Puzzles
- Translate the clues into explicit constraints.
- Verify that at least one solution exists.
- Require exactly one solution for automatically published puzzles unless multiple answers are intentionally allowed.

### Clock, Calendar & Time
- Use reliable date and time calculations.
- Specify assumptions such as 12-hour or 24-hour time where relevant.
- Account for leap years, month lengths, and timezone rules when applicable.

### Word & Rebus
- Store the intended answer and acceptable alternatives.
- Ensure wordplay, spelling, and visual placement support the intended interpretation.
- Reject puzzles whose answer depends on unexplained assumptions.

### Visual IQ
- Define the pattern or logical rule used to determine the answer.
- Verify that the answer follows from the displayed visual information.
- Avoid subjective puzzles presented as having one objectively correct answer.

### Missing Number / Math Riddles
- Calculate the missing value using explicit equations or constraints.
- Validate the complete set of displayed numbers and relationships.
- Reject underdetermined puzzles.

### Visual Pattern
- Define the transformation or sequence rule.
- Verify that the proposed next item follows the rule.
- Check that shapes, colors, and symbols are rendered consistently.

## 5. Design and Branding

Brand name: **Mathematics Marvels**

Default visual style:
- Warm cream, paper-textured background.
- Dark navy typography and diagram lines.
- Red question marks and selected highlights.
- Strong visual hierarchy and generous whitespace.
- Clear, readable English text.
- Consistent footer branding.
- No unnecessary decorative elements.

Design requirements:
- Default export: 1080 × 1080 pixels.
- Keep important content within safe margins.
- Prevent text clipping, overlapping labels, and cropped diagrams.
- Render geometry, equations, and symbols using SVG or other precise vector techniques where appropriate.
- Use a consistent design system across puzzle categories.
- Do not use an AI-generated image as the source of truth for mathematical diagrams.
- Use fonts with appropriate support for mathematical symbols and degree signs.

## 6. Puzzle Data Contract

Every generated puzzle should have a consistent data structure containing:

- id
- category
- difficulty
- question
- answer
- explanation
- validation status
- generation timestamp
- renderer/template version
- image location
- caption
- publication status
- published timestamp and external post ID, when available

Never include the answer or explanation in the public puzzle image unless the selected template explicitly calls for a solution graphic.

Keep answers and internal validation details separate from public-facing captions and images.

## 7. Random Daily Selection

The daily selector must:

- Select one eligible category randomly.
- Avoid selecting the previous day's category when at least two categories are available.
- Prefer categories that have appeared less frequently in recent posts.
- Support a configurable category allowlist.
- Exclude disabled or failing generators.
- Avoid duplicate puzzle IDs and previously published content.
- Save selection history in a durable storage location.

Do not rely on browser localStorage as the only history store for automated publishing.

Use a deterministic seed or persisted generation record when retries must reproduce the same puzzle.

## 8. PNG Export

- Export the complete puzzle design as a valid PNG file.
- Ensure the exported dimensions match the requested dimensions.
- Wait for required fonts and rendering assets to load.
- Validate the output file before marking the puzzle ready.
- Use a stable renderer for automated generation.
- Ensure SVG and other assets do not depend on browser-only state unavailable in GitHub Actions.
- Keep image generation independent from Facebook publishing.

## 9. GitHub Pages and Automation Architecture

Keep the public frontend separate from privileged automation.

GitHub Pages may host:
- Puzzle generator UI.
- Puzzle previews.
- Manual PNG exports.
- Public documentation.

A trusted backend workflow or GitHub Actions may handle:
- Automated puzzle generation.
- Validation.
- PNG rendering.
