// Chrome sem interface, controlado pelo DevTools Protocol via pipe (--remote-debugging-pipe),
// para testar o JavaScript do site sem instalar dependências.

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ...["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"].map(
    (name) => spawnSync("which", [name], { encoding: "utf8" }).stdout?.trim(),
  ),
];

export const chromePath = CANDIDATES.find((file) => file && existsSync(file)) ?? null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launchBrowser() {
  const userDataDir = await mkdtemp(path.join(tmpdir(), "heryzon-chrome-"));
  const proc = spawn(
    chromePath,
    ["--headless=new", "--remote-debugging-pipe", "--no-first-run", "--no-default-browser-check", `--user-data-dir=${userDataDir}`, "about:blank"],
    { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] },
  );
  let stderr = "";
  proc.stderr.setEncoding("utf8");
  proc.stderr.on("data", (chunk) => {
    stderr = (stderr + chunk).slice(-2000);
  });
  const exited = new Promise((resolve) => proc.once("exit", resolve));

  let lastId = 0;
  let buffer = "";
  const pending = new Map();
  proc.stdio[4].setEncoding("utf8");
  proc.stdio[4].on("data", (chunk) => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf("\0")) >= 0) {
      const message = JSON.parse(buffer.slice(0, end));
      buffer = buffer.slice(end + 1);
      const waiting = pending.get(message.id);
      if (!waiting) continue;
      pending.delete(message.id);
      if (message.error) waiting.reject(new Error(message.error.message));
      else waiting.resolve(message.result);
    }
  });

  // Se o Chrome fechar ou não responder, o teste falha com a mensagem em vez de travar.
  proc.once("exit", (code) => {
    for (const waiting of pending.values()) waiting.reject(new Error(`o Chrome fechou (código ${code}): ${stderr.trim()}`));
    pending.clear();
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++lastId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`o Chrome não respondeu a ${method} em 15 s: ${stderr.trim()}`));
      }, 15000);
      pending.set(id, {
        resolve: (value) => (clearTimeout(timer), resolve(value)),
        reject: (error) => (clearTimeout(timer), reject(error)),
      });
      proc.stdio[3].write(`${JSON.stringify({ id, method, params, sessionId })}\0`);
    });

  return {
    async newPage({ width, height }) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);

      const evaluate = async (expression) => {
        const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
        if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
        return result.result.value;
      };

      return {
        evaluate,
        async goto(url) {
          await send("Page.navigate", { url }, sessionId);
          for (let i = 0; i < 200; i++) {
            // Durante a troca de página o contexto antigo some e a avaliação falha; tenta de novo.
            const ready = await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState === "complete"`).catch(() => false);
            if (ready) return;
            await sleep(25);
          }
          throw new Error(`a página não carregou: ${url}`);
        },
        // Rola sem animação e espera dois quadros, para os handlers de scroll rodarem.
        scrollTo: (top) =>
          evaluate(`window.scrollTo({ top: ${top}, behavior: "instant" }); new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))`),
        close: () => send("Target.closeTarget", { targetId }),
      };
    },
    async close() {
      if (proc.exitCode === null) proc.kill();
      await exited;
      // Os processos auxiliares do Chrome ainda gravam no perfil por um instante depois de fechar.
      await rm(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    },
  };
}
