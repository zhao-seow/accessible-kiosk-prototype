import { useRef, type RefObject } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, moneySpeech, type Copy } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

// Each line is keyboard-focusable so users can Tab through and hear it read; the
// amount is spoken in words (e.g. "45 dollars") rather than "$". When a line
// finishes reading it auto-advances focus to the next item, so the whole bill is
// read in sequence down to the "Select payment method" prompt.
function BillRow({
  label,
  value,
  muted,
  t,
  emphasis,
  selfRef,
  nextRef,
}: {
  label: string;
  value: string;
  muted?: boolean;
  t: Copy;
  emphasis?: boolean;
  selfRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLElement | null>;
}) {
  // Advance only if this row is still the focused element when speech ends, so
  // manual navigation (or hovering to read) never hijacks the user's focus.
  const advance = () => {
    if (document.activeElement === selfRef.current) nextRef.current?.focus();
  };
  const read = useReadAloud(`${label}, ${moneySpeech(value, t)}`, "static", { onEnd: advance });
  return (
    <div
      ref={selfRef}
      tabIndex={0}
      onFocus={read.start}
      onBlur={read.stop}
      onPointerEnter={read.start}
      className={[
        "flex items-baseline justify-between gap-6 rounded-lg py-3 outline-none",
        read.readingClass,
      ].join(" ")}
    >
      <span
        className={[
          emphasis ? "font-display text-2xl font-bold text-foreground" : "text-xl",
          !emphasis && muted ? "text-success" : !emphasis ? "text-muted-foreground" : "",
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "font-display font-semibold tabular-nums",
          emphasis ? "text-4xl font-bold text-primary" : "text-2xl",
          !emphasis && muted ? "text-success" : !emphasis ? "text-foreground" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

export function BranchB1Payment() {
  const { goTo, setPaymentMethod, t } = useKiosk();
  const pay = (method: string) => {
    setPaymentMethod(method);
    goTo("paymentInstructions");
  };

  // Refs form the guided read chain: consultation → medication → subsidy → total
  // → "Select payment method" prompt, which is where the auto-read stops.
  const consultRef = useRef<HTMLDivElement>(null);
  const medRef = useRef<HTMLDivElement>(null);
  const subsidyRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLParagraphElement>(null);

  // The prompt reads a Tab instruction and does NOT auto-advance (chain stops here).
  const methodRead = useReadAloud(t.b1MethodSpeech, "static");

  return (
    <KioskChrome title={t.b1Title} announce={t.b1Announce}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8">
        <div className="rounded-2xl border border-border bg-card p-8">
          <BillRow label={t.b1LineConsultation} value={SESSION.bill.consultation} t={t} selfRef={consultRef} nextRef={medRef} />
          <BillRow label={t.b1LineMedication} value={SESSION.bill.medication} t={t} selfRef={medRef} nextRef={subsidyRef} />
          <BillRow label={t.b1LineSubsidy} value={SESSION.bill.subsidy} muted t={t} selfRef={subsidyRef} nextRef={totalRef} />
          <div className="my-2 h-px w-full bg-border" />
          <BillRow label={t.b1Total} value={SESSION.bill.total} emphasis t={t} selfRef={totalRef} nextRef={methodRef} />
        </div>

        <div>
          <p
            ref={methodRef}
            tabIndex={0}
            onFocus={methodRead.start}
            onBlur={methodRead.stop}
            onPointerEnter={methodRead.start}
            className={["mb-4 rounded-lg text-2xl font-semibold text-foreground outline-none", methodRead.readingClass].join(" ")}
          >
            {t.b1MethodHeading}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ActionCard optionIndex={1} optionCount={2} icon="credit" title={t.b1Credit} desc={t.b1CreditDesc} speech={`${t.asButton(t.b1Credit)} ${t.pressEnterTo(t.b1CreditAction)}`} onSelect={() => pay("credit")} />
            <ActionCard optionIndex={2} optionCount={2} icon="paynow" title={t.b1PayNow} desc={t.b1PayNowDesc} speech={`${t.asButton(t.b1PayNow)} ${t.pressEnterTo(t.b1PayNowAction)}`} onSelect={() => pay("paynow")} />
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
