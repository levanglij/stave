import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stave — Rating infrastructure for music royalty assets",
  description:
    'Stave is the rating-and-financing infrastructure for music royalty assets — a "Moody\u2019s of music" — built on Solana, with the founding team\u2019s PRO ownership as the structural data moat.',
  metadataBase: new URL("https://stave.app"),
  openGraph: {
    title: "Stave — Rating infrastructure for music royalty assets",
    description:
      'A "Moody\u2019s of music" built on Solana. Standardized RRE ratings, fractional shares, sub-cent royalty distribution.',
    type: "website",
    siteName: "Stave",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
