import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, debounceMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, debounceMs);
    return () => clearTimeout(id);
  }, [value]);

  return debounced;
}
