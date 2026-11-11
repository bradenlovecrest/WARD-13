# WARD 13 — Puzzle Laboratory (Prototype 01)

This is an *experimental* one-room prototype. The published WARD 13 game is unchanged.

## Play
Open `lab.html` in Chrome, Edge, Firefox, or Safari. No internet connection or accounts needed.

## What to try
- Search the desk drawer for an item.
- Select the inventory item and repair the breaker.
- Reconstruct the X-ray using click-two-to-swap or dragging.
- Enter the four-digit code in the supply cabinet.
- Solve the ABG case. Deliberately try a wrong answer once to see the adaptive follow-up.

## Safety and limitations
- Simple, rule-based *adaptive practice*, not AI or a validated mastery evaluation.
- ABG clinical examples are original practice cases; every lab value includes a reference range.
- The jigsaw is low-pressure and skippable, with no scoring penalty.
- This is a prototype, not an instructional release. Clinical content should be reviewed before classroom use.
- No patient, student, or user account data is sent anywhere; any saved state remains in browser local storage where available.

## Testing
The complete exploration, X-ray, cabinet, clinical follow-up, and victory flows were verified in headless Chromium at desktop and mobile viewport sizes. Also tested wrong-answer handling; see current project issue for further QA tasks.