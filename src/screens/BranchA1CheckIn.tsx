import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION } from "../kiosk/copy";
import { useReadAloud } from "../hooks/useSpeech";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2">
      <span className="text-xl text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function BranchA1CheckIn() {
  const { goTo, setPaymentMethod, t } = useKiosk();
  const finish = (mode: string) => {
    setPaymentMethod(mode);
    goTo("receipt");
  };

  // Read the appointment details before jumping to the delivery choice below.
  const intro = `${t.a1TimeLabel}: ${SESSION.apptTime}. ${t.a1ClinicLabel}: ${SESSION.apptClinic}. ${t.a1QueueLabel}: ${SESSION.queueNumber}.`;

  // The delivery heading is keyboard-focusable so users can Shift+Tab back to re-read it.
  const headingRead = useReadAloud(`${t.a1DeliveryHeading} ${t.a1DeliveryInstruction}`, "static");

  return (
    <KioskChrome title={t.a1Title} announce={t.a1Announce} intro={intro}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 md:col-span-2">
            <SummaryRow label={t.a1TimeLabel} value={SESSION.apptTime} />
            <div className="h-px w-full bg-border" />
            <SummaryRow label={t.a1ClinicLabel} value={SESSION.apptClinic} />
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-primary p-6 text-primary-foreground">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] opacity-90">{t.a1QueueLabel}</span>
            <span className="font-display text-5xl font-bold">{SESSION.queueNumber}</span>
          </div>
        </div>

        <div>
          <p
            tabIndex={0}
            onFocus={headingRead.start}
            onBlur={headingRead.stop}
            onPointerEnter={headingRead.start}
            className={[
              "mb-4 flex items-center gap-3 rounded-lg text-2xl font-semibold text-foreground outline-none",
              headingRead.readingClass,
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
              speech={`${t.a1SmsTitle} to mobile number ${SESSION.mobile}, button. Press Enter to receive your queue ticket on your phone.`}
              onSelect={() => finish("sms")}
            />
            <ActionCard
              optionIndex={2}
              optionCount={2}
              icon="printer"
              title={t.a1PrintTitle}
              desc={t.a1PrintDesc}
              speech={`${t.a1PrintTitle}, button. Press Enter to print a paper ticket from the printer below.`}
              onSelect={() => finish("print")}
            />
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
