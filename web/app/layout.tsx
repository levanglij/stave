import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavHeader } from "@/components/nav-header";
import { Footer } from "@/components/footer";
import { WalletProviders } from "@/components/wallet-providers";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

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
  title: "Stave — Music royalties, made investable",
  description:
    "Stave transforms verified music catalogs into investable royalty assets, built on Solana, partnered with the Intellectual Property Owners Association (IPOA) — Georgia’s official music rights organization — for verified royalty data.",
  metadataBase: new URL("https://stave.cc"),
  openGraph: {
    title: "Stave — Music royalties, made investable",
    description:
      "Transparent grading, fractional shares, sub-cent royalty distribution. Built on Solana.",
    type: "website",
    siteName: "Stave",
    url: "https://stave.cc",
    locale: "en_US",
  },
  // Twitter cards mirror Open Graph but X uses its own meta keys.
  // summary_large_image upgrades the preview from a tiny thumbnail
  // (the default "summary" card) to a full-width banner.
  twitter: {
    card: "summary_large_image",
    title: "Stave — Music royalties, made investable",
    description:
      "Transparent grading, fractional shares, sub-cent royalty distribution. Built on Solana.",
  },
  // Canonical link prevents duplicate-content penalties when Google
  // sees both stave.cc and stave-five.vercel.app serving the same HTML.
  alternates: {
    canonical: "https://stave.cc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <WalletProviders>
          <DisclaimerBanner />
          <NavHeader />
          <div className="flex-1">{children}</div>
          <Footer />
        </WalletProviders>
      </body>
    </html>
  );
}
