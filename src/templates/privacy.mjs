import { markdownToHtml } from "../lib/markdown.mjs";

export function privacy({ markdown, email }) {
  const html = markdownToHtml(markdown).replaceAll(email, `<a href="mailto:${email}">${email}</a>`);
  return `<article class="container legal">
${html}
</article>`;
}
