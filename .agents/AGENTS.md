# AGENTS.md — Harness Antigravity (`cvire`)

> **Escopo**: Regras globais de engenharia, invariantes da stack, comandos de build e controle de qualidade para agentes trabalhando no projeto `cvire`.

---

## 1. Visão Geral do Projeto
`cvire` (CV Builder Pro) é uma aplicação web 100% client-side, offline-first e paginada para criação, personalização, otimização ATS e exportação em PDF de currículos de alta performance.

---

## 2. Stack Tecnológica & Arquitetura
- **Core**: React 19 + TypeScript + Vite
- **Estilização**: Tailwind CSS v4 + Vanilla CSS Variables
- **Banco de Dados Local**: Dexie.js (IndexedDB)
- **Gerenciamento de Estado**: Zustand (com middleware immer)
- **Drag & Drop**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **Geração de PDF**: `@react-pdf/renderer` + `html2pdf.js` / `@media print`
- **Internacionalização**: i18next + react-i18next

---

## 3. Comandos de Execução e Validação
- **Iniciar Dev**: `npm run dev` (Vite dev server em `http://localhost:5173/`)
- **Validação de Build (Gate Hard)**: `npm run build` (`tsc -b && vite build`)
- **Visualização de Produção**: `npm run preview`

---

## 4. Invariantes & Regras de Ouro
1. **100% Client-Side & Offline-First**: Nenhuma funcionalidade deve depender de um servidor backend proprietário. Tudo deve ser executado no navegador com persistência no IndexedDB via Dexie.js.
2. **Segurança de Chaves API (BYOK)**: Chaves de IA devem ser salvas criptografadas localmente via Web Crypto API (`SubtleCrypto` AES-GCM 256-bit).
3. **Preservação de Tipagem Estrita**: Respeitar e manter atualizadas as interfaces em `src/types/cv.ts` (`CVProfile`, `CVSection`, `SectionItem`, `BulletItem`, `ThemeSettings`).
4. **Isolamento de Estado em Inputs**: Em componentes de formulário/textarea (ex: `SectionsList.tsx`), mantenha componentes filhos isolados (como `BulletItemRow`) para garantir que o cursor de edição não salte para a posição 0 durante a digitação.
5. **IDs Únicos Universais**: Todo novo item ou bullet point criado deve possuir um ID único (`b-${Date.now()}-${Math.random()...}`).
6. **Diagnóstico por Causa Raiz**: Nunca mascarar erros com `try/catch` vazios ou dados fictícios silenciosos.
7. **Verificação Obrigatória de Build**: Antes de concluir qualquer tarefa ou alterar código, execute `npm run build` e confirme 0 erros de TypeScript/compilação.

---

## 5. Mapeamento de Regras Específicas (`.agents/rules/`)
- [frontend-templates.md](file:///e:/-Progamacoes/projects/cvire/.agents/rules/frontend-templates.md): Padrões de UI, formulários, Canvas A4 e exportação PDF.
- [state-storage.md](file:///e:/-Progamacoes/projects/cvire/.agents/rules/state-storage.md): Padrões de estado reativo no Zustand e tabelas do Dexie.js.
- [ats-jobmatcher.md](file:///e:/-Progamacoes/projects/cvire/.agents/rules/ats-jobmatcher.md): Regras do motor ATS e comparador de vagas.
