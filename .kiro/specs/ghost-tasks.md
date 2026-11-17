# Ghost Tasks implementation notes

## Core flow

1. Add a neglected task and a concrete next step.
2. Start a focus session for the task.
3. Mark the task complete and release its ghost.
4. Keep active and released tasks in localStorage.

## Acceptance criteria

- A task cannot be saved without a title and next step.
- Refreshing the page preserves tasks.
- A focus timer can be paused, reset, and completed.
- The interface works on narrow screens.
- The page supports English and Chinese labels.
