#!/usr/bin/env python3
"""Generate a contact-sheet PDF for figures used in English Literacy tests."""

from __future__ import annotations

import math
import re
from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "generated" / "figure-contact-sheets" / "english-literacy-used-figures.pdf"

LEVELS = [
    ("English Literacy Level 1", ROOT / "apps" / "english-literacy" / "level-1", 25),
    ("English Literacy Level 2", ROOT / "apps" / "english-literacy" / "level-2", 4),
    ("English Literacy Level 3", ROOT / "apps" / "english-literacy" / "level-3", 1),
    ("English Literacy Level 4", ROOT / "apps" / "english-literacy" / "level-4", 1),
    ("English Literacy Level 5", ROOT / "apps" / "english-literacy" / "level-5", 1),
]

SOURCE_EXTS = {".js", ".html", ".css"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}

ASSET_REF_RE = re.compile(r"""assets/([^"'`\s)]+?\.(?:png|jpe?g|webp|gif|svg))""", re.IGNORECASE)
BOOKLET_RE = re.compile(r"""bookletImage\(\s*["']([^"']+\.(?:png|jpe?g|webp|gif|svg))["']""", re.IGNORECASE)

PAGE_W, PAGE_H = fitz.paper_size("a3")
PAGE_W, PAGE_H = max(PAGE_W, PAGE_H), min(PAGE_W, PAGE_H)
MARGIN = 32
TITLE_H = 44
FOOTER_H = 22
GAP = 14
CAPTION_H = 26

TITLE_FONT = 18
BODY_FONT = 10
CAPTION_FONT = 8


def source_files(level_dir: Path) -> list[Path]:
    preferred = ["app.js", "config.js", "index.html", "test.html", "styles.css"]
    files = [level_dir / name for name in preferred if (level_dir / name).exists()]
    seen = set(files)
    extras = sorted(p for p in level_dir.iterdir() if p.suffix.lower() in SOURCE_EXTS and p not in seen)
    return files + extras


def discover_used_assets(level_dir: Path) -> list[Path]:
    asset_dir = level_dir / "assets"
    if not asset_dir.exists():
        return []

    assets_by_name = {
        p.name: p
        for p in asset_dir.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    }

    used: list[Path] = []
    seen: set[Path] = set()

    for source in source_files(level_dir):
        text = source.read_text(encoding="utf-8", errors="ignore")
        refs = []
        refs.extend(match.group(1) for match in ASSET_REF_RE.finditer(text))
        refs.extend(match.group(1) for match in BOOKLET_RE.finditer(text))
        for ref in refs:
            candidate = assets_by_name.get(Path(ref).name)
            if candidate and candidate not in seen:
                used.append(candidate)
                seen.add(candidate)

    return used


def image_size(path: Path) -> tuple[float, float]:
    if path.suffix.lower() == ".svg":
        doc = fitz.open(path)
        try:
            rect = doc[0].rect
            return float(rect.width), float(rect.height)
        finally:
            doc.close()

    with Image.open(path) as image:
        return float(image.width), float(image.height)


def fit_rect(box: fitz.Rect, image_w: float, image_h: float) -> fitz.Rect:
    if image_w <= 0 or image_h <= 0:
        return box
    scale = min(box.width / image_w, box.height / image_h)
    width = image_w * scale
    height = image_h * scale
    left = box.x0 + (box.width - width) / 2
    top = box.y0 + (box.height - height) / 2
    return fitz.Rect(left, top, left + width, top + height)


def draw_image(page: fitz.Page, path: Path, rect: fitz.Rect) -> None:
    image_w, image_h = image_size(path)
    target = fit_rect(rect, image_w, image_h)
    if path.suffix.lower() == ".svg":
        doc = fitz.open(path)
        try:
            scale = max(1.5, min(4, min(target.width / image_w, target.height / image_h) * 2))
            pixmap = doc[0].get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=True)
            page.insert_image(target, stream=pixmap.tobytes("png"))
        finally:
            doc.close()
    else:
        max_w = max(1, int(target.width * 2))
        max_h = max(1, int(target.height * 2))
        with Image.open(path) as image:
            image.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            buffer = BytesIO()
            if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
                image.save(buffer, format="PNG", optimize=True)
            else:
                image.convert("RGB").save(buffer, format="JPEG", quality=88, optimize=True)
        page.insert_image(target, stream=buffer.getvalue())


def grid_shape(count: int) -> tuple[int, int]:
    if count <= 1:
        return 1, 1
    if count <= 4:
        cols = 2
    elif count <= 9:
        cols = 3
    elif count <= 16:
        cols = 4
    else:
        cols = 5
    return cols, math.ceil(count / cols)


def draw_wrapped_text(page: fitz.Page, rect: fitz.Rect, text: str, size: float, color=(0, 0, 0)) -> None:
    page.insert_textbox(
        rect,
        text,
        fontsize=size,
        fontname="helv",
        color=color,
        align=fitz.TEXT_ALIGN_CENTER,
    )


def draw_level_page(doc: fitz.Document, title: str, assets: list[Path], page_number: int) -> None:
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    page.insert_text((MARGIN, MARGIN + 10), title, fontsize=TITLE_FONT, fontname="helv", color=(0.05, 0.17, 0.25))
    page.insert_text(
        (MARGIN, MARGIN + 30),
        f"{len(assets)} used image{'s' if len(assets) != 1 else ''}",
        fontsize=BODY_FONT,
        fontname="helv",
        color=(0.35, 0.42, 0.48),
    )

    content = fitz.Rect(MARGIN, MARGIN + TITLE_H, PAGE_W - MARGIN, PAGE_H - MARGIN - FOOTER_H)
    if not assets:
        page.draw_rect(content, color=(0.82, 0.88, 0.90), fill=(0.96, 0.98, 0.98), width=0.8)
        draw_wrapped_text(page, content + (0, content.height / 2 - 12, 0, -content.height / 2 + 12), "No referenced figure assets in this level.", 14, (0.25, 0.33, 0.38))
    else:
        cols, rows = grid_shape(len(assets))
        cell_w = (content.width - GAP * (cols - 1)) / cols
        cell_h = (content.height - GAP * (rows - 1)) / rows
        for index, asset in enumerate(assets):
            row, col = divmod(index, cols)
            x0 = content.x0 + col * (cell_w + GAP)
            y0 = content.y0 + row * (cell_h + GAP)
            cell = fitz.Rect(x0, y0, x0 + cell_w, y0 + cell_h)
            page.draw_rect(cell, color=(0.86, 0.90, 0.92), fill=(1, 1, 1), width=0.6)
            image_box = fitz.Rect(cell.x0 + 7, cell.y0 + 7, cell.x1 - 7, cell.y1 - CAPTION_H - 8)
            caption_box = fitz.Rect(cell.x0 + 4, cell.y1 - CAPTION_H, cell.x1 - 4, cell.y1 - 4)
            draw_image(page, asset, image_box)
            draw_wrapped_text(page, caption_box, asset.name, CAPTION_FONT, (0.07, 0.15, 0.20))

    footer = f"Figure contact sheet | {title} | Page {page_number}"
    page.insert_text((MARGIN, PAGE_H - 18), footer, fontsize=8, fontname="helv", color=(0.42, 0.48, 0.54))


def main() -> None:
    discovered: list[tuple[str, list[Path]]] = []
    for title, level_dir, expected_count in LEVELS:
        assets = discover_used_assets(level_dir)
        if len(assets) != expected_count:
            names = ", ".join(asset.name for asset in assets)
            raise RuntimeError(f"{title}: expected {expected_count} assets, found {len(assets)} ({names})")
        discovered.append((title, assets))

    doc = fitz.open()
    for index, (title, assets) in enumerate(discovered, start=1):
        draw_level_page(doc, title, assets, index)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUTPUT)
    doc.close()

    verify = fitz.open(OUTPUT)
    try:
        if len(verify) != len(LEVELS):
            raise RuntimeError(f"Expected {len(LEVELS)} pages, found {len(verify)}")
    finally:
        verify.close()

    print(OUTPUT)
    for title, assets in discovered:
        print(f"{title}: {len(assets)}")


if __name__ == "__main__":
    main()
