import { useMemo, useSyncExternalStore } from "react";

/**
 * Tiny progress store. A chapter is "completed" once the learner reaches the
 * end of it. Persisted in localStorage so progress survives reloads.
 *
 * Unlock rule: chapter 1 is always open; every other chapter unlocks once the
 * one before it is completed (i.e. "unlocked = completed, or the next one").
 */

const KEY = "netacademy:completed";

const listeners = new Set<() => void>();

function read(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function markComplete(n: number): void {
  const set = new Set(read());
  if (set.has(n)) return;
  set.add(n);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set].sort((a, b) => a - b)));
  } catch {
    /* ignore quota / private-mode errors */
  }
  listeners.forEach((l) => l());
}

export function isUnlocked(n: number, completed: Set<number>): boolean {
  return n === 1 || completed.has(n - 1) || completed.has(n);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function snapshot(): string {
  return localStorage.getItem(KEY) ?? "";
}

/** Reactive set of completed chapter numbers. */
export function useCompleted(): Set<number> {
  const raw = useSyncExternalStore(subscribe, snapshot, snapshot);
  return useMemo<Set<number>>(() => new Set(raw ? (JSON.parse(raw) as number[]) : []), [raw]);
}
