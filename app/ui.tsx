import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "./contact-info";

const navItems = [
  { label: "Problema", href: "/#problema" },
  { label: "Solução", href: "/#solucao" },
  { label: "Demonstração em áudio", href: "/#video-mvp" },
];

export function Logo() {
  return (
    <Link className="wordmark" href="/" aria-label="Heryzon home">
      <span aria-hidden="true" />
      HERYZON
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-primary header-cta" href="/#contato">
          Falar com os founders
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Abrir menu">
            <span />
            <span />
          </summary>
          <div>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/#contato">Falar com os founders</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Desenvolvemos agentes de voz com inteligência artificial para
            reduzir tempo, custo e abandono no atendimento hospitalar.
          </p>
        </div>
        <nav aria-label="Links do rodapé">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
        </nav>
      </div>
    </footer>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "inverse";
}) {
  const className = `button button-${variant}`;
  const content = (
    <>
      {children}
      <span aria-hidden="true">→</span>
    </>
  );

  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}

export function Waveform() {
  const bars = [
    18, 34, 62, 78, 42, 56, 88, 70, 38, 24, 48, 74, 92, 54, 32, 66, 80, 44,
    58, 28, 40, 72, 86, 52,
  ];

  return (
    <div className="waveform" aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          style={{ "--bar-height": `${height}%` } as CSSProperties}
        />
      ))}
    </div>
  );
}
