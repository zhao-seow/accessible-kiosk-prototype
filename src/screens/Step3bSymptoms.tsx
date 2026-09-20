import { KioskChrome } from "../components/KioskChrome";
import { CheckboxTile } from "../components/CheckboxTile";
import { ChoiceButton } from "../components/ChoiceButton";
import { QuestionText } from "../components/QuestionText";
import { useKiosk, type SymptomKey } from "../kiosk/KioskContext";

const ORDER: SymptomKey[] = ["cough", "fever", "soreThroat", "runnyNose", "none"];

export function Step3bSymptoms() {
  const { goTo, symptoms, toggleSymptom, t } = useKiosk();

  return (
    <KioskChrome title={t.hdStep(2)} announce={t.q2Announce}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8">
        <QuestionText text={t.q2Question} subtitle={t.q2Subtitle} instruction={t.q2Instruction} />

        <div className="flex flex-col gap-4">
          {ORDER.map((key) => {
            const checked = symptoms.includes(key);
            return (
              <CheckboxTile
                key={key}
                label={t.symptoms[key]}
                checked={checked}
                onToggle={() => toggleSymptom(key)}
              />
            );
          })}
        </div>

        <div className="mx-auto w-full max-w-xl">
          <ChoiceButton
            tone="primary"
            label={t.continue}
            speech={`${t.continue}, button. Press Enter to proceed to question 3.`}
            onSelect={() => goTo("q3")}
          />
        </div>
      </div>
    </KioskChrome>
  );
}
