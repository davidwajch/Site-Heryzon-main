// Testes do JavaScript do site num Chrome sem interface (pulados se não houver Chrome).

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "../src/build.mjs";
import { createDevServer } from "../src/dev-server.mjs";
import { chromePath, launchBrowser } from "./lib/browser.mjs";
import pt from "../src/content/pt.mjs";
import en from "../src/content/en.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skip = chromePath ? false : "Chrome não encontrado (defina CHROME_PATH para rodar)";

let out;
let server;
let browser;
let base;
const forms = [];

before(async () => {
  if (skip) return;
  out = await mkdtemp(path.join(tmpdir(), "heryzon-site-"));
  await buildSite(out);
  server = createDevServer({ roots: [out, ROOT], formMock: "", formDelay: 0, onForm: (body) => forms.push(body) });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await launchBrowser();
});

after(async () => {
  server?.closeAllConnections();
  server?.close();
  if (out) await rm(out, { recursive: true, force: true });
  await browser?.close();
});

// Campos visíveis (sem os radios, o hidden e o anti-spam) e os nomes que o FormData enviaria.
const FORM_STATE = `(() => {
  const form = document.getElementById("contact-form");
  const visible = [...form.querySelectorAll("input, select, textarea")]
    .filter((el) => el.type !== "hidden" && el.type !== "radio" && !el.closest(".hp-field") && el.getClientRects().length > 0)
    .map((el) => el.name);
  return {
    topic: form.querySelector('input[name="interest"]:checked').value,
    visible,
    sent: [...new FormData(form).keys()],
    status: form.querySelector("[data-topic-status]").textContent,
  };
})()`;

// Nomes e valores de um corpo multipart/form-data.
function parseMultipart(body) {
  return Object.fromEntries([...body.matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)\r\n/g)].map((m) => [m[1], m[2]]));
}

async function waitForForm(count) {
  for (let i = 0; i < 100 && forms.length < count; i++) await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(forms.length, count, "o formulário não chegou ao servidor");
  return parseMultipart(forms[count - 1]);
}

test("Piloto é o padrão e mostra os campos da empresa", { skip }, async () => {
  const page = await browser.newPage({ width: 1280, height: 900 });
  await page.goto(`${base}/`);
  const state = await page.evaluate(FORM_STATE);
  assert.equal(state.topic, "piloto");
  assert.deepEqual(state.visible, ["name", "email", "company", "industry", "volume", "message"]);
  assert.deepEqual(state.sent, ["interest", "name", "email", "company", "industry", "volume", "message", "lang", "website"]);
  assert.equal(state.status, "", "nada é anunciado ao carregar a página");
  await page.close();
});

test("Investidor esconde, não valida e não envia os campos da empresa", { skip }, async () => {
  const page = await browser.newPage({ width: 1280, height: 900 });
  await page.goto(`${base}/`);
  await page.evaluate(`document.getElementById("f-company").value = "ACME"; document.querySelector('input[value="investimento"]').click()`);
  const state = await page.evaluate(FORM_STATE);
  assert.equal(state.topic, "investimento");
  assert.deepEqual(state.visible, ["name", "email", "message"]);
  assert.deepEqual(state.sent, ["interest", "name", "email", "message", "lang", "website"]);
  assert.equal(state.status, pt.contact.topic.announce.investimento);
  assert.equal(await page.evaluate(`document.getElementById("f-company").willValidate`), false);

  const before = forms.length;
  await page.evaluate(`
    document.getElementById("f-name").value = "Ana";
    document.getElementById("f-email").value = "ana@exemplo.com";
    document.getElementById("contact-form").requestSubmit();
  `);
  const sent = await waitForForm(before + 1);
  assert.equal(sent.interest, "investimento");
  assert.deepEqual(Object.keys(sent).sort(), ["email", "interest", "lang", "message", "name", "website"]);

  // Voltando para Piloto, o valor digitado continua lá e volta a ser enviado.
  await page.goto(`${base}/`);
  await page.evaluate(`document.querySelector('input[value="investimento"]').click(); document.querySelector('input[value="piloto"]').click()`);
  const back = await page.evaluate(FORM_STATE);
  assert.deepEqual(back.visible, ["name", "email", "company", "industry", "volume", "message"]);
  assert.equal(back.status, pt.contact.topic.announce.piloto);
  await page.close();
});

test("Envio como piloto leva empresa, segmento e ligações", { skip }, async () => {
  const page = await browser.newPage({ width: 1280, height: 900 });
  await page.goto(`${base}/en/`);
  const before = forms.length;
  await page.evaluate(`
    document.getElementById("f-name").value = "Ana";
    document.getElementById("f-email").value = "ana@example.com";
    document.getElementById("f-company").value = "ACME";
    document.getElementById("f-volume").value = "nao-sei";
    document.getElementById("contact-form").requestSubmit();
  `);
  const sent = await waitForForm(before + 1);
  assert.equal(sent.interest, "piloto");
  assert.equal(sent.company, "ACME");
  assert.equal(sent.volume, "nao-sei");
  assert.equal(sent.lang, "en");
  await page.evaluate(`document.querySelector('input[value="investimento"]').click()`);
  // O formulário some depois do envio; o anúncio continua no idioma da página.
  assert.equal(await page.evaluate(`document.querySelector("[data-topic-status]").textContent`), en.contact.topic.announce.investimento);
  await page.close();
});

test("Botões de piloto e de investimento escolhem a opção do formulário", { skip }, async () => {
  const page = await browser.newPage({ width: 1280, height: 900 });
  await page.goto(`${base}/`);
  await page.evaluate(`document.querySelector('.investors [data-interest="investimento"]').click()`);
  assert.equal((await page.evaluate(FORM_STATE)).topic, "investimento");
  for (const selector of [".site-header", ".hero", ".pilot-copy"]) {
    await page.evaluate(`document.querySelector('input[value="investimento"]').click(); document.querySelector('${selector} [data-interest="piloto"]').click()`);
    assert.equal((await page.evaluate(FORM_STATE)).topic, "piloto", selector);
  }
  await page.close();
});

test("Faixa corrida: o toque pausa e retoma; o clique do mouse não prende a pausa", { skip }, async () => {
  const page = await browser.newPage({ width: 375, height: 812 });
  await page.goto(`${base}/`);
  const tap = (pointerType) =>
    page.evaluate(`(() => {
      const marquee = document.querySelector(".marquee");
      marquee.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "${pointerType}", bubbles: true }));
      marquee.click();
      return marquee.classList.contains("is-paused");
    })()`);
  assert.equal(await tap("touch"), true);
  assert.equal(await tap("touch"), false);
  assert.equal(await tap("mouse"), false);
  assert.equal(await page.evaluate(`document.querySelector(".marquee").tabIndex`), 0, "focável pelo teclado");
  await page.close();
});

// Mesma tabela da especificação: passo -> caixas acesas.
const FLOW = { 1: ["cliente"], 2: ["triagem"], 3: ["kb"], 4: ["registro", "resolve"], 5: ["humano", "registro"] };

for (const [width, height] of [
  [375, 812],
  [1280, 800],
]) {
  test(`Fluxograma acende as caixas certas, em ordem, rolando a ${width}×${height}`, { skip }, async () => {
    const page = await browser.newPage({ width, height });
    await page.goto(`${base}/`);
    const [start, end] = await page.evaluate(`(() => {
      const grid = document.querySelector(".how-grid").getBoundingClientRect();
      return [Math.round(grid.top + scrollY - innerHeight), Math.round(grid.bottom + scrollY)];
    })()`);
    const order = [];
    for (let y = start; y <= end; y += 20) {
      await page.scrollTo(y);
      const { active, lit, coveredBy } = await page.evaluate(`(() => {
        const flow = document.querySelector(".how-flow").getBoundingClientRect();
        const step = document.querySelector(".how-step.is-active");
        const box = step.getBoundingClientRect();
        const stuck = getComputedStyle(document.querySelector(".how-flow")).position === "sticky" && flow.top >= 0 && flow.top < 2;
        return {
          active: Number(step.dataset.step),
          lit: [...new Set([...document.querySelectorAll(".flow-node.is-lit")].map((n) => n.dataset.node))].sort(),
          coveredBy: stuck && ${width} <= 980 ? Math.max(0, flow.bottom - box.top) : 0,
        };
      })()`);
      assert.deepEqual(lit, FLOW[active], `y=${y}, passo ${active}`);
      assert.equal(coveredBy, 0, `y=${y}: o passo ${active} aceso está embaixo do fluxograma`);
      if (order.at(-1) !== active) order.push(active);
    }
    assert.deepEqual(order, [1, 2, 3, 4, 5]);
    await page.close();
  });
}
