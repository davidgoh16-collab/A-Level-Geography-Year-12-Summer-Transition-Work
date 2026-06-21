# A Level Geography — Summer Transition Work

An interactive, on-brand summer worksheet for AQA A Level Geography (Thamesview
School, KS5 Geography). Students fill it in online, their answers auto-save to
the browser, and they print it / save as PDF to bring to their first Year 12
lesson.

## Run it

It's a static site — no build step. Open `index.html` directly, or serve the
folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- **Fillable fields** — student details, the AQA Assessment Objectives table,
  Part 2 task answers, and per-reading summary notes boxes, plus completion
  checkboxes.
- **Auto-save** — every answer persists to `localStorage` (key
  `ks5-geog-summer-work-v1`), with a "Saved" indicator.
- **Progress tracking** — a top progress bar (`x / 11 tasks complete`) and
  per-section status pills that flip to "✓ Complete".
- **Embedded reading** — the two summer pre-reading PDFs and the Changing
  Places 8.1 podcast are embedded (screen-only) with "open in new tab"
  fallbacks.
- **Print / Save PDF** — one button. Print styles strip the toolbar and embeds,
  expand textareas so full answers show, and lay it out cleanly for A4.
- **Clear answers** — resets all saved input.

## Structure

```
index.html   — the worksheet markup + styles
app.js       — auto-save, progress, print expansion, reset (vanilla JS)
assets/      — KS5 Geography and Thamesview School logos
project/     — original Claude Design handoff bundle (HTML prototype, assets)
chats/       — design conversation transcripts
```

## Implementation notes

This was built from a Claude Design handoff (`project/`). The prototype ran on
the Claude Design `dc-runtime` (a React templating layer); it has been
recreated here as a dependency-free static page — the dc-runtime-specific
`style-hover` / `style-focus` attributes became real CSS, and the `DCLogic`
component became `app.js`. The visual output matches the prototype.

The embedded PDFs/podcast and external links (BBC, ITV, etc.) load when the
page is opened in a normal browser tab; some refuse to load inside sandboxed
preview frames.
