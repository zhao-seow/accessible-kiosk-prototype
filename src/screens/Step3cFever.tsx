import { KioskChrome } from "../components/KioskChrome";
import { ChoiceButton } from "../components/ChoiceButton";
import { QuestionText } from "../components/QuestionText";
import { useKiosk } from "../kiosk/KioskContext";

export function Step3cFever() {
  const { goTo, setFever, fever, t } = useKiosk();
  const choose = (v: "yes" | "no" | "notSure") => {
    setFever(v);
    goTo("checkIn");
  };

  return (
    <KioskChrome title={t.hdStep(3)} announce={t.q3Announce}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8">
        <QuestionText text={t.q3Question} instruction={t.q3Instruction} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ChoiceButton label={t.yes} selected={fever === "yes"} speech={`${t.yes}, button. Press Enter to select.`} onSelect={() => choose("yes")} />
          <ChoiceButton label={t.no} selected={fever === "no"} speech={`${t.no}, button. Press Enter to select.`} onSelect={() => choose("no")} />
          <ChoiceButton
            label={t.notSure}
            selected={fever === "notSure"}
            speech={`${t.notSure}, button. Press Enter to select.`}
            onSelect={() => choose("notSure")}
          />
        </div>
      </div>
    </KioskChrome>
  );
}
