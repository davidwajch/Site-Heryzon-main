# Reconstrução do site Heryzon/Vozzi — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir heryzon.com.br em PT (padrão) e EN, com 14 seções, fluxograma fixo que acende ao rolar, formulário via `enviar.php` e política de privacidade nos dois idiomas.

**Architecture:** Site estático servido pela Hostinger. Um gerador Node sem dependências (`src/build.mjs`) monta 4 páginas HTML a partir de modelos (`src/templates/`) e textos (`src/content/`); as páginas geradas ficam versionadas na raiz do repositório. CSS e JS escritos à mão em `assets/`. Formulário: `fetch` → `enviar.php` → `mail()`.

**Tech Stack:** HTML, CSS, JavaScript puro, PHP (`mail()`), Node 20 apenas para build/testes/servidor local (`node:test`, `node:http`).

**Spec:** `~/Documents/Startup/Site - especificacao/ESPECIFICACAO.md`, `referencia-visual.html`, `POLITICA-DE-PRIVACIDADE.md`.

## Global Constraints

- Textos exatamente como na especificação; nada de números, métricas, depoimentos, logos de clientes, setores ou time. Sem "RAG".
- Bruno (masculino), Vozzi (produto), Heryzon (empresa).
- Zero requisições a terceiros: fontes .woff2 em `/assets/fonts/`, sem scripts externos. Único dado no navegador: `localStorage['heryzon-lang']`.
- Cores: `#0B7A81` em botões e textos pequenos; `#12A0A8` só em detalhes. Contraste AA.
- 360–1440 px sem rolagem horizontal; `prefers-reduced-motion`; alvos ≥ 44 px; foco visível; labels em todos os campos.
- Layout na raiz do repositório (funciona com Gerenciador de Arquivos, FTP ou deploy por Git); `.htaccess` nega acesso a `src/`, `tests/`, `docs/`, `README.md`, `package.json`.
- Política: razão social e CNPJ preenchidos; `[ENDEREÇO]`/`[ADDRESS]` e a data visíveis até serem definidos em `COMPANY` (`src/build.mjs`).

## Review Focus

- Visitante com preferência EN salva abre `/`: deve ir para `/en/` sem piscar o PT. Preferência inválida ou `localStorage` bloqueado: nada quebra.
- Envio com rede caída ou resposta não-JSON: mostra o texto de erro da especificação e mantém os dados digitados.
- Clique em "Falar sobre investimento" e depois em "Quero ser piloto": o assunto troca de volta para "Ser piloto".
- Seletor de idioma com âncora na URL (`/#contato` → `/en/#contato`): mantém a seção.
- Campos com texto enorme ou quebras de linha no nome/e-mail: o PHP recusa ou limpa (sem injeção de cabeçalho).

---

### Task 1: Gerador e markdown da política

**Files:**
- Create: `package.json`, `src/build.mjs`, `src/lib/markdown.mjs`, `src/content/privacy-pt.md`, `src/content/privacy-en.md`
- Test: `tests/markdown.test.mjs`

**Interfaces:**
- Produces: `markdownToHtml(md: string): string` (h1–h3, parágrafos, `**negrito**`, listas `- `, tabelas pipe; escapa HTML). `buildSite(outDir: string): Promise<string[]>` retorna os caminhos gerados. `COMPANY = { legalName, cnpj, address: null, email, publishedAt: null }`.

- [ ] Testes: tabela vira `<table>` com `<th>`; `**x**` vira `<strong>`; `<` é escapado; lista vira `<ul><li>`.
- [ ] Implementar e passar (`npm test`).

### Task 2: Conteúdo PT/EN e modelos

**Files:**
- Create: `src/content/pt.mjs`, `src/content/en.mjs`, `src/templates/layout.mjs`, `src/templates/home.mjs`, `src/templates/privacy.mjs`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `markdownToHtml`, `COMPANY`.
- Produces: páginas `index.html`, `en/index.html`, `privacidade/index.html`, `en/privacy/index.html`. Ids de seção iguais nos dois idiomas: `topo, desafios, como-funciona, o-que-faz, onde-ajuda, ouca, controle, piloto, investidores, perguntas, contato`. Formulário `#contact-form` com campos `name, email, company, industry, volume, interest, message, lang, website`; `interest` ∈ `piloto|investimento|outro`; `volume` ∈ `ate-1000|1000-5000|5000-20000|mais-20000|nao-sei`. Botões com `data-interest`. Fluxograma: `[data-node]` ∈ `cliente|triagem|kb|resolve|humano|registro`; passos `[data-step="1..5"]`.

- [ ] Testes: `lang` (`pt-BR`/`en`), `<title>` e description da spec, canonical + hreflang (pt-BR, en, x-default); ordem das seções; nenhuma URL `http(s)://` fora de `heryzon.com.br`; nenhum "RAG"; títulos B nos dois idiomas; política com CNPJ, `[ENDEREÇO]`, `[DATA DE PUBLICAÇÃO]`, "24 meses" e equivalentes EN.
- [ ] Implementar e passar.

### Task 3: CSS, fontes, JS, favicon

**Files:**
- Create: `assets/styles.css`, `assets/main.js`, `assets/fonts/*.woff2` + licenças OFL, `favicon.svg`

- [ ] Fontes variáveis (subconjunto latin) baixadas uma vez; `@font-face` com `font-display: swap`.
- [ ] JS: preferência de idioma, fluxograma (`IntersectionObserver`, `rootMargin: '-45% 0px -45% 0px'`, mapa 1→cliente, 2→triagem, 3→kb, 4→resolve+registro, 5→humano+registro), `data-interest`, áudio exclusivo, formulário (validação nativa, estados enviando/sucesso/erro).

### Task 4: Servidor, PHP e limpeza

**Files:**
- Modify: `enviar.php`, `README.md`
- Create: `.htaccess`, `robots.txt`, `sitemap.xml`, `src/dev-server.mjs`
- Delete: `index.html` antigo (substituído), `styles.css`, `script.js`, `privacidade.html`, `termos.html`, `cookies.html`

- [ ] `.htaccess`: 301 de `privacidade.html`, `termos.html`, `cookies.html` → `/privacidade/`; negação de `src|tests|docs`; cache de fontes/áudio.
- [ ] `src/dev-server.mjs`: serve a raiz; `POST /enviar.php` responde `{ok:true}` ou 500 com `FORM_MOCK=error`.

### Task 5: Verificação no navegador

- [ ] PT/EN em 1440 e 375 px; player; fluxograma; acordeão; âncoras; seletor; formulário (validação, sucesso, erro); aba de rede só `localhost`; axe; comparação com a referência; capturas.
