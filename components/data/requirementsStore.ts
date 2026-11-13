import { useSyncExternalStore } from 'react';
import { MVP_REQUIREMENTS, type MvpRequirement } from './mvpRequirements';

// Small store so the Requirements and Requirement Tasks pages share one dataset.
// The demo keeps its requirements in this browser (localStorage), so a link opened in a new tab or from an email
// finds requirements created during a demo. Open any page with ?resetDemo=1 to go back to the seed data.
const KEY = 'tm.requirements.v1';

function load(): MvpRequirement[] {
  try {
    if (new URLSearchParams(window.location.search).get('resetDemo') === '1') {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem('tm.assessmentState.v1');
      const u = new URL(window.location.href); u.searchParams.delete('resetDemo');
      window.history.replaceState({}, '', u.pathname + u.search + u.hash);
      return MVP_REQUIREMENTS;
    }
    const v = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    return Array.isArray(v) && v.length ? v : MVP_REQUIREMENTS;
  } catch {
    return MVP_REQUIREMENTS;
  }
}
function save(list: MvpRequirement[]) {
  try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable: the demo still works for this page */ }
}

let rows: MvpRequirement[] = load();
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
};

export function setRequirements(next: MvpRequirement[] | ((prev: MvpRequirement[]) => MvpRequirement[])) {
  rows = typeof next === 'function' ? next(rows) : next;
  save(rows);
  listeners.forEach((l) => l());
}

export function useRequirements(): [MvpRequirement[], typeof setRequirements] {
  const snapshot = useSyncExternalStore(subscribe, () => rows);
  return [snapshot, setRequirements];
}
