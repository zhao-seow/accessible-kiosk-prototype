import { useEffect } from "react";
import { useKiosk } from "../kiosk/KioskContext";
import { useSpeech } from "../hooks/useSpeech";
import { Icon } from "./Icons";

export function CallHelpBanner() {
  const { helpRequested, dismissHelp, t } = useKiosk();
  const { speak } = useSpeech();

  // Announce the banner the moment it appears. speak() cancels any in-progress
  // utterance first, so this interrupts and reads immediately — not a polite
  // aria-live region.
  useEffect(() => {
    if (helpRequested) speak(t.helpBanner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpRequested]);

  if (!helpRequested) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-4 border-b-2 border-warning bg-warning-soft px-6 py-4 text-warning">
      <Icon name="help" className="w-8 h-8 shrink-0" />
      <p className="text-xl font-semibold">{t.helpBanner}</p>
      <button
        type="button"
        onClick={dismissHelp}
        className="ml-2 rounded-full border-2 border-warning px-4 py-1.5 text-lg font-semibold outline-none hover:bg-warning hover:text-white"
      >
        OK
      </button>
    </div>
  );
}
