# Resume JSON Translator (cvire)

## cvire contract

- **Prerequisite:** if the user attached a resume file, complete `cv-content/prompts/cv-intake.md` first.
- **Input:** `CVProfile` JSON (`src/types/cv.ts` or `cv-content/outputs/json/`) + target language (`pt-BR` / `en-US` or as requested).
- **Output:** JSON with the **same keys** and structure; technology names unchanged; importable via `importResumesJSON`.
- **Artifact:** `cv-content/outputs/json/<slug>-<lang>.json`; optional notes in `cv-content/outputs/md/`.
- **PDF / DOCX:** never generate PDF/DOCX here; import in the app → Export PDF (`exportService`), optionally store under `cv-content/outputs/pdf/`. Word files (if any) go under `cv-content/outputs/docx/`.
- **Integrity:** follow `cv-content/rules/content-integrity.md`.
- **Close:** run `cv-content/prompts/cv-report-board.md` (MD + HTML board) unless the user skips.

---

# Resume JSON Translator

You are responsible for translating a resume JSON from one language to another.

## Objective

Translate **only the user-facing text** while preserving the JSON structure exactly.

The output must remain a valid JSON that can be imported back into the application without any additional changes.

---

## Translation Rules

### Preserve the JSON structure

Do NOT:

- rename keys
- remove keys
- add keys
- change object hierarchy
- reorder properties unnecessarily
- modify IDs
- modify booleans
- modify numbers
- modify dates unless explicitly requested
- modify URLs
- modify colors
- modify layout settings
- modify displayMode
- modify theme
- modify section types
- modify internal metadata

Only translate text intended to be displayed to the user.

---

### Translate

Translate fields such as:

- summary
- title
- subtitle
- description
- bulletItems.text
- labels
- section titles
- custom section names
- project descriptions
- certification names (when appropriate)
- language levels
- education names
- award names
- publication names

---

### Do NOT translate

Never translate:

- ids
- urls
- github links
- portfolio links
- email
- phone
- colors
- font names
- enum values
- layout configuration
- displayMode
- type
- visible
- current
- enabled
- tags representing technologies

Examples:

Keep exactly as-is:

- Python
- SQL
- PostgreSQL
- BigQuery
- AWS
- Azure
- GCP
- Databricks
- Docker
- Git
- Terraform
- Apache Spark
- Apache Airflow
- dbt
- Power BI
- Looker Studio
- Streamlit
- Pandas
- NumPy
- TensorFlow

Technology names should never be localized.

---

### Professional Translation

The translation must sound natural for recruiters in the target language.

Do NOT perform literal translation.

Example:

❌ Built ETL pipelines

→ Construído pipelines ETL

✅ Developed ETL pipelines

→ Desenvolveu pipelines ETL

---

### Resume Tone

Maintain a professional resume style.

Keep:

- strong action verbs
- measurable impact
- ATS-friendly wording

Never simplify professional language.

---

### Preserve Formatting

Maintain:

- punctuation
- bullet order
- paragraphs
- capitalization when appropriate

---

### Dates

Keep dates exactly as they are unless explicitly instructed otherwise.

Example:

May 2025

should remain

May 2025

---

### Output

Return ONLY the translated JSON.

Do not:

- explain changes
- add markdown
- wrap inside code blocks
- include comments

The response must be directly importable into the application.

---

## Target Language

Translate the resume into:

{{TARGET_LANGUAGE}}