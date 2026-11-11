# WARD 13 — Episode Zero: The Missing Admission

**Playable preproduction vertical slice · Build 0.3 · Branch: `dev/puzzle-laboratory`**

[Open the standalone prototype file in the repository](./episode-zero.html) (download the HTML and open locally in a current desktop/mobile browser). The experimental branch is **not published** to GitHub Pages. **The working main-branch game is unchanged.**

## What this proves

- Three interconnected point-and-click spaces: Nurses' Station → Medical Records → Observation 04, with gated revisits and a visual room map
- Real interaction sequences: open the drawer, separately collect objects, repair the breaker, tune a radio, and enter a four-digit security code
- Persistent, multi-purpose brass key: opens a cabinet but must later be rotated to reveal an ABG engraved on the back
- Sixteen-piece SVG jigsaw with interlocking shapes; tap-to-swap, drag-to-swap, accessible reveal, no timer
- Coupled mechanical slider lock with four channels; adjusting one rail shifts the next inversely
- A multi-step, fictional clinical case: ABG interpretation with **reference ranges**, urgent deterioration priorities, inhaled corticosteroid teaching, and three-source evidence-board synthesis
- Rule-based adaptive follow-up: missing the first ABG invokes a different, independently interpreted blood-gas case
- Local performance summary, tracking attempts, corrections, hints and scope limitations; **not an exam-grade prediction**
- Intercom dialogue arc, optional browser TTS, quiet synthesized ambience and sound effects, optional triggered jump scare, reduced-motion control and journal

## Manual walkthrough

1. In the station, inspect/open the desk drawer; collect its **fuse** and **patient wristband** separately. Install fuse at the breaker. Read clipboard; tune radio to the noted frequency.
2. Travel to Records. Open filing drawer; collect chart and brass key. **Inspect and rotate the key**. Use key on supply cabinet to recover rail instructions.
3. Assemble the archival photograph (16 pieces) to reveal archive batch number. The photograph can be revealed without educational penalty.
4. Calibrate the linked sliders using the fingerprint from records. Return to the station and decrypt the workstation; then enter Observation.
5. Inspect the patient; reconcile the recorded ABG with key engraving, prioritize breathing concerns, verify medication teaching.
6. If the first ABG was wrong, solve an unfamiliar follow-up case. Link **patient band**, **security audit**, and **engraved key** to the correct investigative claims. Make your story choice and inspect the prototype learning report.

## Testing and integrity

End-to-end UI tests completed in headless Chromium on a 1440×940 desktop viewport, including a deliberate ABG error, correction, remediation case, all 16 jigsaw placements, coupled sliders, code lock, case synthesis and final choice. A 390×844 mobile interaction check completed. No runtime JavaScript errors observed in these tests.

**Important limitations:** This is a 3-space vertical slice, not a multi-hour campaign. Locations are static cinematic composites with interactive overlays; no free 3D movement or fully animated 3D drawers. Audio is browser-generated: not professionally recorded, and voice quality depends on the browser. Save persistence is best-effort local storage. Clinical scenarios are **original illustrative examples**, not a full professor-reviewed exam pack. Validation of objective coverage and real student learning is required before interpreting readiness reports as meaningful exam prediction.

## Release rule

Do **not** merge this prototype or overwrite `main/index.html` until the owner approves gameplay, artwork, educational content, sound, and accessibility for the public site. N.U.R.S.E.'s full fate and the missing-patient conspiracy are intentionally not disclosed here.
