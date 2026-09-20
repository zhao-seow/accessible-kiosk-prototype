import { KioskChrome } from "../components/KioskChrome";
import { ActionCard } from "../components/ActionCard";
import { Icon } from "../components/Icons";
import { useKiosk } from "../kiosk/KioskContext";
import { SESSION } from "../kiosk/copy";

export function ReceiptDelivery() {
  const { startOver, t } = useKiosk();

  return (
    <KioskChrome title={t.rcTitle} announce={t.rcAnnounce}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" className="h-11 w-11" />
        </div>

        <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-primary p-8 text-primary-foreground">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] opacity-90">{t.rcQueueLabel}</span>
          <span className="font-display text-7xl font-bold">{SESSION.queueNumber}</span>
        </div>

        <p className="max-w-2xl text-2xl text-muted-foreground">{t.rcThanks}</p>

        <div className="flex w-full justify-center">
          <div className="w-full max-w-md">
            <ActionCard icon="printer" title={t.startOver} speech={`${t.asButton(t.startOver)} ${t.pressEnterTo(t.startOverAction)}`} onSelect={startOver} />
          </div>
        </div>
      </div>
    </KioskChrome>
  );
}
