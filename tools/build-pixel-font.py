"""Build the project's original bitmap typeface; no third-party font assets."""
import json
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

root = Path(__file__).resolve().parents[1]
patterns = json.loads((root / "assets/battle/glyphs.json").read_text())
builder = FontBuilder(1000, isTTF=True)
names = {ch: "uni%04X" % ord(ch) for ch in patterns}
order = [".notdef"] + list(names.values())
builder.setupGlyphOrder(order)
builder.setupCharacterMap({ord(ch): name for ch, name in names.items()})
glyphs = {}
metrics = {}
for char, name in [("?", ".notdef")] + list(names.items()):
    pen = TTGlyphPen(None)
    for row_index, row in enumerate(patterns[char].split("/")):
        for col, pixel in enumerate(row):
            if pixel == "1":
                x, y = col * 100, (6 - row_index) * 100
                pen.moveTo((x, y))
                pen.lineTo((x + 100, y))
                pen.lineTo((x + 100, y + 100))
                pen.lineTo((x, y + 100))
                pen.closePath()
    glyphs[name] = pen.glyph()
    metrics[name] = (600, 0)
builder.setupGlyf(glyphs)
builder.setupHorizontalMetrics(metrics)
builder.setupHorizontalHeader(ascent=800, descent=-200)
builder.setupNameTable({"familyName":"Soul Mono", "styleName":"Regular", "uniqueFontIdentifier":"SoulMono-Regular-1", "fullName":"Soul Mono Regular", "psName":"SoulMono-Regular", "version":"Version 1.0"})
builder.setupOS2(sTypoAscender=800, sTypoDescender=-200, usWinAscent=800, usWinDescent=200)
builder.setupPost()
builder.setupMaxp()
builder.save(root / "assets/battle/soul-mono.ttf")
print("Built assets/battle/soul-mono.ttf")

