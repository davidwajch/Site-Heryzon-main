# Heryzon Vozzi

Site institucional estático da Heryzon para a Vozzi — solução de atendimento
por voz com inteligência artificial (a voz é o Bruno), adaptável a qualquer
nicho.

## Estrutura

- `index.html`: página única com hero, problema, solução, demonstração em áudio, investidores e contato.
- `privacidade.html` / `termos.html` / `cookies.html`: páginas legais (modelo a revisar juridicamente).
- `styles.css`: estilos e design system do site.
- `script.js`: waveform (estática e animada ao tocar), menu mobile e envio do formulário por e-mail.
- `audio/bruno-apresentacao.mp3`: MP3 com a apresentação do Bruno (voz da Vozzi).
- `favicon.svg`: ícone do site.

## Como usar

É um site 100% estático (HTML, CSS e JavaScript puro) — não precisa de build
nem de dependências. Basta abrir o `index.html` no navegador (duplo clique).

Para testar servindo por HTTP (recomendado, alguns navegadores restringem
recursos quando o arquivo é aberto direto do disco), rode um servidor estático
simples na pasta do projeto. Com Node instalado:

```bash
npx --yes serve .
```

Ou, se tiver Python: `python -m http.server 8000` e acesse
http://localhost:8000.

## Publicação

Por ser estático, pode ser hospedado em qualquer serviço de arquivos estáticos
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.) — basta subir o
conteúdo da pasta.

## Observações

- O formulário de contato monta um link `mailto:` e abre o aplicativo de e-mail
  do visitante; ele não envia mensagens por um servidor.
- O áudio final do Bruno pode substituir `audio/bruno-apresentacao.mp3` mantendo
  o mesmo caminho.
