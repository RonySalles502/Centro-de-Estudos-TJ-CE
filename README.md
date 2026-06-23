# Centro de Estudos TJ-CE 2026 — Pacote PWA

App de estudos para TJ-CE 2026 (Analista Judiciário — FCC), em duas versões:

- **Versão principal** (raiz do repositório) — cronograma original de 84 dias
- **Versão Lívia** (subpasta `/livia/`) — cronograma condensado de 45 dias (25/06 → 09/08)

## Funcionalidades

- Cronograma com 3 ciclos diários (Teoria / Lei seca / Questões — ou Teoria principal / Teoria adicional / Diagnóstico, na versão Lívia)
- **Cumprimento parcial e adiamento** de ciclos para o próximo domingo de pendências
- **Registro de % de acerto por ciclo** com badge colorida (verde ≥ 70%, amarelo 50-69%, vermelho < 50%)
- **Dashboard de blocos para revisar** — lista automática de blocos com média abaixo de 70%
- Banco de questões originais padrão FCC
- 20 temas de redação com espelhos
- Sistema Pomodoro
- Revisão Espaçada (SRS) com flashcards
- Calibração de confiança (Certeza / Dúvida / Chute)
- Simulados com correção
- Backup robusto: IndexedDB + localStorage + snapshots automáticos (7 dias) + export manual + sync com pasta sincronizada (File System Access API em Chrome/Edge)
- PWA pleno (instalável, offline)

## Estrutura do repositório (sugerida)

```
/                                Versão principal
├── index.html
├── manifest.webmanifest
├── sw.js
├── icon.svg / icon-*.png
├── README.md
└── livia/                       Versão Lívia (subpasta)
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    └── icon.svg / icon-*.png
```

## Hospedagem

**GitHub Pages (recomendado):**

1. Criar repositório no GitHub (ex.: `estudos-tjce`)
2. Upload de todos os arquivos da raiz (Settings → Pages → Source: branch main, pasta `/`)
3. Criar pasta `livia/` no repositório com os arquivos correspondentes
4. URLs:
   - Principal: `https://SEU_USUARIO.github.io/estudos-tjce/`
   - Lívia: `https://SEU_USUARIO.github.io/estudos-tjce/livia/`

## Isolamento de dados entre versões

A versão principal e a versão Lívia compartilham a mesma origem (`SEU_USUARIO.github.io`),
mas estão em paths diferentes. Para garantir que os dados não se misturem:

- `STORAGE_KEY` é diferente: `tjce_candidato_v3` (principal) vs `tjce_candidato_livia_v3` (Lívia)
- `IDB_NAME` é diferente: `tjce_db` (principal) vs `tjce_db_livia` (Lívia)
- Service Workers têm escopo de path próprio

Cada amigo deve usar a URL correta. Não há risco de o app principal "abrir" os dados da Lívia
ou vice-versa, desde que cada um abra o link certo.

## Atualizações futuras

**App principal:**
1. Edite `index.html` na raiz
2. Incremente `CACHE_VERSION` em `sw.js` (`tjce-v5` → `tjce-v6`)
3. Faça commit

**App Lívia:**
1. Edite `livia/index.html`
2. Incremente `CACHE_VERSION` em `livia/sw.js` (`tjce-livia-v1` → `tjce-livia-v2`)
3. Faça commit

**Importante sobre a versão Lívia:** ela foi gerada a partir do código do app principal com
modificações pontuais (DADOS.cronograma, DADOS.config, STORAGE_KEY, IDB_NAME, cores, ícones).
Se você fizer melhorias no app principal e quiser propagar pra versão Lívia, o procedimento
é manual — você ou eu (em sessão futura) precisamos repetir as substituições.

## Limitações conhecidas

- **iOS apaga dados de PWA após ~7 dias sem uso** (Intelligent Tracking Prevention do Safari).
  Exporte backup com frequência.
- **File System Access API** (sync com pasta) só funciona em Chrome/Edge desktop e Android.
- **Google Drive OAuth direto não está implementado** — File System Access + pasta sincronizada
  cobre o mesmo caso de uso sem essa burocracia.
