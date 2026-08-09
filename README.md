# 🪦 The Cursed Tomb

> **A Pyramid Solitaire card game with an ancient tomb aesthetic.**

**The Cursed Tomb** is a browser-based implementation of Pyramid Solitaire — the classic card game where your goal is to clear all 28 cards from the pyramid by pairing cards that sum to 13. Face the curse, conquer the pyramid, and escape the tomb.

🎮 **[Play Now](https://hypercubed.github.io/The-Cursed-Tomb/)** _(deployed via GitHub Pages)_

---

## ✨ Features

- **Pyramid Solitaire gameplay** — pair cards that sum to 13 to clear the pyramid
- **Multiple solver strategies** — built-in autoplay with configurable heuristics and a perfect graph-search solver
- **Autoplay & simulation** — automated play at configurable speeds, including instant-speed batch runs
- **Win/loss statistics** — persistent tracking of game outcomes across sessions
- **Matched cards tracking** — view previously matched cards during a game
- **Game persistence** — settings and game state stored in `localStorage`
- **Visual animations** — match feedback and win/loss animations
- **Campaign mode** — play an expedition across multiple rounds with deck evolution
- **Ancient tomb theme** — dark aesthetic with the Cinzel typeface and Egyptian-inspired design
- **Python simulation** (`sim/cursed_tomb_sim.py`) — offline batch simulator for analyzing strategy win rates

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)
- [Python](https://www.python.org/) 3.10+ (for PDF rulebook & simulations)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (recommended Python runner; fallback `python -m pip` works)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The production bundle is output to `./dist/`.

### Run Tests

```bash
npm test
```

### Build the PDF Rulebook

```bash
# one-time: install Python deps (uv recommended)
uv sync

# build PDF
uv run python scripts/make_rules_pdf.py
# — or —
npm run pdf
# standalone (no install needed if uv is present):
uv run --script scripts/make_rules_pdf.py

# fallback without uv:
python -m pip install fpdf2 Pillow
python scripts/make_rules_pdf.py
```

### Run Simulations

```bash
uv sync
uv run python sim/run_simulations.py --quick --workers 4
# — or —
npm run sim:quick

# per-script examples
uv run python sim/cursed_tomb_sim.py --campaigns 20 --workers 4
uv run python sim/base_game_sim.py --games 100 --workers 4

# fallback without uv:
python sim/run_simulations.py --quick --workers 4
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Testing | [Vitest](https://vitest.dev/) |
| Deployment | [GitHub Pages](https://pages.github.com/) via GitHub Actions |
| Simulation | Python 3 (`sim/cursed_tomb_sim.py`) |

---

## 📁 Project Structure

```
the-cursed-tomb/
├── src/
│   ├── components/         # React UI components
│   ├── hooks/              # Custom React hooks (game state, autoplay, etc.)
│   ├── storage/            # localStorage persistence layer
│   ├── game.ts             # Core game logic and state machine
│   ├── solver.ts           # Autoplay solver strategies
│   ├── App.tsx             # Root application component
│   └── index.css           # Global styles and design tokens
├── sim/
│   └── cursed_tomb_sim.py  # Offline Python simulator
├── openspec/               # Design specs and change management
│   ├── specs/              # Canonical capability specs
│   └── changes/            # In-progress change proposals & tasks
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions CI/CD pipeline
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🤖 AI Disclaimer

> **This project is AI-generated and AI-maintained.**
>
> The source code, documentation, design specifications, and related artifacts in this repository are primarily authored and maintained by AI coding assistants (including Google Gemini / Antigravity). Human oversight is applied to review, direct, and approve changes, but the majority of implementation work is performed by AI agents.
>
> As a result:
> - Code may reflect AI reasoning patterns and may not follow all conventional human-authored style guidelines.
> - Bugs, design decisions, and architectural choices originate from AI generation and may require human judgment to evaluate.
> - This project is experimental in nature and is provided as-is.

---

## 📜 License

**Code** — All source code, scripts, simulations, configuration, and other
files outside `docs/` (including `src/`, `sim/`, `scripts/`, `public/`) are
licensed under the **MIT License** — see [`LICENSE`](LICENSE).
Copyright (c) 2026 Jayson Harshbarger.

**Rules & rulebook text** — Original game rules in `docs/` (`rules.md`,
`example-of-play.md`, and Parts II & III of any PDF generated from them)
are licensed under
**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** —
see [`docs/LICENSE`](docs/LICENSE).
Copyright (c) 2026 Jayson Harshbarger. `standard-pyramid-rules.md` (Part I —
classic Pyramid Solitaire summary) is **public domain / CC0 1.0**: no copyright
claimed over the underlying game, explanatory text waived via CC0 — see that
file's header and `docs/LICENSE`.
Human-readable deed: <https://creativecommons.org/licenses/by-sa/4.0/> ·
Legal code: <https://creativecommons.org/licenses/by-sa/4.0/legalcode>

> As the copyright holder, Jayson Harshbarger retains the right to distribute
> the same material under additional or different terms (for example, in a
> commercial digital release such as Google Play). The CC BY-SA license governs
> what *others* may do with the rulebook; it does not restrict the author.
