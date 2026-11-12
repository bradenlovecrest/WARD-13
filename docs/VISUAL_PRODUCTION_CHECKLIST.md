# WARD 13 — Visual Asset Production Checklist

Status: **10/20 complete (50%)** in the isolated Visual Lab.

This checklist tracks playable visual-lab components, **not** finished campaign integration. The main game is untouched.

- [x] **Cinematic Treatment Room scene** — Photorealistic concept art wired to tappable clues; clean plate still planned
- [x] **N.U.R.S.E. identity and portrait** — Recognizable photo portrait with alternate appearance
- [x] **Inventory art: keycard, clipboard, radio, vial** — Four consistent cinematic item illustrations
- [x] **Click-to-investigate hotspots** — Room-specific clue interactions and dialogue
- [x] **Real Tavi voice clips** — 18 WAV recordings in the connected game repository; 3 legacy scenes retained
- [x] **Tavi playback in Visual Lab** — Uses recorded WAVs from game assets; captions if playback unavailable
- [x] **Scare image and reveal choreography** — Distorted N.U.R.S.E. image, curtain-triggered scare, manual test
- [x] **Original scream + jump-scare impact** — Embedded 2.17-second layered horror scream with tiled-room echo and synced impact; scare sound has mute and volume controls, and stops when the scare closes
- [x] **Accessibility basics** — Reduced-motion, mute, volume, dialogue captions, close/escape controls
- [x] **Room navigation and scene state** — Three playable room tabs with hotspots in the lab
- [ ] **Dedicated Records Room photo plate** — Temporary illustrated concept; photorealistic scene pending
- [ ] **Dedicated Observation Four photo plate** — Temporary illustrated concept; photorealistic scene pending
- [ ] **Clean Treatment Room plate without UI labels** — Current concept has embedded investigative labels
- [ ] **N.U.R.S.E. phase III production portrait** — Current corrupted phase is a filtered existing portrait
- [ ] **More scare events and unique overlays** — Plan 3–5 earned scares across the story
- [ ] **Additional inventory art** — Extend 4 finished items to the full canonical game inventory
- [ ] **Room ambience and dynamic sound design** — Dedicated low-frequency ambience and room-specific sound library
- [ ] **Main campaign art integration** — Isolated Visual Lab only; no changes to gameplay saves
- [ ] **Full puzzle-to-hotspot binding** — Lab hotspots are demonstrations, not full campaign puzzle events
- [ ] **Final iPhone/desktop accessibility QA** — Multi-device testing and sound level validation before release

## Accepted production constraints

- Realistic Treatment Room image currently contains a few baked-in UI labels; recreate a clean art plate before final game installation.
- Records and Observation Four are concept SVG placeholders, not photographic game-ready backgrounds.
- N.U.R.S.E. Phase III currently reuses an existing portrait with CSS distortion, not a new portrait asset.
- Tavi recordings are requested through relative paths from GitHub Pages. Unavailable files produce captions instead of device text-to-speech.
- Original jump-scare scream is a locally synthesized PCM WAV embedded in the Visual Lab (no externally licensed samples); the Web Audio impact is layered beneath it. Playback is user-triggered, never automatic on page load.
- The Visual Lab has no ability to change player progress or save-state in the actual WARD 13 campaign.
