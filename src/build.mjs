// Gera as páginas estáticas do site (PT e EN) na raiz do repositório.
// Uso: node src/build.mjs

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pt from "./content/pt.mjs";
import en from "./content/en.mjs";
import { layout } from "./templates/layout.mjs";
import { home } from "./templates/home.mjs";
import { privacy } from "./templates/privacy.mjs";

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(SRC);

// Dados cadastrais da política de privacidade. Enquanto um valor for null,
// o campo entre colchetes continua visível na página.
export const COMPANY = {
  legalName: "Heryzon Tecnologia e Inovação Ltda",
  cnpj: "68.590.276/0001-00",
  address: null,
  email: "contato@heryzon.com.br",
  publishedAt: null, // data de publicação no formato "AAAA-MM-DD"
};

const PLACEHOLDERS = {
  "pt-BR": { legalName: "[RAZÃO SOCIAL]", cnpj: "[CNPJ]", address: "[ENDEREÇO]", email: "[E-MAIL DE PRIVACIDADE]", publishedAt: "[DATA DE PUBLICAÇÃO]" },
  en: { legalName: "[LEGAL NAME]", cnpj: "[CNPJ]", address: "[ADDRESS]", email: "[PRIVACY EMAIL]", publishedAt: "[PUBLICATION DATE]" },
};

function formatDate(isoDate, lang) {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function fillCompany(markdown, lang) {
  let filled = markdown;
  for (const [key, placeholder] of Object.entries(PLACEHOLDERS[lang])) {
    const value = COMPANY[key];
    if (value == null) continue;
    filled = filled.replaceAll(placeholder, key === "publishedAt" ? formatDate(value, lang) : value);
  }
  return filled;
}

// Versão de CSS/JS pelo conteúdo, para o cache longo do .htaccess não servir arquivo velho.
async function assetVersion(file) {
  const data = await readFile(path.join(ROOT, "assets", file));
  return createHash("sha256").update(data).digest("hex").slice(0, 10);
}

export async function buildSite(outDir = ROOT) {
  const assets = { css: await assetVersion("styles.css"), js: await assetVersion("main.js") };
  const homeAlternates = { pt: pt.paths.home, en: en.paths.home };
  const privacyAlternates = { pt: pt.paths.privacy, en: en.paths.privacy };

  const pages = [];
  for (const [t, policyFile] of [
    [pt, "privacy-pt.md"],
    [en, "privacy-en.md"],
  ]) {
    pages.push({
      file: path.join(t.paths.home, "index.html"),
      html: layout({ t, pageKey: "home", title: t.meta.title, description: t.meta.description, alternates: homeAlternates, assets, body: home(t) }),
    });

    const markdown = fillCompany(await readFile(path.join(SRC, "content", policyFile), "utf8"), t.lang);
    pages.push({
      file: path.join(t.paths.privacy, "index.html"),
      html: layout({
        t,
        pageKey: "privacy",
        title: t.privacyPage.title,
        description: t.privacyPage.description,
        alternates: privacyAlternates,
        assets,
        body: privacy({ markdown, email: COMPANY.email }),
      }),
    });
  }

  const written = [];
  for (const { file, html } of pages) {
    const target = path.join(outDir, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
    written.push(target);
  }
  return written;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const written = await buildSite();
  for (const file of written) console.log(path.relative(ROOT, file));
}
