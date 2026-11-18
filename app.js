import { completeTask, createTask, loadTasks, reviveTask, saveTasks } from './src/taskStore.js';
import { loadFocus, saveFocus, pauseTimer, resumeTimer, secondsLeft, startTimer } from './src/timer.js';
import { translations } from './src/copy.js';

const $ = id => document.getElementById(id);
let storage;
try { storage = window.localStorage; } catch { storage = null; }
function preference(key, fallback) {
  try { return storage.getItem(key) ?? fallback; } catch { return fallback; }
}
const state = {
  tasks: loadTasks(storage),
  language: preference('ghost-language', 'en') === 'zh' ? 'zh' : 'en',
  steps: Math.max(0, Number(preference('ghost-focus-sessions', '0')) || 0),
  editingId: null, focusTaskId: null, clock: null, interval: null, saving: !!storage,
};
const t = key => translations[state.language][key];
function notify(message) { $('notice').textContent = message; }
function persist() {
  state.saving = saveTasks(storage, state.tasks);
  try {
    storage.setItem('ghost-language', state.language);
    storage.setItem('ghost-focus-sessions', String(state.steps));
  } catch { state.saving = false; }
  if (!saveFocus(storage, state.focusTaskId, state.clock)) state.saving = false;
}
function ghostMarkup(extra = '') { return `<span class="little-ghost ${extra}" aria-hidden="true"><i></i></span>`; }
function textNode(tag, className, text) {
  const el = document.createElement(tag); el.className = className; el.textContent = text; return el;
}
function action(label, actionName, taskId, className = 'ghost-button') {
  const button = textNode('button', className, label);
  button.type = 'button'; button.dataset.action = actionName; button.dataset.id = taskId;
  return button;
}
function renderTasks() {
  const active = state.tasks.filter(task => task.status === 'active');
  const released = state.tasks.filter(task => task.status === 'released').slice().reverse();
  const archived = state.tasks.filter(task => task.status === 'archived');
  $('active-count').textContent = active.length;
  $('released-count').textContent = released.length;
  $('focus-count').textContent = state.steps;
  $('list-count').textContent = active.length;
  $('empty-state').hidden = !!active.length;
  $('task-list').replaceChildren();
  for (const task of active) {
    const card = document.createElement('article'); card.className = 'task-card'; card.dataset.taskId = task.id;
    const top = document.createElement('div'); top.className = 'task-card-top';
    const icon = document.createElement('div'); icon.innerHTML = ghostMarkup();
    const info = document.createElement('div'); info.className = 'task-info';
    info.append(textNode('h3', 'task-title', task.title), textNode('span', 'step-caption', t('next')), textNode('p', 'task-step', task.nextStep));
    top.append(icon, info, textNode('span', 'time-chip', `${task.minutes} min`));
    const buttons = document.createElement('div'); buttons.className = 'task-card-actions';
    const tools = document.createElement('div'); tools.className = 'task-tools';
    tools.append(action(t('edit'), 'edit', task.id), action(t('archive'), 'archive', task.id));
    buttons.append(tools, action(`${t('focus')} ↗`, 'focus', task.id, 'primary-button'));
    card.append(top, buttons); $('task-list').append(card);
  }
  $('release-list').replaceChildren();
  if (!released.length) $('release-list').append(textNode('p', 'log-empty', t('releaseEmpty')));
  for (const task of released) {
    const item = document.createElement('div'); item.className = 'release-item';
    const info = document.createElement('div');
    info.append(textNode('b', '', task.title), textNode('p', 'task-step', task.nextStep));
    const meta = document.createElement('div'); meta.className = 'release-meta';
    const date = new Intl.DateTimeFormat(state.language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(task.completedAt));
    meta.append(textNode('span', '', date), action(t('revive'), 'restore', task.id));
    item.append(info, meta); $('release-list').append(item);
  }
  $('archive-section').hidden = !archived.length;
  $('archive-title').textContent = `${t('archived')} (${archived.length})`;
  $('archive-list').replaceChildren();
  for (const task of archived) {
    const row = document.createElement('div'); row.className = 'release-item';
    row.append(textNode('span', 'task-title', task.title), action(t('restore'), 'restore', task.id));
    $('archive-list').append(row);
  }
}
function render() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'en';
  const fields = {
    'language-toggle': 'lang', 'eyebrow-text': 'eyebrow', 'hero-copy': 'heroCopy',
    'active-label': 'active', 'released-label': 'released', 'focus-label': 'sessions',
    'summon-kicker': 'summon', 'task-title-label': 'taskTitle', 'task-step-label': 'taskStep',
    'minutes-label': 'minutes', 'lantern-kicker': 'lantern', 'lantern-title': 'lanternTitle',
    'empty-title': 'emptyTitle', 'empty-copy': 'emptyCopy', 'release-kicker': 'release',
    'release-title': 'releaseTitle', 'release-copy-text': 'releaseCopy', 'footer-copy': 'footer',
    'focus-kicker': 'focusKicker', 'focus-title': 'focusTitle', 'sample-button': 'sample',
    'privacy-note': 'demoNote', 'reset-focus': 'reset', 'cancel-edit': 'cancel',
    'complete-focus': 'releaseGhost',
  };
  for (const [id, key] of Object.entries(fields)) $(id).textContent = t(key);
  $('hero-title').innerHTML = t('heroTitle'); // Only static translation copy is rendered as HTML.
  $('summon-title').textContent = t(state.editingId ? 'editTitle' : 'summonTitle');
  $('summon-button').textContent = t(state.editingId ? 'editButton' : 'summonButton');
  $('saved-label').textContent = t(state.saving ? 'saved' : 'unsaved');
  $('status-dot').classList.toggle('unsaved', !state.saving);
  $('task-title').placeholder = t('taskTitlePlaceholder');
  $('task-step').placeholder = t('taskStepPlaceholder');
  $('close-focus').setAttribute('aria-label', t('close'));
  $('cancel-edit').hidden = !state.editingId;
  $('pause-focus').textContent = t(state.clock?.pausedAt != null ? 'resume' : 'pause');
  $('focus-note').textContent = t('focusNote');
  renderTasks();
}
function cancelEdit() { state.editingId = null; $('task-form').reset(); render(); }
function startFocus(task, recoveredClock = null) {
  state.focusTaskId = task.id;
  state.clock = recoveredClock ?? startTimer(task.minutes * 60);
  persist();
  $('focus-task-name').textContent = task.title;
  $('focus-step').textContent = task.nextStep;
  render(); updateTimer(); $('focus-dialog').showModal();
  clearInterval(state.interval); state.interval = setInterval(updateTimer, 250);
}
function updateTimer() {
  if (!state.clock) return;
  const remaining = secondsLeft(state.clock);
  $('timer').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  $('focus-note').textContent = t(remaining === 0 ? 'finished' : 'focusNote');
  $('timer-ring').style.setProperty('--progress', `${(1 - remaining / state.clock.durationSeconds) * 360}deg`);
}
function closeFocus() { clearInterval(state.interval); state.interval = null; state.focusTaskId = null; state.clock = null; persist(); $('focus-dialog').close(); }

$('task-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  let task;
  try { task = createTask(data.get('title'), data.get('nextStep'), data.get('minutes')); }
  catch { notify(t('validation')); $('task-title').focus(); return; }
  if (state.editingId) {
    state.tasks = state.tasks.map(old => old.id === state.editingId ? { ...old, title: task.title, nextStep: task.nextStep, minutes: task.minutes } : old);
    notify(t('updated'));
  } else { state.tasks.push(task); notify(t('savedTask')); }
  state.editingId = null; persist(); event.currentTarget.reset(); render();
});
$('sample-button').addEventListener('click', () => {
  $('task-title').value = t('sampleTitle'); $('task-step').value = t('sampleStep'); $('task-title').focus();
});
$('language-toggle').addEventListener('click', () => {
  state.language = state.language === 'en' ? 'zh' : 'en'; persist(); notify(''); render();
});
$('cancel-edit').addEventListener('click', cancelEdit);
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const task = state.tasks.find(task => task.id === button.dataset.id); if (!task) return;
  if (button.dataset.action === 'focus') { startFocus(task); return; }
  if (button.dataset.action === 'edit') {
    state.editingId = task.id; $('task-title').value = task.title; $('task-step').value = task.nextStep; $('task-minutes').value = task.minutes;
    render(); $('task-title').focus(); return;
  }
  if (button.dataset.action === 'archive') {
    task.status = 'archived'; notify(t('archivedMessage'));
    if (state.editingId === task.id) cancelEdit();
  }
  if (button.dataset.action === 'restore') {
    state.tasks = state.tasks.map(item => item.id === task.id ? reviveTask(item, item.nextStep) : item); notify(t('restored'));
  }
  persist(); render();
});
$('close-focus').addEventListener('click', closeFocus);
$('focus-dialog').addEventListener('cancel', event => { event.preventDefault(); closeFocus(); });
$('pause-focus').addEventListener('click', () => {
  state.clock = state.clock.pausedAt === null ? pauseTimer(state.clock) : resumeTimer(state.clock);
  persist(); $('pause-focus').textContent = t(state.clock.pausedAt === null ? 'pause' : 'resume'); updateTimer();
});
$('reset-focus').addEventListener('click', () => {
  state.clock = startTimer(state.clock.durationSeconds);
  persist(); $('pause-focus').textContent = t('pause'); updateTimer();
});
$('complete-focus').addEventListener('click', async () => {
  const id = state.focusTaskId; if (!id) return;
  state.tasks = state.tasks.map(task => task.id === id ? completeTask(task) : task);
  state.steps++; persist(); $('focus-dialog').classList.add('is-releasing');
  $('complete-focus').disabled = true;
  await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600));
  closeFocus(); $('focus-dialog').classList.remove('is-releasing'); $('complete-focus').disabled = false;
  notify(t('releasedMessage')); render();
});
render();

const recoveredFocus = loadFocus(storage, state.tasks);
if (recoveredFocus) startFocus(state.tasks.find(task => task.id === recoveredFocus.taskId), recoveredFocus.clock);
