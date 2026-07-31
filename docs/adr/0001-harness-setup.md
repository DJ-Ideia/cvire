# ADR 0001: Setup do Agent Harness no Diretório `.agents/`

## Status
Aceito

## Contexto
Para garantir que qualquer agente de IA trabalhando no ecossistema `cvire` respeite a arquitetura 100% client-side, invariantes de tipagem TypeScript e validação de build sem introduzir quebras ou antipadrões, é necessário estabelecer um *harness* de regras, estado e validação no projeto.

Como o ambiente do agente atual é o **Antigravity / IDE Agent**, a estrutura nativa de customização e regras reside no diretório `.agents/` do repositório.

## Decisão
1. Definir as regras globais e invariantes no arquivo `.agents/AGENTS.md`.
2. Estruturar regras de domínio específicas na pasta `.agents/rules/`:
   - `frontend-templates.md`: Canvas A4, formulários isolados e templates React.
   - `state-storage.md`: Zustand e Dexie IndexedDB.
   - `ats-jobmatcher.md`: Motor de extração de termos técnicos e i18n.
3. Estabelecer o gate de validação hard através de `npm run build` (`tsc -b && vite build`).

## Consequências
- Agentes de IA lerão `.agents/AGENTS.md` e suas regras derivadas ao iniciar sessões neste repositório.
- Redução drástica de regressões em formulários, tipagem e internacionalização.
