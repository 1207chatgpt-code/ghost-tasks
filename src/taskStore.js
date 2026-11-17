export function createTask(title, nextStep, minutes = 25) {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 90) throw new Error('Invalid title');
  if (typeof nextStep !== 'string' || !nextStep.trim() || nextStep.trim().length > 120) throw new Error('Invalid next step');
  if (!Number.isInteger(Number(minutes)) || Number(minutes) < 1 || Number(minutes) > 120) throw new Error('Invalid duration');
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    nextStep: nextStep.trim(),
    minutes: Number(minutes),
    status: 'active',
    createdAt: now,
    completedAt: null,
  };
}

export function reviveTask(task, nextStep) {
  return { ...task, nextStep: nextStep.trim(), status: 'active', completedAt: null };
}

export function completeTask(task) {
  return { ...task, status: 'released', completedAt: new Date().toISOString() };
}

export function loadTasks(storage, key = 'ghost-tasks') {
  try {
    const value = storage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(task => task && typeof task.id === 'string' && /^[a-zA-Z0-9-]+$/.test(task.id)
      && typeof task.title === 'string' && task.title.trim() && task.title.length <= 90
      && typeof task.nextStep === 'string' && task.nextStep.trim() && task.nextStep.length <= 120
      && Number.isInteger(task.minutes) && task.minutes > 0 && task.minutes <= 120
      && ['active', 'released', 'archived'].includes(task.status)
      && Number.isFinite(Date.parse(task.createdAt))
      && (task.status !== 'released' || Number.isFinite(Date.parse(task.completedAt))));
  } catch {
    return [];
  }
}

export function saveTasks(storage, tasks, key = 'ghost-tasks') {
  try { storage.setItem(key, JSON.stringify(tasks)); return true; } catch { return false; }
}
