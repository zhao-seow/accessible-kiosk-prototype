import { useEffect, useRef, useState, type ReactNode } from "react";
import { useKiosk } from "../kiosk/KioskContext";
import { hasBack } from "../kiosk/steps";
import { Icon, type IconName } from "./Icons";
import { VoiceGuideToggle } from "./VoiceGuideToggle";
import { useReadAloud, useSpeech } from "../hooks/useSpeech";

interface KioskChromeProps {
  title?: string;
  // Optional spoken override for the title (e.g. a warmer greeting than the
  // displayed heading). Falls back to the displayed `title` when omitted.
  titleSpeech?: string;
  announce?: string;
  // Optional page contents spoken after the title and before focus jumps to the
  // first content element. Used by pages that need the details read aloud first
  // (e.g. the check-in summary: appointment time, clinic, queue number).
  intro?: string;
  headerLeft?: ReactNode;
  children: ReactNode;
}

function FooterButton({
  label,
  speech,
  icon,
  onClick,
  emphasis,
}: {
  label: string;
  speech: string;
  icon?: IconName;
  onClick: () => void;
  emphasis?: boolean;
}) {
  const { start, stop, readingClass } = useReadAloud(speech, "interactive");
  return (
    <button
      type="button"
      onFocus={start}
      onBlur={stop}
      onPointerEnter={start}
      onClick={onClick}
      className={[
        "inline-flex items-center gap-3 rounded-full border-2 px-6 py-3.5 text-xl font-semibold transition-all duration-150 outline-none",
        emphasis
          ? "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary-soft"
          : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
        readingClass,
      ].join(" ")}
    >
      {icon ? <Icon name={icon} className="w-7 h-7" /> : null}
      {label}
    </button>
  );
}

export function KioskChrome({ title, titleSpeech, intro, headerLeft, children }: KioskChromeProps) {
  const { step, back, startOver, requestHelp, voiceGuide, t } = useKiosk();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const { speak } = useSpeech();
  const [reading, setReading] = useState(false);

  // Speak only the title's displayed text (spec: title reads its label, not the
  // full instructions). Runs onDone once speech finishes.
  const speakTitle = (onDone?: () => void) => {
    if (!title) return false;
    return speak(titleSpeech ?? title, {
      onStart: () => setReading(true),
      onEnd: () => {
        setReading(false);
        onDone?.();
      },
      onError: () => {
        setReading(false);
        onDone?.();
      },
    });
  };

  // Move focus to the first focusable content element in <main> (the question or
  // first control), which then reads itself.
  const focusFirstContent = () => {
    const main = mainRef.current;
    if (!main) return;
    const focusables = main.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const target = Array.from(focusables).find((el) => el !== headingRef.current);
    target?.focus();
  };

  // Heading-first focus + entry announcement. When Voice Guide is on, read the
  // title, then automatically move focus to the content and read the question.
  useEffect(() => {
    if (!title) return;
    headingRef.current?.focus({ preventScroll: true });
    if (voiceGuide) {
      // Read the title, then jump focus to the first content element (which reads
      // itself). The debounce in the controller collapses this with the onFocus
      // call triggered by focusing the heading above, so the title speaks once.
      // If the page supplies `intro`, read those contents first, then jump focus.
      speakTitle(() => {
        if (intro) {
          speak(intro, {
            onEnd: () => focusFirstContent(),
            onError: () => focusFirstContent(),
          });
        } else {
          focusFirstContent();
        }
      });
    }
    return () => setReading(false);
    // Re-run whenever we land on a new screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-start justify-between gap-6 border-b border-border px-10 pt-5 pb-4">
        {/* Voice Guide stays first in DOM (before the H1 in <main>) so Shift+Tab from
            the heading moves up into it (spec §5.2). */}
        <div className="min-w-0">{headerLeft}</div>
        <div className="shrink-0">
          <VoiceGuideToggle />
        </div>
      </header>

      <main ref={mainRef} className="flex flex-1 flex-col overflow-y-auto px-10 py-5">
        {title ? (
          <h1
            ref={headingRef}
            tabIndex={0}
            onFocus={() => speakTitle()}
            className={[
              "mb-5 font-display text-5xl font-bold leading-tight text-foreground outline-none",
              reading ? "is-speech-reading" : "",
            ].join(" ")}
          >
            {title}
          </h1>
        ) : null}
        {children}
      </main>

      <footer className="flex items-center justify-between gap-4 border-t border-border px-10 py-4">
        <div>
          {hasBack(step) ? (
            <FooterButton label={t.back} icon="back" speech={`${t.back}, button. Press Enter to return to the previous screen.`} onClick={back} />
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <FooterButton
            label={t.callHelp}
            icon="help"
            emphasis
            speech={t.callHelpAnnounce}
            onClick={requestHelp}
          />
          <FooterButton
            label={t.startOver}
            emphasis
            speech={t.startOverAnnounce}
            onClick={() => {
              window.speechSynthesis?.cancel();
              startOver();
            }}
          />
        </div>
      </footer>
    </div>
  );
}
