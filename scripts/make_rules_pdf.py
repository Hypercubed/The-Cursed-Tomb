#!/usr/bin/env python3
"""
Generate a combined, print-ready PDF rulebook for The Cursed Tomb.

Combines `docs/standard-pyramid-rules.md`, `docs/rules.md` (official ruleset — version from docs/rules.md frontmatter),
and `docs/example-of-play.md` into a single styled PDF rendered with fpdf2:

  * Cover page with a drawn playing-card motif
  * Copyright & Licenses page (inside front cover) with CC BY-SA 4.0 (Parts II & III) and CC0 1.0 (Part I) — no code license
  * Table of contents with page numbers (two-pass render)
  * Part I — Standard Pyramid Solitaire / Part II — Official Ruleset / Part III — Example of Play
  * Running headers, page footers, styled code blocks and tables

Licensing for the generated PDF
-------------------------------
This PDF is an offline rulebook, not the application.
Parts II & III (docs/rules.md, docs/example-of-play.md) are
``CC-BY-SA-4.0`` — Copyright (c) 2026 Jayson Harshbarger.
Part I (docs/standard-pyramid-rules.md — classic Pyramid Solitaire)
is ``CC0-1.0`` / public domain.  Source-code licensing (MIT) is not
described inside this PDF; see the repository root ``LICENSE`` and
``docs/LICENSE`` for the full split.
SPDX-License-Identifier for this script: MIT.

Fonts used (all system-installed except Noto Sans Symbols):
  * FreeSans family (regular/bold/oblique/bold-oblique)  — body text
  * DejaVu Sans Mono (regular/bold)                       — code
  * Noto Sans Symbols                                     — fallback for ⏍
"""

# /// script
# dependencies = ["fpdf2>=2.7", "Pillow>=10", "pyyaml>=6"]
# requires-python = ">=3.10"
# ///

# SPDX-License-Identifier: MIT
# Copyright (c) 2026 Jayson Harshbarger

from __future__ import annotations

import argparse
import os
import re
import sys
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional, Tuple

import yaml

from fpdf import FPDF, XPos, YPos
from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

FONT_DIR = Path(__file__).parent / "fonts"
NOTO_URL = (
    "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/"
    "NotoSansSymbols/NotoSansSymbols-Regular.ttf"
)

WIN_FONT_DIR = Path("C:/Windows/Fonts")

# Candidate lists: Linux path first, then Windows fallback (DejaVu/Arial).
# FreeSans is not shipped on Windows — DejaVu Sans is used as the metric-compatible fallback.
SYSTEM_FONTS = {
    "FreeSans": "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    "FreeSans-B": "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    "FreeSans-I": "/usr/share/fonts/truetype/freefont/FreeSansOblique.ttf",
    "FreeSans-BI": "/usr/share/fonts/truetype/freefont/FreeSansBoldOblique.ttf",
    "Mono": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "Mono-B": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
}

def _resolve_font(*candidates: str) -> str | None:
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return None

# Palette ---------------------------------------------------------------
INK = (38, 36, 31)            # body text
CRIMSON = (142, 31, 47)       # primary accent
DARK = (34, 27, 18)           # headings / part band
BAND_BG = (36, 29, 22)        # part divider band fill
BAND_TEXT = (244, 237, 224)   # part divider band text
BAND_SUB = (201, 191, 169)    # part divider sub text
CODE_BG = (245, 241, 232)     # code block background
CODE_BORDER = (221, 211, 191)
QUOTE_BG = (249, 245, 236)
GRAY = (107, 99, 85)          # header / meta text
LEADER = (185, 174, 154)      # TOC leader dashes
GRID = (208, 199, 182)        # table gridlines
ROW_ALT = (242, 239, 232)     # table zebra row

PAGE_W, PAGE_H = 215.9, 279.4  # US Letter, mm
ML, MR, MT, MB = 17, 17, 24, 18
CONTENT_W = PAGE_W - ML - MR

BODY = 10.0
LINE_H = 5.5

# ---------------------------------------------------------------------------
# Card-corner mark chips (Pillow)
# ---------------------------------------------------------------------------
#
# The rules refer to card-corner marks with bracket notation (`[ |7 ]`,
# `[ |7̸| 8 ]`, `[ — ]`, …).  Those strings are hard to read, so wherever such
# a code span appears it is replaced by a small illustration of the actual
# mark as it would be drawn on the card's corner index.

DEJAVU_SANS = _resolve_font(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    str(WIN_FONT_DIR / "DejaVuSans.ttf"),
) or "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJAVU_SANS_BOLD = _resolve_font(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    str(WIN_FONT_DIR / "DejaVuSans-Bold.ttf"),
) or "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

CHIP_DPI = 16          # render resolution: px per mm
CHIP_H_MM = 4.8        # chip height in mm (fits a 5.5 mm body line)
CHIP_H = round(CHIP_H_MM * CHIP_DPI)

CHIP_WHITE = (255, 255, 255)
CHIP_BORDER = (168, 158, 140)
CHIP_INK = (46, 43, 36)
CHIP_RED = (176, 32, 44)

_chip_fonts: dict = {}


def _chip_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    key = (size, bold)
    if key not in _chip_fonts:
        _chip_fonts[key] = ImageFont.truetype(
            DEJAVU_SANS_BOLD if bold else DEJAVU_SANS, size)
    return _chip_fonts[key]


def _chip_text_w(s: str, font) -> int:
    tmp = Image.new("RGB", (4, 4))
    b = ImageDraw.Draw(tmp).textbbox((0, 0), s, font=font)
    return b[2] - b[0]


def make_chip(kind: str, rank: Optional[str] = None,
              value: Optional[str] = None) -> Image.Image:
    """Render a small card-corner index chip showing one mark type.

    kinds: stage1 (`|7`), stage2 (`|7|`), stage3 scar (`|7̸| 8`),
    stage4 curse (`|7X| 8`), curse (`|X|`), scar (`N`), entombed (`X`),
    anchor1 (`—`), anchor2 (`+`).
    """
    pad, bar_w, gap = 10, 4, 6
    if kind == "curse" and not rank:
        rank = "7"  # |X| = X over the rank digit; rules use 7 as the sample rank
    f_rank = _chip_font(46 if (rank and len(rank) == 1) else 38)
    f_val = _chip_font(34)
    rank_w = _chip_text_w(rank or "", f_rank)
    val_w = _chip_text_w(value or "", f_val)

    if kind == "entombed":
        w = 64
    elif kind in ("anchor1", "anchor2"):
        w = 58
    elif kind == "scar":
        w = int(rank_w + 2 * pad)
    elif kind == "stage1":
        w = int(bar_w + gap + rank_w + 2 * pad)
    elif kind in ("stage2", "curse"):
        w = int(bar_w + gap + rank_w + gap + bar_w + 2 * pad)
    else:  # stage3, stage4
        w = int(bar_w + gap + rank_w + gap + bar_w + gap + val_w + 2 * pad)

    img = Image.new("RGB", (w, CHIP_H), CHIP_WHITE)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([1, 1, w - 2, CHIP_H - 2], radius=9,
                        fill=CHIP_WHITE, outline=CHIP_BORDER, width=2)
    y_mid = CHIP_H / 2

    if kind == "entombed":
        m = 14
        d.line([m, m, w - m, CHIP_H - m], fill=CHIP_INK, width=7)
        d.line([w - m, m, m, CHIP_H - m], fill=CHIP_INK, width=7)
        return img
    if kind == "anchor1":
        d.line([12, y_mid, w - 12, y_mid], fill=CHIP_INK, width=6)
        return img
    if kind == "anchor2":
        d.line([12, y_mid, w - 12, y_mid], fill=CHIP_INK, width=6)
        d.line([w / 2, 12, w / 2, CHIP_H - 12], fill=CHIP_INK, width=6)
        return img

    x = float(pad)
    if kind in ("stage1", "stage2", "stage3", "stage4", "curse"):
        d.rectangle([x, y_mid - CHIP_H * 0.32, x + bar_w,
                     y_mid + CHIP_H * 0.32], fill=CHIP_RED)
        x += bar_w + gap

    rb = d.textbbox((x, 0), rank or "", font=f_rank)
    rh = rb[3] - rb[1]
    rank_y = y_mid - rh / 2
    d.text((x, rank_y), rank or "", font=f_rank, fill=CHIP_INK)
    if kind in ("stage3", "scar"):
        d.line([x, rank_y + 4, x + rank_w, rank_y + rh - 4],
               fill=CHIP_RED, width=5)
    elif kind in ("stage4", "curse"):
        d.line([x, rank_y + 4, x + rank_w, rank_y + rh - 4],
               fill=CHIP_RED, width=5)
        d.line([x + rank_w, rank_y + 4, x, rank_y + rh - 4],
               fill=CHIP_RED, width=5)
    x += rank_w + gap

    if kind in ("stage2", "stage3", "stage4", "curse"):
        d.rectangle([x, y_mid - CHIP_H * 0.32, x + bar_w,
                     y_mid + CHIP_H * 0.32], fill=CHIP_RED)
        x += bar_w + gap

    if kind in ("stage3", "stage4") and value:
        vb = d.textbbox((x, 0), value, font=f_val)
        d.text((x, y_mid - (vb[3] - vb[1]) / 2), value, font=f_val,
               fill=CHIP_RED)
    return img


_chip_cache: dict = {}


def get_chip(kind: str, rank: Optional[str] = None,
             value: Optional[str] = None) -> Image.Image:
    key = (kind, rank, value)
    if key not in _chip_cache:
        _chip_cache[key] = make_chip(kind, rank, value)
    return _chip_cache[key]


def mark_chip_spec(span: str) -> Optional[Tuple[str, Optional[str], Optional[str]]]:
    """Map a code span to a chip (kind, rank, value) or None if not a mark.

    Only *bracketed* notations (`[ |7 ]`, `[ — ]`, …) and *pipe-framed*
    marks (`|7|`, `|7̸| 8`, `|X|`, …) become chips.  Bare single glyphs
    used in prose (`X`, `N`, `—`, `+`) are left as text so phrases like
    "forming an `X` over the rank" are not replaced by a card-face image.
    """
    s = span.strip()
    bracketed = s.startswith("[") and s.endswith("]")
    if bracketed:
        s = s[1:-1].strip()
    if not bracketed and "|" not in s:
        return None
    if s == "N":
        return ("scar", "N", None)
    if s == "X":
        return ("entombed", None, None)
    if s == "—":
        return ("anchor1", None, None)
    if s == "+":
        return ("anchor2", None, None)
    if s == "|X|":
        return ("curse", None, None)
    m = re.match(r"^\|([0-9N]+)([\u0338X])?\|(?:\s*([0-9V]+))?$", s)
    if m:
        rank, mark, val = m.group(1), m.group(2), m.group(3)
        if mark == "\u0338":
            return ("stage3", rank, val)
        if mark == "X":
            return ("stage4", rank, val)
        return ("stage2", rank, None)
    m = re.match(r"^\|([0-9N]+)$", s)
    if m:
        return ("stage1", m.group(1), None)
    return None


# ---------------------------------------------------------------------------
# Inline markdown runs
# ---------------------------------------------------------------------------

Run = Tuple[str, object]  # (kind, payload): ("text"|"code", str) or ("bold"|"italic", list)


def parse_inline(s: str) -> List[Run]:
    """Parse **bold**, *italic* and `code` into a small nested run tree."""
    s = re.sub(r"[\U0001F000-\U0001FAFF\uFE0F\u200D]", "", s)  # strip emoji
    runs: List[Run] = []
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == "`":
            j = s.find("`", i + 1)
            if j == -1:
                runs.append(("text", s[i:]))
                i = n
            else:
                runs.append(("code", s[i + 1:j]))
                i = j + 1
        elif s[i:i + 2] == "**":
            j = s.find("**", i + 2)
            if j == -1:
                runs.append(("text", s[i:]))
                i = n
            else:
                runs.append(("bold", parse_inline(s[i + 2:j])))
                i = j + 2
        elif c == "*":
            j = s.find("*", i + 1)
            if j == -1:
                runs.append(("text", s[i:]))
                i = n
            else:
                runs.append(("italic", parse_inline(s[i + 1:j])))
                i = j + 1
        else:
            j = i
            while j < n and s[j] not in "`*":
                j += 1
            runs.append(("text", s[i:j]))
            i = j
    return runs


def has_markup(s: str) -> bool:
    return "*" in s or "`" in s


def style_for(kind: str, bold: bool, italic: bool, code: bool) -> str:
    if code:
        return "Mono-B" if bold else "Mono"
    if bold and italic:
        return "BI"
    if bold:
        return "B"
    if italic:
        return "I"
    return ""


# ---------------------------------------------------------------------------
# Block-level markdown parsing
# ---------------------------------------------------------------------------

@dataclass
class ListItem:
    level: int
    ordered: bool
    number: int
    text: str


@dataclass
class Block:
    kind: str  # para | code | heading | hr | quote | table | list
    level: int = 0
    text: str = ""
    items: List[ListItem] = field(default_factory=list)
    header: List[str] = field(default_factory=list)
    rows: List[List[str]] = field(default_factory=list)


LIST_MARK = re.compile(r"^(\s*)([*\-+])[ \t]+(.*)$")
NUM_MARK = re.compile(r"^(\s*)(\d+)[.)][ \t]+(.*)$")
TABLE_SEP = re.compile(r"^\s*\|?[\s:|-]+\|?\s*$")


def looks_like_table(lines: List[str], i: int) -> bool:
    if not lines[i].lstrip().startswith("|"):
        return False
    for j in range(i + 1, min(i + 3, len(lines))):
        if lines[j].strip() == "":
            return False
        if TABLE_SEP.match(lines[j]):
            return True
        if not lines[j].lstrip().startswith("|"):
            return False
    return False


def split_table_row(line: str) -> List[str]:
    """Split a markdown table row on pipes, ignoring pipes inside backticks."""
    cells, buf, in_code = [], [], False
    for ch in line:
        if ch == "`":
            in_code = not in_code
            buf.append(ch)
        elif ch == "|" and not in_code:
            cells.append("".join(buf).strip())
            buf = []
        else:
            buf.append(ch)
    cells.append("".join(buf).strip())
    if cells and cells[0] == "":
        cells = cells[1:]
    if cells and cells[-1] == "":
        cells = cells[:-1]
    return cells


def parse_list_lines(lines: List[str]) -> List[ListItem]:
    items: List[ListItem] = []
    for line in lines:
        m = LIST_MARK.match(line)
        if m:
            level = len(m.group(1)) // 4
            items.append(ListItem(level, False, 0, m.group(3).strip()))
            continue
        m = NUM_MARK.match(line)
        if m:
            level = len(m.group(1)) // 4
            items.append(ListItem(level, True, int(m.group(2)), m.group(3).strip()))
            continue
        if items:
            items[-1].text += " " + line.strip()
    return items


def parse_blocks(md_text: str) -> List[Block]:
    lines = md_text.split("\n")
    blocks: List[Block] = []
    buf: List[str] = []
    i, n = 0, len(lines)

    def flush():
        nonlocal buf
        if not buf:
            return
        first = buf[0].lstrip()
        if LIST_MARK.match(first) or NUM_MARK.match(first):
            blocks.append(Block("list", items=parse_list_lines(buf)))
        else:
            blocks.append(Block("para", text=" ".join(x.strip() for x in buf).strip()))
        buf = []

    while i < n:
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            flush()
            i += 1
            continue
        if stripped.startswith("```"):
            flush()
            code, j = [], i + 1
            while j < n and not lines[j].strip().startswith("```"):
                code.append(lines[j])
                j += 1
            blocks.append(Block("code", text="\n".join(code)))
            i = j + 1
            continue
        if re.match(r"^#{1,6}\s", line):
            flush()
            lvl = len(line) - len(line.lstrip("#"))
            blocks.append(Block("heading", level=lvl, text=line.lstrip("#").strip()))
            i += 1
            continue
        if re.match(r"^\s*-{3,}\s*$", line):
            flush()
            blocks.append(Block("hr"))
            i += 1
            continue
        if stripped.startswith(">"):
            flush()
            quote = []
            while i < n and lines[i].lstrip().startswith(">"):
                quote.append(lines[i].lstrip()[1:].strip())
                i += 1
            blocks.append(Block("quote", text=" ".join(x for x in quote if x)))
            continue
        if looks_like_table(lines, i):
            flush()
            tlines = []
            while i < n and lines[i].lstrip().startswith("|"):
                tlines.append(lines[i])
                i += 1
            header = split_table_row(tlines[0])
            rows = [split_table_row(t) for t in tlines[2:]]
            blocks.append(Block("table", header=header, rows=rows))
            continue
        buf.append(line)
        i += 1
    flush()
    return blocks


_FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Extract YAML frontmatter dict and remaining body.

    Returns (frontmatter_dict, body_without_frontmatter). If no frontmatter
    is present, returns ({}, original_text).
    Raises SystemExit with a clear message on YAML parse errors.
    """
    m = _FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    raw = m.group(1)
    try:
        data = yaml.safe_load(raw) or {}
    except yaml.YAMLError as exc:
        raise SystemExit(f"Invalid YAML frontmatter: {exc}") from exc
    if not isinstance(data, dict):
        raise SystemExit(f"Invalid YAML frontmatter: expected mapping, got {type(data).__name__}")
    return data, text[m.end():]


def strip_frontmatter(text: str) -> str:
    _, body = parse_frontmatter(text)
    return body


def strip_doc(text: str) -> str:
    """Strip YAML frontmatter and leading SPDX HTML comments from doc sources.

    The CC BY-SA SPDX markers are HTML comments for web/GitHub but should
    not render as visible paragraphs in the PDF.
    """
    text = strip_frontmatter(text)
    # Remove any <!-- ... --> comment blocks (including SPDX headers)
    text = re.sub(r"<!--.*?-->\s*\n*", "", text, flags=re.DOTALL)
    return text.lstrip()


# ---------------------------------------------------------------------------
# Ruleset version — single source of truth: docs/rules.md frontmatter
# ---------------------------------------------------------------------------

import datetime as _dt


@dataclass(frozen=True)
class RulesMeta:
    """Parsed from the --rules markdown frontmatter (docs/rules.md by default)."""

    version: str  # e.g. "0.0.11"
    date: _dt.date  # e.g. date(2026, 8, 8)
    status: str  # e.g. "draft"
    title: str = ""  # optional, from frontmatter "title"


_MONTHS = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def format_human_date(d: _dt.date) -> str:
    """Format a date as 'August 8, 2026' (no platform-dependent strftime)."""
    return f"{_MONTHS[d.month]} {d.day}, {d.year}"


def get_rules_meta(rules_path: Path) -> RulesMeta:
    """Read and validate frontmatter from the ruleset markdown file.

    `rules_path` is the file supplied via --rules (defaults to docs/rules.md).
    Raises SystemExit with a clear message if the file is missing, has no
    frontmatter, or lacks a valid version/date.
    """
    if not rules_path.exists():
        raise SystemExit(f"Rules file not found: {rules_path}")
    text = rules_path.read_text(encoding="utf-8")
    fm, _ = parse_frontmatter(text)
    if not fm:
        raise SystemExit(
            f"Missing YAML frontmatter in {rules_path} — expected a leading '---' block "
            f"with at least 'version' and 'date'.\n"
            f"Example:\n---\nversion: \"0.0.11\"\ndate: \"2026-08-08\"\nstatus: \"draft\"\n---"
        )
    raw_version = fm.get("version")
    if raw_version is None or str(raw_version).strip() == "":
        raise SystemExit(f"Missing required 'version' in YAML frontmatter of {rules_path}")
    version = str(raw_version).strip().strip('"').strip("'")
    if not re.match(r"^\d+\.\d+\.\d+$", version):
        raise SystemExit(
            f"Invalid 'version' in {rules_path} frontmatter: {version!r} — "
            f"expected semver like '0.0.11'"
        )
    raw_date = fm.get("date")
    if raw_date is None or str(raw_date).strip() == "":
        raise SystemExit(f"Missing required 'date' in YAML frontmatter of {rules_path}")
    if isinstance(raw_date, _dt.datetime):
        date_val = raw_date.date()
    elif isinstance(raw_date, _dt.date):
        date_val = raw_date
    else:
        ds = str(raw_date).strip().strip('"').strip("'")
        try:
            date_val = _dt.date.fromisoformat(ds)
        except ValueError:
            raise SystemExit(
                f"Invalid 'date' in {rules_path} frontmatter: {raw_date!r} — "
                f"expected ISO date like '2026-08-08'"
            ) from None
    status = str(fm.get("status", "draft")).strip().strip('"').strip("'") or "draft"
    title = str(fm.get("title", "")).strip().strip('"').strip("'")
    return RulesMeta(version=version, date=date_val, status=status, title=title)


# ---------------------------------------------------------------------------
# PDF document
# ---------------------------------------------------------------------------

class RulebookPDF(FPDF):
    def __init__(self, *args, rules_meta: Optional["RulesMeta"] = None, **kwargs):
        super().__init__(format="LETTER", unit="mm", *args, **kwargs)
        self.section_title = ""
        self._show_header = False
        self._show_footer = False
        self.toc_pages: List[Tuple[str, int]] = []  # (heading, pass-A page)
        self.rules_meta: Optional["RulesMeta"] = rules_meta

    # -- callbacks --------------------------------------------------------
    def header(self):
        if not self._show_header or self.page_no() == 1:
            return
        self.set_font("FreeSans", "", 7.5)
        self.set_text_color(*GRAY)
        left = self.section_title or "The Cursed Tomb — Official Ruleset"
        self.set_xy(ML, 11)
        self.cell(CONTENT_W / 2, 4, left[:64], align="L")
        self.set_xy(ML + CONTENT_W / 2, 11)
        ver = self.rules_meta.version if self.rules_meta else "?"
        self.cell(CONTENT_W / 2, 4, f"THE CURSED TOMB \u00b7 RULESET v{ver}", align="R")
        self.set_draw_color(*LEADER)
        self.set_line_width(0.25)
        self.line(ML, 17.5, PAGE_W - MR, 17.5)

    def footer(self):
        if not self._show_footer or self.page_no() == 1:
            return
        self.set_font("FreeSans", "", 8)
        self.set_text_color(*GRAY)
        self.set_y(-14)
        self.cell(0, 5, f"— {self.page_no()} —", align="C")

    # -- helpers ----------------------------------------------------------
    def new_page(self):
        """add_page() then reset the cursor to the top margin.

        fpdf2 runs header() during add_page(), which leaves the y cursor at
        the header's drawing position (~11 mm); without this reset every page
        created mid-flow would start its content on top of the running header.
        """
        self.add_page()
        self.set_y(self.t_margin)

    def ensure_room(self, height_mm: float):
        if self.get_y() + height_mm > PAGE_H - MB:
            self.new_page()

    def set_font_style(self, style: str, size: float = BODY):
        if style in ("Mono", "Mono-B"):
            self.set_font("Mono", "B" if style == "Mono-B" else "", size)
        else:
            self.set_font("FreeSans", style, size)


# ---------------------------------------------------------------------------
# Rich-text renderer
# ---------------------------------------------------------------------------
#
# fpdf2's `write()` leaves the drawing cursor at the *top* of the last text
# line (it is a flowing API; callers must call `ln()`), which caused every
# rich paragraph to start on the same line as the previous one. We therefore
# lay rich text out ourselves: parse runs -> measure words -> wrap into lines
# -> draw each line with exact cursor control (and optional justification).

def flatten_runs(runs: List[Run]) -> List[Tuple[str, str]]:
    """Flatten the nested run tree into (style, text) leaves."""
    leaves: List[Tuple[str, object]] = []

    def walk(rs: List[Run], bold: bool, italic: bool):
        for kind, payload in rs:
            if kind == "text":
                leaves.append((style_for("text", bold, italic, False), payload))
            elif kind == "code":
                spec = mark_chip_spec(payload)
                if spec:
                    ckind, crank, cval = spec
                    leaves.append(("img", get_chip(ckind, crank, cval)))
                else:
                    leaves.append((style_for("code", bold, italic, True), payload))
            elif kind == "bold":
                walk(payload, True, italic)
            elif kind == "italic":
                walk(payload, bold, True)

    walk(runs, False, False)
    return leaves


def tokenize_words(leaves: List[Tuple[str, object]]) -> List[List[Tuple[str, object]]]:
    """Split styled leaves into words; image leaves become their own word."""
    words: List[List[Tuple[str, object]]] = []
    cur: List[Tuple[str, object]] = []
    for style, text in leaves:
        if style == "img":
            if cur:
                words.append(cur)
                cur = []
            words.append([(style, text)])
            continue
        parts = text.split(" ")
        for i, part in enumerate(parts):
            if i > 0 and cur:
                words.append(cur)
                cur = []
            if part:
                cur.append((style, part))
    if cur:
        words.append(cur)
    return words


def space_width(pdf: RulebookPDF, size: float) -> float:
    pdf.set_font_style("", size)
    return pdf.get_string_width(" ")


def word_width(pdf: RulebookPDF, word: List[Tuple[str, object]], size: float) -> float:
    total = 0.0
    for style, text in word:
        if style == "img":
            total += text.width / CHIP_DPI
        else:
            pdf.set_font_style(style, size)
            total += pdf.get_string_width(text)
    return total


def compute_lines(pdf: RulebookPDF, runs: List[Run], size: float,
                  width: float) -> List[List[Tuple[List[Tuple[str, str]], float]]]:
    """Wrap runs into lines; each line is a list of (word, word_width)."""
    words = tokenize_words(flatten_runs(runs))
    sp_w = space_width(pdf, size)
    lines: List[List[Tuple[List[Tuple[str, str]], float]]] = []
    cur: List[Tuple[List[Tuple[str, str]], float]] = []
    cur_w = 0.0
    for word in words:
        ww = word_width(pdf, word, size) + sp_w
        if cur and cur_w + ww > width:
            lines.append(cur)
            cur, cur_w = [], 0.0
        cur.append((word, ww))
        cur_w += ww
    if cur:
        lines.append(cur)
    if not lines:
        lines = [[]]
    return lines


def draw_lines(pdf: RulebookPDF, lines, x0: float, y: float, width: float,
               line_h: float, size: float, justify: bool = True) -> float:
    """Draw pre-computed lines; returns the y below the last line."""
    sp_w = space_width(pdf, size)
    for li, line in enumerate(lines):
        if y + line_h > PAGE_H - MB:
            pdf.new_page()
            y = pdf.get_y()
        line_w = sum(ww for _, ww in line)
        n_spaces = len(line) - 1
        justify_this = justify and li < len(lines) - 1 and n_spaces > 0 and line_w < width
        extra = (width - line_w) / n_spaces if justify_this else 0.0
        x = x0
        for wi, (word, _ww) in enumerate(line):
            if wi > 0:
                x += sp_w + extra
            for style, text in word:
                if style == "img":
                    w_mm = text.width / CHIP_DPI
                    h_mm = text.height / CHIP_DPI
                    pdf.image(text, x, y + (line_h - h_mm) / 2, w_mm, h_mm)
                    x += w_mm
                    continue
                pdf.set_font_style(style, size)
                tw = pdf.get_string_width(text)
                if style in ("Mono", "Mono-B"):
                    chip_h = size * 0.352778 + 1.1
                    pdf.set_fill_color(*CODE_BG)
                    pdf.rect(x - 0.4, y + (line_h - chip_h) / 2, tw + 0.8, chip_h, "F")
                pdf.c_margin = 0
                pdf.set_xy(x, y)
                pdf.cell(tw, line_h, text, align="L", new_x=XPos.WCONT, new_y=YPos.TOP)
                x += tw
        y += line_h
    pdf.c_margin = 1.0
    pdf.set_text_color(*INK)
    return y


def render_paragraph(pdf: RulebookPDF, text: str, size: float = BODY,
                     line_h: float = LINE_H, indent: float = 0.0,
                     justify: Optional[bool] = None) -> None:
    text = text.strip()
    if not text:
        return
    if justify is None:
        justify = not has_markup(text)
    runs = parse_inline(text)
    x0 = ML + indent
    width = CONTENT_W - indent
    lines = compute_lines(pdf, runs, size, width)
    y = pdf.get_y()
    if y + line_h > PAGE_H - MB:
        pdf.new_page()
        y = pdf.get_y()
    y = draw_lines(pdf, lines, x0, y, width, line_h, size, justify=justify)
    pdf.set_xy(ML, y)


def render_code_block(pdf: RulebookPDF, text: str, size: float = 8.0) -> None:
    lines = text.split("\n")
    pdf.set_font_style("Mono", size)
    line_h = size * 0.62
    maxw = 0.0
    for ln in lines:
        maxw = max(maxw, pdf.get_string_width(ln))
    box_w = min(maxw + 8, CONTENT_W)
    box_h = len(lines) * line_h + 4
    pdf.ensure_room(box_h)
    y0 = pdf.get_y()
    x0 = ML
    pdf.set_fill_color(*CODE_BG)
    pdf.set_draw_color(*CODE_BORDER)
    pdf.rect(x0, y0, box_w, box_h, "FD")
    pdf.set_font_style("Mono", size)
    y = y0 + 2
    for ln in lines:
        if pdf.get_string_width(ln) > box_w - 8:
            pdf.set_left_margin(x0 + 4)
            pdf.set_xy(x0 + 4, y)
            pdf.multi_cell(box_w - 8, line_h, ln, align="L",
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            y = pdf.get_y()
        else:
            pdf.set_xy(x0 + 4, y)
            pdf.cell(box_w - 8, line_h, ln, align="L")
            y += line_h
    pdf.set_left_margin(ML)
    pdf.set_xy(ML, y + 2)
    pdf.set_text_color(*INK)


def render_list(pdf: RulebookPDF, items: List[ListItem]) -> None:
    indent_step = 7.0
    y = pdf.get_y()
    for it in items:
        x_marker = ML + it.level * indent_step
        text_x = x_marker + 6
        width = CONTENT_W - (text_x - ML)
        if y + LINE_H > PAGE_H - MB:
            pdf.new_page()
            y = pdf.get_y()
        pdf.set_xy(x_marker, y)
        marker = f"{it.number}." if it.ordered else "•"
        pdf.set_font_style("", BODY)
        pdf.set_text_color(*(CRIMSON if it.ordered else INK))
        pdf.cell(6, LINE_H, marker, align="L")
        pdf.set_text_color(*INK)
        runs = parse_inline(it.text)
        lines = compute_lines(pdf, runs, BODY, width)
        y = draw_lines(pdf, lines, text_x, y, width, LINE_H, BODY, justify=False)
        y += 0.7
    pdf.set_xy(ML, y + 0.5)


def render_quote(pdf: RulebookPDF, text: str) -> None:
    indent = 5.0
    pad = 4.0
    x0 = ML + indent
    text_w = CONTENT_W - indent - 3 - pad
    runs = parse_inline(text)
    lines = compute_lines(pdf, runs, BODY, text_w)
    height = max(len(lines), 1) * LINE_H + 4
    y0 = pdf.get_y()
    if y0 + height > PAGE_H - MB:
        pdf.new_page()
        y0 = pdf.get_y()
    pdf.set_fill_color(*QUOTE_BG)
    pdf.rect(x0, y0, text_w + pad + 3, height, "F")
    pdf.set_fill_color(*CRIMSON)
    pdf.rect(x0, y0, 1.2, height, "F")
    pdf.set_text_color(*DARK)
    draw_lines(pdf, lines, x0 + pad, y0 + 2, text_w, LINE_H, BODY, justify=False)
    pdf.set_text_color(*INK)
    pdf.set_xy(ML, y0 + height + 2)


def calc_lines(pdf: RulebookPDF, text: str, style: str, size: float, width: float) -> int:
    """Approximate wrapped line count for a plain-text table cell."""
    if not text:
        return 1
    pdf.set_font_style(style, size)
    lines, remaining = 1, width
    for word in text.split(" "):
        w = pdf.get_string_width(word) + pdf.get_string_width(" ")
        if w > remaining and word:
            lines += 1
            remaining = width - w
        else:
            remaining -= w
    return lines


def render_table(pdf: RulebookPDF, header: List[str], rows: List[List[str]]) -> None:
    n_cols = len(header)
    col_w = [30, 40, 14, CONTENT_W - 30 - 40 - 14]
    if n_cols != 4:
        col_w = [CONTENT_W / n_cols] * n_cols
    pad = 1.8
    sizes = [8.0, 8.5, 8.5, 8.5]
    styles = ["Mono", "", "", ""]

    def cell_height(text, ci):
        avail = col_w[ci] - 2 * pad
        return calc_lines(pdf, text, styles[ci], sizes[ci], avail) * (sizes[ci] * 0.62) + 2 * pad

    def row_height(cells):
        return max(cell_height(c, i) for i, c in enumerate(cells))

    pdf.ensure_room(row_height(header) + 6)
    x0 = ML

    def draw_row(cells, y, is_header=False, zebra=False):
        h = row_height(cells)
        if zebra:
            pdf.set_fill_color(*ROW_ALT)
            pdf.rect(x0, y, sum(col_w), h, "F")
        if is_header:
            pdf.set_fill_color(*BAND_BG)
            pdf.rect(x0, y, sum(col_w), h, "F")
        x = x0
        for ci, cell in enumerate(cells):
            cx = x + pad
            cy = y + pad
            pdf.set_xy(cx, cy)
            if is_header:
                pdf.set_font_style("B", 9)
                pdf.set_text_color(*BAND_TEXT)
            else:
                pdf.set_font_style(styles[ci], sizes[ci])
                pdf.set_text_color(*INK)
            pdf.set_left_margin(cx)
            pdf.multi_cell(col_w[ci] - 2 * pad, sizes[ci] * 0.62, cell.replace("`", ""),
                           align="L", wrapmode="WORD",
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            x += col_w[ci]
        pdf.set_left_margin(ML)
        pdf.set_text_color(*INK)
        pdf.set_draw_color(*GRID)
        pdf.set_line_width(0.2)
        pdf.rect(x0, y, sum(col_w), h, "D")
        return h

    y = pdf.get_y()
    y += draw_row(header, y, is_header=True)
    for idx, row in enumerate(rows):
        y += draw_row(row, y, zebra=(idx % 2 == 1))
    pdf.set_xy(ML, y + 3)
    pdf.set_text_color(*INK)


def render_heading(pdf: RulebookPDF, level: int, text: str, record_toc: bool) -> None:
    if level == 1:
        return  # handled by synthetic part dividers
    if level == 2:
        pdf.ensure_room(16)
        pdf.set_y(pdf.get_y() + 4)
        pdf.set_xy(ML, pdf.get_y())
        pdf.set_font_style("B", 13)
        pdf.set_text_color(*CRIMSON)
        pdf.multi_cell(CONTENT_W, 7, text, align="L",
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_draw_color(*CRIMSON)
        pdf.set_line_width(0.6)
        y_rule = pdf.get_y() + 1.2
        pdf.line(ML, y_rule, ML + 24, y_rule)
        pdf.set_xy(ML, y_rule + 2.5)
        pdf.section_title = text
        if record_toc:
            pdf.toc_pages.append((text, pdf.page_no()))
    elif level == 3:
        pdf.ensure_room(12)
        pdf.set_y(pdf.get_y() + 3)
        y = pdf.get_y()
        pdf.set_fill_color(*CRIMSON)
        pdf.rect(ML, y + 1.1, 1.7, 1.7, "F")
        pdf.set_xy(ML + 4, y)
        pdf.set_font_style("B", 11)
        pdf.set_text_color(*DARK)
        pdf.multi_cell(CONTENT_W - 4, 6, text, align="L",
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_xy(ML, pdf.get_y() + 1)
    else:
        pdf.ensure_room(11)
        pdf.set_y(pdf.get_y() + 2.5)
        pdf.set_xy(ML, pdf.get_y())
        pdf.set_font_style("BI", 10.5)
        pdf.set_text_color(*DARK)
        pdf.multi_cell(CONTENT_W, 6, text, align="L",
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_xy(ML, pdf.get_y() + 1)


def render_part_divider(pdf: RulebookPDF, title: str, subtitle: str,
                        new_page: bool) -> None:
    pdf.section_title = title  # set before add_page so the new page's header is correct
    if new_page:
        pdf.new_page()
    band_h = 20
    pdf.ensure_room(band_h + 8)
    y_band = pdf.get_y()
    pdf.set_fill_color(*BAND_BG)
    pdf.rect(ML, y_band, CONTENT_W, band_h, "F")
    pdf.set_draw_color(*CRIMSON)
    pdf.set_line_width(0.8)
    pdf.line(ML, y_band + band_h, ML + CONTENT_W, y_band + band_h)
    pdf.set_xy(ML + 6, y_band + 4.5)
    pdf.set_font_style("B", 14)
    pdf.set_text_color(*BAND_TEXT)
    pdf.cell(CONTENT_W - 12, 7, title, align="L")
    pdf.set_xy(ML + 6, y_band + 12)
    pdf.set_font_style("", 8.5)
    pdf.set_text_color(*BAND_SUB)
    pdf.cell(CONTENT_W - 12, 5, subtitle, align="L")
    pdf.set_xy(ML, y_band + band_h + 5)
    pdf.set_text_color(*INK)


def render_blocks(pdf: RulebookPDF, blocks: List[Block], record_toc: bool) -> None:
    for b in blocks:
        if b.kind == "para":
            render_paragraph(pdf, b.text)
        elif b.kind == "code":
            render_code_block(pdf, b.text)
        elif b.kind == "heading":
            render_heading(pdf, b.level, b.text, record_toc)
        elif b.kind == "hr":
            pdf.set_draw_color(*LEADER)
            pdf.set_line_width(0.3)
            pdf.line(ML, pdf.get_y() + 2, ML + CONTENT_W, pdf.get_y() + 2)
            pdf.set_y(pdf.get_y() + 5)
        elif b.kind == "quote":
            render_quote(pdf, b.text)
        elif b.kind == "table":
            render_table(pdf, b.header, b.rows)
        elif b.kind == "list":
            render_list(pdf, b.items)


# ---------------------------------------------------------------------------
# Cover + Licenses + TOC
# ---------------------------------------------------------------------------

def _license_box(pdf: RulebookPDF, title: str,
                 body_lines: list, box_fill) -> None:
    """Draw a bordered box with title + wrapped paragraphs.

    Measures content height first (without drawing), draws the background
    rect, then renders text on top — avoids fpdf paint-order issues.
    """
    box_pad = 3.5
    inner_w = CONTENT_W - 2 * box_pad
    # Estimate height by laying out into a throwaway measurement.
    # Simple: sum of line counts * line_h + padding.
    # Use pdf.get_string_width for wrapping via multi_cell line count.
    y0 = pdf.get_y()
    # Draw placeholder background — we know roughly, so draw after measuring.
    # Measure: create a temp pdf-less calc using calc_lines helper indirectly:
    # just draw background generously and fix border after. Easiest:
    # reserve y, draw rects later by buffering text positions.
    # Instead: pre-render to measure height by calling multi_cell on a clone.
    # Simpler practical approach: draw fill rect *before* text with a
    # conservative estimated height, then extend if needed.
    # We'll do a two-phase: first compute heights without drawing to screen
    # by using pdf's string-width calc.
    def para_h(text: str, size: float, lh: float) -> float:
        lh_mm = lh  # line_h passed by caller
        # Count wrapped lines
        w = inner_w
        pdf.set_font_style("", size)
        lines = 1
        remaining = w
        for word in text.split(" "):
            ww = pdf.get_string_width(word + " ")
            if ww > remaining and word:
                lines += 1
                remaining = w - ww
            else:
                remaining -= ww
            if word.count("\n"):
                # new paragraph inside text — rough: add lines
                lines += word.count("\n")
        return lines * lh_mm + 0.6

    # Build height estimate
    h = box_pad  # top pad
    h += 5.5  # title
    for txt, sz, lh in body_lines:
        # txt may contain \n => split
        for para in txt.split("\n"):
            if para.strip() == "":
                h += lh * 0.5
            else:
                h += para_h(para, sz, lh) + 1.0
    h += box_pad  # bottom pad
    # Ensure we fit on page; if not, start new page
    if y0 + h > PAGE_H - MB:
        pdf.new_page()
        y0 = pdf.get_y()
    # Now draw background + border BEFORE text
    pdf.set_fill_color(*box_fill)
    pdf.set_draw_color(*GRID)
    pdf.set_line_width(0.25)
    pdf.rect(ML, y0, CONTENT_W, h, "DF")
    # Render text on top
    y = y0 + box_pad
    pdf.set_font_style("B", 9.5)
    pdf.set_text_color(*DARK)
    pdf.set_xy(ML + box_pad, y)
    pdf.cell(inner_w, 5, title, align="L")
    y += 5.5
    for txt, sz, lh in body_lines:
        is_italic = (sz <= 8.0)
        pdf.set_font_style("I" if is_italic else "", sz)
        pdf.set_text_color(*GRAY if is_italic else INK)
        for para in txt.split("\n"):
            if para.strip() == "":
                y += lh * 0.5
                continue
            pdf.set_xy(ML + box_pad, y)
            # Draw this para; after multi_cell, y advances to next line
            pdf.multi_cell(inner_w, lh, para, align="L",
                           new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            y = pdf.get_y() + 0.3
        y += 0.2
    pdf.set_y(y0 + h + 3)


def render_license_page(pdf: RulebookPDF) -> None:
    """Inside-front-cover colophon with the dual-license split (p. 2)."""
    pdf._show_header = False
    pdf._show_footer = False
    pdf.add_page()
    pdf.set_y(MT + 2)

    # Title
    pdf.set_font_style("B", 13)
    pdf.set_text_color(*DARK)
    pdf.set_xy(ML, pdf.get_y())
    pdf.cell(CONTENT_W, 7, "Copyright & Licenses", align="L")
    pdf.set_draw_color(*CRIMSON)
    pdf.set_line_width(0.5)
    y_rule = pdf.get_y() + 8.5
    pdf.line(ML, y_rule, ML + 24, y_rule)
    pdf.set_y(y_rule + 5)

    # Copyright line
    pdf.set_font_style("", 9.5)
    pdf.set_text_color(*INK)
    pdf.set_xy(ML, pdf.get_y())
    pdf.multi_cell(CONTENT_W, 5.0,
        "\u00A9 2026 Jayson Harshbarger.  All rights retained except as licensed below.",
        align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_y(pdf.get_y() + 2)

    _license_box(pdf,
        "This Rulebook  \u2014  CC BY-SA 4.0  (Parts II & III)  ·  Part I: CC0",
        [
            ("Parts II & III of this PDF (Official Ruleset from docs/rules.md and "
             "Example of Play from docs/example-of-play.md) are licensed under "
             "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).",
             8.5, 4.4),
            ("Part I (Standard Pyramid Solitaire, from docs/standard-pyramid-rules.md) "
             "is public domain — no copyright claimed over the underlying game; "
             "explanatory text waived via CC0 1.0 "
             "(https://creativecommons.org/publicdomain/zero/1.0/). No attribution required for Part I.",
             7.5, 4.0),
            ("CC BY-SA deed:  https://creativecommons.org/licenses/by-sa/4.0/\n"
             "CC BY-SA legal code:  https://creativecommons.org/licenses/by-sa/4.0/legalcode\n"
             "CC0 deed:  https://creativecommons.org/publicdomain/zero/1.0/",
             8.0, 4.2),
            ("SPDX: CC-BY-SA-4.0 (Parts II & III)  ·  CC0-1.0 (Part I)  ·  Full texts in docs/LICENSE.",
             8.0, 4.2),
            ("You are free to share and adapt the CC BY-SA parts for any purpose, even "
             "commercially, provided you credit Jayson Harshbarger, link to the "
             "license, and distribute derivatives under the same license.",
             7.5, 4.0),
        ],
        QUOTE_BG)

    # Footer small print
    pdf.set_font_style("I", 7.0)
    pdf.set_text_color(*GRAY)
    pdf.set_xy(ML, pdf.get_y())
    pdf.multi_cell(CONTENT_W, 3.8,
        "Fonts: Cinzel via Google Fonts (OFL) is not covered by the above licenses. "
        "This page is page 2 (inside front cover); the cover itself is intentionally "
        "left free of license clutter for artwork. "
        "PDF metadata also carries the CC BY-SA 4.0 declaration.",
        align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)


def render_cover(pdf: RulebookPDF) -> None:
    pdf._show_header = False
    pdf._show_footer = False
    pdf.add_page()
    pdf.set_fill_color(251, 247, 239)
    pdf.rect(0, 0, PAGE_W, PAGE_H, "F")
    pdf.set_draw_color(*CRIMSON)
    pdf.set_line_width(0.7)
    pdf.line(ML, 26, PAGE_W - MR, 26)
    pdf.line(ML, PAGE_H - 26, PAGE_W - MR, PAGE_H - 26)

    pdf.set_text_color(*GRAY)
    pdf.set_font_style("", 9)
    pdf.set_xy(0, 40)
    pdf.cell(PAGE_W, 5, "A PERSISTENT · MUTATING · TACTICAL CARD GAME", align="C")

    pdf.set_text_color(*DARK)
    pdf.set_font_style("B", 32)
    pdf.set_y(52)
    pdf.cell(PAGE_W, 13, "THE CURSED TOMB", align="C")

    suits = "♠   ♥   ♦   ♣"
    pdf.set_font_style("B", 15)
    pdf.set_text_color(*CRIMSON)
    pdf.set_y(70)
    pdf.cell(PAGE_W, 7, suits, align="C")

    pdf.set_text_color(*DARK)
    pdf.set_font_style("B", 13.5)
    pdf.set_y(80)
    pdf.cell(PAGE_W, 7, "Official Ruleset & Example of Play", align="C")

    pdf.set_text_color(*GRAY)
    pdf.set_font_style("", 9)
    pdf.set_y(88)
    if pdf.rules_meta:
        cover_line = (
            f"Ruleset v{pdf.rules_meta.version}  \u00b7  "
            f"{format_human_date(pdf.rules_meta.date)}  \u00b7  "
            f"Status: {pdf.rules_meta.status.title()}"
        )
    else:
        cover_line = "Ruleset  \u00b7  Status: Draft"
    pdf.cell(PAGE_W, 5, cover_line, align="C")

    # -- drawn playing card motif -----------------------------------------
    cw, ch, cx = 52, 74, (PAGE_W - 52) / 2
    cy = 108
    pdf.set_fill_color(255, 255, 255)
    pdf.set_draw_color(*DARK)
    pdf.set_line_width(0.5)
    pdf.rect(cx, cy, cw, ch, style="FD")
    pdf.set_draw_color(*CRIMSON)
    pdf.set_line_width(0.3)
    pdf.rect(cx + 4, cy + 4, cw - 8, ch - 8, style="D")
    pdf.set_text_color(*DARK)
    pdf.set_font_style("B", 13)
    pdf.set_xy(cx + 7, cy + 6)
    pdf.cell(12, 6, "K", align="L")
    pdf.set_xy(cx + 7, cy + 12.5)
    pdf.cell(12, 6, "♠", align="L")
    pdf.set_font_style("B", 34)
    pdf.set_text_color(*CRIMSON)
    pdf.set_xy(cx, cy + 28)
    pdf.cell(cw, 14, "♠", align="C")
    with pdf.rotation(180, cx + cw - 12, cy + ch - 12):
        pdf.set_text_color(*DARK)
        pdf.set_font_style("B", 13)
        pdf.set_xy(cx + cw - 18, cy + ch - 18)
        pdf.cell(12, 6, "K", align="L")
        pdf.set_xy(cx + cw - 18, cy + ch - 12.5)
        pdf.cell(12, 6, "♠", align="L")

    pdf.set_text_color(*GRAY)
    pdf.set_font_style("", 8.5)
    pdf.set_y(196)
    pdf.cell(PAGE_W, 5, "Deal 28 cards face-up into a 7-row pyramid. Pair exposed cards summing to 13.", align="C")
    pdf.set_y(202)
    pdf.cell(PAGE_W, 5, "Solo Kings clear singly. Mutations — scars, curses, blessings, anchors — persist across the campaign.", align="C")

    pdf.set_text_color(*GRAY)
    pdf.set_font_style("", 8)
    pdf.set_y(224)
    pdf.cell(PAGE_W, 5, "Print on US Letter · Single-sided recommended", align="C")


def render_toc(pdf: RulebookPDF, toc: List[Tuple[str, List[Tuple[str, int]]]]) -> None:
    pdf.section_title = "Contents"
    pdf.add_page()
    pdf.set_text_color(*DARK)
    pdf.set_font_style("B", 16)
    pdf.set_xy(ML, 34)
    pdf.cell(CONTENT_W, 8, "Contents", align="L")
    pdf.set_draw_color(*CRIMSON)
    pdf.set_line_width(0.6)
    pdf.line(ML, 44, ML + 24, 44)
    y = 52
    for part, entries in toc:
        pdf.set_xy(ML, y)
        pdf.set_font_style("B", 11)
        pdf.set_text_color(*CRIMSON)
        pdf.cell(CONTENT_W, 6, part, align="L")
        y += 8
        for text, page in entries:
            pdf.set_text_color(*INK)
            pdf.set_font_style("", 9.5)
            tw = pdf.get_string_width(text)
            pdf.set_xy(ML + 5, y)
            pdf.cell(tw, 5, text, align="L")
            num_w = pdf.get_string_width(str(page))
            pdf.set_xy(PAGE_W - MR - num_w, y)
            pdf.cell(num_w, 5, str(page), align="R")
            dash_x0 = ML + 5 + tw + 3
            dash_x1 = PAGE_W - MR - num_w - 3
            mid_y = y + 2.5
            pdf.set_draw_color(*LEADER)
            pdf.set_line_width(0.2)
            pdf.set_dash_pattern(dash=0.5, gap=1.1)
            if dash_x1 > dash_x0:
                pdf.line(dash_x0, mid_y, dash_x1, mid_y)
            pdf.set_dash_pattern()
            y += 6
        y += 2
    pdf.set_xy(ML, y + 4)
    pdf.set_font_style("I", 8.5)
    pdf.set_text_color(*GRAY)
    pdf.multi_cell(CONTENT_W, 4.5,
                   "This document combines standard Pyramid Solitaire rules (docs/standard-pyramid-rules.md), "
                   "the official Cursed Tomb ruleset (docs/rules.md), and a scripted, annotated walkthrough "
                   "(docs/example-of-play.md). All mechanics in the example follow Sections 1–7 of the rules.",
                   align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)


# ---------------------------------------------------------------------------
# Build pipeline
# ---------------------------------------------------------------------------

def build_document(pdf: RulebookPDF, parts, record_toc: bool, with_toc_page: bool,
                   toc_entries: Optional[List[Tuple[str, int]]] = None) -> None:
    pdf._show_header = False
    pdf._show_footer = False
    render_cover(pdf)
    render_license_page(pdf)
    pdf._show_header = True
    pdf._show_footer = True
    if with_toc_page:
        toc: List[Tuple[str, List[Tuple[str, int]]]] = []
        for part_title, blocks in parts:
            h2 = {b.text for b in blocks if b.kind == "heading" and b.level == 2}
            entries = [(t, p) for t, p in (toc_entries or []) if t in h2]
            if entries:
                toc.append((part_title, entries))
        render_toc(pdf, toc)
    pdf._show_header = True
    pdf._show_footer = True
    for idx, (part_title, blocks) in enumerate(parts):
        if idx == 0:
            subtitle = "Classic Pyramid Solitaire Foundation"
        elif idx == 1:
            ver = pdf.rules_meta.version if pdf.rules_meta else "?"
            subtitle = f"Ruleset v{ver}"
        else:
            subtitle = "Companion to the Official Ruleset"
        render_part_divider(
            pdf, part_title,
            subtitle,
            new_page=(idx > 0 or with_toc_page))
        render_blocks(pdf, blocks, record_toc)


def ensure_noto_font() -> Path:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    target = FONT_DIR / "NotoSansSymbols-Regular.ttf"
    if target.exists():
        return target
    print("Downloading Noto Sans Symbols font (for the ⏍ glyph)…")
    urllib.request.urlretrieve(NOTO_URL, target)
    return target


def setup_fonts(pdf: RulebookPDF) -> None:
    families: list[tuple[str, str, list[str]]] = [
        ("FreeSans", "", [
            "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
            str(WIN_FONT_DIR / "DejaVuSans.ttf"),
            str(WIN_FONT_DIR / "arial.ttf"),
        ]),
        ("FreeSans", "B", [
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
            str(WIN_FONT_DIR / "DejaVuSans-Bold.ttf"),
            str(WIN_FONT_DIR / "arialbd.ttf"),
        ]),
        ("FreeSans", "I", [
            "/usr/share/fonts/truetype/freefont/FreeSansOblique.ttf",
            str(WIN_FONT_DIR / "DejaVuSans-Oblique.ttf"),
            str(WIN_FONT_DIR / "ariali.ttf"),
        ]),
        ("FreeSans", "BI", [
            "/usr/share/fonts/truetype/freefont/FreeSansBoldOblique.ttf",
            str(WIN_FONT_DIR / "DejaVuSans-BoldOblique.ttf"),
            str(WIN_FONT_DIR / "arialbi.ttf"),
        ]),
        ("Mono", "", [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
            str(WIN_FONT_DIR / "DejaVuSansMono.ttf"),
        ]),
        ("Mono", "B", [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
            str(WIN_FONT_DIR / "DejaVuSansMono-Bold.ttf"),
        ]),
    ]
    for family, style, candidates in families:
        path = _resolve_font(*candidates)
        if not path:
            raise SystemExit(f"Missing system font for {family} {style!r}: tried {candidates}\n"
                             f"Install 'fonts-freefont-ttf' and 'fonts-dejavu-core' (Linux) "
                             f"or ensure DejaVu/Arial fonts are in C:\\Windows\\Fonts.")
        pdf.add_font(family, style, path)
    noto = ensure_noto_font()
    pdf.add_font("NotoSym", "", str(noto))
    pdf.set_fallback_fonts(["NotoSym"])


def configure(pdf: RulebookPDF) -> None:
    setup_fonts(pdf)
    pdf.set_margins(ML, MT, MR)
    pdf.set_auto_page_break(True, MB)
    ver = pdf.rules_meta.version if pdf.rules_meta else "?"
    pdf.set_title(f"The Cursed Tomb \u2014 Complete Rulebook (v{ver})")
    pdf.set_author("Jayson Harshbarger")
    pdf.set_subject("Standard Pyramid Solitaire, Cursed Tomb ruleset, and example of play")
    pdf.set_keywords("cursed tomb, pyramid solitaire, card game, ruleset, campaign, standard rules, CC BY-SA 4.0, CC0")
    pdf.set_creator("The Cursed Tomb — Offline Rulebook (CC BY-SA 4.0 Parts II & III, CC0 Part I)")


def main() -> int:
    ap = argparse.ArgumentParser(description="Build the combined Cursed Tomb rulebook PDF.")
    ap.add_argument("--rules", default="docs/rules.md")
    ap.add_argument("--standard", default="docs/standard-pyramid-rules.md")
    ap.add_argument("--example", default="docs/example-of-play.md")
    ap.add_argument("--output", default="docs/cursed-tomb-rulebook.pdf")
    args = ap.parse_args()

    # Single source of truth: version/date/status from --rules frontmatter
    rules_meta = get_rules_meta(Path(args.rules))

    rules_md = strip_doc(Path(args.rules).read_text(encoding="utf-8"))
    standard_md = strip_doc(Path(args.standard).read_text(encoding="utf-8"))
    example_md = strip_doc(Path(args.example).read_text(encoding="utf-8"))
    parts = [
        ("Part I — Standard Pyramid Solitaire", parse_blocks(standard_md)),
        ("Part II — The Official Ruleset", parse_blocks(rules_md)),
        ("Part III — Example of Play", parse_blocks(example_md)),
    ]

    # Pass A: render once to learn heading page numbers.
    # A placeholder TOC page keeps pass A structurally identical to pass B,
    # so the recorded page numbers are exact.
    pdf_a = RulebookPDF(rules_meta=rules_meta)
    configure(pdf_a)
    build_document(pdf_a, parts, record_toc=True, with_toc_page=True, toc_entries=[])
    pass_a_pages = getattr(pdf_a, "pages_count", pdf_a.page) or pdf_a.page
    toc_entries = list(pdf_a.toc_pages)

    # Pass B: final render with cover + TOC + content.
    pdf = RulebookPDF(rules_meta=rules_meta)
    configure(pdf)
    build_document(pdf, parts, record_toc=False, with_toc_page=True, toc_entries=toc_entries)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(out))
    final_pages = getattr(pdf, "pages_count", pdf.page) or pdf.page
    print(f"Wrote {out}  ({final_pages} pages; pass A had {pass_a_pages} pages)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
