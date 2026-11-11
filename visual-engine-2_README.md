# WARD 13 — Cinematic Visual Engine 2.0 (experimental)

## Files

- [visual-engine-2.html](./visual-engine-2.html) — **standalone cinematic single-room prototype**, self-contained, open locally in a modern browser. Artwork and jigsaw picture are embedded; no external assets, subscription or server required.
- [lab.html](./lab.html) — earlier Puzzle Laboratory v1 experimental prototype.
- [index.html](./index.html) — copy of the stable **After Hours** main game from when this branch was created; **do not replace the main-branch game with this experiment yet**.

This prototype is **only on `dev/puzzle-laboratory`**, NOT deployed to GitHub Pages. The Pages site continues to serve the stable game from `main/index.html`. To test this experimental version, download `visual-engine-2.html` and open it locally, or run it using a local static server.

## Included

1. Cinematic realistic nursing-station scene with working, accessible object hotspots.
2. Inspect and collect a fuse, then select and install it in a breaker panel; electricity and lighting respond.
3. Investigate the staff clipboard, tune a radio to the noted station frequency, and recover a four-digit cabinet code.
4. Complete a **genuine interlocking nine-piece jigsaw** featuring an original lavender-meadow illustration. Swap pieces by two taps or by drag-and-drop. The visual respite is optional and can be skipped with no clinical penalty.
5. Unlock the medicine cabinet and interpret an instructor-review-aligned ABG, including normal reference ranges.
6. A wrong ABG selection triggers a fresh follow-up case after the first success; this is a **basic rules-based practice aid**, not proof of mastery.
7. Cinematic power-state lighting, optional synthesized ambience and interaction sounds (off by default), motion reduction, scene object list and contextual hints.
8. Local saving and restart, when browser storage allows it.

## Test coverage

Verified in headless Chromium at desktop and 390-pixel mobile viewports. Completed the full success path including fuse, radio, all nine jigsaw swaps, cabinet combination, a deliberately incorrect ABG, new follow-up ABG, and exit. Tested visual skip on mobile and observed no page JavaScript errors. Hosted deployment of this branch has **not** been tested (branch not published).

## Known prototype limitations

- A single static camera view with cinematic hotspot interactions; not a navigable 3D hospital.
- Close-up inspections use crops of the scene artwork rather than separately modeled assets.
- The embedded scene art is an illustrative environment, not a literal clinical facility.
- Clinical content is original practice derived from prior user-provided NURS 311 exam-review-aligned notes. Do not redistribute instructor materials or assume exact exam questions.
- More accessibility, educational validation, save migrations, and scene systems are required before a classroom-ready merge.

## Iteration targets

- Replace the remaining diegetic baked-art markers with fully modular scene graphics.
- Add additional camera angles, drawers with animated inspection views, object combining, environmental audio zones and more low-pressure puzzles.
- Extract clinical cases into independent editable content packs and expand adaptive practice beyond ABGs.

No changes to the live main branch are required for this prototype.
