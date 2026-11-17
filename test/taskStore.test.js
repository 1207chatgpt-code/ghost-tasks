import test from 'node:test';
import assert from 'node:assert/strict';
import { completeTask, createTask, loadTasks, reviveTask, saveTasks } from '../src/taskStore.js';

test('creates a clean active ghost task', () => {
  const task = createTask('  Ship the landing page  ', '  Write the hero copy  ', 20);
  assert.equal(task.title, 'Ship the landing page');
  assert.equal(task.nextStep, 'Write the hero copy');
  assert.equal(task.minutes, 20);
  assert.equal(task.status, 'active');
});

test('revives and releases a ghost', () => {
  const task = createTask('Plan launch', 'Open a blank document');
  const revived = reviveTask({ ...task, status: 'released' }, 'Write three bullets');
  const released = completeTask(revived);
  assert.equal(revived.status, 'active');
  assert.equal(released.status, 'released');
  assert.ok(released.completedAt);
});

test('persists tasks through storage', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const tasks = [createTask('Write docs', 'Open README')];
  saveTasks(storage, tasks);
  assert.deepEqual(loadTasks(storage), tasks);
});
