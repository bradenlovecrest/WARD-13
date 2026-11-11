# Episode Zero — Clinical Immersion v0.5

**Standalone playable prototype**: [episode-zero-clinical-immersion.html](./episode-zero-clinical-immersion.html)

**Mobile playtest:** https://bradenlovecrest.github.io/WARD-13/playtest/clinical-immersion/

## Additions

- A five-file linked clinical archive in Medical Records. The player's decisions restore 15 independently assessed reasoning fields across instructor-listed remediation areas: primary adrenal insufficiency; Crohn, UC, and cirrhotic ascites; hypertension and hemodynamics; lisinopril/metoprolol; rescue/maintenance inhalers and systemic glucocorticoids; glipizide/metformin and inflammation. Each field is evaluated independently with feedback and hints. A final evidence-synthesis choice connects the redactions to the case mystery.
- Clinical archive progress gates the original rail-controller puzzle; the rest of the complete three-room case remains.
- **Real 15-tile sliding-picture puzzle**, replacing the sixteen-piece jigsaw. One empty square; only adjacent moves; guaranteed solvable shuffle; no timer; keyboard and tap controls; optional reveal doesn't count as a clinical penalty.
- Original 3.42 s synthesized horror cue with sound-controlled activation, timed prelude and environmental fade; the existing three ambient room loops remain.
- Additional N.U.R.S.E. dialogue and an Australian voice preference where the browser provides such a text-to-speech voice. **No professional or pre-recorded character voice assets are included.**
- A polished archival-paper casebook interface. Existing scene-image plates are **still placeholders** and will need a separate clean-asset pass.

## Automated testing

Tested in headless Chromium desktop and 390 px mobile. Full path completed: initial patient handoff, physical drawer/fuse, chart, deliberate wrong adrenal selection + correction, five archive sheets, synthesis, sliding puzzle legal/illegal moves and completion, original monitoring and ABG/priority/teaching stages, case synthesis, final choice and learning report. No JS page errors. Separate audio test checked controls, speech audition wiring, new scare audio and visual transition; successful MP3 decoding confirmed by `ffprobe`.

## Accuracy and scope

This is based on the faculty remediation categories and a user-provided compiled N311 remediation study guide, **not a verified copy of all instructor slides**. Simulated patients, values and case selections are original practice; not a clinical protocol. The game's learning report reflects in-game answers and cannot establish actual exam readiness. Instructor review coverage and expert validation are required before calling this an exam-preparation release.

## Branch isolation

`dev/puzzle-laboratory` holds the development source; a **separate new path** under `main/playtest/clinical-immersion/` supports mobile playtesting. The original `main/index.html` stable game and the prior `/playtest/` Director's Cut have **not been replaced**.
