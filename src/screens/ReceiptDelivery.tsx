import { useEffect, useRef, useState } from "react"
import { KioskChrome } from "../components/KioskChrome"
import { ActionCard } from "../components/ActionCard"
import { ChoiceButton } from "../components/ChoiceButton"
import { Icon } from "../components/Icons"
import { useKiosk } from "../kiosk/KioskContext"
import { SESSION, expandPhoneForSpeech } from "../kiosk/copy"
import { useReadAloud, useSpeech } from "../hooks/useSpeech"

export function ReceiptDelivery() {
  const { startOver, ticketDelivery, paymentMethod, voiceGuide, t } = useKiosk()
  const { speak } = useSpeech()
  const isSms = ticketDelivery === "sms" || paymentMethod === "sms"

  const [guidanceChoice, setGuidanceChoice] = useState<null | "yes" | "no">(
    null,
  )
  const [popup, setPopup] = useState<null | "yes" | "no">(null)

  const queueRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const guidancePromptRef = useRef<HTMLParagraphElement>(null)
  const yesBtnRef = useRef<HTMLButtonElement>(null)
  const noBtnRef = useRef<HTMLButtonElement>(null)
  const staffRef = useRef<HTMLDivElement>(null)
  const startOverRef = useRef<HTMLButtonElement>(null)
  const popupOkRef = useRef<HTMLButtonElement>(null)

  // Guided reading chain:
  // Title -> Queue Number -> SMS / Print Message -> Guidance Question (if Voice Guide on) -> Start Over
  const advanceFromQueue = () => {
    if (document.activeElement === queueRef.current) messageRef.current?.focus()
  }
  const queueSpeech = `${t.rcQueueLabel}: ${SESSION.queueNumber}.`
  const queueRead = useReadAloud(queueSpeech, "static", {
    onEnd: advanceFromQueue,
  })

  const advanceFromMessage = () => {
    if (document.activeElement === messageRef.current) {
      if (voiceGuide) {
        if (guidanceChoice) {
          staffRef.current?.focus()
        } else {
          guidancePromptRef.current?.focus()
        }
      } else {
        startOverRef.current?.focus()
      }
    }
  }

  const messageSpeech = isSms
    ? t.rcSmsConfirm.replace(
        SESSION.mobile,
        expandPhoneForSpeech(SESSION.mobile),
      )
    : t.rcPrintConfirm
  const messageRead = useReadAloud(messageSpeech, "static", {
    onEnd: advanceFromMessage,
  })

  const advanceFromGuidancePrompt = () => {
    if (document.activeElement === guidancePromptRef.current) {
      yesBtnRef.current?.focus()
    }
  }
  const guidancePromptRead = useReadAloud(t.rcGuidancePromptSpeech, "static", {
    onEnd: advanceFromGuidancePrompt,
  })

  const advanceFromStaff = () => {
    if (document.activeElement === staffRef.current && startOverRef.current) {
      startOverRef.current.focus()
    }
  }
  const chosenSpeech =
    guidanceChoice === "yes"
      ? `${t.rcGuidanceStaffAlertedTitle}. ${t.rcGuidanceYesChosen}`
      : `${t.rcGuidanceNoHelpTitle}. ${t.rcGuidanceNoChosen}`
  const chosenRead = useReadAloud(chosenSpeech, "static", {
    onEnd: advanceFromStaff,
  })

  const handleSelectGuidance = (choice: "yes" | "no") => {
    setGuidanceChoice(choice)
    setPopup(choice)
    const speechText =
      choice === "yes"
        ? `${t.rcGuidanceStaffAlertedTitle}. ${t.rcGuidanceYesChosen}. ${t.pressEnterTo(t.rcDone)}`
        : `${t.rcGuidanceNoHelpTitle}. ${t.rcGuidanceNoHelpDesc}. ${t.pressEnterTo(t.rcDone)}`
    speak(speechText, { force: true, priority: true })
  }

  const closePopup = () => {
    setPopup(null)
    window.speechSynthesis?.cancel()
    setTimeout(() => {
      if (startOverRef.current) {
        startOverRef.current.focus()
      } else {
        staffRef.current?.focus()
      }
    }, 50)
  }

  // Auto-focus the OK button when confirmation popup appears
  useEffect(() => {
    if (popup) {
      popupOkRef.current?.focus()
    }
  }, [popup])

  // Allow Enter or Escape to dismiss modal
  useEffect(() => {
    if (!popup) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault()
        closePopup()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [popup])

  return (
    <KioskChrome title={t.rcTitle}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-7 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-xs">
          <Icon name="check" className="h-11 w-11" />
        </div>

        {/* Queue Number - tab focusable and auto-read after title */}
        <div
          ref={queueRef}
          tabIndex={0}
          onFocus={queueRead.start}
          onBlur={queueRead.stop}
          onPointerEnter={queueRead.start}
          className={[
            "flex w-full max-w-md flex-col items-center rounded-3xl bg-primary p-7 text-primary-foreground outline-none transition-all duration-150 cursor-pointer",
            queueRead.readingClass,
          ].join(" ")}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] opacity-90">
            {t.rcQueueLabel}
          </span>
          <span className="font-display text-7xl font-bold mt-1">
            {SESSION.queueNumber}
          </span>
        </div>

        {/* SMS or Print Confirmation Message */}
        <div
          ref={messageRef}
          tabIndex={0}
          onFocus={messageRead.start}
          onBlur={messageRead.stop}
          onPointerEnter={messageRead.start}
          className={[
            "w-full max-w-2xl rounded-2xl border border-border bg-card p-6 outline-none transition-all duration-150 cursor-pointer",
            messageRead.readingClass,
          ].join(" ")}
        >
          {isSms ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Icon name="mobile" className="h-7 w-7 text-primary" />
                <span>{t.rcSmsTitle}</span>
              </div>
              <p className="text-xl font-medium text-foreground mt-1">
                {t.rcSmsConfirm.replace("S M S", "SMS")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Icon name="printer" className="h-7 w-7 text-primary" />
                <span>{t.rcPrintTitle}</span>
              </div>
              <p className="text-xl font-medium text-foreground mt-1">
                {t.rcPrintConfirm}
              </p>
            </div>
          )}
        </div>

        {/* Clinic Guidance Choice / Status - displayed only when Voice Guide is ON */}
        {voiceGuide ? (
          guidanceChoice ? (
            <div
              ref={staffRef}
              tabIndex={0}
              onFocus={chosenRead.start}
              onBlur={chosenRead.stop}
              onPointerEnter={chosenRead.start}
              className={[
                "flex w-full max-w-2xl items-center gap-5 rounded-2xl border-2 p-5 text-left outline-none transition-all duration-150 cursor-pointer",
                guidanceChoice === "yes"
                  ? "border-primary/30 bg-primary-soft text-foreground"
                  : "border-success/30 bg-success-soft text-foreground",
                chosenRead.readingClass,
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white",
                  guidanceChoice === "yes" ? "bg-primary" : "bg-success",
                ].join(" ")}
              >
                <Icon
                  name={guidanceChoice === "yes" ? "help" : "check"}
                  className="h-8 w-8"
                />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {guidanceChoice === "yes"
                    ? t.rcGuidanceStaffAlertedTitle
                    : t.rcGuidanceNoHelpTitle}
                </p>
                <p className="text-lg text-muted-foreground mt-0.5">
                  {guidanceChoice === "yes"
                    ? t.rcGuidanceYesChosen
                    : t.rcGuidanceNoChosen}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl rounded-2xl border-2 border-primary/30 bg-primary-soft p-6 text-center">
              <p
                ref={guidancePromptRef}
                tabIndex={0}
                onFocus={guidancePromptRead.start}
                onBlur={guidancePromptRead.stop}
                onPointerEnter={guidancePromptRead.start}
                className={[
                  "mb-5 font-display text-2xl font-bold text-foreground outline-none rounded-lg",
                  guidancePromptRead.readingClass,
                ].join(" ")}
              >
                {t.rcGuidanceQuestion}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ChoiceButton
                  buttonRef={yesBtnRef}
                  compact
                  tone="neutral"
                  label={t.rcGuidanceYes}
                  speech={`${t.asButton(t.rcGuidanceYes)} ${t.pressEnterTo(t.rcGuidanceYesAction)}`}
                  onSelect={() => handleSelectGuidance("yes")}
                />
                <ChoiceButton
                  buttonRef={noBtnRef}
                  compact
                  tone="neutral"
                  label={t.rcGuidanceNo}
                  speech={`${t.asButton(t.rcGuidanceNo)} ${t.pressEnterTo(t.rcGuidanceNoAction)}`}
                  onSelect={() => handleSelectGuidance("no")}
                />
              </div>
            </div>
          )
        ) : null}

        {!voiceGuide ? (
          <div className="flex w-full justify-center mt-2">
            <div className="w-full max-w-md">
              <ActionCard
                buttonRef={startOverRef}
                icon="back"
                title={t.startOver}
                speech={`${t.asButton(t.startOver)} ${t.pressEnterTo(t.startOverAction)}`}
                onSelect={startOver}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Confirmation Modal Popup */}
      {popup ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guidance-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup()
          }}
        >
          <div className="flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl border-2 border-primary bg-card p-8 text-center shadow-2xl">
            <div
              className={[
                "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xs",
                popup === "yes" ? "bg-primary" : "bg-success",
              ].join(" ")}
            >
              <Icon
                name={popup === "yes" ? "help" : "check"}
                className="h-10 w-10"
              />
            </div>

            <div>
              <h2
                id="guidance-popup-title"
                className="font-display text-3xl font-bold text-foreground"
              >
                {popup === "yes"
                  ? t.rcGuidanceStaffAlertedTitle
                  : t.rcGuidanceNoHelpTitle}
              </h2>
              <p className="mt-2 text-xl leading-relaxed text-muted-foreground">
                {popup === "yes"
                  ? t.rcGuidanceYesChosen
                  : t.rcGuidanceNoHelpDesc}
              </p>
            </div>

            <button
              ref={popupOkRef}
              type="button"
              onClick={closePopup}
              className="mt-2 inline-flex min-h-[4rem] w-full max-w-xs items-center justify-center rounded-2xl bg-primary px-8 text-2xl font-semibold text-primary-foreground outline-none transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t.rcDone}
            </button>
          </div>
        </div>
      ) : null}
    </KioskChrome>
  )
}
