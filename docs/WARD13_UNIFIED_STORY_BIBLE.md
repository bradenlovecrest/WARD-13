# WARD 13 — The Missing Admission
## Story bible / continuity and playable seven-room edition

**Public entry:** https://bradenlovecrest.github.io/WARD-13/playtest/cinematic-episode/unified.html
**Purpose:** One continuous seven-room horror-mystery campaign that also covers the Fall 2026 NURS 316 exam.

### What N.U.R.S.E. means
**N.U.R.S.E. = Nursing Utility for Records, Safety, and Evaluation.**
She is an **AI clinical preceptor**, not a human nurse and not the facility director. The opening line states all of that explicitly before the player's first decision. The institution treats her as both a safety supervisor and a certification authority; the moral and plot conflict arises because she must authenticate records modified by the Directorate even when observations contradict them.

**Personality:** warm, dry, slightly condescending in orientation; careful and guarded in Records; troubled in Treatment; frank but fearful in Observation; increasingly uncooperative with the Directorate in the South Wing. She is never just a villainous computer, and the story does not answer who—or what—Patient 004 is prematurely.

### Spine of the mystery
A patient has been electronically discharged before the actual assessment, and the original paperwork has been redistributed. Each room has a physically grounded puzzle plus multiple clinical evidence cards. Several independent clues point to each plot revelation, so one missed object does not break the story.

| Room | Location | New clinical material | Nonclinical physical interaction | Revelation |
|---|---|---|---|---|
| 01 | Nurses' Station | ADL/IADL distinctions, activity intolerance, orthostasis, pressure risk | **9-piece true cutout jigsaw** of admission photo | An omitted wristband contradicts the discharge |
| 02 | Records | Systematic pain history, referred pain, shear, wound-healing nutrition | **4-pair memory game** | Authentication token created impossible signatures |
| 03 | Treatment Room | Nonpharmacologic comfort, patient self-report, opioid monitoring, bowel adverse effects | **Chronology ordering** | “Patient declined” was entered without a discussion |
| 04 | Observation Four | Fall environment, observational pain tools, cognition baseline, patient identity | **7×7 safe-route maze** | Multiple original sources contradict the censored census |
| 05 | Reflex Theatre | Mobility and Tissue Integrity | Clinical chart exploration & synthesis | Safe-transfer and wound records were suppressed |
| 06 | Silent Gallery | Sensory Perception and Cognition | Clinical chart exploration & synthesis | Sensory and consent records were altered |
| 07 | Directorate Sublevel | Pain and Neurocognitive Disorders | Clinical chart exploration & synthesis | The Directorate ordered N.U.R.S.E. to certify false reports |

### Clinical scope and scoring
There are **60 clinical decisions total**: 20 supplemental decisions across Rooms 01–04 plus the existing **40 exam-weighted items** across Rooms 05–07 (Mobility 6, Tissue Integrity 6, Sensory Perception 8, Pain 8, Cognition 6, Neurocognitive Disorders 6). Four playable mini-games are additional and are **not falsely counted as exam questions**.

No pharmacology remediation cases or NURS 311 acid/base content are in the unified clinical question bank. The old editions remain accessible for continuity.

The game includes multiple choice, multi-response (SATA), highlight-the-chart, rationales, evidence journal, explicit clinical reference ranges when applicable, and missed-concept retrieval. Where medical cases are fictional, the narrative does not override real clinical safety priorities.

### The four physical puzzles
**Jigsaw:** clickable/drag-and-drop photo fragments with interlocking tabs and notches, nine distinct photo crops. Exact placement is required; no forced timeout.
**Memory:** match four clinical observation/concept pairs. Flips are visual, unmatched pairs reset, matched pairs persist.
**Logic:** reorder four timestamps from documented evidence and reveal why an apparently routine discharge is impossible.
**Maze:** trace a safe path through a 7×7 floor plan from the Nurses' Station to Bed Four; both keyboard arrows and touch controls.
Every puzzle has a reset button, a visible clue, and can be closed and reopened without losing clinical case progress. There is no randomized unsolvable maze.

### Voice status
Tavi is the preferred recorded Australian-accent performer. The game reuses genuine existing recorded Tavi excerpts where available and looks for exact new dialogue clips in assets/tavi-story/. If an exact recording is missing, the dialogue remains **on screen as captions**; no robotic replacement is silently inserted. The user's initial question about N.U.R.S.E. being AI and the meaning of the acronym is answered directly at introduction.

### Visual production
The first four room backgrounds are extracted from the original edition's real embedded WebP artwork, avoiding the prior low-quality thumbnails. The South Wing three distinct pictures and hotspot mappings are retained; an additional sharp, resolution-independent SVG overlay now places realistic clinical charts, mobility tools, sensory devices and Directorate evidence directly beneath their respective hotspots. The underlying photographic image files are still lower resolution than the original generated art, so this is a clarity/prop improvement rather than claiming the photos themselves have been replaced at full resolution. Avoid claiming all seven rooms now have crisp full-resolution scenic art.

### Design research used
- Game Maker's Toolkit, *What Makes a Good Detective Game?* — distinguish gathering clues from arriving at an answer: https://www.youtube.com/watch?v=gwV_mA2cv_0
- Game Maker's Toolkit, *The 3 Types of Detective Game* — combine deduction, contradiction, and investigation: https://www.youtube.com/watch?v=I7q363Ic26o
- The Alexandrian, *The Three Clue Rule* — place multiple independent clues for every important revelation: https://thealexandrian.net/wordpress/1101/roleplaying-games/three-clue-rule-part-3-the-three-clue-rule

### Remaining production assets
- Replace the low-resolution Room 05–07 artwork with existing 1672×941 generated scenes from the project conversation, matching their original hotspot geometry.
- Produce the new N.U.R.S.E. Tavi transcript exactly in Tavi's voice, if the authorized provider API/quota is available; fallback currently uses archival recorded clips and captions.
- Retain the old original four-room pilot and standalone N316 edition as separate archived play modes while the unified edition becomes the recommended entry.

Do not imply tests have passed until GitHub Actions confirms the latest commit.
