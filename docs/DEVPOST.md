# Ghost Tasks

Category: Costume Contest

Pitch: A spooky productivity app that turns abandoned tasks into ghosts users can revive by defining a next step and completing a focus session.

## Inspiration

Unfinished tasks linger in the background and keep demanding attention. Ghost Tasks turns that feeling into a small, concrete interaction: name the task, choose one next step, focus, and release the ghost.

## What it does

- Creates a task with a concrete next step and a focus duration.
- Runs a wall-clock countdown with pause, resume, and reset.
- Records a released ghost when the user finishes a step.
- Supports editing, revival, and reversible archiving.
- Preserves tasks and language preferences in the current browser.
- Supports English and Chinese.

## How it is built

HTML, CSS, and JavaScript modules, with browser localStorage. No account, backend, or paid API is required. `npm run build` produces a public-assets-only folder for hosting.

## Challenges addressed

The timer uses elapsed wall-clock time so background-tab throttling does not make it drift. Stored task records are validated before rendering, and a storage write failure is surfaced to the user. Task content is rendered through textContent to avoid interpreting it as HTML.

## Kiro work still pending

The initial code was prepared in Codex. Actual Kiro CLI/Claude development must be performed and documented before final submission. See KIRO_USAGE.md. Do not tag Claude or Kiro as already used until verified.

## Link status

GitHub: not created yet; intended account is 1207chatgpt-code.
Hosted demo: not deployed.
YouTube: not recorded or uploaded.
