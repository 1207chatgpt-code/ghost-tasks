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
