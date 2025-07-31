/* Generic helper to handle add/remove in a Set — reusable */
"use client";
import { useCallback, useState } from "react";

export default function useToggle<T = unknown>() {
  const [map, setMap] = useState<Record<string, T[]>>({});

  const isActive = useCallback(
    (key: string, val: T) => (map[key] ?? []).includes(val),
    [map],
  );

  const toggle = useCallback((key: string, val: T) => {
    setMap(prev => {
      const set = new Set(prev[key] ?? []);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...prev, [key]: Array.from(set) };
    });
  }, []);

  return { map, setMap, isActive, toggle };
}
