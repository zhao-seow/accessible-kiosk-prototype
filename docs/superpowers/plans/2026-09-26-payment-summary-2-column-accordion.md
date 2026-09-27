# Payment Summary 2-Column Layout with Accessible Medication Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the payment summary screen (`BranchB1Payment.tsx`) to a 2-column layout that fits fully on iPad 9 (1024x768) without vertical scrolling, with an accessible accordion for individual medication items that is collapsed by default if Voice Guide is ON, and expanded by default if Voice Guide is OFF.

**Architecture:** Split the view into a 2-column layout (Itemized Bill on the left, Total Due + Payment Methods on the right). Individual medication items are modeled in `SESSION.bill.medications` and rendered inside an accessible accordion component with ARIA attributes and Voice Guide auto-read integration.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Web Speech API (`useReadAloud`).

---

### Task 1: Update Copy and Session Data for Medication Items & Accordion

**Files:**
- Modify: `src/kiosk/copy.ts`

- [ ] **Step 1: Update Copy interface and SESSION object**
  Add `medications` array to `SESSION.bill`:
  - Paracetamol 500mg (20 tablets) — $4.20
  - Cetirizine 10mg (10 tablets) — $3.80
  - Promethazine Cough Syrup 100ml (1 bottle) — $4.40
  Add accordion copy tokens to `Copy` interface and all 4 dictionaries (`en`, `zh`, `ms`, `ta`):
  - `b1MedItemsCount: (n: number) => string`
  - `b1ExpandMeds: string`
  - `b1CollapseMeds: string`
  - `b1MedAccordionSpeech: (expanded: boolean) => string`

- [ ] **Step 2: Verify build compiles**
  Run: `pnpm build`
  Expected: PASS

---

### Task 2: Implement 2-Column Layout with Accessible Accordion in `BranchB1Payment.tsx`

**Files:**
- Modify: `src/screens/BranchB1Payment.tsx`

- [ ] **Step 1: Implement Accordion and 2-Column Layout**
  - Left column:
    - Itemized Bill Card
    - Consultation row
    - Medication summary row with Accordion button (`aria-expanded`, chevron icon)
    - Default state: `!voiceGuide` (collapsed when Voice Guide is ON, open when OFF)
    - Collapsible section rendering individual medication items with pill icon, dosage, and price
    - Sub-items are tab-focusable and have `useReadAloud`
    - When collapsed, auto-read chain skips sub-items and moves to Government Subsidy
    - Government Subsidy row
  - Right column:
    - Total Amount Due Card (`SESSION.bill.total`)
    - "Select payment method:" heading
    - Vertically stacked `ActionCard` for Credit/Debit Card and PayNow QR
  - Responsive iPad 9 sizing (`lg:grid-cols-12`, `gap-6`) ensuring all payment buttons are visible without scrolling

- [ ] **Step 2: Verify build and hot reload**
  Run: `pnpm build`
  Expected: PASS with 0 errors

---

### Task 3: Verify Keyboard, Voice Guide, and Visual Interaction

**Files:**
- Test in preview / browser: `http://localhost:8444/`

- [ ] **Step 1: Verify Voice Guide ON behavior**
  - Accordion starts collapsed
  - Auto-read announces: Consultation $\rightarrow$ Medication ($12.40, collapsed, press Enter to view 3 items) $\rightarrow$ Subsidy $\rightarrow$ Total $\rightarrow$ Payment methods
  - Pressing Enter expands accordion; individual items become tab-focusable and speak their details

- [ ] **Step 2: Verify Voice Guide OFF behavior**
  - Accordion starts expanded by default
  - User sees all medications immediately

- [ ] **Step 3: Verify iPad 9 viewport**
  - Test on 1024x768 viewport
  - Confirm payment buttons are completely visible without vertical scroll
