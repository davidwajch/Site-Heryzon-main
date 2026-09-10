import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Heryzon | Vozzi",
    template: "%s | Heryzon",
  },
  description:
    "Agentes de voz com inteligência artificial para reduzir tempo, custo e abandono no atendimento hospitalar.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Heryzon | Vozzi",
    description:
      "Agentes de voz com inteligência artificial para atendimento hospitalar.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Heryzon | Vozzi",
    description:
      "Agentes de voz com inteligência artificial para atendimento hospitalar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="teal">
      <body>{children}</body>
    </html>
  );
}
