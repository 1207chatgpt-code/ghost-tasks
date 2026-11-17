import test from 'node:test';
import assert from 'node:assert/strict';
import { startTimer, secondsLeft, pauseTimer, resumeTimer } from '../src/timer.js';

test('uses wall-clock time after background throttling', () => {
 const timer = startTimer(900, 1000);
 assert.equal(secondsLeft(timer, 601000), 300);
 assert.equal(secondsLeft(timer, 9999999), 0);
});
test('pausing freezes remaining time and resuming preserves it', () => {
 const paused = pauseTimer(startTimer(900, 1000), 61000);
 assert.equal(secondsLeft(paused, 999999), 840);
 assert.equal(secondsLeft(resumeTimer(paused, 1000000), 1060000), 780);
});
