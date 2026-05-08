import { ImageResponse } from "next/og";

// Open Graph card for stave.cc — what shows up when the URL is
// shared in Twitter / LinkedIn / Slack / iMessage / Discord.
// Generated as a 1200×630 PNG at build time. Pure JSX-to-image, no
// external assets, no font loading — keeps the build fast and
// guarantees the image renders identically every time.

export const runtime = "edge";

export const alt =
  "Stave — Music royalties, made investable. Solana Frontier Hackathon 2026.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(80rem 60rem at 75% 40%, rgba(16,185,129,0.18), transparent 65%), #050816",
          padding: "72px 80px",
          color: "#F8FAFC",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {/* Top row — wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#34D399",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {/* Mini staff-lines glyph */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 2,
                  background: "#34D399",
                  opacity: 0.65,
                }}
              />
            ))}
          </div>
          STAVE
        </div>

        {/* Center row — main copy */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#F8FAFC",
              maxWidth: 980,
            }}
          >
            Music royalties,
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#34D399",
              maxWidth: 980,
            }}
          >
            made investable.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              marginTop: 32,
              maxWidth: 920,
              lineHeight: 1.4,
            }}
          >
            A marketplace for tokenized music royalties on Solana.
            Verified by IPOA · graded transparently · settled on-chain.
          </div>
        </div>

        {/* Bottom row — meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#64748b",
            fontSize: 22,
            fontFamily:
              "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
          }}
        >
          <div>stave.cc</div>
          <div>Solana Frontier Hackathon 2026</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
