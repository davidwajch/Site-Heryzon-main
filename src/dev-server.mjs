// Servidor local para testar o site sem PHP.
// POST /enviar.php é simulado: responde sucesso, erro 500 com FORM_MOCK=error
// ou limite de envios (429) com FORM_MOCK=limit.
// Uso: npm run dev   (ou FORM_MOCK=error npm run dev)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.env.PORT || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const file = path.join(ROOT, path.normalize(decodeURIComponent(urlPath)));
  if (!file.startsWith(ROOT)) return null;
  const info = await stat(file).catch(() => null);
  if (info?.isDirectory()) return urlPath.endsWith("/") ? path.join(file, "index.html") : { redirect: `${urlPath}/` };
  return info ? file : null;
}

createServer(async (req, res) => {
  const { pathname, search } = new URL(req.url, "http://localhost");

  if (pathname === "/enviar.php" && req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    console.log(`[form] ${body.length} bytes recebidos`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mock = { error: [500, "send_failed"], limit: [429, "rate_limited"] }[process.env.FORM_MOCK];
    res.writeHead(mock ? mock[0] : 200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(mock ? { ok: false, error: mock[1] } : { ok: true }));
    return;
  }

  const file = await resolveFile(pathname);
  if (file?.redirect) {
    res.writeHead(301, { Location: file.redirect + search });
    res.end();
    return;
  }
  const data = file && (await readFile(file).catch(() => null));
  if (!data) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(data);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${PORT}${process.env.FORM_MOCK ? `  (formulário simulando: ${process.env.FORM_MOCK})` : ""}`);
});
