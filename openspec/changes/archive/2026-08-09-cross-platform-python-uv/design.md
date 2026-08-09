## Context

Works in WSL Ubuntu, fails on native Windows. `scripts/make_rules_pdf.py` uses Linux-only font paths (`/usr/share/fonts/truetype/freefont/FreeSans.ttf`, `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`) and `DEJAVU_SANS` chip-rendering paths, exits with `SystemExit` if the file is missing. Python deps (`fpdf2`, `Pillow`) are undeclared — no `pyproject.toml` / `requirements.txt` / lockfile; `pip` isn't on PATH on Windows Store Python, while `uv 0.12.3` is present. `sim/run_simulations.py` builds 5 shell commands with hard-coded `python3` (`base_game_sim.py`, `campaign_rounds_sim.py`, `cursed_tomb_sim.py`, `sweep_thresholds.py`, `test_solvers.py`) so the orchestrator fails on Windows where the interpreter is `python` / `.venv/Scripts/python.exe`. `sim/*.py` otherwise ship as stdlib-only and already guard `if __name__ == "__main__"` for `multiprocessing.spawn` on Windows. E (font search cross-platform) may already be fixed — verifier must check before duplicating. See `proposal.md` for motivation.

Current layout: repo-root `package.json`/`vite`/`vitest`, `scripts/fonts/NotoSansSymbols-Regular.ttf` vendored (fallback glyph), `sim/solvers/` pure Python, `.gitignore` ignores `dist/`/`node_modules/` but not `.venv/`.

## Goals / Non-Goals

**Goals:**
- One reproducible install: `uv sync` (or `uv pip install`) works on WSL, macOS, native Windows.
- `scripts/make_rules_pdf.py` runs on Windows without manual `apt install fonts-*`.
- `sim/` runs identically on both environments, including `sim/run_simulations.py --quick --workers 4` orchestrator and per-script `--workers` parallel runs.
- Minimal, additive change — existing WSL `python3` invocations keep working; docs + `package.json` convenience scripts provide the happy path.

**Non-Goals:**
- Vendoring large proprietary fonts or changing PDF visual design.
- Switching simulations to a non-stdlib dependency or rewriting multiprocessing.
- CI/CD PDF generation (out of scope unless trivial to add `setup-uv`).
- Changing game rules or simulation logic.

## Decisions

### D1 — Root `pyproject.toml` + `uv.lock` for all Python scripts (A)

**Decision:** Add `pyproject.toml` at repo root with `[project] name="the-cursed-tomb"`, `requires-python = ">=3.10"`, `dependencies = ["fpdf2>=2.7", "Pillow>=10"]`, `description`/`readme`/`license` metadata, and `[tool.uv]` defaults. Commit `uv.lock` (reproducible PDF).

**Why `uv`:** Already installed on the Windows host (0.12.3); `pip` not on PATH under Store Python; `uv sync`/`uv run` is cross-platform and lockfile-aware. Fallback remains `python -m pip install -e .` or `python -m pip install fpdf2 Pillow`.

**Alternatives:**
- `requirements.txt` only — no lockfile, no interpreter management, weaker cross-platform story.
- `optional-dependencies` / `[dependency-groups]` with `pdf` group so `sim/` stays zero-deps — more ceremony for little gain (sim being stdlib-only is an internal detail, not a user promise). Keep a single `dependencies` list for now.
- PEP 723 `# /// script` header per-file — complementary, not a replacement; add to `make_rules_pdf.py` for `uv run --script` ergonomics but don't rely solely on it (orchestrator needs a project).

**Risks:** Requires `uv` to be installed; document `pip` fallback. Some contributors may not want `uv.lock` committed — follow uv best practice (commit it).

### D2 — Orchestrator interpreter via `sys.executable` (D)

**Decision:** Replace hard-coded `"python3 sim/foo.py ..."` strings in `sim/run_simulations.py` (`run_command` + `run_part{1..5}`) with `sys.executable` (the current interpreter — inside `uv run` it's `.venv/Scripts/python.exe`; outside it's `python`). Optionally wrap with `shlex.quote` / `subprocess.run([sys.executable, ...])` list form to avoid shell quoting. Normalize shebangs/doc examples from `python3` to `python` (keep `#!/usr/bin/env python3` for POSIX, but docs say `python` / `uv run python`).

**Alternatives:**
- `"uv run python"` string — couples orchestrator to uv even when running outside it.
- `shutil.which("python3") or sys.executable` fallback chain — over-engineered.

### D3 — `package.json` convenience scripts (F)

**Decision:** Add `"pdf": "uv run python scripts/make_rules_pdf.py"`, `"sim": "uv run python sim/run_simulations.py"`, `"sim:quick": "uv run python sim/run_simulations.py --quick --workers 4"` (and per-suite variants if useful). This gives Windows developers a familiar `npm run pdf` path without remembering `python` vs `python3` vs `py`.

**Alternative:** No npm scripts, docs-only — less discoverable on Windows where `npm` is the primary task runner.

### D4 — Font resolution (E) — verify-first

**Decision:** Inspect `scripts/make_rules_pdf.py:setup_fonts()` and chip helpers (`DEJAVU_SANS`, `DEJAVU_SANS_BOLD`, `SYSTEM_FONTS` dict) for existing search logic. If cross-platform fallback already landed, leave as-is and only add smoke verification to tasks. If not, implement a search list per font face: `scripts/fonts/<Face>.ttf` (vendored if commit allowed) → `/usr/share/fonts/...` (Linux/WSL) → `C:\Windows\Fonts\<Face>.ttf` / metric-compatible substitute (`arial.ttf`, `DejaVuSans.ttf`, `LiberationSans-Regular.ttf`). Fail with a single actionable message listing probed paths and the `uv sync` hint. Optionally add PEP 723 header `# /// script\n# dependencies = ["fpdf2","Pillow"]` to `make_rules_pdf.py` for `uv run --script` ergonomics.

**Vendoring note:** `DejaVu` (permissive) is safe to vendor; `FreeSans`/GNU FreeFont is GPL-3 with font exception — prefer metric-compatible `Liberation`/`DejaVu` substitutes or prompt for system install rather than committing GPL fonts without review.

### D5 — Documentation & ignore files

**Decision:** `README.md` gains a "Python / Simulations" prerequisites section (Python 3.10+, `uv` install link, `uv sync` / `uv run` happy path, `python -m pip` fallback). `sim/README` or `sim/RESULTS.md` invocation examples updated to `uv run python`. `.gitignore` adds `.venv/` (keep `uv.lock` tracked). Optionally `.github/workflows/deploy.yml` gets a non-blocking `setup-uv` note.

## Risks / Trade-offs

- **Multiprocessing spawn vs fork** → Windows `spawn` re-imports `__main__`; slower and stricter pickling. Mitigation: all sim scripts already have `if __name__ == "__main__"` guards and top-level worker functions; verify with `--workers 4` smoke on native Windows.
- **Font metric mismatch** → Windows fallback fonts may have slightly different glyph metrics than Linux FreeSans/DejaVu, shifting PDF line breaks by ~1 line. Mitigation: keep vendored `NotoSansSymbols` (exists); if pixel-identical output is required, vendor `DejaVu` and defer `FreeSans` decision.
- **Adopting `uv`** → Contributors without `uv` get a new tool to install. Mitigation: document `python -m pip install -e .` fallback and link `https://docs.astral.sh/uv/getting-started/installation/`.
- **Hard-coded `python3` callers outside orchestrator** → Search covers `sim/*.py` docstrings, `README.md`, `sim/RESULTS.md`, `scripts/*.py` usage strings. Incomplete grep is low-risk; `uv run` normalizes anyway.
- **E idempotency** → If font fix already merged, D4 becomes verification-only; tasks mark it conditional to avoid re-editing.

## Migration Plan

1. Land `pyproject.toml` + `uv.lock` + `.gitignore` `.venv/` (no runtime behavior change).
2. Patch `sim/run_simulations.py` interpreter + docs/shebangs (D2).
3. Verify or patch font search (E) — conditional.
4. Add `package.json` scripts (F) + `README.md` docs (D5).
5. Smoke on native Windows: `uv sync && uv run python scripts/make_rules_pdf.py && uv run python sim/run_simulations.py --quick --workers 1` then `--workers 4`.
6. Rollback: revert `pyproject.toml` add; `pip`-based workflow still works; no data migration.

## Open Questions

- Should `FreeSans` be vendored (GPL review) or is a metric-compatible substitute acceptable for the rulebook?
- Commit `uv.lock` — confirmed yes per uv practice, unless team prefers gitignore.
- Add `setup-uv` to `deploy.yml` now or defer until PDF is built in CI?
