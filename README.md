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
- **Campaign mode** — play across a series of games with a running score
- **Ancient tomb theme** — dark aesthetic with the Cinzel typeface and Egyptian-inspired design
- **Python simulation** (`sim/cursed_tomb_sim.py`) — offline batch simulator for analyzing strategy win rates

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

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

This project is private. No license is granted for redistribution or reuse without explicit permission.
