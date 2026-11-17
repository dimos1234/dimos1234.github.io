# Adam Shaltout's battle portfolio

A 640×480, pixel-art personal website built with HTML, Canvas and JavaScript. GitHub Pages serves the static files directly; no build step is required.

## Local preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/?intro=1 to replay the opening.

Arrow keys move/select, Z confirms/strikes, X goes back, and **M mutes or unmutes all audio**. Mouse and touch controls are also available. Sound is enabled by default; browsers unlock playback on the first interaction. Rakuichi Buster begins when the first attack lands.

Only FIGHT appears before the first hit. The timing bar bounces indefinitely and every hit succeeds. After the short encounter, ACT opens the projects, experience, games, artwork and biography. Quick Portfolio provides a readable view with real links.

## Checks

```sh
node --test tests/*.test.mjs
```

The original bitmap font can be rebuilt with `python3 tools/build-pixel-font.py` and fontTools. The generated TTF is included for hosting.

## Backup and credits

The previous website is preserved on [backup/original-website-2026-11-17](https://github.com/dimos1234/dimos1234.github.io/tree/backup/original-website-2026-11-17).

See [CREDITS.md](CREDITS.md) for music, sound effects and artwork credits.

