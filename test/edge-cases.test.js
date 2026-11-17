import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, loadTasks, saveTasks } from '../src/taskStore.js';

test('rejects whitespace-only titles and next steps', () => {
  assert.throws(() => createTask('   ', 'Write one sentence'));
  assert.throws(() => createTask('Finish brief', '   '));
});
test('rejects unsupported focus durations', () => {
  for (const minutes of [-1, 0, 1e9, 'nope']) assert.throws(() => createTask('Brief', 'Write', minutes));
});
test('loads only usable task records from storage', () => {
  const storage = { getItem: () => JSON.stringify({ title: 'not an array' }) };
  assert.deepEqual(loadTasks(storage), []);
  assert.deepEqual(loadTasks({getItem:()=>JSON.stringify([null, {title:'no id'}])}), []);
});
test('reports storage failure without breaking the app', () => {
  assert.equal(saveTasks({setItem(){throw new Error('QuotaExceeded')}}, []), false);
});
