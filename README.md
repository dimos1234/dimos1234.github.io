# Adam Shaltout's battle portfolio

A 640×480, pixel-art personal website built with HTML, Canvas and JavaScript. GitHub Pages serves the static files directly; no build step is required.

## Local preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/?intro=1 to replay the opening.

Arrow keys move/select, Z confirms/strikes, X goes back, and **M mutes or unmutes all audio**. Mouse and touch controls are also available. Sound is enabled by default; browsers unlock playback on the first interaction. Rakuichi Buster begins when Adam is selected in the FIGHT target pane, before the timing bar.

Only FIGHT appears before the first hit. The timing bar bounces indefinitely and every hit succeeds for 12–28 damage against 100 HP. Adam's LV 20 and health stay beneath his sprite. A strike plays its full animation and sound while the dialogue box stays empty. The reaction dialogue then waits for Z before Adam counterattacks. Every surviving hit gets a six-second heart-control turn, followed by the action menu. Music continues through that turn; only taking damage plays a sound effect. Movement and menu cues stay quiet.

The opening offers large **Go to Portfolio** and **Fight Adam** buttons. Arrow keys choose between them and Z selects; clicking and touch work too. The persistent Skip Fight button remains available.

ACT contains four short summaries: **Check Adam**, **Pulsenics**, **Projects**, and **Interests**. Each requested paragraph is a separate dialogue page. Z advances dialogue; X returns to the menu. MERCY offers View Portfolio and Replay Encounter.

The final hit leads to Adam's defeat dialogue. Z starts the death sprite sequence and Undertale vaporizing sound, then opens the restored original website in `portfolio/`. **Skip Fight (Quick Portfolio)** goes directly to the same website. All three original pages and their design are restored; the archival backup is unchanged. Replay Battle on those pages starts a fresh encounter.

On mobile, the opening says “Best experienced on a computer.” Touch controls replace the keyboard guide, Back/Select buttons have labels, and the 640×480 canvas scales to fit narrow phones without losing its aspect ratio. The battle and restored portfolio were checked at 320- and 390-pixel widths, including navigation, project cards and the art gallery.

## Checks

```sh
node --test tests/*.test.mjs
```

The original bitmap font can be rebuilt with `python3 tools/build-pixel-font.py` and fontTools. The generated TTF is included for hosting.

## Backup and credits

The previous website is preserved on [backup/original-website-2026-11-17](https://github.com/dimos1234/dimos1234.github.io/tree/backup/original-website-2026-11-17).

See [CREDITS.md](CREDITS.md) for music, sound effects and artwork credits.

