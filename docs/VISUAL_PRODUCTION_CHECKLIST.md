# WARD 13 — Visual Asset Production Checklist

Status: **13/21 complete (62%)** in the isolated Visual Lab.

This checklist tracks playable visual-lab components, **not** finished campaign integration. The main game is untouched.

- [x] **Cinematic Treatment Room scene** — Photorealistic concept art wired to tappable clues; clean plate still planned
- [x] **N.U.R.S.E. identity and portrait** — Recognizable photo portrait with alternate appearance
- [x] **Inventory art: keycard, clipboard, radio, vial** — Four consistent cinematic item illustrations
- [x] **Click-to-investigate hotspots** — Room-specific clue interactions and dialogue
- [x] **Real Tavi voice clips** — 18 WAV recordings in the connected game repository; 3 legacy scenes retained
- [x] **Tavi playback in Visual Lab** — Uses recorded WAVs from game assets; captions if playback unavailable
- [x] **Scare image and reveal choreography** — Distorted N.U.R.S.E. image, curtain-triggered scare, manual test
- [x] **NEW distinct real horror scream + previous mixes** — New default is the 3.6-second human recording “Woman Screaming” by DanJFilms (CC0), embedded directly in the game. Previous NIGHTMARE, human short/long, synthesized fallback remain selectable, with mute/volume/reduced-motion controls.
- [x] **Accessibility basics** — Reduced-motion, mute, volume, dialogue captions, close/escape controls
- [x] **Room navigation and scene state** — Three playable room tabs with hotspots in the lab
- [x] **Dedicated Records Room high-resolution plate** — Replaced stretched thumbnail with a 1672×941 standalone photograph of the archive, terminal, paper files, full shelves and Patient 004 chart; new mapped hotspots and audit sequence
- [x] **Dedicated Observation Four photo-derived plate** — New cinematic restrained bed, observation glass, evidence cart and monitor on CAM 07, with an earned second-glass-tap scare; final clean art still pending
- [x] **Patient 004 integrated and assessable** — Seated in the room's full-scene artwork, enlarged visible tap target, two-stage symptom assessment, unique camera/face reveal and plaintive recorded human cry. The differential and final diagnosis remain intentionally undisclosed in the game.
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
- Records and Observation Four now use locally hosted WebP plates derived from our original cinematic concept artwork instead of SVG placeholders. **These are playable preview-quality art, not final clean master backgrounds**: Records now uses a 1672×941 standalone photo-quality master. Observation Four still has some investigative callouts baked into the new continuous scene; final clean-art retouch remains a polish task. Their click targets remain interactive HTML elements.
- N.U.R.S.E. Phase III currently reuses an existing portrait with CSS distortion, not a new portrait asset.
- Tavi recordings are requested through relative paths from GitHub Pages. Unavailable files produce captions instead of device text-to-speech.
- Original jump-scare scream is a locally synthesized PCM WAV embedded in the Visual Lab (no externally licensed samples); the Web Audio impact is layered beneath it. Playback is user-triggered, never automatic on page load.
- The Visual Lab has no ability to change player progress or save-state in the actual WARD 13 campaign.

## Licensed human scream option (Visual Lab v1.0)

- Short: Alesia-Davina, *Sharp Plaintive Suffering Cry Female Horror Sound Effect*: https://alesiadavina.com/sound/sharp-plaintive-suffering-cry-female-horror-sfx/
- Long: Alesia-Davina, *Female Agony Scream - Horror Suffering Sound*: https://alesiadavina.com/sound/female-agony-scream-horror-suffering-sound/
- Both are human-performed, under the creator's game-use license (no attribution required). Creator expressly prohibits redistributing the underlying standalone WAV files; the Visual Lab streams directly from the creator's published CDN rather than copying assets to the public GitHub repository. Do not treat these sounds as CC0. Original embedded synthesized sound is the fallback if the CDN cannot load.
- The curtain scare now starts audio synchronously with the second user tap to improve mobile Safari playback. Please test on a real iPhone before replacing the production scare.

## Nightmare mix v1.0.2

- New default: **NIGHTMARE · real + rumble**. Uses the shorter human-performed licensed scream with a slight 0.92x rate/pitch shift and a new low-frequency sound layer synthesized in the browser (not stored as external audio).
- Recorded voice channel changed from a maximum volume of `min(0.65, volume*0.75)` to `min(0.95, volume*2)`. With the default 38% slider, the human sample's browser volume rises from ~0.285 to ~0.76. This is a significant increase; user should start at a low device volume before testing.
- Sound is still strictly opt-in behind a click/clue, no autoplay on page load. Scare Sound checkbox and volume slider continue to control the mix. Close, Escape and hiding tab stop the rumble and clip.
- This is **Visual Lab only**, and playback level and CDN behavior still require an actual iPhone listening check.

## New scream take v1.0.3 (actual different recording)

- DanJFilms, *Woman Screaming*, recorded for a short film, duration 3.604 s, license CC0: https://freesound.org/people/DanJFilms/sounds/845164/
- Readily redistributable Ogg Vorbis transcode sourced from [sued-rs assets/scream.ogg](https://github.com/Danilo-Guedes/sued-rs/blob/main/assets/scream.ogg) with CC0 provenance documented in that repository's NOTICE file.
- Embedded in Visual Lab HTML as data URI (avoids relying on the previous provider's CDN). Default selector: `new-real`. This uses a **different recorded performance**, not the previous sample with effects.
- On iPhone 26, Ogg Vorbis support is available on current Safari; if playback fails, the original synthesized fallback remains. The full 3.6 s recording gets a 4.2 s scare duration.
- At low physical speaker volume, test `NEW · Real bloodcurdling scream`; the physical device test has not yet been performed.

## Visual Lab v1.1 — Two remaining rooms wired

- `playtest/visual-lab-realistic/assets/records-v11.webp`: archive shelving and altered patient chart investigation; `FILES`, `ARCHIVE DRAWERS`, and `AUDIT TERMINAL` hotspots. Inspect the terminal before the archive drawers to uncover a cross-reference discrepancy and change N.U.R.S.E.'s phase.
- `playtest/visual-lab-realistic/assets/observation-four-v11.webp`: restrained bed, patient monitor, observation glass, and evidence cart; four touch hotspots, each accessible with keyboard/VoiceOver naming. Two examinations of the glass trigger the recorded human scream and N.U.R.S.E. scare (never autoplay on room entry).
- Main campaign and player saves remain untouched. V1.1 upgrades the **Visual Lab**; remaining campaign and art tasks are separately tracked.

## Visual Lab v1.2 — Patient 004

- Original supernatural horror patient, **Patient 004**, a ghostly little girl with wet dark hair veiling her face and hospital gown, inspired by classic ghost stories but not copied from a movie character.
- Art file: `playtest/visual-lab-realistic/assets/observation-patient-004.webp` (custom composited original scene art, preview quality). Patient appears behind observation glass.
- Touch/keyboard hotspot: **PATIENT 004**. First and repeat inspections reveal a missing admission record and inconsistent camera position. The existing Observation Four Tavi WAV is reused without pretending new dialogue was recorded.
- Existing two-examination glass scare remains available; this is an isolated Visual Lab update, not a change to campaign saves.

## Visual Lab v1.3 — Revised Records and physically integrated Patient 004

- Replaced `assets/records-v11.webp` (small cropped screenshot) with `assets/records-v13.webp` (1672×941 standalone full Records environment). Clues now align with the visible filing shelves, audit terminal, drawers, and Patient 004's physical chart in the foreground. The new chart clue distinguishes a missing admission from a post-discharge audit anomaly.
- Replaced the old `assets/observation-patient-004.webp` composition with `assets/observation-patient-integrated-v13.webp` (1600×900), a continuous environment image of Patient 004 seated on the bed, with consistent room lighting, body placement and bed geometry. No separate floating character sprite in the game. Observation image still includes legacy concept-art hotspot callouts and will need clean-plate retouch at final art pass.
- Remapped all Observation Four touch targets to the new scene (patient seated near center of the bed, glass above, restraints to left, monitor and tray to right). Existing glass-triggered scream and Tavi WAV dialogue preserved.
- This is Visual Lab-only; no saved progress or main game changed.

## Patient 004 clinical mystery encounter (Visual Lab v1.4)

- First touch: objective findings only (upward eye deviation, jaw and limb tension, increased oral secretions, unresponsiveness to voice). This is a fictional nursing-assessment puzzle; no diagnosis name is displayed.
- Second touch: evolving findings (rhythmic movements, HR 142/min, SpO₂ 88%, gurgling breaths), new close-up jump scare, and the original earlier plaintive/whiny human performance (`human-short`) independent of the selected scream type. User-triggered playback, same master volume and mute controls; external CDN failure still falls back to synth.
- Third and subsequent touches: reiterate the priority-action challenge without repeating the scare.
- New locally hosted photo asset `assets/patient004-face-reveal-v14.webp`, separately from the existing N.U.R.S.E. scare art.
- Original game and save data remain unchanged; actual mobile audio should be re-tested before campaign installation.
