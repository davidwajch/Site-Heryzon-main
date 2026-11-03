# Heryzon · Vozzi

Site da Heryzon (heryzon.com.br) que apresenta a Vozzi, assistente virtual de voz. O assistente da demonstração se chama Bruno.
Português é o idioma padrão e o inglês fica em `/en/`.

## Estrutura

```
public_html/   o site: tudo o que vai para o servidor, e só isso
src/           código-fonte das páginas (textos, modelos e gerador)
tests/         testes automáticos
docs/          planos e anotações de trabalho
package.json   comandos de build, testes e servidor local
README.md      este arquivo
```

### `public_html/` (vai para a Hostinger)

- `index.html`, `en/index.html`: página principal em PT e EN (geradas).
- `privacidade/index.html`, `en/privacy/index.html`: política de privacidade em PT e EN (geradas).
- `assets/styles.css`, `assets/main.js`: estilos e comportamento (fluxograma, faixa corrida, player de áudio, seletor de idioma, formulário Piloto/Investidor).
- `assets/fonts/`: Space Grotesk, Manrope e JetBrains Mono em `.woff2`, servidas pelo próprio site, com as licenças OFL.
- `audio/bruno-apresentacao.mp3`: demonstração de voz do Bruno.
- `enviar.php`: recebe o formulário e envia para contato@heryzon.com.br com `mail()`. Só aceita os assuntos `piloto` e `investimento`. Aceita no máximo 5 envios por IP a cada 10 minutos; o registro fica na pasta temporária do servidor, com o IP guardado só como hash.
- `.htaccess`: redireciona as páginas antigas para `/privacidade/`, define o cache de fontes e áudio e, como proteção extra, bloqueia `src/`, `tests/` e `docs/` caso sejam enviados por engano.
- `robots.txt`, `sitemap.xml`, `favicon.svg`.

### Desenvolvimento (não vai para o servidor)

- `src/content/pt.mjs`, `src/content/en.mjs`: todos os textos do site, da especificação aprovada.
- `src/content/privacy-pt.md`, `src/content/privacy-en.md`: texto da política.
- `src/templates/`: estrutura HTML das páginas.
- `src/build.mjs`: gera as 4 páginas em `public_html/`. Os dados cadastrais da política ficam em `COMPANY`.
- `src/dev-server.mjs`: servidor local que serve `public_html/` e simula o `enviar.php`.
- `tests/`: testes do gerador, do JavaScript (no Chrome), do `enviar.php` (no PHP) e da estrutura do repositório (falha se um arquivo do site ficar fora de `public_html/` ou se um arquivo de desenvolvimento entrar nele).

## Como rodar localmente

Requer Node 20 ou mais novo. Não há dependências para instalar.

```bash
npm run build      # gera as páginas de src/ em public_html/
npm test           # todos os testes
npm run dev        # http://127.0.0.1:8080, servindo public_html/, formulário simulando sucesso
FORM_MOCK=error npm run dev   # formulário simulando erro
FORM_MOCK=limit npm run dev   # formulário simulando limite de envios atingido
```

Os testes de navegador usam o Chrome instalado (ou o caminho em `CHROME_PATH`) e os do `enviar.php` usam o `php` instalado. Sem PHP, dá para usar o Docker: `PHP_DOCKER_IMAGE=php:8.2-cli npm test`. O que não estiver disponível é pulado, com aviso.

Depois de mudar textos, modelos, CSS ou JS, rode `npm run build`. As páginas geradas e a versão dos arquivos de CSS e JS são atualizadas juntas. O CSS e o JS são editados direto em `public_html/assets/`.

## Publicação

Só o conteúdo de `public_html/` vai para a Hostinger: envie o que está dentro dela (inclusive o `.htaccess`, que é um arquivo oculto) para a pasta `public_html` do domínio. O resto do repositório não vai para o servidor.

Na data de publicação, preencha `COMPANY.publishedAt` em `src/build.mjs` e rode `npm run build`.

## Privacidade

O site não usa cookies, analytics nem scripts de terceiros. A única coisa guardada no navegador é a escolha de idioma (`localStorage`, chave `heryzon-lang`).
