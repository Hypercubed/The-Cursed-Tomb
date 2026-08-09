## Why

`docs/rules.md` frontmatter (`version: "0.0.11"`) is the authoritative ruleset version, but `scripts/make_rules_pdf.py` hard-codes `v0.0.11` in six places (docstring, running header, cover subtitle, Part II divider, PDF metadata). Bumping the version requires hunting every literal — drift is already visible (`package.json` is `0.1.0` vs ruleset `0.0.11`). The PDF generator should be a pure consumer of the source of truth, not a second source.

## What Changes

- Parse YAML frontmatter from the ruleset markdown file supplied via `--rules` (default `docs/rules.md`) at PDF build time and use its `version` (and derived `date`/`status`) everywhere the PDF currently hard-codes `v0.0.11`.
- **Option B (chosen):** use a real YAML parser (`PyYAML` / `pyyaml`) via `yaml.safe_load` on the extracted frontmatter block rather than regex, for robustness to quoting, spacing, and comment variations. Add `pyyaml` to the Python dependency set (`pyproject.toml` / `uv.lock` when `cross-platform-python-uv` lands; otherwise `requirements` / PEP 723 header).
- Replace all hard-coded occurrences in `scripts/make_rules_pdf.py` — `header()`, `render_cover()`, `build_document()` Part II subtitle, `configure()` title/metadata, module docstring — with the parsed value. Fail fast with a clear error if `version` is missing or not semver-like.
- Derive the cover `date` line (`August 8, 2026`) from the `date: "2026-08-08"` frontmatter field instead of a literal, and optionally surface `status: draft` consistently.
- Keep `--rules` as the version source: when a custom path is passed, that file's frontmatter is authoritative.

## Capabilities

### New Capabilities
- None — build-time / docs tooling only; no user-facing app capability.

### Modified Capabilities
- None — no `openspec/specs/` requirement changes. PDF output is rendered artifact, not runtime behavior.

> This change opts out of specs via `skip_specs: true` in `.openspec.yaml` (pure tooling/docs consistency fix). It does not change runtime game behavior.

## Impact

- **Affected code**: `scripts/make_rules_pdf.py` (add `get_rules_meta()` / `parse_frontmatter()`, wire `version`/`date`/`status` through `RulebookPDF`, `build_document`, `render_cover`, `header`, `configure`; remove hard-coded literals), Python deps (`pyyaml` in `pyproject.toml` or PEP 723 `// [tool.uv]` header), optional `docs/example-of-play.md` companion note if also derived.
- **Dependencies**: `PyYAML` (new, lightweight, pure-Python); aligns with `cross-platform-python-uv` which introduces `pyproject.toml` + `uv.lock` — coordinate merge order.
- **Breaking changes**: None. CLI (`--rules`, `--standard`, `--example`, `--output`) unchanged; missing `version` now errors instead of silently rendering stale text (intentional).
- **Risks**: Frontmatter format drift (handled by strict validation); `cross-platform-python-uv` touches same file (font fallbacks, `uv` entry point) — rebase/merge conflict likely, keep changes isolated to version-extraction helper.
