# Episode Zero — Director's Cut (Audio & Learning Pass)

**Experimental branch only**. [Download/play single-file HTML](./episode-zero-directors-cut.html) locally. The published GitHub Pages site still uses `main/index.html`; no live-game changes.

## What changed from Episode Zero v0.3

- Three original, room-specific ambient MP3 beds embedded inside the HTML: Nurses' Station, Records, Observation
- Three original intercom signature tones for N.U.R.S.E.'s `ORIENTATION MODE`, `SECURITY DIRECTIVE` and `SIGNAL FRACTURE` phases
- Dedicated, dynamically triggered scare sting, in addition to existing visual scare
- Audio Studio with browser voice casting, dialogue volume, ambience volume, three staged voice auditions, sound previews and stop control
- Explicit "Enable cinematic audio + voice" click on the title screen (browser autoplay restrictions respected); sound/voice are still optional
- New first-room clinical source-verification checkpoint at the shift clipboard; error feedback and tracking appear in the learning report
- The brass key now preserves a **different, earlier** ABG: 00:03 pH 7.33 / PaCO₂ 51 / HCO₃⁻ 26. The bedside chart is 00:11 pH 7.29 / PaCO₂ 58 / HCO₃⁻ 26. The electronic file's normalized values are contradictory. The clinical analyzer now asks for **pH direction, physiological driver, and trend** rather than simply matching the same gas values
- More gradually evolving N.U.R.S.E. dialogue; no character-arc spoilers in this prototype
- Original final case-synthesis sequence, adaptive practice, jigsaw, rails and navigation retained

## Tests

Full automated end-to-end run in headless Chromium including wrong and corrected first clinical checkpoint, physical drawer/fuse, Records, key inspection, audio studio auditions, clinical ABG mistake followed by correction, separate remediation case, priority action, inhaler teaching, final evidence synthesis, and ethical ending. Additional phone-sized UI test for audio controls. Browser page-error count: zero.

## Known limitations

- Device voices are *browser text-to-speech*, not professional recordings. Voice availability/quality differs by operating system and browser; always show text captions.
- Original audio beds and sting are programmatically synthesized, not professionally sound-designed recorded effects. Users should audition with headphones and adjust levels.
- Audio may not play until the user opts in from a tap/click. Browser and OS media policies apply.
- This is still a three-room visual prototype and retains some reused scene art and the current 16-piece jigsaw; a clean-art overhaul and true tactile puzzle engine are separate tasks.
- Nursing examples are illustrative and do not constitute complete professor-review exam coverage or a validated exam-readiness forecast.
- New first-room verification is based on general nursing safety principles; more content and syllabus validation are needed to meet a full course exam objective map.
- Avoid exporting copyrighted professor material or real patient details to the public repository.

## Next milestone

Convert the exam review objective list into multiple deep, mid-room interactions and build an original layered scene art pipeline. Decide on a professional licensed/recorded N.U.R.S.E. performance when source assets and consent/license are available. Keep the published stable `main` untouched until the owner approves.
