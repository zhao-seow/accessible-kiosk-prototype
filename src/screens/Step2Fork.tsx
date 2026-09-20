import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { useKiosk } from "../kiosk/KioskContext";

export function Step2Fork() {
  const { goTo, t } = useKiosk();

  return (
    <KioskChrome title={t.s2Welcome} titleSpeech={t.s2WelcomeSpeech} announce={t.s2Announce} skipAutoFocus>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10">
        <p className="text-2xl text-muted-foreground">{t.s2Subtitle}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ActionCard
            large
            optionIndex={1}
            optionCount={2}
            icon="clinic"
            title={t.s2ClinicTitle}
            desc={t.s2ClinicDesc}
            speech={`${t.asButton(t.s2ClinicTitle)} ${t.pressEnterTo(t.s2ClinicAction)}`}
            onSelect={() => goTo("q1")}
          />
          <ActionCard
            large
            optionIndex={2}
            optionCount={2}
            icon="bill"
            title={t.s2BillTitle}
            badge={t.s2BillOutstanding}
            speech={`${t.asButton(t.s2BillTitle)} ${t.s2BillOutstandingSpeech(t.s2BillAmountSpeech)} ${t.pressEnterTo(t.s2BillAction)}`}
            onSelect={() => goTo("payment")}
          />
        </div>
      </div>
    </KioskChrome>
  );
}
