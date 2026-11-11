# WARD 13 — Visual Lab 01

A first, **original, browser-native visual prototype** on a separate route:

`/playtest/visual-lab/`

## Included

- An original N.U.R.S.E. character portrait, framed as the staff surveillance feed
- Treatment Room and Medical Records scenery
- Four consistent item icons (keycard, clipboard, radio, specimen vial)
- A dedicated disturbing N.U.R.S.E. scare insert
- Tappable clue hotspots, working room selection, item selection, and an opt-in jump scare
- Reduced-motion and muted-audio controls, with a Close button and Escape key for scare dismissal
- Works in mobile Safari without an API key, asset hosting service, or third-party dependencies

All artwork is SVG stored as ordinary versioned source files under `playtest/visual-lab/assets/`. This is deliberate for the **first technical integration**: SVG is portable, small, crisp on iPhone, reviewable in GitHub, and can be deployed with the existing GitHub Pages site without binary-asset upload issues.

### What this does NOT do yet

This is a standalone proof-of-concept, not an integration into the 2.3-MB Treatment Room HTML game. It doesn't modify inventory handling, game progress, or the existing Tavi voice playback. The scare is manual and entirely opt-in in the visual lab; the finished game will use story triggers and respect accessibility preferences.

### How to pipe visuals into the actual game

1. Approve look and asset fidelity in this preview, iterating SVG files or upgrading to generated PNG/WebP art.
2. Keep final images under `playtest/treatment-room/assets/` and document them in a small manifest that maps room ID, actor phase, object ID, and scare event to relative asset paths.
3. Add a low-risk visual layer in the existing room renderer: display the mapped background image; place transparent hotspot buttons at responsive percentage coordinates. Preserve existing click handlers, item acquisition logic, and game state.
4. Use matching item IDs to render icons in the inventory. Ensure text and a high-contrast selected border remain present.
5. Wire a small number of authored scare event IDs to images, with scene-specific timing and clear volume/reduced-motion controls. Avoid automatically replaying an unlocked scare on game load.
6. Test on iPhone Safari, desktop, voice enabled/disabled, sound muted, reduced motion, narrow screens, and game reload with saved progress. Deploy to isolated playtest first, then the full game.

### Technical distinctions

SVG visuals are a prototype asset class; higher-fidelity generated stills can replace a path without changing the event logic. AI-generated art must be exported as actual files into the repo or a trusted static asset host before the browser can load it. Generating an image in a chat does **not** automatically publish that image on GitHub Pages.

This pull request intentionally leaves `playtest/treatment-room/index.html`, Tavi audio pipelines, and the primary `index.html` untouched.
