The Web Speech API in Chromium and WebKit browsers has three well-documented architectural flaws that cause speech to freeze, stop midway, or throw random errors:

1. **JavaScript Garbage Collection (GC) mid-speech:** In long utterances, the browser garbage-collects the `SpeechSynthesisUtterance` instance while audio is still actively playing, which abruptly kills the playback thread.
2. **The 15-Second Chromium Stall Bug:** Chromium browsers have an internal bug where any speech lasting longer than ~15 seconds automatically pauses without firing an event.
3. **Rapid Event Queuing (Spamming Tab / Clicks):** Fast tabbing across kiosk buttons creates overlapping `.speak()` calls. If `.cancel()` and `.speak()` run too closely together, the internal audio thread enters a deadlock state.

---

### The Production Bulletproof Speech Controller

Replace scattered `window.speechSynthesis.speak()` calls with this self-healing singleton wrapper. It anchors the utterance to prevent garbage collection, keeps a 14-second heartbeat to prevent browser stalls, and debounces speech cancellations.

```javascript
class AccessibleKioskSpeechController {
  constructor() {
    this.synth = window.speechSynthesis;
    this.activeUtterance = null;
    this.heartbeatTimer = null;
    this.debounceTimer = null;
    this.rate = 1.15; // Set desired reading speed
  }

  // Prevents Chromium's 15-second pause bug
  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000); // Pulse resume every 10 seconds
  }

  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  speak(text, onComplete = null) {
    if (!text || !text.trim()) return;

    // 1. Debounce rapid calls (e.g. user rapid-tabbing through kiosk buttons)
    clearTimeout(this.debounceTimer);
    this._stopHeartbeat();

    this.debounceTimer = setTimeout(() => {
      // 2. Safely flush previous speech
      this.synth.cancel();

      // 3. Small buffer to allow audio pipeline to clean up
      setTimeout(() => {
        this.synth.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        utterance.volume = 1.0;
        utterance.pitch = 1.0;

        // Auto-select a local English voice
        const voices = this.synth.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith("en") && !v.localService === false) || 
                        voices.find(v => v.lang.startsWith("en")) || 
                        voices[0];
        if (enVoice) utterance.voice = enVoice;

        // CRITICAL: Global anchor to prevent garbage collection mid-speech
        this.activeUtterance = utterance;
        window.__kioskUtteranceAnchor = utterance;

        utterance.onstart = () => {
          this._startHeartbeat();
        };

        utterance.onend = () => {
          this._stopHeartbeat();
          this.activeUtterance = null;
          window.__kioskUtteranceAnchor = null;
          if (typeof onComplete === "function") onComplete();
        };

        utterance.onerror = (e) => {
          this._stopHeartbeat();
          // Suppress harmless 'canceled' or 'interrupted' logs from user navigation
          if (e.error !== "canceled" && e.error !== "interrupted") {
            console.warn("TTS Error encountered:", e.error);
          }
          this.activeUtterance = null;
          window.__kioskUtteranceAnchor = null;
        };

        this.synth.speak(utterance);
      }, 40); // 40ms buffer gives WebKit/Blink time to reset the thread
    }, 30);
  }

  stop() {
    this._stopHeartbeat();
    clearTimeout(this.debounceTimer);
    this.synth.cancel();
    this.activeUtterance = null;
    window.__kioskUtteranceAnchor = null;
  }

  setSpeed(newRate) {
    this.rate = Math.min(Math.max(newRate, 0.7), 2.0);
  }
}

// Initialize globally
window.kioskTTS = new AccessibleKioskSpeechController();

```

---

### How to Use It in Your Kiosk Views

Instead of calling `speechSynthesis.speak()` directly on button focus or view changes:

* **When a screen opens or an element gets focus:**
```javascript
// Reads the element smoothly without queue lockups
window.kioskTTS.speak("Clinic Appointment, button. Press Enter to select.");

```


* **When the user presses Escape or hits [Start Over] / [Back]:**
```javascript
// Instantly silences speech without throwing unhandled exceptions
window.kioskTTS.stop();

```



1. **Paste Speech Controller Class:** 1 min.
Add the `AccessibleKioskSpeechController` class above to your main utility or kiosk controller file.
*Verification:* Type `window.kioskTTS.speak("Speech engine online")` into your browser console.


2. **Replace Direct Calls:** 2 min.
Replace all `speechSynthesis.speak(...)` and `speechSynthesis.cancel()` invocations in your UI components with `window.kioskTTS.speak(...)` and `window.kioskTTS.stop()`.
*Verification:* Rapidly pressing `Tab` between buttons no longer freezes or crashes the audio engine.