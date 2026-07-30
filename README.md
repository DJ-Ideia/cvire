<div align="center">
  <br />
  <h1>📄 cvire — CV Builder Pro</h1>
  <p><strong>A Next-Generation, 100% Client-Side & Offline-First Resume Engineering Environment</strong></p>

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![Dexie IndexedDB](https://img.shields.io/badge/Dexie.js-IndexedDB-3178C6?logo=indexeddb&logoColor=white)](https://dexie.org)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  <br />
</div>

---

## 🌟 Overview

**`cvire`** is a state-of-the-art web application engineered for creating, customizing, ATS-optimizing, and exporting high-impact professional resumes. 

Designed with a **100% Client-Side & Offline-First** philosophy, all resume profiles, version histories, and settings are stored locally in your browser using IndexedDB. Zero backend dependencies, zero tracking, and absolute user privacy.

---

## 🚀 Key Features

### 🏢 Multi-Profile Dashboard
- **Relational IndexedDB Storage**: Create, duplicate, rename, archive, and delete unlimited resume profiles locally.
- **Search & Filters**: Instant search by title or candidate name; filter by favorites, archived status, or language (`en-US` / `pt-BR`).
- **Batch Export/Import**: Export all resumes in 1 click into a single backup JSON file (`cvire-backup-all.json`).
- **Pre-loaded Demo Templates**: 1-Click loading of ready-made sample profiles (Software Engineer, Product Designer, etc.).

### 📑 Paginated A4 Canvas & Visual Page Split Engine
- **Realistic A4 Paper Rendering**: Scaled at physical A4 dimensions (`210mm × 297mm` / `794px × 1123px` at 96 DPI).
- **Dynamic A4 Page Cut Indicators**: Live scroll height calculation rendering dashed red warning lines to prevent text from splitting across physical page breaks.
- **Viewport Controls**: Pan, zoom (50% to 150%), view mode switches (*Edit Only*, *Split 50/50*, *Preview Paper*).

### 🤖 Deterministic ATS Engine & Resume Linter
- **Weighted 0-100 ATS Score**: Benchmark score calculated against 6 weighted categories:
  - *Structure & Formatting* (20%)
  - *Keywords & Technical Terms* (25%)
  - *Quantified Metrics & Numbers* (20%)
  - *Strong Action Verbs* (15%)
  - *Summary & Word Count* (10%)
  - *Contact Completeness* (10%)
- **Resume Linter (ESLint for Resumes)**: Real-time diagnostics detecting anti-patterns (short summaries, passive voice, missing metrics, overused keywords).
- **ATS Robot Plain Text View**: Unstyled raw text parser view simulating how ATS scanners (Workday, Taleo, Greenhouse) read your resume.

### 🛡️ Web Crypto API Vault & BYOK AI Assistant
- **Local Key Encryption**: BYOK API Keys (Google Gemini) are encrypted locally using the browser's Web Crypto API (`SubtleCrypto` AES-GCM 256-bit) before storing in IndexedDB.
- **AI Bullet Enhancer**: 1-Click STAR method bullet point re-writer powered by Gemini 2.5 Flash.

### 🎯 Job Description Matcher Engine
- **Offline TF-IDF Keyword Matcher**: Compare your CV against any job posting description. Calculates Match Score %, lists matched keywords (green), and flags missing keywords (red).

### 🎨 Modular Templates & Theme Customizer
- **5 Professional Templates**:
  - `Modern Tech`: 2-column layout with sidebar & skill badges.
  - `Executive Classic`: Traditional 1-column layout for leadership roles.
  - `Minimalist Clean`: Ultra-clean layout prioritizing whitespace.
  - `Creative Accent`: Bold header banner layout for creative roles.
  - `Compact Single-Page`: High-density layout engineered to compress content into 1 page.
- **Theme Controls**: Primary color presets + custom hex picker, Google Fonts selector (*Inter, Roboto, Merriweather, Fira Code, Outfit, Poppins*), font scale (*sm, md, lg*), and line height controls.

### 📜 Version History & Side-by-Side CV Compare
- **Version Snapshots**: Save manual checkpoints in IndexedDB with commit notes and restore prior versions in 1 click.
- **Side-by-Side Comparison**: Dual-pane modal comparing metrics, ATS scores, and section word counts between two resumes.

---

## 🛠️ Tech Stack & Dependencies

- **Core**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS v4, Vanilla CSS Variables, Lucide React Icons
- **Database**: Dexie.js (IndexedDB wrapper)
- **State Management**: Zustand
- **PDF Generation**: `html2pdf.js`, `@media print` CSS
- **Security**: Web Crypto API (`window.crypto.subtle`)
- **AI Integration**: `@google/genai` (Google Gemini SDK)
- **Internationalization**: `i18next`, `react-i18next`

---

## ⚡ Quick Start (Local Setup)

```bash
# 1. Clone repository
git clone git@github.com:Jownao/cvire.git
cd cvire

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build
```

Then open `http://localhost:5173` in your browser.

---

## 📄 License

MIT License — feel free to fork, customize, and use `cvire` for your own resumes.
