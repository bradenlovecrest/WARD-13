# WARD 13 — Architecture and milestone plan

## Baseline

The current **index.html** is a complete offline-safe single-file browser game, the protected baseline for new work. No backend, credential, or paid service is needed to run this version.

## Planned boundaries

- **Game engine:** scene navigation, room/object state, inspect and combine interactions, puzzle primitives, accessibility, audio, save/load.
- **Content packs:** independent course/topic manifests, source notes, validated case stems, answer keys, rationales, alternate variants.
- **Adaptive learning (local):** record concept-level answers, attempts, hints and successes on fresh examples; decide when to present alternate cases and optional restful puzzles.
- **Visual respite puzzles:** jigsaws, spot-the-difference, hidden objects, pattern tiles; provide skip settings and alternative controls so these remain accessible.
- **Player mode:** no personal data or roster; progress stays local until opt-in sharing is designed and approved.

## Safe migration stages

1. **Baseline preserved** — commit the known working original unchanged and document how to play it.
2. **Puzzle laboratory (experimental branch)** — test a jigsaw, object inspection, snapping/rotation and one visually rich scene. No mandatory dependence on remote resources.
3. **Data extraction** — introduce a versioned, independently validated JSON-like content-pack module. Preserve legacy saves or provide a migration path.
4. **Adaptation v1** — explicit simple rules: repeat missed concepts in different contexts; use hints and multiple fresh correct responses before marking improved. Don't treat rapid clicking as learning.
5. **Classmate release** — accessibility review, clinical content QA, browser smoke tests, licensing check, optional published link.

## Definition of done for a new puzzle module

- Works with mouse, keyboard and touch or a documented equivalent.
- Has reset, help/hints, clear success/failure and save/load.
- Does not leak answers via inaccessible-only content; correct reasoning is explained after completion.
- Runs offline without requiring tokens, API calls or account sign-in.
- Has at least one automated or manually documented completion-path test.

## Non-goals for initial release

- Real-time multiplayer, individual student accounts, leaderboards with identifiable data, live model inference or clinical decision support.
- Publishing instructor-owned slide decks, actual exams or private patient information.
