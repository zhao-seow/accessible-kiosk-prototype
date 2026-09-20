import { useKiosk } from "../kiosk/KioskContext";
import { useReadAloud } from "../hooks/useSpeech";

interface QuestionTextProps {
  text: string;
  subtitle?: string;
  /** Spoken-only navigation hint appended after the question, e.g. "Press Tab to choose Yes or No." */
  instruction?: string;
}

/**
 * A keyboard-focusable question prompt. Being in the tab order lets users move
 * focus back onto the question to hear it (and its navigation hint) read again.
 * While spoken it shows the cyan static-text reading ring.
 */
export function QuestionText({ text, subtitle, instruction }: QuestionTextProps) {
  const { lang } = useKiosk();
  const speech = [text, instruction].filter(Boolean).join(" ");
  const { start, stop, readingClass } = useReadAloud(speech, "static", { lang });

  return (
    <div
      tabIndex={0}
      onFocus={start}
      onBlur={stop}
      onPointerEnter={start}
      className={["rounded-2xl outline-none", readingClass].join(" ")}
    >
      <p className="text-3xl font-semibold text-foreground">{text}</p>
      {subtitle ? <p className="mt-2 text-xl text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
