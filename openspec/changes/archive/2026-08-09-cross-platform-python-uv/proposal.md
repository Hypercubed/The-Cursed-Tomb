## Why

Python scripts run seamlessly in WSL (Ubuntu) but fail on native Windows. `scripts/make_rules_pdf.py` crashes on Windows due to hard-coded Linux font paths (`/usr/share/fonts/...`) and undeclared `fpdf2`/`Pillow` dependencies with no lockfile (`pip` not on PATH, `python3` vs `python` mismatch). `sim/` orchestration (`sim/run_simulations.py`) hard-codes `python3` in shell commands, breaking `uv`/`python` on Windows, and lacks a single reproducible install story. Developers switching between WSL and native Windows need one command to install and run both the rulebook PDF and simulations.

## What Changes

- Add a root `pyproject.toml` managed by `uv` declaring `fpdf2` and `Pillow` (and `requires-python`), with a committed `uv.lock` for reproducibility — `uv sync` / `uv run` becomes the canonical entry point on any OS (A).
- Fix `sim/run_simulations.py` to invoke sub-processes via `sys.executable` (or `uv run` aware) instead of hard-coded `python3`, and normalize shebangs/docs from `python3` to `python` / `uv run python` (D).
- Add `package.json` convenience scripts (`pdf`, `sim`, `sim:quick`) that delegate to `uv run python ...` so Windows developers can use `npm run pdf` without remembering interpreter names (F).
- If not already fixed, make `scripts/make_rules_pdf.py` font resolution cross-platform via a search list (vendored `scripts/fonts/` → Linux `/usr/share/fonts/...` → Windows `C:/Windows/Fonts/...`) plus a PEP 723 `// script` header for `uv run --script` ergonomics (E — conditional, verify first).
- Document prerequisites and usage in `README.md` (Python + `uv`, fallback `pip`) and update `.gitignore` for `.venv/`.
- Verify `multiprocessing.Pool` spawn safety on Windows (`if __name__ == "__main__"` guards) with a smoke run.

## Capabilities

### New Capabilities
- None — this is a pure tooling / developer-experience change with no user-facing behavior change.

### Modified Capabilities
- None — no spec-level requirements change. Existing simulation CLI (`--solver`, `--campaigns`, etc.) and PDF output remain unchanged.

> This change opts out of specs via `skip_specs: true` in `.openspec.yaml` (tooling/docs only).

## Impact

- **Affected code**: `pyproject.toml` (new), `uv.lock` (new), `scripts/make_rules_pdf.py` (fonts + optional PEP 723), `sim/run_simulations.py` (interpreter), `sim/*.py` shebangs/docs, `package.json`, `README.md`, `.gitignore`, `.github/workflows/deploy.yml` (optional CI `uv` setup).
- **Dependencies**: `uv` (recommended, already present on Windows host as 0.12.3); fallback `python -m pip` still works. `fpdf2`/`Pillow` versions pinned via `uv.lock`.
- **Breaking changes**: None. Existing WSL `python3` invocations continue to work; `uv run` is additive.
- **Risks**: `spawn` vs `fork` multiprocessing on Windows is slightly slower and stricter about pickling; font fallback may render with metric-compatible substitutes if vendored fonts not committed.
