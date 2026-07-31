# State & Storage Architecture Rules (`.agents/rules/state-storage.md`)

> **Quem lê**: Agente modificando o Zustand store (`useCVStore.ts`), UI store (`useUIStore.ts`) ou tabelas do Dexie (`cvDatabase.ts`).
> **Pergunta que responde**: Como persistir dados locais com segurança e gerenciar o estado reativo no Dexie.js e Zustand?

## 1. Regras do Dexie.js (`src/db/cvDatabase.ts`)
- O banco de dados local IndexedDB armazena perfis (`profiles`), configurações de tema e histórico de versões.
- Operações de escrita no Dexie devem ser assíncronas (`async/await`) e propagar atualizações para o Zustand via `set()`.
- O banco é alimentado com dados padrão (`seedDatabaseIfEmpty`) na primeira inicialização da aplicação.

## 2. Regras do Zustand Store (`src/store/useCVStore.ts`)
- Mantenha `activeProfile` sincronizado com `activeProfileId`.
- Atualizações em itens de seção (`updateSectionItem`) devem utilizar imutabilidade cirúrgica sem alterar IDs ou referências de itens vizinhos.
- Histórico de versões: Snapshots devem salvar `dataSnapshot` sem recursão de histórico.

## 3. UI Store (`src/store/useUIStore.ts`)
- Modais globais (`activeModal`) aceitam valores como `'template-picker'`, `'theme-customizer'`, `'job-matcher'`, `'version-history'`, etc.
- Nunca misturar estado transiente de formulário local com o estado do UI Store.
