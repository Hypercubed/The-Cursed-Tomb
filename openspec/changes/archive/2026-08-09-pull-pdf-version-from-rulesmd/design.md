## Context

`docs/rules.md` YAML frontmatter is the single source of truth for the ruleset:

```yaml
---
title: "The Cursed Tomb"
version: "0.0.11"
date: "2026-08-08"
status: "draft"
---
```

`scripts/make_rules_pdf.py` already strips that frontmatter for rendering (`strip_frontmatter` / `strip_doc` at ~L470) but never reads it. Instead it hard-codes `v0.0.11` in 5 runtime locations plus the docstring — `header()` running header, `render_cover()` subtitle date/version/status, `build_document()` Part II divider, `configure()` PDF title/metadata — and `docs/example-of-play.md:10` carries a companion-note copy. Bumping the version requires a multi-file hunt; drift has occurred (`package.json` is `0.1.0` vs ruleset `0.0.11`). A concurrent change `cross-platform-python-uv` touches the same script (font fallbacks, `uv` entry point, `pyproject.toml`/`uv.lock`), so the version-extraction helper must be isolated and conflict-friendly.

See `proposal.md` for motivation and why now.

## Goals / Non-Goals

**Goals:**
- Make the PDF a pure consumer of `docs/rules.md` frontmatter: exactly one place to bump version/date/status.
- Use a real YAML parser (Option B) for robustness to quoting, spacing, and `date` type coercion.
- Fail fast with a clear message if `version` is missing or not semver-like, rather than silently rendering stale text.
- Keep `--rules` as the authority: a custom path's frontmatter wins.
- Stay compatible with `cross-platform-python-uv`'s `uv`-managed deps.

**Non-Goals:**
- Changing runtime game code, `openspec/specs/`, or app version (`package.json` `0.1.0` is unrelated).
- Migrating `docs/standard-pyramid-rules.md` `version: "1.0"` (CC0 Part I) — separate artifact.
- Rewriting `docs/example-of-play.md` companion note unless trivial to derive (nice-to-have, not required).
- Introducing a new CLI flag for manual version override.

## Decisions

### D1: Parser — `PyYAML` (`yaml.safe_load`) over regex (Option B)

- **Chosen:** Add `pyyaml` and parse the extracted frontmatter block with `yaml.safe_load`. Validate `version` / `date` / `status` from the resulting dict. Ensures correct handling of `version: "0.0.11"` vs `version: 0.0.11`, `date: 2026-08-08` (YAML date → `datetime.date`), comments, and whitespace.
- **Alternative — regex:** zero deps, minimal change, but fragile to quoting/spacing variants and date-type surprises. Rejected per user direction (Option B) and robustness.
- **Alternative — `python-frontmatter` lib:** heavier, markdown-specific, unnecessary when only the YAML block matters.

### D2: Where to parse and how to thread

- **Chosen:** Add a small helper in `scripts/make_rules_pdf.py`:

  ```python
  @dataclass(frozen=True)
  class RulesMeta:
      version: str  # "0.0.11"
      date: date    # datetime.date(2026, 8, 8)
      status: str   # "draft"
      title: str

  def get_rules_meta(rules_path: Path) -> RulesMeta: ...
  ```

  - Extract frontmatter with the existing `^---\n.*?\n---\n` pattern (reuse/extract `strip_frontmatter`'s regex) but `yaml.safe_load` the interior instead of discarding it.
  - Validate: `version` required, `re.match(r"^\d+\.\d+\.\d+$", version)`; `date` required, accept `str` or `date` and normalize; `status` optional default `"draft"`.
  - On failure: `SystemExit("docs/rules.md frontmatter missing/invalid version ...")`.
  - Call once in `main()` after resolving `args.rules`, pass `meta` into `build_document()`, `render_cover()`, `RulebookPDF` (store as `pdf.rules_meta`), and `configure()`.

- **Alternative — parse inside each function:** repeats I/O, harder to test, couples rendering to file path.
- **Alternative — env var / CLI override:** out of scope; no use case yet.

### D3: Date formatting

- **Chosen:** Format `meta.date` as `"%B %-d, %Y"` on Linux / `"%B %#d, %Y"` on Windows (or use `date.day` manually) to produce `August 8, 2026` for the cover line, replacing the hard-coded literal at `render_cover():1137`. Keep a helper `format_human_date(d: date) -> str` to avoid platform `strftime` quirks.
- **Alternative — render raw ISO `2026-08-08`:** loses current human-friendly cover style.

### D4: Dependency declaration — coordinate with `cross-platform-python-uv`

- **Chosen:** If `pyproject.toml` already exists (from `cross-platform-python-uv`), add `pyyaml` to `dependencies` and run `uv lock`. If not yet merged, add a PEP 723 `// [tool.uv] dependencies = ["pyyaml"]` script header to `scripts/make_rules_pdf.py` so `uv run --script` still resolves it, and document fallback `pip install pyyaml`.
- **Alternative — vendor YAML parser:** unnecessary complexity.

### D5: What else to derive

- **Chosen:** Derive cover line and divider from `meta` (`Ruleset v{version}`, human date, `Status: {status.title()}`). Keep `example-of-play.md:10` companion note as-is unless a follow-up decides to derive it at build time; not required for correctness.
- **Alternative — also rewrite `example-of-play.md` at build time:** would make PDF the only consumer, but source doc drift is low-risk.

## Risks / Trade-offs

- **[Risk] `cross-platform-python-uv` merge conflict on `scripts/make_rules_pdf.py`** → Mitigation: keep version-extraction isolated to one helper + thin wiring; rebase after that change lands, no font/interpreter lines touched.
- **[Risk] Missing or malformed frontmatter breaks PDF build** → Mitigation: fail fast with actionable message (`--rules` path + missing key + example), don't fall back to stale literal.
- **[Risk] `PyYAML` adds a dependency** → Mitigation: pure-Python, tiny, widely available; `uv.lock` pins it reproducibly. Fallback `pip install pyyaml` documented.
- **[Risk] `yaml.safe_load` coerces `version: 0.10` to float `0.1`** → Mitigation: quote in source (`"0.0.11"` already quoted) and coerce `str(meta.version)`; validate semver after `str()`.
- **[Risk] Windows `strftime` `%-d` unsupported** → Mitigation: manual `f"{month} {d.day}, {d.year}"` instead of platform-dependent flag.
- **[Trade-off] Hard-coded docstring line 5 still mentions version** → Either update to generic wording or interpolate at build time; prefer updating to `official ruleset (version from docs/rules.md frontmatter)` to avoid future edits.

## Migration Plan

1. Implement helper + wiring, replace literals, add dep — no migration, pure build-time change.
2. No data migration; no rollback beyond reverting the commit.
3. After merge, verify: `uv run python scripts/make_rules_pdf.py` and `python scripts/make_rules_pdf.py` both produce PDF with cover/header/title showing `v{version}` from `docs/rules.md`; bumping `docs/rules.md` version and re-running PDF reflects new version without touching the script.

## Open Questions

- Should `docs/example-of-play.md:10` companion note (`Ruleset v0.0.11`) also be derived at PDF build time (inject into parsed blocks) or left as source-doc convention? Safe to defer — does not affect PDF correctness if left as-is.
- Should `status` be surfaced on cover only when `draft`, or always? Current cover shows `Status: Draft` — propose always showing title-cased status from frontmatter.
