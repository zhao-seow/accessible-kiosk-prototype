import { useEffect, useRef } from "react";
import { useKiosk } from "../kiosk/KioskContext";

/**
 * Global keyboard behaviour (spec §2.2):
 *  - Escape (single): silence ongoing speech.
 *  - Escape twice within 1s: deactivate Voice Guide entirely.
 */
export function useGlobalKeyboard(onVoiceGuideOff: () => void) {
  const { voiceGuide } = useKiosk();
  const lastEsc = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.speechSynthesis?.cancel();
        const now = Date.now();
        if (voiceGuide && now - lastEsc.current < 1000) {
          onVoiceGuideOff();
          lastEsc.current = 0;
        } else {
          lastEsc.current = now;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [voiceGuide, onVoiceGuideOff]);
}
