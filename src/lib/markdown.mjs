// Conversor mínimo para o subconjunto de markdown usado na política de privacidade:
// títulos, parágrafos, **negrito**, listas com "- " e tabelas com cabeçalho.

export function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function cells(row) {
  return row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function renderBlock(lines) {
  const first = lines[0];

  const heading = first.match(/^(#{1,3})\s+(.*)$/);
  if (heading && lines.length === 1) {
    const level = heading[1].length;
    return `<h${level}>${inline(heading[2])}</h${level}>`;
  }

  if (lines.every((line) => line.startsWith("- "))) {
    return `<ul>\n${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("\n")}\n</ul>`;
  }

  if (first.startsWith("|") && lines.length >= 2 && /^\|[\s|:-]+\|$/.test(lines[1].trim())) {
    const head = cells(first).map((cell) => `<th scope="col">${inline(cell)}</th>`).join("");
    const body = lines
      .slice(2)
      .map((row) => `<tr>${cells(row).map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
      .join("\n");
    return `<div class="table-wrap"><table>\n<thead><tr>${head}</tr></thead>\n<tbody>\n${body}\n</tbody>\n</table></div>`;
  }

  return `<p>${inline(lines.join(" "))}</p>`;
}

export function markdownToHtml(markdown) {
  const blocks = [];
  let current = [];
  for (const line of markdown.split("\n")) {
    if (line.trim() === "" || line.trim() === "---") {
      if (current.length) blocks.push(current);
      current = [];
    } else if (/^#{1,3}\s/.test(line)) {
      if (current.length) blocks.push(current);
      blocks.push([line]);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);
  return blocks.map(renderBlock).join("\n");
}
