// Textos em português, copiados da ESPECIFICACAO.md. Nos títulos, o trecho entre [ ] aparece em cinza.

export default {
  lang: "pt-BR",
  ogLocale: "pt_BR",
  paths: { home: "/", privacy: "/privacidade/" },
  meta: {
    title: "Vozzi por Heryzon — agente de voz com IA para atendimento telefônico",
    description:
      "A Vozzi atende as ligações da sua empresa 24 horas por dia, resolve os pedidos que se repetem e passa o restante para a sua equipe com o resumo da conversa.",
  },
  a11y: {
    mainNav: "Principal",
    footerNav: "Rodapé",
    skipLink: "Pular para o conteúdo",
    menuOpen: "Menu",
    menuClose: "Fechar menu",
    animationPause: "Pausar animação",
    animationResume: "Retomar animação",
    languages: { pt: "Português", en: "English" },
  },
  nav: {
    links: [
      ["desafios", "Desafios"],
      ["como-funciona", "Como funciona"],
      ["ouca", "Ouça o Bruno"],
      ["piloto", "Piloto"],
      ["investidores", "Investidores"],
    ],
    cta: "Quero ser piloto",
  },
  hero: {
    eyebrow: "VOZZI · UMA SOLUÇÃO HERYZON",
    title: "Menos menu, menos fila. [Mais ligações resolvidas.]",
    subtitle:
      "A Vozzi é um agente de voz com IA que atende as ligações da sua empresa, 24 horas por dia. Ele entende o que a pessoa precisa, resolve os pedidos que se repetem e passa o restante para a sua equipe, já com o resumo da conversa.",
    primary: "Quero ser piloto",
    secondary: "Ouvir o Bruno",
    note: "Programa piloto gratuito para as primeiras empresas.",
  },
  panel: {
    header: "Ligação em andamento · Bruno",
    badge: "EXEMPLO ILUSTRATIVO",
    rows: [
      ["Motivo identificado:", "remarcar horário"],
      ["Regra consultada:", "remarcação até 24 h antes"],
      ["Resolvido na ligação", ""],
      ["Resumo registrado", ""],
    ],
    highlightedRow: 2,
  },
  marquee: ["ATENDE 24 H", "ENTENDE A FALA", "TIRA DÚVIDAS", "AGENDA", "REMARCA", "CANCELA", "FAZ TRIAGEM", "TRANSFERE COM CONTEXTO"],
  challenges: {
    eyebrow: "DESAFIOS",
    title: "Quando o telefone vira gargalo, [todo mundo perde.]",
    items: [
      ["Quem liga", "Navega por menus confusos, espera na linha e repete a mesma informação para mais de uma pessoa."],
      ["A operação", "Gasta tempo da equipe com perguntas repetidas, tem dificuldade de crescer e perde ligações nos picos e fora do horário."],
      ["A gestão", "Tem pouca visão do que as pessoas procuram e recebe transferências sem contexto."],
    ],
  },
  how: {
    eyebrow: "COMO FUNCIONA",
    title: "A pessoa fala. [O Bruno conduz.]",
    steps: [
      ["Atende", "Atende na hora, a qualquer horário, sem menu de teclas."],
      ["Entende", "A pessoa explica com as próprias palavras, e o Bruno identifica o motivo da ligação."],
      ["Consulta", "Busca a resposta nos documentos e nas regras que a sua empresa aprovou."],
      ["Resolve", "Tira a dúvida, agenda, remarca ou cancela durante a própria ligação."],
      ["Passa adiante", "O que precisa de uma pessoa vai para a sua equipe com o resumo pronto. Ninguém repete nada."],
    ],
    flow: {
      label:
        "Fluxograma: o cliente liga; o Bruno faz a triagem; consulta a base de conhecimento da empresa; resolve dúvidas, solicitações e agendamentos na ligação ou passa os casos fora das regras para um atendente humano com o resumo; tudo é registrado automaticamente.",
      cliente: ["Cliente liga", "e fala o que precisa"],
      triagem: ["Triagem", "o Bruno entende o motivo"],
      resolveGroup: "RESOLVE NA LIGAÇÃO",
      kb: ["Base de conhecimento", "documentos e regras da sua empresa"],
      resolve: [
        ["Dúvidas", "responde na hora"],
        ["Solicitações", "resolve por voz"],
        ["Agendamentos", "marca, remarca e cancela"],
      ],
      outsideGroup: "FORA DAS REGRAS",
      humano: ["Atendente humano", "recebe a ligação já com o resumo"],
      registro: ["Registro automático", "motivo, o que foi feito e o resumo"],
    },
  },
  does: {
    eyebrow: "O QUE ELE FAZ",
    title: "Claro sobre o que faz. [E sobre o que não faz.]",
    columns: [
      ["Resolve na ligação", ["Dúvidas frequentes (horários, endereços, documentos, procedimentos)", "Agendamentos", "Remarcações", "Cancelamentos", "Triagem do motivo da ligação"]],
      ["Passa para uma pessoa", ["Reclamações graves", "Negociações", "Situações delicadas", "Qualquer pedido sem regra aprovada"]],
      ["Ainda não faz", ["Ligações de saída", "Vendas", "Atendimento por WhatsApp"]],
    ],
  },
  helps: {
    eyebrow: "ONDE AJUDA",
    title: "Feito para as ligações [que se repetem.]",
    items: [
      ["Fora do horário", "À noite, nos fins de semana e nos feriados, a ligação é atendida."],
      ["Nos picos", "Quando todos chamam ao mesmo tempo, ninguém fica na fila."],
      ["Perguntas repetidas", "A mesma resposta certa, toda vez, sem ocupar a equipe."],
      ["Agendamentos", "Marca, remarca e cancela sem passar por um atendente."],
    ],
  },
  hear: {
    eyebrow: "OUÇA O BRUNO",
    title: "Cada empresa tem [o seu assistente.]",
    text: "O Bruno é a nossa demonstração. Na sua operação, o assistente pode ter outro nome, outra voz e o tom da sua marca.",
    playerTitle: "Conheça o Bruno",
    playerSubtitle: "DEMONSTRAÇÃO · 24 S",
    caption: "Uma amostra da voz e do jeito de falar que podem representar a sua empresa no telefone.",
  },
  control: {
    eyebrow: "CONTROLE",
    title: "Quem decide o que o assistente diz [é a sua empresa.]",
    items: [
      ["Regras aprovadas", "O Bruno só responde e age com base nas regras e documentos que a sua empresa aprovou. Sem regra, ele não improvisa."],
      ["Uma pessoa sempre perto", "Qualquer caso fora das regras vai para a sua equipe, com o resumo da conversa."],
      ["Tudo registrado", "Cada ligação gera um registro com o motivo, o que foi feito e o resumo."],
      ["Transparência", "O assistente se apresenta como assistente virtual. Ninguém é enganado."],
    ],
  },
  pilot: {
    eyebrow: "PROGRAMA PILOTO",
    title: "Seja uma das primeiras empresas [a testar a Vozzi.]",
    text: "Estamos escolhendo as primeiras empresas para testar a Vozzi na prática, sem custo. Conte como é o atendimento por telefone da sua empresa e a gente entra em contato.",
    steps: [
      "Você manda uma mensagem pelo formulário",
      "A gente conversa sobre o atendimento da sua empresa",
      "Definimos juntos o escopo do piloto",
      "O assistente começa a atender as suas ligações",
    ],
    cta: "Quero ser piloto",
  },
  investors: {
    eyebrow: "INVESTIDORES",
    title: "A Vozzi é o primeiro produto [da Heryzon.]",
    text: "Estamos construindo uma plataforma de atendimento por voz que se adapta a diferentes mercados. Se você investe em estágio inicial, queremos conversar.",
    cta: "Falar sobre investimento",
  },
  faq: {
    eyebrow: "PERGUNTAS FREQUENTES",
    title: "Antes de conversar.",
    items: [
      ["Quem liga sabe que está falando com uma IA?", "Sim. O assistente se apresenta como assistente virtual logo no início."],
      ["E se o Bruno não souber responder?", "Ele não inventa. Transfere a ligação para a sua equipe, com o resumo do que já foi conversado."],
      ["Funciona fora do horário comercial?", "Sim. O assistente atende 24 horas por dia, todos os dias."],
      ["Como funciona a integração com os meus sistemas?", "Ela é construída junto com a sua empresa durante o piloto, a partir do que a sua operação usa hoje."],
      ["Atende pelo WhatsApp?", "Ainda não. Hoje a Vozzi atende ligações telefônicas."],
      ["Quanto custa?", "O piloto é gratuito. O modelo de preço será definido depois dele."],
    ],
  },
  contact: {
    eyebrow: "CONTATO",
    title: "Vamos conversar.",
    text: "Conte rapidamente o seu caso. A gente responde em breve.",
    fields: {
      name: "Nome",
      email: "E-mail",
      company: "Empresa",
      industry: "Segmento da empresa",
      volume: "Ligações recebidas por mês",
      interest: "Você quer",
      message: "Mensagem (opcional)",
    },
    volumeOptions: [
      ["ate-1000", "Até 1.000"],
      ["1000-5000", "1.000 a 5.000"],
      ["5000-20000", "5.000 a 20.000"],
      ["mais-20000", "Mais de 20.000"],
      ["nao-sei", "Não sei"],
    ],
    interestOptions: [
      ["piloto", "Ser piloto"],
      ["investimento", "Falar sobre investimento"],
      ["outro", "Outro assunto"],
    ],
    submit: "Enviar",
    consent: ["Ao enviar, você concorda com o uso dos seus dados conforme a nossa ", "Política de privacidade", "."],
    success: "Recebemos a sua mensagem. Respondemos em breve.",
    error: "Não foi possível enviar. Tente de novo em instantes.",
  },
  footer: {
    privacy: "Política de privacidade",
    contact: "Contato",
    rights: "© 2026 Heryzon. Todos os direitos reservados.",
  },
  privacyPage: {
    title: "Política de Privacidade · Heryzon",
    description:
      "Esta política explica como a Heryzon trata os dados pessoais de quem visita o site heryzon.com.br e entra em contato com a gente.",
  },
};
