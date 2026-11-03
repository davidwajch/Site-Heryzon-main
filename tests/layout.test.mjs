// Só o conteúdo de public_html/ vai para a Hostinger: nenhum arquivo do site fora dele,
// nenhum arquivo de desenvolvimento dentro dele.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = path.join(ROOT, "public_html");
const SITE_ENTRIES = [".htaccess", "assets", "audio", "en", "enviar.php", "favicon.svg", "index.html", "privacidade", "robots.txt", "sitemap.xml"];
const IGNORED = new Set([".DS_Store", "Thumbs.db"]);

async function walk(dir, skip = new Set()) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name) || skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(path.relative(ROOT, full));
  }
  return files;
}

test("public_html has exactly the site files", async () => {
  const entries = (await readdir(SITE)).filter((name) => !IGNORED.has(name)).sort();
  assert.deepEqual(entries, SITE_ENTRIES);
});

test("no development files inside public_html", async () => {
  const dev = (await walk(SITE)).filter((file) =>
    /(^|\/)(src|tests|docs|node_modules|\.git)\//.test(file) ||
    /\.(mjs|md|map|log)$/.test(file) ||
    /(^|\/)(package(-lock)?\.json|\.gitignore|\.gitattributes|\.env[^/]*|vercel\.json)$/.test(file),
  );
  assert.deepEqual(dev, []);
});

test("no site files outside public_html", async () => {
  const rootEntries = await readdir(ROOT);
  assert.deepEqual(rootEntries.filter((name) => SITE_ENTRIES.includes(name)), [], "na raiz");
  const outside = (await walk(ROOT, new Set(["public_html", ".git", "node_modules"]))).filter((file) =>
    /\.(html|php|css|js|woff2?|mp3|svg|xml)$/.test(file) || /(^|\/)(\.htaccess|robots\.txt)$/.test(file),
  );
  assert.deepEqual(outside, []);
});
