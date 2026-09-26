import { useRef } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandPhoneForSpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

export function ReceiptDelivery() {
  const { startOver, ticketDelivery, paymentMethod, voiceGuide, t } = useKiosk();
  const isSms = ticketDelivery === "sms" || paymentMethod === "sms";

  const queueRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);
  const startOverRef = useRef<HTMLButtonElement>(null);

  // Guided reading chain:
  // Title -> Queue Number -> SMS / Print Message -> Staff Guidance (if Voice Guide on) -> Start Over
  const advanceFromQueue = () => {
    if (document.activeElement === queueRef.current) messageRef.current?.focus();
  };
  const queueSpeech = `${t.rcQueueLabel}: ${SESSION.queueNumber}.`;
  const queueRead = useReadAloud(queueSpeech, "static", { onEnd: advanceFromQueue });

  const advanceFromMessage = () => {
    if (document.activeElement === messageRef.current) {
      if (voiceGuide && staffRef.current) {
        staffRef.current.focus();
      } else {
        startOverRef.current?.focus();
      }
    }
  };

  const messageSpeech = isSms
    ? t.rcSmsConfirm.replace(SESSION.mobile, expandPhoneForSpeech(SESSION.mobile))
    : t.rcPrintConfirm;
  const messageRead = useReadAloud(messageSpeech, "static", { onEnd: advanceFromMessage });

  const advanceFromStaff = () => {
    if (document.activeElement === staffRef.current) {
      startOverRef.current?.focus();
    }
  };
  const staffRead = useReadAloud(t.rcStaffGuidance, "static", { onEnd: advanceFromStaff });

  return (
    <KioskChrome title={t.rcTitle}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-7 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-xs">
          <Icon name="check" className="h-11 w-11" />
        </div>

        {/* Queue Number - tab focusable and auto-read after title */}
        <div
          ref={queueRef}
          tabIndex={0}
          onFocus={queueRead.start}
          onBlur={queueRead.stop}
          onPointerEnter={queueRead.start}
          className={[
            "flex w-full max-w-md flex-col items-center rounded-3xl bg-primary p-7 text-primary-foreground outline-none transition-all duration-150 cursor-pointer",
            queueRead.readingClass,
          ].join(" ")}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] opacity-90">
            {t.rcQueueLabel}
          </span>
          <span className="font-display text-7xl font-bold mt-1">
            {SESSION.queueNumber}
          </span>
        </div>

        {/* SMS or Print Confirmation Message */}
        <div
          ref={messageRef}
          tabIndex={0}
          onFocus={messageRead.start}
          onBlur={messageRead.stop}
          onPointerEnter={messageRead.start}
          className={[
            "w-full max-w-2xl rounded-2xl border border-border bg-card p-6 outline-none transition-all duration-150 cursor-pointer",
            messageRead.readingClass,
          ].join(" ")}
        >
          {isSms ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Icon name="mobile" className="h-7 w-7 text-primary" />
                <span>{t.rcSmsTitle}</span>
              </div>
              <p className="text-xl font-medium text-foreground mt-1">
                {t.rcSmsConfirm.replace("S M S", "SMS")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Icon name="printer" className="h-7 w-7 text-primary" />
                <span>{t.rcPrintTitle}</span>
              </div>
              <p className="text-xl font-medium text-foreground mt-1">
                {t.rcPrintConfirm}
              </p>
            </div>
          )}
        </div>

        {/* Staff Guidance Banner - displayed & read out if Voice Guide is ON */}
        {voiceGuide ? (
          <div
            ref={staffRef}
            tabIndex={0}
            onFocus={staffRead.start}
            onBlur={staffRead.stop}
            onPointerEnter={staffRead.start}
            className={[
              "flex w-full max-w-2xl items-center gap-5 rounded-2xl border-2 border-primary/30 bg-primary-soft p-5 text-left outline-none transition-all duration-150 cursor-pointer",
              staffRead.readingClass,
            ].join(" ")}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Icon name="help" className="h-8 w-8" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">
                {t.rcStaffGuidance}
              </p>
              <p className="text-lg text-muted-foreground mt-0.5">
                {t.rcStaffGuidanceSub}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex w-full justify-center mt-2">
          <div className="w-full max-w-md">
            <ActionCard
              buttonRef={startOverRef}
              icon="back"
              title={t.startOver}
              speech={`${t.asButton(t.startOver)} ${t.pressEnterTo(t.startOverAction)}`}
              onSelect={startOver}
            />
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
