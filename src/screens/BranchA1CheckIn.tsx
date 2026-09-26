import { useRef, type RefObject } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandPhoneForSpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

function SummaryRow({
  label,
  value,
  speech,
  selfRef,
  nextRef,
}: {
  label: string;
  value: string;
  speech: string;
  selfRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLElement | null>;
}) {
  const advance = () => {
    if (document.activeElement === selfRef.current) nextRef.current?.focus();
  };
  const read = useReadAloud(speech, "static", { onEnd: advance });

  return (
    <div
      ref={selfRef}
      tabIndex={0}
      onFocus={read.start}
      onBlur={read.stop}
      onPointerEnter={read.start}
      className={[
        "flex items-baseline justify-between gap-6 rounded-xl px-4 py-3 outline-none transition-all duration-150 cursor-pointer",
        read.readingClass,
      ].join(" ")}
    >
      <span className="text-xl text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

export function BranchA1CheckIn() {
  const { goTo, setPaymentMethod, setTicketDelivery, t } = useKiosk();
  const finish = (mode: "sms" | "print") => {
    setTicketDelivery(mode);
    setPaymentMethod(mode);
    goTo("receipt");
  };

  const queueRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const clinicRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLParagraphElement>(null);

  // Guided auto-read chain: Queue Number -> Time -> Clinic -> "Get your queue ticket:"
  const advanceFromQueue = () => {
    if (document.activeElement === queueRef.current) timeRef.current?.focus();
  };
  const queueSpeech = `${t.a1QueueLabel}: ${SESSION.queueNumber}.`;
  const queueRead = useReadAloud(queueSpeech, "static", { onEnd: advanceFromQueue });

  // The delivery heading is keyboard-focusable and stops the guided chain here
  const deliveryRead = useReadAloud(`${t.a1DeliveryHeading} ${t.a1DeliveryInstruction}`, "static");

  return (
    <KioskChrome title={t.a1Title} announce={t.a1Announce}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Queue Number (Left) */}
          <div
            ref={queueRef}
            tabIndex={0}
            onFocus={queueRead.start}
            onBlur={queueRead.stop}
            onPointerEnter={queueRead.start}
            className={[
              "flex flex-col items-center justify-center rounded-2xl bg-primary p-6 text-primary-foreground outline-none transition-all duration-150 cursor-pointer min-h-[10rem]",
              queueRead.readingClass,
            ].join(" ")}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.16em] opacity-90 text-center">
              {t.a1QueueLabel}
            </span>
            <span className="font-display text-5xl font-bold mt-2">
              {SESSION.queueNumber}
            </span>
          </div>

          {/* Time & Clinic Appointment Details (Right) */}
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-4 md:col-span-2">
            <SummaryRow
              selfRef={timeRef}
              nextRef={clinicRef}
              label={t.a1TimeLabel}
              value={SESSION.apptTime}
              speech={`${t.a1TimeLabel}: ${SESSION.apptTime}.`}
            />
            <div className="my-1 h-px w-full bg-border" />
            <SummaryRow
              selfRef={clinicRef}
              nextRef={deliveryRef}
              label={t.a1ClinicLabel}
              value={SESSION.apptClinic}
              speech={`${t.a1ClinicLabel}: ${SESSION.apptClinic}.`}
            />
          </div>
        </div>

        <div>
          <p
            ref={deliveryRef}
            tabIndex={0}
            onFocus={deliveryRead.start}
            onBlur={deliveryRead.stop}
            onPointerEnter={deliveryRead.start}
            className={[
              "mb-4 flex items-center gap-3 rounded-lg text-2xl font-semibold text-foreground outline-none",
              deliveryRead.readingClass,
            ].join(" ")}
          >
            <Icon name="clock" className="h-7 w-7 text-primary" />
            {t.a1DeliveryHeading}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ActionCard
              optionIndex={1}
              optionCount={2}
              icon="mobile"
              title={t.a1SmsTitle}
              desc={t.a1SmsDesc}
              speech={`${t.asButton(t.a1SmsTitle)}${t.toMobileNumber(expandPhoneForSpeech(SESSION.mobile))} ${t.pressEnterTo(t.a1SmsAction)}`}
              onSelect={() => finish("sms")}
            />
            <ActionCard
              optionIndex={2}
              optionCount={2}
              icon="printer"
              title={t.a1PrintTitle}
              desc={t.a1PrintDesc}
              speech={`${t.asButton(t.a1PrintTitle)} ${t.pressEnterTo(t.a1PrintAction)}`}
              onSelect={() => finish("print")}
            />
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
