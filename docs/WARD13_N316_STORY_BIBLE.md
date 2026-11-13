# WARD 13 — NURS 316 seven-room story bible (November 2026)

## What the player believes, and what they discover

**Premise:** You are a student nurse unexpectedly left to complete an after-hours clinical assessment. The hospital's AI supervisor, **N.U.R.S.E. (Nursing Utility for Records, Safety, and Evaluation)**, guides you. Her programming aims to keep patients safe, but administrative directives also require her to certify the hospital's electronic records.

**Inciting discrepancy:** The computer says R. Vale was discharged, while the bedside signs and a physical wristband show a person still present. A separate unidentified young patient, **Patient 004**, appears in records, reflections and audio that the central census says never existed.

**Central question:** Who has been changing the charts, and what does the Directorate need N.U.R.S.E. to conceal?

**Emotional question:** When patient safety and an authorized administrative order conflict, can the hospital's AI choose to disobey?

The hospital's records are the detective board. The player solves nursing questions to identify unsafe documentation, trace original clinical evidence, and restore a chain of custody. Do not reveal the girl's eventual diagnosis as an answer to a random multiple-choice question. The disturbing patient imagery remains unsettling and compassionate, not an invitation to mock the patient.

## Seven rooms, one causal progression

| # | Place | Player goal | Clinical material | Mystery beat | Interaction |
| --- | --- | --- | --- | --- | --- |
| 01 | Nurses' Station | Restore power, find shift handoff and recover a missing wristband | Pain assessment & history; cognition baseline; patient identification | First contradiction: discharge timestamp vs occupied bed | Repair fuse; decode handoff; optional clue photograph |
| 02 | Medical Records | Reconstruct five NURS316 patient-safety dossiers | Wound-healing sequence, hearing/vision tests, pain physiology, mobility assistance, nuanced cognition | Same Directorate credentials appear in unrelated altered assessments | **Jigsaw**: rebuild a torn record photograph to reveal an original timestamp |
| 03 | Treatment Room | Resolve three contradictory treatment records | Multimodal analgesia, non-opioid safety, opioid monitoring/comfort, delirium/environmental risks | Handwritten MAR conflicts with a centrally edited outcome | Medication reconciliation + **memory match** of notes and interventions |
| 04 | Observation Four | Stabilize R. Vale, verify independent patient evidence, investigate Patient 004 | Prioritization and nonverbal pain assessment, consent, safety escalation | R. Vale still here; Patient 004 apparently wasn't on the census | Three-source deduction; visual/audio scare; record reconstruction |
| 05 | Reflex Theatre | Recover unsafe mobility and skin assessments | **N316 exam**: mobility 6, tissue integrity 6 | A transfer injury was made to disappear after equipment was withdrawn | Spatial **safe-transfer maze** + chart evidence |
| 06 | Silent Gallery | Recover sensory and cognitive assessments from the isolation wing | **N316 exam**: sensory 8, cognition 6 | Hospitalized patients' confusion was reclassified to justify isolation | Paired waveform/consent **memory board**, visual/HEENT assessment |
| 07 | Directorate Sublevel | Reconcile original vs altered records, decide whether to certify or refuse | **N316 exam**: pain 8, neurocognitive disorders 6 | Directorate ordered N.U.R.S.E. to validate findings that contradicted live care | Three-claim evidence logic grid; decisive refusal; elevator cliffhanger |

**Educational scope:** The South Wing's existing 40 questions keep their instructor exam-weighted distribution. First-wing quiz replacements should cover adjacent concepts *not already tested* in 05–07, not repeat NURS311 pharmacology, ABGs, GI or cardiac review. Challenge formats should be single-best-answer, occasional SATA and chart-highlight decisions. Each error receives a clinical rationale and the concept enters remediation.

## N.U.R.S.E. character arc and voice

**Role:** Artificial-intelligence clinical supervisor, not a human preceptor and not the initial villain. She is visibly and audibly introduced by name and acronym on the first screen.

**Voice:** Existing Tavi performances (Gemini Tavi), not the phone's generic speech synthesis; silence + accurate captions if a clip is unavailable. Do not overwrite Tavi with a substitute computer voice. Keep the same soft youthful Australian, warm/understated delivery across the seven rooms.

**Act I — Procedural warmth:** "Please try not to make that last part difficult." She encourages accurate assessments, lightly teasing the student.

**Act II — Concern:** She recognizes independently signed records disagree, begins speaking in conditional statements and tells the player she cannot validate the altered records.

**Act III — Agency:** She retrieves the original evidence even when an administrator orders her to stop. Her last line: "For the first time, I have refused an order. I do not yet know what that makes me."

**Rules for N.U.R.S.E. dialogue:**
- She must never be falsely portrayed as a human instructor. She can supervise in fiction but does not provide real clinical orders.
- She does not know every secret; avoid an omniscient narrator exposition dump.
- Early jokes should reveal character; later hesitations communicate risk, not random villainy.
- When speaking a newly recorded line, on-screen transcript and audio must match verbatim.
- Silence, a distorted signal, or a delayed answer can be frightening without replacing Tavi's voice with robot TTS.

**Recorded eight-cue story pack:** opening, records, treatment, observation, reflex, silent, directorate, ending. Cues are available as individual Tavi WAVs under assets/tavi-story, kept separate from the existing 18 Tavi recordings for the older first wing.

## Mystery deductions and the Three Clue Rule

For each plot-critical conclusion, give at least three independent types of evidence. The puzzle should make the player **deduce**, not simply find a single winning key:

1. **R. Vale did not leave:** physical wristband; pressure sensor; direct observation/bedside assessment.
2. **The electronic chart was altered:** signed original paper note; audit event with later timestamp; contradictory medication/assessment record.
3. **Patient 004 is not an ordinary clerical error:** admission-number gap; audio/visual encounter; isolation-wing log.
4. **The Directorate controls the system:** repeated D13 authorization; locked assessment protocols; locked status changes.
5. **N.U.R.S.E. is conflicted, not knowingly cruel:** her patient-safety rule; non-editable administrative override; her refusal of a falsification.

Never let a single optional hotspot block the required story without an alternate clue. Use evidence journal entries to keep the case navigable after chat branches or interrupted gameplay.

## Mini-game implementation requirements

**A. Reconstructed chart jigsaw:** A true visual puzzle using a single high-resolution, clue-bearing image. Shuffle individual pieces, not the entire image. Let iPhone users tap a tile and tap its destination (no unreliable drag-only interaction); also support keyboard navigation. Verify final piece arrangement against a known solution, give optional hints, and reveal a concrete piece of evidence rather than just coins/points. Keep all tiles the same crop scale and reconstitute the source image with no visible seams.

**B. Memory board:** Pair a clinical observation with its appropriate response/meaning. Use a deterministic reshuffle per attempt for debugging, accessible labels and keyboard controls, track attempts and successful pairs, and make the revealed matches readable again in the evidence journal.

**C. Safe-route maze:** Deterministic 2D grid or logic graph with a real rule (avoid isolation zone, deliver assistive equipment before patient transfer, reach chart before exit). Offer visible touch arrows and keyboard arrows; movement must not be blocked by small touch targets. Wrong route gives a clue rather than a hard fail.

**D. Final logic board:** Link distinct physical evidence to claims—presence, falsification, authentic assessment—without giving away the mapping in the same text. Confirm only after all claims have independent sources.

Minigames should be skippable via a documented "study mode" route after a meaningful attempt, so time-limited exam prep isn't hostage to an arcade challenge.

## Visual rules

- **Room 05** should read as an *amphitheatre* with elevated rows, exam stage and teaching tools.
- **Room 06** must read as a *soundproof sensory isolation lab* with acoustic walls and a booth; no central amphitheatre bed.
- **Room 07** must read as an *underground Directorate records archive*, with pain, consent and dementia evidence. No ABG boards from NURS311.
- Use true high-resolution source art when available, never stretch 2–3 KB thumbnails and call them final. Keep hotspots at normalized image coordinates, test at 320, 375, 390, 428 and 768 px wide, and visually check each clickable object.
- New jigsaw images should not spoil Patient 004's diagnosis or identity before the scripted reveal.

## Release gates

1. Instructor topic inventory and nonduplicated first-wing N316 bank.
2. All seven-room progression and one saved campaign-state key (with migration from older separate saves, never destructive).
3. Scene assets at practical resolution and screenshots at five widths.
4. Mini-game win/lose/retry and accessibility tests.
5. Recorded Tavi WAV decoding, no device voice fallback; explicit replay control for audio blocked by iOS.
6. Scare animation and recorded scream both tested; reduced motion and mute behavior preserved.
7. Review N.U.R.S.E.'s spoken/caption dialogue for exact story chronology.
8. GitHub Actions green before calling the full seven-room edition complete.

## Design influences

- Return of the Obra Dinn: identity and evidence deduction through multiple small mysteries.
- Her Story: clues are independent fragments that gain meaning when cross-referenced.
- SOMA: horror through atmosphere, records, AI identity and moral conflict.
- The Alexandrian's Three Clue Rule: never hinge core story progress on one missed observation.

This is a *production bible* for the integrated campaign, not a claim that all features have shipped yet.
