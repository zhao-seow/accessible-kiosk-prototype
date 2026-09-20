export type Step =
  | "identify"
  | "fork"
  | "q1"
  | "q2"
  | "q3"
  | "checkIn"
  | "payment"
  | "paymentInstructions"
  | "paymentSuccess"
  | "followUp"
  | "receipt"
  | "thankYou";

// Screens where the health-declaration flow shows a step indicator (n of 3).
export const HD_STEPS: Record<string, number> = { q1: 1, q2: 2, q3: 3 };

// Step 1 has no Back button; every other screen does.
export const hasBack = (step: Step): boolean => step !== "identify";
