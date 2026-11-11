# WARD 13 visual integration — first playable art pass

Status: First integration on `feature/ward13-visual-foundation`. See `playtest/treatment-room/visual-lab.html` for asset previews.

## Asset paths

- `assets/visual/nurse-welcome.svg`, `nurse-directive.svg`, `nurse-fractured.svg`: reusable concept portrait art; N.U.R.S.E.'s pre-existing `data-phase` selects the correct one automatically.
- `assets/scenes/treatment.svg`, `records.svg`: original environment illustrations, selectable via a reversible scenery toggle. The four original image backgrounds remain untouched.
- `assets/items/*.svg`: six inventory illustrations, matched to existing `data-item` IDs via stylesheet selectors.
- `visual-overhaul.css`: new visual skin including N.U.R.S.E. states, inventory, atmospheric scanline overlay, and a replacement scare portrait.
- `visual-overhaul.js`: adds a scene comparison button, remembers preference only on the browser, without touching saved game state.

## How to replace concept art with approved AI-generated PNG/WebP files

1. Generate separate **clean images**, not infographics or composites: treatment/records backgrounds at 16:9 (ideally 1600–1920 wide); portrait variants at 3:4; object icons square with transparent backgrounds.
2. Review clinical realism, anatomical details, legibility, character consistency, and accessibility before publishing. Remove extraneous text from generated artwork.
3. Optimize room images as WebP for download speed; aim for 100–350 KB per room, portrait under 120 KB, icon 10–40 KB. Commit or upload each file into its matching `playtest/treatment-room/assets/` subfolder in GitHub.
4. Update `visual-overhaul.css` URLs to reference the approved files, and adjust dimensions/crop. Keep paths relative to the stylesheet. For backgrounds, maintain 16:9 composition and all hotspot coordinates until gameplay QA proves alignment.
5. Test in `visual-lab.html` and the actual game on iPhone Safari, desktop, with voice/sound toggled, and with Reduce Motion enabled.
6. Once approved, remove the comparison switch and ship the preferred art as the default.

## Non-regression QA

- Room progression, puzzle saves, and clue hotspots remain functional.
- Tavi's real recordings are independent: the visual files do not change the audio code or TTS quota.
- The existing jump-scare toggle still gates the actual story scare. A user with reduced motion is protected from extra visual judder.
- The visual-lab scare button has no sound and is not part of gameplay.
- Do not upload confidential patient information or copyrighted third-party visual material into the public repository.

**Note:** This first pass contains new *illustrative vector assets*. The more photorealistic image-generation concept board is for art direction; the final high-resolution raster art can be uploaded through GitHub and plugged into these same paths without redesigning the interface.
