# Accessible Healthcare Kiosk Prototype

An accessible, interactive self-service healthcare kiosk prototype designed for clinic and hospital check-in, triage declarations, payments, and follow-up appointment management.

## 🔗 Live Application URL

- **Live Prototype URL**: [https://zhao-seow.github.io/accessible-kiosk-prototype/](https://zhao-seow.github.io/accessible-kiosk-prototype/)
- **Repository**: [https://github.com/zhao-seow/accessible-kiosk-prototype](https://github.com/zhao-seow/accessible-kiosk-prototype)

---

## 📋 Overview

This prototype demonstrates an inclusive and accessible interface for patient-facing healthcare kiosks. It is tailored to accommodate diverse accessibility needs—including low-vision users, elderly patients, keyboard/keypad users, and screen readers.

### Key Capabilities & User Flows

1. **Patient Identification**: Check in via NRIC / Fin number entry or simulated barcode/QR scanner.
2. **Action Fork**: Choose between clinic check-in or bill payment settlement.
3. **Health Declaration & Triage**:
   - Travel history screening
   - Multi-symptom checklist with accessible selection states
   - Fever / temperature verification
4. **Payment & Billing**:
   - Two-column itemized breakdown of consultation and medication charges
   - Real-time payment method selection (Credit/Debit card, contactless, NETS)
   - Step-by-step payment terminal guidance and payment confirmation
5. **Follow-Up Scheduling**: Choose preferred follow-up dates and doctor slots, or easily skip.
6. **Receipt Delivery**: Select preferred receipt mode (SMS, Email, or Printed Paper) with clinic directions and guidance modal.
7. **PWA / Kiosk Mode**: Configured as an installable Progressive Web App (PWA) for iPadOS / tablet kiosk deployment.

---

## ♿ Accessibility Features

- **Voice Guide (TTS)**: Built-in voice guidance reading out instructions and options at every step.
- **Keyboard & Physical Keypad Support**:
  - `Arrow` keys and number keys (`1`–`9`) to navigate options.
  - `Enter` or `Space` to select/confirm.
  - Press `Escape` twice within 1 second to toggle off the voice guide.
- **High-Contrast Design & Typography**: WCAG-compliant color contrasts, medical teal palette, clear font hierarchy, and large tap/click targets.
- **Screen Reader Announcements**: Live region (`aria-live`) announcements for state changes and form errors.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tooling**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) via GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or later)
- [pnpm](https://pnpm.io/) (v10 or later)

### Installation

```bash
# Clone the repository
git clone https://github.com/zhao-seow/accessible-kiosk-prototype.git
cd accessible-kiosk-prototype

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
```

The development server will run locally (typically at `http://localhost:8443` or `http://localhost:5173`).

### Production Build

```bash
pnpm build
```

This compiles optimized production assets into the `dist/` directory.

### Deployment

The repository is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys changes to GitHub Pages on every push to the `main` branch.

To preview or manually deploy:
```bash
pnpm deploy
```
