import { useEffect, useRef } from "react";
import { useKiosk } from "../kiosk/KioskContext";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "a[href]",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function isVisible(el: HTMLElement): boolean {
  if (!el.isConnected) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function handleSpatialArrowNavigation(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

  const current = document.activeElement as HTMLElement | null;

  // Text inputs: keep horizontal arrows for text caret movement
  if (current instanceof HTMLInputElement || current instanceof HTMLTextAreaElement) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      return;
    }
  }

  const focusables = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
  if (focusables.length === 0) return;

  // If no element or body is focused, focus the first interactive item
  if (!current || !focusables.includes(current) || current === document.body) {
    e.preventDefault();
    const first = e.key === "ArrowUp" || e.key === "ArrowLeft" ? focusables[focusables.length - 1] : focusables[0];
    if (first) {
      first.classList.add("is-keyboard-focus");
      first.addEventListener("blur", () => first.classList.remove("is-keyboard-focus"), { once: true });
      first.focus({ preventScroll: false });
    }
    return;
  }

  const currentIndex = focusables.indexOf(current);
  const currentRect = current.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2,
  };

  const isHeading =
    current.tagName === "H1" || current.getAttribute("data-screen-heading") === "true";

  let nextTarget: HTMLElement | null = null;

  if (isHeading) {
    // Screen title heading:
    // ArrowDown or ArrowRight moves forward into page content (e.g. first card or question)
    // ArrowUp or ArrowLeft moves backward to header controls (Voice Guide Toggle)
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      const contentElements = focusables.filter(
        (el) => el !== current && el.getBoundingClientRect().top >= currentRect.bottom - 15,
      );
      if (contentElements.length > 0) {
        nextTarget = contentElements[0];
      } else if (currentIndex < focusables.length - 1) {
        nextTarget = focusables[currentIndex + 1];
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      const headerElements = focusables.filter(
        (el) => el !== current && el.getBoundingClientRect().bottom <= currentRect.top + 15,
      );
      if (headerElements.length > 0) {
        nextTarget = headerElements[headerElements.length - 1];
      } else if (currentIndex > 0) {
        nextTarget = focusables[currentIndex - 1];
      }
    }
  } else if (e.key === "ArrowRight") {
    // Candidates must be strictly to the right AND share vertical overlap in the same row
    const candidates = focusables.filter((el) => {
      if (el === current) return false;
      const r = el.getBoundingClientRect();
      const isRight =
        r.left >= currentRect.right - 15 ||
        (r.left > currentRect.left + 20 && r.right > currentRect.right);
      const overlap = Math.min(currentRect.bottom, r.bottom) - Math.max(currentRect.top, r.top);
      return isRight && overlap > -10;
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const dxa = Math.max(0, ra.left - currentRect.right);
        const dxb = Math.max(0, rb.left - currentRect.right);
        const dya = Math.abs(ra.top + ra.height / 2 - currentCenter.y);
        const dyb = Math.abs(rb.top + rb.height / 2 - currentCenter.y);
        return dxa + dya * 1.5 - (dxb + dyb * 1.5);
      });
      nextTarget = candidates[0];
    } else {
      // Continuous reading flow fallback (advance to next element in DOM order)
      if (currentIndex < focusables.length - 1) {
        nextTarget = focusables[currentIndex + 1];
      }
    }
  } else if (e.key === "ArrowLeft") {
    // Candidates must be strictly to the left AND share vertical overlap in the same row
    const candidates = focusables.filter((el) => {
      if (el === current) return false;
      const r = el.getBoundingClientRect();
      const isLeft =
        r.right <= currentRect.left + 15 ||
        (r.right < currentRect.right - 20 && r.left < currentRect.left);
      const overlap = Math.min(currentRect.bottom, r.bottom) - Math.max(currentRect.top, r.top);
      return isLeft && overlap > -10;
    });

    if (candidates.length > 0) {
      candidates.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const dxa = Math.max(0, currentRect.left - ra.right);
        const dxb = Math.max(0, currentRect.left - rb.right);
        const dya = Math.abs(ra.top + ra.height / 2 - currentCenter.y);
        const dyb = Math.abs(rb.top + rb.height / 2 - currentCenter.y);
        return dxa + dya * 1.5 - (dxb + dyb * 1.5);
      });
      nextTarget = candidates[0];
    } else {
      // Continuous reading flow fallback (retreat to previous element in DOM order)
      if (currentIndex > 0) {
        nextTarget = focusables[currentIndex - 1];
      }
    }
  } else if (e.key === "ArrowDown") {
    // Candidates physically below the current element
    const candidates = focusables.filter((el) => {
      if (el === current) return false;
      const r = el.getBoundingClientRect();
      return (
        r.top >= currentRect.bottom - 15 ||
        (r.top >= currentRect.top + 20 && r.bottom > currentRect.bottom + 20)
      );
    });

    if (candidates.length > 0) {
      // If moving down from Voice Guide Toggle, prioritize active language button if on Step 1
      const activeBtn = candidates.find((el) => el.getAttribute("aria-pressed") === "true");
      const minTop = Math.min(...candidates.map((c) => c.getBoundingClientRect().top));
      const closestRow = candidates.filter(
        (c) => c.getBoundingClientRect().top <= minTop + 35,
      );

      if (activeBtn && closestRow.includes(activeBtn)) {
        nextTarget = activeBtn;
      } else {
        closestRow.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const dxa = Math.abs(ra.left + ra.width / 2 - currentCenter.x);
          const dxb = Math.abs(rb.left + rb.width / 2 - currentCenter.x);
          return dxa - dxb;
        });
        nextTarget = closestRow[0];
      }
    } else {
      if (currentIndex < focusables.length - 1) {
        nextTarget = focusables[currentIndex + 1];
      }
    }
  } else if (e.key === "ArrowUp") {
    // Candidates physically above the current element
    const candidates = focusables.filter((el) => {
      if (el === current) return false;
      const r = el.getBoundingClientRect();
      return (
        r.bottom <= currentRect.top + 15 ||
        (r.bottom <= currentRect.bottom - 20 && r.top < currentRect.top - 20)
      );
    });

    if (candidates.length > 0) {
      // If moving up from an input (e.g. NRIC), prioritize the active language button above it
      const activeBtn = candidates.find((el) => el.getAttribute("aria-pressed") === "true");
      if (current instanceof HTMLInputElement && activeBtn) {
        nextTarget = activeBtn;
      } else {
        const maxBottom = Math.max(...candidates.map((c) => c.getBoundingClientRect().bottom));
        const closestRow = candidates.filter(
          (c) => c.getBoundingClientRect().bottom >= maxBottom - 35,
        );
        closestRow.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const dxa = Math.abs(ra.left + ra.width / 2 - currentCenter.x);
          const dxb = Math.abs(rb.left + rb.width / 2 - currentCenter.x);
          return dxa - dxb;
        });
        nextTarget = closestRow[0];
      }
    } else {
      if (currentIndex > 0) {
        nextTarget = focusables[currentIndex - 1];
      }
    }
  }

  if (nextTarget && nextTarget !== current) {
    e.preventDefault();
    document.querySelectorAll(".is-keyboard-focus").forEach((el) => {
      el.classList.remove("is-keyboard-focus");
    });
    nextTarget.classList.add("is-keyboard-focus");
    nextTarget.addEventListener(
      "blur",
      () => nextTarget?.classList.remove("is-keyboard-focus"),
      { once: true },
    );
    try {
      (nextTarget as any).focus({ preventScroll: false, focusVisible: true });
    } catch {
      nextTarget.focus({ preventScroll: false });
    }
  }
}

/**
 * Global keyboard behaviour (spec §2.2):
 *  - Escape (single): silence ongoing speech.
 *  - Escape twice within 1s: deactivate Voice Guide entirely.
 *  - Arrow keys: Spatial 2D + continuous flow navigation with high-contrast focus rings.
 */
export function useGlobalKeyboard(onVoiceGuideOff: () => void) {
  const { voiceGuide } = useKiosk();
  const lastEsc = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.speechSynthesis?.cancel();
        const now = Date.now();
        if (voiceGuide && now - lastEsc.current < 1000) {
          onVoiceGuideOff();
          lastEsc.current = 0;
        } else {
          lastEsc.current = now;
        }
        return;
      }

      handleSpatialArrowNavigation(e);
    };

    const onPointerDown = () => {
      // Clear keyboard focus indicator when user switches to touch or pointer
      document.querySelectorAll(".is-keyboard-focus").forEach((el) => {
        el.classList.remove("is-keyboard-focus");
      });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [voiceGuide, onVoiceGuideOff]);
}
