import { KioskChrome } from "../components/KioskChrome";
import { ChoiceButton } from "../components/ChoiceButton";
import { QuestionText } from "../components/QuestionText";
import { useKiosk } from "../kiosk/KioskContext";

export function Step3aTravel() {
  const { goTo, setTravelled, travelled, t } = useKiosk();
  const choose = (v: boolean) => {
    setTravelled(v);
    goTo("q2");
  };

  return (
    <KioskChrome title={t.hdStep(1)} announce={t.q1Announce}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8">
        <QuestionText text={t.q1Question} instruction={t.q1Instruction} />
        <div className="grid grid-cols-2 gap-6">
          <ChoiceButton
            label={t.yes}
            selected={travelled === true}
            speech={`${t.yes}, button. Press Enter to select Yes and proceed to question 2.`}
            onSelect={() => choose(true)}
          />
          <ChoiceButton
            label={t.no}
            selected={travelled === false}
            speech={`${t.no}, button. Press Enter to select No and proceed to question 2.`}
            onSelect={() => choose(false)}
          />
        </div>
      </div>
    </KioskChrome>
  );
}
