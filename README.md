# cvire

A client-side, offline-first resume builder designed for structured resume creation, ATS optimization, and precise A4 pagination.

cvire runs entirely in the browser using IndexedDB for local persistent storage. Resume data, version history, and API keys remain encrypted on the user's device, requiring no backend services or external data tracking.

---

## Technical Specifications & Features

### Multi-Profile Management
- **IndexedDB Relational Storage**: Local storage for resume profiles, versions, and settings using Dexie.js.
- **Search & Filtering**: Search profiles by title or candidate name with filters for favorites, archived items, and locale (`en-US` and `pt-BR`).
- **Data Mobility**: Batch export and import of all user profiles into a unified JSON backup file.

### Paginated A4 Canvas
- **Physical A4 Rendering**: Scaled canvas matching physical A4 dimensions (`210mm x 297mm` / `794px x 1123px` at 96 DPI).
- **Page Break Indicators**: Real-time height monitoring that renders visual indicators at page split boundaries to prevent line truncation across printed pages.
- **Viewport Controls**: Support for zooming (50% to 150%) and multiple view modes (*Edit Only*, *Split View*, *Preview Paper*).

### ATS Engine & Diagnostics
- **Weighted ATS Scoring**: Evaluates resumes against six weighted metrics:
  - Structure & Formatting (20%)
  - Technical Keywords (25%)
  - Quantified Metrics (20%)
  - Action Verbs (15%)
  - Summary & Length (10%)
  - Contact Information (10%)
- **Resume Linter**: Real-time diagnostic checks identifying anti-patterns, overused terms, missing metrics, and passive voice.
- **Plain Text Parser View**: Simulates raw text extraction used by Applicant Tracking Systems (Workday, Taleo, Greenhouse).

### Security & Optional AI Integration
- **Web Crypto Key Storage**: Local API keys (Google Gemini) are encrypted with 256-bit AES-GCM via the Web Crypto API (`window.crypto.subtle`) prior to IndexedDB storage.
- **AI Enhancement**: Optional STAR-format bullet point rewriter powered by Gemini 2.5 Flash.

### Job Description Matcher
- **TF-IDF Keyword Extraction**: Compares resume text against job postings, providing match percentage scores, identified keywords, and missing requirement alerts.

### Template Engine & Customization
- **Five Pre-built Layouts**:
  - `Modern Tech`: Two-column layout with technical skill sidebar.
  - `Executive Classic`: Traditional single-column layout for senior leadership.
  - `Minimalist Clean`: Spaced single-column layout prioritizing typography.
  - `Creative Accent`: Header banner layout for design and creative roles.
  - `Compact Single-Page`: High-density layout engineered to condense experience onto one page.
- **Styling Controls**: Theme color selection, Google Fonts integration (*Inter, Roboto, Merriweather, Fira Code, Outfit, Poppins*), font scale, and line-height controls.

### Versioning & Side-by-Side Comparison
- **Version Checkpoints**: Create manual snapshots with commit notes and restore prior versions on demand.
- **Comparison Engine**: Dual-pane comparison interface showing score differentials, word counts, and section-by-section metrics between two resumes.

---

## Tech Stack

- **Frontend Framework**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS v4, CSS Variables, Lucide React Icons
- **Local Database**: Dexie.js (IndexedDB wrapper)
- **State Management**: Zustand
- **Export Engine**: `html2pdf.js`, `@media print` CSS
- **Security**: Web Crypto API (`SubtleCrypto` AES-GCM 256-bit)
- **AI SDK**: `@google/genai`
- **Internationalization**: `i18next`, `react-i18next`

---

## Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Local Development
```bash
# Clone the repository
git clone git@github.com:Jownao/cvire.git
cd cvire

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## License

MIT License. See `LICENSE` for details.
