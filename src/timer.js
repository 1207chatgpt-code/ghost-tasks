export function startTimer(durationSeconds, now = Date.now()) {
  return { durationSeconds, startedAt: now, pausedAt: null };
}
export function secondsLeft(timer, now = Date.now()) {
  return Math.max(0, timer.durationSeconds - Math.floor(((timer.pausedAt ?? now) - timer.startedAt) / 1000));
}
export function pauseTimer(timer, now = Date.now()) {
  return timer.pausedAt === null ? { ...timer, pausedAt: now } : timer;
}
export function resumeTimer(timer, now = Date.now()) {
  return timer.pausedAt === null ? timer : { ...timer, startedAt: timer.startedAt + now - timer.pausedAt, pausedAt: null };
}

// Only recover a recent session belonging to a task that is still active.
export function loadFocus(storage, tasks, now = Date.now()) {
  try {
    const session = JSON.parse(storage.getItem('ghost-focus'));
    const clock = session?.clock;
    if (!tasks.some(task => task.id === session?.taskId && task.status === 'active')
      || !Number.isInteger(clock?.durationSeconds) || clock.durationSeconds < 60 || clock.durationSeconds > 7200
      || !Number.isFinite(clock.startedAt) || clock.startedAt < 0 || clock.startedAt > now
      || now - clock.startedAt > 86400000
      || !(clock.pausedAt === null || (Number.isFinite(clock.pausedAt) && clock.pausedAt >= clock.startedAt && clock.pausedAt <= now))) return null;
    return { taskId: session.taskId, clock: { durationSeconds: clock.durationSeconds, startedAt: clock.startedAt, pausedAt: clock.pausedAt } };
  } catch { return null; }
}
export function saveFocus(storage, taskId, clock) {
  try {
    if (taskId && clock) storage.setItem('ghost-focus', JSON.stringify({ taskId, clock }));
    else storage.removeItem('ghost-focus');
    return true;
  } catch { return false; }
}
