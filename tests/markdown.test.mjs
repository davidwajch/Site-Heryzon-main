import { test } from "node:test";
import assert from "node:assert/strict";
import { markdownToHtml } from "../src/lib/markdown.mjs";

test("headings and paragraphs", () => {
  assert.equal(
    markdownToHtml("# Título\n\n## 1. Quem somos\n\nTexto corrido\nna mesma linha."),
    "<h1>Título</h1>\n<h2>1. Quem somos</h2>\n<p>Texto corrido na mesma linha.</p>",
  );
});

test("bold inline", () => {
  assert.equal(markdownToHtml("A Heryzon é a **controladora** dos dados."), "<p>A Heryzon é a <strong>controladora</strong> dos dados.</p>");
});

test("escapes html", () => {
  assert.equal(markdownToHtml("a < b & c"), "<p>a &lt; b &amp; c</p>");
});

test("unordered list", () => {
  assert.equal(markdownToHtml("- nome;\n- e-mail;"), "<ul>\n<li>nome;</li>\n<li>e-mail;</li>\n</ul>");
});

test("pipe table with header row", () => {
  const md = "| Dados | Prazo |\n| --- | --- |\n| Registros | 6 meses |";
  assert.equal(
    markdownToHtml(md),
    '<div class="table-wrap"><table>\n<thead><tr><th scope="col">Dados</th><th scope="col">Prazo</th></tr></thead>\n<tbody>\n<tr><td>Registros</td><td>6 meses</td></tr>\n</tbody>\n</table></div>',
  );
});
