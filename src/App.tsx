import { KioskProvider, useKiosk } from "./kiosk/KioskContext";
import { CallHelpBanner } from "./components/CallHelpBanner";
import { useGlobalKeyboard } from "./hooks/useKeyboard";
import { Step1Identify } from "./screens/Step1Identify";
import { Step2Fork } from "./screens/Step2Fork";
import { Step3aTravel } from "./screens/Step3aTravel";
import { Step3bSymptoms } from "./screens/Step3bSymptoms";
import { Step3cFever } from "./screens/Step3cFever";
import { BranchA1CheckIn } from "./screens/BranchA1CheckIn";
import { BranchB1Payment } from "./screens/BranchB1Payment";
import { PaymentInstructions } from "./screens/PaymentInstructions";
import { PaymentSuccess } from "./screens/PaymentSuccess";
import { BranchB2FollowUp } from "./screens/BranchB2FollowUp";
import { ReceiptDelivery } from "./screens/ReceiptDelivery";
import { ThankYou } from "./screens/ThankYou";

function Kiosk() {
  const { step, setVoiceGuide } = useKiosk();

  // Escape×2 within 1s deactivates Voice Guide (spec §2.2).
  useGlobalKeyboard(() => setVoiceGuide(false));

  const screen = (() => {
    switch (step) {
      case "identify":
        return <Step1Identify />;
      case "fork":
        return <Step2Fork />;
      case "q1":
        return <Step3aTravel />;
      case "q2":
        return <Step3bSymptoms />;
      case "q3":
        return <Step3cFever />;
      case "checkIn":
        return <BranchA1CheckIn />;
      case "payment":
        return <BranchB1Payment />;
      case "paymentInstructions":
        return <PaymentInstructions />;
      case "paymentSuccess":
        return <PaymentSuccess />;
      case "followUp":
        return <BranchB2FollowUp />;
      case "receipt":
        return <ReceiptDelivery />;
      case "thankYou":
        return <ThankYou />;
    }
  })();

  return (
    <>
      <CallHelpBanner />
      {screen}
    </>
  );
}

export default function App() {
  return (
    <KioskProvider>
      <Kiosk />
    </KioskProvider>
  );
}
