import { useEffect, useRef, useState } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION, expandPhoneForSpeech } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

export function PaymentSuccess() {
  const { goTo, t } = useKiosk();
  const [confirmed, setConfirmed] = useState<null | "sms" | "print">(null);

  const confirmMessage = confirmed === "sms" ? t.psSmsConfirm : t.psPrintConfirm;
  // Speak the phone number digit by digit while still displaying it normally.
  const confirmSpeech =
    confirmed === "sms" ? confirmMessage.replace(SESSION.mobile, expandPhoneForSpeech(SESSION.mobile)) : confirmMessage;

  const confirmPRef = useRef<HTMLParagraphElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  // After the confirmation text finishes reading, auto-advance to Continue.
  const confirmRead = useReadAloud(confirmSpeech, "static", {
    onEnd: () => {
      if (document.activeElement === confirmPRef.current) continueRef.current?.focus();
    },
  });
  const continueRead = useReadAloud(`${t.continue}, button. Press Enter to continue.`, "interactive");

  const choose = (method: "sms" | "print") => {
    setConfirmed(method);
  };

  // After confirming, focus the confirmation text so it reads itself first.
  useEffect(() => {
    if (confirmed) confirmPRef.current?.focus();
  }, [confirmed]);

  return (
    <KioskChrome title={t.psTitle} intro={t.psIntro}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" className="h-11 w-11" />
        </div>

        {confirmed ? (
          <>
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
            <button
              ref={continueRef}
              type="button"
              onFocus={continueRead.start}
              onBlur={continueRead.stop}
              onPointerEnter={continueRead.start}
              onClick={() => goTo("followUp")}
              className={[
                "inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-primary bg-primary px-10 py-5 font-display text-3xl font-semibold text-primary-foreground outline-none transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-18px_rgba(33,32,29,0.4)]",
                continueRead.readingClass,
              ].join(" ")}
            >
              {t.continue}
            </button>
          </>
        ) : (
          <>
            <p className="max-w-2xl text-2xl text-muted-foreground">{t.psSubtitle}</p>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              <ActionCard
                optionIndex={1}
                optionCount={2}
                icon="mobile"
                title={t.psSms}
                desc={SESSION.mobile}
                speech={`${t.psSms} to mobile number ${expandPhoneForSpeech(SESSION.mobile)}, button. Press Enter to receive your receipt by S M S.`}
                onSelect={() => choose("sms")}
              />
              <ActionCard
                optionIndex={2}
                optionCount={2}
                icon="printer"
                title={t.psPrint}
                speech={`${t.psPrint}, button. Press Enter to print a paper receipt from the printer below.`}
                onSelect={() => choose("print")}
              />
            </div>
          </>
        )}
      </div>
    </KioskChrome>
  );
}
