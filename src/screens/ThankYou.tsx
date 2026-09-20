import { useEffect, useRef, useState } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandDateForSpeech, expandPhoneForSpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

export function ThankYou() {
  const { startOver, followUp, t } = useKiosk();
  const [delivery, setDelivery] = useState<null | "sms" | "print">(null);

  const slot = followUp != null ? SESSION.followUp[followUp] : null;
  const detailsSpeech = slot
    ? `${t.tyFollowUpHeading} Appointment 1 of 2, ${t.b2LabLabel}: ${expandDateForSpeech(slot.lab)}. Appointment 2 of 2, ${t.b2ConsultLabel}: ${expandDateForSpeech(slot.consult)}.`
    : "";
  const detailsRead = useReadAloud(detailsSpeech, "static");

  const confirmMessage = delivery === "sms" ? t.tySmsConfirm : t.tyPrintConfirm;
  // Speak the phone number digit by digit while still displaying it normally.
  const confirmSpeech =
    delivery === "sms" ? confirmMessage.replace(SESSION.mobile, expandPhoneForSpeech(SESSION.mobile)) : confirmMessage;

  const confirmPRef = useRef<HTMLParagraphElement>(null);
  const startOverRef = useRef<HTMLButtonElement>(null);

  // After the delivery confirmation finishes reading, auto-advance to Start Over.
  const confirmRead = useReadAloud(confirmSpeech, "static", {
    onEnd: () => {
      if (document.activeElement === confirmPRef.current) startOverRef.current?.focus();
    },
  });

  const choose = (method: "sms" | "print") => setDelivery(method);

  // After choosing a delivery method, focus the confirmation text so it reads itself first.
  useEffect(() => {
    if (delivery) confirmPRef.current?.focus();
  }, [delivery]);

  return (
    <KioskChrome title={t.tyTitle} announce={t.tyAnnounce}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" className="h-11 w-11" />
        </div>

        <p className="max-w-2xl text-3xl font-semibold text-foreground">{t.tySubtitle}</p>

        {slot ? (
          <div
            tabIndex={0}
            onFocus={detailsRead.start}
            onBlur={detailsRead.stop}
            onPointerEnter={detailsRead.start}
            className={[
              "w-full max-w-xl rounded-2xl border-2 border-border bg-card p-6 text-left outline-none",
              detailsRead.readingClass,
            ].join(" ")}
          >
            <p className="mb-4 font-display text-2xl font-bold text-foreground">{t.tyFollowUpHeading}</p>
            <div className="flex items-start gap-3">
              <Icon name="flask" className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <span>
                <span className="block text-lg font-semibold text-muted-foreground">{t.b2LabLabel}</span>
                <span className="block text-xl font-semibold text-foreground">{slot.lab}</span>
              </span>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Icon name="calendar" className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <span>
                <span className="block text-lg font-semibold text-muted-foreground">{t.b2ConsultLabel}</span>
                <span className="block text-xl font-semibold text-foreground">{slot.consult}</span>
              </span>
            </div>
          </div>
        ) : null}

        {slot && !delivery ? (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <ActionCard
              optionIndex={1}
              optionCount={2}
              icon="mobile"
              title={t.tySms}
              desc={SESSION.mobile}
              speech={`${t.tySms} to mobile number ${expandPhoneForSpeech(SESSION.mobile)}, button. Press Enter to receive your appointment slip by S M S.`}
              onSelect={() => choose("sms")}
            />
            <ActionCard
              optionIndex={2}
              optionCount={2}
              icon="printer"
              title={t.tyPrint}
              speech={`${t.tyPrint}, button. Press Enter to print a paper slip from the printer below.`}
              onSelect={() => choose("print")}
            />
          </div>
        ) : null}

        {slot && delivery ? (
          <p
            ref={confirmPRef}
            tabIndex={0}
            onFocus={confirmRead.start}
            onBlur={confirmRead.stop}
            onPointerEnter={confirmRead.start}
            className={[
              "max-w-2xl rounded-lg text-2xl font-semibold text-foreground outline-none",
              confirmRead.readingClass,
            ].join(" ")}
          >
            {confirmMessage}
          </p>
        ) : null}

        {!slot || delivery ? (
          <div className="flex w-full justify-center">
            <div className="w-full max-w-md">
              <ActionCard
                buttonRef={startOverRef}
                icon="back"
                title={t.startOver}
                speech={`${t.startOver}, button. Press Enter to reset the kiosk.`}
                onSelect={startOver}
              />
            </div>
          </div>
        ) : null}
      </div>
    </KioskChrome>
  );
}
