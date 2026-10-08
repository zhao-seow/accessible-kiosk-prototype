import { useEffect } from "react"
import { useKiosk } from "../kiosk/KioskContext"
import { copyFor } from "../kiosk/copy"
import { useSpeech } from "../hooks/useSpeech"
import { Icon } from "./Icons"

export function ResetToast() {
  const { resetFeedback, dismissResetFeedback } = useKiosk()
  const { speak } = useSpeech()

  useEffect(() => {
    if (!resetFeedback.show) return
    const copy = copyFor(resetFeedback.lang)
    speak(copy.startOverDone, {
      force: true,
      priority: true,
      lang: resetFeedback.lang,
    })

    const timer = setTimeout(() => {
      dismissResetFeedback()
    }, 3500)
    return () => clearTimeout(timer)
  }, [resetFeedback, speak, dismissResetFeedback])

  if (!resetFeedback.show) return null

  const copy = copyFor(resetFeedback.lang)

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 rounded-2xl border border-emerald-500/30 bg-neutral-900/95 px-6 py-4 text-white shadow-2xl backdrop-blur-md transition-all animate-bounce-in"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <Icon name="check" className="h-5 w-5" />
      </div>
      <p className="text-lg font-semibold tracking-tight text-white">
        {copy.startOverDone}
      </p>
      <button
        type="button"
        onClick={dismissResetFeedback}
        className="ml-2 rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss"
      >
        <span className="text-sm font-bold leading-none block">✕</span>
      </button>
    </aside>
  )
}
