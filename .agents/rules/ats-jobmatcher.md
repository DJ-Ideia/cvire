# ATS Engine & Job Matcher Architecture Rules (`.agents/rules/ats-jobmatcher.md`)

> **Quem lê**: Agente trabalhando no analisador de vagas, extração de palavras-chave ou internacionalização ATS.
> **Pergunta que responde**: Como deve funcionar a extração de requisitos de vagas e a comparação com o currículo?

## 1. Algoritmo de Job Matcher (`src/services/jobMatcher.ts`)
- Suporte nativo a termos de tecnologia compostos (N-Grams como *Data Engineering*, *Apache Spark*, *BigQuery*, *Looker Studio*, *Machine Learning*, *Power BI*, *Web Scraping*, *ETL/ELT*, *PostgreSQL*, *GCP*, *AWS*).
- Normalização de acentuação e remoção de palavras genéricas (Stopwords) em Português e Inglês.
- O resultado deve retornar `matchPercentage`, `matchedKeywordsCount`, `missingKeywordsCount` e `keywords`.

## 2. Internacionalização (i18n)
- Todas as mensagens e rótulos do Job Matcher devem ser 100% internacionalizados utilizando chaves do `i18next` (`jobMatcher.*` e `preview.*`).
- Nunca hardcodear strings estritas em português no JSX sem suporte a `en-US`.
