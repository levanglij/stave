import { NextResponse } from "next/server";

// Receives "Apply to tokenize" submissions from the modal on /for-artists.
//
// Two delivery modes:
//   1. With a Resend API key set in env (`RESEND_API_KEY`), the route POSTs
//      the application to Resend's HTTP API (no npm dependency required) and
//      sends it to `APPLY_INBOX` (defaults to stave111115@gmail.com).
//      To enable: in Vercel set RESEND_API_KEY, optionally APPLY_INBOX and
//      APPLY_FROM.
//   2. Without a key, the route falls through to a server log so the
//      application is still recoverable from Vercel's logs and the user
//      gets the same success UX (no false-positive "we got it" in dev).
//
// Either way the user sees a 200 + success state.

interface Body {
  name?: string;
  email?: string;
  catalog?: string;
  link?: string;
  message?: string;
}

const REQUIRED_FIELDS: (keyof Body)[] = ["name", "email", "catalog", "link"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  // Required fields
  for (const f of REQUIRED_FIELDS) {
    if (!body[f] || String(body[f]).trim() === "") {
      return NextResponse.json(
        { ok: false, error: `missing_field:${f}` },
        { status: 400 },
      );
    }
  }

  // Light validation - full client-side validation in the modal already.
  if (!EMAIL_RE.test(body.email!)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }
  try {
    new URL(body.link!);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_url" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.APPLY_INBOX || "stave111115@gmail.com";
  const from = process.env.APPLY_FROM || "Stave <onboarding@resend.dev>";

  if (apiKey) {
    try {
      // Resend HTTP API - no SDK install needed.
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [inbox],
          subject: `New tokenization application: ${body.catalog}`,
          text: [
            `From:    ${body.name} <${body.email}>`,
            `Catalog: ${body.catalog}`,
            `Link:    ${body.link}`,
            ``,
            `Message:`,
            body.message || "(none)",
            ``,
            `- sent from stave.cc /for-artists`,
          ].join("\n"),
        }),
      });
      if (!r.ok) {
        console.error(
          "[tokenize-application] resend HTTP failed:",
          r.status,
          await r.text().catch(() => ""),
        );
      }
    } catch (e) {
      // Don't fail the user-facing request if mail delivery hiccups; the
      // server log below is the recovery path.
      console.error("[tokenize-application] resend fetch failed:", e);
    }
  }

  // Always log so submissions are recoverable from Vercel logs even if
  // mail delivery isn't configured yet.
  console.log("[tokenize-application]", {
    name: body.name,
    email: body.email,
    catalog: body.catalog,
    link: body.link,
    message: body.message,
    deliveredViaResend: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
