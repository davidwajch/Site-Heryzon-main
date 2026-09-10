import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "./contact-info";
import {
  ButtonLink,
  Footer,
  SectionLabel,
  SiteHeader,
  Waveform,
} from "./ui";

export const metadata: Metadata = {
  title: "Vozzi",
  description:
    "A Vozzi identifica a necessidade do paciente, coleta informações e resolve ou encaminha o atendimento com contexto.",
};

const problemSides = [
  {
    title: "Paciente",
    text: "Enfrenta menus confusos de URA, repete informações, espera na linha e depende da disponibilidade do atendente.",
  },
  {
    title: "Hospitais e clínicas",
    text: "Operam com alto custo, dificuldade de escalar e perda de pacientes por demora ou abandono.",
  },
  {
    title: "Gestores",
    text: "Têm pouca visibilidade dos gargalos e recebem transferências sem contexto, obrigando a equipe a refazer perguntas.",
  },
];

const solutionCards = [
  {
    title: "Atendimento natural",
    text: "O paciente simplesmente fala o que precisa, sem depender de menus rígidos de URA.",
  },
  {
    title: "Intenção identificada",
    text: "A Vozzi entende a necessidade do paciente e conduz a conversa a partir desse contexto.",
  },
  {
    title: "Coleta de informações",
    text: "A solução reúne os dados necessários antes de resolver ou encaminhar o atendimento.",
  },
  {
    title: "Redução de tempo e custo",
    text: "Fluxos repetitivos deixam de depender integralmente da disponibilidade da equipe humana.",
  },
  {
    title: "Menos abandono",
    text: "A jornada fica mais fluida e reduz a chance de o paciente desistir durante a espera.",
  },
  {
    title: "Inovação em saúde",
    text: "Combina experiência voice-first, especialização no setor, continuidade entre canais e possibilidade de execução local.",
  },
];

const demoAudioSrc = "/audio/vozzi-demo.mp3";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero section-dark">
          <div className="container hero-grid">
            <div className="hero-copy">
              <SectionLabel>HERYZON · VOZZI</SectionLabel>
              <h1>
                Agentes de voz com IA para reduzir tempo, custo e abandono no
                atendimento hospitalar.
              </h1>
              <p>
                Nosso primeiro produto é a Vozzi, uma solução que identifica a
                necessidade do paciente, coleta as informações necessárias e
                resolve ou encaminha o atendimento com contexto.
              </p>
              <div className="hero-actions">
                <ButtonLink href="#problema">Ver o problema</ButtonLink>
                <ButtonLink href="#solucao" variant="inverse">
                  Ver a solução
                </ButtonLink>
                <ButtonLink href="#contato" variant="inverse">
                  Falar com os founders
                </ButtonLink>
              </div>
            </div>

            <aside className="hero-signal-card" aria-label="Resumo da jornada">
              <span className="signal-kicker">Pergunta de origem</span>
              <p>
                Quanto tempo deveria levar para marcar uma consulta ou exame?
              </p>
              <Waveform />
              {/* TODO: fornecer transcrição/legendas do áudio de demonstração. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                className="hero-audio-player"
                controls
                preload="metadata"
                src={demoAudioSrc}
                aria-label="Ouvir demonstração da Vozzi"
              >
                <a href={demoAudioSrc}>Baixar o áudio MP3</a>
              </audio>
              <div className="signal-row">
                <span>Paciente fala</span>
                <span>Vozzi entende</span>
                <span>Atendimento segue</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="problem-section" id="problema">
          <div className="container problem-layout">
            <div className="section-intro">
              <SectionLabel>PROBLEMA</SectionLabel>
              <h2>Uma dor estrutural do atendimento telefônico na saúde.</h2>
              <p>
                A ideia nasceu depois de uma tentativa de marcação que levou
                mais de vinte minutos ao telefone. Ao investigar, ficou claro
                que não era um problema de uma clínica específica, mas de uma
                jornada que falha em três lados ao mesmo tempo.
              </p>
            </div>
            <div className="problem-cards">
              {problemSides.map((item) => (
                <article className="problem-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="solution-section" id="solucao">
          <div className="container">
            <div className="solution-heading">
              <div className="section-intro">
                <SectionLabel>SOLUÇÃO</SectionLabel>
                <h2>O paciente fala o que precisa. A Vozzi conduz o fluxo.</h2>
                <p>
                  Em vez de navegar por uma URA rígida, o paciente simplesmente
                  fala. A Vozzi identifica a intenção, coleta as informações
                  necessárias e resolve ou encaminha o atendimento com contexto.
                </p>
              </div>
              <a className="solution-contact" href="#contato">
                Falar com os founders
              </a>
            </div>

            <div className="solution-card-grid">
              {solutionCards.map((item) => (
                <article className="solution-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mvp-section section-dark" id="video-mvp">
          <div className="container mvp-layout">
            <div className="section-intro">
              <SectionLabel>DEMONSTRAÇÃO EM ÁUDIO</SectionLabel>
              <h2>Primeira amostra em MP3 conectada ao site.</h2>
              <p>
                A Vozzi será apresentada por áudio no protótipo, com uma
                amostra inicial conectada ao player.
              </p>
            </div>

            <div
              className="audio-demo-card"
              aria-label="Demonstração em áudio do protótipo"
            >
              <div className="audio-demo-head">
                <div>
                  <span className="audio-demo-kicker">Arquivo MP3</span>
                  <h3>Amostra Vozzi</h3>
                </div>
                <span className="audio-demo-duration">30s</span>
              </div>
              <Waveform />
              {/* TODO: fornecer transcrição/legendas do áudio de demonstração. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                className="audio-demo-player"
                controls
                preload="metadata"
                src={demoAudioSrc}
              >
                <a href={demoAudioSrc}>Baixar o áudio MP3</a>
              </audio>
              <p>MP3 de demonstração conectado ao protótipo da Vozzi.</p>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="container contact-band">
            <div>
              <SectionLabel>CONTATO</SectionLabel>
              <h2>Falar com os founders.</h2>
              <p>
                Preencha o formulário para enviar sua mensagem para{" "}
                <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
