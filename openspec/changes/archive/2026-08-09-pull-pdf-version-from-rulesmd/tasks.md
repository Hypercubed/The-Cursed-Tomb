## 1. Dependencies (Option B: PyYAML)

- [x] 1.1 Add `pyyaml` to Python deps — if `pyproject.toml` exists (from `cross-platform-python-uv`) add to `dependencies` and run `uv lock`; otherwise add PEP 723 `// [tool.uv] dependencies = ["pyyaml"]` header to `scripts/make_rules_pdf.py` and document `pip install pyyaml` fallback
- [x] 1.2 Verify `uv run python scripts/make_rules_pdf.py` resolves `yaml` and `python scripts/make_rules_pdf.py` with `pip install pyyaml` also works

## 2. Core frontmatter extraction (single source of truth)

- [x] 2.1 Add `RulesMeta` dataclass (`version: str`, `date: date`, `status: str`, `title: str`) and `format_human_date(d: date) -> str` helper (manual `f"{month} {d.day}, {d.year}"` to avoid Windows `%-d` bug)
- [x] 2.2 Implement `get_rules_meta(rules_path: Path) -> RulesMeta` — extract `^---\n.*?\n---\n` block, `yaml.safe_load` it, coerce `version` via `str()`, normalize `date` from `str | date` to `date`, default `status="draft"`
- [x] 2.3 Validate `version` is required and semver-like (`re.match(r"^\d+\.\d+\.\d+$", version)`), fail fast with `SystemExit` naming `rules_path` and missing key when absent/invalid; validate `date` required
- [x] 2.4 Add quick smoke assertion: `get_rules_meta(Path("docs/rules.md")).version == "0.0.11"` and `date == date(2026, 8, 8)` (ad-hoc script or unit test)

## 3. Wire `RulesMeta` through PDF pipeline (remove hard-codes)

- [x] 3.1 Call `get_rules_meta(Path(args.rules))` once in `main()` and thread `meta` into `build_document()`, `render_cover()`, `configure()`, and `RulebookPDF` (e.g., `pdf.rules_meta = meta`)
- [x] 3.2 Update `RulebookPDF.header()` running header `THE CURSED TOMB · RULESET v{meta.version}` (replaces literal `v0.0.11` at L520)
- [x] 3.3 Update `render_cover()` subtitle to `f"Ruleset v{meta.version}  ·  {format_human_date(meta.date)}  ·  Status: {meta.status.title()}"` (replaces L1137 literal)
- [x] 3.4 Update `build_document()` Part II divider subtitle to `f"Ruleset v{meta.version}"` (replaces L1253 literal)
- [x] 3.5 Update `configure()` PDF metadata `set_title(f"The Cursed Tomb — Complete Rulebook (v{meta.version})")` (replaces L1320 literal)
- [x] 3.6 Generalize module docstring line 5 from `(official ruleset v0.0.11)` to `(official ruleset — version from docs/rules.md frontmatter)` and update any remaining hard-coded comments
- [x] 3.7 Ensure custom `--rules` path is authoritative: when `args.rules` points elsewhere, that file's frontmatter drives all rendered strings (no fallback to default path)

## 4. Verification & coordination

- [x] 4.1 Rebuild PDF: `uv run python scripts/make_rules_pdf.py --output /tmp/cursed-tomb-rulebook.pdf` — visually check cover, header on p3+, Part II divider, and PDF Title metadata all show `v0.0.11`; then bump `docs/rules.md` to `0.0.12` / different date, rebuild, and confirm all locations update without touching the script (revert after)
- [x] 4.2 Negative cases: temp file missing frontmatter / missing `version` / `version: bad` — confirm script exits with clear error naming the file and key
- [x] 4.3 Confirm `cross-platform-python-uv` compatibility: no font/interpreter lines touched, helper is isolated; note rebase order if that change lands first
- [x] 4.4 Run `openspec validate pull-pdf-version-from-rulesmd --strict --no-interactive` and fix any reported issues
