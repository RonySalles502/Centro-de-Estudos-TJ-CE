# Centro de Estudos TJ-CE 2026 — Pacote para hospedagem

PWA para estudos do TJ-CE 2026 (Analista Judiciário — FCC).

## Funcionalidades principais do app

- **Cronograma de 84 dias** com 3 ciclos diários (Teoria / Lei seca / Questões)
- **Cumprimento parcial e adiamento:** se algum ciclo não foi cumprido no dia, marque "Adiar p/ domingo" — o sistema:
  - Aloca automaticamente para o próximo domingo de pendências disponível
  - Pula domingos que já têm simulado programado (semanas 8-11)
  - Se não houver mais domingos no horizonte, alfunaca para o sábado 08/08 (último abrigo)
  - Alerta no Dashboard quando há acúmulo (≥ 3 pendências num mesmo domingo)
- **Banco de questões originais** padrão FCC
- **20 temas de redação** com espelhos completos
- **Sistema de Pomodoro** integrado
- **Revisão Espaçada (SRS)** com flashcards
- **Calibração de confiança** (Certeza / Dúvida / Chute por questão)
- **Simulados** com correção automática
- **Apostas & Erros:** registro de questões resolvidas fora do app
- **Notas por bloco**, anotações livres
- **Dashboard** com estatísticas em tempo real
- **Backup robusto:** IndexedDB + localStorage + snapshots automáticos (7 dias) + export manual + sync com pasta

## Como hospedar (escolha um caminho)

### Opção A — GitHub Pages (recomendado, permanente, gratuito)

1. Crie uma conta no GitHub (https://github.com/signup) se ainda não tem.
2. Clique em "New repository" — nome `estudos-tjce` (ou outro), público, sem README inicial.
3. Na tela do repositório vazio, clique em **"uploading an existing file"**.
4. Arraste os 7 arquivos deste pacote (todos exceto `MENSAGEM_WHATSAPP.txt` e este README).
5. Role para baixo, clique em **"Commit changes"**.
6. Vá em **Settings → Pages** (menu da esquerda) → Source: "Deploy from a branch" → Branch `main` → pasta `/ (root)` → **Save**.
7. Aguarde 1-3 minutos. Recarregue a página até aparecer:
   > Your site is live at `https://SEU_USUARIO.github.io/estudos-tjce/`

A URL pra distribuir é essa mesma — `index.html` é servido automaticamente.

### Opção B — Netlify Drop (mais rápido, sem conta para teste)

1. Acesse https://app.netlify.com/drop
2. **Descompacte** o ZIP em uma pasta.
3. Arraste a pasta inteira (não o ZIP) para a área central do Netlify Drop.
4. Em ~30 segundos, recebe URL HTTPS pública.
5. Sem conta: o site expira em ~24h. Com conta gratuita (login com Google ou GitHub, 1 minuto): permanente.

### Opção C — Cloudflare Pages / Vercel

Conta gratuita, conecta o repositório do GitHub ao projeto. Mesmo resultado da Opção A, domínio diferente.

## Arquivos do pacote

```
index.html                  Aplicação principal (renomeada para servir como entrada padrão)
manifest.webmanifest        Manifesto PWA
sw.js                       Service Worker (cache offline)
icon.svg                    Ícone vetorial
icon-192.png                Ícone 192×192 (Android, apple-touch-icon)
icon-512.png                Ícone 512×512
icon-512-maskable.png       Ícone adaptativo (Android maskable)
MENSAGEM_WHATSAPP.txt       Texto pronto pra enviar aos amigos
```

## Após publicar

1. Pegue a URL pública.
2. Edite o arquivo `MENSAGEM_WHATSAPP.txt` substituindo `[COLE_SUA_URL_AQUI]`.
3. Cole no grupo de WhatsApp / chat com os amigos.

## Atualizar o app no futuro

Quando subir uma nova versão do `index.html`:

1. Abra `sw.js`, encontre `const CACHE_VERSION = 'tjce-v1';` e mude para `'tjce-v2'` (ou v3, v4...).
2. Substitua os arquivos no host.
3. Sem incrementar a versão, o service worker continua servindo do cache antigo. **Esquecer disso é o erro mais comum em deploys de PWA.**

## Limitações por plataforma

| Função | iOS | Android | Desktop |
|---|---|---|---|
| Instalar como app | sim, via "Adicionar à Tela Inicial" | sim, banner automático | sim, ícone na barra de endereço |
| Cache offline | sim | sim | sim |
| Storage permanente | Risco: Safari apaga após 7d sem uso | sim (com persist concedido) | sim |
| Compartilhar backup | sim (iCloud, AirDrop, Mail) | sim | parcial |
| Sync com pasta | não disponível | sim (Chrome) | sim (Chrome/Edge) |

**Aviso forte para usuários de iPhone:** exportar backup manualmente a cada 2-3 dias é importante, porque o Safari pode limpar os dados se passarem 7 dias sem abrir o app.
