import { useEffect, useRef } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { LANGUAGES, type Lang } from "../kiosk/i18n";
import { useReadAloud, useSpeech } from "../hooks/useSpeech";

// Per-language on-focus announcements, each spoken in its own language's voice.
// English carries the screen-level "please select your language" lead-in.
function langAnnounce(code: Lang, selected: boolean): string {
  switch (code) {
    case "en":
      return `Please select your language. English, ${selected ? "currently selected. " : ""}Press Enter to select. Press Tab to move to the next language.`;
    case "zh":
      return `中文, chinese, 按钮。${selected ? "已选择。" : ""}按 Enter 键选择。`;
    case "ms":
      return `Bahasa Melayu, Malay, butang. ${selected ? "sedang dipilih. " : ""}Tekan Enter untuk pilih.`;
    case "ta":
      return `தமிழ், Tamil, பொத்தான். ${selected ? "தற்போது தேர்ந்தெடுக்கப்பட்டது. " : ""}தேர்ந்தெடுக்க Enter-ஐ அழுத்தவும்.`;
  }
}

function LangButton({
  code,
  label,
  active,
  onSelect,
  buttonRef,
}: {
  code: Lang;
  label: string;
  active: boolean;
  onSelect: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  // Announce in this button's own language, not the active app language.
  const { start, stop, readingClass } = useReadAloud(langAnnounce(code, active), "interactive", { lang: code });
  return (
    <button
      ref={buttonRef}
      type="button"
      lang={code}
      onFocus={start}
      onBlur={stop}
      onPointerEnter={start}
      onClick={onSelect}
      aria-pressed={active}
      className={[
        "flex items-center justify-center rounded-2xl border-2 min-h-[6.5rem] px-6 font-display text-3xl font-semibold transition-all duration-150 outline-none",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary-soft",
        readingClass,
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function Step1Identify() {
  const { lang, setLang, nric, setNric, goTo, voiceGuide, t } = useKiosk();
  const { speak } = useSpeech();
  const inputRef = useRef<HTMLInputElement>(null);
  const englishBtnRef = useRef<HTMLButtonElement>(null);
  // Latest NRIC value for the window keydown handler (avoids stale closure).
  const nricRef = useRef(nric);
  nricRef.current = nric;

  // Announce each character as it is typed, and what was removed on backspace.
  // Interrupts any in-progress speech (the controller cancels before speaking).
  const prevNricRef = useRef(nric);
  useEffect(() => {
    const prev = prevNricRef.current;
    prevNricRef.current = nric;
    if (nric === prev) return;
    if (nric.length > prev.length) {
      // Added characters (usually one) — read the newly appended text.
      speak(nric.slice(prev.length).split("").join(" "));
    } else {
      // Deleted characters — announce what was removed.
      const removed = prev.slice(nric.length).split("").join(" ");
      speak(`${removed} ${t.s1Deleted}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nric]);

  // Announce in the currently-selected language so switching language updates the voiceover.
  const nricRead = useReadAloud(t.s1NricAnnounce, "interactive", { lang });
  const enterRead = useReadAloud(t.s1EnterAnnounce, "interactive", { lang });

  // Do NOT auto-focus anything on load. When Voice Guide is turned on, move focus
  // to the English language button so the assistive flow starts from language selection.
  useEffect(() => {
    if (voiceGuide) englishBtnRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceGuide]);

  // Type-to-fill: any alphanumeric key (typed or from the drop-scanner wedge) routes
  // into the NRIC field, even when it isn't focused yet. Enter / Shift / Tab / modifiers
  // are left alone so navigation and submission still work.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 || !/[a-zA-Z0-9]/.test(e.key)) return;
      if (document.activeElement === inputRef.current) return; // already typing in field
      e.preventDefault();
      setNric((nricRef.current + e.key).toUpperCase());
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setNric]);

  // No validation — pressing Enter always advances to the next screen.
  const submit = () => goTo("fork");

  const branding = (
    <div className="flex items-center gap-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Icon name="heart" className="h-9 w-9" />
      </span>
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground">{t.brandKicker}</p>
        <p className="font-display text-3xl font-bold text-foreground">{t.brandName}</p>
      </div>
    </div>
  );

  return (
    <KioskChrome headerLeft={branding}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8">
        <p className="text-2xl text-muted-foreground">{t.s1Instruction}</p>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {LANGUAGES.map((l) => (
            <LangButton
              key={l.code}
              code={l.code}
              label={l.label}
              active={lang === l.code}
              buttonRef={l.code === "en" ? englishBtnRef : undefined}
              onSelect={() => {
                setLang(l.code);
                // Selecting any language moves focus to the NRIC input for entry.
                // Defer to the next tick so React commits the new-language render first;
                // otherwise onFocus speaks the previously-selected language's announcement.
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
          ))}
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex flex-col items-center gap-5">
          <label htmlFor="nric" className="font-display text-2xl font-semibold tracking-wide text-foreground">
            {t.s1NricLabel}
          </label>
          <input
            id="nric"
            ref={inputRef}
            value={nric}
            onChange={(e) => setNric(e.target.value.toUpperCase())}
            onFocus={nricRead.start}
            onBlur={nricRead.stop}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            inputMode="text"
            autoComplete="off"
            aria-describedby="nric-hint"
            placeholder="S1234567A"
            className={[
              "w-full max-w-xl rounded-2xl border-2 bg-card px-8 py-4 text-center font-display text-5xl font-bold tracking-[0.3em] text-foreground outline-none transition-colors",
              nricRead.readingClass,
              "border-border focus:border-primary",
            ].join(" ")}
          />
          <p id="nric-hint" className="text-center text-xl text-muted-foreground">
            {t.s1NricHint}
          </p>

          {/* On-screen Enter button (spec: hardware Enter submits; this mirrors it for touch). */}
          <button
            type="button"
            onFocus={enterRead.start}
            onBlur={enterRead.stop}
            onPointerEnter={enterRead.start}
            onClick={submit}
            className={[
              "mt-1 inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-primary bg-primary px-10 py-4 font-display text-3xl font-semibold text-primary-foreground outline-none transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(33,32,29,0.4)]",
              enterRead.readingClass,
            ].join(" ")}
          >
            <Icon name="back" className="h-8 w-8 rotate-180" />
            Enter
          </button>
        </div>
      </div>
    </KioskChrome>
  );
}
