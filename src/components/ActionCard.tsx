import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icons";
import { useReadAloud } from "../hooks/useSpeech";
import { useTapGuard } from "../hooks/useMotorFilters";
import { useKiosk } from "../kiosk/KioskContext";

interface ActionCardProps {
  icon: IconName;
  title: string;
  desc?: ReactNode;
  badge?: string;
  speech: string;
  onSelect: () => void;
  selected?: boolean;
  large?: boolean;
  // Position within a card set (1-based). When both are set, the spoken text is
  // prefixed with "Option X of N:" so users know how many choices there are.
  optionIndex?: number;
  optionCount?: number;
}

export function ActionCard({ icon, title, desc, badge, speech, onSelect, selected, large, optionIndex, optionCount }: ActionCardProps) {
  const { t } = useKiosk();
  const fullSpeech =
    optionIndex && optionCount ? `${t.optionOf(optionIndex, optionCount)}${speech}` : speech;
  const { start, stop, readingClass } = useReadAloud(fullSpeech, "interactive");
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
        "group flex flex-col items-start text-left w-full rounded-2xl border-2 bg-card",
        "transition-all duration-150 outline-none",
        large ? "px-8 py-8 min-h-[11rem] gap-5" : "px-8 py-7 min-h-[7rem] gap-3",
        selected ? "border-primary bg-primary-soft" : "border-border hover:border-primary hover:bg-primary-soft",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(33,32,29,0.4)]",
        readingClass,
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center rounded-2xl shrink-0",
          large ? "w-16 h-16" : "w-14 h-14",
          selected ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        ].join(" ")}
      >
        <Icon name={icon} className={large ? "w-9 h-9" : "w-8 h-8"} />
      </span>
      <span className="flex flex-col gap-2">
        <span className={["font-display font-semibold leading-tight text-card-foreground", large ? "text-3xl" : "text-2xl"].join(" ")}>
          {title}
        </span>
        {desc ? <span className={["text-muted-foreground leading-snug", large ? "text-xl" : "text-lg"].join(" ")}>{desc}</span> : null}
      </span>
      {badge ? (
        <span className={["mt-auto inline-flex items-center rounded-full bg-warning-soft font-semibold text-warning", large ? "px-5 py-2 text-xl" : "px-4 py-1.5 text-lg"].join(" ")}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}
