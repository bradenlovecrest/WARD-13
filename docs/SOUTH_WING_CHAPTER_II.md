# WARD 13 — Chapter II: The South Wing

## Play

- **Chapter I / four-room cinematic pilot:** https://bradenlovecrest.github.io/WARD-13/playtest/cinematic-episode/
- **Chapter II / three new rooms:** https://bradenlovecrest.github.io/WARD-13/playtest/cinematic-episode/chapter-two.html

The first chapter has a low-profile **SOUTH WING / +3 ROOMS** button. Chapter II is an independent local-save progression, so there is no need to reset the first four rooms. The story begins just beyond Observation Four.

## The three playable rooms

| Room | Environment | Study challenge |
| --- | --- | --- |
| **05 — The Reflex Theatre** | Abandoned neurologic assessment theatre | 8 clinical charts on cranial nerve interpretation, gaze, facial motor/sensory assessment, coordination, Romberg and pronator drift; then a stroke-priority synthesis lock |
| **06 — The Silent Gallery** | Distorted HEENT sensory archive | 8 clinical charts on Snellen, Weber/Rinne, adult otoscopy, accommodation, visual fields, ocular color, airway priority and CN I; then an unfamiliar hearing-loss synthesis lock |
| **07 — Directorate Sublevel** | Falsified physical-assessment vault | 8 charts on abdominal examination order, ascites/hepatomegaly, muscle strength, cast neurovascular checks and visible pulsation; then the consequential ABG alteration puzzle |

Total: **24 clinical chart questions + 3 synthesis locks = 27 clinical decisions**. Each set of eight questions distributes correct answers evenly across A/B/C/D, with credible distractors and contextual rationales. The answer key is not rendered until successful assessment.

**Study scope:** The new wing emphasizes NURS 317 neuro/HEENT, abdomen and musculoskeletal assessments. The final chart discrepancy is a clearly identifiable **NURS 311 acid-base crossover**. No Glasgow Coma Scale questions.

## Continuity and story

N.U.R.S.E. remains a constrained clinical-supervision AI under the Directorate's authority rather than the prime antagonist. Patient 004 remains separate from assigned patient R. Vale, and the player's diagnosis of Patient 004 is deliberately withheld. The patient remains embedded in the mystery through chart discrepancies, visual scares and evidence clues. The altered chart changes the acid-base interpretation, not merely a number.

The final story transmission resolves the falsification but intentionally leaves the Directorate's identity and Patient 004's underlying diagnosis for later chapters.

## Gameplay and access

- Mobile/touch-friendly **clickable clinical file markers** over each room scene, with a redundant accessible chart-access strip.
- Original clinical chart data, four-choice responses, feedback/rationales and new clues when verified.
- Evidence journal, 3 room locks, narrative progression, full-screen visual scares with local recorded MP3s, captioned story lines, sound toggle, reduced-motion styles.
- **Local-only auto-save** under key ward13.chapter2.v1; it does not touch Chapter I or earlier legacy saves.
- Missed-concept log and a retrieval pass. A failed answer can be retried; later, **REVIEW MISSED CONCEPTS** tests the weak concept again.
- Intro, completion screen, reset, restart from saved progress, and links back to the first wing.
- No external voice API, paid token, server-side account, exam upload or personal data collection.

## QA

- node tools/check_chapter_two.mjs checks JavaScript syntax, 3/8/27 question structure, unique IDs, balanced answer positions, required assets and no GCS.
- node tools/test_chapter_two_browser.mjs automates all 27 clinical challenges, two audio/visual scare triggers, saves, a deliberately missed question followed by remediation, and mobile horizontal-overflow check in Chromium.
- CI: .github/workflows/south-wing-smoke.yml automatically runs when Chapter II files change.

## Remaining production polish

Backgrounds in the new rooms currently use **layered, original CSS-set theatrical scenes** rather than finished photorealistic commissioned artwork. All clinical interaction locations are wired to the background file markers, not free-floating hotspots. Further scenic art and recorded N.U.R.S.E. dialogue can be refined without changing the clinical/content engine.

These are **original educational practice questions**, not exact instructor exam items. Instructor review decks should be the final arbiter of exam scope; do not use a fictional game as the sole reference for real clinical action.
