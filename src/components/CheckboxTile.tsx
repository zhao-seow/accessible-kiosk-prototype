import { useState } from "react";
import { Icon } from "./Icons";
import { useSpeech } from "../hooks/useSpeech";
import { useTapGuard } from "../hooks/useMotorFilters";
import { useKiosk } from "../kiosk/KioskContext";

interface CheckboxTileProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckboxTile({ label, checked, onToggle }: CheckboxTileProps) {
  const { speak } = useSpeech();
  const { t } = useKiosk();
  const [reading, setReading] = useState(false);

  // Speak "<label>, checkbox, checked/unchecked. Press Space to toggle." — speak()
  // calls speechSynthesis.cancel() first, so a state change mid-announcement
  // interrupts the previous one and reads the new state immediately (not "polite").
  const announce = (isChecked: boolean) => {
    speak(`${t.checkboxState(label, isChecked)} ${t.pressSpaceToToggle}`, {
      onStart: () => setReading(true),
      onEnd: () => setReading(false),
      onError: () => setReading(false),
    });
  };

  const toggle = () => {
    // Announce the state we are switching to (the opposite of the current one).
    announce(!checked);
    onToggle();
  };
  const guarded = useTapGuard(toggle);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onFocus={() => announce(checked)}
      onBlur={() => setReading(false)}
      onPointerEnter={() => announce(checked)}
      onClick={(e) => guarded(e)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className={[
        "flex items-center gap-5 w-full rounded-2xl border-2 bg-card px-6 py-5 text-left",
        "min-h-[5.5rem] transition-all duration-150 outline-none",
        checked ? "border-primary bg-primary-soft" : "border-border hover:border-primary hover:bg-primary-soft",
        reading ? "is-active-reading" : "",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center w-11 h-11 rounded-lg border-2 shrink-0 transition-colors",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-transparent",
        ].join(" ")}
      >
        <Icon name="check" className="w-7 h-7" />
      </span>
      <span className="font-display text-2xl font-semibold text-card-foreground">{label}</span>
    </button>
  );
}
