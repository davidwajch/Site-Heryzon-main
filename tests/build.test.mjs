import { test, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildSite } from "../src/build.mjs";

const pages = {};

before(async () => {
  const out = await mkdtemp(path.join(tmpdir(), "heryzon-"));
  await buildSite(out);
  for (const [key, file] of Object.entries({
    pt: "index.html",
    en: "en/index.html",
    privacidade: "privacidade/index.html",
    privacy: "en/privacy/index.html",
  })) {
    pages[key] = await readFile(path.join(out, file), "utf8");
  }
});

const sectionIds = (html) => [...html.matchAll(/<section [^>]*\bid="([a-z-]+)"/g)].map((m) => m[1]);

test("html lang per page", () => {
  assert.match(pages.pt, /<html lang="pt-BR">/);
  assert.match(pages.privacidade, /<html lang="pt-BR">/);
  assert.match(pages.en, /<html lang="en">/);
  assert.match(pages.privacy, /<html lang="en">/);
});

test("titles and descriptions from the spec", () => {
  assert.match(pages.pt, /<title>Vozzi por Heryzon — assistente virtual de voz para atendimento telefônico<\/title>/);
  assert.match(pages.en, /<title>Vozzi by Heryzon — virtual voice assistant for phone support<\/title>/);
  assert.match(pages.pt, /<meta property="og:title" content="Vozzi por Heryzon — assistente virtual de voz para atendimento telefônico">/);
  assert.match(pages.pt, /<meta name="description" content="A Vozzi atende as ligações da sua empresa 24 horas por dia/);
  assert.match(pages.en, /<meta name="description" content="Vozzi answers your company&#39;s calls 24 hours a day|<meta name="description" content="Vozzi answers your company's calls 24 hours a day/);
});

test("canonical and hreflang alternates", () => {
  for (const html of [pages.pt, pages.en]) {
    assert.match(html, /<link rel="alternate" hreflang="pt-BR" href="https:\/\/heryzon.com.br\/">/);
    assert.match(html, /<link rel="alternate" hreflang="en" href="https:\/\/heryzon.com.br\/en\/">/);
    assert.match(html, /<link rel="alternate" hreflang="x-default" href="https:\/\/heryzon.com.br\/">/);
  }
  assert.match(pages.pt, /<link rel="canonical" href="https:\/\/heryzon.com.br\/">/);
  assert.match(pages.en, /<link rel="canonical" href="https:\/\/heryzon.com.br\/en\/">/);
  assert.match(pages.privacy, /<link rel="canonical" href="https:\/\/heryzon.com.br\/en\/privacy\/">/);
});

test("sections in spec order with required anchors", () => {
  const expected = ["topo", "desafios", "como-funciona", "o-que-faz", "onde-ajuda", "ouca", "controle", "piloto", "investidores", "perguntas", "contato"];
  assert.deepEqual(sectionIds(pages.pt), expected);
  assert.deepEqual(sectionIds(pages.en), expected);
  for (const html of [pages.pt, pages.en]) {
    assert.match(html, /class="marquee"/);
    assert.ok(html.indexOf('class="marquee"') > html.indexOf('id="topo"'));
    assert.ok(html.indexOf('class="marquee"') < html.indexOf('id="desafios"'));
    assert.match(html, /<header class="site-header"/);
    assert.match(html, /<footer class="site-footer"/);
  }
});

test("hero title option B with grey second half", () => {
  assert.match(pages.pt, /Menos menu, menos fila\. <span class="title-muted">Mais ligações resolvidas\.<\/span>/);
  assert.match(pages.en, /Fewer menus, shorter queues\. <span class="title-muted">More calls resolved\.<\/span>/);
  const visibleText = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, "");
  assert.doesNotMatch(visibleText(pages.pt), /\[|\]/);
  assert.doesNotMatch(visibleText(pages.en), /\[|\]/);
});

test("no third-party URLs and no technical jargon", () => {
  for (const html of Object.values(pages)) {
    const urls = [...html.matchAll(/(?:src|href|content|action)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    for (const url of urls) assert.ok(url.startsWith("https://heryzon.com.br/"), `third-party URL: ${url}`);
    assert.doesNotMatch(html, /googleapis|gstatic|\bRAG\b/);
  }
});

test("flowchart nodes and steps", () => {
  for (const html of [pages.pt, pages.en]) {
    for (const node of ["cliente", "triagem", "kb", "resolve", "humano", "registro"]) {
      assert.match(html, new RegExp(`data-node="${node}"`));
    }
    assert.equal((html.match(/data-node="resolve"/g) || []).length, 3);
    assert.equal((html.match(/data-step="\d"/g) || []).length, 5);
  }
});

test("no \"IA\" or \"AI\" as a word on any page, meta tag or alt text", () => {
  for (const [key, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /\b(IA|AI)\b/, key);
    assert.doesNotMatch(html, /intelig[êe]ncia artificial|artificial intelligence/i, key);
  }
});

test("hero panel: header, badge, caption and player, without the old rows", () => {
  for (const [html, header, badge, caption] of [
    [pages.pt, "Bruno · assistente virtual", "DEMONSTRAÇÃO DE VOZ", "Ouça como o Bruno se apresenta."],
    [pages.en, "Bruno · virtual assistant", "VOICE DEMO", "Hear how Bruno introduces himself."],
  ]) {
    assert.match(html, new RegExp(`</span>${header}</span>\\s*<span class="badge">${badge}</span>`));
    assert.match(html, new RegExp(`<p class="call-panel-caption" id="call-panel-caption">${caption.replace(".", "\\.")}</p>\\s*<audio [^>]*aria-labelledby="call-panel-caption"`));
    assert.doesNotMatch(html, /call-steps|Motivo identificado|Reason identified/);
  }
});

test("pilot: free first validation, new steps and note", () => {
  assert.match(pages.pt, /<p class="hero-note">Programa piloto com a primeira validação gratuita\.<\/p>/);
  assert.match(pages.en, /<p class="hero-note">Pilot program with your first validation free of charge\.<\/p>/);
  assert.match(pages.pt, /Escolhemos juntos o primeiro tipo de atendimento a validar/);
  assert.match(pages.en, /The assistant handles those calls, at no cost to you/);
  assert.match(pages.pt, /<p class="pilot-note">Validações seguintes: condições combinadas antes, sem surpresas\.<\/p>/);
  assert.match(pages.en, /<p class="pilot-note">Further validations: terms agreed in advance, no surprises\.<\/p>/);
  assert.match(pages.pt, /A primeira validação do piloto é gratuita\./);
  assert.equal((pages.pt.match(/<span class="step-circle"/g) || []).length, 4);
});

test("contact form fields, values and preset buttons", () => {
  for (const html of [pages.pt, pages.en]) {
    for (const name of ["name", "email", "company", "industry", "volume", "interest", "message", "lang", "website"]) {
      assert.match(html, new RegExp(`name="${name}"`), name);
    }
    for (const value of ["ate-1000", "1000-5000", "5000-20000", "mais-20000", "nao-sei"]) {
      assert.match(html, new RegExp(`<option value="${value}"`), value);
    }
    assert.match(html, /<input type="radio" name="interest" value="piloto" checked>/);
    assert.match(html, /<input type="radio" name="interest" value="investimento">/);
    assert.equal((html.match(/name="interest"/g) || []).length, 2);
    assert.doesNotMatch(html, /value="outro"|<select [^>]*name="interest"/);
    for (const id of ["f-company", "f-industry", "f-volume"]) {
      assert.match(html, new RegExp(`<div class="field" data-topic="piloto"><label for="${id}">`), id);
    }
    assert.equal((html.match(/data-topic="/g) || []).length, 3);
    assert.match(html, /<p class="visually-hidden" role="status" data-topic-status><\/p>/);
    assert.match(html, /<input [^>]*name="name"[^>]*required/);
    assert.match(html, /<input [^>]*type="email"[^>]*name="email"[^>]*required/);
    assert.match(html, /data-interest="investimento"/);
    assert.ok((html.match(/data-interest="piloto"/g) || []).length >= 3);
  }
  assert.match(pages.pt, /<fieldset class="topic field-wide"[^>]*><legend>Sobre o que você quer falar\?<\/legend>.*<span>Piloto<\/span>.*<span>Investidor<\/span>/);
  assert.match(pages.en, /<fieldset class="topic field-wide"[^>]*><legend>What would you like to talk about\?<\/legend>.*<span>Pilot<\/span>.*<span>Investor<\/span>/);
  assert.match(pages.pt, /href="\/privacidade\/">Política de privacidade<\/a>/);
  assert.match(pages.en, /href="\/en\/privacy\/">Privacy policy<\/a>/);
});

test("footer: other matters by e-mail on every page", () => {
  for (const [key, label] of [["pt", "Outros assuntos:"], ["privacidade", "Outros assuntos:"], ["en", "Other matters:"], ["privacy", "Other matters:"]]) {
    assert.match(pages[key], new RegExp(`<p class="footer-other">${label} <a href="mailto:contato@heryzon.com.br">contato@heryzon.com.br</a></p>`), key);
  }
});

test("privacy policy with company data and pending placeholders", () => {
  assert.match(pages.privacidade, /Heryzon Tecnologia e Inovação Ltda, CNPJ 68\.590\.276\/0001-00, com sede em \[ENDEREÇO\]/);
  assert.match(pages.privacidade, /\[DATA DE PUBLICAÇÃO\]/);
  assert.match(pages.privacidade, /contato@heryzon\.com\.br/);
  assert.match(pages.privacidade, /até 24 meses depois do último contato/);
  assert.match(pages.privacidade, /assunto de interesse \(piloto ou investimento\);/);
  assert.match(pages.privacidade, /empresa, segmento e faixa de ligações só são pedidos no contato sobre o piloto\./);
  assert.match(pages.privacy, /topic of interest \(pilot or investing\);/);
  assert.match(pages.privacy, /company, industry and range of calls are only requested when you contact us about the pilot\./);
  assert.doesNotMatch(pages.privacidade, /\[RAZÃO SOCIAL\]|\[CNPJ\]|\[E-MAIL DE PRIVACIDADE\]/);
  assert.match(pages.privacy, /Heryzon Tecnologia e Inovação Ltda, CNPJ 68\.590\.276\/0001-00, located at \[ADDRESS\]/);
  assert.match(pages.privacy, /\[PUBLICATION DATE\]/);
  assert.doesNotMatch(pages.privacy, /\[LEGAL NAME\]|\[CNPJ\]|\[PRIVACY EMAIL\]/);
});

test("language switch points to the equivalent page", () => {
  assert.match(pages.pt, /<a [^>]*href="\/en\/"[^>]*data-lang-switch="en"/);
  assert.match(pages.en, /<a [^>]*href="\/"[^>]*data-lang-switch="pt"/);
  assert.match(pages.privacidade, /<a [^>]*href="\/en\/privacy\/"[^>]*data-lang-switch="en"/);
  assert.match(pages.privacy, /<a [^>]*href="\/privacidade\/"[^>]*data-lang-switch="pt"/);
});

test("mobile menu toggle with accessible state and labels", () => {
  for (const [html, open, close] of [
    [pages.pt, "Menu", "Fechar menu"],
    [pages.en, "Menu", "Close menu"],
    [pages.privacidade, "Menu", "Fechar menu"],
  ]) {
    assert.match(html, new RegExp(`<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav" data-label-open="${open}" data-label-close="${close}">`));
    assert.match(html, /<nav class="main-nav" id="main-nav"/);
    assert.ok(html.indexOf('class="menu-toggle"') < html.indexOf('id="main-nav"'), "toggle precedes nav in tab order");
  }
});

test("marquee without pause button, focusable to pause from the keyboard", () => {
  for (const html of [pages.pt, pages.en]) {
    assert.doesNotMatch(html, /motion-toggle|Pausar animação|Retomar animação|Pause animation|Resume animation/);
    assert.match(html, /<div class="marquee" role="marquee" tabindex="0" aria-label="[^"]+">/);
  }
  assert.match(pages.pt, /aria-label="ATENDE 24 H, ENTENDE A FALA, TIRA DÚVIDAS, AGENDA, REMARCA, CANCELA, FAZ TRIAGEM, TRANSFERE COM CONTEXTO"/);
});
