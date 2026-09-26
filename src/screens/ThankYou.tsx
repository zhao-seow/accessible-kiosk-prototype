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

  // --- Phase 1 (Selection) Refs & Auto-read Chain ---
  const initialInfoRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);

  const advanceFromInitialInfo = () => {
    if (document.activeElement === initialInfoRef.current) promptRef.current?.focus();
  };
  const detailsSpeech = slot
    ? `${t.tyFollowUpHeading} ${t.b2LabLabel}: ${expandDateForSpeech(slot.lab)}.`
    : "";
  const initialInfoRead = useReadAloud(detailsSpeech, "static", { onEnd: advanceFromInitialInfo });

  const promptSpeech = `${t.tyFollowUpHeading} ${t.b2NoteInstruction}`;
  const promptRead = useReadAloud(promptSpeech, "static");

  // --- Phase 2 (Confirmation) Refs & Auto-read Chain ---
  const messageRef = useRef<HTMLDivElement>(null);
  const startOverRef = useRef<HTMLButtonElement>(null);

  const isSms = delivery === "sms";
  const messageSpeech = slot
    ? isSms
      ? t.tySmsConfirm.replace(SESSION.mobile, expandPhoneForSpeech(SESSION.mobile))
      : t.tyPrintConfirm
    : t.tySubtitle;

  const advanceFromMessage = () => {
    if (document.activeElement === messageRef.current) {
      startOverRef.current?.focus();
    }
  };
  const messageRead = useReadAloud(messageSpeech, "static", { onEnd: advanceFromMessage });

  const choose = (method: "sms" | "print") => setDelivery(method);

  // When delivery method is selected, focus the confirmation card so it auto-reads first,
  // then cascades to the start over button.
  useEffect(() => {
    if (delivery) {
      messageRef.current?.focus();
    }
  }, [delivery]);

  return (
    <KioskChrome title={t.tyTitle}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-7 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-xs">
          <Icon name="check" className="h-11 w-11" />
        </div>

        {slot && !delivery ? (
          <>
            {/* Appointment Details */}
            <div
              ref={initialInfoRef}
              tabIndex={0}
              onFocus={initialInfoRead.start}
              onBlur={initialInfoRead.stop}
              onPointerEnter={initialInfoRead.start}
              className={[
                "flex w-full max-w-xl items-center gap-4 rounded-2xl border-2 border-border bg-card p-6 text-left outline-none transition-all duration-150 cursor-pointer",
                initialInfoRead.readingClass,
              ].join(" ")}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name="flask" className="h-7 w-7" />
              </span>
              <div>
                <span className="block text-base font-semibold text-muted-foreground">{t.b2LabLabel}</span>
                <span className="block text-2xl font-bold text-foreground mt-0.5">{slot.lab}</span>
              </div>
            </div>

            <div className="w-full">
              <p
                ref={promptRef}
                tabIndex={0}
                onFocus={promptRead.start}
                onBlur={promptRead.stop}
                onPointerEnter={promptRead.start}
                className={[
                  "mb-5 text-center font-display text-3xl font-semibold text-foreground outline-none transition-all duration-150 rounded-lg",
                  promptRead.readingClass,
                ].join(" ")}
              >
                {t.tyFollowUpHeading}
              </p>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                <ActionCard
                  optionIndex={1}
                  optionCount={2}
                  icon="mobile"
                  title={t.tySms}
                  desc={SESSION.mobile}
                  speech={`${t.asButton(t.tySms)}${t.toMobileNumber(expandPhoneForSpeech(SESSION.mobile))} ${t.pressEnterTo(t.tySmsAction)}`}
                  onSelect={() => choose("sms")}
                />
                <ActionCard
                  optionIndex={2}
                  optionCount={2}
                  icon="printer"
                  title={t.tyPrint}
                  speech={`${t.asButton(t.tyPrint)} ${t.pressEnterTo(t.tyPrintAction)}`}
                  onSelect={() => choose("print")}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation message or payment complete message */}
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
              {slot ? (
                isSms ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                      <Icon name="mobile" className="h-7 w-7 text-primary" />
                      <span>{t.tySmsTitle}</span>
                    </div>
                    <p className="text-xl font-medium text-foreground mt-1">
                      {t.tySmsConfirm.replace("S M S", "SMS")}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                      <Icon name="printer" className="h-7 w-7 text-primary" />
                      <span>{t.tyPrintTitle}</span>
                    </div>
                    <p className="text-xl font-medium text-foreground mt-1">
                      {t.tyPrintConfirm}
                    </p>
                  </div>
                )
              ) : (
                <p className="text-2xl font-semibold text-foreground">
                  {t.tySubtitle}
                </p>
              )}
            </div>

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
          </>
        )}
      </div>
    </KioskChrome>
  );
}
