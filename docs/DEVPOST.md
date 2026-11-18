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
- Preserves tasks, language preferences, and recent running or paused focus sessions in the current browser.
- Supports English and Chinese.

## How it is built

HTML, CSS, and JavaScript modules, with browser localStorage. No account, backend, or paid API is required. `npm run build` produces a public-assets-only folder for hosting.

## Challenges addressed

The timer uses elapsed wall-clock time so background-tab throttling does not make it drift. Stored task records are validated before rendering, and a storage write failure is surfaced to the user. Task content is rendered through textContent to avoid interpreting it as HTML.

## How Kiro helped

I used Kiro CLI with DeepSeek 3.2 for a focused correctness review. Kiro identified that refreshing the page lost the current focus session. Codex reproduced the issue, implemented validated session persistence, and added regression tests; Kiro then reviewed the fix and found no blocking issue. All 11 tests and the build passed. The initial implementation was prepared in Codex. Claude and automatic hooks were not used.

## Links

GitHub: https://github.com/1207chatgpt-code/ghost-tasks
Demo: https://1207chatgpt-code.github.io/ghost-tasks/
YouTube: not recorded or uploaded yet.
