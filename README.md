# Ghost Tasks

Ghost Tasks turns abandoned to-dos into ghosts you can revive with one small next step. Complete a focus session and the ghost disappears into your release log.

## Run locally

This is a dependency-free browser app. Serve the folder with any static server:

```bash
npx serve .
```

Then open the printed local URL. The app stores tasks in `localStorage` and needs no account or API key.

## Built with

- HTML, CSS, and modern JavaScript modules
- Browser localStorage
- Kiro project configuration in `.kiro/`

## Test

```bash
npm test
```

## Features

Task creation and editing, reversible archive/restore, focus sessions with pause/resume/reset, completion log and revival, language preferences, and browser-only persistence. Completing a step is a user action; reaching zero does not automatically claim the work is done.

## Production assets

```bash
npm run build
```

Deploy only `dist/` to a static host. Do not publish the entire workspace: local logs and private account notes are intentionally excluded. Task data is stored per browser and per origin; this is not cloud backup. Google Fonts are optional and fall back to system fonts when offline.

## Submission status

This is an initial implementation prepared with Codex. Kiro CLI with DeepSeek 3.2 reviewed persistence, found session loss on refresh, and reviewed the Codex fix. Claude was not used. Read `docs/KIRO_USAGE.md` before making any Kiro usage claims. The source is published at https://github.com/1207chatgpt-code/ghost-tasks. The competition entry is still a draft; no final submission has been made.

## Live demo

https://1207chatgpt-code.github.io/ghost-tasks/

Recent focus sessions survive page reloads, including paused state. See [Kiro usage](docs/KIRO_USAGE.md) for the actual DeepSeek review contribution and its limits.
