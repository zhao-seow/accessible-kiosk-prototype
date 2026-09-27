import { useRef, useState, type RefObject } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, moneySpeech, type Copy } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

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
        "flex items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 outline-none transition-all duration-150 cursor-pointer hover:bg-muted/30",
        read.readingClass,
      ].join(" ")}
    >
      <span
        className={[
          emphasis ? "font-display text-2xl font-bold text-foreground" : "text-lg font-semibold",
          muted ? "text-success font-semibold" : "text-foreground",
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "font-display font-semibold tabular-nums",
          emphasis ? "text-3xl font-bold text-foreground" : "text-xl",
          muted ? "text-success font-semibold" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function MedSubItem({
  item,
  t,
  selfRef,
  nextRef,
}: {
  item: { name: string; qty: string; price: string };
  t: Copy;
  selfRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLElement | null>;
}) {
  const advance = () => {
    if (document.activeElement === selfRef.current) nextRef.current?.focus();
  };
  const speech = `${item.name}, ${item.qty}, ${moneySpeech(item.price, t)}`;
  const read = useReadAloud(speech, "static", { onEnd: advance });

  return (
    <div
      ref={selfRef}
      tabIndex={0}
      onFocus={read.start}
      onBlur={read.stop}
      onPointerEnter={read.start}
      className={[
        "flex items-center justify-between gap-4 rounded-xl py-2 px-3 pl-8 text-left outline-none transition-all duration-150 cursor-pointer bg-card/60 hover:bg-muted/40",
        read.readingClass,
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon name="pill" className="h-5 w-5 shrink-0 text-primary/70" />
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground truncate">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.qty}</p>
        </div>
      </div>
      <span className="font-display text-lg font-semibold tabular-nums text-foreground shrink-0">
        {item.price}
      </span>
    </div>
  );
}

export function BranchB1Payment() {
  const { goTo, setPaymentMethod, voiceGuide, t } = useKiosk();
  // If voice guide is ON, accordion starts collapsed. If voice guide is OFF, starts open by default.
  const [medsOpen, setMedsOpen] = useState(!voiceGuide);

  const pay = (method: string) => {
    setPaymentMethod(method);
    goTo("paymentInstructions");
  };

  // Refs form the guided auto-read chain:
  // Consultation -> Medication Summary Header -> (if open: Med 0 -> Med 1 -> Med 2) -> Subsidy
  // -> Total Amount Due -> "Select payment method" prompt (stops here).
  const consultRef = useRef<HTMLDivElement>(null);
  const medHeaderRef = useRef<HTMLButtonElement>(null);
  const med0Ref = useRef<HTMLDivElement>(null);
  const med1Ref = useRef<HTMLDivElement>(null);
  const med2Ref = useRef<HTMLDivElement>(null);
  const subsidyRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLParagraphElement>(null);

  const advanceFromMedHeader = () => {
    if (document.activeElement === medHeaderRef.current) {
      if (medsOpen && med0Ref.current) {
        med0Ref.current.focus();
      } else {
        subsidyRef.current?.focus();
      }
    }
  };

  const medHeaderSpeech = `${t.b1LineMedication}, ${moneySpeech(SESSION.bill.medication, t)}. ${t.b1MedAccordionSpeech(medsOpen, SESSION.bill.medications.length)}`;
  const medHeaderRead = useReadAloud(medHeaderSpeech, "static", { onEnd: advanceFromMedHeader });

  const advanceFromTotal = () => {
    if (document.activeElement === totalRef.current) methodRef.current?.focus();
  };
  const totalSpeech = `${t.b1Total}, ${moneySpeech(SESSION.bill.total, t)}.`;
  const totalRead = useReadAloud(totalSpeech, "static", { onEnd: advanceFromTotal });

  const methodRead = useReadAloud(t.b1MethodSpeech, "static");

  return (
    <KioskChrome title={t.b1Title} announce={t.b1Announce}>
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Itemized Bill with Accordion (7 cols) */}
        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 lg:col-span-7">
          <BillRow
            label={t.b1LineConsultation}
            value={SESSION.bill.consultation}
            t={t}
            selfRef={consultRef}
            nextRef={medHeaderRef}
          />

          <div className="my-1.5 h-px w-full bg-border/60" />

          {/* Medication Summary Accordion Row */}
          <button
            ref={medHeaderRef}
            type="button"
            aria-expanded={medsOpen}
            onClick={() => setMedsOpen((prev) => !prev)}
            onFocus={medHeaderRead.start}
            onBlur={medHeaderRead.stop}
            onPointerEnter={medHeaderRead.start}
            className={[
              "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left outline-none transition-all duration-150 cursor-pointer hover:bg-muted/30",
              medHeaderRead.readingClass,
            ].join(" ")}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                name="chevron"
                className={[
                  "h-5 w-5 text-primary transition-transform duration-200",
                  medsOpen ? "rotate-90" : "rotate-0",
                ].join(" ")}
              />
              <div>
                <span className="text-lg font-medium text-foreground">
                  {t.b1LineMedication}
                </span>
                <span className="ml-2.5 inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-3 py-0.5 text-xs font-bold text-primary">
                  {t.b1MedItemsCount(SESSION.bill.medications.length)}
                </span>
              </div>
            </div>
            <span className="font-display text-xl font-semibold tabular-nums text-foreground">
              {SESSION.bill.medication}
            </span>
          </button>

          {/* Collapsible Medication Items */}
          {medsOpen ? (
            <div className="flex flex-col gap-1 py-1">
              <MedSubItem
                item={SESSION.bill.medications[0]}
                t={t}
                selfRef={med0Ref}
                nextRef={med1Ref}
              />
              <MedSubItem
                item={SESSION.bill.medications[1]}
                t={t}
                selfRef={med1Ref}
                nextRef={med2Ref}
              />
              <MedSubItem
                item={SESSION.bill.medications[2]}
                t={t}
                selfRef={med2Ref}
                nextRef={subsidyRef}
              />
            </div>
          ) : null}

          <div className="my-1.5 h-px w-full bg-border/60" />

          <BillRow
            label={t.b1LineSubsidy}
            value={SESSION.bill.subsidy}
            muted
            t={t}
            selfRef={subsidyRef}
            nextRef={totalRef}
          />
        </div>

        {/* Right Column: Total Due & Payment Methods (5 cols) */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Total Amount Due Card */}
          <div
            ref={totalRef}
            tabIndex={0}
            onFocus={totalRead.start}
            onBlur={totalRead.stop}
            onPointerEnter={totalRead.start}
            className={[
              "flex flex-col justify-center rounded-2xl border-2 border-primary/30 bg-primary-soft p-6 text-left outline-none transition-all duration-150 cursor-pointer shadow-xs",
              totalRead.readingClass,
            ].join(" ")}
          >
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              {t.b1Total}
            </span>
            <span className="font-display text-5xl font-extrabold text-foreground mt-1 tabular-nums">
              {SESSION.bill.total}
            </span>
          </div>

          {/* Payment Method Section */}
          <div className="flex flex-col">
            <p
              ref={methodRef}
              tabIndex={0}
              onFocus={methodRead.start}
              onBlur={methodRead.stop}
              onPointerEnter={methodRead.start}
              className={[
                "mb-2.5 rounded-lg text-lg font-bold text-foreground outline-none transition-all duration-150",
                methodRead.readingClass,
              ].join(" ")}
            >
              {t.b1MethodHeading}
            </p>

            <div className="flex flex-col gap-3">
              <ActionCard
                optionIndex={1}
                optionCount={2}
                icon="credit"
                title={t.b1Credit}
                desc={t.b1CreditDesc}
                speech={`${t.asButton(t.b1Credit)} ${t.pressEnterTo(t.b1CreditAction)}`}
                onSelect={() => pay("credit")}
              />
              <ActionCard
                optionIndex={2}
                optionCount={2}
                icon="paynow"
                title={t.b1PayNow}
                desc={t.b1PayNowDesc}
                speech={`${t.asButton(t.b1PayNow)} ${t.pressEnterTo(t.b1PayNowAction)}`}
                onSelect={() => pay("paynow")}
              />
            </div>
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
