import { useCallback, useEffect, useRef, useState } from "react";
import { useKiosk } from "../kiosk/KioskContext";
import { bcp47ForLang, langFamiliesFor, type Lang } from "../kiosk/i18n";

// Warm up the voice list — some browsers populate it asynchronously.
function useVoicesReady() {
  const [, force] = useState(0);
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const handler = () => force((n) => n + 1);
    synth.getVoices();
    synth.addEventListener?.("voiceschanged", handler);
    return () => synth.removeEventListener?.("voiceschanged", handler);
  }, []);
}

export interface SpeechSegment {
  text: string;
  lang?: Lang;
}

export type SpeechContent = string | SpeechSegment[];

export interface SpeechSegmentResolved {
  text: string;
  bcp47: string;
  families: string[];
}

interface SequenceRequest {
  segments: SpeechSegmentResolved[];
  priority?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Bulletproof speech controller for long-running kiosk sessions. Works around
 * the well-known Chromium/WebKit Web Speech bugs:
 *  - Heartbeat pause()/resume() every 10s defeats the ~15s auto-pause bug.
 *  - Debounce collapses rapid focus/tab churn into a single utterance.
 *  - cancel() + a short buffer lets the audio thread reset before re-speaking.
 *  - A global anchor keeps the utterance from being garbage-collected mid-speech.
 */
class SpeechController {
  private synth = window.speechSynthesis;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private bufferTimer: ReturnType<typeof setTimeout> | null = null;
  private nextSegmentTimer: ReturnType<typeof setTimeout> | null = null;
  private sequenceId = 0;
  // True while a priority utterance (e.g. the Voice Guide on/off announcement) is
  // speaking, so an ordinary onFocus-triggered speak() can't cancel it mid-sentence.
  private priorityActive = false;
  rate = 1.0;

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private pickVoice(bcp47: string, families: string[]): SpeechSynthesisVoice | undefined {
    const voices = this.synth.getVoices();
    const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
    const base = (v: SpeechSynthesisVoice) => norm(v).split("-")[0];
    return (
      voices.find((v) => norm(v) === bcp47.toLowerCase()) ||
      voices.find((v) => families.includes(base(v)))
    );
  }

  speakSequence({ segments, priority, onStart, onEnd, onError }: SequenceRequest) {
    const valid = segments.filter((s) => s.text && s.text.trim());
    if (valid.length === 0) return;

    // A priority utterance (Voice Guide on/off) is speaking — wait for it to finish
    // instead of cancelling it, so a Tab press right after toggling can't cut it off.
    if (this.priorityActive && !priority) {
      setTimeout(() => this.speakSequence({ segments: valid, priority, onStart, onEnd, onError }), 50);
      return;
    }

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.bufferTimer) clearTimeout(this.bufferTimer);
    if (this.nextSegmentTimer) clearTimeout(this.nextSegmentTimer);
    this.stopHeartbeat();

    const seqId = ++this.sequenceId;

    this.debounceTimer = setTimeout(() => {
      // Flush any previous speech.
      this.synth.cancel();

      // Small buffer so Blink/WebKit can reset the audio thread.
      this.bufferTimer = setTimeout(() => {
        this.synth.resume();
        this.playSegment(valid, 0, seqId, priority, onStart, onEnd, onError);
      }, 40);
    }, 30);
  }

  private playSegment(
    segments: SpeechSegmentResolved[],
    index: number,
    seqId: number,
    priority?: boolean,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
  ) {
    if (seqId !== this.sequenceId) return;
    if (index >= segments.length) {
      this.stopHeartbeat();
      this.clearAnchor();
      if (priority) this.priorityActive = false;
      onEnd?.();
      return;
    }

    const seg = segments[index];
    const u = new SpeechSynthesisUtterance(seg.text);
    u.rate = this.rate;
    u.volume = 1;
    u.pitch = 1;

    const match = this.pickVoice(seg.bcp47, seg.families);
    if (match) {
      u.voice = match;
      u.lang = match.lang;
    } else {
      u.lang = seg.bcp47;
    }

    // Anchor to prevent GC mid-speech.
    this.activeUtterance = u;
    (window as unknown as { __kioskUtteranceAnchor?: SpeechSynthesisUtterance }).__kioskUtteranceAnchor = u;

    if (priority) this.priorityActive = true;

    u.onstart = () => {
      if (seqId !== this.sequenceId) return;
      this.startHeartbeat();
      if (index === 0) onStart?.();
    };

    u.onend = () => {
      if (seqId !== this.sequenceId) return;
      if (index + 1 < segments.length) {
        // Small pause between segments for natural cadence & voice switching
        this.nextSegmentTimer = setTimeout(() => {
          this.playSegment(segments, index + 1, seqId, priority, onStart, onEnd, onError);
        }, 50);
      } else {
        this.stopHeartbeat();
        this.clearAnchor();
        if (priority) this.priorityActive = false;
        onEnd?.();
      }
    };

    u.onerror = (e) => {
      if (seqId !== this.sequenceId) return;
      this.stopHeartbeat();
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("TTS error:", e.error);
      }
      this.clearAnchor();
      if (priority) this.priorityActive = false;
      onError?.();
    };

    this.synth.speak(u);
  }

  speak(req: {
    text: string;
    bcp47: string;
    families: string[];
    priority?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }) {
    this.speakSequence({
      segments: [{ text: req.text, bcp47: req.bcp47, families: req.families }],
      priority: req.priority,
      onStart: req.onStart,
      onEnd: req.onEnd,
      onError: req.onError,
    });
  }

  private clearAnchor() {
    this.activeUtterance = null;
    (window as unknown as { __kioskUtteranceAnchor?: SpeechSynthesisUtterance | null }).__kioskUtteranceAnchor = null;
  }

  stop() {
    this.sequenceId++;
    this.stopHeartbeat();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.bufferTimer) clearTimeout(this.bufferTimer);
    if (this.nextSegmentTimer) clearTimeout(this.nextSegmentTimer);
    this.synth.cancel();
    this.clearAnchor();
    this.priorityActive = false;
  }

  setRate(rate: number) {
    this.rate = Math.min(Math.max(rate, 0.7), 2.0);
  }
}

const controller =
  typeof window !== "undefined" && window.speechSynthesis ? new SpeechController() : null;

interface SpeakOpts {
  lang?: Lang; // speak in this language's voice instead of the active one
  force?: boolean; // speak even when Voice Guide is off (used by the toggle itself)
  priority?: boolean; // protect this utterance from being cancelled by other speech
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function useSpeech() {
  const { lang, voiceGuide } = useKiosk();
  useVoicesReady();

  const speak = useCallback(
    (content?: SpeechContent, opts: SpeakOpts = {}): boolean => {
      if ((!voiceGuide && !opts.force) || !content || !controller) return false;

      const rawSegments: SpeechSegment[] = Array.isArray(content)
        ? content
        : [{ text: content, lang: opts.lang }];

      const resolved: SpeechSegmentResolved[] = rawSegments
        .filter((s) => s.text && s.text.trim())
        .map((s) => {
          const l = s.lang ?? opts.lang ?? lang;
          const bcp = bcp47ForLang(l);
          return {
            text: s.text,
            bcp47: bcp,
            families: langFamiliesFor(bcp),
          };
        });

      if (resolved.length === 0) return false;

      controller.speakSequence({
        segments: resolved,
        priority: opts.priority,
        onStart: opts.onStart,
        onEnd: opts.onEnd,
        onError: opts.onError,
      });
      return true;
    },
    [lang, voiceGuide],
  );

  const cancel = useCallback(() => controller?.stop(), []);

  return { speak, cancel, enabled: voiceGuide };
}

interface ReadAloudOpts {
  lang?: Lang; // announce in a specific language's voice
  always?: boolean; // announce even when Voice Guide is off
  onEnd?: () => void; // called when this element finishes reading (e.g. to auto-advance)
}

/**
 * Speech-synchronized visual state (spec §5.3). While the bound text is spoken,
 * returns the class that lights the element:
 *   - "interactive" → yellow full-container glow (.is-active-reading)
 *   - "static"      → cyan text reading ring (.is-speech-reading)
 */
export function useReadAloud(
  content: SpeechContent | undefined,
  kind: "interactive" | "static",
  opts: ReadAloudOpts = {},
) {
  const { speak, enabled } = useSpeech();
  const [reading, setReading] = useState(false);

  const contentRef = useRef(content);
  contentRef.current = content;

  const onEnd = opts.onEnd;
  const start = useCallback(() => {
    if (!enabled && !opts.always) return;
    speak(contentRef.current, {
      lang: opts.lang,
      force: opts.always,
      onStart: () => setReading(true),
      onEnd: () => {
        setReading(false);
        onEnd?.();
      },
      onError: () => setReading(false),
    });
  }, [enabled, speak, opts.always, opts.lang, onEnd]);

  const stop = useCallback(() => setReading(false), []);

  const readingClass = reading ? (kind === "static" ? "is-speech-reading" : "is-active-reading") : "";

  return { start, stop, reading, readingClass, enabled };
}
