import { KioskChrome } from "../components/KioskChrome";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandDateForSpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";
import { useTapGuard } from "../hooks/useMotorFilters";

function OptionCard({ index, total, onSelect }: { index: number; total: number; onSelect: () => void }) {
  const { t, followUp } = useKiosk();
  const slot = SESSION.followUp[index];
  const selected = followUp === index;
  const labSpeech = expandDateForSpeech(slot.lab);
  const speech = `${t.optionOf(index + 1, total)}${t.b2LabLabel}: ${labSpeech}. ${t.asButton(t.b2Select(index + 1))} ${t.pressEnterTo(t.b2BookAction)}`;
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
        "flex w-full flex-col rounded-2xl border-2 bg-card p-5 text-left transition-all duration-150 outline-none",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(33,32,29,0.4)]",
        selected ? "border-primary bg-primary-soft" : "border-border hover:border-primary hover:bg-primary-soft",
        readingClass,
      ].join(" ")}
    >
      <span className="font-display text-2xl font-bold text-foreground">{t.b2Option(index + 1)}</span>
      <span className="my-3 h-px w-full bg-border" />
      <span className="flex items-start gap-3">
        <Icon name="flask" className="mt-1 h-6 w-6 shrink-0 text-primary" />
        <span>
          <span className="block text-base font-semibold text-muted-foreground">{t.b2LabLabel}</span>
          <span className="block text-xl font-semibold text-foreground mt-0.5">{slot.lab}</span>
        </span>
      </span>
      <span
        className={[
          "mt-5 inline-flex items-center justify-center rounded-xl px-5 py-3 text-lg font-semibold",
          selected ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
        ].join(" ")}
      >
        {t.b2Select(index + 1)}
      </span>
    </button>
  );
}

export function BranchB2FollowUp() {
  const { goTo, setFollowUp, t } = useKiosk();
  const pick = (i: number) => {
    setFollowUp(i);
    goTo("thankYou");
  };
  const skipFollowUp = () => {
    setFollowUp(null);
    goTo("thankYou");
  };
  const noteRead = useReadAloud(`${t.b2Note} ${t.b2NoteInstruction}`, "static");
  const skip = useReadAloud(`${t.asButton(t.b2Skip)} ${t.pressEnterTo(t.b2SkipAction)}`, "interactive");

  return (
    <KioskChrome title={t.b2Title} announce={t.b2Announce}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-5">
        <p
          tabIndex={0}
          onFocus={noteRead.start}
          onBlur={noteRead.stop}
          onPointerEnter={noteRead.start}
          className={["flex items-center gap-3 rounded-xl bg-success-soft px-5 py-2.5 text-xl font-semibold text-success outline-none", noteRead.readingClass].join(" ")}
        >
          <Icon name="check" className="h-6 w-6 shrink-0" />
          {t.b2Note}
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {SESSION.followUp.map((_, i) => (
            <OptionCard key={i} index={i} total={SESSION.followUp.length} onSelect={() => pick(i)} />
          ))}
        </div>
        <button
          type="button"
          onFocus={skip.start}
          onBlur={skip.stop}
          onPointerEnter={skip.start}
          onClick={skipFollowUp}
          className={[
            "mx-auto rounded-full border-2 border-border bg-card px-8 py-3.5 text-xl font-semibold text-muted-foreground outline-none transition-colors hover:border-primary hover:text-foreground",
            skip.readingClass,
          ].join(" ")}
        >
          {t.b2Skip}
        </button>
      </div>
    </KioskChrome>
  );
}
