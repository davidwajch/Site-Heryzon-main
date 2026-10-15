# Vozzi

Site institucional da Heryzon apresentando a Vozzi, agente de voz com IA para atendimento hospitalar.

## Stack

- **Framework:** Vinext (Vite + React Server Components)
- **Frontend:** React 19, TypeScript
- **Estilo:** Tailwind CSS 4
- **Runtime:** Node.js 22.13+
- **Deploy:** Cloudflare Workers

## Rodando localmente

```bash
# Com nvm instalado, ativa a versão correta do Node
nvm use

# Instala dependências
npm install

# Inicia servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Lint
npm run lint
```

O servidor de desenvolvimento roda em `http://localhost:5173`.

## Estrutura do projeto

```
app/
├── page.tsx           # Página principal (hero, problema, solução, demo, contato)
├── ui.tsx             # Componentes de UI (header, footer, botões, waveform)
├── contact-form.tsx   # Formulário de contato (abre mailto)
├── contact-info.ts    # Email de contato
├── layout.tsx         # Layout raiz com metadata
└── globals.css        # Estilos globais e design system

public/
├── audio/
│   └── vozzi-demo.mp3 # Demonstração em áudio da Vozzi
└── favicon.svg

worker/
└── index.ts           # Worker Cloudflare (otimização de imagens e headers de segurança)

scripts/
└── assert-node-version.mjs  # Valida versão do Node antes de build/dev
```

## Funcionalidades

- Apresentação do problema de atendimento telefônico na saúde
- Demonstração da solução Vozzi em formato de áudio
- Formulário de contato integrado com mailto
- Design responsivo com navegação mobile
- Player de áudio customizado
- Headers de segurança configurados no worker
