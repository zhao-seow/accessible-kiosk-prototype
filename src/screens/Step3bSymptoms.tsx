import { KioskChrome } from "../components/KioskChrome";
import { CheckboxTile } from "../components/CheckboxTile";
import { ChoiceButton } from "../components/ChoiceButton";
import { QuestionText } from "../components/QuestionText";
import { useKiosk, type SymptomKey } from "../kiosk/KioskContext";

const SYMPTOMS: SymptomKey[] = ["cough", "fever", "soreThroat", "runnyNose"];

export function Step3bSymptoms() {
  const { goTo, symptoms, toggleSymptom, t } = useKiosk();

  return (
    <KioskChrome title={t.hdStep(2)} announce={t.q2Announce}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6">
        <QuestionText text={t.q2Question} subtitle={t.q2Subtitle} instruction={t.q2Instruction} />

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {SYMPTOMS.map((key) => {
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

          <div className="sm:col-span-2">
            <CheckboxTile
              key="none"
              label={t.symptoms.none}
              checked={symptoms.includes("none")}
              onToggle={() => toggleSymptom("none")}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md pt-1">
          <ChoiceButton
            tone="primary"
            compact
            label={t.continue}
            speech={`${t.asButton(t.continue)} ${t.pressEnterTo(t.q2ContinueAction)}`}
            onSelect={() => goTo("q3")}
          />
        </div>
      </div>
    </KioskChrome>
  );
}
