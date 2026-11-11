# WARD 13 — Tavi voice rollout

Tavi is the N.U.R.S.E. character voice, generated with Google Gemini Flash TTS. The Treatment Room playtest already embeds three recordings. This rollout covers the opening greeting and 17 other scripted lines (18 additional recordings).

## On an iPhone

1. Merge the `feature/tavi-full-voice` pull request into `main`.
2. Open the repository’s **Actions** tab and select **WARD 13 — Publish Tavi dialogue**.
3. Use **Run workflow → mode: preview**. The output lists each line in a numbered catalogue; no API calls or credits are used.
4. Run once with **mode: install**. This publishes the new audio playback logic, but does not generate audio. Missing recordings still fall back to browser speech.
5. Choose **mode: generate**, **start_index: 1**, **count: 1**, and check **confirm_rights** only if the generated audio may be published publicly. Wait for a successful job before trying a bigger batch.
6. Continue with starting indexes **2, 5, 8, 11, 14, 17**, count 3 (the last covers two lines). Every successful batch publishes WAVs to `playtest/treatment-room/audio/tavi/` and makes the game load them by script.
7. Open https://bradenlovecrest.github.io/WARD-13/playtest/treatment-room/ on the iPhone, enable Voice, and select **★ Tavi** in Audio Studio. The three embedded Treatment Room clips remain available as audition samples. Trigger earlier room scenes to test newly recorded lines.

**Important:** The **mode: generate** option invokes the Gemini API and may use quota/credits; no charge is incurred by preview or install. The audio is generated server-side by GitHub Actions. Do not expose `GEMINI_API_KEY` in JavaScript, commits, or screenshots. Generated recordings become public when committed to this public repository. Verify that the usage and publication rights permit this.

If the action shows “resource not accessible” on pushing, check repository Settings → Actions → General → Workflow permissions, or inspect branch protection restrictions. If one batch fails, use its logs; earlier successful batches stay committed.

The older **WARD 13 Voice Studio (manual)** workflow still generates individual audition artifacts; it does not publish those artifacts to the game. This new workflow automates the publishing step.

## Technical behavior

- Stable SHA-256 based filenames keep dialogue-to-audio mapping predictable.
- `tools/publish_tavi.py` scans the playtest for literal `say()` lines and the opening greeting; it installs a short audio-first wrapper around the existing browser speech function.
- It preserves the existing three embedded MP3 recordings and does **not** overwrite the main `index.html` game.
- Audio playback is user-initiated, respects voice toggles, supports switching to system voices, and falls back to device speech if a WAV is missing.
- If later dialogue is dynamic rather than a literal `say()` string, add a manifest entry or explicit event cue in a future update.

## Free-tier caution

Start with a one-line test. Actual Gemini TTS availability and rate limits depend on the Google account and model. If generation returns quota errors, switch to preview/install while preserving the playable game, then resume generation only when access is available.
