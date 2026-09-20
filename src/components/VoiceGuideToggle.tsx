import { useKiosk } from "../kiosk/KioskContext";
import { Icon } from "./Icons";
import { useSpeech, useReadAloud } from "../hooks/useSpeech";

export function VoiceGuideToggle() {
  const { voiceGuide, toggleVoiceGuide, lang, t } = useKiosk();
  const { speak } = useSpeech();
  const status = voiceGuide ? t.on : t.off;
  const speech = `${t.voiceGuide}: ${status}. ${voiceGuide ? t.vgTurnOff : t.vgTurnOn}`;
  // Always announce — this is the entry point to the assistive layer, so it must
  // speak even while Voice Guide is currently off (spec §1.2 / §2.1), in the
  // currently-selected language's voice.
  const { start, stop, readingClass } = useReadAloud(speech, "interactive", { always: true, lang });

  const handleToggle = () => {
    window.speechSynthesis?.cancel();
    const next = !voiceGuide;
    toggleVoiceGuide();
    // Announce the new state before moving on — focus stays put (this toggle
    // isn't a target of chained auto-focus elsewhere), so the normal onFocus
    // speech won't re-fire on its own since focus never moved.
    speak(`${t.voiceGuide}: ${next ? t.on : t.off}.`, { force: true, priority: true, lang });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={voiceGuide}
      aria-label={`${t.voiceGuide}: ${status}`}
      onFocus={start}
      onBlur={stop}
      onClick={handleToggle}
      className={[
        "inline-flex items-center gap-3 rounded-full border-2 px-5 py-3 font-semibold transition-all duration-150 outline-none",
        voiceGuide
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:border-primary",
        readingClass,
      ].join(" ")}
    >
      <Icon name="speaker" className="w-7 h-7" />
      <span className="text-lg">
        {t.voiceGuide}: {status}
      </span>
    </button>
  );
}
