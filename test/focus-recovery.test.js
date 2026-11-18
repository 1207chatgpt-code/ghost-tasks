import test from 'node:test';
import assert from 'node:assert/strict';
import * as timer from '../src/timer.js';
const task = { id: 'task-1', status: 'active' };
function memory() {
  const entries = new Map();
  return { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
}
test('restores running and paused focus after a reload, and clears explicit closure', () => {
  assert.equal(typeof timer.saveFocus, 'function');
  assert.equal(typeof timer.loadFocus, 'function');
  const storage = memory();
  const clock = timer.startTimer(900, 1000);
  assert.equal(timer.saveFocus(storage, task.id, clock), true);
  const restored = timer.loadFocus(storage, [task], 61000);
  assert.equal(restored.taskId, task.id);
  assert.equal(timer.secondsLeft(restored.clock, 61000), 840);
  timer.saveFocus(storage, task.id, timer.pauseTimer(clock, 61000));
  assert.equal(timer.secondsLeft(timer.loadFocus(storage, [task], 361000).clock, 361000), 840);
  timer.saveFocus(storage, null, null);
  assert.equal(timer.loadFocus(storage, [task], 361000), null);
});
test('ignores malformed focus records and tasks that are no longer active', () => {
  assert.equal(typeof timer.loadFocus, 'function');
  const storage = memory();
  for (const raw of ['{', 'null', '{}', JSON.stringify({ taskId: task.id, clock: { durationSeconds: -2, startedAt: 1000, pausedAt: null } })]) {
    storage.setItem('ghost-focus', raw);
    assert.equal(timer.loadFocus(storage, [task], 61000), null);
  }
  timer.saveFocus(storage, task.id, timer.startTimer(900, 1000));
  assert.equal(timer.loadFocus(storage, [{ ...task, status: 'released' }], 61000), null);
  assert.equal(timer.loadFocus(storage, [task], 500), null);
  assert.equal(timer.loadFocus(storage, [task], 86402000), null);
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(timer.loadFocus(blocked, [task]), null);
  assert.equal(timer.saveFocus(blocked, task.id, timer.startTimer(900)), false);
});
