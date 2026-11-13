# WARD 13 — NURS 316 Exam 3 South Wing Edition

**Play:** https://bradenlovecrest.github.io/WARD-13/playtest/cinematic-episode/n316.html

This version replaces the South Wing educational question pack with original NURS 316 exam-style clinical decisions, while preserving the original Chapter I / Chapter II saved games. It does not overwrite Chapter II's historical NURS 317 / NURS 311 crossover pack or the pharm-remediation root.

## Source alignment

The user's **N316 Exam 3 Topics to Review Fall 2026** specifies 40 questions, worth 49 points, using multiple-choice, multiple-response (SATA) and highlight text. Study materials consulted:

- N316 Mobility and Tissue Integrity F26: ergonomics, safe transfers, immobility complications, falls, exercise, pressure injury staging/prevention and wound complications.
- N316 Pain and Sensory Perception F26 Instructor Version: sensory overload/deprivation/deficit, sensory aids, cranial nerves, confusion/delirium, pain history, multidimensional pain, nonpharmacological management, opioid monitoring and older-adult pain.
- N316 Concepts of Cognition and Neurocognitive Disorders Fall 26: cognitive assessment, baseline/onset, Alzheimer's/vascular/Lewy body/frontotemporal dementia, delirium, dementia safety and caregiver communication.
- Instructor's Pain & Sensory Perception Case Studies Answer Key: serious-illness pain, chronic neuropathic pain and sensory-loss case study.
- Uploaded Morse Fall Scale and MMSE references and Mobility Case Study.

Exam-style weighting is preserved **exactly**:
- Mobility: 6
- Tissue integrity: 6
- Sensory perception: 8
- Pain: 8
- Cognition: 6
- Neurocognitive disorders: 6

**40 clinical questions total** = 37 in-room chart challenges plus three room-exit synthesis locks, with several SATA and chart-highlight items. Content is newly authored, not reproduced faculty test questions. This review list is not exhaustive; the course also cites ATI Engage, Giddens, ELNEC, class activities and discussions. Material not present in the available uploaded files is not claimed as specifically verified.

## Story and room design

- **Room 05 — The Reflex Theatre:** distinct neurological teaching amphitheater art, an exam stage, transfer note, wound-care files and safety props. Content: mobility 6, tissue 6.
- **Room 06 — The Silent Gallery:** distinctly different violet soundproof sensory-isolation lab, waveform recorder, Snellen chart, exam bench, glass isolation booth and altered consent form. Content: sensory 8, cognition 6.
- **Room 07 — Directorate Sublevel:** red-lit records vault with file folders, patient charts, monitoring station and restricted Directorate elevator. Content: pain 8, neurocognitive disorders 6.

Each scenic prop has a normalized x/y hotspot location linked to one or more real exam questions. The visible hotspots are **objects**, not arbitrary grid coordinates. The redundant chart access strip supports players with limited precision or smaller screens.

## Game features

- Four-choice single answer, select-all-that-apply, and highlighted chart-excerpt decisions
- Explanations after success, targeted hints after errors, evidence log
- Dedicated save key: ward13.n316.exam3.v1 (local-only) and multi-miss remediation
- Three narrative seals, N.U.R.S.E. storyline and Patient 004 mystery (underlying diagnosis intentionally undisclosed)
- Recorded scream assets with mute control and manual replay if autoplay is blocked
- Responsive aligned artwork and hotspot layer; reduced-motion styles
- No GCS questions and no former NURS 311 pharm/acid-base questions

The GitHub Pages art assets are compressed to very small WebP files for mobile loading; full-resolution original generated artworks are retained in the conversation and can be installed as upgraded files without changing hotspot geometry.

## QA

- node tools/check_n316_campaign.mjs validates exact source-topic counts, interaction types, hotspot mapping and media assets.
- node tools/test_n316_campaign_browser.mjs performs all 40 exam cases, all rooms, hotspots, save/resume, remediation and recorded scare calls in a mobile Chromium viewport.
- .github/workflows/n316-campaign-smoke.yml runs both checks in GitHub Actions.

Clinical study aid only. The instructor materials and real facility protocols take precedence over the game.
