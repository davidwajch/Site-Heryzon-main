import { escapeHtml as e } from "../lib/markdown.mjs";

export const SITE_URL = "https://heryzon.com.br";

export const diamond = (size = 18) =>
  `<svg class="diamond" width="${size}" height="${size}" viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="3" y="3" width="12" height="12" rx="2" transform="rotate(45 9 9)"/></svg>`;

// "Texto. [Trecho cinza.]" -> o trecho entre colchetes vira o span cinza.
export const twoTone = (title) => e(title).replace(/\[(.+?)\]/, '<span class="title-muted">$1</span>');

// Quem escolheu inglês e abre uma página em português vai direto para a versão em inglês.
// Roda no <head> para não piscar o português antes do redirecionamento.
const preferenceRedirect = (enPath) =>
  `<script>try{if(localStorage.getItem("heryzon-lang")==="en")location.replace(${JSON.stringify(enPath)}+location.hash)}catch(_){}</script>`;

function head({ t, title, description, alternates, assets }) {
  const self = alternates[t.lang === "en" ? "en" : "pt"];
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add("js")</script>
${t.lang === "pt-BR" ? preferenceRedirect(alternates.en) + "\n" : ""}<title>${e(title)}</title>
<meta name="description" content="${e(description)}">
<link rel="canonical" href="${SITE_URL}${self}">
<link rel="alternate" hreflang="pt-BR" href="${SITE_URL}${alternates.pt}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${alternates.en}">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${alternates.pt}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Heryzon">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(description)}">
<meta property="og:url" content="${SITE_URL}${self}">
<meta property="og:locale" content="${t.ogLocale}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#F7F9FA">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css?v=${assets.css}">
<script src="/assets/main.js?v=${assets.js}" defer></script>
</head>`;
}

function langSwitch({ t, alternates, className = "lang-switch" }) {
  const item = (code, hreflang) => {
    const current = (code === "en") === (t.lang === "en");
    return `<a href="${alternates[code]}" hreflang="${hreflang}" lang="${hreflang}" data-lang-switch="${code}" aria-label="${t.a11y.languages[code]}"${current ? ' aria-current="page"' : ""}>${code.toUpperCase()}</a>`;
  };
  return `<div class="${className}">${item("pt", "pt-BR")}<span aria-hidden="true">/</span>${item("en", "en")}</div>`;
}

function header({ t, alternates, onHome }) {
  const base = onHome ? "" : t.paths.home;
  const links = t.nav.links.map(([id, label]) => `<li><a href="${base}#${id}">${e(label)}</a></li>`).join("");
  return `<header class="site-header">
<div class="container header-inner">
<a class="brand" href="${base}#topo">${diamond()}<span class="brand-word" translate="no">HERYZON</span></a>
<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav" data-label-open="${e(t.a11y.menuOpen)}" data-label-close="${e(t.a11y.menuClose)}"><span class="menu-toggle-icon" aria-hidden="true"></span><span class="menu-toggle-label">${e(t.a11y.menuOpen)}</span></button>
<nav class="main-nav" id="main-nav" aria-label="${e(t.a11y.mainNav)}"><ul>${links}</ul></nav>
<div class="header-actions">
${langSwitch({ t, alternates })}
<a class="btn btn-primary btn-compact" href="${base}#contato" data-interest="piloto">${e(t.nav.cta)}</a>
</div>
</div>
</header>`;
}

function footer({ t, alternates, onHome }) {
  const base = onHome ? "" : t.paths.home;
  return `<footer class="site-footer">
<div class="container footer-inner">
<span class="footer-brand">${diamond(16)}<span class="brand-word" translate="no">HERYZON</span><span class="footer-product" translate="no">· Vozzi</span></span>
<nav class="footer-nav" aria-label="${e(t.a11y.footerNav)}">
<a href="${t.paths.privacy}">${e(t.footer.privacy)}</a>
<a href="${base}#contato">${e(t.footer.contact)}</a>
${langSwitch({ t, alternates, className: "lang-switch lang-switch-footer" })}
</nav>
<span class="footer-rights">${e(t.footer.rights)}</span>
</div>
</footer>`;
}

export function layout({ t, pageKey, title, description, alternates, assets, body }) {
  const onHome = pageKey === "home";
  return `<!doctype html>
<html lang="${t.lang}">
${head({ t, title, description, alternates, assets })}
<body>
<a class="skip-link" href="#conteudo">${e(t.a11y.skipLink)}</a>
${header({ t, alternates, onHome })}
<main id="conteudo">
${body}
</main>
${footer({ t, alternates, onHome })}
</body>
</html>
`;
}
