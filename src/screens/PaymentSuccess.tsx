import { useEffect, useRef, useState } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandPhoneForSpeech, moneySpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

export function PaymentSuccess() {
  const { goTo, setTicketDelivery, t } = useKiosk();
  const [confirmed, setConfirmed] = useState<null | "sms" | "print">(null);

  // --- Phase 1 (Selection) Refs & Auto-read Chain ---
  const initialInfoRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);

  const advanceFromInitialInfo = () => {
    if (document.activeElement === initialInfoRef.current) promptRef.current?.focus();
  };
  const initialInfoSpeech = `${t.psPaidLabel}: ${moneySpeech(SESSION.outstanding, t)}. ${t.psStatusLabel}: ${t.psStatusSuccess}.`;
  const initialInfoRead = useReadAloud(initialInfoSpeech, "static", { onEnd: advanceFromInitialInfo });

  const promptSpeech = `${t.psSubtitle} ${t.b2NoteInstruction}`;
  const promptRead = useReadAloud(promptSpeech, "static");

  // --- Phase 2 (Confirmation) Refs & Auto-read Chain ---
  const messageRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  const isSms = confirmed === "sms";
  const messageSpeech = isSms
    ? t.psSmsConfirm.replace(SESSION.mobile, expandPhoneForSpeech(SESSION.mobile))
    : t.psPrintConfirm;

  const advanceFromMessage = () => {
    if (document.activeElement === messageRef.current) {
      continueRef.current?.focus();
    }
  };
  const messageRead = useReadAloud(messageSpeech, "static", { onEnd: advanceFromMessage });

  const choose = (method: "sms" | "print") => {
    setTicketDelivery(method);
    setConfirmed(method);
  };

  // When delivery method is selected, focus the confirmation card so it auto-reads first,
  // then cascades to the continue button.
  useEffect(() => {
    if (confirmed) {
      messageRef.current?.focus();
    }
  }, [confirmed]);

  return (
    <KioskChrome title={t.psTitle}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-7 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-xs">
          <Icon name="check" className="h-11 w-11" />
        </div>

        {confirmed ? (
          <>
            {/* SMS or Print Confirmation Message - tab focusable and auto-read after selection */}
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
                    <span>{t.psSmsTitle}</span>
                  </div>
                  <p className="text-xl font-medium text-foreground mt-1">
                    {t.psSmsConfirm.replace("S M S", "SMS")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                    <Icon name="printer" className="h-7 w-7 text-primary" />
                    <span>{t.psPrintTitle}</span>
                  </div>
                  <p className="text-xl font-medium text-foreground mt-1">
                    {t.psPrintConfirm}
                  </p>
                </div>
              )}
            </div>

            <div className="flex w-full justify-center mt-2">
              <div className="w-full max-w-md">
                <ActionCard
                  buttonRef={continueRef}
                  icon="check"
                  title={t.continue}
                  speech={`${t.asButton(t.continue)} ${t.pressEnterTo(t.continueAction)}`}
                  onSelect={() => goTo("followUp")}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Payment Summary */}
            <div
              ref={initialInfoRef}
              tabIndex={0}
              onFocus={initialInfoRead.start}
              onBlur={initialInfoRead.stop}
              onPointerEnter={initialInfoRead.start}
              className={[
                "flex w-full max-w-xl items-center justify-between rounded-2xl border-2 border-border bg-card px-8 py-5 text-left outline-none transition-all duration-150 cursor-pointer",
                initialInfoRead.readingClass,
              ].join(" ")}
            >
              <div>
                <span className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.psPaidLabel}
                </span>
                <span className="font-display text-4xl font-bold text-foreground mt-0.5 block">
                  {SESSION.outstanding}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {t.psStatusLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-1.5 text-lg font-semibold text-success">
                  <Icon name="check" className="h-5 w-5" />
                  {t.psStatusSuccess}
                </span>
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
                {t.psSubtitle}
              </p>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                <ActionCard
                  optionIndex={1}
                  optionCount={2}
                  icon="mobile"
                  title={t.psSms}
                  desc={SESSION.mobile}
                  speech={`${t.asButton(t.psSms)}${t.toMobileNumber(expandPhoneForSpeech(SESSION.mobile))} ${t.pressEnterTo(t.psSmsAction)}`}
                  onSelect={() => choose("sms")}
                />
                <ActionCard
                  optionIndex={2}
                  optionCount={2}
                  icon="printer"
                  title={t.psPrint}
                  speech={`${t.asButton(t.psPrint)} ${t.pressEnterTo(t.psPrintAction)}`}
                  onSelect={() => choose("print")}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </KioskChrome>
  );
}
