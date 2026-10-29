# Heryzon · Vozzi

Site da Heryzon (heryzon.com.br) que apresenta a Vozzi, agente de voz com IA. O assistente da demonstração se chama Bruno.
Português é o idioma padrão e o inglês fica em `/en/`.

## Estrutura

O que vai para o servidor fica na raiz do repositório:

- `index.html`, `en/index.html`: página principal em PT e EN (geradas).
- `privacidade/index.html`, `en/privacy/index.html`: política de privacidade em PT e EN (geradas).
- `assets/styles.css`, `assets/main.js`: estilos e comportamento (fluxograma, seletor de idioma, formulário).
- `assets/fonts/`: Space Grotesk, Manrope e JetBrains Mono em `.woff2`, servidas pelo próprio site, com as licenças OFL.
- `audio/bruno-apresentacao.mp3`: demonstração de voz do Bruno.
- `enviar.php`: recebe o formulário e envia para contato@heryzon.com.br com `mail()`. Aceita no máximo 5 envios por IP a cada 10 minutos; o registro fica na pasta temporária do servidor, com o IP guardado só como hash.
- `.htaccess`: redireciona as páginas antigas para `/privacidade/` e bloqueia `src/`, `tests/` e `docs/`.
- `robots.txt`, `sitemap.xml`, `favicon.svg`.

Código-fonte (não precisa ir para o servidor, e o `.htaccess` bloqueia mesmo assim):

- `src/content/pt.mjs`, `src/content/en.mjs`: todos os textos do site, da especificação aprovada.
- `src/content/privacy-pt.md`, `src/content/privacy-en.md`: texto da política.
- `src/templates/`: estrutura HTML das páginas.
- `src/build.mjs`: gera as 4 páginas. Os dados cadastrais da política ficam em `COMPANY`.
- `src/dev-server.mjs`: servidor local que simula o `enviar.php`.

## Como rodar localmente

Requer Node 20 ou mais novo. Não há dependências para instalar.

```bash
npm run build      # gera as páginas a partir de src/
npm test           # testes do gerador
npm run dev        # http://127.0.0.1:8080, formulário simulando sucesso
FORM_MOCK=error npm run dev   # formulário simulando erro
FORM_MOCK=limit npm run dev   # formulário simulando limite de envios atingido
```

Depois de mudar textos, modelos, CSS ou JS, rode `npm run build`. As páginas geradas e a versão dos arquivos de CSS e JS são atualizadas juntas.

## Publicação

Suba para a pasta do domínio (`public_html` na Hostinger) os arquivos do site: `index.html`, `en/`, `privacidade/`, `assets/`, `audio/`, `enviar.php`, `.htaccess`, `robots.txt`, `sitemap.xml` e `favicon.svg`. Se o deploy for por Git, o repositório inteiro pode ir: o `.htaccess` bloqueia o acesso a `src/`, `tests/` e `docs/`.

Na data de publicação, preencha `COMPANY.publishedAt` em `src/build.mjs` e rode `npm run build`.

## Privacidade

O site não usa cookies, analytics nem scripts de terceiros. A única coisa guardada no navegador é a escolha de idioma (`localStorage`, chave `heryzon-lang`).
