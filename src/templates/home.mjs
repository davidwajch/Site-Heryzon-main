import { escapeHtml as e } from "../lib/markdown.mjs";
import { twoTone } from "./layout.mjs";

// Alturas (px) das barras de onda do painel da abertura, como na referência visual.
const WAVE_BARS = [18, 30, 44, 26, 52, 36, 22, 48, 60, 34, 20, 42, 56, 30, 46, 24, 38, 58, 28, 50, 32, 18, 40, 54, 26, 36, 22, 16];

const CONTROL_ICONS = [
  '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
];

const pad = (n) => String(n).padStart(2, "0");

const sectionHead = ({ eyebrow, title }, extra = "") =>
  `<div class="section-head${extra}"><p class="eyebrow">${e(eyebrow)}</p><h2 class="section-title">${twoTone(title)}</h2></div>`;

function hero(t) {
  const bars = WAVE_BARS.map((h, i) => `<span style="height:${h}px;animation-delay:${((i * 0.11) % 1.21).toFixed(2)}s"></span>`).join("");
  const rows = t.panel.rows
    .map(([strong, rest], i) => {
      const text = rest ? `<strong>${e(strong)}</strong> ${e(rest)}` : `<strong>${e(strong)}</strong>`;
      return `<li${i === t.panel.highlightedRow ? ' class="is-highlighted"' : ""}><span class="mono-num" aria-hidden="true">${pad(i + 1)}</span><span>${text}</span></li>`;
    })
    .join("");
  return `<section id="topo" class="container hero">
<div class="hero-copy">
<p class="eyebrow">${e(t.hero.eyebrow)}</p>
<h1 class="hero-title">${twoTone(t.hero.title)}</h1>
<p class="hero-subtitle">${e(t.hero.subtitle)}</p>
<div class="button-row">
<a class="btn btn-primary" href="#contato" data-interest="piloto">${e(t.hero.primary)}</a>
<a class="btn btn-secondary" href="#ouca"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 2.5v11l9-5.5z"/></svg>${e(t.hero.secondary)}</a>
</div>
<p class="hero-note">${e(t.hero.note)}</p>
</div>
<div class="call-panel">
<div class="call-panel-head">
<span class="call-panel-title" id="call-panel-title"><span class="live-dot" aria-hidden="true"></span>${e(t.panel.header)}</span>
<span class="badge">${e(t.panel.badge)}</span>
</div>
<div class="wave" aria-hidden="true">${bars}</div>
<ol class="call-steps">${rows}</ol>
<div class="call-panel-audio"><audio controls preload="none" src="/audio/bruno-apresentacao.mp3" aria-labelledby="call-panel-title"></audio></div>
</div>
</section>`;
}

function marquee(t) {
  const run = t.marquee.map((item) => `${e(item)} <span class="marquee-diamond">◆</span>`).join(" ");
  return `<div class="marquee">
<p class="visually-hidden">${e(t.marquee.join(" ◆ "))}</p>
<div class="marquee-track" aria-hidden="true"><span>${run}</span><span>${run}</span></div>
<button type="button" class="motion-toggle" aria-label="${e(t.a11y.animationPause)}" data-label-pause="${e(t.a11y.animationPause)}" data-label-resume="${e(t.a11y.animationResume)}"><span class="motion-toggle-icon" aria-hidden="true"></span></button>
</div>`;
}

function challenges(t) {
  const cards = t.challenges.items
    .map(([title, text], i) => `<li class="card"><span class="mono-num">${pad(i + 1)}</span><h3 class="card-title">${e(title)}</h3><p>${e(text)}</p></li>`)
    .join("");
  return `<section id="desafios" class="container section section-challenges">
${sectionHead(t.challenges)}
<ul class="card-row">${cards}</ul>
</section>`;
}

function flowNode(key, [title, text], extra = "") {
  return `<div class="flow-node${extra}" data-node="${key}"><span class="flow-node-title">${e(title)}</span><span class="flow-node-text">${e(text)}</span></div>`;
}

function how(t) {
  const f = t.how.flow;
  const steps = t.how.steps
    .map(
      ([title, text], i) =>
        `<li class="how-step" data-step="${i + 1}"><span class="mono-num" aria-hidden="true">${pad(i + 1)}</span><div><h3 class="card-title">${e(title)}</h3><p>${e(text)}</p></div></li>`,
    )
    .join("");
  return `<section id="como-funciona" class="band band-white">
<div class="container section">
${sectionHead(t.how)}
<div class="how-grid">
<div class="how-flow">
<div class="flow" role="img" aria-label="${e(f.label)}">
${flowNode("cliente", f.cliente, " flow-node-main")}
<span class="flow-line"></span>
${flowNode("triagem", f.triagem, " flow-node-main")}
<span class="flow-line flow-line-short"></span>
<span class="flow-split"></span>
<div class="flow-branches">
<div class="flow-branch">
<div class="flow-group">
<span class="flow-group-label">${e(f.resolveGroup)}</span>
${flowNode("kb", f.kb)}
${f.resolve.map((pair) => flowNode("resolve", pair)).join("\n")}
</div>
<span class="flow-line flow-line-grow"></span>
</div>
<div class="flow-branch">
<div class="flow-node flow-node-outside" data-node="humano"><span class="flow-group-label flow-group-label-muted">${e(f.outsideGroup)}</span><span class="flow-node-title">${e(f.humano[0])}</span><span class="flow-node-text">${e(f.humano[1])}</span></div>
<span class="flow-line flow-line-grow"></span>
</div>
</div>
<span class="flow-join"></span>
<span class="flow-line flow-line-short"></span>
${flowNode("registro", f.registro, " flow-node-main")}
</div>
</div>
<ol class="how-steps">${steps}</ol>
</div>
</div>
</section>`;
}

function does(t) {
  const cols = t.does.columns
    .map(([title, items], i) => `<li class="card does-card does-card-${i + 1}"><h3 class="card-title">${e(title)}</h3><ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul></li>`)
    .join("");
  return `<section id="o-que-faz" class="container section section-does">
${sectionHead(t.does)}
<ul class="card-row">${cols}</ul>
</section>`;
}

function helps(t) {
  const total = pad(t.helps.items.length);
  const cells = t.helps.items
    .map(([title, text], i) => `<li><span class="mono-num">${pad(i + 1)} / ${total}</span><h3 class="card-title">${e(title)}</h3><p>${e(text)}</p></li>`)
    .join("");
  return `<section id="onde-ajuda" class="container section section-helps">
${sectionHead(t.helps)}
<ul class="helps-grid">${cells}</ul>
</section>`;
}

function hear(t) {
  return `<section id="ouca" class="container section-hear">
<div class="hear">
<div class="hear-copy">
<p class="eyebrow">${e(t.hear.eyebrow)}</p>
<h2 class="section-title">${twoTone(t.hear.title)}</h2>
<p>${e(t.hear.text)}</p>
</div>
<div class="player">
<div class="player-head">
<span class="player-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" focusable="false"><path d="M12 3v18M7 8v8M17 8v8M3 11v2M21 11v2"/></svg></span>
<span class="player-titles"><span class="player-title" id="player-title">${e(t.hear.playerTitle)}</span><span class="player-subtitle">${e(t.hear.playerSubtitle)}</span></span>
</div>
<audio controls preload="none" src="/audio/bruno-apresentacao.mp3" aria-labelledby="player-title"></audio>
<p class="player-caption">${e(t.hear.caption)}</p>
</div>
</div>
</section>`;
}

function control(t) {
  const items = t.control.items
    .map(
      ([title, text], i) =>
        `<li class="card control-card"><span class="icon-tile" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">${CONTROL_ICONS[i]}</svg></span><div><h3 class="card-title">${e(title)}</h3><p>${e(text)}</p></div></li>`,
    )
    .join("");
  return `<section id="controle" class="container section-control">
${sectionHead(t.control)}
<ul class="control-grid">${items}</ul>
</section>`;
}

function pilot(t) {
  const steps = t.pilot.steps.map((step, i) => `<li><span class="step-circle" aria-hidden="true">${pad(i + 1)}</span><span>${e(step)}</span></li>`).join("");
  return `<section id="piloto" class="band band-pilot">
<div class="container section pilot-grid">
<div class="pilot-copy">
<p class="eyebrow">${e(t.pilot.eyebrow)}</p>
<h2 class="section-title">${twoTone(t.pilot.title)}</h2>
<p>${e(t.pilot.text)}</p>
<a class="btn btn-dark" href="#contato" data-interest="piloto">${e(t.pilot.cta)}</a>
</div>
<ol class="pilot-steps">${steps}</ol>
</div>
</section>`;
}

function investors(t) {
  return `<section id="investidores" class="container section-investors">
<div class="investors">
<div class="investors-copy">
<p class="eyebrow">${e(t.investors.eyebrow)}</p>
<h2 class="investors-title">${twoTone(t.investors.title)}</h2>
<p>${e(t.investors.text)}</p>
</div>
<a class="btn btn-outline" href="#contato" data-interest="investimento">${e(t.investors.cta)} <span aria-hidden="true">→</span></a>
</div>
</section>`;
}

function faq(t) {
  const items = t.faq.items
    .map(([q, a]) => `<details class="faq-item"><summary><span>${e(q)}</span><span class="faq-icon" aria-hidden="true">+</span></summary><p>${e(a)}</p></details>`)
    .join("\n");
  return `<section id="perguntas" class="container section section-faq">
${sectionHead(t.faq, " section-head-center")}
<div class="faq-list">
${items}
</div>
</section>`;
}

function field({ id, label, control, wide = false, required = false }) {
  const marker = required ? '<span class="required-mark" aria-hidden="true">*</span>' : "";
  return `<div class="field${wide ? " field-wide" : ""}"><label for="${id}">${e(label)}${marker}</label>${control}</div>`;
}

function contact(t) {
  const c = t.contact;
  const options = (list) => list.map(([value, label]) => `<option value="${value}">${e(label)}</option>`).join("");
  const lang = t.lang === "en" ? "en" : "pt";
  return `<section id="contato" class="band band-white band-contact">
<div class="container section contact-grid">
<div class="contact-copy">
<p class="eyebrow">${e(c.eyebrow)}</p>
<h2 class="contact-title">${e(c.title)}</h2>
<p>${e(c.text)}</p>
</div>
<div class="contact-form-wrap">
<form id="contact-form" class="contact-form" action="/enviar.php" method="post" data-success="${e(c.success)}" data-error="${e(c.error)}">
${field({ id: "f-name", label: c.fields.name, required: true, control: '<input id="f-name" type="text" name="name" autocomplete="name" maxlength="200" pattern=".*\\S.*" required>' })}
${field({ id: "f-email", label: c.fields.email, required: true, control: '<input id="f-email" type="email" name="email" autocomplete="email" spellcheck="false" maxlength="200" pattern="[^@\\s]+@[^@\\s]+\\.[^@\\s]+" required>' })}
${field({ id: "f-company", label: c.fields.company, control: '<input id="f-company" type="text" name="company" autocomplete="organization" maxlength="200">' })}
${field({ id: "f-industry", label: c.fields.industry, control: '<input id="f-industry" type="text" name="industry" maxlength="200">' })}
${field({ id: "f-volume", label: c.fields.volume, control: `<select id="f-volume" name="volume"><option value="">—</option>${options(c.volumeOptions)}</select>` })}
${field({ id: "f-interest", label: c.fields.interest, control: `<select id="f-interest" name="interest">${options(c.interestOptions)}</select>` })}
${field({ id: "f-message", label: c.fields.message, wide: true, control: '<textarea id="f-message" name="message" rows="4" maxlength="5000"></textarea>' })}
<input type="hidden" name="lang" value="${lang}">
<div class="hp-field" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" type="text" name="website" tabindex="-1" autocomplete="off"></div>
<div class="form-actions">
<button type="submit" class="btn btn-primary"><span class="spinner" aria-hidden="true"></span>${e(c.submit)}</button>
<p class="consent">${e(c.consent[0])}<a href="${t.paths.privacy}">${e(c.consent[1])}</a>${e(c.consent[2])}</p>
</div>
<p class="form-error" role="alert" hidden></p>
</form>
<p class="form-success" role="status" tabindex="-1" hidden></p>
</div>
</div>
</section>`;
}

export function home(t) {
  return [hero(t), marquee(t), challenges(t), how(t), does(t), helps(t), hear(t), control(t), pilot(t), investors(t), faq(t), contact(t)].join("\n");
}
