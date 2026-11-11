# WARD 13 🩸

**WARD 13: The Protocol — After Hours** is a browser-based nursing education escape room combining environmental investigation, tactile puzzle interactions, clinical reasoning, and atmospheric storytelling.

## 🎮 Play

Open [index.html](./index.html) in a modern browser to play offline. The game contains **five rooms**, **15 clinical locks**, interactive objects and an evidence inventory, hints, optional sound, and a four-seal finale. Progress saves to the local browser when storage is available.

**Online play:** GitHub Pages is not enabled automatically by this repository. A repository administrator can activate it from **Settings → Pages → Deploy from a branch → main / (root)**. Once Pages finishes deploying, the public game should be accessible at `https://bradenlovecrest.github.io/WARD-13/`. Do not treat the link as live until verified.

## 🧪 Current educational scope

The installed content is **NURS 311 pharmacology remediation** covering:

- Arterial blood gases (ABGs)
- Inflammation's five cardinal signs and glucocorticoids
- Cirrhosis, ulcerative colitis, and Crohn disease
- Preload, afterload, and antihypertensive medication teaching
- Diabetes mellitus and adrenal disorders
- Respiratory medication teaching

Questions are **original practice content**, written with the previously provided exam-review-aligned study materials as the primary guide; they are **not actual exam questions**, and should be independently reviewed for clinical correctness before instructional reuse. The original instructor slides are not bundled in this public repository.

## 🛠️ Development approach

The current working game is preserved as a single self-contained HTML file in `index.html`. Our next version will separate the engine from educational content, so future exam packs can be installed without changing room mechanics. See [architecture](docs/ARCHITECTURE.md) and [content-pack schema](docs/CONTENT_PACK_SPEC.md).

We are prioritizing:

1. Accessibility and responsive gameplay, including touch-friendly puzzle alternatives.
2. Genuine visual puzzles: jigsaws, hidden objects, spatial manipulation, and connected clues.
3. Basic **local-only adaptive remediation** based on missed concepts, hints and successful new cases.
4. A content-pack system for different courses and exams.
5. Classmate play without accounts or collection of private student data.

## 🔐 Privacy and safety

- Progress lives in the player's browser, not a hosted student database.
- Don't upload actual exams, private records, patient information, identifiable student performance, or copyrighted course materials without authorization.
- Educational puzzles are study aids and not substitutes for institution-approved medication administration procedures.
- For now, **do not overwrite the working `index.html` when experimenting**: use a separate branch and review changes before merging.

## Project status

- ✅ Standalone playable game committed
- ⏳ GitHub Pages deployment to be configured and verified
- 🔬 Reusable content packs and adaptive difficulty in design
- 🧩 Jigsaw and scene-based puzzle prototypes planned

Built for learning and escape-room fun. No Replit credits required.
