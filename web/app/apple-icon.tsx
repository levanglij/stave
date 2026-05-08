import { ImageResponse } from "next/og";

// Apple-touch-icon for iOS / macOS Safari home-screen + bookmarks.
// 180×180 PNG generated at build time from JSX — matches the SVG
// favicon at app/icon.svg but in the format iOS prefers.

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050816",
          borderRadius: 36,
        }}
      >
        {/* Five staff lines + a single rated note — same brand mark
            as app/icon.svg, scaled up for iOS. */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            transform="translate(6, 8)"
            stroke="#F8FAFC"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          >
            <line x1="0" y1="0" x2="20" y2="0" />
            <line x1="0" y1="4" x2="20" y2="4" />
            <line x1="0" y1="8" x2="20" y2="8" />
            <line x1="0" y1="12" x2="20" y2="12" />
            <line x1="0" y1="16" x2="20" y2="16" />
          </g>
          <circle cx="22" cy="14" r="3" fill="#34D399" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
