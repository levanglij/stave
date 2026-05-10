import { ImageResponse } from "next/og";
import { getListing, RATINGS } from "@/lib/ratings";
import { getHeadlineStats } from "@/lib/headline-stats";
import { compactUsd, pct, TIER_COLOR } from "@/lib/format";

export const runtime = "edge";

export const alt =
  "Stave catalog listing - Open Graph preview with grade, title, and headline stats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(RATINGS).map((id) => ({ id }));
}

interface PageProps {
  params: { id: string };
}

export default async function CatalogOgImage({ params }: PageProps) {
  const listing = getListing(params.id);

  // Defensive fallback - if someone hits an unknown id directly, render
  // a generic Stave card rather than 500ing the OG endpoint.
  if (!listing) return GenericFallback();

  const stats = getHeadlineStats(listing);
  const tierColor = TIER_COLOR[listing.rating] ?? "#34D399";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(80rem 60rem at 75% 40%, rgba(16,185,129,0.18), transparent 65%), #050816",
          color: "#F8FAFC",
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Top row: STAVE wordmark + grade chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: "#34D399",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 2,
                    background: "#34D399",
                    opacity: 0.65,
                  }}
                />
              ))}
            </div>
            STAVE
          </div>

          {/* Grade chip - outlined pill, color-coded to the tier. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 32,
              fontWeight: 700,
              color: tierColor,
              border: `2px solid ${tierColor}`,
              borderRadius: 999,
              padding: "10px 24px",
              letterSpacing: "0.12em",
            }}
          >
            {listing.rating}
          </div>
        </div>

        {/* Center: gradient cover square + title block side-by-side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            flex: 1,
            marginTop: 24,
          }}
        >
          {/* Gradient cover with initials - same gradient as the
              marketplace card so the share preview reads as the same
              identity. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 280,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${listing.grad[0]}, ${listing.grad[1]})`,
              fontSize: 88,
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.04em",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            {listing.initials}
          </div>

          {/* Title + artist + headline stats */}
          <div
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            <div
              style={{
                fontSize: 28,
                color: "#94a3b8",
                marginBottom: 12,
              }}
            >
              {listing.artist}
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 700,
                lineHeight: 1.02,
                color: "#F8FAFC",
                marginBottom: 32,
              }}
            >
              {listing.title}
            </div>

            {/* Headline-stat row: FMV + 5yr ROI + LTV */}
            <div style={{ display: "flex", gap: 48 }}>
              <Stat label="FMV" value={compactUsd(stats.fmv)} />
              <Stat
                label="5yr ROI"
                value={pct(stats.roi5yr, 1)}
                tone="#34D399"
              />
              <Stat
                label="LTV"
                value={pct(listing.ltv_recommended, 0)}
              />
            </div>
          </div>
        </div>

        {/* Bottom: domain + tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#64748b",
            fontSize: 20,
            fontFamily:
              "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
          }}
        >
          <div>stave.cc</div>
          <div>Music royalties, made investable</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

function Stat({
  label,
  value,
  tone = "#F8FAFC",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontSize: 14,
          color: "#64748b",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: tone,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// Same shape as the global OG card. Used when the route is hit with
// an unknown id - the catalog-shaped layout would 500 without listing
// data, so we degrade to the homepage card design.
function GenericFallback() {
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#F8FAFC",
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
            }}
          >
            made investable.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
    { ...size },
  );
}
