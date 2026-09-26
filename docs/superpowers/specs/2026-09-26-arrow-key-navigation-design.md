# Arrow Key Navigation Design Specification

**Date:** 2026-09-26  
**Status:** In Review  
**Target Platform:** iPad Landscape Kiosk with Physical Hardware Keyboard  

---

## 1. Overview & Goals

The Accessible Healthcare Kiosk operates primarily via physical hardware keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`). While `Tab` and `Shift+Tab` provide linear traversal through DOM focus stops, senior and motor-impaired users frequently attempt to use **Arrow Keys (`↑`, `↓`, `←`, `→`)** to explore on-screen options naturally.

This specification defines a **Spatial 2D + Continuous Flow** keyboard navigation model that allows full traversal of the kiosk using only arrow keys, while respecting native text-caret editing inside text inputs.

---

## 2. Interaction Specifications

### 2.1 General Rules (All Screens)

1. **Directional Traversal (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`):**
   * Uses physical bounding boxes (`getBoundingClientRect`) of currently visible focusable elements to find the nearest candidate in the requested direction.
   * Multi-column / multi-row grids (such as the 6 symptom tiles in Step 3b) allow natural 2D navigation:
     * `ArrowLeft` / `ArrowRight` move horizontally across columns.
     * `ArrowUp` / `ArrowDown` move vertically across rows.

2. **Continuous Reading Flow at Boundaries (Tab-Fallbacks):**
   * **Row Start (`ArrowLeft` on leftmost item):** When no element exists further to the left in the current row, pressing `ArrowLeft` wraps backward to the previous element in DOM reading order (e.g. `English` $\rightarrow$ `Voice Guide Toggle`).
   * **Row End (`ArrowRight` on rightmost item):** When no element exists further to the right in the current row, pressing `ArrowRight` advances forward to the next element in DOM reading order (e.g. `தமிழ்` $\rightarrow$ `NRIC Input Field`).
   * **Top Zone (`ArrowUp` from main content):** Navigates up to the Header zone (`<h1>` heading or `Voice Guide Toggle`).
   * **Bottom Zone (`ArrowDown` from main content):** Navigates down to the Footer zone (`[ < Back ]`, `[ Call Help ]`, `[ Start Over ]`).

3. **Text Field Trapping Rule (`<input id="nric">`):**
   * **Horizontal Arrows (`ArrowLeft`, `ArrowRight`):** Trapped inside the input field to preserve standard text caret navigation and character editing. Does *not* jump focus out of the input.
   * **Vertical Arrows (`ArrowUp`, `ArrowDown`):** Break out of the input field:
     * `ArrowUp`: Navigates to the language selection row above (focusing the currently selected language button or nearest button).
     * `ArrowDown`: Navigates to the on-screen `Enter` button below.

---

## 3. Step 1 (Identification & Language Selection) Detailed Mapping

```
                                      ┌────────────────────────┐
                                      │ [ Voice Guide Toggle ] │
                                      └───────────▲────────────┘
                                                  │ ArrowUp (from any language)
                                                  │ ArrowLeft (from English)
┌──────────────┐     ┌──────────────┐     ┌───────┴──────┐     ┌──────────────┐
│   English    │ ──► │     中文     │ ──► │ Bahasa Melayu│ ──► │    தமிழ்     │
└──────────────┘     └──────────────┘     └──────────────┘     └───────┬──────┘
       │                                                               │ ArrowRight (acts as Tab)
       └───────────────────────────┬───────────────────────────────────┘
                                   │ ArrowDown (from any language)
                                   ▼
                   ┌───────────────────────────────┐
                   │       NRIC / ID Number        │
                   │  (Left/Right moves caret)     │
                   └───────────────┬───────────────┘
                                   │ ArrowDown
                                   ▼
                   ┌───────────────────────────────┐
                   │         Enter Button          │
                   └───────────────┬───────────────┘
                                   │ ArrowDown
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                                             [ Call Help ]    [ Start Over ] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Specific Transitions on Step 1:

| Current Focus | Key Pressed | Target Element | Behavior Rationale |
| :--- | :--- | :--- | :--- |
| **Voice Guide Toggle** | `ArrowDown` | Currently active language button (or `English`) | Drops into primary task |
| **English** | `ArrowLeft` | Voice Guide Toggle | Boundary fallback (previous in reading order) |
| **Any Language (`en`/`zh`/`ms`/`ta`)** | `ArrowUp` | Voice Guide Toggle | Explicit upward exit to header |
| **Any Language (`en`/`zh`/`ms`/`ta`)** | `ArrowDown` | NRIC Input Field | Physical downward progression |
| **தமிழ்** | `ArrowRight` | NRIC Input Field | Boundary fallback (acts as Tab key forward) |
| **NRIC Input Field** | `ArrowLeft` / `ArrowRight` | *Caret moves within text* | Trapped for text editing |
| **NRIC Input Field** | `ArrowUp` | Active Language button | Returns to language row |
| **NRIC Input Field** | `ArrowDown` | Enter Button | Drops to submission action |
| **Enter Button** | `ArrowUp` | NRIC Input Field | Moves back to input |
| **Enter Button** | `ArrowDown` | `Call Help` (Footer) | Drops to footer actions |
| **Footer Buttons** | `ArrowUp` | Enter Button | Returns to primary content |
| **Footer Buttons** | `ArrowLeft` / `ArrowRight` | Adjacent footer button | Horizontal navigation between utilities |

---

## 4. Multi-Step Screens (Step 2+, Branches, and Thank You)

1. **Header & Title (`<h1>`):**
   * On screens with `<h1>` heading focus, `ArrowDown` moves to the first interactive choice card or button.
   * `ArrowUp` or `ArrowLeft` on the first interactive choice returns focus to the `<h1>` or `Voice Guide Toggle`.

2. **Choice Grids (e.g. Step 3b Symptoms):**
   * `ArrowRight` from rightmost column wraps to the first item of the next row.
   * `ArrowLeft` from leftmost column wraps to the last item of the previous row (or `<h1>` if on row 1).
   * `ArrowDown` from the bottom-most row focuses the `Continue` button.
   * `ArrowDown` from `Continue` focuses the Footer (`[ < Back ]`).

3. **Footer Chrome:**
   * `[ < Back ]` $\leftrightarrow$ `[ Call Help ]` $\leftrightarrow$ `[ Start Over ]` navigable via `ArrowLeft` and `ArrowRight`.
   * `ArrowUp` from any footer button returns focus to the primary action area (last focused action card or primary button).

---

## 5. Technical Architecture

* **Hook:** `src/hooks/useKeyboard.ts` (expanded to include spatial arrow navigation handler).
* **Algorithm:**
  1. Captures global `keydown` events for `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`.
  2. If `activeElement` is `HTMLInputElement` and key is `ArrowLeft` or `ArrowRight`, let native browser handle caret.
  3. Otherwise, query visible focusable candidates:
     `'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'`
  4. Find current element's bounding rect:
     * Filter candidates strictly matching direction (e.g. `rect.left > current.left` for `ArrowRight`).
     * Calculate 2D distance score: `primaryAxisDistance + (crossAxisOffset * 1.5)`.
     * Focus nearest candidate.
  5. If no candidate exists in the requested direction (boundary reached):
     * If `ArrowLeft` $\rightarrow$ focus previous element in DOM focus order (`index - 1`).
     * If `ArrowRight` $\rightarrow$ focus next element in DOM focus order (`index + 1`).
     * If `ArrowUp` from top row $\rightarrow$ focus header/toggle.
     * If `ArrowDown` from bottom-most row $\rightarrow$ focus footer.
  6. Standard `onFocus` listeners automatically trigger visual glow (`.is-active-reading`) and Voice Guide announcements.

---

## 6. Self-Review & Verification Criteria

* [x] No conflict with standard `Tab` / `Shift+Tab` traversal.
* [x] NRIC text editing is preserved (cursor keys work inside `<input>`).
* [x] Up from language row focuses Voice Guide toggle.
* [x] Right from தமிழ் focuses NRIC input.
* [x] Down from NRIC focuses Enter button.
* [x] Works seamlessly across desktop and mobile/tablet responsive grid layouts.
