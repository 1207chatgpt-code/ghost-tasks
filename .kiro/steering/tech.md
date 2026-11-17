---
inclusion: always
---

# Technical direction

- Keep the app dependency-free and browser-native for a fast local demo.
- Use ES modules and small pure functions for task state transitions.
- Persist user-owned data with `localStorage`; do not add a server or account flow in v1.
- Keep all external publishing and credentials outside the source tree.
