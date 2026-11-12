# WARD 13 — Cinematic Campaign Pilot

**Play:** https://bradenlovecrest.github.io/WARD-13/playtest/cinematic-episode/

This is the full **four-room Treatment Room / Episode Zero campaign** with the approved Cinematic Visual Lab artwork integrated into real gameplay. This page is a safe, standalone development build, not the repository's root game.

## What's playable
- Nurses' Station — original room, story progression and puzzle triggers unchanged
- Medical Records — upgraded realistic archival scene and existing sealed archive puzzles
- Treatment Room — original clinical medication scenarios and lock logic, now against the cinematic room art
- Observation Four — original R. Vale clinical case and bedside assessment, plus the separate unexplained Patient 004 encounter and observation-glass scare
- N.U.R.S.E. portrait phases and previously recorded Tavi lines
- User-enabled room ambience, optional voice, patient 004's original face reveal, a distinct plaintive scream and offline CC0 backup
- Original hint system, evidence journal, clinical gates, and save/resume remain functional

## Saving and data
- Saves made in this pilot use `ward13-cinematic-campaign-v1`.
- If no pilot save exists, the game can **read** a prior `ward13-treatment-v06` save to resume the original four-room campaign.
- The original `ward13-treatment-v06` save is not edited or removed by this pilot.
- A new game or reset in the pilot affects its own save only.
- The public `index.html`, `playtest/treatment-room/index.html` and Visual Lab remain intact.

## Story and nursing content
- Patient 004 is **not** the assigned clinical patient R. Vale. The ghost patient's identity and suspected disorder are intentionally withheld from the player.
- Clinical puzzles and instructional answers are original simulated educational content; check against instructor exam-review scope and clinical protocols before instructional use.
- The appearance of the patient is an atmospheric fictional mystery, not medical guidance.

## Audio and accessibility
- The player initiates sound through on-screen controls; no page-load scream autoplay.
- Patient 004's preferred short plaintive scream streams from its licensed performer's CDN and falls back to a CC0-licensed recording if unavailable. Do not copy the CDN WAV into the public repository.
- Reduced-motion, captions for N.U.R.S.E.'s dialogue, and a close/Escape option remain available. Start device volume low during horror playtesting.
- Mobile playtest QA is automated in `.github/workflows/cinematic-campaign-smoke.yml`, with Chromium coverage of all four rooms, clinical case, ghost scare and isolated saves.

## Known constraints
- Artwork has some composition imperfections and embedded UI details in the Treatment Room scene; further standalone-background refinement is separate from puzzle integration.
- Not all dialogue lines have recorded audio, so some lines show text captions without a robotic voice when Tavi mode is selected.
- iPhone audio output and touch ergonomics should still be verified on a physical device.
- This is a playable pilot, not a final certification of the entire game's medical accuracy.
