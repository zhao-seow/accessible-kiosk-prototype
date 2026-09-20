import { useCallback, useRef } from "react";

/**
 * Motor & tremor filters (spec §2.1):
 *  - Rapid multi-tap suppression: discard duplicate activations within 500ms at
 *    (nearly) the same coordinate.
 *  - Tremor debounce: touches within a 20px radius are treated as the same point.
 * Wrap a control's activation handler with the returned guard.
 */
export function useTapGuard(onActivate: () => void) {
  const last = useRef<{ t: number; x: number; y: number } | null>(null);

  return useCallback(
    (e?: { clientX?: number; clientY?: number }) => {
      const now = Date.now();
      const x = e?.clientX ?? 0;
      const y = e?.clientY ?? 0;
      const prev = last.current;
      if (prev) {
        const near = Math.hypot(x - prev.x, y - prev.y) <= 20;
        if (now - prev.t < 500 && near) return; // suppressed duplicate
      }
      last.current = { t: now, x, y };
      onActivate();
    },
    [onActivate],
  );
}
