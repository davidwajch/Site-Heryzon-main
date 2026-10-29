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
  assert.match(pages.pt, /<title>Vozzi por Heryzon — agente de voz com IA para atendimento telefônico<\/title>/);
  assert.match(pages.en, /<title>Vozzi by Heryzon — AI voice agent for phone support<\/title>/);
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

test("contact form fields, values and preset buttons", () => {
  for (const html of [pages.pt, pages.en]) {
    for (const name of ["name", "email", "company", "industry", "volume", "interest", "message", "lang", "website"]) {
      assert.match(html, new RegExp(`name="${name}"`), name);
    }
    for (const value of ["piloto", "investimento", "outro", "ate-1000", "1000-5000", "5000-20000", "mais-20000", "nao-sei"]) {
      assert.match(html, new RegExp(`<option value="${value}"`), value);
    }
    assert.match(html, /<input [^>]*name="name"[^>]*required/);
    assert.match(html, /<input [^>]*type="email"[^>]*name="email"[^>]*required/);
    assert.match(html, /data-interest="investimento"/);
    assert.ok((html.match(/data-interest="piloto"/g) || []).length >= 3);
  }
  assert.match(pages.pt, /href="\/privacidade\/">Política de privacidade<\/a>/);
  assert.match(pages.en, /href="\/en\/privacy\/">Privacy policy<\/a>/);
});

test("privacy policy with company data and pending placeholders", () => {
  assert.match(pages.privacidade, /Heryzon Tecnologia e Inovação Ltda, CNPJ 68\.590\.276\/0001-00, com sede em \[ENDEREÇO\]/);
  assert.match(pages.privacidade, /\[DATA DE PUBLICAÇÃO\]/);
  assert.match(pages.privacidade, /contato@heryzon\.com\.br/);
  assert.match(pages.privacidade, /até 24 meses depois do último contato/);
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

test("marquee pause button with labels", () => {
  assert.match(pages.pt, /class="motion-toggle" aria-label="Pausar animação" data-label-pause="Pausar animação" data-label-resume="Retomar animação"/);
  assert.match(pages.en, /class="motion-toggle" aria-label="Pause animation" data-label-pause="Pause animation" data-label-resume="Resume animation"/);
});
