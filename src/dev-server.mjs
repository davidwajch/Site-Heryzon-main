// Servidor local para testar o site sem PHP, servindo a pasta public_html/.
// POST /enviar.php é simulado: responde sucesso, erro 500 com FORM_MOCK=error
// ou limite de envios (429) com FORM_MOCK=limit.
// Uso: npm run dev   (ou FORM_MOCK=error npm run dev)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public_html");
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

async function resolveFile(root, urlPath) {
  const file = path.join(root, path.normalize(decodeURIComponent(urlPath)));
  if (!file.startsWith(root)) return null;
  const info = await stat(file).catch(() => null);
  if (info?.isDirectory()) return urlPath.endsWith("/") ? path.join(file, "index.html") : { redirect: `${urlPath}/` };
  return info ? file : null;
}

// Nos testes de navegador: roots põe na frente a pasta com as páginas recém-geradas,
// e onForm recebe o corpo bruto de cada envio do formulário.
export function createDevServer({ roots = [SITE], formMock = process.env.FORM_MOCK, formDelay = 800, onForm } = {}) {
  return createServer(async (req, res) => {
    const { pathname, search } = new URL(req.url, "http://localhost");

    if (pathname === "/enviar.php" && req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      console.log(`[form] ${body.length} bytes recebidos`);
      onForm?.(body);
      await new Promise((resolve) => setTimeout(resolve, formDelay));
      const mock = { error: [500, "send_failed"], limit: [429, "rate_limited"] }[formMock];
      res.writeHead(mock ? mock[0] : 200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(mock ? { ok: false, error: mock[1] } : { ok: true }));
      return;
    }

    let file = null;
    for (const root of roots) {
      file = await resolveFile(root, pathname);
      if (file?.redirect || (file && (await stat(file).catch(() => null)))) break;
      file = null;
    }
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
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    // Pedidos parciais (Range), como o servidor de verdade: o player precisa deles para pular no áudio.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
    if (range) {
      const start = range[1] ? Number(range[1]) : Math.max(0, data.length - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
      res.writeHead(206, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${data.length}` });
      res.end(data.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, { "Content-Type": type, "Accept-Ranges": "bytes" });
    res.end(data);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8080);
  createDevServer().listen(port, "127.0.0.1", () => {
    console.log(`http://127.0.0.1:${port}${process.env.FORM_MOCK ? `  (formulário simulando: ${process.env.FORM_MOCK})` : ""}`);
  });
}
