import { useSyncExternalStore } from 'react';
import { MVP_REQUIREMENTS, type MvpRequirement } from './mvpRequirements';

// Tiny in-memory store so the Requirements and Requirement Tasks pages share one dataset.
let rows: MvpRequirement[] = MVP_REQUIREMENTS;
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
};

export function setRequirements(next: MvpRequirement[] | ((prev: MvpRequirement[]) => MvpRequirement[])) {
  rows = typeof next === 'function' ? next(rows) : next;
  listeners.forEach((l) => l());
}

export function useRequirements(): [MvpRequirement[], typeof setRequirements] {
  const snapshot = useSyncExternalStore(subscribe, () => rows);
  return [snapshot, setRequirements];
}
