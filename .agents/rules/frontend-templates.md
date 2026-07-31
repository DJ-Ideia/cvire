# Frontend & Template Architecture Rules (`.agents/rules/frontend-templates.md`)

> **Quem lê**: Agente trabalhando em componentes React, Canvas A4, formulários ou templates de currículo.
> **Pergunta que responde**: Quais padrões de UI, layout A4, Tailwind v4 e exportação PDF devem ser seguidos?

## 1. Regras do Canvas A4 (`A4PaperCanvas.tsx`)
- As dimensões exatas de visualização A4 são `210mm × 297mm` (proporção 794px × 1123px a 96 DPI).
- Nunca quebrar o contêiner A4 com margens externas dinâmicas descontroladas.
- O cálculo de auto-fit de fonte deve escoparse pelas variáveis de tema (`ThemeSettings.fontSizeScale`, `lineHeight`, `sectionSpacing`).

## 2. Formulários do Editor (`SectionsList.tsx`)
- **Bullet Points Isolados**: Sempre editar bullet points através de subcomponentes dedicados (`BulletItemRow`) que mantêm o estado local de texto para evitar que o cursor salte para o início do campo em re-renders do Zustand.
- **Identificadores Únicos**: Todo novo item ou bullet criado deve receber um ID único (`b-${Date.now()}-${Math.random()...}`).
- **Modos de Exibição (`displayMode`)**:
  - `tags`: Exibe apenas título e tags em linha.
  - `compact`: Exibe título, subtítulo, data início, data fim e link URL.
  - `bullets`: Exibe título, subtítulo, datas, link e lista de bullet points.

## 3. Renderização de Templates (`SectionContentRenderer.tsx`)
- Todos os templates devem delegar a renderização do conteúdo das seções para componentes modulares desacoplados ou utilitários limpos.
- Garantir suporte completo a links amigáveis (`[LinkedIn]`, `[GitHub]`, `[Link]`).
