# Step 1 voiceover i18n fixes

## Context
Several spoken announcements on Step 1 (and the shared chrome) are still hardcoded in
English, and the NRIC field reads out the *previously* selected language. Every voiceover
must speak in the currently-selected language (en / zh / ms / ta), matching the visible copy.

## Changes

### Task 1 — NRIC field reads the previous language (`src/screens/Step1Identify.tsx`)
Root cause: a language button's `onSelect` calls `setLang(code)` then **synchronously**
`inputRef.current?.focus()`. The input's `onFocus` → `nricRead.start` fires before React
commits the new-language render, so it speaks the stale (previous) language's string.
Fix: defer the focus until after commit so `start` uses the new-language announcement, e.g.
`onSelect={() => { setLang(l.code); setTimeout(() => inputRef.current?.focus(), 0); }}`

### Task 2 — Enter button voiceover only in English (`Step1Identify.tsx` + `copy.ts`)
Add `s1EnterAnnounce: string` to the `Copy` interface and all 4 dicts. Replace the hardcoded
`useReadAloud("Enter, button. Press Enter to submit…")` with
`useReadAloud(t.s1EnterAnnounce, "interactive", { lang })`.

### Task 3 — Relabel "NRIC / ID Number" → "NRIC number" (`copy.ts`)
Change `s1NricLabel` in all 4 dicts so they tally:
en `"NRIC number"`, zh `"身份证号码"`, ms `"Nombor NRIC"`, ta `"NRIC எண்"`.

### Task 4 — Voice Guide toggle voiceover in 4 languages (`VoiceGuideToggle.tsx` + `copy.ts`)
The speech string ends with hardcoded `"Press Enter to turn off/on."`. Add a translated
helper `vgAnnounce(on: boolean)` per dict (or `vgTurnOn`/`vgTurnOff` fields) and build
`speech` from `t`. Keep `{ always: true }` and pass `{ lang }` so it speaks in the selected
language's voice even while currently off.

### Task 5 — Call Help voiceover in 4 languages (`KioskChrome.tsx` + `copy.ts`)
The Call Help `FooterButton` speech is `${t.callHelp}, button. Press Enter to request staff
assistance.` Add `callHelpAnnounce` (translated, 4 dicts) and pass it as the `speech` prop for
the Call Help button only.

### Task 6 — Start Over voiceover in 4 languages (`KioskChrome.tsx` + `copy.ts`)
Same pattern: add `startOverAnnounce` (translated, 4 dicts) and use it for the Start Over
`FooterButton` speech prop. (Scope: Call Help + Start Over instances only; Back left as-is.)

## Translated text (exact strings)

### Task 2 — `s1EnterAnnounce`
- en: `"Enter, button. Press Enter to submit your NRIC number and continue."`
- zh: `"确认，按钮。按 Enter 键提交您的身份证号码并继续。"`
- ms: `"Enter, butang. Tekan Enter untuk menghantar nombor NRIC anda dan teruskan."`
- ta: `"Enter, பொத்தான். உங்கள் NRIC எண்ணைச் சமர்ப்பித்துத் தொடர Enter-ஐ அழுத்தவும்."`

### Task 3 — `s1NricLabel` (and align `s1NricAnnounce` opener to "NRIC number")
- en: `"NRIC number"`
- zh: `"身份证号码"`
- ms: `"Nombor NRIC"`
- ta: `"NRIC எண்"`

### Task 4 — Voice Guide toggle: add `vgTurnOn` / `vgTurnOff`
speech = `` `${t.voiceGuide}: ${status}. ${voiceGuide ? t.vgTurnOff : t.vgTurnOn}` ``
- en: vgTurnOn `"Press Enter to turn on."` · vgTurnOff `"Press Enter to turn off."`
- zh: vgTurnOn `"按 Enter 键开启。"` · vgTurnOff `"按 Enter 键关闭。"`
- ms: vgTurnOn `"Tekan Enter untuk hidupkan."` · vgTurnOff `"Tekan Enter untuk matikan."`
- ta: vgTurnOn `"இயக்க Enter-ஐ அழுத்தவும்."` · vgTurnOff `"முடக்க Enter-ஐ அழுத்தவும்."`

### Task 5 — `callHelpAnnounce`
- en: `"Call Help, button. Press Enter to request staff assistance."`
- zh: `"呼叫协助，按钮。按 Enter 键请求工作人员协助。"`
- ms: `"Panggil Bantuan, butang. Tekan Enter untuk meminta bantuan kakitangan."`
- ta: `"உதவியை அழைக்கவும், பொத்தான். ஊழியர் உதவியைக் கோர Enter-ஐ அழுத்தவும்."`

### Task 6 — `startOverAnnounce`
- en: `"Start Over, button. Press Enter to reset the kiosk."`
- zh: `"重新开始，按钮。按 Enter 键重置服务机。"`
- ms: `"Mula Semula, butang. Tekan Enter untuk menetapkan semula kiosk."`
- ta: `"மீண்டும் தொடங்கு, பொத்தான். கியோஸ்கை மீட்டமைக்க Enter-ஐ அழுத்தவும்."`

## Notes
- `FooterButton`/`VoiceGuideToggle` already speak with the active-language voice by default,
  so translating the *text* is sufficient; only the toggle needs `{ lang }` because it can
  fire while Voice Guide is off.

## Verification
`npx tsc --noEmit`; then in the preview turn Voice Guide on, switch each language, and confirm
the toggle, NRIC label/field, Enter button, Call Help and Start Over all speak in that language.
