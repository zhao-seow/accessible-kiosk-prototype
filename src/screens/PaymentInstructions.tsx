import { useEffect } from "react";
import { KioskChrome } from "../components/KioskChrome";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { useTapGuard } from "../hooks/useMotorFilters";
import { useReadAloud } from "../hooks/useSpeech";

export function PaymentInstructions() {
  const { goTo, paymentMethod, t } = useKiosk();
  const isQr = paymentMethod === "paynow";

  const title = isQr ? t.piQrTitle : t.piCardTitle;
  const instruction = isQr ? t.piQrInstruction : t.piCardInstruction;
  const announce = `${isQr ? t.piQrAnnounce : t.piCardAnnounce} ${t.piContinueHint}`;
  const { start, stop, readingClass } = useReadAloud(`${instruction} ${t.piContinueHint}`, "interactive");

  const advance = () => {
    window.speechSynthesis?.cancel();
    goTo("paymentSuccess");
  };
  const guarded = useTapGuard(advance);

  // Tapping anywhere or pressing Enter moves to the Payment Successful screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KioskChrome title={title} announce={announce}>
      <button
        type="button"
        onClick={(e) => guarded(e)}
        onFocus={start}
        onBlur={stop}
        onPointerEnter={start}
        aria-label={`${instruction} ${t.piContinueHint}`}
        className={["mx-auto flex w-full max-w-4xl flex-1 cursor-pointer flex-col items-center justify-center gap-10 rounded-3xl text-center outline-none", readingClass].join(" ")}
      >
        {isQr ? (
          <div className="flex h-72 w-72 items-center justify-center rounded-3xl border-4 border-dashed border-primary bg-card text-primary">
            <Icon name="paynow" className="h-40 w-40" />
          </div>
        ) : (
          <div className="flex h-64 w-96 items-center justify-center rounded-3xl border-4 border-primary bg-primary-soft text-primary">
            <Icon name="credit" className="h-40 w-40" />
          </div>
        )}

        <p className="max-w-2xl text-4xl font-semibold leading-snug text-foreground">{instruction}</p>
        <p className="text-2xl text-muted-foreground">{t.piContinueHint}</p>
      </button>
    </KioskChrome>
  );
}
