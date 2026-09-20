import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Lang } from "./i18n";
import { copyFor, type Copy } from "./copy";
import type { Step } from "./steps";

export type SymptomKey = "cough" | "fever" | "soreThroat" | "runnyNose" | "none";

interface SessionState {
  lang: Lang;
  nric: string;
  voiceGuide: boolean;
  travelled: boolean | null;
  symptoms: SymptomKey[];
  fever: "yes" | "no" | "notSure" | null;
  paymentMethod: string | null;
  followUp: number | null;
  helpRequested: boolean;
}

const initialState: SessionState = {
  lang: "en",
  nric: "",
  voiceGuide: false,
  travelled: null,
  symptoms: [],
  fever: null,
  paymentMethod: null,
  followUp: null,
  helpRequested: false,
};

interface KioskContextValue extends SessionState {
  step: Step;
  history: Step[];
  t: Copy;
  goTo: (step: Step) => void;
  back: () => void;
  startOver: () => void;
  setLang: (lang: Lang) => void;
  setNric: (nric: string) => void;
  toggleVoiceGuide: () => void;
  setVoiceGuide: (on: boolean) => void;
  setTravelled: (v: boolean) => void;
  toggleSymptom: (s: SymptomKey) => void;
  setFever: (v: "yes" | "no" | "notSure") => void;
  setPaymentMethod: (m: string) => void;
  setFollowUp: (n: number | null) => void;
  requestHelp: () => void;
  dismissHelp: () => void;
}

const KioskContext = createContext<KioskContextValue | null>(null);

export function KioskProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);
  const [step, setStep] = useState<Step>("identify");
  const [history, setHistory] = useState<Step[]>([]);
  // Bumped whenever we move to a new screen so effects re-run on same-step re-entry.
  const navSeq = useRef(0);

  const patch = useCallback((p: Partial<SessionState>) => setState((s) => ({ ...s, ...p })), []);

  const goTo = useCallback((next: Step) => {
    navSeq.current += 1;
    setStep((current) => {
      setHistory((h) => [...h, current]);
      return next;
    });
  }, []);

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setStep(prev);
      return h.slice(0, -1);
    });
  }, []);

  const startOver = useCallback(() => {
    // Purge session and reset Voice Guide to OFF for the next patient (spec §4).
    setState(initialState);
    setHistory([]);
    setStep("identify");
  }, []);

  const value = useMemo<KioskContextValue>(
    () => ({
      ...state,
      step,
      history,
      t: copyFor(state.lang),
      goTo,
      back,
      startOver,
      setLang: (lang) => patch({ lang }),
      setNric: (nric) => patch({ nric }),
      toggleVoiceGuide: () => setState((s) => ({ ...s, voiceGuide: !s.voiceGuide })),
      setVoiceGuide: (on) => patch({ voiceGuide: on }),
      setTravelled: (travelled) => patch({ travelled }),
      toggleSymptom: (s) =>
        setState((prev) => {
          if (s === "none") return { ...prev, symptoms: prev.symptoms.includes("none") ? [] : ["none"] };
          const withoutNone = prev.symptoms.filter((x) => x !== "none");
          const has = withoutNone.includes(s);
          return { ...prev, symptoms: has ? withoutNone.filter((x) => x !== s) : [...withoutNone, s] };
        }),
      setFever: (fever) => patch({ fever }),
      setPaymentMethod: (paymentMethod) => patch({ paymentMethod }),
      setFollowUp: (followUp) => patch({ followUp }),
      requestHelp: () => patch({ helpRequested: true }),
      dismissHelp: () => patch({ helpRequested: false }),
    }),
    [state, step, history, goTo, back, startOver, patch],
  );

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used within KioskProvider");
  return ctx;
}
