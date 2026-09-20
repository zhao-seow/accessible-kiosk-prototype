import { useReadAloud } from "../hooks/useSpeech";
import { useTapGuard } from "../hooks/useMotorFilters";

interface ChoiceButtonProps {
  label: string;
  speech: string;
  onSelect: () => void;
  selected?: boolean;
  tone?: "primary" | "neutral";
}

export function ChoiceButton({ label, speech, onSelect, selected, tone = "neutral" }: ChoiceButtonProps) {
  const { start, stop, readingClass } = useReadAloud(speech, "interactive");
  const guarded = useTapGuard(onSelect);

  return (
    <button
      type="button"
      onFocus={start}
      onBlur={stop}
      onPointerEnter={start}
      onClick={(e) => guarded(e)}
      aria-pressed={selected}
      className={[
        "flex items-center justify-center w-full rounded-2xl border-2 font-display font-semibold",
        "min-h-[7rem] px-8 text-3xl transition-all duration-150 outline-none",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(33,32,29,0.4)]",
        selected || tone === "primary"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary-soft",
        readingClass,
      ].join(" ")}
    >
      {label}
    </button>
  );
}
