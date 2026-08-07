# outputs/html

Boards HTML visuais (métricas, barras, prioridades) gerados a partir do template `cv-content/templates/report-board.html`.

Servir localmente:

```bash
# na raiz do repo
./cv-content/scripts/serve-board.sh
# ou: npm run serve:cv-board
```

Abra `http://127.0.0.1:8765/<slug>-board.html`.

Antes de sobrescrever um board, arquive: `./cv-content/scripts/archive-output.sh outputs/html/<slug>-board.html`.

Conteúdo gerado é **gitignored** (exceto este README).
