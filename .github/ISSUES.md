# Project Issue Tracker (`cvire`)

> **Repository:** `git@github.com:Jownao/cvire.git`  
> **Status Legend:** `[ ] Open` | `[x] Completed` | `[~] In Progress`

---

## 🎯 Implementation Issues (Vertical Slices)

### Issue #1: Project Scaffolding & Configuration Setup
- **Type:** AFK
- **Blocked by:** None
- **Status:** [x] Completed
- **What to build:** Configure Vite + React 19 + TypeScript + Tailwind CSS v4 design tokens, CSS reset, and `@page A4` print rules.
- **Acceptance criteria:**
  - [x] Vite dev server compiles without warnings.
  - [x] Tailwind CSS v4 variables available globally in `src/index.css`.
  - [x] Clean project directory structure.

---

### Issue #2: Domain Types, Dexie.js Relational Database & Zustand State Layer
- **Type:** AFK
- **Blocked by:** Issue #1
- **Status:** [x] Completed
- **What to build:** Core domain TypeScript schemas (`CVProfile`, `CVSection`, `SectionItem`, `BulletItem`, `ThemeSettings`, `CVVersion`), IndexedDB Dexie tables (`profiles`, `versions`, `encryptedKeys`), Zustand `useCVStore`, and seed data for demo profiles.
- **Acceptance criteria:**
  - [x] Relational schema initialized in Dexie `cvDatabase.ts`.
  - [x] Initial demo profiles (Software Engineer, UI/UX Designer, Product Manager) auto-seeded on first load.
  - [x] Zustand store providing reactive CRUD methods.

---

### Issue #3: Multi-Profile Dashboard Component
- **Type:** AFK
- **Blocked by:** Issue #2
- **Status:** [x] Completed
- **What to build:** Dashboard view listing saved CV profiles in a card grid with search, language filters, favorite/archive tabs, quick clone, delete, batch JSON export, and demo template picker.
- **Acceptance criteria:**
  - [x] Users can create new empty resumes or load demo profiles in 1 click.
  - [x] Search bar filters profiles instantly by title or candidate name.
  - [x] Batch operations allow multi-selecting and exporting/deleting profiles.

---

### Issue #4: Dynamic Section & Bullet Point Drag-and-Drop Editor
- **Type:** AFK
- **Blocked by:** Issue #3
- **Status:** [x] Completed
- **What to build:** Form editors for Personal Info, Summary, and dynamic sections (Experience, Education, Skills, Languages, Projects, Custom) with item-level `bulletItems[]`.
- **Acceptance criteria:**
  - [x] Sections can be dragged up/down or assigned to Main/Sidebar columns.
  - [x] Bullet points inside experience items can be edited individually.
  - [x] Real-time two-way data binding updates active profile state in IndexedDB.

---

### Issue #5: Paginated A4 Canvas & Viewport Controls
- **Type:** AFK
- **Blocked by:** Issue #4
- **Status:** [x] Completed
- **What to build:** Interactive canvas rendering standard A4 paper dimensions (`794px × 1123px`), calculating live element height breaks, displaying virtual page split lines, and providing zoom (50%-150%) + view mode toggles (Edit, Split, Preview).
- **Acceptance criteria:**
  - [x] Visual A4 paper sheet rendered with realistic shadows.
  - [x] Dashed page break lines indicate physical page splits dynamically.
  - [x] Viewport toolbar supports pan, zoom, and 50/50 split view.

---

### Issue #6: Base DOM Templates (Modern Tech, Executive Classic, Minimalist Clean)
- **Type:** AFK
- **Blocked by:** Issue #5
- **Status:** [x] Completed
- **What to build:** Implement React DOM renderers for 3 core templates (`ModernTechTemplate`, `ExecutiveClassicTemplate`, `MinimalistCleanTemplate`) bound to dynamic `ThemeSettings` (colors, font family, scale, margins, line-height).
- **Acceptance criteria:**
  - [x] 3 distinct templates rendering resume data accurately.
  - [x] Changing primary color, font family, or spacing immediately re-renders template styling.

---

### Issue #7: Deterministic ATS Engine & Resume Linter
- **Type:** AFK
- **Blocked by:** Issue #6
- **Status:** [x] Completed
- **What to build:** 0-100 weighted ATS score gauge and ESLint-style Resume Linter evaluating structure, keywords, quantitative metrics, action verbs, summary length, and date consistency.
- **Acceptance criteria:**
  - [x] ATS score calculated instantly (0-100) with breakdown drawer.
  - [x] Linter highlights specific anti-patterns with actionable tips.

---

### Issue #8: ATS Plain Text Preview & Keyword Heatmap Overlay
- **Type:** AFK
- **Blocked by:** Issue #7
- **Status:** [x] Completed
- **What to build:** Unstyled text parser view simulating ATS scanners (Workday, Taleo, Greenhouse) and Keyword Heatmap overlay highlighting matched (green), overused (orange), and missing (red) keywords.
- **Acceptance criteria:**
  - [x] ATS Plain Text view displays extracted text sequence accurately.
  - [x] Heatmap toggle highlights keyphrase density directly on paper canvas.

---

### Issue #9: Encrypted Web Crypto Key Vault & BYOK AI Assistant
- **Type:** AFK
- **Blocked by:** Issue #8
- **Status:** [x] Completed
- **What to build:** Web Crypto API (`SubtleCrypto` AES-GCM 256-bit) vault storing BYOK keys securely in IndexedDB, and client-side Google Gemini / OpenAI integration for STAR method bullet point enhancement.
- **Acceptance criteria:**
  - [x] API keys encrypted locally using AES-GCM before database write.
  - [x] "Improve with AI" capability configured via BYOK.

---

### Issue #10: Offline & AI Job Matcher Engine
- **Type:** AFK
- **Blocked by:** Issue #9
- **Status:** [x] Completed
- **What to build:** TF-IDF / N-gram keyword extraction comparing Job Description text against CV content, displaying Match Score %, matched keywords, missing keywords, and optional AI gap analysis.
- **Acceptance criteria:**
  - [x] Offline matching operates instantly without API key requirement.
  - [x] Lists exact missing target keywords from job posting.

---

### Issue #11: Auto-Fit Engine
- **Type:** AFK
- **Blocked by:** Issue #10
- **Status:** [x] Completed
- **What to build:** Iterative font scale and line height calculation algorithm to fit document content into exactly 1 or 2 A4 pages without overflow.
- **Acceptance criteria:**
  - [x] 1-Click "Fit to 1 Page" automatically compresses font scale and margins cleanly.

---

### Issue #12: Dual PDF Export Engine & JSON Exporters
- **Type:** AFK
- **Blocked by:** Issue #11
- **Status:** [x] Completed
- **What to build:** High-fidelity PDF generation via `html2pdf.js`, JSON Resume standard format export, and `@media print` fallback.
- **Acceptance criteria:**
  - [x] PDF generated directly in browser.
  - [x] JSON format export and import validated.
