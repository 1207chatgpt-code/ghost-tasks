# Kiro usage — Ghost Tasks

## Products and model actually used

Kiro CLI 3.4.0, signed in through Google, with `deepseek-3.2`. Claude was not available in the authenticated model list and was not used. The user explicitly approved the available DeepSeek model on 2026-11-18 (Asia/Shanghai).

## Actual contribution

Kiro read the project context, task store, timer, application integration, and tests. It identified that an active or paused focus session existed only in memory and disappeared after a page refresh. Codex reproduced this behavior in the browser, implemented recovery in `src/timer.js` and `app.js`, and added `test/focus-recovery.test.js`.

A second real Kiro review read the updated files, checked initialization order, paused-session restoration, completed-task handling, and invalid storage. It reported no blocking issue. Kiro performed review and supplied the fix direction; Codex implemented the patch and executed the tests. The initial application was also prepared by Codex.

## Verification

The two new regression tests failed before implementation. After the fix, all 11 tests and `npm run build` passed. Browser verification confirmed that a paused session reopened after refresh with its remaining time and Resume control intact. Closing a session explicitly clears it; inactive tasks, invalid records, and records older than 24 hours are not restored.

## Prepared configuration and limits

- `.kiro/steering/`: product, technology and structure guidance read during review.
- `.kiro/specs/ghost-tasks/`: requirements, design and tasks available to Kiro.
- `.kiro/hooks/test-on-save.json`: prepared hook; automatic execution inside Kiro was not verified. Tests were run separately by Codex.
- No custom agent, MCP server, property-based testing, powers, or Crew was used.

Local review transcripts are retained in the ignored `log/` directory. They are evidence of the review sessions, not public account data.
