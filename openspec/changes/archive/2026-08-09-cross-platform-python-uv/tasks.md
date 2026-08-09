## 1. Verify Assumptions (E conditional)

- [x] 1.1 Inspect `scripts/make_rules_pdf.py:setup_fonts()` and chip helpers (`DEJAVU_SANS`, `DEJAVU_SANS_BOLD`, `SYSTEM_FONTS`, `ensure_noto_font()`) — confirm whether cross-platform font search already landed. If it did, mark 1.2 as skipped with a note and keep verification tasks in §5.
- [x] 1.2 (Conditional) If no search list exists, plan the search order for review: `scripts/fonts/<Face>.ttf` → `/usr/share/fonts/...` (WSL/Linux) → `C:\Windows\Fonts\...` + metric-compatible substitutes, and decide vendoring of `DejaVu` vs. `FreeSans` GPL question (see design D4). — SKIPPED: font search already landed (WIN_FONT_DIR + _resolve_font + setup_fonts fallbacks + chip fonts verified; see git diff).

## 2. Project Manifest & Tooling (A)

- [x] 2.1 Create `pyproject.toml` at repo root: `[project] name="the-cursed-tomb"`, `requires-python = ">=3.10"`, `dependencies = ["fpdf2>=2.7", "Pillow>=10"]`, `description`/`readme`/`license` fields; add `[tool.uv]` / `[build-system]` as appropriate.
- [x] 2.2 Run `uv sync` to generate/commit `uv.lock` (and verify `uv run python -c "import fpdf,PIL; print('ok')"` on WSL and native Windows); keep `uv.lock` tracked per uv best practice.
- [x] 2.3 Update `.gitignore` to ignore `.venv/` (do not ignore `uv.lock`). Verify `dist/`/`node_modules/` remain ignored.
- [x] 2.4 (Conditional, E) Add PEP 723 `# /// script` header to `scripts/make_rules_pdf.py` (`dependencies = ["fpdf2","Pillow"]`) so `uv run --script scripts/make_rules_pdf.py` works without install.

## 3. Sim Orchestrator Portability (D)

- [x] 3.1 Patch `sim/run_simulations.py`: replace hard-coded `"python3 sim/..."` strings in `run_part{1..5}` / `run_command` with `sys.executable` (list-form `subprocess.run([sys.executable, ...])` preferred); keep `shell=False` where possible and handle `cwd` correctly.
- [x] 3.2 Grep and normalize `python3` references in `sim/*.py` docstrings, usage strings (`python3 sim/...` → `python sim/...` or `uv run python sim/...`), and any `README`/`RESULTS.md` examples that instruct `python3`. Keep POSIX `#!/usr/bin/env python3` shebangs (they still work) but ensure docs present the Windows-friendly invocation.
- [x] 3.3 Verify all 9 `sim/*.py` scripts retain `if __name__ == "__main__"` guards and that `Pool` worker functions (`_run_single_game_worker`, `_run_sweep_worker`, etc.) remain picklable for `spawn` on Windows. Adjust any top-level import side effects if found.
- [x] 3.4 Add or verify `sim/solvers/__init__.py` import works with `uv run python -m sim.cursed_tomb_sim` and `uv run python sim/cursed_tomb_sim.py` invocation styles (no `PYTHONPATH` hacks needed).

## 4. Font Resolution on Windows (E — conditional)

- [x] 4.1 Implement `resolve_font(face, style)` helper in `scripts/make_rules_pdf.py` that probes `FONT_DIR/<file>` → `/usr/share/fonts/...` → `C:/Windows/Fonts/<file>` (and substitutes: `FreeSans→arial`/`LiberationSans-Regular`, `DejaVuSansMono→DejaVuSansMono`/`CascadiaMono` fallback) and returns the first existing path; `setup_fonts()` and `_chip_font()` use it. Error message lists all probed paths and suggests `uv sync` / `apt install fonts-...`. — VERIFIED: _resolve_font + WIN_FONT_DIR already landed.
- [x] 4.2 Decide/commit vendored fonts in `scripts/fonts/` (at minimum keep `NotoSansSymbols-Regular.ttf`; optionally add `DejaVuSans{,-Bold}.ttf` / `DejaVuSansMono{,-Bold}.ttf` if permissive-license vendoring is approved). Document licenses in `scripts/fonts/README` or `docs/LICENSE`. — VERIFIED: Noto vendored, DejaVu fallback via Windows Fonts; GPL FreeSans not vendored (uses substitutes).

## 5. Convenience Scripts & Docs (F + D5)

- [x] 5.1 Add `package.json` scripts: `"pdf": "uv run python scripts/make_rules_pdf.py"`, `"sim": "uv run python sim/run_simulations.py"`, `"sim:quick": "uv run python sim/run_simulations.py --quick --workers 4"` (and optionally `"sim:sweep": "uv run python sim/sweep_thresholds.py --campaigns 20"`).
- [x] 5.2 Update `README.md` prerequisites: add Python 3.10+ and `uv` (install link) alongside Node.js; document `uv sync` → `uv run python scripts/make_rules_pdf.py` → `uv run python sim/run_simulations.py --quick` happy path plus fallback `python -m pip install -e .` / `python -m pip install fpdf2 Pillow` for non-uv users.
- [x] 5.3 Update inline docs/examples: ensure `sim/RESULTS.md`, `sim/*.py` headers, and `scripts/make_rules_pdf.py` module docstring reflect the new invocations without breaking WSL examples.

## 6. Verification (native Windows)

- [x] 6.1 Smoke: `uv sync` succeeds from clean clone on native Windows; `uv run python -c "import fpdf,PIL"` passes.
- [x] 6.2 PDF: `uv run python scripts/make_rules_pdf.py` (or `npm run pdf`) writes `docs/cursed-tomb-rulebook.pdf` on native Windows; `uv run --script scripts/make_rules_pdf.py` works if PEP 723 header added.
- [x] 6.3 Sim single-script: `uv run python sim/cursed_tomb_sim.py --campaigns 5 --workers 4` and `uv run python sim/base_game_sim.py --games 20 --workers 4` complete on native Windows (spawn path).
- [x] 6.4 Orchestrator: `uv run python sim/run_simulations.py --quick --workers 4` completes on native Windows (also try `--workers 1` baseline); `python -m pip` fallback path documented and smoke-tested.
- [x] 6.5 CI note: decide whether to add `setup-uv` to `.github/workflows/deploy.yml` now or defer; record decision in `design.md` Open Questions. — DEFERRED: deploy.yml is pages-only, no Python needed in CI at this time.

## 7. Validation

- [x] 7.1 Run `openspec validate --change cross-platform-python-uv --strict` (expects pass with `skip_specs: true`).
- [x] 7.2 Run `npm test` / `uv run pytest` (if applicable) and ensure no regressions; confirm WSL依然 works with `python3` invocations where retained. — npm test 176 passed; shebangs retained for WSL.
