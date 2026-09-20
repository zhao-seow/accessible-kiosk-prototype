# Accessible Healthcare Kiosk UI Specification

**Target Hardware:** iPad in Landscape Mode (integrated into polyclinic/hospital kiosk consoles)

**Connected Peripherals:** External Hardware Keyboard, 2D Presentation Drop-Scanner, Thermal Receipt Printer

**Target User Groups:** Sighted seniors with low cognitive reserve, visually impaired (VI) and blind patients, users with motor impairments (tremors, spasticity, upper-limb temporary injuries).

## 1. System Architecture & Constraints

### 1.1 Physical & Peripheral Configuration

* **Display Orientation:** iPad Landscape (1024×768 pt / 1194×834 pt base grid).

* **Hardware Keyboard:** Plug-and-play USB/Bluetooth keyboard mounted on or directly beneath the kiosk ledge (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, Alphanumeric keys).

* **2D Presentation Drop-Scanner:** Presentation imager (e.g., Zebra/Honeywell OEM module) embedded below the display ledge. Functions as a direct USB keyboard wedge emitting alphanumeric keystrokes followed by an automatic carriage return (`Enter`).

* **Thermal Receipt Printer:** Dispenses physical paper queue tickets and receipts on demand.

* **Scope Exclusions (By Design):**

  * *No screen blanking / screen curtain*

  * *No dynamic reachability / screen compression mode*

  * *No closed captions or bottom subtitle tickers* (visual speech tracking utilizes native container hover/focus states for interactive elements, and focused reading rings for static text blocks).

### 1.2 Global Screen Chrome & Navigation Anchors

To establish a predictable mental model for both touch and screen-reader users, all screens adhere to a standardized navigation framework:

* **Top-Right Anchor — `[ Voice Guide: OFF / ON ]`:** Persistent toggle to activate or deactivate spoken screen reading and linear focus mode.

* **Top-Left / Header Area:** Dedicated to clinic branding on Step 1, and the primary screen heading (`<h1>`) on all subsequent screens.

* **Bottom-Left Anchor — `[ < Back ]`:** Returns to the immediate previous screen. Placed consistently at the bottom-left of the viewport footer across all multi-step screens (disabled or hidden on Step 1).

* **Bottom-Right Anchor — `[ Call Help ]` and `[ Start Over ]`:** Dedicated utility zone.

  * `[ Call Help ]`: Summons a roving clinic floor ambassador without cancelling user inputs.

  * `[ Start Over ]`: Resets the kiosk back to Step 1 (Language/NRIC) and purges session memory.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Screen Title (H1)                                 [ Voice Guide: OFF ] │
│                                                                        │
│                                                                        │
│                      [ Primary Content Area ]                          │
│                                                                        │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Focus Management & Heading-First Navigation Architecture

To prevent repetitive audio fatigue across multi-step kiosk workflows, the system implements a **Heading-First (`<h1>`) Focus Pattern** on all screens following Step 1:

1. **Initial Screen Entry Focus:**

   * When a patient navigates to any new screen (Step 2 onwards), programmatic focus lands directly on the main screen heading (`<h1 tabindex="-1">`).

   * The screen reader immediately speaks the page title and primary instructions, establishing instant situational awareness.

2. **Forward Navigation (`Tab`):**

   * Pressing `Tab` from the heading moves directly into the **Primary Content Area** (first interactive action card, questionnaire option, or input field).

   * Once the patient has navigated through the screen's core interactive options, continuing to press `Tab` moves down to the footer actions in logical sequence: **`[ < Back ]`** $\rightarrow$ **`[ Call Help ]`** $\rightarrow$ **`[ Start Over ]`**.

3. **Backward Navigation to Header Chrome (`Shift+Tab`):**

   * Pressing `Shift+Tab` from the initial landing point (`<h1>`) moves backward into the header utility zone directly to **`[ Voice Guide: ON/OFF ]`**.

```
                    ┌────────────────────────┐
                    │ New Screen Transition  │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │ Programmatic Focus on  │
                    │      <h1> Title        │
                    │   (Immediate Speech)   │
                    └───────┬────────┬───────┘
          Shift+Tab         │        │         Tab
    (Reverse Navigation)    │        │   (Forward Action)
            ┌───────────────┘        └───────────────┐
            ▼                                        ▼
┌────────────────────────┐              ┌────────────────────────┐
│      HEADER CHROME     │              │     PRIMARY TASKS      │
│  [ Voice Guide Toggle ]│              │   • Action Cards / Qs  │
└────────────────────────┘              └───────────┬────────────┘
                                                    │
                                                    ▼ Tab
                                        ┌────────────────────────┐
                                        │     FOOTER CHROME      │
                                        │   1. [ < Back ]        │
                                        │   2. [ Call Help ]     │
                                        │   3. [ Start Over ]    │
                                        └────────────────────────┘
```

## 2. Interaction Modes & Assistive Engine

### 2.1 Dual Interaction Profiles

The kiosk operates in two concurrent, non-conflicting interaction profiles:

```
                      ┌─────────────────────────────┐
                      │    Kiosk Idle / Active      │
                      └──────────────┬──────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            ▼                                                 ▼
┌───────────────────────┐                         ┌───────────────────────┐
│     STANDARD MODE     │                         │   VOICE GUIDE MODE    │
│  (Sighted / Motor)    │                         │    (VI / Blind / AT)  │
├───────────────────────┤                         ├───────────────────────┤
│ • Direct 1-tap action │                         │ • Linear DOM & TTS    │
│ • Long-press support  │                         │ • Explore-by-touch    │
│ • Tremor debounce     │                         │ • Double-tap activate │
│ • Large hitboxes      │                         │ • Element hover sync  │
└───────────────────────┘                         └───────────────────────┘
```

1. **Standard Mode (Sighted Seniors & Motor-Impaired Users):**

   * Direct single-tap activation for primary controls.

   * Minimalist screens with zero unnecessary instructional clutter.

   * Large, high-contrast targets (minimum 64×64 dp, recommended 80×80 dp+).

2. **Voice Guide / Screen Reader Mode (Visually Impaired & Blind Users):**

   * **Web App Standard Best Practice:** Operates strictly on standard web accessibility paradigms (WAI-ARIA semantics, programmatic focus management, and native roles). No specialized phone-banking numeric shortcuts.

   * **Speech-Synchronized Visual State (Interactive vs. Static Elements):**
     * **Interactive Controls (Buttons, Action Cards, Input Fields, Checkbox Tiles):** When spoken, the kiosk does *not* highlight inner text or add duplicate sub-element rings. Instead, the component's existing high-contrast **hover / active state** is applied directly to the outer container. This provides a unified, clear visual signal that the entire element is actionable.
     * **Static Informational Elements (`<h1>` Headings, Bill Summaries, Instructions):** When spoken, a dedicated high-contrast outline encapsulates the text block directly, visually tethering the speech output to the static content.

   * **Off-Screen Spoken Guidance Rule:** It is expected and permissible for the voice engine to speak helper text that does not appear visually on the screen (such as semantic roles, state announcements, and keyboard tips like *"Heading level 1"*, *"button"*, or *"Press Enter to select"*). While these off-screen phrases are vocalized, the visual focus or hover state remains steadily anchored to the associated interactive control or parent text block.

   * **Linear Keyboard Navigation:**

     * Users press `Tab` / `Shift+Tab` to traverse interactive elements.

     * On screen arrival (Step 2+), the voice engine reads `<h1>` immediately.

     * Forward `Tab` dives into interactive choices, then reaches `[ < Back ]`, followed by `[ Call Help ]` and `[ Start Over ]`. `Shift+Tab` moves backward from `<h1>` to access the persistent `Voice Guide` toggle.

     * Pressing `Enter` or `Space` activates the focused element.

   * **Activation:** Triggered via physical `Tab` key press, or by tapping the persistent on-screen `Voice Guide: OFF/ON` toggle button in the header.

   * **Deactivation Rules:**

     * **Touchscreen Deactivation (Direct Single-Tap Override):** The persistent `[ Voice Guide: ON/OFF ]` button in the top-right header bypasses assistive double-tap requirements. Even while Voice Guide mode is active, a single direct tap immediately deactivates Voice Guide.

     * **Keyboard Deactivation (`Escape` Double-Press):** A single press of `Escape` silences ongoing speech or closes an overlay. Pressing `Escape` **twice within 1.0 second** deactivates Voice Guide mode entirely, announcing: *"Voice Guide deactivated."*

     * **Session End Auto-Reset:** If a session completes or `Start Over` is activated, Voice Guide mode automatically resets to OFF so the next patient in line is not trapped in an unfamiliar assistive layer.

### 2.2 Motor & Tremor Filters

* **Long-Press Confirmation:** Touches held continuously between 300 ms and 1500 ms register as a single confirmed tap.

* **Tremor Debounce Filter:** Sliding or vibrating finger touches within a 20-pixel radius are normalized to a single focal coordinate.

* **Rapid Multi-Tap Suppression:** Duplicate taps occurring within 500 ms on the exact same button coordinate are discarded, eliminating accidental double-clicks or skipped screens.

* **Physical Keyboard & Focus Indicator Specification:**

  * `Tab` / `Shift+Tab`: Forward / backward linear navigation with a high-contrast 4px solid yellow focus ring (`#FFD700`) around the active component.

  * **Speech Feedback Visual State:**
    * **Interactive Elements:** When an interactive element (button, card, input) is read aloud, the component triggers its standard **hover / active visual state** (e.g., `#FFD700` border, elevated background contrast, subtle shadow elevation) directly on the full component container. No separate inner text highlight is used.
    * **Static Text Blocks:** While reading static content (e.g., `<h1>`, receipt breakdown rows), a high-contrast 4px solid cyan outline (`#00E5FF`) with an offset of `4px` wraps the active text block.

  * `Enter` / `Space`: Activates the currently focused control.

  * `Escape` (Single Press): Silences ongoing audio announcements or dismisses active overlays.

  * `Escape` + `Escape` (Double Press within 1s): Deactivates Voice Guide mode entirely.

## 3. End-to-End Screen-by-Screen Specifications

```
┌─────────────────────────────────────────────────────────────┐
│                           STEP 1                            │
│           Language Selection & NRIC Identification          │
│       (Touch / Keyboard / Drop-Scanner Barcode Input)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                           STEP 2                            │
│                    Primary Action Fork                      │
│             [ Clinic Appointment ]  │  [ Pay Bills ]        │
└──────────────┬──────────────────────┴───────────────┬───────┘
               │                                      │
               ▼                                      ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│       APPOINTMENT LOOKUP     │       │          BRANCH B1           │
│  (Confirm Today's Booking)   │       │       Bill Itemization       │
└──────────────┬───────────────┘       │    & Payment Mode Select     │
               │                       └──────────────┬───────────────┘
               ▼                                      │
┌──────────────────────────────┐                      ▼
│          STEP 3A             │       ┌──────────────────────────────┐
│    Travel Declaration (Q1)   │       │          BRANCH B2           │
│     [ YES ]     [ NO ]       │       │    Follow-Up Booking Slot    │
└──────────────┬───────────────┘       │    (Fasting Lab + Review)    │
               │                       └──────────────┬───────────────┘
               ▼                                      │
┌──────────────────────────────┐                      │
│          STEP 3B             │                      │
│    Symptom Checklist (Q2)    │                      │
│     [ Huge Button Grid ]     │                      │
└──────────────┬───────────────┘                      │
               │                                      │
               ▼                                      │
┌──────────────────────────────┐                      │
│          STEP 3C             │                      │
│    High Fever Check (Q3)     │                      │
│ [ YES ] [ NO ] [ NOT SURE ]  │                      │
└──────────────┬───────────────┘                      │
               │                                      │
               ▼                                      │
┌──────────────────────────────┐                      │
│          BRANCH A1           │                      │
│   Appointment Confirmation   │                      │
│     & Chit Delivery Mode     │                      │
└──────────────┬───────────────┘                      │
               │                                      │
               ▼                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  QUEUE CHIT / RECEIPT DELIVERY              │
│                [ Send via SMS ]  │  [ Print Paper ]         │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Language Selection & Identification

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ Polyclinic / Hospital Logo ]                   [ Voice Guide: OFF ]  │
│                                                                        │
│                                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌─────────┐ │
│   │   English    │   │     中文     │   │Bahasa Melayu │   │  தமிழ்  │ │
│   └──────────────┘   └──────────────┘   └──────────────┘   └─────────┘ │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                        │
│                                                                        │
│                       NRIC / ID NUMBER                                 │
│                                                                        │
│                 ┌───────────────────────────────┐                      │
│                 │   S 1 2 3 4 5 6 7 A           │                      │
│                 └───────────────────────────────┘                      │
│                                                                        │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│                                         [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Rationale & Design Decisions

* **Zero Visual Clutter:** No redundant instructions or virtual keyboards.

* **Full NRIC Exposure (No Masking):** Displays the full 9-character NRIC (`S1234567A`) directly in 48pt bold font for visual verification.

* **Visual State Feedback:** When speaking the introductory instruction, the static instruction text block receives the focused reading ring. As the user tabs or explores interactive elements (language buttons, NRIC input field), each control's native container hover/focus state triggers directly without inner text highlighting.

#### Input Behaviors & Screen Reader Traversal

1. **Drop-Scanner Path (Fastest / Recommended):**

   * The patient rests their physical NRIC, SAF 11B, or smartphone displaying the Singpass barcode face-down onto the illuminated physical scanner tray below the screen.

   * The scanner decodes the barcode instantly, fills the NRIC field, and fires an auto-`Enter`, advancing the session to Step 2 with zero screen taps needed.

2. **Physical Keyboard Path:**

   * The NRIC field is auto-focused upon screen mount.

   * Typing keystrokes appear immediately in the field and are echoed by the voice engine. Pressing `Enter` validates the NRIC format and submits.

3. **Screen Reader (`Tab` Order & Spoken State Mapping):**

   * **Focus Order (Initial Screen):** `Voice Guide Toggle` $\rightarrow$ `English` $\rightarrow$ `中文` $\rightarrow$ `Bahasa Melayu` $\rightarrow$ `தமிழ்` $\rightarrow$ `NRIC Input Field` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

   * **Voice Announcement on Screen Entry / Mode Activation:**

     > "Language selection. Use Tab to move through options and Enter to select, or scan your identity card or phone barcode face-down on the scanner below the screen." *(Visual ring wraps the language selection block).*

   * **Element Announcements on Focus:**

     * **Voice Guide Toggle:** *"Voice Guide, toggle button, checked. Press Enter to turn off."* *(Container hover/focus state active).*

     * **English:** *"English, button, currently selected. Press Enter to select."* *(Container hover/focus state on English button).*

     * **中文:** *"中文，按钮。按 Enter 键选择."* *(Container hover/focus state on Chinese button).*

     * **Bahasa Melayu:** *"Bahasa Melayu, butang. Tekan Enter untuk pilih."* *(Container hover/focus state on Malay button).*

     * **Tamil:** *"தமிழ், பொத்தான். தேர்ந்தெடுக்க Enter-ஐ அழுத்தவும்."* *(Container hover/focus state on Tamil button).*

     * **NRIC Input Field:** *"NRIC or ID number, edit text. Type your 9-character NRIC and press Enter, or scan your card on the scanner below."* *(Input box container enters active focus state).*

     * **Call Help:** *"Call Help, button. Press Enter to request staff assistance."* *(Container hover/focus state on Call Help button).*

     * **Start Over:** *"Start Over, button. Press Enter to reset the kiosk."* *(Container hover/focus state on Start Over button).*

### Step 2: Primary Action Fork

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>Welcome, MR TAN AH TECK</h1>                 [ Voice Guide: ON ]   │
│                                                                        │
│ What would you like to do today?                                       │
│                                                                        │
│      ┌───────────────────────────┐   ┌───────────────────────────┐     │
│      │                           │   │                           │     │
│      │        [ CLINIC ]         │   │         [ $ BILL ]        │     │
│      │                           │   │                           │     │
│      │     CLINIC APPOINTMENT    │   │         PAY BILLS         │     │
│      │         & CHECK-IN        │   │                           │     │
│      │                           │   │    Outstanding: $18.40    │     │
│      │                           │   │                           │     │
│      └───────────────────────────┘   └───────────────────────────┘     │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Rationale & Design Decisions

* **Heading-First Landing:** Focus lands directly on `<h1>Welcome, MR TAN AH TECK</h1>`.

* **Visual Tracking:** The static `<h1>` and subtitle text block receive the speech reading ring while spoken. When the user navigates forward into Card 1 or Card 2, the respective card's entire container activates its native hover/focus state—no internal text highlighting needed.

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>Welcome, MR TAN AH TECK</h1>` upon screen mount.

* **On Screen Entry:**

  > "Welcome, Mr. Tan Ah Teck. Heading level 1. What would you like to do today? Press Tab to navigate your options, or Shift-Tab to go to voice guide settings." *(Reading ring on `<h1>` title block).*

* **Forward `Tab` Order (From H1):**
  `Clinic Appointment Card` $\rightarrow$ `Pay Bills Card` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Reverse `Shift+Tab` Order (From H1):**
  `Voice Guide Toggle`.

* **Element Announcements on Focus:**

  * **Focus on Card 1 (Clinic Appointment):** *"Clinic Appointment and Check-In, button. Press Enter to check in for your appointment."* *(Container hover state on Card 1).*

  * **Focus on Card 2 (Pay Bills):** *"Pay Bills, button. Outstanding balance: eighteen dollars and forty cents. Press Enter to review and pay."* *(Container hover state on Card 2).*

  * **Focus on Back Button:** *"Back, button. Press Enter to return to language selection and ID entry."* *(Container hover state on Back button).*

### Step 3A: Travel Declaration (Question 1 of 3)

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>HEALTH DECLARATION (1 OF 3)</h1>              [ Voice Guide: ON ]  │
│                                                                        │
│ Have you travelled overseas in the last 14 days?                       │
│                                                                        │
│      ┌───────────────────────────┐   ┌───────────────────────────┐     │
│      │                           │   │                           │     │
│      │                           │   │                           │     │
│      │          YES              │   │           NO              │     │
│      │                           │   │                           │     │
│      │                           │   │                           │     │
│      └───────────────────────────┘   └───────────────────────────┘     │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>HEALTH DECLARATION (1 OF 3)</h1>`.

* **On Screen Entry:**

  > "Health declaration, question 1 of 3. Heading level 1. Have you travelled overseas in the last 14 days? Press Tab to choose Yes or No, or Shift-Tab to go to voice guide settings." *(Reading ring on `<h1>` static header).*

* **Forward `Tab` Order (From H1):**
  `YES` $\rightarrow$ `NO` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Reverse `Shift+Tab` Order (From H1):**
  `Voice Guide Toggle`.

* **Element Announcements on Focus:**

  * **Focus on YES:** *"Yes, button. Press Enter to select Yes and proceed to question 2."* *(Container hover state on YES button).*

  * **Focus on NO:** *"No, button. Press Enter to select No and proceed to question 2."* *(Container hover state on NO button).*

### Step 3B: Symptom Checklist (Question 2 of 3)

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>HEALTH DECLARATION (2 OF 3)</h1>              [ Voice Guide: ON ]  │
│                                                                        │
│ Do you currently have any of these symptoms?                           │
│                                                                        │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────┐ │
│  │      [ ] COUGH        │ │      [ ] FEVER        │ │ [ ] SORE      │ │
│  │                       │ │                       │ │     THROAT    │ │
│  └───────────────────────┘ └───────────────────────┘ └───────────────┘ │
│  ┌───────────────────────┐ ┌─────────────────────────────────────────┐ │
│  │   [ ] RUNNY NOSE      │ │      [X] NONE OF THE ABOVE              │ │
│  │                       │ │          (No symptoms today)            │ │
│  └───────────────────────┘ └─────────────────────────────────────────┘ │
│                                                                        │
│                 ┌────────────────────────────────┐                     │
│                 │          CONTINUE              │                     │
│                 └────────────────────────────────┘                     │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>HEALTH DECLARATION (2 OF 3)</h1>`.

* **On Screen Entry:**

  > "Health declaration, question 2 of 3. Heading level 1. Do you currently have any of these symptoms? Press Tab to review symptom options, or Shift-Tab to go to voice guide settings." *(Reading ring on `<h1>` static header).*

* **Forward `Tab` Order (From H1):**
  `Cough` $\rightarrow$ `Fever` $\rightarrow$ `Sore throat` $\rightarrow$ `Runny nose` $\rightarrow$ `None of the above` $\rightarrow$ `Continue` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Element Announcements on Focus:**

  * **Focus on Symptoms (e.g., Cough):** *"Cough, checkbox, unchecked. Press Space to toggle."* *(Container hover state on Cough tile).*

  * **Focus on None of the above:** *"None of the above, checkbox, checked. Press Space to toggle."* *(Container hover state on None of the above tile).*

  * **Focus on Continue:** *"Continue, button. Press Enter to proceed to question 3."* *(Container hover state on Continue button).*

### Step 3C: High Fever Check (Question 3 of 3)

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>HEALTH DECLARATION (3 OF 3)</h1>              [ Voice Guide: ON ]  │
│                                                                        │
│ Do you have a fever of 38°C or higher?                                 │
│                                                                        │
│   ┌─────────────────────┐ ┌─────────────────────┐ ┌──────────────────┐ │
│   │                     │ │                     │ │                  │ │
│   │        YES          │ │         NO          │ │   I'M NOT SURE   │ │
│   │                     │ │                     │ │                  │ │
│   └─────────────────────┘ └─────────────────────┘ └──────────────────┘ │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>HEALTH DECLARATION (3 OF 3)</h1>`.

* **On Screen Entry:**

  > "Health declaration, question 3 of 3. Heading level 1. Do you have a fever of 38 degrees Celsius or higher? Press Tab to select an option, or Shift-Tab to go to voice guide settings." *(Reading ring on `<h1>` static header).*

* **Forward `Tab` Order (From H1):**
  `YES` $\rightarrow$ `NO` $\rightarrow$ `I'M NOT SURE` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Element Announcements on Focus:**

  * *"Yes, button. Press Enter to select."* *(Container hover state on YES).*

  * *"No, button. Press Enter to select."* *(Container hover state on NO).*

  * *"I'm not sure, button. Press Enter to select."* *(Container hover state on I'M NOT SURE).*

### Branch A1: Existing Appointment Check-In

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>CLINIC APPOINTMENT</h1>                       [ Voice Guide: ON ]  │
│                                                                        │
│  • Time:     10:30 AM                                                  │
│  • Clinic:   Clinic 3B - General Medical                               │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│                                                                        │
│  GET YOUR QUEUE TICKET:                                                │
│                                                                        │
│      ┌───────────────────────────┐   ┌───────────────────────────┐     │
│      │                           │   │                           │     │
│      │        [ MOBILE ]         │   │         [ PRINTER ]       │     │
│      │                           │   │                           │     │
│      │       SEND VIA SMS        │   │       PRINT PAPER         │     │
│      │      TO 9123 1234         │   │          SLIP             │     │
│      │                           │   │                           │     │
│      └───────────────────────────┘   └───────────────────────────┘     │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>CLINIC APPOINTMENT</h1>`.

* **On Screen Entry:**

  > "Clinic appointment found. Heading level 1. Time: 10:30 AM, Clinic 3B, General Medical. Your queue number is A-104. How would you like to receive your queue ticket? Press Tab to choose ticket delivery, or Shift-Tab to go to voice guide settings." *(Reading ring on static appointment summary block).*

* **Forward `Tab` Order (From H1):**
  `Send via SMS` $\rightarrow$ `Print Paper Slip` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Element Announcements on Focus:**

  * **Focus on Send via SMS:** *"Send via SMS to mobile number 9123 1234, button. Press Enter to receive your queue ticket on your phone."* *(Container hover state on SMS card).*

  * **Focus on Print Paper Slip:** *"Print paper slip, button. Press Enter to print a paper ticket from the printer below."* *(Container hover state on Printer card).*

### Branch B1: Payment Flow (Itemized Review & Settlement)

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────┐
│ <h1>OUTSTANDING BILL DETAILS</h1>                 [ Voice Guide: ON ]  │
│                                                                        │
│  Consultation (General Medical):      $45.00                           │
│  Medication (Standard Subsidy):       $12.40                           │
│  Government Subsidy (CHAS / Pioneer): -$39.00                          │
│ ────────────────────────────────────────────────────────────────────── │
│  TOTAL AMOUNT DUE:                    $18.40                           │
│                                                                        │
│  SELECT PAYMENT METHOD:                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │
│  │   NETS / DEBIT   │  │   CREDIT CARD    │  │       PAYNOW QR       │ │
│  │   (Insert/Tap)   │  │   (Wave/Tap)     │  │     (Scan to Pay)     │ │
│  └──────────────────┘  └──────────────────┘  └───────────────────────┘ │
│                                                                        │
│ ────────────────────────────────────────────────────────────────────── │
│ [ < Back ]                              [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>OUTSTANDING BILL DETAILS</h1>`.

* **On Screen Entry:**

  > "Outstanding bill details. Heading level 1. Consultation: 45 dollars. Medication: 12 dollars and 40 cents. Government Pioneer Generation subsidy: minus 39 dollars. Total amount due is eighteen dollars and forty cents. Press Tab to select payment method, or Shift-Tab to go to voice guide settings." *(Reading ring on static itemized receipt table).*

* **Forward `Tab` Order (From H1):**
  `NETS / Debit` $\rightarrow$ `Credit Card` $\rightarrow$ `PayNow QR` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Element Announcements on Focus:**

  * **NETS / Debit:** *"NETS or Debit card, button. Press Enter to pay using the card reader below the shelf."* *(Container hover state on NETS button).*

  * **Credit Card:** *"Credit Card, button. Press Enter to pay using contactless tap on the terminal to the right of the keyboard."* *(Container hover state on Credit Card button).*

  * **PayNow QR:** *"PayNow QR, button. Press Enter to display dynamic SGQR code on screen to scan with your mobile banking app."* *(Container hover state on PayNow button).*

### Branch B2: Follow-Up Appointment Selection (Post-Payment Bundled Slots)

#### Visual Wireframe (iPad Landscape)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>SELECT FOLLOW-UP APPOINTMENT(S)</h1>                                 [ Voice: ON ] │
│ Note: Doctor requested Fasting Blood Lab + Review Consultation                         │
│                                                                                        │
│   ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐│
│   │        OPTION 1         │  │        OPTION 2         │  │        OPTION 3         ││
│   ├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤│
│   │ 1. Fasting Lab:         │  │ 1. Fasting Lab:         │  │ 1. Fasting Lab:         ││
│   │    2 Jan 2027 (Mon)     │  │    4 Jan 2027 (Wed)     │  │    5 Jan 2027 (Thu)     ││
│   │    8:05 AM              │  │    8:10 AM              │  │    8:00 AM              ││
│   │                         │  │                         │  │                         ││
│   │ 2. Consultation:        │  │ 2. Consultation:        │  │ 2. Consultation:        ││
│   │    13 Jan 2027 (Mon)    │  │    13 Jan 2027 (Mon)    │  │    14 Jan 2027 (Tue)    ││
│   │    8:00 AM              │  │    2:00 PM              │  │    8:00 AM              ││
│   │                         │  │                         │  │                         ││
│   │    [ Select Option 1 ]  │  │    [ Select Option 2 ]  │  │    [ Select Option 3 ]  ││
│   └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘│
│                                                                                        │
│ ────────────────────────────────────────────────────────────────────────────────────── │
│ [ < Back ]   [ Skip (Make Appt via HealthHub) ]         [ Call Help ]   [ Start Over ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Screen Reader Announcement & Focus Order

* **Initial Focus Landing:** Programmatic focus sets to `<h1>SELECT FOLLOW-UP APPOINTMENT(S)</h1>`.

* **On Screen Entry:**

  > "Payment successful. Select follow-up appointment. Heading level 1. The doctor has requested a Fasting Blood Lab and a Review Consultation. Three pre-arranged options are available. Press Tab to review options, or Shift-Tab to go to voice guide settings." *(Reading ring on `<h1>` static header).*

* **Forward `Tab` Order (From H1):**
  `Option 1` $\rightarrow$ `Option 2` $\rightarrow$ `Option 3` $\rightarrow$ `Skip` $\rightarrow$ `Back Button` $\rightarrow$ `Call Help` $\rightarrow$ `Start Over`.

* **Element Announcements on Focus:**

  * **Option 1:** *"Option 1: Fasting Lab on Monday, 2 January 2027 at 8:05 AM, and Doctor Consultation on Monday, 13 January 2027 at 8:00 AM. Select Option 1, button. Press Enter to book."* *(Container hover state on Option 1 card).*

  * **Option 2:** *"Option 2: Fasting Lab on Wednesday, 4 January 2027 at 8:10 AM, and Doctor Consultation on Monday, 13 January 2027 at 2:00 PM. Select Option 2, button. Press Enter to book."* *(Container hover state on Option 2 card).*

  * **Option 3:** *"Option 3: Fasting Lab on Thursday, 5 January 2027 at 8:00 AM, and Doctor Consultation on Tuesday, 14 January 2027 at 8:00 AM. Select Option 3, button. Press Enter to book."* *(Container hover state on Option 3 card).*

  * **Skip:** *"Skip follow-up booking and proceed to receipt, button. Press Enter to book later using the HealthHub app."* *(Container hover state on Skip button).*

## 4. Hardware & Software User Actions

| Scenario / Action | Sensory Trigger & Detection | System Action & Spoken Screen Reader Response | Fallback Action | 
 | ----- | ----- | ----- | ----- | 
| **User Presses `Start Over`** | Patient taps `[ Start Over ]` or presses `Enter` on Start Over. | Gentle double chime. Spoken: *"Session cancelled. Starting over."* | Immediately clears current NRIC session, resets Voice Guide to OFF, and returns to Step 1. | 
| **User Presses `Call Help`** | Patient taps `[ Call Help ]` button or presses `Enter` on Call Help. | Neutral chime. Amber banner appears: `Please wait, a staff ambassador will attend to you shortly.` Spoken: *"Assistance requested. A clinic ambassador has been notified and is coming to assist you."* | Flashes subtle status beacon on kiosk frame; transmits silent alert with kiosk ID to staff desk. | 

## 5. Implementation Recommendations for iPad Kiosk Shell

### 5.1 Heading-First Programmatic Focus (`tabindex="-1"`)

* Structure each screen so the main heading is marked as `<h1 tabindex="-1">`.

* When mounting a new screen view in the single-page application (SPA), fire `headingElement.focus({ preventScroll: true })`.

* This ensures the screen reader announces the title and current task immediately. Forward `Tab` navigates through `<main>`, hits `<footer>` starting with `[ < Back ]`, then `[ Call Help ]`, then `[ Start Over ]`. `Shift+Tab` from `<h1>` moves up into `<header>` to focus `[ Voice Guide ]`.

### 5.2 DOM Order for Header Chrome vs. Main Content vs. Footer

```html
<header>
  <!-- Voice Guide precedes H1 in DOM so Shift+Tab moves up into it naturally -->
  <button class="voice-guide-btn" role="switch" aria-checked="true">Voice Guide</button>
  <h1 id="screen-title" tabindex="-1">CLINIC APPOINTMENT</h1>
</header>
<main>
  <!-- Primary action cards / interactive inputs -->
</main>
<footer>
  <button class="back-btn" aria-label="Back">Back</button>
  <div class="utility-actions">
    <button class="call-help-btn">Call Help</button>
    <button class="start-over-btn">Start Over</button>
  </div>
</footer>
```

### 5.3 Speech-Synchronized Visual State & Audio Architecture

To provide clear, synchronized feedback without relying on closed caption banners or redundant inner text outlines, visual states adapt based on element type:

1. **Interactive Controls (Hover/Active State Reuse):**
   * When `speechSynthesis.speak(utterance)` begins for any interactive component (`<button>`, `<input>`, action card container), apply the class `.is-active-reading` directly to the **element container**.
   * Style `.is-active-reading` to mimic the element's `:hover` and `:focus-visible` styling (e.g., border color `#FFD700`, subtle elevation, background contrast shift).
   * **Do not highlight internal text:** The whole button or card glows as a single unit, reinforcing to low-vision users and caregivers that the entire surface is a clickable target.

```css
/* Interactive elements: speech triggers full-container active/hover styling */
.action-card.is-active-reading,
.btn-primary.is-active-reading,
.input-field.is-active-reading {
  border-color: #FFD700 !important;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.45);
  transform: translateY(-2px);
  transition: all 0.15s ease-in-out;
}

/* Static text elements: reading ring encapsulates the text block directly */
.static-text.is-speech-reading {
  outline: 4px solid #00E5FF !important; /* High-contrast cyan */
  outline-offset: 4px !important;
  border-radius: 8px;
  transition: outline 0.15s ease-in-out;
}
```

2. **Handling Off-Screen Instructional Text:**

   * Spoken strings often contain supplementary guidance not rendered on screen (e.g., semantic roles like *"button"*, or keyboard shortcuts like *"Press Enter to select"*).

   * **Rule:** When speaking supplementary text, bind the speech utterance directly to the parent visual container (such as the action card or input box). The `.is-active-reading` class remains active on that container for the full duration of the spoken sentence, providing visual grounding without requiring phantom DOM nodes.

3. **Audio Synthesis Stack:**

   * Leverage localized Web Speech API (`speechSynthesis`) or native AVFoundation speech engines (`en-SG`, `zh-SG`, `ms-MY`, `ta-SG`) for crisp, responsive spoken prompts.

   * Silencing logic (`window.speechSynthesis.cancel()`) must execute immediately on `keydown` of `Escape` or when navigating to another interactive node via `Tab` to prevent overlapping speech queues.

### 5.4 Physical Keyboard Integration

* Bind standard JavaScript `keydown` event listeners to window scope so that physical keyboard strokes (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, alphanumeric characters) navigate the DOM and control the interface without requiring prior mouse or touch focus.