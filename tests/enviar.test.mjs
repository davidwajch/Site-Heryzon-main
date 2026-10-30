// Testes do enviar.php no servidor embutido do PHP. O e-mail não sai: o sendmail é trocado
// por um "cat" que grava a mensagem num arquivo. Usa o php instalado ou, se não houver,
// uma imagem Docker indicada em PHP_DOCKER_IMAGE (ex.: PHP_DOCKER_IMAGE=php:8.2-cli npm test).

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const localPhp = spawnSync("which", ["php"], { encoding: "utf8" }).stdout?.trim();
const dockerImage = process.env.PHP_DOCKER_IMAGE;
const skip = localPhp || dockerImage ? false : "PHP não encontrado (instale o php ou defina PHP_DOCKER_IMAGE)";

let dataDir;
let proc;
let url;
const containerName = `heryzon-enviar-test-${process.pid}`;

const freePort = () =>
  new Promise((resolve) => {
    const probe = createServer().listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });

before(async () => {
  if (skip) return;
  dataDir = await mkdtemp(path.join(tmpdir(), "heryzon-php-"));
  const port = await freePort();
  url = `http://127.0.0.1:${port}/enviar.php`;
  const settings = (dir) => ["-d", `sys_temp_dir=${dir}`, "-d", `sendmail_path=cat >> ${dir}/mail.txt #`];
  proc = localPhp
    ? spawn(localPhp, ["-S", `127.0.0.1:${port}`, "-t", ROOT, ...settings(dataDir)], { stdio: "ignore" })
    : spawn(
        "docker",
        ["run", "--rm", "--name", containerName, "-v", `${ROOT}:/app:ro`, "-v", `${dataDir}:/data`, "-p", `127.0.0.1:${port}:8000`, dockerImage, "php", "-S", "0.0.0.0:8000", "-t", "/app", ...settings("/data")],
        { stdio: "ignore" },
      );
  for (let i = 0; i < 300; i++) {
    if (await fetch(url).then(() => true, () => false)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("o servidor PHP não subiu");
});

after(async () => {
  if (dockerImage && !localPhp) spawnSync("docker", ["rm", "-f", containerName], { stdio: "ignore" });
  proc?.kill();
  if (dataDir) await rm(dataDir, { recursive: true, force: true });
});

const VALID = { name: "Ana", email: "ana@exemplo.com", company: "ACME", industry: "Clínicas", volume: "nao-sei", message: "Oi", lang: "pt", website: "" };

async function send(fields) {
  const response = await fetch(url, { method: "POST", body: new URLSearchParams({ ...VALID, ...fields }) });
  return { status: response.status, json: await response.json() };
}

let mailRead = 0;
async function lastMail() {
  const all = await readFile(path.join(dataDir, "mail.txt"), "utf8").catch(() => "");
  const fresh = all.slice(mailRead);
  mailRead = all.length;
  return fresh;
}

const subjectOf = (mail) => Buffer.from(mail.match(/^Subject: =\?UTF-8\?B\?(.+)\?=$/m)[1], "base64").toString("utf8");

// Os testes rodam em ordem e dividem o mesmo limite de 5 envios por IP.
test("só aceita os códigos piloto e investimento", { skip }, async () => {
  for (const interest of ["outro", "", "Piloto", "investidor"]) {
    const { status, json } = await send({ interest });
    assert.equal(status, 422, `interest=${JSON.stringify(interest)}`);
    assert.equal(json.error, "invalid_fields");
  }
  assert.equal(await lastMail(), "", "nenhum e-mail sai com código inválido");
});

test("o campo anti-spam responde ok e não envia nada", { skip }, async () => {
  const { status, json } = await send({ interest: "piloto", website: "http://spam.example" });
  assert.equal(status, 200);
  assert.equal(json.ok, true);
  assert.equal(await lastMail(), "");
});

test("piloto: assunto Ser piloto, com empresa, segmento e ligações", { skip }, async () => {
  const { status } = await send({ interest: "piloto" });
  assert.equal(status, 200);
  const mail = await lastMail();
  assert.equal(subjectOf(mail), "Ser piloto - Ana");
  assert.match(mail, /^Assunto: Ser piloto$/m);
  assert.match(mail, /^Empresa: ACME$/m);
  assert.match(mail, /^Segmento: Clínicas$/m);
  assert.match(mail, /^Ligações por mês: Não sei$/m);
});

test("investimento: assunto Investimento, sem empresa, segmento e ligações", { skip }, async () => {
  const { status } = await send({ interest: "investimento" });
  assert.equal(status, 200);
  const mail = await lastMail();
  assert.equal(subjectOf(mail), "Investimento - Ana");
  assert.match(mail, /^Assunto: Investimento$/m);
  assert.match(mail, /^Nome: Ana$/m);
  assert.doesNotMatch(mail, /Empresa:|Segmento:|Ligações por mês:/);
});

test("o limite de 5 envios por IP continua valendo", { skip }, async () => {
  for (let i = 0; i < 3; i++) assert.equal((await send({ interest: "investimento" })).status, 200);
  const { status, json } = await send({ interest: "piloto" });
  assert.equal(status, 429);
  assert.equal(json.error, "rate_limited");
});
