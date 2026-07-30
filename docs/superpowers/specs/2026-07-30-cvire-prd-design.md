# PRD & Architectural Blueprint: CV Builder Pro (`cvire`)

## 1. Executive Summary & Vision

`cvire` is an advanced, offline-first, 100% client-side web application engineered for creating, customizing, ATS-optimizing, and exporting high-impact professional resumes. 

It evolves the core concept of traditional CV builders into a comprehensive **Resume Engineering Environment**. Key highlights include:
- **Offline-First Privacy**: Zero backend requirement. All resume profiles, version histories, and settings are stored locally in IndexedDB.
- **Client-Side Security**: BYOK (Bring Your Own Key) for AI capabilities (Google Gemini / OpenAI), encrypted locally via the browser's Web Crypto API (`SubtleCrypto`).
- **Real-Time A4 Pagination & Auto-Fit Engine**: Visual canvas calculating physical A4 boundaries (`210mm × 297mm`) with dynamic line-split indicators and automated spacing/font scaling.
- **Hybrid Vector & Raster PDF Engine**: Vector-perfect PDF generation via `@react-pdf/renderer` alongside print CSS and high-fidelity canvas fallbacks.
- **Deep ATS Intelligence & Resume Linter**: Built-in 0-100 ATS scoring algorithm, static Resume Linter (ESLint-style rules for CVs), ATS Plain Text Preview, and Keyword Heatmap.
- **Job Matching Engine**: Local N-gram/TF-IDF job description comparison with optional AI-assisted semantic matching and bullet point enhancement.
- **Marketplace-Ready Template SDK**: Decoupled template contracts allowing seamless addition of custom templates and future extension packs.

---

## 2. Technical Stack & Security Architecture

### Core Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 19 + TypeScript + Vite | High-performance, strictly typed component architecture. |
| **Styling & UI Tokens** | Tailwind CSS v4 + Custom CSS Variables | Design tokens, dark mode aesthetic, layout density, print stylesheets. |
| **Local Persistence** | Dexie.js (IndexedDB wrapper) | Client-side relational database for profiles, version histories, and settings. |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | Section ordering, item reordering, and item-level bullet point drag & drop. |
| **PDF Generation** | `@react-pdf/renderer` + `html2pdf.js` / `@media print` | Vector PDF generation, canvas image fallback, and native browser print. |
| **State Management** | Zustand (with immer middleware) | Reactive UI state, editor transient changes, and canvas viewport controls. |
| **Icons & Primitives** | `lucide-react` | Unified icon set across editor, dashboard, and template designs. |
| **Security & Crypto** | Web Crypto API (`SubtleCrypto` AES-GCM) | Local encryption of BYOK API Keys before storing in IndexedDB. |
| **AI Integration** | `@google/genai` / OpenAI Client | Client-side BYOK requests for AI bullet enhancements & job matching. |
| **Internationalization** | i18next + react-i18next | Multi-locale UI, section headers, date formatters, and ATS dictionaries. |

### Security & BYOK Storage Strategy
API Keys (Gemini/OpenAI) are **NEVER** stored in plain text in `localStorage`. 
1. Upon key entry, an AES-GCM 256-bit encryption key is generated using `window.crypto.subtle.generateKey`.
2. The key is stored in IndexedDB under non-extractable flags, or derived using PBKDF2 from a local client salt.
3. API requests decrypt the key in-memory only at the moment of execution.

---

## 3. Implementation Roadmap (Phases 1 to 5)

```
Phase 1: MVP Core (IndexedDB, Editor, A4 Canvas, 3 Base Templates, Print/PDF)
   │
Phase 2: Deep ATS & Resume Intelligence (ATS Score 0-100, Linter, ATS Preview, Local Stats)
   │
Phase 3: Job Matching & AI BYOK (Offline Job Matcher, Gemini/OpenAI BYOK, Web Crypto, Bullet AI)
   │
Phase 4: Advanced Customization & Versioning (Auto-Fit, Version Diffing, Side-by-Side Compare)
   │
Phase 5: Template Marketplace SDK & Polish (Decoupled Template Contracts, Batch Import/Export)
```

### Phase 1: MVP Core Architecture
- Multi-profile Dexie.js database schema & CRUD dashboard.
- Responsive Editor & WYSIWYG A4 Paginated Canvas (`794px × 1123px`).
- Drag-and-drop section ordering & item management via `@dnd-kit`.
- 3 Core Templates: *Modern Tech*, *Executive Classic*, *Minimalist Clean*.
- Exporting: JSON Resume export/import + `@media print` PDF fallback.

### Phase 2: ATS Engine & Resume Intelligence
- Deterministic ATS Scoring engine (0-100) with weighted scoring categories.
- **Resume Linter**: ESLint-like rules engine for detecting CV anti-patterns.
- **ATS Preview View**: Plain-text parse view simulating Taleo/Workday scanners.
- **Local Resume Analytics**: Word counts, reading time, action verb density, metric counts.

### Phase 3: AI BYOK & Job Matching Engine
- Encrypted BYOK key vault using Web Crypto API.
- Offline Job Matcher (TF-IDF keyword extraction & keyword overlap %).
- AI-assisted Job Matcher (semantic gaps & missing skills recommendations).
- AI Bullet Point Enhancer (STAR method prompt execution).

### Phase 4: Version Control & Advanced Design Systems
- **Version History**: Snapshots in IndexedDB, restore version, visual diff viewer.
- **Side-by-Side CV Comparison**: Compare 2 CV profiles or 2 versions of the same CV.
- **Auto-Fit Engine**: Automatic iterative font scale and line-height reduction algorithm.
- Expanded `ThemeSettings` (borders, dividers, headers, photo shapes, column gaps).

### Phase 5: Template SDK & Marketplace Readiness
- Formalize `TemplateManifest` & `TemplateContract` interfaces.
- 2 Additional Templates: *Creative Accent*, *Compact Single-Page*.
- Batch Export/Import (zip/multi-JSON backup).
- Internationalization expansion (Multi-locale date formatting & regional ATS rulebooks).

---

## 4. Domain Data Model & Enhanced Schemas

```typescript
export type SectionType = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certifications'
  | 'custom';

export type TemplateId = 
  | 'modern-tech'
  | 'executive-classic'
  | 'minimalist-clean'
  | 'creative-accent'
  | 'compact-single'
  | string; // Extensible for custom marketplace templates

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  photoUrl?: string;
  photoFormat: 'circle' | 'rounded' | 'square' | 'hidden';
}

export interface BulletItem {
  id: string;
  text: string;
  enabled: boolean;
  isMetricHighlighted?: boolean;
}

export interface SectionItem {
  id: string;
  title: string;           // E.g. "Senior Frontend Engineer" or "Computer Science B.S."
  subtitle?: string;        // E.g. "Acme Corp" or "University of São Paulo"
  location?: string;        // E.g. "São Paulo, SP (Remote)"
  startDate?: string;       // ISO or "Jan 2022"
  endDate?: string;         // ISO, "Present", or "Dec 2023"
  current?: boolean;
  bulletItems: BulletItem[]; // Array of bullets for granular DnD & AI re-writing
  tags?: string[];          // E.g. ["React", "TypeScript", "GraphQL"]
  linkUrl?: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;            // E.g. "Work Experience" / "Experiência Profissional"
  column: 'main' | 'sidebar';
  visible: boolean;
  items: SectionItem[];
}

export interface ThemeSettings {
  primaryColor: string;     // Hex code
  accentColor: string;      // Secondary accent
  textColor: string;        // Body text color
  backgroundColor: string;  // Paper background
  fontFamily: 'Inter' | 'Roboto' | 'Merriweather' | 'Fira Code' | 'Outfit' | 'Poppins';
  fontSizeScale: 'sm' | 'md' | 'lg';
  lineHeight: number;       // Range 1.15 to 1.75
  columnGap: number;        // Range 12px to 48px
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  pageMargins: 'compact' | 'normal' | 'spacious';
  borderRadius: number;     // Range 0px to 16px
  headerStyle: 'classic' | 'centered' | 'banner' | 'minimal-sidebar' | 'split-card';
  dividerStyle: 'solid' | 'dashed' | 'double' | 'subtle' | 'none';
  bulletStyle: 'disc' | 'square' | 'arrow' | 'check' | 'none';
  textAlignment: 'left' | 'justify';
}

export interface CVVersion {
  versionId: string;
  timestamp: number;
  commitNote?: string;
  dataSnapshot: Omit<CVProfile, 'versionHistory'>;
}

export interface CVProfile {
  id: string;               // UUID
  title: string;            // E.g. "CV Frontend Engineer - US Remote"
  language: 'pt-BR' | 'en-US';
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  templateId: TemplateId;
  personal: PersonalInfo;
  summary: string;
  sectionsOrder: string[];
  sections: Record<string, CVSection>;
  theme: ThemeSettings;
  versionHistory?: CVVersion[];
}
```

---

## 5. ATS Engine, Scoring, Linter & Job Matcher

### ATS Scoring Breakdown (0 - 100 Scale)
The offline ATS engine evaluates the resume using a deterministic weighted matrix:

| Category | Weight | Criteria Evaluated |
| :--- | :--- | :--- |
| **Structure & Formatting** | 20% | Standard section headers, no missing essential sections, standard date formats. |
| **Keywords & Relevance** | 25% | Industry keyphrase presence, tech stack tags, technical keyword density. |
| **Metrics & Quantification**| 20% | Percentage of bullets containing numbers, `$`, `%`, or quantifiable metrics. |
| **Action Verbs** | 15% | Percentage of bullets beginning with strong active verbs (e.g. *Spearheaded, Developed*). |
| **Length & Summary** | 10% | Professional summary length (optimal 40-120 words), total word count (400-900 words). |
| **Contact Completeness** | 10% | Valid email format, phone number, location, LinkedIn URL present. |

### Resume Linter Rules (ESLint for Resumes)
The static Linter runs in real-time, outputting actionable diagnostics categorised as `error`, `warning`, or `info`:

1. `summary-length-check`: Flags summaries < 30 or > 150 words.
2. `missing-action-verb`: Triggers if a bullet point does not start with a recognized action verb.
3. `bullet-length-excess`: Flags bullet points longer than 35 words.
4. `lack-of-quantification`: Triggers if an experience entry has 3+ bullets without any numerical metric.
5. `overused-keywords`: Identifies words repeated more than 6 times across the document.
6. `inconsistent-date-format`: Flags mixed date representations (e.g., "01/2022" vs "Jan 2022").
7. `passive-voice-detected`: Flags passive phrasing (e.g., "was responsible for").

### ATS Plain Text Preview & Keyword Heatmap
- **ATS Preview**: Displays an unstyled raw text representation parsed sequentially by section, simulating ATS parser output (Workday, Greenhouse, Taleo).
- **Keyword Heatmap Overlay**:
  - 🟢 **Green**: Critical keywords matched from job description.
  - 🟠 **Orange**: Overused words requiring variation.
  - 🔴 **Red Outline**: Job description target keywords missing from the CV.

---

## 6. A4 Page Break & Auto-Fit Engine

### Physical A4 Page Calculation
- **A4 Aspect Ratio**: `210mm × 297mm` (1 : 1.414).
- **Canvas Resolution**: `794px × 1123px` at 96 DPI standard scale.
- **Page Break Algorithm**: 
  - The preview wrapper observes DOM element offset heights.
  - When container height exceeds `N * 1123px`, a virtual page boundary line is rendered.
  - Padding adjustments enforce page margin boundaries.

### Auto-Fit Engine Algorithm
When activated by the user ("Fit to 1 Page" or "Fit to 2 Pages"):
1. Measures current DOM scroll height `H_total` against target target height `H_target = N * 1123px`.
2. If `H_total > H_target`:
   - Iteratively adjusts `fontSizeScale` step down.
   - Adjusts `lineHeight` in `-0.05` increments (down to 1.15 minimum).
   - Adjusts `sectionSpacing` and `pageMargins` down to `'compact'`.
3. Recalculates `H_total` until `H_total <= H_target` or minimum threshold constraints are reached.

---

## 7. Dual PDF Export Architecture & Tradeoffs

```
                  ┌───────────────────────────────────────────────┐
                  │                 User Export                   │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
   ┌───────────────────────────────┐               ┌───────────────────────────────┐
   │ Primary: @react-pdf/renderer  │               │ Fallback: Canvas / Print CSS  │
   ├───────────────────────────────┤               ├───────────────────────────────┤
   │ • Vector-native PDF           │               │ • html2canvas + jsPDF         │
   │ • Crisp text & low file size  │               │ • 100% DOM pixel accuracy     │
   │ • Searchable & ATS friendly   │               │ • @media print fallback       │
   └───────────────────────────────┘               └───────────────────────────────┘
```

| Engine | Pros | Cons | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **`@react-pdf/renderer`** | True vector PDF, crisp typography, small file size, 100% searchable text for ATS. | Requires separate layout schema mapping in `@react-pdf` components. | **Primary Default Export** |
| **`html2canvas` + `jsPDF`** | Identical visual reproduction of DOM CSS styles. | Raster image-based PDF, larger file size, non-selectable text unless overlaid. | Visual Snapshot Fallback |
| **`@media print`** | Native browser speed, no bundle weight. | Dependent on user browser print settings and print dialog margins. | Quick Local Print |

---

## 8. Modular Template Architecture & Marketplace SDK Readiness

To guarantee templates remain decoupled, extensible, and ready for a future Template Marketplace:

### Template Manifest Interface
```typescript
export interface TemplateManifest {
  id: TemplateId;
  name: string;
  description: string;
  version: string;
  author: string;
  thumbnailUrl: string;
  layoutType: 'single-column' | 'two-column-left' | 'two-column-right' | 'header-banner';
  supportedSections: SectionType[];
  defaultTheme: Partial<ThemeSettings>;
  Component: React.ComponentType<TemplateProps>;
  PDFDocument: React.ComponentType<TemplateProps>;
}
```

### Template Registry Pattern
Templates register via `TemplateRegistry.register(manifest)`. The core editor consumes templates via abstract props (`CVProfile`), ensuring zero hardcoded template dependencies inside core editor forms.

---

## 9. Dashboard, Version History & Side-by-Side Comparison

### Dashboard Enhancements
- **Search & Filtering**: Real-time search by title, candidate name, or tech tag; filter by language or status (Favorite/Archived).
- **Batch Operations**: Multi-select resumes for batch JSON export, deletion, or archiving.
- **1-Click Duplication & Demo Profiles**: Instant cloning for creating targeted CV variants.

### Version History & Side-by-Side Diff Viewer
- **Snapshots**: Automatic revision entries saved in IndexedDB on major edits or manual commit ("Save Version").
- **Side-by-Side CV Comparison**: Dual-pane modal comparing two CV profiles or two historic versions of the same CV, highlighting:
  - Difference in ATS Score (+/- points).
  - Word count & action verb variance.
  - Visual text diff of summary & experience bullet points.

---

## 10. Local Analytics & Comprehensive i18n Strategy

### Local Resume Analytics Dashboard
- Total Word & Character Count.
- Estimated Recruiter Reading Time (based on 200 wpm average).
- Action Verb Coverage Ratio (% of bullets starting with strong verbs).
- Metric Density (% of bullets containing quantitative statistics).

### Comprehensive i18n Architecture
- **UI Localization**: PT-BR and EN-US interface translations via `react-i18next`.
- **Default Section Titles**: Auto-translated default header strings when changing CV locale.
- **Date Formatting**: Regionalized date formatters (`MMM YYYY` vs `MM/YYYY` vs `Month YYYY`).
- **Locale-Specific ATS Dictionaries**: Portuguese & English action verb lists and ATS keyword matchers.

---

## 11. Complete Directory Structure

```
cvire/
├── docs/
│   └── superpowers/specs/
│       └── 2026-07-30-cvire-prd-design.md
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ProfileGrid.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── BatchActionBar.tsx
│   │   │   ├── CompareModal.tsx
│   │   │   └── DemoTemplateModal.tsx
│   │   ├── editor/
│   │   │   ├── PersonalForm.tsx
│   │   │   ├── SectionsList.tsx
│   │   │   ├── SortableSection.tsx
│   │   │   ├── SortableBulletItem.tsx
│   │   │   └── ItemFormModal.tsx
│   │   ├── preview/
│   │   │   ├── A4PaperCanvas.tsx
│   │   │   ├── PageDivider.tsx
│   │   │   ├── ViewportToolbar.tsx
│   │   │   ├── AutoFitControls.tsx
│   │   │   └── KeywordHeatmapOverlay.tsx
│   │   ├── ats/
│   │   │   ├── ATSScoreGauge.tsx
│   │   │   ├── ResumeLinterPanel.tsx
│   │   │   ├── ATSPlainPreviewModal.tsx
│   │   │   └── JobMatcherDrawer.tsx
│   │   ├── templates/
│   │   │   ├── registry.ts
│   │   │   ├── ModernTech/
│   │   │   ├── ExecutiveClassic/
│   │   │   ├── MinimalistClean/
│   │   │   ├── CreativeAccent/
│   │   │   └── CompactSingle/
│   │   ├── pdf/
│   │   │   ├── PDFDocumentRenderer.tsx
│   │   │   └── PDFStyles.ts
│   │   └── ui/
│   │       ├── Modal.tsx
│   │       ├── Drawer.tsx
│   │       ├── ColorPicker.tsx
│   │       ├── Slider.tsx
│   │       └── Badge.tsx
│   ├── db/
│   │   ├── cvDatabase.ts        # Dexie.js database schema & versions table
│   │   └── cryptoVault.ts       # Web Crypto API key encryption storage
│   ├── services/
│   │   ├── aiService.ts         # BYOK Gemini / OpenAI client calls
│   │   ├── atsEngine.ts         # Deterministic ATS scoring & Linter rules
│   │   ├── jobMatcher.ts        # Offline TF-IDF & keyword overlap engine
│   │   ├── autoFitEngine.ts     # Iterative spacing & font scale calculation
│   │   └── exportService.ts     # JSON Resume, PDF, and zip exporters
│   ├── store/
│   │   ├── useCVStore.ts        # Primary Zustand store for active profile
│   │   └── useUIStore.ts        # Viewport zoom, theme, active drawer state
│   ├── types/
│   │   ├── cv.ts                # Core domain types
│   │   ├── template.ts          # TemplateManifest interfaces
│   │   └── ats.ts               # Linter and ATS score interfaces
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── pt-BR.json
│   │   └── en-US.json
│   ├── App.tsx
│   └── main.tsx
```

---

## 12. Verification & Quality Assurance Plan

- **Automated Unit Tests**:
  - ATS Scoring & Linter Rule assertions (`atsEngine.test.ts`).
  - Web Crypto Key Encryption & Decryption (`cryptoVault.test.ts`).
  - Auto-Fit algorithm calculation tests (`autoFitEngine.test.ts`).
- **Manual Verification**:
  - Verify A4 visual page splits across zoom levels (50% to 150%).
  - Multi-profile CRUD operations & version snapshot restoration.
  - Multi-locale switching and PDF export visual fidelity checks.
