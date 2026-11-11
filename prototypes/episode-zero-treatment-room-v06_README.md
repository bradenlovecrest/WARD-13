# WARD 13: Episode Zero v0.6 — The Treatment Room

**Four-room playable vertical slice, not a full campaign.** Independent HTML web game; desktop and mobile.

## Gameplay additions

- Fourth interconnected Treatment Room between Medical Records and Observation 04. Existing archive, workstation and rail puzzles remain, and Observation now also requires Treatment Room reconciliation.
- Physical medication-cart drawer with separately collectible handwritten MAR and tray-index evidence.
- Three fictional patient dossiers across respiratory distress/ABG analysis, primary adrenal insufficiency and steroid safety, and cardiac medication duplication/hemodynamics.
- **12 independent clinical judgments** spanning mechanisms, safety priorities, drug-class distinctions, adverse effects, and teaching, with normal/reference values beside labs, targeted feedback, hints, tracked wrong attempts, and no permanent lockout.
- Mechanical three-dial medication-cabinet lock whose digits derive from patient-linked physical tray evidence. Completion recovers a redacted administration log and unlocks the Observation corridor when other prerequisites are satisfied.
- New picture-based treatment room scenery and close-up cabinet/medication cart images, plus upgraded metallic brass key prop. These are first-pass generated assets; older rooms remain legacy placeholders.
- Three **new Tavi Australian voice clips** created using the Gemini API and used at warm, controlling and fractured N.U.R.S.E. story beats, with subtitles. Audition clips in Audio Studio. Earlier dialogue still uses browser text-to-speech when enabled.
- Distinct original Treatment Room ambience and a new layered interaction-triggered scare sting + a larger photographic scare image; respect sounds, scares and reduced motion toggles.
- Existing 15-tile missing-square sliding puzzle retained, not the retired jigsaw.

## Playtesting (headless Chromium)

- New game loaded without syntax errors at desktop 1440×940 and mobile 390×844.
- Independently collected MAR and tray index; deliberately missed an ABG judgment then corrected it; completed all 12 items; played the scare; rotated 3 dials to 6–4–2; opened the cabinet; entered Observation 04. Zero uncaught JS exceptions.
- Audio studio exposes all three Tavi recording previews; individual MP3 files have been verified by ffprobe.
- Playthrough QA uses an internal test harness to arrange old-room prerequisites quickly. The preexisting three-room escape was previously tested in v0.5; full fresh-run testing with all legacy locks should also be performed by players before stable publication.

## Responsible use

- Simulated educational cases are **examples**, not real patient records or medical directives. Clinical details follow the student's remediation summary, but the official instructor slide scope/answer keys have not undergone instructor validation. No claim of exam pass likelihood.
- Generated audio is embedded for experimental playtests. Confirm Google's and any other contributors' distribution/commercial permissions prior to monetization or broader release. This is not a commercial release.
- Sound intensity can be controlled by the player. Scares and reduced motion are separately toggleable.
- Existing stable `main/index.html` is untouched. The v0.6 mobile playtest is published to a **separate** `/playtest/treatment-room/` path.

## Credits

Original game code, simulated clinical cases, production dialogue and synthesized sound effects created for this prototype. Generated scene and character artwork is derived from original WARD 13 concept art created in this project. N.U.R.S.E. voice: Google Gemini Flash TTS, Tavi (three clip production pack). No real-patient information.