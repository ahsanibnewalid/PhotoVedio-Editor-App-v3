import { useCallback, useRef, useState } from 'react';

const MAX_HISTORY_LIMIT = 35;

export function useTimelineHistory<T>(initialState: T) {
  const [present, setPresent] = useState<T>(initialState);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);

  const commit = useCallback((next: T | ((prev: T) => T)) => {
    setPresent(prev => {
      const value = typeof next === 'function' ? (next as (p:T)=>T)(prev) : next;
      past.current = [...past.current.slice(-(MAX_HISTORY_LIMIT - 1)), prev];
      future.current = [];
      return value;
    });
  }, []);
  const undo = useCallback(() => { const previous = past.current.pop(); if (previous === undefined) return; setPresent(current => { future.current.push(current); return previous; }); }, []);
  const redo = useCallback(() => { const next = future.current.pop(); if (next === undefined) return; setPresent(current => { past.current.push(current); return next; }); }, []);
  return { state: present, setState: commit, undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 };
}
