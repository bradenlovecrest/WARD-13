# WARD 13 — Educational content-pack specification (proposal v0.1)

**Design document only.** The current HTML game does not yet load this format.

A content pack defines a course, its clinical concepts and puzzle challenges, independently of room graphics and reusable mechanical puzzle components.

Example proposed structure:

```json
{
  "schemaVersion": "0.1",
  "id": "nurs311-remediation",
  "title": "NURS 311 — Remediation",
  "sourcePolicy": "instructor-review-first",
  "topics": [
    {"id": "abg", "label": "ABGs"},
    {"id": "inflammation", "label": "Inflammation & glucocorticoids"},
    {"id": "gi", "label": "Cirrhosis, UC & Crohn"},
    {"id": "cardiac", "label": "Preload, afterload & BP drugs"},
    {"id": "endocrine", "label": "Diabetes & adrenal disorders"},
    {"id": "respiratory", "label": "Respiratory medication teaching"}
  ],
  "challenges": [
    {
      "id": "abg-case-001",
      "topicId": "abg",
      "objective": "Identify primary respiratory acidosis",
      "mechanic": "instrument-calibration",
      "difficulty": 1,
      "clinicalStem": "A patient hypoventilates. pH 7.29 (7.35–7.45), PaCO2 55 mmHg (35–45), HCO3 24 mEq/L (22–26).",
      "choices": ["Respiratory acidosis", "Metabolic acidosis", "Respiratory alkalosis", "Metabolic alkalosis"],
      "correctChoice": 0,
      "rationale": "Acidemia with elevated PaCO2 and normal bicarbonate indicates primary respiratory acidosis.",
      "hints": ["Name the pH direction first", "Which component explains the acidity?"],
      "references": ["Course review: ABGs"],
      "tags": ["abg", "co2-retention", "interpretation"]
    }
  ]
}
```

## Validation rules for an exam pack

- Only concepts named in the requested course review or remediation list may be required.
- Supporting lecture materials can clarify review concepts, not silently expand the mandatory scope.
- Every laboratory stem shows relevant normal ranges.
- Every medication challenge covers mechanism, indication, adverse effect or teaching only when sourced.
- Each correct answer has a rationale and a human review step before distribution.
- No actual exam questions, patient identifiers, student grades, private copyrighted slides or redistribution of unauthorized content.
- Alternate cases must test the **same learning objective** using fresh values and clues rather than rote repetition.
- Content can change without requiring structural changes to jigsaw, inventory or other generic mechanics.

## Adaptive rules proposed for v1

Concept state is local and transparent: `unseen` → `needs-practice` → `improving` → `demonstrated`. A missed attempt or multiple hints marks needs-practice. One fresh unassisted success upgrades to improving; two successes on distinct scenarios may count as demonstrated. Offer a break puzzle but never force it. These are practice heuristics, not a validated mastery assessment.
