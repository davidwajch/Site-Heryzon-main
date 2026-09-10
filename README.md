# Heryzon Vozzi

Site institucional da Heryzon para a Vozzi, agente de voz com inteligência
artificial para atendimento hospitalar.

## Estrutura

- `app/`: página principal com problema, solução e demonstração em áudio.
- `app/globals.css`: design system aplicado em CSS.
- `public/audio/vozzi-demo.mp3`: MP3 usado na demonstração do protótipo.
- `.openai/hosting.json`: vínculo do projeto com Sites.
- `tests/rendered-html.test.mjs`: teste de renderização da Home.

## Desenvolvimento

O projeto requer Node.js 22.13 ou superior. Com `nvm`, execute `nvm use` antes
de instalar as dependências ou iniciar o servidor.

```bash
nvm use
npm install
npm run dev
npm run build
npm test
```

## Conteúdo pendente

O áudio final da Vozzi pode substituir `public/audio/vozzi-demo.mp3` mantendo o
mesmo caminho público: `/audio/vozzi-demo.mp3`.
